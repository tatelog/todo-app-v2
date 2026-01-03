# Vercel デプロイ時のトラブルシューティング

## 1. TypeScript `import.meta.env` エラー

**エラー:**
```
error TS2339: Property 'env' does not exist on type 'ImportMeta'.
```

**原因:** Viteの `import.meta.env` をTypeScriptが認識できない

**解決:** `frontend/src/vite-env.d.ts` を作成
```typescript
/// <reference types="vite/client" />
```

## 2. サーバーレス関数のルーティング 404

**エラー:** `Request failed with status code 404` (PATCH/DELETE時)

**原因:** Vercelのサーバーレス関数は `/api/todos/:id` のようなパスパラメータに対応しない

**解決:** クエリパラメータを使用
```typescript
// NG: /api/todos/${id}
// OK: /api/todos?id=${id}
```

## 3. ビルドコマンド失敗

**エラー:** `Command "cd frontend && npm install" exited with 2`

**原因:** Vercelのビルド環境での `cd` コマンドの挙動が不安定

**解決策:**
- `--prefix` オプションを使う: `npm install --prefix frontend`
- または `installCommand: "echo skip"` でスキップしてbuildCommand内で処理

## 4. データ永続化の注意

Vercelサーバーレス関数の `/tmp` は一時的。デプロイや時間経過でリセットされる。
本番運用には外部DB（Vercel KV, Supabase等）が必要。
