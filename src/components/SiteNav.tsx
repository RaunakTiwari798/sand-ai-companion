import { Link } from "@tanstack/react-router";

export function SiteNav() {
  return (
    <nav className="sticky top-0 z-50 px-6 sm:px-8 py-6 flex justify-between items-center mix-blend-multiply">
      <Link to="/" className="text-2xl font-display font-black tracking-tighter">
        SAND AI
      </Link>
      <div className="flex gap-4 sm:gap-8 text-xs sm:text-sm font-medium tracking-wide uppercase items-center">
        <a href="#features" className="hidden sm:inline hover:text-sand-dark transition-colors">Archive</a>
        <a href="#chat" className="hidden sm:inline hover:text-sand-dark transition-colors">Protocols</a>
        <a href="#chat" className="px-4 py-1.5 bg-dune-shadow text-highlight rounded-full hover:bg-sand-dark transition-all">
          Enter
        </a>
      </div>
    </nav>
  );
}
