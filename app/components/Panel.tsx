"use client";

import type { ReactNode } from "react";

type PanelProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
};

export function Panel({ title, subtitle, children, className = "" }: PanelProps) {
  return (
    <section
      className={`relative flex flex-col overflow-hidden rounded-2xl border border-zinc-200/90 bg-white/85 shadow-[0_1px_0_rgba(15,23,42,0.04),inset_0_1px_0_rgba(255,255,255,0.9)] backdrop-blur-md dark:border-white/10 dark:bg-[#0d1117]/85 dark:shadow-[0_0_0_1px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.04)] ${className}`}
    >
      <header className="flex shrink-0 items-baseline justify-between gap-2 border-b border-zinc-200/80 px-4 py-3 dark:border-white/5">
        <div>
          <h2 className="font-[family-name:var(--font-syne)] text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-cyan-700 dark:text-[#7ee0ff]/90">
            {title}
          </h2>
          {subtitle ? (
            <p className="mt-0.5 font-mono text-[10px] text-zinc-500">{subtitle}</p>
          ) : null}
        </div>
      </header>
      <div className="relative min-h-0 flex-1 p-3">{children}</div>
    </section>
  );
}
