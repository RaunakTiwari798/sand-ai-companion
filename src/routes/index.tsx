import { createFileRoute } from "@tanstack/react-router";
import { DuneBackground } from "@/components/DuneBackground";
import { SiteNav } from "@/components/SiteNav";
import { ChatPanel } from "@/components/ChatPanel";
import { VisionPanel } from "@/components/VisionPanel";
import { BookInsight } from "@/components/BookInsight";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sand AI — Voice, Vision, and Book Insight" },
      {
        name: "description",
        content:
          "Sand AI is a futuristic, voice-first AI: real-time chat, image vision, and book insight — wrapped in a cinematic desert interface.",
      },
      { property: "og:title", content: "Sand AI — Voice, Vision, and Book Insight" },
      {
        property: "og:description",
        content: "Talk, show, and ask. Real AI for everything you wonder about.",
      },
      { property: "og:type", content: "website" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..900;1,9..144,300..900&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;700&display=swap",
      },
    ],
  }),
  component: Index,
});

const features = [
  { tag: "Voice", body: "Speak naturally. The model listens, replies, and speaks back." },
  { tag: "Vision", body: "Upload or snap a photo. Ask Sand AI what it sees, infers, or means." },
  { tag: "Books", body: "Type any title. Get summary, themes, takeaways, and a conclusion." },
  { tag: "Reasoning", body: "Patient chain-of-thought logic — exact, calm, deeply considered." },
];

function Index() {
  return (
    <div className="min-h-screen font-body text-dune-shadow selection:bg-sand-medium/30 overflow-x-hidden">
      <DuneBackground />
      <SiteNav />

      {/* HERO + CHAT */}
      <main className="max-w-7xl mx-auto px-6 pt-4 pb-16">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <section className="anim-fade-up">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-sand-dark/15 bg-highlight/40 mb-6 backdrop-blur-sm">
              <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] uppercase tracking-widest font-bold opacity-70">
                Live · Gemini powered
              </span>
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-display font-light leading-[0.95] text-balance mb-6">
              Intelligence that{" "}
              <span className="italic font-medium">shifts</span> with you.
            </h1>
            <p className="text-lg sm:text-xl text-dune-shadow/70 max-w-[48ch] mb-10 leading-relaxed">
              Voice chat, image vision, and book insight — woven into one cinematic AI assistant.
              Talk to it, show it, ask it anything.
            </p>

            <div id="features" className="grid grid-cols-2 gap-3 sm:gap-4">
              {features.map((f, i) => (
                <div
                  key={f.tag}
                  className="p-5 sm:p-6 border border-sand-dark/10 rounded-2xl bg-highlight/40 hover:bg-highlight/70 hover:-translate-y-1 transition-all duration-500 backdrop-blur-sm anim-fade-up"
                  style={{ animationDelay: `${300 + i * 100}ms` }}
                >
                  <div className="text-xs font-bold uppercase tracking-widest text-sand-dark mb-2">
                    {f.tag}
                  </div>
                  <div className="text-sm text-dune-shadow/65 leading-relaxed">{f.body}</div>
                </div>
              ))}
            </div>
          </section>

          <section id="chat">
            <ChatPanel />
          </section>
        </div>
      </main>

      {/* VISION */}
      <section id="vision" className="max-w-7xl mx-auto px-6 py-16">
        <div className="mb-8 anim-fade-up">
          <div className="text-[10px] font-bold uppercase tracking-widest opacity-50 mb-2">
            02 · Vision
          </div>
          <h2 className="text-4xl sm:text-5xl font-display font-light max-w-2xl">
            Hand the AI an image. <span className="italic">Watch it understand.</span>
          </h2>
        </div>
        <VisionPanel />
      </section>

      {/* BOOK INSIGHT */}
      <section id="books" className="max-w-7xl mx-auto px-6 py-16">
        <div className="mb-8 anim-fade-up">
          <div className="text-[10px] font-bold uppercase tracking-widest opacity-50 mb-2">
            03 · Book Insight
          </div>
          <h2 className="text-4xl sm:text-5xl font-display font-light max-w-2xl">
            A library in a heartbeat. <span className="italic">One title, full distillation.</span>
          </h2>
        </div>
        <BookInsight />
      </section>

      <footer className="max-w-7xl mx-auto px-6 py-10 flex flex-col sm:flex-row gap-4 justify-between border-t border-sand-dark/10">
        <div className="text-[10px] text-dune-shadow/40 flex gap-8 uppercase tracking-widest">
          <span>Sand AI v5.0</span>
          <span className="hidden sm:inline">Neural Latency: 12ms</span>
        </div>
        <div className="text-[10px] text-dune-shadow/40 uppercase tracking-widest">
          © 2026 Sand AI Laboratory
        </div>
      </footer>
    </div>
  );
}
