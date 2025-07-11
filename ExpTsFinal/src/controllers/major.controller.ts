import { Request, Response } from 'express';
import { majorService } from '../services/major.service';
import { majorSchema } from '../validators/major.validator';
import { CreateMajorData, UpdateMajorData } from '../types/major.types';

export async function listMajors(req: Request, res: Response) {
  const majors = await majorService.findAll();
  res.render('majors/list', { majors, title: 'Cursos' });
}

export async function showCreateForm(req: Request, res: Response) {
  res.render('majors/create', { title: 'Novo Curso' });
}

export async function createMajor(req: Request, res: Response) {
  const { error, value } = majorSchema.validate(req.body);

  if (error) {
    return res.render('majors/create', {
      error: error.message,
      title: 'Novo Curso',
    });
  }

  try {
    const data: CreateMajorData = value;
    await majorService.create(data);
    res.redirect('/majors');
  } catch (err: any) {
    let errorMessage = 'Erro ao criar curso.';
    
    if (err.code === '23505' || err.message?.includes('unique') || err.message?.includes('duplicate')) {
      errorMessage = 'Já existe um curso com esta sigla.';
    }

    return res.render('majors/create', {
      error: errorMessage,
      title: 'Novo Curso',
      formData: req.body
    });
  }
}

export async function showEditForm(req: Request, res: Response): Promise<void> {
  const id = Number(req.params.id);
  const major = await majorService.findById(id);

  if (!major) {
    res.status(404).send('Curso não encontrado.')
    return;
  }

  res.render('majors/edit', {
    major,
    title: 'Editar Curso',
  });
}

export async function updateMajor(req: Request, res: Response) {
  const id = Number(req.params.id);
  const { error, value } = majorSchema.validate(req.body);

  if (error) {
    return res.render('majors/edit', {
      error: error.message,
      major: { id, ...req.body },
      title: 'Editar Curso',
    });
  }

  try {
    const data: UpdateMajorData = value;
    await majorService.update(id, data);
    res.redirect('/majors');
  } catch (err: any) {
    let errorMessage = 'Erro ao atualizar curso.';
    
    if (err.code === '23505' || err.message?.includes('unique') || err.message?.includes('duplicate')) {
      errorMessage = 'Já existe um curso com esta sigla.';
    }

    return res.render('majors/edit', {
      error: errorMessage,
      major: { id, ...req.body },
      title: 'Editar Curso',
    });
  }
}

export async function deleteMajor(req: Request, res: Response) {
  const id = Number(req.params.id);
  await majorService.delete(id);
  res.redirect('/majors');
}

export async function detailsMajor(req: Request, res: Response): Promise<void> {
  const id = Number(req.params.id);
  const major = await majorService.findById(id);

  if (!major) {
    res.status(404).send('Curso não encontrado.')
    return;
  }

  res.render('majors/details', {
    major,
    title: 'Detalhes do Curso',
  });
}