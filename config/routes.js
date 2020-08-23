const express = require('express');
const router = express.Router();
const multer = require('multer');
const projectsController = require('../controllers/projects.controller')
const usersController = require('../controllers/users.controller')
const commentsController = require('../controllers/comments.controller')
const sessionMiddleware = require('../middlewares/session.middleware')
const uploads = require('../config/multer.config')

router.get('/auth/slack', sessionMiddleware.isNotAuthenticated, usersController.doSocialLoginSlack);
router.get('/auth/google', sessionMiddleware.isNotAuthenticated, usersController.doSocialLoginGoogle);
router.get('/login', sessionMiddleware.isNotAuthenticated, usersController.login);
router.post('/login', sessionMiddleware.isNotAuthenticated, usersController.doLogin);
router.get('/signup', sessionMiddleware.isNotAuthenticated, usersController.signup);
router.post('/users', sessionMiddleware.isNotAuthenticated, uploads.single('avatar'), usersController.createUser);
router.get('/user/:id', sessionMiddleware.isAuthenticated, usersController.profile);
router.get('/activate/:token', sessionMiddleware.isNotAuthenticated, usersController.activateUser);
router.post('/logout', sessionMiddleware.isAuthenticated, usersController.logout);
router.get('/projects', sessionMiddleware.isAuthenticated, projectsController.list);
router.get('/projects/new', sessionMiddleware.isAuthenticated, projectsController.newproject);
router.post('/projects/create', sessionMiddleware.isAuthenticated, uploads.single('image'),  projectsController.createproject)
router.get('/projects/:id', sessionMiddleware.isAuthenticated, projectsController.showProject)
router.post('/projects/:id/like', sessionMiddleware.isAuthenticated, projectsController.like)
router.get('/projects/:id/delete', sessionMiddleware.isAuthenticated, projectsController.deleteProject)
router.get('/projects/:id/edit', sessionMiddleware.isAuthenticated, projectsController.editProject)
router.post('/projects/:id/edit', sessionMiddleware.isAuthenticated,uploads.single('image'), projectsController.updateProject)
router.post('/newComment', sessionMiddleware.isAuthenticated, commentsController.createComment)
router.get('/comments/:id/delete', sessionMiddleware.isAuthenticated, commentsController.deleteComment)

router.get("/", (req, res) => {
  res.redirect("/projects");
});
/*router.get("/map",(req,res) =>{
  res.render("projects/map")
})*/

module.exports = router;
