'use strict';

module.exports = function(app) {
  var home = require('../controllers/homeController');
app.route('/')
  .get(home.dashboard);
app.route('/dashboard')
  .get(home.dashboard);
app.route('/welcome')
  .get(home.welcome);
}
