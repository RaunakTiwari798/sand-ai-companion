import { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import { VoiceOrb } from "./VoiceOrb";

type Msg = { id: string; role: "user" | "ai"; text: string };

const SEED: Msg[] = [
  {
    id: "1",
    role: "ai",
    text: "I see you're contemplating the architecture of desert cities. Shall we analyze the thermal mass of sandstone?",
  },
];

const CANNED = [
  "The grain finds its own shape — let me trace the pattern for you.",
  "Wind across a dune peak is less a sound than a slow exhale. I can describe its physics in detail.",
  "Consider this: every constraint is just another current of sand. What constraint shall we lift first?",
  "Reasoning, like sediment, accumulates. Give me the layer you're stuck on.",
];

// Minimal Web Speech API typings
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
  const [messages, setMessages] = useState<Msg[]>(SEED);
  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);
  const [interim, setInterim] = useState("");
  const recogRef = useRef<SpeechRecognitionLike | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, interim]);

  const speak = (text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.95;
    u.pitch = 1;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  };

  const respond = (userText: string) => {
    const reply = CANNED[Math.floor(Math.random() * CANNED.length)];
    setTimeout(() => {
      setMessages((m) => [...m, { id: crypto.randomUUID(), role: "ai", text: reply }]);
      speak(reply);
    }, 600);
    void userText;
  };

  const send = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setMessages((m) => [...m, { id: crypto.randomUUID(), role: "user", text: trimmed }]);
    setInput("");
    respond(trimmed);
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
      if (finalText.trim()) send(finalText);
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
      <div className="chat-glass p-6 sm:p-8 rounded-[2.5rem] shadow-2xl shadow-sand-dark/10 space-y-6">
        <div
          ref={scrollRef}
          className="space-y-5 max-h-[340px] overflow-y-auto pr-1 scroll-smooth"
        >
          {messages.map((m) =>
            m.role === "ai" ? (
              <div key={m.id} className="flex gap-4">
                <div className="size-9 rounded-full bg-gradient-to-br from-sand-light to-sand-medium flex-shrink-0 mt-1" />
                <div className="space-y-1">
                  <div className="text-[10px] font-bold uppercase tracking-widest opacity-40">Sand AI</div>
                  <p className="text-base sm:text-lg font-display leading-snug">{m.text}</p>
                </div>
              </div>
            ) : (
              <div key={m.id} className="flex gap-4 flex-row-reverse">
                <div className="size-9 rounded-full bg-dune-shadow flex-shrink-0 mt-1" />
                <div className="space-y-1 text-right">
                  <div className="text-[10px] font-bold uppercase tracking-widest opacity-40">You</div>
                  <p className="text-base sm:text-lg italic">{m.text}</p>
                </div>
              </div>
            ),
          )}
          {interim && (
            <div className="flex gap-4 flex-row-reverse opacity-60">
              <div className="size-9 rounded-full bg-dune-shadow flex-shrink-0 mt-1" />
              <p className="text-base sm:text-lg italic text-right">{interim}…</p>
            </div>
          )}
        </div>

        <VoiceOrb listening={listening} onClick={toggleVoice} />

        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="flex items-center gap-2 pt-4 border-t border-sand-dark/10"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Whisper your intent…"
            className="flex-1 bg-transparent outline-none px-2 py-3 text-base placeholder:text-sand-dark/40"
          />
          <button
            type="submit"
            className="size-11 rounded-full bg-dune-shadow text-highlight flex items-center justify-center hover:bg-sand-dark transition-colors"
            aria-label="Send"
          >
            <Send className="size-4" />
          </button>
        </form>
      </div>

      <div className="absolute -bottom-6 -right-4 text-[120px] font-display font-black text-sand-medium/15 select-none pointer-events-none leading-none">
        01
      </div>
    </div>
  );
}
