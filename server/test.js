import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash-latest",
  systemInstruction: "You are a helpful assistant.",
});

const result = await model.generateContent("Say hello and introduce yourself.");
console.log(result.response.text());