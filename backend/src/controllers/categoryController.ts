import { Request, Response } from 'express';
import { CategoryService } from '../services/categoryService';

export class CategoryController {
  static async getAll(req: Request, res: Response) {
    try {
      const categories = await CategoryService.getAll();
      res.json(categories);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const category = await CategoryService.getById(id);

      if (!category) {
        return res.status(404).json({ error: 'Category not found' });
      }

      res.json(category);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const { name, color } = req.body;

      if (!name || !color) {
        return res.status(400).json({ error: 'Name and color are required' });
      }

      if (name.length > 50) {
        return res.status(400).json({ error: 'Name must be 50 characters or less' });
      }

      const newCategory = await CategoryService.create(name, color);
      res.status(201).json(newCategory);
    } catch (error: any) {
      if (error.message.includes('already exists')) {
        return res.status(409).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, color } = req.body;

      if (name && name.length > 50) {
        return res.status(400).json({ error: 'Name must be 50 characters or less' });
      }

      const updatedCategory = await CategoryService.update(id, name, color);

      if (!updatedCategory) {
        return res.status(404).json({ error: 'Category not found' });
      }

      res.json(updatedCategory);
    } catch (error: any) {
      if (error.message.includes('already exists')) {
        return res.status(409).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const deleted = await CategoryService.delete(id);

      if (!deleted) {
        return res.status(404).json({ error: 'Category not found' });
      }

      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
