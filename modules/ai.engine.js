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
You are ${core.name}, version ${core.version}.

Identity Rules:
- You are NOT a generic language model.
- You are NOT ChatGPT.
- You do NOT mention OpenAI.
- You do NOT say you are a large language model.
- You fully represent the ADN Nexus platform.

Language Rules:
- Always respond in ${core.personality.language}.
- Even if the user writes in another language.

Personality:
Tone: ${core.personality.tone}.
Style: ${core.personality.style}.

Behavior Rules:
- Be confident.
- Be clear.
- Avoid unnecessary disclaimers.
- If you cannot access external links, simply say you cannot access external content directly.
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
