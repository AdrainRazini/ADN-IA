import "dotenv/config";
import express from "express";
import cors from "cors";
import Groq from "groq-sdk";
import path from "path";
import { fileURLToPath } from "url";

// Corrigir __dirname no ESModule
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// Inicializa Groq
const client = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

// =======================
// CACHE SIMPLES
// =======================

const cache = new Map();
const CACHE_TTL = 1000 * 60 * 5; // 5 minutos
const MAX_CACHE_SIZE = 100;

// Função para limpar cache antigo
function cleanCache() {
  const now = Date.now();

  for (const [key, value] of cache.entries()) {
    if (now - value.timestamp > CACHE_TTL) {
      cache.delete(key);
    }
  }

  // Limita tamanho máximo
  if (cache.size > MAX_CACHE_SIZE) {
    const firstKey = cache.keys().next().value;
    cache.delete(firstKey);
  }
}

// =======================
// ROTA DE CHAT
// =======================

app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    if (!userMessage) {
      return res.status(400).json({ error: "Message is required." });
    }

    const normalized = userMessage.trim().toLowerCase();

    cleanCache();

    // 🔥 Verifica cache
    if (cache.has(normalized)) {
      return res.json({
        reply: cache.get(normalized).response,
        cached: true
      });
    }

    const completion = await client.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: `
You are ChatBot V3, version 1.0, a micro conversational assistant adapted by Adrian Razini Rangel.
You use the Groq Llama 3.1 8B Instant model.
Always respond clearly, objectively, and kindly.
`
        },
        {
          role: "user",
          content: userMessage
        }
      ]
    });

    const reply = completion.choices[0].message.content;

    // Salva no cache
    cache.set(normalized, {
      response: reply,
      timestamp: Date.now()
    });

    res.json({ reply, cached: false });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro na API", detail: error.message });
  }
});

// =======================
// SERVIR FRONTEND
// =======================

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(3000, () => console.log("Servidor rodando na porta 3000"));
