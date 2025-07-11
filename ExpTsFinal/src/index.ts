import express from 'express';
import dotenv from 'dotenv';
import validateEnv from './utils/validateEnv';
import { engine } from 'express-handlebars';
import path from 'path';
import router from './router/router';
import { logger } from './middlewares/logger';
import { sassCompiler } from './middlewares/sassCompiler';
import { ifCond, nodeJsTechnologies } from './utils/handlebarHelpers';
import session from 'express-session';
import { userService } from './services/user.service';

dotenv.config();

validateEnv();

const app = express();
const PORT = process.env.PORT || 3000;

app.engine('hbs', engine({
  extname: '.hbs',
  helpers: {
    nodeJsTechnologies: nodeJsTechnologies,
    ifCond: ifCond,
    inc: (value: number) => value + 1
  }
}));

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET || '123456',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000
  }
}));

app.use(async (req, res, next) => {
  res.locals.session = {
    uid: req.session.uid,
    user: null
  };

  if (req.session.uid) {
    try {
      const user = await userService.findById(req.session.uid);
      if (user) {
        res.locals.session.user = user;
      }
    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error);
      req.session.destroy(() => {});
    }
  }

  next();
});

app.use('/css', sassCompiler());
app.use(express.static(path.join(__dirname, 'public')));
app.use(logger('completo'));
app.use('/', router);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});