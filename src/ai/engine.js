import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Groq from "groq-sdk";
import { buildPrompt } from "./promptBuilder.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CORES_PATH = path.resolve(__dirname, "../cores");
const packagePath = path.resolve(__dirname, "../../package.json");
const pkg = JSON.parse(fs.readFileSync(packagePath, "utf-8"));

const client = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

function loadCore(coreName) {
  const filePath = path.join(CORES_PATH, `${coreName}.json`);

  if (!fs.existsSync(filePath)) {
    throw new Error(`Core "${coreName}" not found in cores directory.`);
  }

  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

export async function runCore(coreName, userMessage, customPrompt = "", overrides = {}) {
  try {
    const core = loadCore(coreName);

    //  Agora sim usando meu prompt modular
    const systemPrompt = buildPrompt({ core, pkg, customPrompt });

    const completion = await client.chat.completions.create({
      model: overrides.model ?? core.model?.name,
      temperature: overrides.temperature ?? core.model?.temperature ?? 0.7,
      max_tokens: overrides.max_tokens ?? core.model?.max_tokens ?? 300,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage }
      ]
    });

    return completion?.choices?.[0]?.message?.content || "AI response error";
  } catch (error) {
    console.error("runCore error:", error.message);
    return "Internal AI execution error.";
  }
}
