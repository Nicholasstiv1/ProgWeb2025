import express from 'express';
import dotenv from 'dotenv';
import validateEnv from './utils/validateEnv';
import { engine } from 'express-handlebars';
import path from 'path';
import router from './router/router';
import { logger } from './middlewares/logger';
import { sassCompiler } from './middlewares/sassCompiler';
import { ifCond, nodeJsTechnologies } from './utils/handlebarHelpers';

dotenv.config();

validateEnv();

const app = express();
const PORT = process.env.PORT || 3000;

app.engine('hbs', engine({ 
  extname: '.hbs',
  helpers: {
    nodeJsTechnologies: nodeJsTechnologies,
    ifCond: ifCond
  }
}));

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/css', sassCompiler());
app.use(express.static(path.join(__dirname, 'public')));
app.use(logger('completo'));
app.use('/', router);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});