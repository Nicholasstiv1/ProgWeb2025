import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function showRanking(req: Request, res: Response) {
  try {
    const topScores = await prisma.gameSession.groupBy({
      by: ['userId'],
      _max: { score: true },
      orderBy: {
        _max: { score: 'desc' },
      },
      take: 10,
    });

    const userIds = topScores.map(entry => entry.userId);

    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: {
        id: true,
        fullName: true,
        email: true,
      },
    });

    const ranking = topScores.map(entry => {
      const user = users.find(u => u.id === entry.userId);
      return {
        score: entry._max.score,
        user: user!,
      };
    });

    res.render('ranking', { title: 'Ranking', ranking });
  } catch (err) {
    console.error('Erro ao carregar ranking:', err);
    res.status(500).send('Erro ao carregar ranking');
  }
}
