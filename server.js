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

import chatRoute from "./routes/chat.js";

app.use("/chat", chatRoute);

// =======================
// SERVIR FRONTEND
// =======================

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// app.listen(3000, () => console.log("Servidor rodando na porta 3000"));

// ============================
// SERVER
// ============================

const PORT = process.env.PORT || 3000;

const isServerless = process.env.VERCEL || process.env.AWS_REGION;

if (!isServerless) {
  app.listen(PORT, () => {
    console.log(`[ChatBot] Backend rodando na porta ${PORT}`);
  });
} else {
  console.log("Backend pronto para Serverless");
}

export default app; // o api/index.js escuta o app quando eu mudar as apis para Routs 