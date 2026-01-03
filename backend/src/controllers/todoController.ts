import { Request, Response } from 'express';
import { TodoService } from '../services/todoService';
import { CreateTodoInput, UpdateTodoInput, FilterOptions } from '../models/types';

export class TodoController {
  // 全Todo取得（クエリパラメータでフィルタ）
  static async getAll(req: Request, res: Response) {
    try {
      const filters: FilterOptions = {
        completed: req.query.completed === 'true' ? true :
                   req.query.completed === 'false' ? false : undefined,
        priority: req.query.priority as any,
        categoryId: req.query.categoryId as string,
        tagIds: req.query.tagIds ? (req.query.tagIds as string).split(',') : undefined,
        search: req.query.search as string,
        dueDateFrom: req.query.dueDateFrom as string,
        dueDateTo: req.query.dueDateTo as string
      };

      const todos = await TodoService.getAll(filters);
      res.json(todos);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // 特定Todo取得
  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const todo = await TodoService.getById(id);

      if (!todo) {
        return res.status(404).json({ error: 'Todo not found' });
      }

      res.json(todo);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // Todo新規作成
  static async create(req: Request, res: Response) {
    try {
      const input: CreateTodoInput = req.body;

      // バリデーション
      if (!input.title || input.title.trim() === '') {
        return res.status(400).json({ error: 'Title is required' });
      }

      if (input.title.length > 200) {
        return res.status(400).json({ error: 'Title must be 200 characters or less' });
      }

      const newTodo = await TodoService.create(input);
      res.status(201).json(newTodo);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // Todo更新
  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const input: UpdateTodoInput = req.body;

      // タイトルのバリデーション（更新時に含まれる場合のみ）
      if (input.title !== undefined) {
        if (input.title.trim() === '') {
          return res.status(400).json({ error: 'Title cannot be empty' });
        }
        if (input.title.length > 200) {
          return res.status(400).json({ error: 'Title must be 200 characters or less' });
        }
      }

      const updatedTodo = await TodoService.update(id, input);

      if (!updatedTodo) {
        return res.status(404).json({ error: 'Todo not found' });
      }

      res.json(updatedTodo);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // Todo削除
  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const deleted = await TodoService.delete(id);

      if (!deleted) {
        return res.status(404).json({ error: 'Todo not found' });
      }

      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // 完了状態トグル
  static async toggleCompleted(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updatedTodo = await TodoService.toggleCompleted(id);

      if (!updatedTodo) {
        return res.status(404).json({ error: 'Todo not found' });
      }

      res.json(updatedTodo);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
