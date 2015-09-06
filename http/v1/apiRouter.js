var express = require('express');

var router = express.Router();
var authController = require('./controllers/auth.js');
var userController = require('./controllers/user.js');
var loginController = require('./controllers/login.js');
var clientController = require('./controllers/client.js');
var oauth2Controller = require('./controllers/oauth2.js');
var groupController = require('./controllers/group.js');
var tfaController = require('./controllers/2fa.js');

router.route('/login')
  .post(authController.isUserAuthenticated, loginController.postLogin)
  .delete(authController.isSessionAuthenticated, loginController.deleteLogin);

router.route('/group')
  .get(authController.isAuthenticated, groupController.getGroups);

router.route('/group/:group')
  .get(authController.isAuthenticated, groupController.getGroup);

router.route('/user')
  .post(authController.isAuthenticated, userController.postUser)
  .get(authController.isAuthenticated, userController.getUsers);

router.route('/user/2fa')
  .get(authController.isSessionAuthenticated, tfaController.getTFA)

router.route('/user/:user')
  .get(authController.isAuthenticated, userController.getUser);

router.route('/user/setup')
  .get(authController.isSessionAuthenticated, userController.setupUser);

router.route('/client')
  .post(authController.isSessionAuthenticated, clientController.postClient)
  .get(authController.isAuthenticated, clientController.getOwnClients);

/*
* router.route('/user/group')
*   .put(authController.isAuthenticated, userController.updateUserGroup);
*
* router.route('/client')
*   .post(authController.isAuthenticated, clientController.postClients)
*   .delete(authController.isAuthenticated, clientController.deleteClients)
*   .get(authController.isAuthenticated, clientController.getClients);
*
* router.route('/oauth2/authorize')
*   .get(authController.isAuthenticated, oauth2Controller.authorization)
*   .post(authController.isAuthenticated, oauth2Controller.decision);
*
* router.route('/oauth2/token')
*   .post(authController.isClientAuthenticated, oauth2Controller.token);
*/

module.exports = router;
