import Groq from "groq-sdk";
import dotenv from "dotenv";
import { systemPrompt } from "./prompt.js";
dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const response = await groq.chat.completions.create({
  model: "llama-3.3-70b-versatile",
  messages: [
    { role: "system", content: systemPrompt },
    { role: "user", content: "bro i can't sleep. my brain won't stop" }
  ],
  max_tokens: 400,
});

console.log(response.choices[0].message.content);