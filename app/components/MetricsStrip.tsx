"use client";

type Props = {
  x: number;
  y: number;
  speed: number;
  clicks: number;
};

export function MetricsStrip({ x, y, speed, clicks }: Props) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      <Metric label="X / Y" value={`${Math.round(x)} · ${Math.round(y)}`} accent="from-cyan-400/30" />
      <Metric
        label="現在のスピード"
        value={`${speed.toFixed(2)} px/frame`}
        accent="from-amber-400/25"
      />
      <Metric label="クリック数" value={String(clicks)} accent="from-emerald-400/25" />
    </div>
  );
}

function Metric({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div
      className={`relative overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br ${accent} to-[#0a0c10] px-4 py-3`}
    >
      <p className="font-[family-name:var(--font-syne)] text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-zinc-500">
        {label}
      </p>
      <p className="mt-1 font-mono text-lg font-semibold tracking-tight text-zinc-100">{value}</p>
    </div>
  );
}
