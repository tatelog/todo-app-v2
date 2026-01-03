import { v4 as uuidv4 } from 'uuid';
import { getDb } from '../config/database';
import { Tag } from '../models/types';

export class TagService {
  static async getAll(): Promise<Tag[]> {
    const db = getDb();
    return db.data.tags;
  }

  static async getById(id: string): Promise<Tag | null> {
    const db = getDb();
    const tag = db.data.tags.find(t => t.id === id);
    return tag || null;
  }

  static async create(name: string): Promise<Tag> {
    const db = getDb();

    // 名前の重複チェック
    const existing = db.data.tags.find(t => t.name === name);
    if (existing) {
      throw new Error('Tag with this name already exists');
    }

    const newTag: Tag = {
      id: uuidv4(),
      name,
      createdAt: new Date().toISOString()
    };

    db.data.tags.push(newTag);
    await db.write();

    return newTag;
  }

  static async update(id: string, name: string): Promise<Tag | null> {
    const db = getDb();
    const index = db.data.tags.findIndex(t => t.id === id);

    if (index === -1) {
      return null;
    }

    // 名前の重複チェック（更新対象以外で）
    if (name !== db.data.tags[index].name) {
      const existing = db.data.tags.find(t => t.name === name && t.id !== id);
      if (existing) {
        throw new Error('Tag with this name already exists');
      }
    }

    db.data.tags[index].name = name;
    await db.write();

    return db.data.tags[index];
  }

  static async delete(id: string): Promise<boolean> {
    const db = getDb();
    const initialLength = db.data.tags.length;

    // タグを削除
    db.data.tags = db.data.tags.filter(t => t.id !== id);

    // 関連するTodoのtagsから削除
    db.data.todos.forEach(todo => {
      todo.tags = todo.tags.filter(tagId => tagId !== id);
    });

    if (db.data.tags.length < initialLength) {
      await db.write();
      return true;
    }

    return false;
  }
}
