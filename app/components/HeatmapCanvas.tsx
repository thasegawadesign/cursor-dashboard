"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  cells: Uint32Array;
  cols: number;
  rows: number;
};

export function HeatmapCanvas({ cells, cols, rows }: Props) {
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
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "#050608";
    ctx.fillRect(0, 0, w, h);

    let max = 1;
    for (let i = 0; i < cells.length; i++) {
      if (cells[i] > max) max = cells[i];
    }

    const gap = 1;
    const cellW = (w - gap * (cols - 1)) / cols;
    const cellH = (h - gap * (rows - 1)) / rows;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const v = cells[row * cols + col] ?? 0;
        const t = Math.pow(v / max, 0.55);
        const r = Math.floor(8 + t * 220);
        const g = Math.floor(14 + t * 180);
        const b = Math.floor(40 + t * 90);
        const a = 0.15 + t * 0.85;
        ctx.fillStyle = `rgba(${r},${g},${b},${a})`;
        const x = col * (cellW + gap);
        const y = row * (cellH + gap);
        ctx.fillRect(x, y, cellW, cellH);
      }
    }

    ctx.strokeStyle = "rgba(255,255,255,0.04)";
    ctx.strokeRect(0.5, 0.5, w - 1, h - 1);
  }, [cells, cols, rows, layoutGen]);

  return (
    <canvas
      ref={ref}
      className="h-full min-h-[180px] w-full rounded-lg bg-[#050608]"
      aria-label="カーソル滞在ヒートマップ"
    />
  );
}
