import { useState, useRef, useEffect } from "react";

const STORAGE_KEY = "ai-clone-messages";
const API_URL = "https://ai-clone-production-41e9.up.railway.app/chat";

const defaultMessage = {
  role: "assistant",
  content: "hey, it's me — well, the AI version 🪞 ask me anything",
};

const styles = {
  page: { minHeight: "100vh", background: "#f7f4f0", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px", fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif" },
  wrap: { width: "100%", maxWidth: "480px", height: "92vh", display: "flex", flexDirection: "column", background: "#f7f4f0" },
  header: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px", paddingBottom: "16px", borderBottom: "0.5px solid #e2dbd3" },
  headerLeft: { display: "flex", alignItems: "center", gap: "12px" },
  avatar: { width: "40px", height: "40px", borderRadius: "50%", background: "#c9b99a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", fontWeight: "600", color: "#fff", flexShrink: 0 },
  headerName: { fontSize: "15px", fontWeight: "500", color: "#2d2118", margin: 0 },
  headerSub: { fontSize: "11px", color: "#a89880", margin: 0, letterSpacing: "0.04em", textTransform: "uppercase" },
  headerBtns: { display: "flex", gap: "8px" },
  btn: { fontSize: "12px", padding: "6px 12px", borderRadius: "20px", border: "0.5px solid #ddd5c8", background: "transparent", color: "#a89880", cursor: "pointer" },
  btnActive: { fontSize: "12px", padding: "6px 12px", borderRadius: "20px", border: "0.5px solid #a89880", background: "#f0ece6", color: "#6b5c4e", cursor: "pointer" },
  messages: { flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "12px", paddingRight: "4px" },
  msgRowAi: { display: "flex", alignItems: "flex-end", gap: "8px", justifyContent: "flex-start" },
  msgRowUser: { display: "flex", alignItems: "flex-end", gap: "8px", justifyContent: "flex-end" },
  smallAvatar: { width: "26px", height: "26px", borderRadius: "50%", background: "#c9b99a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", fontWeight: "600", color: "#fff", flexShrink: 0 },
  bubbleAi: { maxWidth: "72%", padding: "10px 14px", borderRadius: "18px 18px 18px 4px", background: "#fff", color: "#2d2118", fontSize: "14px", lineHeight: "1.55", border: "0.5px solid #e8e0d6" },
  bubbleUser: { maxWidth: "72%", padding: "10px 14px", borderRadius: "18px 18px 4px 18px", background: "#2d2118", color: "#f7f4f0", fontSize: "14px", lineHeight: "1.55" },
  typingWrap: { display: "flex", alignItems: "flex-end", gap: "8px" },
  typingBubble: { padding: "12px 16px", borderRadius: "18px 18px 18px 4px", background: "#fff", border: "0.5px solid #e8e0d6", display: "flex", gap: "5px", alignItems: "center" },
  samplesPanel: { marginBottom: "12px", background: "#fff", borderRadius: "16px", padding: "16px", border: "0.5px solid #e8e0d6" },
  samplesLabel: { fontSize: "12px", color: "#a89880", marginBottom: "8px", display: "block" },
  samplesTextarea: { width: "100%", background: "#f7f4f0", border: "0.5px solid #e2dbd3", borderRadius: "10px", padding: "10px 12px", fontSize: "13px", fontFamily: "'DM Sans', sans-serif", color: "#2d2118", resize: "none", outline: "none", boxSizing: "border-box" },
  samplesBtns: { display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "10px" },
  inputRow: { marginTop: "16px", paddingTop: "16px", borderTop: "0.5px solid #e2dbd3", display: "flex", gap: "8px", alignItems: "flex-end" },
  input: { flex: 1, background: "#fff", border: "0.5px solid #e2dbd3", borderRadius: "14px", padding: "10px 14px", fontSize: "14px", fontFamily: "'DM Sans', sans-serif", color: "#2d2118", outline: "none", resize: "none" },
  sendBtn: { background: "#2d2118", color: "#f7f4f0", border: "none", borderRadius: "12px", padding: "10px 18px", fontSize: "13px", fontFamily: "'DM Sans', sans-serif", cursor: "pointer", fontWeight: "500" },
};

function TypingDot({ delay }) {
  const [up, setUp] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => {
      const interval = setInterval(() => setUp(u => !u), 600);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(t);
  }, [delay]);
  return (
    <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#c9b99a", transform: up ? "translateY(-4px)" : "translateY(0)", transition: "transform 0.3s ease" }} />
  );
}

export default function App() {
  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [defaultMessage];
    } catch { return [defaultMessage]; }
  });
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSamples, setShowSamples] = useState(false);
  const [samples, setSamples] = useState("");
  const [samplesLoaded, setSamplesLoaded] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMessage = { role: "user", content: input };
    const updated = [...messages, userMessage];
    setMessages(updated);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input, history: messages.map(m => ({ role: m.role === "assistant" ? "assistant" : "user", content: m.content })), extraSamples: samplesLoaded ? samples : "" }),
      });
      const data = await res.json();
      setMessages([...updated, { role: "assistant", content: data.reply }]);
    } catch {
      setMessages([...updated, { role: "assistant", content: "something broke 😭 try again" }]);
    } finally { setLoading(false); }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  return (
    <div style={styles.page}>
      <div style={styles.wrap}>

        <div style={styles.header}>
          <div style={styles.headerLeft}>
            <div style={styles.avatar}>J</div>
            <div>
              <p style={styles.headerName}>Jagriti</p>
              <p style={styles.headerSub}>● ai clone</p>
            </div>
          </div>
          <div style={styles.headerBtns}>
            <button style={samplesLoaded ? styles.btnActive : styles.btn} onClick={() => setShowSamples(!showSamples)}>
              {samplesLoaded ? "✓ samples" : "+ samples"}
            </button>
            <button style={styles.btn} onClick={() => { setMessages([defaultMessage]); localStorage.removeItem(STORAGE_KEY); }}>
              clear
            </button>
          </div>
        </div>

        {showSamples && (
          <div style={styles.samplesPanel}>
            <span style={styles.samplesLabel}>paste real chats — the more the better</span>
            <textarea style={styles.samplesTextarea} rows={5} value={samples} onChange={e => setSamples(e.target.value)} placeholder="paste your chats here..." />
            <div style={styles.samplesBtns}>
              <button style={styles.btn} onClick={() => { setSamples(""); setSamplesLoaded(false); setShowSamples(false); }}>clear</button>
              <button style={{ ...styles.btn, background: "#2d2118", color: "#f7f4f0", border: "none" }} onClick={() => { setSamplesLoaded(true); setShowSamples(false); }}>load</button>
            </div>
          </div>
        )}

        <div style={styles.messages}>
          {messages.map((msg, i) => (
            <div key={i} style={msg.role === "assistant" ? styles.msgRowAi : styles.msgRowUser}>
              {msg.role === "assistant" && <div style={styles.smallAvatar}>J</div>}
              <div style={msg.role === "assistant" ? styles.bubbleAi : styles.bubbleUser}>
                {msg.content}
              </div>
            </div>
          ))}
          {loading && (
            <div style={styles.typingWrap}>
              <div style={styles.smallAvatar}>J</div>
              <div style={styles.typingBubble}>
                <TypingDot delay={0} />
                <TypingDot delay={200} />
                <TypingDot delay={400} />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div style={styles.inputRow}>
          <textarea style={styles.input} rows={1} value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKey} placeholder="say something..." />
          <button style={styles.sendBtn} onClick={sendMessage} disabled={loading}>send</button>
        </div>

      </div>
    </div>
  );
}