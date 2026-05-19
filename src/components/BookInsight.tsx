import { useState } from "react";
import { BookOpen, Sparkles, Quote } from "lucide-react";

type Insight = {
  title: string;
  author: string;
  oneLiner: string;
  summary: string;
  themes: string[];
  keyTakeaways: string[];
  notableQuotes: string[];
  conclusion: string;
  readIf: string;
};

export function BookInsight() {
  const [book, setBook] = useState("");
  const [data, setData] = useState<Insight | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!book.trim() || loading) return;
    setLoading(true);
    setErr(null);
    setData(null);
    try {
      const r = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ book: book.trim() }),
      });
      if (!r.ok) throw new Error(await r.text());
      setData((await r.json()) as Insight);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-glass rounded-[2rem] p-6 sm:p-8 shadow-2xl shadow-sand-dark/10 relative overflow-hidden">
      <div className="absolute -top-20 -right-20 w-80 h-80 bg-sand-medium/20 rounded-full blur-3xl pointer-events-none" />

      <div className="flex items-center gap-3 mb-5 relative z-10">
        <BookOpen className="size-6 opacity-50" />
        <div>
          <div className="text-[10px] font-bold uppercase tracking-widest opacity-50 mb-1">
            Book Insight
          </div>
          <h3 className="text-2xl font-display font-light">
            Every book, <span className="italic">distilled.</span>
          </h3>
        </div>
      </div>

      <form onSubmit={submit} className="flex gap-2 mb-6 relative z-10">
        <input
          value={book}
          onChange={(e) => setBook(e.target.value)}
          placeholder="Type a book name — e.g. Dune, Sapiens, Meditations"
          className="flex-1 bg-highlight/60 border border-sand-dark/15 rounded-full px-5 py-3 text-sm outline-none focus:border-sand-dark/40 transition"
        />
        <button
          type="submit"
          disabled={!book.trim() || loading}
          className="px-5 py-3 rounded-full bg-dune-shadow text-highlight text-xs font-bold uppercase tracking-widest hover:bg-sand-dark transition disabled:opacity-40 flex items-center gap-2"
        >
          <Sparkles className="size-3.5" />
          {loading ? "Distilling…" : "Reveal"}
        </button>
      </form>

      {err && (
        <div className="text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg p-3 relative z-10">
          {err}
        </div>
      )}

      {loading && (
        <div className="space-y-3 relative z-10">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-4 bg-sand-light/60 rounded animate-pulse"
              style={{ width: `${90 - i * 12}%` }}
            />
          ))}
        </div>
      )}

      {data && (
        <div className="space-y-6 relative z-10 anim-fade-up">
          <div>
            <div className="text-xs uppercase tracking-widest opacity-50">{data.author}</div>
            <h4 className="text-3xl sm:text-4xl font-display font-light leading-tight mt-1">
              {data.title}
            </h4>
            <p className="italic text-sand-dark mt-2">{data.oneLiner}</p>
          </div>

          <div>
            <SectionLabel>Summary</SectionLabel>
            <p className="text-[15px] leading-relaxed">{data.summary}</p>
          </div>

          {data.themes?.length > 0 && (
            <div>
              <SectionLabel>Themes</SectionLabel>
              <div className="flex flex-wrap gap-2">
                {data.themes.map((t) => (
                  <span
                    key={t}
                    className="px-3 py-1 rounded-full bg-sand-light/60 text-xs font-medium"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}

          {data.keyTakeaways?.length > 0 && (
            <div>
              <SectionLabel>Key Takeaways</SectionLabel>
              <ul className="space-y-2">
                {data.keyTakeaways.map((k, i) => (
                  <li key={i} className="flex gap-3 text-[15px] leading-relaxed">
                    <span className="font-display text-sand-dark/60 text-sm pt-0.5">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span>{k}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {data.notableQuotes?.length > 0 && (
            <div>
              <SectionLabel>Notable Quotes</SectionLabel>
              <div className="space-y-3">
                {data.notableQuotes.map((q, i) => (
                  <blockquote
                    key={i}
                    className="border-l-2 border-sand-medium pl-4 italic text-[15px] flex gap-2"
                  >
                    <Quote className="size-3 mt-1.5 opacity-40 flex-shrink-0" />
                    <span>{q}</span>
                  </blockquote>
                ))}
              </div>
            </div>
          )}

          <div className="p-5 rounded-2xl bg-dune-shadow text-highlight">
            <SectionLabel light>Conclusion</SectionLabel>
            <p className="text-[15px] leading-relaxed">{data.conclusion}</p>
          </div>

          <div className="text-sm opacity-70">
            <span className="font-bold uppercase tracking-widest text-[10px] opacity-80">
              Read it if:{" "}
            </span>
            {data.readIf}
          </div>
        </div>
      )}
    </div>
  );
}

function SectionLabel({ children, light }: { children: React.ReactNode; light?: boolean }) {
  return (
    <div
      className={`text-[10px] font-bold uppercase tracking-widest mb-2 ${
        light ? "opacity-60" : "opacity-50"
      }`}
    >
      {children}
    </div>
  );
}
