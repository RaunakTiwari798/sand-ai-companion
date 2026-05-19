import { createFileRoute } from "@tanstack/react-router";
import { DuneBackground } from "@/components/DuneBackground";
import { SiteNav } from "@/components/SiteNav";
import { ChatPanel } from "@/components/ChatPanel";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sand AI — Intelligence that shifts with you" },
      {
        name: "description",
        content:
          "Sand AI is a cinematic voice-first AI assistant. Talk, reason, and create with a fluid model inspired by shifting dunes.",
      },
      { property: "og:title", content: "Sand AI — Intelligence that shifts with you" },
      {
        property: "og:description",
        content: "Voice chat, vision, code, and reasoning — wrapped in a cinematic desert interface.",
      },
      { property: "og:type", content: "website" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..900;1,9..144,300..900&family=Inter:wght@300;400;500;600;700&display=swap",
      },
    ],
  }),
  component: Index,
});

const features = [
  { tag: "Voice Chat", body: "Hyper-real vocal synthesis with low-latency listening." },
  { tag: "Vision", body: "Optical scene understanding for any image you share." },
  { tag: "Code", body: "Algorithmic flow construction across every major language." },
  { tag: "Reasoning", body: "Deep chain-of-thought logic that feels patient and exact." },
];

function Index() {
  return (
    <div className="min-h-screen font-body text-dune-shadow selection:bg-sand-medium/30 overflow-x-hidden">
      <DuneBackground />
      <SiteNav />

      <main className="max-w-7xl mx-auto px-6 pt-8 pb-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <section className="anim-fade-up">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-display font-light leading-[0.95] text-balance mb-8">
              Intelligence that <span className="italic font-medium">shifts</span> with you.
            </h1>
            <p className="text-lg sm:text-xl text-dune-shadow/70 max-w-[45ch] mb-12 leading-relaxed">
              The first fluid AI model designed to move at the speed of human thought.
              Cinematic reasoning, tactile response, real voice.
            </p>

            <div id="features" className="grid grid-cols-2 gap-3 sm:gap-4">
              {features.map((f) => (
                <div
                  key={f.tag}
                  className="p-5 sm:p-6 border border-sand-dark/10 rounded-2xl bg-highlight/40 hover:bg-highlight/70 transition-colors backdrop-blur-sm"
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

      <footer className="max-w-7xl mx-auto px-6 py-10 flex flex-col sm:flex-row gap-4 justify-between border-t border-sand-dark/10">
        <div className="text-[10px] text-dune-shadow/40 flex gap-8 uppercase tracking-widest">
          <span>Version 4.0.2 Stable</span>
          <span className="hidden sm:inline">Neural Latency: 12ms</span>
        </div>
        <div className="text-[10px] text-dune-shadow/40 uppercase tracking-widest">
          © 2026 Sand AI Laboratory
        </div>
      </footer>
    </div>
  );
}
