import { useRef, useState } from "react";
import { Camera, Upload, Send, X, Eye } from "lucide-react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import ReactMarkdown from "react-markdown";

export function VisionPanel() {
  const [image, setImage] = useState<string | null>(null);
  const [question, setQuestion] = useState("");
  const fileRef = useRef<HTMLInputElement | null>(null);
  const cameraRef = useRef<HTMLInputElement | null>(null);

  const { messages, sendMessage, status, error, setMessages } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });

  const busy = status === "submitted" || status === "streaming";

  const onFile = (f: File | null) => {
    if (!f) return;
    const r = new FileReader();
    r.onload = () => setImage(String(r.result));
    r.readAsDataURL(f);
  };

  const ask = () => {
    if (!image || !question.trim() || busy) return;
    const mediaType = image.substring(5, image.indexOf(";"));
    void sendMessage({
      text: question.trim(),
      files: [{ type: "file", mediaType, url: image }],
    });
    setQuestion("");
  };

  const clear = () => {
    setImage(null);
    setQuestion("");
    setMessages([]);
  };

  return (
    <div className="chat-glass rounded-[2rem] p-6 sm:p-8 shadow-2xl shadow-sand-dark/10 relative overflow-hidden">
      <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-sand-light/30 rounded-full blur-3xl pointer-events-none" />

      <div className="flex items-center justify-between mb-5 relative z-10">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-widest opacity-50 mb-1">
            Vision Engine
          </div>
          <h3 className="text-2xl font-display font-light">
            Show me. <span className="italic">I'll see.</span>
          </h3>
        </div>
        <Eye className="size-6 opacity-40" />
      </div>

      <div className="grid sm:grid-cols-2 gap-5 relative z-10">
        <div>
          {!image ? (
            <div className="border-2 border-dashed border-sand-dark/20 rounded-2xl aspect-square flex flex-col items-center justify-center gap-3 p-4 bg-sand-light/10">
              <div className="flex gap-2">
                <button
                  onClick={() => fileRef.current?.click()}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-dune-shadow text-highlight text-xs font-bold uppercase tracking-widest hover:bg-sand-dark transition"
                >
                  <Upload className="size-3.5" /> Upload
                </button>
                <button
                  onClick={() => cameraRef.current?.click()}
                  className="flex items-center gap-2 px-4 py-2 rounded-full border border-sand-dark/20 text-xs font-bold uppercase tracking-widest hover:bg-sand-light/40 transition"
                >
                  <Camera className="size-3.5" /> Camera
                </button>
              </div>
              <p className="text-xs opacity-50 text-center">
                Drop a photograph, a sketch, a screenshot.
              </p>
            </div>
          ) : (
            <div className="relative rounded-2xl overflow-hidden aspect-square bg-dune-shadow/5">
              <img src={image} alt="Uploaded" className="w-full h-full object-cover" />
              <button
                onClick={clear}
                className="absolute top-2 right-2 size-8 rounded-full bg-dune-shadow/80 text-highlight flex items-center justify-center backdrop-blur-sm"
              >
                <X className="size-4" />
              </button>
            </div>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => onFile(e.target.files?.[0] ?? null)}
          />
          <input
            ref={cameraRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={(e) => onFile(e.target.files?.[0] ?? null)}
          />
        </div>

        <div className="flex flex-col gap-3 min-h-[260px]">
          <div className="flex-1 overflow-y-auto space-y-3 max-h-[280px] pr-1">
            {messages.length === 0 && (
              <p className="text-sm opacity-50 italic">
                Upload an image, then ask Sand AI anything about it.
              </p>
            )}
            {messages.map((m) => {
              const text = m.parts.map((p) => (p.type === "text" ? p.text : "")).join("");
              return (
                <div key={m.id} className={m.role === "user" ? "text-right" : ""}>
                  <div className="text-[9px] uppercase font-bold tracking-widest opacity-40 mb-1">
                    {m.role === "user" ? "You" : "Sand AI"}
                  </div>
                  {m.role === "assistant" ? (
                    <div className="prose prose-sm max-w-none text-sm">
                      <ReactMarkdown>{text || "…"}</ReactMarkdown>
                    </div>
                  ) : (
                    <p className="text-sm italic">{text}</p>
                  )}
                </div>
              );
            })}
            {error && <div className="text-xs text-red-700">{error.message}</div>}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              ask();
            }}
            className="flex items-center gap-2 pt-3 border-t border-sand-dark/10"
          >
            <input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder={image ? "What do you see?" : "Add an image first…"}
              disabled={!image || busy}
              className="flex-1 bg-transparent outline-none px-2 py-2 text-sm placeholder:text-sand-dark/40 disabled:opacity-40"
            />
            <button
              type="submit"
              disabled={!image || !question.trim() || busy}
              className="size-10 rounded-full bg-dune-shadow text-highlight flex items-center justify-center hover:bg-sand-dark transition disabled:opacity-40"
            >
              <Send className="size-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
