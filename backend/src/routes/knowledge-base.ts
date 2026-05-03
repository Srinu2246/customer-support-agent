import { Router, Request, Response } from 'express';
import {
  getKB,
  addKBEntry,
  updateKBEntry,
  deleteKBEntry,
  searchKB,
  getKBByCategory,
} from '../services/knowledge-base.js';

const router = Router();

interface KBRequest extends Request {
  body: {
    id?: string;
    title?: string;
    content?: string;
    category?: string;
    query?: string;
  };
  params: {
    id?: string;
  };
}

// GET /api/knowledge-base - Get all KB entries
router.get('/', async (req: KBRequest, res: Response) => {
  try {
    const kb = await getKB();
    res.json(kb);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch KB' });
  }
});

// POST /api/knowledge-base - Add new KB entry
router.post('/', async (req: KBRequest, res: Response) => {
  try {
    const { title, content, category } = req.body;

    if (!title || !content || !category) {
      return res.status(400).json({
        error: 'Title, content, and category are required',
      });
    }

    const entry = await addKBEntry(title, content, category);
    res.status(201).json(entry);
  } catch (error) {
    console.error('Error adding KB entry:', error);
    res.status(500).json({ error: 'Failed to add KB entry' });
  }
});

// GET /api/knowledge-base/search - Search KB
router.get('/search', async (req: KBRequest, res: Response) => {
  try {
    const { q } = req.query;

    if (!q || typeof q !== 'string') {
      return res.status(400).json({ error: 'Query parameter is required' });
    }

    const results = await searchKB(q);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'Search failed' });
  }
});

// GET /api/knowledge-base/category/:category - Get by category
router.get('/category/:category', async (req: KBRequest, res: Response) => {
  try {
    const { category } = req.params;
    const results = await getKBByCategory(category);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch by category' });
  }
});

// GET /api/knowledge-base/:id - Get single entry
router.get('/:id', async (req: KBRequest, res: Response) => {
  try {
    const kb = await getKB();
    const entry = kb.find(e => e.id === req.params.id);

    if (!entry) {
      return res.status(404).json({ error: 'KB entry not found' });
    }

    res.json(entry);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch KB entry' });
  }
});

// PUT /api/knowledge-base/:id - Update KB entry
router.put('/:id', async (req: KBRequest, res: Response) => {
  try {
    const { title, content, category } = req.body;

    if (!title || !content || !category) {
      return res.status(400).json({
        error: 'Title, content, and category are required',
      });
    }

    const updated = await updateKBEntry(req.params.id, title, content, category);

    if (!updated) {
      return res.status(404).json({ error: 'KB entry not found' });
    }

    res.json(updated);
  } catch (error) {
    console.error('Error updating KB entry:', error);
    res.status(500).json({ error: 'Failed to update KB entry' });
  }
});

// DELETE /api/knowledge-base/:id - Delete KB entry
router.delete('/:id', async (req: KBRequest, res: Response) => {
  try {
    const deleted = await deleteKBEntry(req.params.id);

    if (!deleted) {
      return res.status(404).json({ error: 'KB entry not found' });
    }

    res.json({ message: 'KB entry deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete KB entry' });
  }
});

export default router;
