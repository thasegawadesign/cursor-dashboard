# Cursor Dashboard

ブラウザ上でマウス／ポインタの動きをリアルタイムに集計し、トレイル・速度波形・ヒートマップなどで可視化するダッシュボードです。Next.js（App Router）と React 19 で実装されています。

## 機能

- **メトリクス**: 現在座標、速度（px / frame）、クリック数
- **Move trail**: 直近 5 秒の軌跡（時間でフェード）
- **Speed history**: 速度の時系列波形
- **Session info**: 累積移動距離、最大／平均速度、アイドル時間、画面象限、ボタン押下状態、セッション経過時間
- **Speed breakdown**: 低速・中速・高速のフレーム加重比率
- **Cursor heatmap**: ビューポート正規化グリッド上の滞在密度

ポインタイベントは **現在のタブ／ウィンドウ内** に限られます。別タブやウィンドウ外では `mousemove` が届かないため、その旨 UI にも記載しています。

## 必要条件

- [Node.js](https://nodejs.org/)（LTS 推奨）
- [pnpm](https://pnpm.io/) 10.x（`package.json` の `packageManager` に合わせています）

## セットアップ

```bash
pnpm install
```

## 開発

```bash
pnpm dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開き、ページ上でマウスを動かして表示を確認します。

## その他のスクリプト

| コマンド      | 説明              |
| ------------- | ----------------- |
| `pnpm build`  | 本番用ビルド      |
| `pnpm start`  | ビルド後の起動    |
| `pnpm lint`   | ESLint            |

## プロジェクト構成（抜粋）

| パス | 役割 |
| ---- | ---- |
| `app/page.tsx` | トップページ（ダッシュボードをマウント） |
| `app/components/CursorDashboard.tsx` | メインレイアウトとパネル構成 |
| `hooks/useCursorTelemetry.ts` | ポインタの購読と `requestAnimationFrame` による集計 |
| `lib/cursorTelemetry.ts` | 象限・ヒートマップセル・速度しきい値などの純関数 |

## 技術スタック

- Next.js 16、React 19、TypeScript
- Tailwind CSS 4
- `clsx` / `tailwind-merge`（ユーティリティ）

このリポジトリの Next.js は一般的なバージョンと API が異なる場合があるため、必要に応じて `node_modules/next/dist/docs/` や `AGENTS.md` を参照してください。

## ライセンス

`package.json` の `private: true` に従い、用途はリポジトリ利用者の判断に委ねます。
