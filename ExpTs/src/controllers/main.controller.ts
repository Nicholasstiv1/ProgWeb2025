import { Request, Response } from 'express';

export function getAboutPage(req: Request, res: Response) {
  res.render('about');
}

export function hb1(req: Request, res: Response) {
  res.render('hb1', { nome: 'Teste', title: 'HB1' });
}

export function hb2(req: Request, res: Response) {
  const isLoggedIn = true;
  res.render('hb2', { isLoggedIn });
}

export function hb3(req: Request, res: Response) {
  const itens = ['Nave', 'Laser', 'Asteroide'];
  res.render('hb3', { itens });
}

export const hb4 = (req: Request, res: Response) => {
  const technologies = [
    { name: 'Express', type: 'Framework', poweredByNodejs: true },
    { name: 'Laravel', type: 'Framework', poweredByNodejs: false },
    { name: 'React', type: 'Library', poweredByNodejs: true },
    { name: 'Handlebars', type: 'Engine View', poweredByNodejs: true },
    { name: 'Django', type: 'Framework', poweredByNodejs: false },
    { name: 'Docker', type: 'Virtualization', poweredByNodejs: false },
    { name: 'Sequelize', type: 'ORM tool', poweredByNodejs: true },
  ];

  res.render('hb4', { 
    title: 'Tecnologias Node.js',
    technologies: technologies 
  });
};



