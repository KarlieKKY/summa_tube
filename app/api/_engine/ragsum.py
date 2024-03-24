import os
from dotenv import load_dotenv
from pytube import YouTube
import whisperx
import tempfile

load_dotenv()

OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
YOUTUBE_VIDEO = 'https://www.youtube.com/watch?v=YOyr9Bhhaq0'


def transcribe_youtube_video(video_link, model):
    youtube = YouTube(video_link)
    audio = youtube.streams.filter(only_audio=True).first()

    whisperx_model = whisperx.load_model(model, device='cuda', compute_type='float16')

    with tempfile.TemporaryDirectory() as tmpdir:
        file = audio.download(output_path=tmpdir)
        print(f'Downloaded file path: {file}')
        transcription_result = whisperx_model.transcribe(file, batch_size=16)
        transcription = " ".join([segment["text"] for segment in transcription_result["segments"]])

        with open ("transcription.txt", "w") as trans_file:
            trans_file.write(transcription)

    return transcription