from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from ._engine.ragsum import *


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# youtube link
# conversation: 



@app.get("/api/python")
def hello_world():
    return {"message": "Hello World"}


# @app.post('/api/getvideolink')
# def get_youtube_link(video_link: str):
#     return video_link 

# @app.post('/api/summarization')
# def get_youtube_summarize():
#     YOUTUBE_VIDEO = 'https://www.youtube.com/watch?v=YOyr9Bhhaq0'
#     video_transcription = transcribe_youtube_video(YOUTUBE_VIDEO, 'large-v3')
    
#     return  