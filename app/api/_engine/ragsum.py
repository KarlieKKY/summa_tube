import os
from dotenv import load_dotenv
from pytubefix import YouTube
import whisperx
import tempfile
from langchain_community.document_loaders import TextLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import DocArrayInMemorySearch
from langchain_openai import OpenAIEmbeddings
from langchain_core.runnables import RunnableParallel, RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser
from langchain_openai.chat_models import ChatOpenAI
from langchain.prompts import ChatPromptTemplate
from langchain_community.vectorstores import FAISS
from pathlib import Path

load_dotenv()

OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
VECTORSTORE_DIR = Path("vectorstores")
VECTORSTORE_DIR.mkdir(exist_ok=True)

def transcribe_youtube_video(video_link, whisper_model_size):
    youtube = YouTube(video_link)
    audio = youtube.streams.get_audio_only()

    whisperx_model = whisperx.load_model(whisper_model_size, device='cuda', compute_type='float16')

    with tempfile.TemporaryDirectory() as tmpdir:
        file = audio.download(output_path=tmpdir)
        transcription_result = whisperx_model.transcribe(file, batch_size=16)
        transcription = " ".join([segment["text"] for segment in transcription_result["segments"]])

        with open ("transcription.txt", "w") as trans_file:
            trans_file.write(transcription)

    return transcription


def transcript_to_chunks(transcript, chunk_size, chunk_overlap):
    loader = TextLoader(transcript)
    text_documents = loader.load()
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=chunk_size, chunk_overlap=chunk_overlap)
    document_chunks = text_splitter.split_documents(text_documents)

    return document_chunks


def store_embeddings(document_chunks):
    embeddings = OpenAIEmbeddings(openai_api_key=OPENAI_API_KEY)
    vectorstore = FAISS.from_documents(document_chunks, embedding=embeddings)
    return vectorstore 


def retrive_from_embeddings(vectorstore, openai_model, user_question):
    retriever1 = vectorstore.as_retriever()
    setup = RunnableParallel(context=retriever1, question=RunnablePassthrough())
    parser = StrOutputParser()
    model = ChatOpenAI(openai_api_key=OPENAI_API_KEY, model=openai_model if openai_model else "gpt-3.5-turbo")
    template = """
    Answer the question based on the context below. If you can't 
    answer the question, reply "I don't know".

    Context: {context}

    Question: {question}
    """

    prompt = ChatPromptTemplate.from_template(template)
    chain = setup | prompt | model | parser

    return chain.invoke(user_question)


def save_vectorstore(vectorstore, video_id: str):
    save_path = VECTORSTORE_DIR / video_id
    vectorstore.save_local(str(save_path))


def load_vectorstore(video_id: str):
    load_path = VECTORSTORE_DIR / video_id
    if not load_path.exists():
        raise FileNotFoundError(f"Vectorstore not found for video_id: {video_id}")
    
    embeddings = OpenAIEmbeddings(openai_api_key=OPENAI_API_KEY)
    vectorstore = FAISS.load_local(
        str(load_path), 
        embeddings, 
        allow_dangerous_deserialization=True
    )
    return vectorstore


def generate_summary(transcription: str, detail_level: str) -> list[str]:    
    model = ChatOpenAI(openai_api_key=OPENAI_API_KEY, model="gpt-3.5-turbo")
    
    prompts = {
        'brief': """
        Summarize the following video transcription in 2-3 key bullet points.
        Be concise and focus only on the most important takeaways.
        
        Transcription:
        {transcription}
        
        Return only the bullet points, one per line, without bullet symbols.
        """,
        'medium': """
        Summarize the following video transcription in 4-5 main bullet points.
        Cover the key topics and main arguments presented.
        
        Transcription:
        {transcription}
        
        Return only the bullet points, one per line, without bullet symbols.
        """,
        'detailed': """
        Summarize the following video transcription in 6-8 comprehensive bullet points.
        Include introduction, main points with context, examples, and conclusion.
        
        Transcription:
        {transcription}
        
        Return only the bullet points, one per line, without bullet symbols.
        """
    }
    
    template = prompts[detail_level]
    prompt = ChatPromptTemplate.from_template(template)
    parser = StrOutputParser()
    
    chain = prompt | model | parser
    summary_text = chain.invoke({"transcription": transcription})
    summary_points = [point.strip() for point in summary_text.strip().split('\n') if point.strip()]
    return summary_points