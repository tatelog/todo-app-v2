import { v4 as uuidv4 } from 'uuid';
import { getDb } from '../config/database';
import { Category } from '../models/types';

export class CategoryService {
  static async getAll(): Promise<Category[]> {
    const db = getDb();
    return db.data.categories;
  }

  static async getById(id: string): Promise<Category | null> {
    const db = getDb();
    const category = db.data.categories.find(c => c.id === id);
    return category || null;
  }

  static async create(name: string, color: string): Promise<Category> {
    const db = getDb();

    // 名前の重複チェック
    const existing = db.data.categories.find(c => c.name === name);
    if (existing) {
      throw new Error('Category with this name already exists');
    }

    const newCategory: Category = {
      id: uuidv4(),
      name,
      color,
      createdAt: new Date().toISOString()
    };

    db.data.categories.push(newCategory);
    await db.write();

    return newCategory;
  }

  static async update(id: string, name?: string, color?: string): Promise<Category | null> {
    const db = getDb();
    const index = db.data.categories.findIndex(c => c.id === id);

    if (index === -1) {
      return null;
    }

    // 名前の重複チェック（更新対象以外で）
    if (name && name !== db.data.categories[index].name) {
      const existing = db.data.categories.find(c => c.name === name && c.id !== id);
      if (existing) {
        throw new Error('Category with this name already exists');
      }
    }

    if (name) db.data.categories[index].name = name;
    if (color) db.data.categories[index].color = color;

    await db.write();

    return db.data.categories[index];
  }

  static async delete(id: string): Promise<boolean> {
    const db = getDb();
    const initialLength = db.data.categories.length;

    // カテゴリを削除
    db.data.categories = db.data.categories.filter(c => c.id !== id);

    // 関連するTodoのcategoryIdをnullに
    db.data.todos.forEach(todo => {
      if (todo.categoryId === id) {
        todo.categoryId = undefined;
      }
    });

    if (db.data.categories.length < initialLength) {
      await db.write();
      return true;
    }

    return false;
  }
}
