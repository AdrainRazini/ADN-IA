/* routes/chat.js */

import express from "express";
import { runCore } from "../modules/ai.engine.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { message, core } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required." });
    }

    const coreName = core || "mini_adn";

    const reply = await runCore(coreName, message);

    res.json({ reply, core: coreName });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro na API" });
  }
});

export default router;
