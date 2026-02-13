import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Groq from "groq-sdk";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const client = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

function loadCore(coreName) {
  const filePath = path.join(__dirname, `${coreName}.json`);
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

export async function runCore(coreName, userMessage) {
  const core = loadCore(coreName);

  const completion = await client.chat.completions.create({
    model: core.model.name,
    temperature: core.model.temperature,
    max_tokens: core.model.max_tokens,
    messages: [
      {
        role: "system",
        content: `
You are ${core.name} v${core.version}.
Respond in ${core.personality.language}.
Tone: ${core.personality.tone}.
Style: ${core.personality.style}.
`
      },
      {
        role: "user",
        content: userMessage
      }
    ]
  });

  return completion?.choices?.[0]?.message?.content || "Erro na resposta da IA";
}
