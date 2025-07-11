import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const gameService = {
  saveScore: async (userId: number, score: number) => {
    return await prisma.gameSession.create({
      data: {
        userId,
        score,
      },
    });
  },

  getUserTopScores: async (userId: number, limit: number = 10) => {
    return await prisma.gameSession.findMany({
      where: { userId },
      orderBy: { score: 'desc' },
      take: limit,
      include: {
        user: {
          select: {
            fullName: true,
            email: true,
          },
        },
      },
    });
  },

  getLeaderboard: async (limit: number = 10) => {
    return await prisma.gameSession.findMany({
      orderBy: { score: 'desc' },
      take: limit,
      include: {
        user: {
          select: {
            fullName: true,
            email: true,
          },
        },
      },
    });
  },

  getUserSessions: async (userId: number) => {
    return await prisma.gameSession.findMany({
      where: { userId },
      orderBy: { playedAt: 'desc' },
    });
  },

  getUserStats: async (userId: number) => {
    const stats = await prisma.gameSession.aggregate({
      where: { userId },
      _count: {
        id: true,
      },
      _max: {
        score: true,
      },
      _avg: {
        score: true,
      },
    });

    return {
      totalGames: stats._count.id,
      bestScore: stats._max.score || 0,
      averageScore: Math.round(stats._avg.score || 0),
    };
  },
};