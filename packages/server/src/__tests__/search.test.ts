import request from 'supertest';
import { app, prisma } from './setup';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

type User = {
  id: string;
  email: string;
  password: string;
  name?: string | null;
  createdAt: Date;
  updatedAt: Date;
};

type Link = {
  id: string;
  url: string;
  title: string;
  description?: string | null;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
};

type Tag = {
  id: string;
  name: string;
  createdAt: Date;
};

describe('Search API', () => {
  let testUser: User;
  let authToken: string;
  let testLinks: Link[];
  let testTags: Tag[];

  beforeAll(async () => {
    // Create a test user
    testUser = await prisma.user.create({
      data: {
        email: 'test@example.com',
        password: 'hashedPassword123',
      },
    });

    // Create test tags
    testTags = await Promise.all([
      prisma.tag.create({
        data: {
          name: 'Technology',
          userId: testUser.id,
        },
      }),
      prisma.tag.create({
        data: {
          name: 'Programming',
          userId: testUser.id,
        },
      }),
    ]);

    // Create test links
    testLinks = await Promise.all([
      prisma.link.create({
        data: {
          url: 'https://reactjs.org',
          title: 'React Documentation',
          description: 'Official documentation for React',
          userId: testUser.id,
          tags: {
            connect: { id: testTags[0].id },
          },
        },
      }),
      prisma.link.create({
        data: {
          url: 'https://typescriptlang.org',
          title: 'TypeScript Documentation',
          description: 'Official documentation for TypeScript',
          userId: testUser.id,
          tags: {
            connect: { id: testTags[1].id },
          },
        },
      }),
    ]);

    // Generate auth token
    authToken = jwt.sign(
      { userId: testUser.id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1h' }
    );
  });

  afterAll(async () => {
    // Clean up the database
    await prisma.link.deleteMany();
    await prisma.tag.deleteMany();
    await prisma.user.deleteMany();
  });

  describe('GET /api/search', () => {
    it('should search links by title', async () => {
      const response = await request(app)
        .get('/api/search?q=React')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(1);
      expect(response.body[0].title).toContain('React');
    });

    it('should search links by description', async () => {
      const response = await request(app)
        .get('/api/search?q=TypeScript')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(1);
      expect(response.body[0].description).toContain('TypeScript');
    });

    it('should search links by tag', async () => {
      const response = await request(app)
        .get('/api/search?tag=Technology')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(1);
      expect(response.body[0].tags[0].name).toBe('Technology');
    });

    it('should return empty array for no matches', async () => {
      const response = await request(app)
        .get('/api/search?q=nonexistent')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(0);
    });

    it('should return 401 for unauthenticated requests', async () => {
      const response = await request(app).get('/api/search?q=React');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });

    it('should support pagination', async () => {
      const response = await request(app)
        .get('/api/search?q=documentation&page=1&limit=10')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(2);
    });

    it('should support sorting', async () => {
      const response = await request(app)
        .get('/api/search?q=documentation&sort=title:asc')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(2);
      expect(response.body[0].title).toBe('React Documentation');
    });
  });
}); 