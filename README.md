<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1Rpw_Mv6eWMc-PzX45kSPNBuVbdEpjLGH

## Run Locally

**Prerequisites:**  Node.js

1. Install dependencies:
   `npm install`
2. Run the app:
   `npm run dev`

## ルールに基づくチェックコードとJSONについて

本リポジトリには、添付の「ルール・エントリーまとめ.md」をもとに、エントリー内容を自動チェックするコードとJSONを追加しました。

- ルール定義: data/rules.json
  - 種目ごとの参加人数などの基本ルールをJSONで定義しています。
- チェックコード: data/checks.ts
  - data/participants.ts の rawData もしくは data/entries.json（JSON）を読み込み、rules.json に基づいて各チームの人数などを検証できます。
  - buildValidationReportFromRaw(raw) を使うと、任意のJSON配列を渡して検証可能です（raw は eventName/team/details/members を持つ配列）。
  - さらに人ベースのチェックも行います（例：memberDetails の未登録者、有り余り、同一チーム内の重複、同一種目での複数チーム重複参加）。
  - 結果は ValidationReport オブジェクトとして生成され、App 起動時にコンソールへ出力されます。
- チェック結果のJSON: data/validation-report.json
  - 現在の rawData を基に生成した想定出力例をコミット済みです（静的ファイル）。
- エントリーJSON例: data/entries.json
  - 本Issueの資料をもとに Let’sボール運び、20人21脚、綱引き、学校対抗リレーのACKデータをJSON化しています。

使い方:
- 開発サーバー起動後、ブラウザの開発者ツール(コンソール)を開くと、`[ValidationReport]` として検証結果が表示されます。
- ルール変更は data/rules.json を編集してください。
- 参加データの変更は data/participants.ts の rawData を編集してください。

## テストの実行

このプロジェクトには、エントリーチェックの単体テストを test ディレクトリに追加しています（Vitest）。

- 依存関係のインストール後にテストを起動:
  - 対話的に実行: `npm run test`
  - 一度だけ実行（CI向け）: `npm run test:run`

テストは data/checks.ts の `buildValidationReport` を対象に、人数ルールの整合性や必須チーム（綱引き・学校対抗リレーの女子）の不足検出などを確認します。
