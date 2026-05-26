import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Groq from "groq-sdk";
import { systemPrompt } from "./prompt.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

app.post("/chat", async (req, res) => {
  const { message, history, extraSamples } = req.body;

  try {
    const extra = extraSamples
      ? `\n\nAdditional writing samples from Jagriti:\n${extraSamples}`
      : "";

    const messages = [
      { role: "system", content: systemPrompt + extra },
      ...(history || []),
      { role: "user", content: message },
    ];

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages,
      max_tokens: 400,
    });

    const reply = response.choices[0].message.content;
    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "something went wrong" });
  }
});

app.listen(3001, () => {
  console.log("server running on http://localhost:3001");
});