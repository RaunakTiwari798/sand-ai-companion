import { Mic, MicOff } from "lucide-react";

interface Props {
  listening: boolean;
  onClick: () => void;
}

export function VoiceOrb({ listening, onClick }: Props) {
  return (
    <div className="pt-4 flex flex-col items-center gap-4">
      <div className="relative">
        <div className={`absolute inset-0 rounded-full blur-xl bg-sand-medium/40 ${listening ? "anim-pulse-orb" : ""}`} />
        <button
          onClick={onClick}
          aria-label={listening ? "Stop listening" : "Start voice chat"}
          className="relative size-24 rounded-full bg-gradient-to-br from-sand-light via-sand-medium to-sand-dark shadow-inner shadow-white/40 flex items-center justify-center cursor-pointer transition-transform active:scale-95 hover:scale-105"
        >
          {listening ? (
            <MicOff className="size-8 text-dune-shadow" strokeWidth={2.2} />
          ) : (
            <Mic className="size-8 text-dune-shadow" strokeWidth={2.2} />
          )}
        </button>
      </div>
      <div className="text-[10px] font-bold uppercase tracking-[0.25em] text-sand-dark">
        {listening ? (
          <span className="flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-sand-dark animate-pulse" />
            Listening…
          </span>
        ) : (
          "Tap to speak"
        )}
      </div>
    </div>
  );
}
