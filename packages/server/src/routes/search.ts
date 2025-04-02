import express from 'express';
import { prisma } from '../lib/prisma';
import { authenticateToken } from '../middleware/auth';
import { SearchQuery, AuthenticatedRequest } from '../types/express';

const router = express.Router();

router.get('/', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const { query, tagIds } = req.query as SearchQuery;
    const userId = req.user.id;

    const where = {
      userId,
      AND: [
        query ? {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
            { url: { contains: query, mode: 'insensitive' } },
          ],
        } : {},
        tagIds ? {
          tags: {
            some: {
              id: {
                in: (tagIds as string).split(',').map(Number),
              },
            },
          },
        } : {},
      ],
    };

    const links = await prisma.link.findMany({
      where,
      include: { tags: true },
      orderBy: { createdAt: 'desc' },
    });

    res.json(links);
  } catch (error) {
    res.status(500).json({ error: 'Search failed' });
  }
});

export default router; 