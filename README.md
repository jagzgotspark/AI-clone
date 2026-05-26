# 🪞 AI Clone

> An AI version of me. Talks like me. Thinks like me. Texts like me.

**Live demo → [ai-clone-lime-pi.vercel.app](https://ai-clone-lime-pi.vercel.app)**

---

## What is this?

AI Clone is a personal AI chatbot trained on my personality, writing style, real conversations, and opinions. It's not a generic assistant — it's me, artificially.

Built in 5 days from scratch.

---

## Features

- 💬 Responds in my actual texting style (Hinglish, casual, expressive)
- 🧠 Remembers the full conversation for context
- 📎 Writing samples uploader to inject more of my voice
- 💾 Chat persists across sessions via localStorage
- 🌐 Fully deployed — works on any device, anywhere

---

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React + Vite |
| Styling | Inline CSS (warm neutral aesthetic) |
| Backend | Node.js + Express |
| AI Model | Llama 3.3 70B via Groq API |
| Deployment | Vercel (frontend) + Railway (backend) |

---

## How it works

The core is a carefully crafted **system prompt** that describes:
- Personality traits and emotional tendencies
- Texting style and vocabulary
- Real opinions and things I care about
- Actual chat samples from real conversations

Every message sends the full conversation history to the Groq API with this prompt injected — so the AI always has context and always stays in character.

---

## Project Structure

```
ai-clone/
├── client/                  # React frontend
│   └── src/
│       └── App.jsx          # Chat UI
└── server/                  # Express backend
    ├── index.js             # API server + /chat route
    ├── prompt.js            # Personality prompt (the soul)
    └── .env                 # GROQ_API_KEY (never committed)
```

---

## Run locally

**Backend**
```bash
cd server
npm install
echo "GROQ_API_KEY=your_key_here" > .env
node index.js
```

**Frontend**
```bash
cd client
npm install
npm run dev
```

Open `http://localhost:5173`

---

## Build your own

Want to make an AI clone of yourself?

1. Get a free API key at [console.groq.com](https://console.groq.com)
2. Edit `server/prompt.js` — describe your personality honestly and paste real texts/chats as examples
3. The more specific and raw your prompt, the better it sounds like you
4. Deploy backend to [Railway](https://railway.app), frontend to [Vercel](https://vercel.com)

The secret is in the prompt. A great personality prompt beats a fancy model every time.

---

## Made by

**Jagriti Singh** — CSE student, builder, chaotic ambitious person

*Built this in 2 days as a fun project. Yes it actually sounds like me. Yes it's a little unhinged.*
