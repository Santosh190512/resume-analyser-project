import { useEffect, useState } from "react";
import { Bot, Loader2, MessageCircle, Send, Sparkles, X } from "lucide-react";

import API from "../api/api";
import { useAuth } from "../context/AuthContext";


export default function CareerChatbot() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const displayName = user?.first_name || user?.username || "there";
  
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    setMessages([
      {
        role: "bot",
        text: `Hi ${displayName}! Main tumhara AI career assistant hoon. Resume improve karne, ATS score, skills, aur jobs ke bare me pooch sakte ho.`,
      },
    ]);
  }, [displayName]);

  const sendMessage = async (e) => {
    e.preventDefault();

    const trimmed = message.trim();

    if (!trimmed || loading) return;

    setMessages((current) => [
      ...current,
      { role: "user", text: trimmed },
    ]);

    setMessage("");
    setLoading(true);

    try {
      const res = await API.post("/chat_bot/chat/", {
        message: trimmed,
      });

      setMessages((current) => [
        ...current,
        { role: "bot", text: res.data.reply },
      ]);
    } catch (err) {
      setMessages((current) => [
        ...current,
        {
          role: "bot",
          text:
            err.response?.data?.error ||
            "Chatbot reply nahi de paya. Backend/API key check karo.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {open && (
        <div className="mb-4 flex h-[540px] w-[min(390px,calc(100vw-40px))] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0b1020]/95 shadow-2xl shadow-black/50 backdrop-blur-xl">
          <div className="bg-gradient-to-r from-teal-400 to-emerald-400 p-4 text-slate-950">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-slate-950 text-teal-300 shadow-lg">
                  <Bot size={22} />
                </span>

                <div>
                  <h2 className="text-lg font-black">
                    AI Career Chatbot
                  </h2>
                  <p className="text-xs font-semibold text-slate-800">
                    Resume + Job Guidance
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-xl bg-slate-950/10 p-2 transition hover:bg-slate-950/20"
              >
                <X size={19} />
              </button>
            </div>
          </div>

          <div className="border-b border-white/10 bg-white/[0.04] px-4 py-3">
            <div className="flex items-center gap-2 text-xs font-medium text-teal-100">
              <Sparkles size={15} />
              Ask about resume improvement, ATS, skills, job roles, interviews
            </div>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.map((item, index) => (
              <div
                key={`${item.role}-${index}`}
                className={`flex ${
                  item.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 shadow-lg ${
                    item.role === "user"
                      ? "rounded-br-md bg-teal-400 text-slate-950 shadow-teal-500/10"
                      : "rounded-bl-md border border-white/10 bg-white/10 text-slate-100 shadow-black/20"
                  }`}
                >
                  {item.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="inline-flex items-center gap-2 rounded-2xl rounded-bl-md border border-white/10 bg-white/10 px-4 py-3 text-sm text-slate-200">
                  <Loader2 className="animate-spin" size={16} />
                  Thinking...
                </div>
              </div>
            )}
          </div>

          <form onSubmit={sendMessage} className="border-t border-white/10 bg-slate-950/60 p-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask resume or job question..."
                className="h-12 min-w-0 flex-1 rounded-xl border border-white/10 bg-white/10 px-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-teal-300/70 focus:ring-4 focus:ring-teal-300/10"
              />

              <button
                type="submit"
                disabled={loading || !message.trim()}
                className="grid h-12 w-12 place-items-center rounded-xl bg-teal-400 text-slate-950 shadow-lg shadow-teal-500/20 transition hover:bg-teal-300 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Send size={18} />
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="flex flex-col items-center">
        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          className="group relative grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-rose-500 to-teal-400 text-white shadow-2xl shadow-rose-500/30 transition hover:-translate-y-1 hover:shadow-teal-500/30"
        >
          <span className="absolute -right-1 -top-1 h-4 w-4 rounded-full border-2 border-slate-950 bg-emerald-400" />
          {open ? <X size={27} /> : <MessageCircle size={28} />}
        </button>

        <div className="mt-2 rounded-full border border-white/10 bg-slate-950/90 px-4 py-1.5 text-center shadow-xl shadow-black/30 backdrop-blur">
          <p className="text-xs font-bold text-white">
            AI Chatbot
          </p>
          <p className="text-[10px] font-medium text-teal-200">
            Resume Help
          </p>
        </div>
      </div>
    </div>
  );
}
