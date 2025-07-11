import express, { Router } from 'express';
import { getAboutPage, hb1, hb2, hb3, hb4 } from '../controllers/main.controller';
import { getLoremPage } from '../controllers/lorem.controller';
import * as majorController from '../controllers/major.controller';
import * as userController from '../controllers/user.controller';
import * as gameController from '../controllers/game.controller';
import * as rankingController from '../controllers/ranking.controller';
import { ensureAuthenticated } from '../middlewares/auth';

const router = Router();

router.get('/', (req, res) => {
  if (req.session.uid) {
    res.redirect('/game');
  } else {
    res.redirect('/users');
  }
});

router.get('/game', ensureAuthenticated, (req, res) => {
  res.redirect('/game/index.html');
});

router.post('/game-sessions', ensureAuthenticated, express.json(), gameController.saveScore);
router.get('/api/game/leaderboard', gameController.getLeaderboard);
router.get('/api/game/user-stats', ensureAuthenticated, gameController.getUserStats);

router.get('/about', getAboutPage);
router.get('/lorem/:qtd', getLoremPage);
router.get('/hb1', hb1);
router.get('/hb2', hb2);
router.get('/hb3', hb3);
router.get('/hb4', hb4);

router.get('/majors', majorController.listMajors);
router.get('/majors/create', majorController.showCreateForm);
router.post('/majors/create', express.urlencoded({ extended: true }), majorController.createMajor);
router.get('/majors/edit/:id', majorController.showEditForm);
router.post('/majors/edit/:id', express.urlencoded({ extended: true }), majorController.updateMajor);
router.post('/majors/delete/:id', majorController.deleteMajor);
router.get('/majors/:id', majorController.detailsMajor);

router.get('/users', userController.showLoginForm);
router.post('/users', express.urlencoded({ extended: true }), userController.login);
router.get('/users/logout', userController.logout);
router.get('/users/profile', ensureAuthenticated, userController.showProfile);
router.get('/users/create', userController.showCreateForm);
router.post('/users/create', express.urlencoded({ extended: true }), userController.createUser);

router.get('/users/change-password', ensureAuthenticated, userController.showChangePasswordForm);
router.post('/users/change-password', express.urlencoded({ extended: true }), ensureAuthenticated, userController.changePassword);

router.get('/users/edit/:id', ensureAuthenticated, userController.showEditForm);
router.post('/users/edit/:id', express.urlencoded({ extended: true }), ensureAuthenticated, userController.updateUser);
router.post('/users/delete/:id', ensureAuthenticated, userController.deleteUser);
router.get('/users/:id', ensureAuthenticated, userController.detailsUser);

router.get('/ranking', rankingController.showRanking);

export default router;