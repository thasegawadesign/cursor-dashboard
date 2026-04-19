import { describe, expect, it } from "vitest";
import {
  buttonLabels,
  FAST_MIN,
  heatCellIndex,
  IDLE_SPEED,
  quadrant,
  SLOW_MAX,
  SPEED_HISTORY_CAP,
  TRAIL_MS,
} from "./cursorTelemetry";

describe("quadrant", () => {
  const w = 100;
  const h = 80;

  it("左上: 中心より左かつ上", () => {
    expect(quadrant(0, 0, w, h)).toBe("左上");
    expect(quadrant(49, 39, w, h)).toBe("左上");
  });

  it("右上: 中心より右かつ上", () => {
    expect(quadrant(50, 0, w, h)).toBe("右上");
    expect(quadrant(99, 39, w, h)).toBe("右上");
  });

  it("左下: 中心より左かつ下", () => {
    expect(quadrant(0, 40, w, h)).toBe("左下");
    expect(quadrant(49, 79, w, h)).toBe("左下");
  });

  it("右下: 中心より右かつ下", () => {
    expect(quadrant(50, 40, w, h)).toBe("右下");
    expect(quadrant(99, 79, w, h)).toBe("右下");
  });
});

describe("buttonLabels", () => {
  it("押されていないときは なし", () => {
    expect(buttonLabels(0)).toBe("なし");
  });

  it("ビットごとのラベル", () => {
    expect(buttonLabels(1)).toBe("左");
    expect(buttonLabels(2)).toBe("右");
    expect(buttonLabels(4)).toBe("中");
  });

  it("複数ボタンは · で連結", () => {
    expect(buttonLabels(1 | 2)).toBe("左 · 右");
    expect(buttonLabels(1 | 4)).toBe("左 · 中");
    expect(buttonLabels(1 | 2 | 4)).toBe("左 · 右 · 中");
  });
});

describe("heatCellIndex", () => {
  it("無効な寸法・分割数は null", () => {
    expect(heatCellIndex(0, 0, 0, 100, 10, 10)).toBeNull();
    expect(heatCellIndex(0, 0, 100, 0, 10, 10)).toBeNull();
    expect(heatCellIndex(0, 0, 100, 100, 0, 10)).toBeNull();
    expect(heatCellIndex(0, 0, 100, 100, 10, 0)).toBeNull();
  });

  it("左上は 0、右下は cols*rows - 1 にクランプ", () => {
    const w = 100;
    const h = 100;
    const cols = 10;
    const rows = 10;
    expect(heatCellIndex(0, 0, w, h, cols, rows)).toBe(0);
    expect(heatCellIndex(100, 100, w, h, cols, rows)).toBe(99);
  });

  it("グリッド位置が期待どおり", () => {
    const w = 200;
    const h = 100;
    const cols = 4;
    const rows = 2;
    // x 0..49 -> col 0; y 0..49 -> row 0 -> index 0
    expect(heatCellIndex(0, 0, w, h, cols, rows)).toBe(0);
    // x 150..199 -> col 3; y 50..99 -> row 1 -> row*cols+col = 7
    expect(heatCellIndex(199, 99, w, h, cols, rows)).toBe(7);
  });
});

describe("telemetry constants", () => {
  it("エクスポートされた定数が正の有限値", () => {
    expect(TRAIL_MS).toBeGreaterThan(0);
    expect(SPEED_HISTORY_CAP).toBeGreaterThan(0);
    expect(IDLE_SPEED).toBeGreaterThan(0);
    expect(SLOW_MAX).toBeGreaterThan(0);
    expect(FAST_MIN).toBeGreaterThan(0);
  });
});
