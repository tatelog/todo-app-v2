# Todo App - 株式会社建ログ

社内業務効率化用のシンプルなTodo管理アプリケーション

## 📋 概要

このアプリは、建設業界特化AI BPOカンパニーである株式会社建ログの社内業務効率化ツールとして開発されました。タスク管理の基本機能に加え、優先度設定、期限管理、カテゴリ分類などの機能を備えています。

## ✨ ビジネス価値

- **タスクの優先度・期限管理**: 重要度と緊急度に基づいた効率的なタスク処理
- **カテゴリ・タグによる分類**: 案件別・プロジェクト別のタスク整理
- **完了状況の可視化**: チーム全体の生産性向上

## 🛠️ 技術スタック

### Backend
- **Node.js** 18+
- **Express.js** 4.18.2
- **TypeScript** 5.9.3
- **lowdb** 7.0.1 (JSONデータベース)
- **UUID** 10.0.0

### Frontend
- **React** 19.0.0
- **TypeScript** 5.9.3
- **Vite** 7.0.5
- **Axios** (API通信)

### 開発ツール
- **nodemon + ts-node** (Backend開発サーバー)
- **concurrently** (Backend/Frontend同時起動)

## 🚀 クイックスタート

### 前提条件
- Node.js 18以上
- npm 9以上

### インストール

```bash
# プロジェクトルートで全依存関係をインストール
cd 200.建ログDB/todo-app
npm run install:all
```

### 開発サーバー起動

```bash
# Backend (port 5000) + Frontend (port 3000) を同時起動
npm run dev
```

個別起動の場合:
```bash
# Backendのみ
npm run dev:backend

# Frontendのみ
npm run dev:frontend
```

### アクセス
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/health

## 🎯 主要機能

### 基本機能
1. **Todo CRUD操作**
   - タスクの作成・表示・編集・削除
   - 完了チェック機能

2. **優先度設定**
   - 高・中・低の3段階
   - 優先度別の色分け表示

3. **期限日設定**
   - 期限日の設定
   - 期限超過の警告表示

4. **カテゴリ管理**
   - カテゴリの作成・編集・削除
   - カラーコード設定
   - 初期カテゴリ: 仕事、個人、緊急

5. **タグ管理**
   - タグの作成・編集・削除
   - 複数タグの付与
   - 初期タグ: 重要、会議

### UI/UX
- 直感的なフォームインターフェース
- リアルタイムの完了率表示
- 優先度・期限に応じたソート
- レスポンシブデザイン対応

## 📡 API仕様

### Todos
- `GET /api/todos` - 全Todo取得（クエリパラメータでフィルタ可能）
- `GET /api/todos/:id` - 特定Todo取得
- `POST /api/todos` - Todo新規作成
- `PATCH /api/todos/:id` - Todo更新
- `DELETE /api/todos/:id` - Todo削除

### Categories
- `GET /api/categories` - 全カテゴリ取得
- `POST /api/categories` - カテゴリ作成
- `PATCH /api/categories/:id` - カテゴリ更新
- `DELETE /api/categories/:id` - カテゴリ削除

### Tags
- `GET /api/tags` - 全タグ取得
- `POST /api/tags` - タグ作成
- `PATCH /api/tags/:id` - タグ更新
- `DELETE /api/tags/:id` - タグ削除

### リクエスト例

**Todo作成:**
```json
POST /api/todos
{
  "title": "クライアント向け提案書作成",
  "description": "FASTER案件の提案資料",
  "priority": "high",
  "dueDate": "2026-01-05",
  "categoryId": "cat-1",
  "tags": ["tag-1"]
}
```

**レスポンス:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "クライアント向け提案書作成",
  "description": "FASTER案件の提案資料",
  "completed": false,
  "priority": "high",
  "dueDate": "2026-01-05",
  "categoryId": "cat-1",
  "tags": ["tag-1"],
  "createdAt": "2026-01-01T10:30:00.000Z",
  "updatedAt": "2026-01-01T10:30:00.000Z"
}
```

## 📁 プロジェクト構造

```
todo-app/
├── backend/                    # Express + lowdb API
│   ├── src/
│   │   ├── config/            # データベース設定
│   │   ├── controllers/       # ビジネスロジック
│   │   ├── models/            # 型定義
│   │   ├── routes/            # APIルート
│   │   ├── services/          # データアクセス層
│   │   └── server.ts          # エントリーポイント
│   ├── data/                  # JSONデータベース
│   ├── package.json
│   └── tsconfig.json
├── frontend/                  # React + Vite UI
│   ├── src/
│   │   ├── components/       # Reactコンポーネント
│   │   ├── hooks/            # カスタムhooks
│   │   ├── services/         # API通信
│   │   ├── types/            # 型定義
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
├── package.json              # Workspace設定
└── README.md                 # このファイル
```

## 🔧 ビルド

```bash
# 全体ビルド
npm run build

# 個別ビルド
npm run build:backend
npm run build:frontend
```

## 🚢 本番起動

```bash
# Backend本番サーバー起動
npm start
```

## ⚠️ トラブルシューティング

### ポート競合エラー
```bash
# Windowsの場合、使用中のポートを確認
netstat -ano | findstr :5000
netstat -ano | findstr :3000

# プロセスを終了
taskkill /PID <プロセスID> /F
```

### 依存関係エラー
```bash
# node_modulesとpackage-lock.jsonを削除して再インストール
rm -rf node_modules package-lock.json
npm run install:all
```

### Backend起動エラー
```bash
# TypeScriptコンパイルエラーの確認
cd backend
npm run build
```

## 📝 ライセンス

**UNLICENSED** - 株式会社建ログ社内利用のみ

## 👥 開発者

**株式会社建ログ** - 建設業界特化AI BPOカンパニー

---

**開発日**: 2026年1月
**バージョン**: 1.0.0
