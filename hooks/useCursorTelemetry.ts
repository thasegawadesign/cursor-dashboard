"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  buttonLabels,
  FAST_MIN,
  heatCellIndex,
  IDLE_SPEED,
  quadrant,
  SLOW_MAX,
  SPEED_HISTORY_CAP,
  TRAIL_MS,
  type QuadrantLabel,
} from "@/lib/cursorTelemetry";

export type { QuadrantLabel };

export type TrailPoint = { x: number; y: number; t: number };

export type CursorTelemetry = {
  x: number;
  y: number;
  speed: number;
  clickCount: number;
  trail: TrailPoint[];
  speedHistory: number[];
  totalDistance: number;
  maxSpeed: number;
  avgSpeed: number;
  idleMs: number;
  quadrant: QuadrantLabel;
  buttonState: string;
  slowPct: number;
  midPct: number;
  fastPct: number;
  heatCols: number;
  heatRows: number;
  heatCells: Uint32Array;
  viewportW: number;
  viewportH: number;
  sessionMs: number;
};

const initialHeatCols = 48;
const initialHeatRows = 28;

export function useCursorTelemetry() {
  const [state, setState] = useState<CursorTelemetry>(() => ({
    x: 0,
    y: 0,
    speed: 0,
    clickCount: 0,
    trail: [],
    speedHistory: [],
    totalDistance: 0,
    maxSpeed: 0,
    avgSpeed: 0,
    idleMs: 0,
    quadrant: "左上",
    buttonState: "なし",
    slowPct: 100,
    midPct: 0,
    fastPct: 0,
    heatCols: initialHeatCols,
    heatRows: initialHeatRows,
    heatCells: new Uint32Array(initialHeatCols * initialHeatRows),
    viewportW: 1,
    viewportH: 1,
    sessionMs: 0,
  }));

  const posRef = useRef({ x: 0, y: 0 });
  const lastMoveRef = useRef({ x: 0, y: 0 });
  const moveReadyRef = useRef(false);
  const lastRafRef = useRef({ x: 0, y: 0 });
  const buttonsRef = useRef(0);
  const trailRef = useRef<TrailPoint[]>([]);
  const speedHistRef = useRef<number[]>([]);
  const totalDistRef = useRef(0);
  const maxSpeedRef = useRef(0);
  const speedSumRef = useRef(0);
  const speedSamplesRef = useRef(0);
  const idleMsRef = useRef(0);
  const sessionStartRef = useRef(0);
  const rafRef = useRef(0);
  const lastTsRef = useRef(0);
  const clicksRef = useRef(0);
  const heatColsRef = useRef(initialHeatCols);
  const heatRowsRef = useRef(initialHeatRows);
  const heatRef = useRef(new Uint32Array(initialHeatCols * initialHeatRows));
  const slowRef = useRef(0);
  const midRef = useRef(0);
  const fastRef = useRef(0);

  const bumpHeat = useCallback((x: number, y: number, w: number, h: number) => {
    const cols = heatColsRef.current;
    const rows = heatRowsRef.current;
    const idx = heatCellIndex(x, y, w, h, cols, rows);
    if (idx === null) return;
    const buf = heatRef.current;
    if (idx < buf.length) buf[idx]++;
  }, []);

  useEffect(() => {
    sessionStartRef.current = performance.now();
    lastTsRef.current = sessionStartRef.current;

    const onMove = (e: MouseEvent) => {
      const nx = e.clientX;
      const ny = e.clientY;
      if (!moveReadyRef.current) {
        moveReadyRef.current = true;
        lastMoveRef.current = { x: nx, y: ny };
        lastRafRef.current = { x: nx, y: ny };
        posRef.current = { x: nx, y: ny };
        buttonsRef.current = e.buttons;
        const now = performance.now();
        trailRef.current.push({ x: nx, y: ny, t: now });
        const w = window.innerWidth;
        const h = window.innerHeight;
        bumpHeat(nx, ny, w, h);
        return;
      }
      const ox = lastMoveRef.current.x;
      const oy = lastMoveRef.current.y;
      const dx = nx - ox;
      const dy = ny - oy;
      const d = Math.hypot(dx, dy);
      if (d > 0) totalDistRef.current += d;
      lastMoveRef.current = { x: nx, y: ny };
      posRef.current = { x: nx, y: ny };
      buttonsRef.current = e.buttons;
      const now = performance.now();
      trailRef.current.push({ x: nx, y: ny, t: now });
      const w = window.innerWidth;
      const h = window.innerHeight;
      bumpHeat(nx, ny, w, h);
    };

    const onPointerDown = () => {
      clicksRef.current += 1;
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("click", onPointerDown);
    const tick = (ts: number) => {
      const lastTs = lastTsRef.current;
      const dt = Math.min(64, ts - lastTs);
      lastTsRef.current = ts;

      const cur = posRef.current;
      const prev = lastRafRef.current;
      const rdx = cur.x - prev.x;
      const rdy = cur.y - prev.y;
      const speed = Math.hypot(rdx, rdy);
      lastRafRef.current = { ...cur };

      if (speed < IDLE_SPEED && dt > 0) {
        idleMsRef.current += dt;
      }

      if (speed <= SLOW_MAX) slowRef.current++;
      else if (speed < FAST_MIN) midRef.current++;
      else fastRef.current++;

      const hist = speedHistRef.current;
      hist.push(speed);
      if (hist.length > SPEED_HISTORY_CAP) hist.shift();

      if (speed > maxSpeedRef.current) maxSpeedRef.current = speed;
      speedSumRef.current += speed;
      speedSamplesRef.current += 1;

      const now = ts;
      const trail = trailRef.current;
      const cutoff = now - TRAIL_MS;
      while (trail.length > 0 && trail[0].t < cutoff) trail.shift();

      const w = window.innerWidth;
      const h = window.innerHeight;
      const totalB = slowRef.current + midRef.current + fastRef.current;
      const slowPct = totalB ? (slowRef.current / totalB) * 100 : 100;
      const midPct = totalB ? (midRef.current / totalB) * 100 : 0;
      const fastPct = totalB ? (fastRef.current / totalB) * 100 : 0;
      const samples = speedSamplesRef.current || 1;
      const avgSpeed = speedSumRef.current / samples;

      setState({
        x: cur.x,
        y: cur.y,
        speed,
        clickCount: clicksRef.current,
        trail: [...trail],
        speedHistory: [...hist],
        totalDistance: totalDistRef.current,
        maxSpeed: maxSpeedRef.current,
        avgSpeed,
        idleMs: idleMsRef.current,
        quadrant: quadrant(cur.x, cur.y, w, h),
        buttonState: buttonLabels(buttonsRef.current),
        slowPct,
        midPct,
        fastPct,
        heatCols: heatColsRef.current,
        heatRows: heatRowsRef.current,
        heatCells: new Uint32Array(heatRef.current),
        viewportW: w,
        viewportH: h,
        sessionMs: ts - sessionStartRef.current,
      });

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("click", onPointerDown);
    };
  }, [bumpHeat]);

  return state;
}
