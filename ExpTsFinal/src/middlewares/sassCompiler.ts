import { Request, Response, NextFunction } from 'express';
import * as sass from 'sass';
import fs from 'fs';
import path from 'path';

export const sassCompiler = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.url.endsWith('.css')) {
      const scssFileName = req.url.replace('.css', '.scss');
      const scssPath = path.join(__dirname, '..', 'sass', scssFileName);
      
      if (fs.existsSync(scssPath)) {
        try {
          const result = sass.compile(scssPath);
          res.setHeader('Content-Type', 'text/css');
          res.send(result.css);
          return;
        } catch (error) {
          console.error('Erro ao compilar SASS:', error);
          res.status(500).send('Erro ao compilar SASS');
          return;
        }
      }
    }
    
    next();
  };
};
