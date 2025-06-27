import { Request, Response } from 'express';
import { userService } from '../services/user.service';
import { majorService } from '../services/major.service';
import { userSchema, userUpdateSchema } from '../validators/user.validator';
import bcrypt from 'bcryptjs';

export async function listUsers(req: Request, res: Response) {
  const users = await userService.findAll();
  res.render('users/list', { users, title: 'Usuários' });
}

export async function showCreateForm(req: Request, res: Response) {
  const majors = await majorService.findAll();
  res.render('users/create', { majors, title: 'Novo Usuário' });
}

export async function createUser(req: Request, res: Response) {
  const { error, value } = userSchema.validate(req.body);

  if (error) {
    const majors = await majorService.findAll();
    return res.render('users/create', {
      error: error.message,
      majors,
      title: 'Novo Usuário',
    });
  }

  const hashedPassword = await bcrypt.hash(value.password, 10);

  await userService.create({
    fullName: value.fullName,
    email: value.email,
    password: hashedPassword,
    majorId: value.majorId,
  });

  res.redirect('/users');
}

export async function showEditForm(req: Request, res: Response) {
  const id = Number(req.params.id);
  const user = await userService.findById(id);
  const majors = await majorService.findAll();

  if (!user) {
    res.status(404).send('Usuário não encontrado.')
    return;
  }

  res.render('users/edit', {
    user,
    majors,
    title: 'Editar Usuário',
  });
}

export async function updateUser(req: Request, res: Response) {
  const id = Number(req.params.id);
  const { error, value } = userUpdateSchema.validate(req.body);

  if (error) {
    const majors = await majorService.findAll();
    return res.render('users/edit', {
      error: error.message,
      majors,
      user: { id, ...req.body },
      title: 'Editar Usuário',
    });
  }

  await userService.update(id, value);
  res.redirect('/users');
}

export async function deleteUser(req: Request, res: Response) {
  const id = Number(req.params.id);
  await userService.delete(id);
  res.redirect('/users');
}

export async function detailsUser(req: Request, res: Response) {
  const id = Number(req.params.id);
  const user = await userService.findById(id);

  if (!user) {
    res.status(404).send('Usuário não encontrado.');
    return;
  }

  res.render('users/details', {
    user,
    title: 'Detalhes do Usuário',
  });
}
