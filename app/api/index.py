from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Literal
import hashlib

from ._engine.ragsum import *

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class TranscribeRequest(BaseModel):
    video_url: str
    summary_detail: Literal['brief', 'medium', 'detailed'] = 'medium'

class TranscribeResponse(BaseModel):
    success: bool
    summary: list[str]
    message: str
    video_id: str

class QuestionRequest(BaseModel):
    question: str
    video_id: str

class QuestionResponse(BaseModel):
    answer: str


@app.post('/api/getvideolink')
def get_youtube_link(video_link: str):
    return video_link 


@app.post('/api/transcribe', response_model=TranscribeResponse)
def transcribe_and_summarize(request: TranscribeRequest):
    try:
        video_id = hashlib.md5(request.video_url.encode()).hexdigest()
        video_transcription = transcribe_youtube_video(request.video_url, 'large-v3')
        summary_points = generate_summary(video_transcription, request.summary_detail)
        chunks = transcript_to_chunks('transcription.txt', chunk_size=1000, chunk_overlap=200)
        vector_store = store_embeddings(chunks)
        save_vectorstore(vector_store, video_id)

        return TranscribeResponse(
            success=True,
            summary=summary_points,
            message="Video transcribed and summarized successfully",
            video_id=video_id
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post('/api/ask', response_model=QuestionResponse)
def ask_question(request: QuestionRequest):
    try:
        vectorstore = load_vectorstore(request.video_id)
        answer = retrive_from_embeddings(vectorstore, "gpt-3.5-turbo", request.question)
        return QuestionResponse(answer=answer)
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))