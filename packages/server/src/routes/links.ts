import express from 'express';
import { prisma } from '../lib/prisma';
import { authenticateToken } from '../middleware/auth';
import { CreateLinkBody, UpdateLinkBody, AuthenticatedRequest } from '../types/express';

const router = express.Router();
const DEFAULT_PAGE_SIZE = 10;

// Get all links for the authenticated user with pagination
router.get('/', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || DEFAULT_PAGE_SIZE;
    const skip = (page - 1) * pageSize;

    const [links, total] = await Promise.all([
      prisma.link.findMany({
        where: { userId: req.user.id },
        include: { tags: true },
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.link.count({
        where: { userId: req.user.id },
      }),
    ]);

    res.json({
      data: {
        links,
        pagination: {
          total,
          page,
          pageSize,
          totalPages: Math.ceil(total / pageSize),
        },
      },
    });
  } catch (error) {
    console.error('Error fetching links:', error);
    res.status(500).json({ error: 'Failed to fetch links' });
  }
});

// Create a new link
router.post('/', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const { url, title, description, tagIds } = req.body as CreateLinkBody;
    const link = await prisma.link.create({
      data: {
        url,
        title,
        description,
        userId: req.user.id,
        tags: {
          connect: tagIds?.map(id => ({ id })) || [],
        },
      },
      include: { tags: true },
    });
    res.status(201).json(link);
  } catch (error) {
    console.error('Error creating link:', error);
    res.status(400).json({ error: 'Failed to create link' });
  }
});

// Update a link
router.put('/:id', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params;
    const { url, title, description, tagIds } = req.body as UpdateLinkBody;

    const link = await prisma.link.update({
      where: {
        id,
        userId: req.user.id,
      },
      data: {
        url,
        title,
        description,
        tags: {
          set: tagIds?.map(id => ({ id })) || [],
        },
      },
      include: { tags: true },
    });

    res.json(link);
  } catch (error) {
    console.error('Error updating link:', error);
    res.status(400).json({ error: 'Failed to update link' });
  }
});

// Delete a link
router.delete('/:id', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params;
    await prisma.link.delete({
      where: {
        id,
        userId: req.user.id,
      },
    });
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting link:', error);
    res.status(400).json({ error: 'Failed to delete link' });
  }
});

export default router; 