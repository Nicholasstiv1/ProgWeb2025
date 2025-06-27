import express, { Router } from 'express';
import { getAboutPage, hb1, hb2, hb3, hb4 } from '../controllers/main.controller';
import { getLoremPage } from '../controllers/lorem.controller';
import * as majorController from '../controllers/major.controller';
import * as userController from '../controllers/user.controller';

const router = Router();

// Rotas principais
router.get('/about', getAboutPage);
router.get('/lorem/:qtd', getLoremPage);
router.get('/hb1', hb1);
router.get('/hb2', hb2);
router.get('/hb3', hb3);
router.get('/hb4', hb4);

// Rotas de Majors
router.get('/majors', majorController.listMajors);
router.get('/majors/create', majorController.showCreateForm);
router.post('/majors/create', express.urlencoded({ extended: true }), majorController.createMajor);
router.get('/majors/edit/:id', majorController.showEditForm);
router.post('/majors/edit/:id', express.urlencoded({ extended: true }), majorController.updateMajor);
router.post('/majors/delete/:id', majorController.deleteMajor);
router.get('/majors/:id', majorController.detailsMajor);

// Rotas de Users
router.get('/users', userController.listUsers);
router.get('/users/create', userController.showCreateForm);
router.post('/users/create', express.urlencoded({ extended: true }), userController.createUser);
router.get('/users/edit/:id', userController.showEditForm);
router.post('/users/edit/:id', express.urlencoded({ extended: true }), userController.updateUser);
router.post('/users/delete/:id', userController.deleteUser);
router.get('/users/:id', userController.detailsUser);

export default router;