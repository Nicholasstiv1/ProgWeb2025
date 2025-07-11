import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const userService = {
  findById: (id: number) => {
    return prisma.user.findUnique({
      where: {
        id: id
      },
      include: {
        major: true
      }
    });
  },

  create: (data: {
    fullName: string;
    email: string;
    password: string;
    majorId: number;
  }) => {
    return prisma.user.create({
      data: {
        fullName: data.fullName,
        email: data.email,
        password: data.password,
        majorId: data.majorId
      }
    });
  },

  update: (id: number, data: Partial<{
    fullName: string;
    email: string;
    password: string;
    majorId: number;
  }>) => {
    return prisma.user.update({
      where: { id },
      data
    });
  },

  updatePassword: (id: number, hashedPassword: string) => {
    return prisma.user.update({
      where: { id },
      data: {
        password: hashedPassword
      }
    });
  },

  delete: (id: number) => {
    return prisma.user.delete({
      where: { id }
    });
  },

  findAll: () => {
    return prisma.user.findMany({
      include: {
        major: true
      }
    });
  }
};