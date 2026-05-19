import { useEffect, useRef, useState } from "react";
import { Send, Mic, MicOff, Volume2, VolumeX, Sparkles } from "lucide-react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import ReactMarkdown from "react-markdown";

type SpeechRecognitionLike = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onend: (() => void) | null;
  onerror: ((e: unknown) => void) | null;
  start: () => void;
  stop: () => void;
};

export function ChatPanel() {
  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);
  const [interim, setInterim] = useState("");
  const [voiceOn, setVoiceOn] = useState(false);
  const recogRef = useRef<SpeechRecognitionLike | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const lastSpokenIdRef = useRef<string | null>(null);

  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });

  const busy = status === "submitted" || status === "streaming";

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, interim]);

  // Speak last completed AI message when voice mode on
  useEffect(() => {
    if (!voiceOn || status !== "ready") return;
    const last = messages[messages.length - 1];
    if (!last || last.role !== "assistant" || last.id === lastSpokenIdRef.current) return;
    const text = last.parts
      .map((p) => (p.type === "text" ? p.text : ""))
      .join(" ")
      .replace(/[*_`#>\-]/g, "")
      .trim();
    if (!text || typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 1;
    u.pitch = 1;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
    lastSpokenIdRef.current = last.id;
  }, [messages, status, voiceOn]);

  const submit = (text: string) => {
    const t = text.trim();
    if (!t || busy) return;
    void sendMessage({ text: t });
    setInput("");
  };

  const toggleVoice = () => {
    if (typeof window === "undefined") return;
    const w = window as unknown as {
      SpeechRecognition?: new () => SpeechRecognitionLike;
      webkitSpeechRecognition?: new () => SpeechRecognitionLike;
    };
    const Ctor = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!Ctor) {
      alert("Voice input isn't supported in this browser. Try Chrome.");
      return;
    }
    if (listening) {
      recogRef.current?.stop();
      return;
    }
    const recog = new Ctor();
    recog.lang = "en-US";
    recog.interimResults = true;
    recog.continuous = false;
    let finalText = "";
    recog.onresult = (e) => {
      let t = "";
      for (let i = 0; i < e.results.length; i++) t += e.results[i][0].transcript;
      finalText = t;
      setInterim(t);
    };
    recog.onend = () => {
      setListening(false);
      setInterim("");
      if (finalText.trim()) submit(finalText);
    };
    recog.onerror = () => {
      setListening(false);
      setInterim("");
    };
    recogRef.current = recog;
    setListening(true);
    recog.start();
  };

  return (
    <div className="relative anim-fade-up [animation-delay:200ms]">
      <div className="chat-glass p-5 sm:p-7 rounded-[2rem] shadow-2xl shadow-sand-dark/10 space-y-4 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-sand-medium/20 rounded-full blur-3xl anim-pulse-orb pointer-events-none" />

        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-2">
            <div className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">
              Sand AI · Live
            </span>
          </div>
          <button
            onClick={() => setVoiceOn((v) => !v)}
            className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity"
            title={voiceOn ? "Mute AI voice" : "Speak AI replies"}
          >
            {voiceOn ? <Volume2 className="size-3" /> : <VolumeX className="size-3" />}
            {voiceOn ? "Voice On" : "Voice Off"}
          </button>
        </div>

        <div
          ref={scrollRef}
          className="space-y-4 max-h-[420px] min-h-[260px] overflow-y-auto pr-1 scroll-smooth relative z-10"
        >
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center py-10 text-center opacity-60">
              <Sparkles className="size-6 mb-3 text-sand-dark" />
              <p className="text-sm">Ask anything. Speak or type. I will follow the grain.</p>
            </div>
          )}
          {messages.map((m) => {
            const text = m.parts
              .map((p) => (p.type === "text" ? p.text : ""))
              .join("");
            return m.role === "assistant" ? (
              <div key={m.id} className="flex gap-3">
                <div className="size-8 rounded-full bg-gradient-to-br from-sand-light to-sand-medium flex-shrink-0 mt-1 shadow-md" />
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="text-[10px] font-bold uppercase tracking-widest opacity-40">
                    Sand AI
                  </div>
                  <div className="prose prose-sm max-w-none prose-p:my-1 prose-headings:font-display prose-strong:text-dune-shadow text-[15px] leading-relaxed">
                    <ReactMarkdown>{text || "…"}</ReactMarkdown>
                  </div>
                </div>
              </div>
            ) : (
              <div key={m.id} className="flex gap-3 flex-row-reverse">
                <div className="size-8 rounded-full bg-dune-shadow flex-shrink-0 mt-1" />
                <div className="space-y-1 text-right min-w-0 flex-1">
                  <div className="text-[10px] font-bold uppercase tracking-widest opacity-40">
                    You
                  </div>
                  <p className="text-[15px] italic leading-relaxed">{text}</p>
                </div>
              </div>
            );
          })}
          {interim && (
            <div className="flex gap-3 flex-row-reverse opacity-60">
              <div className="size-8 rounded-full bg-dune-shadow flex-shrink-0 mt-1" />
              <p className="text-[15px] italic text-right">{interim}…</p>
            </div>
          )}
          {status === "submitted" && (
            <div className="flex gap-3">
              <div className="size-8 rounded-full bg-gradient-to-br from-sand-light to-sand-medium flex-shrink-0 mt-1 animate-pulse" />
              <div className="flex gap-1 items-center pt-2">
                <span className="size-1.5 rounded-full bg-sand-dark animate-bounce [animation-delay:-0.3s]" />
                <span className="size-1.5 rounded-full bg-sand-dark animate-bounce [animation-delay:-0.15s]" />
                <span className="size-1.5 rounded-full bg-sand-dark animate-bounce" />
              </div>
            </div>
          )}
          {error && (
            <div className="text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg p-3">
              {error.message}
            </div>
          )}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            submit(input);
          }}
          className="flex items-center gap-2 pt-3 border-t border-sand-dark/10 relative z-10"
        >
          <button
            type="button"
            onClick={toggleVoice}
            className={`size-11 rounded-full flex items-center justify-center transition-all ${
              listening
                ? "bg-red-500 text-white anim-pulse-orb"
                : "bg-sand-light/60 text-dune-shadow hover:bg-sand-medium/60"
            }`}
            aria-label="Voice"
          >
            {listening ? <MicOff className="size-4" /> : <Mic className="size-4" />}
          </button>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={listening ? "Listening…" : "Whisper your intent…"}
            className="flex-1 bg-transparent outline-none px-2 py-3 text-base placeholder:text-sand-dark/40"
            disabled={busy}
          />
          <button
            type="submit"
            disabled={busy || !input.trim()}
            className="size-11 rounded-full bg-dune-shadow text-highlight flex items-center justify-center hover:bg-sand-dark transition-colors disabled:opacity-40"
            aria-label="Send"
          >
            <Send className="size-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
