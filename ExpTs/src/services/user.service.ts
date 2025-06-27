import { PrismaClient } from '@prisma/client';
import { CreateUserData, UpdateUserData } from '../types/user.types';

const prisma = new PrismaClient();

export const userService = {
  findAll: () =>
    prisma.user.findMany({
      include: { major: true },
      orderBy: { createdAt: 'desc' },
    }),

  findById: (id: number) =>
    prisma.user.findUnique({
      where: { id },
      include: { major: true },
    }),

  create: (data: CreateUserData) =>
    prisma.user.create({
      data,
    }),

  update: (id: number, data: UpdateUserData) =>
    prisma.user.update({
      where: { id },
      data,
    }),

  delete: (id: number) =>
    prisma.user.delete({
      where: { id },
    }),
};
