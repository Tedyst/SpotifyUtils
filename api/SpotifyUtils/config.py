from dotenv import load_dotenv
from pathlib import Path
import os

env_path = Path('../')

load_dotenv(dotenv_path=env_path)

SECRET_KEY = os.getenv("SECRET_KEY") or "debug"
SPOTIFY_CLIENT_ID = os.getenv("SPOTIFY_CLIENT_ID") or ""
SPOTIFY_CLIENT_SECRET = os.getenv("SPOTIFY_CLIENT_SECRET") or ""
GENIUS_TOKEN = os.getenv("GENIUS_TOKEN") or ""
SCOPE = "user-library-read playlist-read-private playlist-read-collaborative"
