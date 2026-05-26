import { useState, useRef, useEffect } from "react";

const STORAGE_KEY = "ai-clone-messages";

const defaultMessage = {
  role: "assistant",
  content: "heyyy 👋 it's me — well, AI me lol. ask me anything",
};

export default function App() {
  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [defaultMessage];
    } catch {
      return [defaultMessage];
    }
  });

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSamples, setShowSamples] = useState(false);
  const [samples, setSamples] = useState("");
  const [samplesLoaded, setSamplesLoaded] = useState(false);
  const bottomRef = useRef(null);

  // persist messages to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { role: "user", content: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3001/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          history: messages.map((m) => ({
            role: m.role === "assistant" ? "assistant" : "user",
            content: m.content,
          })),
          extraSamples: samplesLoaded ? samples : "",
        }),
      });

      const data = await response.json();
      setMessages([
        ...updatedMessages,
        { role: "assistant", content: data.reply },
      ]);
    } catch (err) {
      setMessages([
        ...updatedMessages,
        { role: "assistant", content: "bro something broke 😭 try again" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([defaultMessage]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl flex flex-col h-[90vh]">

        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">AI Clone 🪞</h1>
            <p className="text-zinc-500 text-sm mt-0.5">jagriti but make it artificial</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowSamples(!showSamples)}
              className={`text-xs px-3 py-1.5 rounded-full border transition ${
                samplesLoaded
                  ? "border-green-500 text-green-400"
                  : "border-zinc-600 text-zinc-400 hover:border-zinc-400"
              }`}
            >
              {samplesLoaded ? "✓ samples loaded" : "+ add samples"}
            </button>
            <button
              onClick={clearChat}
              className="text-xs px-3 py-1.5 rounded-full border border-zinc-700 text-zinc-500 hover:border-zinc-500 transition"
            >
              clear
            </button>
          </div>
        </div>

        {/* Writing samples panel */}
        {showSamples && (
          <div className="mb-4 bg-zinc-900 rounded-2xl p-4 border border-zinc-700">
            <p className="text-sm text-zinc-400 mb-2">
              paste your real chats, tweets, or texts here — the more the better
            </p>
            <textarea
              value={samples}
              onChange={(e) => setSamples(e.target.value)}
              placeholder="paste your chats here..."
              rows={6}
              className="w-full bg-zinc-800 text-white placeholder-zinc-600 rounded-xl px-3 py-2 text-sm resize-none outline-none focus:ring-1 focus:ring-zinc-600"
            />
            <div className="flex gap-2 mt-2 justify-end">
              <button
                onClick={() => {
                  setSamples("");
                  setSamplesLoaded(false);
                  setShowSamples(false);
                }}
                className="text-xs px-3 py-1.5 rounded-full border border-zinc-700 text-zinc-500 hover:border-zinc-500 transition"
              >
                clear
              </button>
              <button
                onClick={() => {
                  setSamplesLoaded(true);
                  setShowSamples(false);
                }}
                className="text-xs px-3 py-1.5 rounded-full bg-white text-black hover:bg-zinc-200 transition"
              >
                load samples
              </button>
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto flex flex-col gap-3 pr-1">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-white text-black rounded-br-sm"
                    : "bg-zinc-800 text-white rounded-bl-sm"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-zinc-800 px-4 py-2 rounded-2xl rounded-bl-sm text-sm text-zinc-400">
                typing...
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="mt-4 flex gap-2 items-end">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="say something..."
            rows={1}
            className="flex-1 bg-zinc-800 text-white placeholder-zinc-500 rounded-2xl px-4 py-3 text-sm resize-none outline-none focus:ring-1 focus:ring-zinc-600"
          />
          <button
            onClick={sendMessage}
            disabled={loading}
            className="bg-white text-black px-4 py-3 rounded-2xl text-sm font-medium hover:bg-zinc-200 transition disabled:opacity-40"
          >
            send
          </button>
        </div>

      </div>
    </div>
  );
}