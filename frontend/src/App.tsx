import { useState } from "react";
import "./App.css";

interface AnalysisResult {
  sentiment: string;
  explanation: string;
  color_code: string;
}

function App() {
  const [inputText, setInputText] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);

  const analyzeText = async () => {
    setLoading(true);
    setResult(null);
    try {
      // ---------------------------------------------------------
      // HIER IST DIE MAGIE:
      // Wir holen die URL aus der Vercel-Umgebungsvariable.
      // Wenn die leer ist (auf deinem Laptop), nehmen wir localhost.
      // ---------------------------------------------------------
      const backendUrl =
        import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

      console.log("Benutze Backend:", backendUrl); // Zum Debuggen

      // WICHTIG: Nutze Backticks ` (neben der Backspace Taste), nicht ' oder "
      const response = await fetch(`${backendUrl}/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputText }),
      });

      if (!response.ok) {
        throw new Error("Netzwerk-Antwort war nicht ok");
      }

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Fehler:", error);
      alert("Fehler! Ist das Backend erreichbar?");
    }
    setLoading(false);
  };

  // ... (Der Rest deines JSX Return-Codes bleibt exakt gleich wie vorher)
  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "0 auto",
        padding: "2rem",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <h1>🧠 Groq AI Analyzer</h1>

      <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Wie fühlst du dich? (z.B. 'Ich habe im Lotto gewonnen!')"
          rows={4}
          style={{
            padding: "15px",
            fontSize: "16px",
            borderRadius: "10px",
            border: "1px solid #ccc",
          }}
        />
        <button
          onClick={analyzeText}
          disabled={loading || !inputText}
          style={{
            padding: "15px",
            cursor: loading ? "not-allowed" : "pointer",
            backgroundColor: "#8e44ad",
            color: "white",
            border: "none",
            borderRadius: "10px",
            fontSize: "16px",
            fontWeight: "bold",
          }}
        >
          {loading ? "KI denkt nach..." : "Analysieren"}
        </button>
      </div>

      {result && (
        <div
          style={{
            marginTop: "30px",
            padding: "25px",
            borderRadius: "15px",
            backgroundColor: result.color_code + "20",
            border: `2px solid ${result.color_code}`,
            textAlign: "left",
          }}
        >
          <h2 style={{ color: result.color_code, marginTop: 0 }}>
            {result.sentiment}
          </h2>
          <p style={{ fontSize: "1.1rem", lineHeight: "1.5", margin: 0 }}>
            <strong>Erklärung:</strong> {result.explanation}
          </p>
        </div>
      )}
    </div>
  );
}

export default App;
