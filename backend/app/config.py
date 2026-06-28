import os
import json
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# App configuration
HOST = os.getenv("HOST", "0.0.0.0")
PORT = int(os.getenv("PORT", "8000"))

# CORS settings
origins_raw = os.getenv("CORS_ORIGINS")
if origins_raw:
    try:
        CORS_ORIGINS = json.loads(origins_raw)
    except Exception:
        CORS_ORIGINS = [origins_raw]
else:
    CORS_ORIGINS = ["*"]

# AI Config
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")

# Verify critical configurations
if not GEMINI_API_KEY:
    print("WARNING: GEMINI_API_KEY is not set. AI operations will fail.")
