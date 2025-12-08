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

// ROTA DE CHAT
app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    const completion = await client.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
        role: "system",
        content: "Você é o ChatBot V3, versão 1.0, um micro assistente de conversa adaptado por Adrian Razini Rangel. Você utiliza o modelo Llama 3.1 8B Instant da Groq. Responda sempre com clareza, objetividade e simpatia."
        },
        {
          role: "user",
          content: userMessage
        }
      ]
    });

    res.json({
      reply: completion.choices[0].message.content
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro na API", detail: error.message });
  }
});


// Servir arquivos públicos
app.use(express.static(path.join(__dirname, "public")));

// ROTA /
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(3000, () => console.log("Servidor rodando na porta 3000"));
