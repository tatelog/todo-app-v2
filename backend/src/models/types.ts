// 優先度の型定義
export enum Priority {
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low'
}

// Todoインターフェース
export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: Priority;
  startDate?: string;
  dueDate?: string;
  categoryId?: string;
  tags: string[];
  parentId?: string;
  createdAt: string;
  updatedAt: string;
}

// カテゴリインターフェース
export interface Category {
  id: string;
  name: string;
  color: string;
  createdAt: string;
}

// タグインターフェース
export interface Tag {
  id: string;
  name: string;
  createdAt: string;
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
  startDate?: string;
  dueDate?: string;
  categoryId?: string;
  tags?: string[];
  parentId?: string;
}

// Todo更新用の入力型
export interface UpdateTodoInput {
  title?: string;
  description?: string;
  completed?: boolean;
  priority?: Priority;
  startDate?: string;
  dueDate?: string;
  categoryId?: string;
  tags?: string[];
  parentId?: string;
}

// フィルタオプション
export interface FilterOptions {
  completed?: boolean;
  priority?: Priority;
  categoryId?: string;
  tagIds?: string[];
  search?: string;
  dueDateFrom?: string;
  dueDateTo?: string;
}
