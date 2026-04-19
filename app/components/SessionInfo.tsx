"use client";

import type { QuadrantLabel } from "@/lib/cursorTelemetry";

type Props = {
  totalDistance: number;
  maxSpeed: number;
  avgSpeed: number;
  idleMs: number;
  quadrant: QuadrantLabel;
  buttonState: string;
  sessionMs: number;
};

function formatDuration(ms: number) {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const r = s % 60;
  if (m <= 0) return `${r}s`;
  return `${m}m ${r.toString().padStart(2, "0")}s`;
}

export function SessionInfo({
  totalDistance,
  maxSpeed,
  avgSpeed,
  idleMs,
  quadrant,
  buttonState,
  sessionMs,
}: Props) {
  const rows: { k: string; v: string }[] = [
    { k: "総移動距離", v: `${Math.round(totalDistance)} px` },
    { k: "最高速度", v: `${maxSpeed.toFixed(2)} px/frame` },
    { k: "平均速度", v: `${avgSpeed.toFixed(2)} px/frame` },
    { k: "アイドル時間", v: formatDuration(idleMs) },
    { k: "クアドラント", v: quadrant },
    { k: "ボタン状態", v: buttonState },
    { k: "セッション経過", v: formatDuration(sessionMs) },
  ];

  return (
    <dl className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
      {rows.map((row) => (
        <div
          key={row.k}
          className="flex items-baseline justify-between gap-3 border-b border-zinc-200/80 pb-2 dark:border-white/5"
        >
          <dt className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">{row.k}</dt>
          <dd className="font-mono text-sm text-zinc-900 dark:text-zinc-100">{row.v}</dd>
        </div>
      ))}
    </dl>
  );
}
