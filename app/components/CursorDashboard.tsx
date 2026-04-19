"use client";

import { HeatmapCanvas } from "@/components/HeatmapCanvas";
import { MetricsStrip } from "@/components/MetricsStrip";
import { MoveTrailCanvas } from "@/components/MoveTrailCanvas";
import { Panel } from "@/components/Panel";
import { SessionInfo } from "@/components/SessionInfo";
import { SpeedBreakdown } from "@/components/SpeedBreakdown";
import { SpeedWaveform } from "@/components/SpeedWaveform";
import { ThemeToggle } from "@/components/theme-toggle";
import { useCursorTelemetry } from "@/hooks/useCursorTelemetry";

export function CursorDashboard() {
  const t = useCursorTelemetry();

  return (
    <div className="relative min-h-screen overflow-hidden bg-zinc-100 text-zinc-900 dark:bg-[#030406] dark:text-zinc-100">
      <div
        className="pointer-events-none absolute inset-0 block opacity-[0.65] dark:hidden"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 80% 55% at 20% -10%, rgba(56,189,248,0.18), transparent 55%), radial-gradient(ellipse 60% 45% at 100% 0%, rgba(244,114,182,0.1), transparent 50%), linear-gradient(180deg, #f1f5f9 0%, #e8edf3 40%, #e2e8f0 100%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 hidden opacity-[0.55] dark:block"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 80% 55% at 20% -10%, rgba(56,189,248,0.22), transparent 55%), radial-gradient(ellipse 60% 45% at 100% 0%, rgba(244,114,182,0.12), transparent 50%), linear-gradient(180deg, #050816 0%, #030406 40%, #020308 100%)",
        }}
      />
      <div className="pointer-events-none absolute inset-0 block bg-[url('data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2780%27 height=%2780%27 viewBox=%270 0 80 80%27%3E%3Cg fill=%27none%27 stroke=%27%230f172a%27 stroke-opacity=%270.08%27 stroke-width=%271%27%3E%3Cpath d=%27M0 40h80M40 0v80%27/%3E%3C/g%3E%3C/svg%3E')] opacity-30 dark:hidden" />
      <div className="pointer-events-none absolute inset-0 hidden bg-[url('data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2780%27 height=%2780%27 viewBox=%270 0 80 80%27%3E%3Cg fill=%27none%27 stroke=%27rgba(255,255,255,0.03)%27 stroke-width=%271%27%3E%3Cpath d=%27M0 40h80M40 0v80%27/%3E%3C/g%3E%3C/svg%3E')] opacity-40 dark:block" />

      <main className="relative z-10 mx-auto flex min-h-screen max-w-[1400px] flex-col gap-6 px-4 py-8 sm:px-6 lg:px-10">
        <header className="flex flex-col gap-2 border-b border-zinc-200/90 pb-6 dark:border-white/10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-cyan-700 dark:text-cyan-300/80">
              Live telemetry
            </p>
            <h1 className="font-[family-name:var(--font-syne)] text-3xl font-bold tracking-tight sm:text-4xl">
              Cursor Dashboard
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              ブラウザ全体でポインタを追跡します。ウィンドウ外や別タブではイベントが届きません。
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 sm:justify-end">
            <ThemeToggle />
            <div className="rounded-xl border border-zinc-200/90 bg-white/80 px-4 py-2 font-mono text-[11px] text-zinc-600 shadow-sm dark:border-white/10 dark:bg-white/3 dark:text-zinc-400 dark:shadow-none">
              viewport {t.viewportW}×{t.viewportH}
            </div>
          </div>
        </header>

        <MetricsStrip x={t.x} y={t.y} speed={t.speed} clicks={t.clickCount} />

        <div className="grid flex-1 grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-5">
          <Panel
            title="Move trail"
            subtitle="直近 5s · 時間でフェード"
            className="lg:col-span-5 min-h-[220px]"
          >
            <MoveTrailCanvas trail={t.trail} viewportW={t.viewportW} viewportH={t.viewportH} />
          </Panel>

          <Panel
            title="Speed history"
            subtitle="px / frame · 直近サンプル"
            className="lg:col-span-7 min-h-[220px]"
          >
            <SpeedWaveform samples={t.speedHistory} />
          </Panel>

          <Panel title="Session info" className="lg:col-span-6 min-h-[200px]">
            <SessionInfo
              totalDistance={t.totalDistance}
              maxSpeed={t.maxSpeed}
              avgSpeed={t.avgSpeed}
              idleMs={t.idleMs}
              quadrant={t.quadrant}
              buttonState={t.buttonState}
              sessionMs={t.sessionMs}
            />
          </Panel>

          <Panel
            title="Speed breakdown"
            subtitle="フレーム加重の割合"
            className="lg:col-span-6 min-h-[200px]"
          >
            <SpeedBreakdown slow={t.slowPct} mid={t.midPct} fast={t.fastPct} />
          </Panel>

          <Panel
            title="Cursor heatmap"
            subtitle="滞在密度 · 画面正規化グリッド"
            className="lg:col-span-12 min-h-[240px]"
          >
            <HeatmapCanvas cells={t.heatCells} cols={t.heatCols} rows={t.heatRows} />
          </Panel>
        </div>
      </main>
    </div>
  );
}
