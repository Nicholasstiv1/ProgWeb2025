import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function checkAuth({ email, password }: { email: string, password: string }): Promise<number | null> {
  const user = await prisma.user.findUnique({ 
    where: { email } 
  });
  
  if (!user) return null;

  const match = await bcrypt.compare(password, user.password);
  return match ? user.id : null;
}