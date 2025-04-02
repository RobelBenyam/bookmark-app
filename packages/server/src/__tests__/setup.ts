import { PrismaClient } from '@prisma/client';
import { app } from '../app';
import { server } from '../server';

const prisma = new PrismaClient();

beforeAll(async () => {
  // Clean up the database before all tests
  await prisma.link.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.user.deleteMany();
});

afterAll(async () => {
  // Clean up the database after all tests
  await prisma.link.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.user.deleteMany();
  await prisma.$disconnect();
  server.close();
});

export { app, prisma }; 