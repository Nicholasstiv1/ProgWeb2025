import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function showGame(req: Request, res: Response) {
  const userId = req.session.uid;

  if (!userId) {
    res.redirect('/login');
    return
  }

  const userScores = await prisma.gameSession.findMany({
    where: { userId },
    orderBy: { score: 'desc' },
    take: 5,
  });

  res.render('index', {
    title: 'Jogo',
    userScores,
  });
}

export async function saveScore(req: Request, res: Response) {
  const userId = req.session.uid;
  const { score } = req.body;

  if (!userId) {
    res.status(401).json({ 
      success: false, 
      error: 'Usuário não autenticado' 
    });
    return;
  }

  if (typeof score !== 'number' || score < 0) {
    res.status(400).json({ 
      success: false, 
      error: 'Pontuação inválida' 
    });
    return;
  }

  try {
    await prisma.gameSession.create({
      data: {
        userId,
        score,
        playedAt: new Date(),
      },
    });
    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      success: false, 
      error: 'Erro ao salvar score' 
    });
  }
}

export async function getLeaderboard(req: Request, res: Response) {
  try {
    const topScores = await prisma.gameSession.findMany({
      orderBy: { score: 'desc' },
      take: 10,
      include: { user: true },
    });
    res.json(topScores);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao carregar leaderboard' });
  }
}

export async function getUserStats(req: Request, res: Response) {
  const userId = req.session.uid;

  try {
    const sessions = await prisma.gameSession.findMany({
      where: { userId },
    });

    if (!sessions.length) {
      res.json({
        totalGames: 0,
        bestScore: 0,
        averageScore: 0,
      });
      return;
    }

    const totalGames = sessions.length;
    const bestScore = Math.max(...sessions.map(s => s.score));
    const averageScore = Math.round(
      sessions.reduce((sum, s) => sum + s.score, 0) / totalGames
    );

    res.json({ totalGames, bestScore, averageScore });
  } catch (err) {
    console.error('Erro ao carregar estatísticas do usuário:', err);
    res.status(500).json({ error: 'Erro ao carregar estatísticas' });
  }
}
