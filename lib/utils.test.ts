import { describe, expect, it } from "vitest";
import { cn } from "./utils";

describe("cn", () => {
  it("クラス名を結合する", () => {
    expect(cn("a", "b")).toBe("a b");
  });

  it("tailwind-merge で競合するユーティリティを後勝ちにまとめる", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
  });

  it("falsy な値を無視する", () => {
    const omitSecondary = (): boolean => false;
    expect(cn("foo", omitSecondary() && "bar", undefined, "baz")).toBe("foo baz");
  });
});
