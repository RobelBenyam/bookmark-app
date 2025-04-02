import express from 'express';
import { prisma } from '../lib/prisma';
import { authenticateToken } from '../middleware/auth';
import { CreateTagBody, UpdateTagBody, AuthenticatedRequest } from '../types/express';

const router = express.Router();

// Get all tags for the authenticated user
router.get('/', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const tags = await prisma.tag.findMany({
      where: { userId: req.user.id },
      orderBy: { name: 'asc' },
      include: { links: true },
    });
    res.json(tags);
  } catch (error) {
    console.error('Error fetching tags:', error);
    res.status(500).json({ error: 'Failed to fetch tags' });
  }
});

// Create a new tag
router.post('/', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const { name } = req.body as CreateTagBody;
    const tag = await prisma.tag.create({
      data: {
        name,
        userId: req.user.id,
      },
      include: { links: true },
    });
    res.status(201).json(tag);
  } catch (error: any) {
    console.error('Error creating tag:', error);
    if (error?.code === 'P2002') {
      return res.status(400).json({ error: 'Tag name already exists for this user' });
    }
    res.status(400).json({ error: 'Failed to create tag' });
  }
});

// Update a tag
router.put('/:id', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body as UpdateTagBody;

    const tag = await prisma.tag.update({
      where: {
        id,
        userId: req.user.id,
      },
      data: { name },
      include: { links: true },
    });

    res.json(tag);
  } catch (error: any) {
    console.error('Error updating tag:', error);
    if (error?.code === 'P2002') {
      return res.status(400).json({ error: 'Tag name already exists for this user' });
    }
    res.status(400).json({ error: 'Failed to update tag' });
  }
});

// Delete a tag
router.delete('/:id', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params;
    await prisma.tag.delete({
      where: {
        id,
        userId: req.user.id,
      },
    });
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting tag:', error);
    res.status(400).json({ error: 'Failed to delete tag' });
  }
});

export default router; 