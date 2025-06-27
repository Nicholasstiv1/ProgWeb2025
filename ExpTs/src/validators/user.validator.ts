import Joi from 'joi';

export const userSchema = Joi.object({
  fullName: Joi.string().min(3).required().label('Nome completo'),
  email: Joi.string().email().required().label('Email'),
  password: Joi.string().min(6).required().label('Senha'),
  majorId: Joi.number().required().label('Curso'),
});

export const userUpdateSchema = Joi.object({
  fullName: Joi.string().min(3).required().label('Nome completo'),
  email: Joi.string().email().required().label('Email'),
  majorId: Joi.number().required().label('Curso'),
});
