"use client";

import { useEffect, useRef, useState } from "react";
import type { TrailPoint } from "@/hooks/useCursorTelemetry";

const TRAIL_MS = 5000;

type Props = {
  trail: TrailPoint[];
  viewportW: number;
  viewportH: number;
};

export function MoveTrailCanvas({ trail, viewportW, viewportH }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  const [layoutGen, setLayoutGen] = useState(0);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ro = new ResizeObserver(() => setLayoutGen((n) => n + 1));
    ro.observe(canvas);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const cssW = canvas.clientWidth;
    const cssH = canvas.clientHeight;
    canvas.width = Math.floor(cssW * dpr);
    canvas.height = Math.floor(cssH * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    ctx.clearRect(0, 0, cssW, cssH);

    const pad = 10;
    const vw = Math.max(1, viewportW);
    const vh = Math.max(1, viewportH);
    const innerW = cssW - pad * 2;
    const innerH = cssH - pad * 2;

    const mapX = (x: number) => pad + (x / vw) * innerW;
    const mapY = (y: number) => pad + (y / vh) * innerH;

    const now = performance.now();

    if (trail.length < 2) return;

    for (let i = 1; i < trail.length; i++) {
      const a = trail[i - 1];
      const b = trail[i];
      const age = now - b.t;
      const fade = 1 - age / TRAIL_MS;
      if (fade <= 0) continue;
      const alpha = Math.max(0, Math.min(1, fade)) * 0.92;
      ctx.strokeStyle = `rgba(126, 224, 255, ${alpha})`;
      ctx.lineWidth = 1.6 + fade * 1.4;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.beginPath();
      ctx.moveTo(mapX(a.x), mapY(a.y));
      ctx.lineTo(mapX(b.x), mapY(b.y));
      ctx.stroke();
    }

    const head = trail[trail.length - 1];
    const headFade = Math.max(0, 1 - (now - head.t) / TRAIL_MS);
    ctx.fillStyle = `rgba(250, 204, 21, ${0.35 + headFade * 0.55})`;
    ctx.beginPath();
    ctx.arc(mapX(head.x), mapY(head.y), 3.2, 0, Math.PI * 2);
    ctx.fill();
  }, [trail, viewportW, viewportH, layoutGen]);

  return (
    <canvas
      ref={ref}
      className="h-full min-h-[160px] w-full rounded-lg bg-[#050608]"
      aria-label="直近5秒のカーソル軌跡"
    />
  );
}
