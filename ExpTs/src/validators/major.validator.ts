import Joi from 'joi';

export const majorSchema = Joi.object({
  name: Joi.string().min(3).required().label('Nome do curso'),
  code: Joi.string().length(4).required().label('Sigla'),
  description: Joi.string().min(5).required().label('Descrição'),
});
