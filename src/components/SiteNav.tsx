import { Link } from "@tanstack/react-router";

export function SiteNav() {
  return (
    <nav className="sticky top-0 z-50 px-6 sm:px-8 py-5 flex justify-between items-center backdrop-blur-md bg-highlight/40 border-b border-sand-dark/5">
      <Link to="/" className="text-xl sm:text-2xl font-display font-black tracking-tighter flex items-center gap-2">
        <span className="size-2 rounded-full bg-sand-dark inline-block animate-pulse" />
        SAND AI
      </Link>
      <div className="flex gap-3 sm:gap-6 text-[11px] sm:text-xs font-bold tracking-widest uppercase items-center">
        <a href="#chat" className="hidden sm:inline hover:text-sand-dark transition-colors">Chat</a>
        <a href="#vision" className="hidden sm:inline hover:text-sand-dark transition-colors">Vision</a>
        <a href="#books" className="hidden sm:inline hover:text-sand-dark transition-colors">Books</a>
        <a
          href="#chat"
          className="px-4 py-2 bg-dune-shadow text-highlight rounded-full hover:bg-sand-dark transition-all hover:shadow-lg hover:shadow-sand-dark/20"
        >
          Enter
        </a>
      </div>
    </nav>
  );
}
