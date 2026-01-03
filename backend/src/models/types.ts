// 優先度の型定義
export enum Priority {
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low'
}

// Todoインターフェース
export interface Todo {
  id: string;                    // UUID
  title: string;                 // 必須、最大200文字
  description?: string;          // オプション
  completed: boolean;            // デフォルトfalse
  priority: Priority;            // デフォルトMEDIUM
  dueDate?: string;              // YYYY-MM-DD形式
  categoryId?: string;           // カテゴリID
  tags: string[];                // タグID配列
  createdAt: string;             // ISO 8601形式
  updatedAt: string;             // ISO 8601形式
}

// カテゴリインターフェース
export interface Category {
  id: string;                    // UUID
  name: string;                  // 必須、ユニーク、最大50文字
  color: string;                 // Hex color (#RRGGBB)
  createdAt: string;             // ISO 8601形式
}

// タグインターフェース
export interface Tag {
  id: string;                    // UUID
  name: string;                  // 必須、ユニーク、最大30文字
  createdAt: string;             // ISO 8601形式
}

// データベーススキーマ
export interface Database {
  todos: Todo[];
  categories: Category[];
  tags: Tag[];
}

// Todo作成用の入力型
export interface CreateTodoInput {
  title: string;
  description?: string;
  priority?: Priority;
  dueDate?: string;
  categoryId?: string;
  tags?: string[];
}

// Todo更新用の入力型
export interface UpdateTodoInput {
  title?: string;
  description?: string;
  completed?: boolean;
  priority?: Priority;
  dueDate?: string;
  categoryId?: string;
  tags?: string[];
}

// フィルタオプション
export interface FilterOptions {
  completed?: boolean;
  priority?: Priority;
  categoryId?: string;
  tagIds?: string[];
  search?: string;              // タイトル・説明文の部分一致検索
  dueDateFrom?: string;         // 期限開始日
  dueDateTo?: string;           // 期限終了日
}
