import os
from dotenv import load_dotenv
from pytube import YouTube
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

load_dotenv()

OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
YOUTUBE_VIDEO = 'https://www.youtube.com/watch?v=YOyr9Bhhaq0'


def transcribe_youtube_video(video_link, whisper_model_size):
    youtube = YouTube(video_link)
    audio = youtube.streams.filter(only_audio=True).first()

    whisperx_model = whisperx.load_model(whisper_model_size, device='cuda', compute_type='float16')

    with tempfile.TemporaryDirectory() as tmpdir:
        file = audio.download(output_path=tmpdir)
        print(f'Downloaded file path: {file}')
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
    vectorstore = DocArrayInMemorySearch.from_documents(document_chunks, embedding=embeddings)
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