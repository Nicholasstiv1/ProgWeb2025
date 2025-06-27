import { PrismaClient } from '@prisma/client';
import { CreateMajorData, UpdateMajorData } from '../types/major.types';

const prisma = new PrismaClient();

export const majorService = {
  findAll: () => prisma.major.findMany({ orderBy: { createdAt: 'desc' } }),

  findById: (id: number) =>
    prisma.major.findUnique({
      where: { id },
    }),

  create: (data: CreateMajorData) =>
    prisma.major.create({
      data,
    }),

  update: (id: number, data: UpdateMajorData) =>
    prisma.major.update({
      where: { id },
      data,
    }),

  delete: (id: number) =>
    prisma.major.delete({
      where: { id },
    }),
};
