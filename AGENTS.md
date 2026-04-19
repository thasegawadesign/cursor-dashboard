<!-- BEGIN:nextjs-agent-rules -->

# Next.js（このリポジトリのバージョン）

このプロジェクトの Next.js は、一般的な学習データや古い記事の前提と **互換性がない場合があります**（API・規約・ディレクトリ構成の変更を含む）。

**実装前に必ず確認する:**

- 公式: [Next.js Documentation](https://nextjs.org/docs)（インストール済みバージョンに合わせる）
- ローカルに同梱されている場合: `node_modules/next` 配下のドキュメントや型定義を参照する
- 非推奨の記述には従わず、現在のバージョンの推奨パターンを使う

<!-- END:nextjs-agent-rules -->

# cursor-dashboard — エージェント向けガイド

ダッシュボード UI（Cursor テレメトリの可視化など）。変更は依頼の範囲に留め、既存の命名・インポート・コンポーネント分割に合わせる。

## スタック

| 領域                 | 採用                                        |
| -------------------- | ------------------------------------------- |
| フレームワーク       | Next.js 16（App Router）                    |
| UI                   | React 19、Tailwind CSS 4                    |
| パッケージマネージャ | pnpm（`packageManager` フィールドに従う）   |
| 品質                 | oxfmt、oxlint、TypeScript（strict）、Vitest |

## よく使うコマンド

| コマンド                        | 用途                                                                  |
| ------------------------------- | --------------------------------------------------------------------- |
| `pnpm dev`                      | 開発サーバー                                                          |
| `pnpm check`                    | フォーマット・Lint・型チェック・単体テスト（CI と同等の品質チェック） |
| `pnpm check:fix`                | 自動修正可能な Lint / フォーマット                                    |
| `pnpm build`                    | 本番ビルド                                                            |
| `pnpm test` / `pnpm test:watch` | Vitest                                                                |

PR 前や仕上げ時は **`pnpm check` が通る状態**を目標にする（`.github/workflows/build-check.yaml` で `pnpm check` の後に `pnpm build` が走る）。

## ディレクトリとインポートエイリアス

`tsconfig.json` の `paths` に基づく:

- `@/*` → `app/*`（例: `@/components/CursorDashboard` → `app/components/CursorDashboard`）
- `@/lib/*` → `lib/*`
- `@/hooks/*` → `hooks/*`

アプリ専用コードは主に `app/`、共有ロジックは `lib/`、React フックは `hooks/`。

## テスト

- ユニットテストは Vitest（`*.test.ts` / 配置はソース近傍も可）
- ロジック変更時は該当テストの更新・追加を検討する
