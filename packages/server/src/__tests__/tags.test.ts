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

type Tag = {
  id: string;
  name: string;
  createdAt: Date;
};

describe('Tags API', () => {
  let testUser: User;
  let authToken: string;
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

    // Generate auth token
    authToken = jwt.sign(
      { userId: testUser.id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1h' }
    );
  });

  afterAll(async () => {
    // Clean up the database
    await prisma.tag.deleteMany();
    await prisma.user.deleteMany();
  });

  describe('GET /api/tags', () => {
    it('should return all tags for authenticated user', async () => {
      const response = await request(app)
        .get('/api/tags')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty('id');
      expect(response.body[0]).toHaveProperty('name');
    });

    it('should return 401 for unauthenticated requests', async () => {
      const response = await request(app).get('/api/tags');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /api/tags', () => {
    it('should create a new tag', async () => {
      const newTag = { name: 'New Tag' };
      const response = await request(app)
        .post('/api/tags')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newTag);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(newTag.name);
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/tags')
        .set('Authorization', `Bearer ${authToken}`)
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should not allow duplicate tag names for the same user', async () => {
      const duplicateTag = { name: 'Test Tag' };
      const response = await request(app)
        .post('/api/tags')
        .set('Authorization', `Bearer ${authToken}`)
        .send(duplicateTag);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('PUT /api/tags/:id', () => {
    it('should update an existing tag', async () => {
      const updatedTag = { name: 'Updated Tag' };
      const response = await request(app)
        .put(`/api/tags/${testTag.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updatedTag);

      expect(response.status).toBe(200);
      expect(response.body.name).toBe(updatedTag.name);
    });

    it('should return 404 for non-existent tag', async () => {
      const response = await request(app)
        .put('/api/tags/999999')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'Updated Tag' });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
    });

    it('should not allow updating tags owned by other users', async () => {
      // Create another user and tag
      const otherUser = await prisma.user.create({
        data: {
          email: 'other@example.com',
          password: 'hashedPassword123',
        },
      });

      const otherTag = await prisma.tag.create({
        data: {
          name: 'Other Tag',
          userId: otherUser.id,
        },
      });

      const response = await request(app)
        .put(`/api/tags/${otherTag.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'Updated Tag' });

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('error');

      // Clean up
      await prisma.tag.deleteMany({ where: { userId: otherUser.id } });
      await prisma.user.delete({ where: { id: otherUser.id } });
    });
  });

  describe('DELETE /api/tags/:id', () => {
    it('should delete an existing tag', async () => {
      const response = await request(app)
        .delete(`/api/tags/${testTag.id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');

      // Verify the tag was deleted
      const deletedTag = await prisma.tag.findUnique({
        where: { id: testTag.id },
      });
      expect(deletedTag).toBeNull();
    });

    it('should return 404 for non-existent tag', async () => {
      const response = await request(app)
        .delete('/api/tags/999999')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
    });

    it('should not allow deleting tags owned by other users', async () => {
      // Create another user and tag
      const otherUser = await prisma.user.create({
        data: {
          email: 'other@example.com',
          password: 'hashedPassword123',
        },
      });

      const otherTag = await prisma.tag.create({
        data: {
          name: 'Other Tag',
          userId: otherUser.id,
        },
      });

      const response = await request(app)
        .delete(`/api/tags/${otherTag.id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('error');

      // Clean up
      await prisma.tag.deleteMany({ where: { userId: otherUser.id } });
      await prisma.user.delete({ where: { id: otherUser.id } });
    });
  });
}); 