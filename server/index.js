import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config(); // loads your .env file

const app = express();
app.use(cors()); // allows frontend to talk to this server
app.use(express.json()); // lets server read JSON from requests

// initialize Gemini with your key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// your personality prompt — placeholder for now, Day 2 you'll fill this properly
const systemPrompt = `You are a person having a casual conversation. 
Be friendly and helpful.`;

// POST route — frontend will send messages here
app.post("/chat", async (req, res) => {
  const { message, history } = req.body;

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: systemPrompt,
    });

    // history keeps track of the full conversation so Gemini has context
    const chat = model.startChat({
      history: history || [],
    });

    const result = await chat.sendMessage(message);
    const reply = result.response.text();

    res.json({ reply }); // send the reply back to whoever called this route
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.listen(3001, () => {
  console.log("Server running on http://localhost:3001");
});