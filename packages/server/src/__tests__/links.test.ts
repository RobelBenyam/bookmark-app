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

describe('Links API', () => {
  let testUser: User;
  let authToken: string;
  let testLink: Link;
  let testTag: Tag;

  beforeAll(async () => {
    // Create a test user
    testUser = await prisma.user.create({
      data: {
        email: 'test@example.com',
        password: 'hashedPassword123',
      },
    });

    // Create a test tag
    testTag = await prisma.tag.create({
      data: {
        name: 'Test Tag',
        userId: testUser.id,
      },
    });

    // Create a test link
    testLink = await prisma.link.create({
      data: {
        url: 'https://example.com',
        title: 'Test Link',
        description: 'Test Description',
        userId: testUser.id,
        tags: {
          connect: { id: testTag.id },
        },
      },
    });

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

  describe('GET /api/links', () => {
    it('should return all links for authenticated user', async () => {
      const response = await request(app)
        .get('/api/links')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty('id');
      expect(response.body[0]).toHaveProperty('url');
      expect(response.body[0]).toHaveProperty('title');
      expect(response.body[0]).toHaveProperty('tags');
    });

    it('should return 401 for unauthenticated requests', async () => {
      const response = await request(app).get('/api/links');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /api/links', () => {
    it('should create a new link', async () => {
      const newLink = {
        url: 'https://new-example.com',
        title: 'New Link',
        description: 'New Description',
        tagIds: [testTag.id],
      };

      const response = await request(app)
        .post('/api/links')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newLink);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.url).toBe(newLink.url);
      expect(response.body.title).toBe(newLink.title);
      expect(response.body.description).toBe(newLink.description);
      expect(response.body.tags).toHaveLength(1);
      expect(response.body.tags[0].id).toBe(testTag.id);
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/links')
        .set('Authorization', `Bearer ${authToken}`)
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should validate URL format', async () => {
      const response = await request(app)
        .post('/api/links')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          url: 'invalid-url',
          title: 'Invalid URL Link',
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('PUT /api/links/:id', () => {
    it('should update an existing link', async () => {
      const updatedLink = {
        url: 'https://updated-example.com',
        title: 'Updated Link',
        description: 'Updated Description',
        tagIds: [testTag.id],
      };

      const response = await request(app)
        .put(`/api/links/${testLink.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updatedLink);

      expect(response.status).toBe(200);
      expect(response.body.url).toBe(updatedLink.url);
      expect(response.body.title).toBe(updatedLink.title);
      expect(response.body.description).toBe(updatedLink.description);
      expect(response.body.tags).toHaveLength(1);
      expect(response.body.tags[0].id).toBe(testTag.id);
    });

    it('should return 404 for non-existent link', async () => {
      const response = await request(app)
        .put('/api/links/999999')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          url: 'https://example.com',
          title: 'Updated Link',
        });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
    });

    it('should not allow updating links owned by other users', async () => {
      // Create another user and link
      const otherUser = await prisma.user.create({
        data: {
          email: 'other@example.com',
          password: 'hashedPassword123',
        },
      });

      const otherLink = await prisma.link.create({
        data: {
          url: 'https://other-example.com',
          title: 'Other Link',
          description: 'Other Description',
          userId: otherUser.id,
        },
      });

      const response = await request(app)
        .put(`/api/links/${otherLink.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          url: 'https://updated-example.com',
          title: 'Updated Link',
        });

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('error');

      // Clean up
      await prisma.link.deleteMany({ where: { userId: otherUser.id } });
      await prisma.user.delete({ where: { id: otherUser.id } });
    });
  });

  describe('DELETE /api/links/:id', () => {
    it('should delete an existing link', async () => {
      const response = await request(app)
        .delete(`/api/links/${testLink.id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');

      // Verify the link was deleted
      const deletedLink = await prisma.link.findUnique({
        where: { id: testLink.id },
      });
      expect(deletedLink).toBeNull();
    });

    it('should return 404 for non-existent link', async () => {
      const response = await request(app)
        .delete('/api/links/999999')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
    });

    it('should not allow deleting links owned by other users', async () => {
      // Create another user and link
      const otherUser = await prisma.user.create({
        data: {
          email: 'other@example.com',
          password: 'hashedPassword123',
        },
      });

      const otherLink = await prisma.link.create({
        data: {
          url: 'https://other-example.com',
          title: 'Other Link',
          description: 'Other Description',
          userId: otherUser.id,
        },
      });

      const response = await request(app)
        .delete(`/api/links/${otherLink.id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('error');

      // Clean up
      await prisma.link.deleteMany({ where: { userId: otherUser.id } });
      await prisma.user.delete({ where: { id: otherUser.id } });
    });
  });
}); 