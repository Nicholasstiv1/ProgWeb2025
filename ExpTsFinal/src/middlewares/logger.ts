import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';

export function logger(format: 'simples' | 'completo') {
  return (req: Request, res: Response, next: NextFunction) => {
    const now = new Date().toISOString();
    const method = req.method;
    const url = req.originalUrl;
    const protocol = req.protocol.toUpperCase();
    const userAgent = req.headers['user-agent'] || 'N/A';

    let logLine = '';

    if (format === 'simples') {
      logLine = `[${now}] ${method} ${url}\n`;
    } else {
      logLine = `[${now}] ${method} ${url} ${protocol} - ${userAgent}\n`;
    }

    const logPath = process.env.LOGS_PATH || './logs/access.log';
    const fullPath = path.resolve(logPath);

    fs.appendFile(fullPath, logLine, err => {
      if (err) {
        console.error('Erro ao escrever no log:', err);
      }
    });

    next();
  };
}
