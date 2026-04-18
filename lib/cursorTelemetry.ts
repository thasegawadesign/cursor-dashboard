export type QuadrantLabel = "左上" | "右上" | "左下" | "右下";

export const TRAIL_MS = 5000;
export const SPEED_HISTORY_CAP = 200;
export const IDLE_SPEED = 0.12;
export const SLOW_MAX = 3.5;
export const FAST_MIN = 16;

export function quadrant(
  x: number,
  y: number,
  w: number,
  h: number,
): QuadrantLabel {
  const cx = w / 2;
  const cy = h / 2;
  const left = x < cx;
  const top = y < cy;
  if (top && left) return "左上";
  if (top && !left) return "右上";
  if (!top && left) return "左下";
  return "右下";
}

export function buttonLabels(buttons: number): string {
  if (buttons === 0) return "なし";
  const parts: string[] = [];
  if (buttons & 1) parts.push("左");
  if (buttons & 2) parts.push("右");
  if (buttons & 4) parts.push("中");
  return parts.join(" · ");
}

/** ビューポート座標をヒートマップの一次元インデックスに変換する。無効な場合は null。 */
export function heatCellIndex(
  x: number,
  y: number,
  w: number,
  h: number,
  cols: number,
  rows: number,
): number | null {
  if (w <= 0 || h <= 0 || cols <= 0 || rows <= 0) return null;
  const cx = Math.min(cols - 1, Math.max(0, Math.floor((x / w) * cols)));
  const cy = Math.min(rows - 1, Math.max(0, Math.floor((y / h) * rows)));
  return cy * cols + cx;
}
