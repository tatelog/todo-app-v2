import { Request, Response } from 'express';
import { TagService } from '../services/tagService';

export class TagController {
  static async getAll(req: Request, res: Response) {
    try {
      const tags = await TagService.getAll();
      res.json(tags);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const tag = await TagService.getById(id);

      if (!tag) {
        return res.status(404).json({ error: 'Tag not found' });
      }

      res.json(tag);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const { name } = req.body;

      if (!name) {
        return res.status(400).json({ error: 'Name is required' });
      }

      if (name.length > 30) {
        return res.status(400).json({ error: 'Name must be 30 characters or less' });
      }

      const newTag = await TagService.create(name);
      res.status(201).json(newTag);
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
      const { name } = req.body;

      if (!name) {
        return res.status(400).json({ error: 'Name is required' });
      }

      if (name.length > 30) {
        return res.status(400).json({ error: 'Name must be 30 characters or less' });
      }

      const updatedTag = await TagService.update(id, name);

      if (!updatedTag) {
        return res.status(404).json({ error: 'Tag not found' });
      }

      res.json(updatedTag);
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
      const deleted = await TagService.delete(id);

      if (!deleted) {
        return res.status(404).json({ error: 'Tag not found' });
      }

      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
