import { Request, Response, NextFunction } from 'express';

export function ensureAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (!req.session || !req.session.uid) {
    if (req.path.startsWith('/api/')) {
      res.status(401).json({ error: 'Não autorizado' });
      return;
    }
    
    if (req.path === '/') {
      return res.redirect('/users');
    }
    
    return res.redirect('/users'); 
  }
  next();
}