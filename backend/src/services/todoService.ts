import { v4 as uuidv4 } from 'uuid';
import { getDb } from '../config/database';
import { Todo, CreateTodoInput, UpdateTodoInput, Priority, FilterOptions } from '../models/types';

export class TodoService {
  // 全Todo取得（フィルタ対応）
  static async getAll(filters?: FilterOptions): Promise<Todo[]> {
    const db = getDb();
    let todos = db.data.todos;

    // フィルタリング
    if (filters) {
      if (filters.completed !== undefined) {
        todos = todos.filter(t => t.completed === filters.completed);
      }
      if (filters.priority) {
        todos = todos.filter(t => t.priority === filters.priority);
      }
      if (filters.categoryId) {
        todos = todos.filter(t => t.categoryId === filters.categoryId);
      }
      if (filters.tagIds && filters.tagIds.length > 0) {
        todos = todos.filter(t =>
          filters.tagIds!.some(tagId => t.tags.includes(tagId))
        );
      }
      if (filters.search) {
        const search = filters.search.toLowerCase();
        todos = todos.filter(t =>
          t.title.toLowerCase().includes(search) ||
          (t.description && t.description.toLowerCase().includes(search))
        );
      }
      if (filters.dueDateFrom) {
        todos = todos.filter(t =>
          t.dueDate && t.dueDate >= filters.dueDateFrom!
        );
      }
      if (filters.dueDateTo) {
        todos = todos.filter(t =>
          t.dueDate && t.dueDate <= filters.dueDateTo!
        );
      }
    }

    return todos;
  }

  // IDで特定のTodo取得
  static async getById(id: string): Promise<Todo | null> {
    const db = getDb();
    const todo = db.data.todos.find(t => t.id === id);
    return todo || null;
  }

  // Todo新規作成
  static async create(input: CreateTodoInput): Promise<Todo> {
    const db = getDb();

    const newTodo: Todo = {
      id: uuidv4(),
      title: input.title,
      description: input.description,
      completed: false,
      priority: input.priority || Priority.MEDIUM,
      dueDate: input.dueDate,
      categoryId: input.categoryId,
      tags: input.tags || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    db.data.todos.push(newTodo);
    await db.write();

    return newTodo;
  }

  // Todo更新
  static async update(id: string, input: UpdateTodoInput): Promise<Todo | null> {
    const db = getDb();
    const index = db.data.todos.findIndex(t => t.id === id);

    if (index === -1) {
      return null;
    }

    const updatedTodo: Todo = {
      ...db.data.todos[index],
      ...input,
      updatedAt: new Date().toISOString()
    };

    db.data.todos[index] = updatedTodo;
    await db.write();

    return updatedTodo;
  }

  // Todo削除
  static async delete(id: string): Promise<boolean> {
    const db = getDb();
    const initialLength = db.data.todos.length;

    db.data.todos = db.data.todos.filter(t => t.id !== id);

    if (db.data.todos.length < initialLength) {
      await db.write();
      return true;
    }

    return false;
  }

  // 完了状態トグル
  static async toggleCompleted(id: string): Promise<Todo | null> {
    const db = getDb();
    const index = db.data.todos.findIndex(t => t.id === id);

    if (index === -1) {
      return null;
    }

    db.data.todos[index].completed = !db.data.todos[index].completed;
    db.data.todos[index].updatedAt = new Date().toISOString();

    await db.write();

    return db.data.todos[index];
  }
}
