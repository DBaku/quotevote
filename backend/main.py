from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from groq import Groq # pyright: ignore[reportMissingImports]
import json
import os
from dotenv import load_dotenv # pyright: ignore[reportMissingImports] # <-- NEU

# Lädt die .env Datei
load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# HIER IST DIE ÄNDERUNG:
# Wir holen den Key sicher aus dem System
api_key = os.getenv("GROQ_API_KEY")

if not api_key:
    raise ValueError("Kein GROQ_API_KEY gefunden!")

client = Groq(api_key=api_key)

class TextRequest(BaseModel):
    text: str

class SentimentResponse(BaseModel):
    sentiment: str
    explanation: str
    color_code: str 

@app.post("/analyze", response_model=SentimentResponse)
async def analyze_sentiment(request: TextRequest):
    print(f"Analysiere via Groq: {request.text}")

    prompt = f"""
    Du bist ein Stimmungs-Analyse-API.
    Analysiere den folgenden Text: "{request.text}"
    
    Antworte AUSSCHLIESSLICH mit gültigem JSON. Kein Text davor, kein Text danach.
    Das JSON muss genau diese 3 Felder haben:
    {{
        "sentiment": "Ein Wort (z.B. Positiv, Wütend, Sarkastisch, Traurig)",
        "explanation": "Ein kurzer Satz auf Deutsch, warum.",
        "color_code": "Ein Hex-Code (z.B. #ff0000 für Wut, #2ecc71 für Freude)"
    }}
    """

    try:
        completion = client.chat.completions.create(
            # Wir nutzen Llama 3 (sehr schnell und schlau)
            model="llama-3.3-70b-versatile", 
            messages=[{"role": "user", "content": prompt}],
            temperature=0, # 0 macht die KI präziser/weniger kreativ
            # JSON Mode erzwingen (Groq Feature für sauberes JSON)
            response_format={"type": "json_object"} 
        )
        
        raw_content = completion.choices[0].message.content
        print(f"Groq Antwort: {raw_content}") # Zum Debuggen im Terminal
        
        return json.loads(raw_content)
        
    except Exception as e:
        print(f"Fehler: {e}")
        return {
            "sentiment": "Fehler",
            "explanation": f"Groq hat gehustet: {str(e)}",
            "color_code": "#95a5a6"
        }