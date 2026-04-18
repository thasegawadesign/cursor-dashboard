"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  samples: number[];
};

export function SpeedWaveform({ samples }: Props) {
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

    const padL = 8;
    const padR = 8;
    const padT = 10;
    const padB = 14;
    const innerW = w - padL - padR;
    const innerH = h - padT - padB;

    ctx.strokeStyle = "rgba(255,255,255,0.06)";
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = padT + (innerH * i) / 4;
      ctx.beginPath();
      ctx.moveTo(padL, y);
      ctx.lineTo(padL + innerW, y);
      ctx.stroke();
    }

    if (samples.length < 2) return;

    const maxV = Math.max(8, ...samples) * 1.05;
    const n = samples.length;

    const grad = ctx.createLinearGradient(0, padT, 0, padT + innerH);
    grad.addColorStop(0, "rgba(126, 224, 255, 0.95)");
    grad.addColorStop(1, "rgba(56, 189, 248, 0.15)");

    ctx.beginPath();
    for (let i = 0; i < n; i++) {
      const v = samples[i] ?? 0;
      const x = padL + (i / (n - 1)) * innerW;
      const y = padT + innerH - (v / maxV) * innerH;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = grad;
    ctx.lineWidth = 1.8;
    ctx.lineJoin = "round";
    ctx.stroke();

    ctx.lineTo(padL + innerW, padT + innerH);
    ctx.lineTo(padL, padT + innerH);
    ctx.closePath();
    ctx.fillStyle = "rgba(56, 189, 248, 0.08)";
    ctx.fill();

    ctx.fillStyle = "rgba(161, 161, 170, 0.85)";
    ctx.font = "10px ui-monospace, SFMono-Regular, Menlo, Monaco, monospace";
    ctx.fillText(`${maxV.toFixed(0)} px/f`, padL, h - 4);
  }, [samples, layoutGen]);

  return (
    <canvas
      ref={ref}
      className="h-full min-h-[140px] w-full rounded-lg bg-[#050608]"
      aria-label="スピードの波形"
    />
  );
}
