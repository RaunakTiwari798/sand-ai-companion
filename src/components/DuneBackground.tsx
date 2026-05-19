export function DuneBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-highlight" aria-hidden>
      <div className="dune-layer absolute -bottom-[20%] -left-[10%] w-[120%] h-[60%] bg-sand-light/50 rounded-[100%]" />
      <div className="dune-layer dune-layer-2 absolute -bottom-[10%] -right-[15%] w-[100%] h-[50%] bg-sand-medium/40 rounded-[100%]" />
      <div className="dune-layer dune-layer-3 absolute -bottom-[30%] left-[20%] w-[110%] h-[70%] bg-sand-dark/15 rounded-[100%]" />
      <div className="absolute inset-0 grain-overlay pointer-events-none" />
    </div>
  );
}
