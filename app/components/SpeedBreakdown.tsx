"use client";

type Props = {
  slow: number;
  mid: number;
  fast: number;
};

export function SpeedBreakdown({ slow, mid, fast }: Props) {
  return (
    <div className="flex flex-col gap-4">
      <Bar label="Slow" pct={slow} tone="bg-cyan-500/80" hint="< 3.5 px/frame" />
      <Bar label="Mid" pct={mid} tone="bg-amber-400/85" hint="3.5 – 16 px/frame" />
      <Bar label="Fast" pct={fast} tone="bg-rose-500/80" hint="> 16 px/frame" />
    </div>
  );
}

function Bar({
  label,
  pct,
  tone,
  hint,
}: {
  label: string;
  pct: number;
  tone: string;
  hint: string;
}) {
  const width = Math.max(0, Math.min(100, pct));
  return (
    <div>
      <div className="mb-1 flex items-end justify-between gap-2">
        <span className="font-mono text-xs font-medium tracking-wide text-zinc-300">{label}</span>
        <span className="font-mono text-[11px] text-zinc-500">{hint}</span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-zinc-800/90 ring-1 ring-white/5">
        <div
          className={`h-full rounded-full ${tone} shadow-[0_0_12px_rgba(56,189,248,0.25)] transition-[width] duration-150 ease-out`}
          style={{ width: `${width}%` }}
        />
      </div>
      <p className="mt-1 text-right font-mono text-[11px] text-zinc-400">{width.toFixed(1)}%</p>
    </div>
  );
}
