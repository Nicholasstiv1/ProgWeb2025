import { Request, Response } from 'express';
import { LoremIpsum } from 'lorem-ipsum';

export function getLoremPage(req: Request, res: Response): void {
  const qtd = parseInt(req.params.qtd);

  if (isNaN(qtd) || qtd < 1 || qtd > 50) {
    res.status(400).send('<p>Parâmetro inválido. Use um número entre 1 e 50.</p>');
    return;
  }

  const lorem = new LoremIpsum();
  const paragraphs = Array.from({ length: qtd }, () => `<p>${lorem.generateParagraphs(1)}</p>`).join('\n');
  
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Lorem Ipsum</title>
        <meta charset="utf-8" />
        <style>body { font-family: sans-serif; padding: 2rem; }</style>
      </head>
      <body>
        <h1>${qtd} Parágrafos de Lorem Ipsum</h1>
        ${paragraphs}
      </body>
    </html>
  `);
}