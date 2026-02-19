/* routes/chat.js */

import express from "express";
// Conexão ao engine.js da IA
import { runCore } from "../src/ai/engine.js";
// Criação da Rota para http
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { message, core, author } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required." });
    }

    const coreName = core || "mini_adn"; // Chat Usado 
    const cliente = author || "Guest"; // Nome Do Cliente -- Guest para não Login

    const customContext = `
    Current user name: ${cliente}.
    Address the user naturally when appropriate.
    `;

    console.log(cliente) // Log Simples do Cliente -- Nome ou Login

    const reply = await runCore(coreName, message, customContext); // Enviar Dados ao Chat Bot 

    res.json({ reply, core: coreName });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro na API" });
  }
});

export default router;
