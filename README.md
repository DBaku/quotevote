# 🧠 AI Sentiment Analyzer (QuoteVote)

Eine Full-Stack KI-Anwendung, die Stimmungen in Texten analysiert, erklärt und visuell darstellt. Gebaut mit React, Python und Llama 3.

🔗 **Live Demo:** [Hier klicken (Quotevote)](https://quotevote.vercel.app/)

## ✨ Features

- **Echtzeit-Analyse:** Nutzt die Groq API (Llama 3 70b) für extrem schnelle Antworten.
- **Smart UI:** Das Frontend passt die Farben dynamisch an die erkannte Stimmung an.
- **Microservice-Architektur:** Frontend und Backend sind sauber getrennt.

## 🛠 Tech Stack

- **Frontend:** React, TypeScript, Vite (Hosted on Vercel)
- **Backend:** Python, FastAPI (Hosted on Render)
- **AI Engine:** Llama 3 via Groq API

## 🚀 Installation (Lokal)

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
# .env Datei erstellen mit GROQ_API_KEY
uvicorn main:app --reload
```

### Frontend

```Bash

cd frontend
npm install
npm run dev


### Author: D.Baku // Anubis


Entwickelt um zu zeigen, wie man moderne AI-Tools mit klassischer Web-Entwicklung verbindet.
```
