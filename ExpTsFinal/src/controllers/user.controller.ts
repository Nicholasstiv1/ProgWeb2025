import { Request, Response } from 'express';
import { userService } from '../services/user.service';
import { majorService } from '../services/major.service';
import { userSchema, userUpdateSchema } from '../validators/user.validator';
import bcrypt from 'bcryptjs';
import { checkAuth } from '../services/auth.service';

declare module 'express-session' {
  interface SessionData {
    uid: number;
  }
}

export function showLoginForm(req: Request, res: Response) {
  if (req.session.uid) {
    res.redirect('/users/profile');
    return;
  }

  res.render('users/login', { title: 'Entrar' });
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;
  const userId = await checkAuth({ email, password });

  if (!userId) {
    return res.render('users/login', { error: 'Credenciais inválidas', title: 'Login' });
  }

  req.session.uid = userId;
  res.redirect('/users/profile');
}

export async function logout(req: Request, res: Response) {
  req.session.destroy(err => {
    if (err) return res.send('Erro ao encerrar a sessão.');
    res.redirect('/users');
  });
}

export async function showProfile(req: Request, res: Response) {
  if (!req.session.uid) {
    res.redirect('/users/login');
    return;
  }

  const user = await userService.findById(req.session.uid);
  if (!user) {
    res.status(404).send('Usuário não encontrado.');
    return
  }
  res.render('users/profile', { user, title: 'Sua Conta' });
}

export async function showCreateForm(req: Request, res: Response) {
  const majors = await majorService.findAll();
  res.render('users/create', { majors, title: 'Novo Usuário' });
}

export async function createUser(req: Request, res: Response) {
  const { password, confirmPassword, ...rest } = req.body;
  const { error, value } = userSchema.validate({ ...rest, password });

  if (error) {
    const majors = await majorService.findAll();
    return res.render('users/create', {
      error: error.message,
      majors,
      title: 'Novo Usuário',
    });
  }

  if (password !== confirmPassword) {
    const majors = await majorService.findAll();
    return res.render('users/create', {
      error: 'As senhas não coincidem',
      majors,
      title: 'Novo Usuário',
    });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

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
    res.status(404).send('Usuário não encontrado.');
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
  res.redirect('/users/profile');
}

export async function deleteUser(req: Request, res: Response) {
  const id = Number(req.params.id);
  await userService.delete(id);
  req.session.destroy(() => res.redirect('/users'));
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

export async function showChangePasswordForm(req: Request, res: Response) {
  if (!req.session.uid) {
    res.redirect('/users');
    return;
  }
  
  res.render('users/change-password', { title: 'Alterar Senha' });
}

export async function changePassword(req: Request, res: Response) {
  if (!req.session.uid) {
    res.redirect('/users');
    return;
  }

  const { currentPassword, newPassword, confirmPassword } = req.body;

  if (!currentPassword || !newPassword || !confirmPassword) {
    return res.render('users/change-password', { 
      error: 'Todos os campos são obrigatórios',
      title: 'Alterar Senha' 
    });
  }

  if (newPassword !== confirmPassword) {
    return res.render('users/change-password', { 
      error: 'A nova senha e a confirmação não coincidem',
      title: 'Alterar Senha' 
    });
  }

  if (newPassword.length < 6) {
    return res.render('users/change-password', { 
      error: 'A nova senha deve ter pelo menos 6 caracteres',
      title: 'Alterar Senha' 
    });
  }

  try {
    const userId = Number(req.session.uid);
    if (!userId || isNaN(userId)) {
      return res.render('users/change-password', { 
        error: 'Sessão inválida',
        title: 'Alterar Senha' 
      });
    }

    const user = await userService.findById(userId);
    if (!user) {
      return res.render('users/change-password', { 
        error: 'Usuário não encontrado',
        title: 'Alterar Senha' 
      });
    }

    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      return res.render('users/change-password', { 
        error: 'Senha atual incorreta',
        title: 'Alterar Senha' 
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);

    await userService.updatePassword(userId, hashedNewPassword);

    res.render('users/change-password', { 
      success: 'Senha alterada com sucesso!',
      title: 'Alterar Senha' 
    });

  } catch (error) {
    console.error('Erro ao alterar senha:', error);
    res.render('users/change-password', { 
      error: 'Erro interno do servidor',
      title: 'Alterar Senha' 
    });
  }
}