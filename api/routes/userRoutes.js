'use strict';

module.exports = function(app) {
  var user = require('../controllers/userController');

  // User
  app.route('/user2')
    .get(user.list_all_users);

  app.route('/user')
    .get(user.list_all_users_2)
    .post(user.create_a_user);

  app.route('/user/show/:uid')
    .get(user.show_a_user);

  app.route('/user/edit/:uid')
    .post(user.edit_a_user);
  
  app.route('/user/update/:uid')
   .post(user.update_a_user);

  app.route('/user/update/:uid/:email/:displayName')
    .post(user.update_user);

  app.route('/api/user/delete/:uid')
    .post(user.api_delete_a_user);

  app.route('/login')
    .get(user.login);

  app.route('/login/email')
    .post(user.login_email);

  app.route('/login/google')
    .get(user.login_google);
};
