import { JSONFilePreset } from 'lowdb/node';
import path from 'path';
import fs from 'fs';
import { Database } from '../models/types';

// データディレクトリのパス設定
const dataDir = path.join(__dirname, '../../../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'todos.json');

// デフォルトデータ（初期カテゴリとタグ）
const defaultData: Database = {
  todos: [],
  categories: [
    {
      id: 'cat-1',
      name: '仕事',
      color: '#3B82F6',
      createdAt: '2026-01-01T00:00:00.000Z'
    },
    {
      id: 'cat-2',
      name: '個人',
      color: '#10B981',
      createdAt: '2026-01-01T00:00:00.000Z'
    },
    {
      id: 'cat-3',
      name: '緊急',
      color: '#EF4444',
      createdAt: '2026-01-01T00:00:00.000Z'
    }
  ],
  tags: [
    {
      id: 'tag-1',
      name: '重要',
      createdAt: '2026-01-01T00:00:00.000Z'
    },
    {
      id: 'tag-2',
      name: '会議',
      createdAt: '2026-01-01T00:00:00.000Z'
    }
  ]
};

let db: Awaited<ReturnType<typeof JSONFilePreset<Database>>>;

// データベース初期化関数
export async function initDatabase() {
  db = await JSONFilePreset<Database>(dbPath, defaultData);
  console.log('✅ Database initialized successfully');
  console.log(`📁 Database file: ${dbPath}`);
  return db;
}

// データベース取得関数
export function getDb() {
  if (!db) {
    throw new Error('Database not initialized. Call initDatabase() first.');
  }
  return db;
}

export default { initDatabase, getDb };
