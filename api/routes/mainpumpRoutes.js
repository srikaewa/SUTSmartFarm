'use strict';

module.exports = function(app) {
  var mainpump = require('../controllers/mainpumpController');

  // Mainpump
  app.route('/mainpump')
    .get(mainpump.list_all_mainpumps)
    .post(mainpump.new_mainpump);
  app.route('/mainpump/create')
    .post(mainpump.create_a_mainpump);
  app.route('/mainpump/edit/:id')
    //.get(farmDetails.edit_mainpump);
    .post(mainpump.edit_a_mainpump);
  app.route('/mainpump/update/:id')
    .post(mainpump.update_a_mainpump);
  app.route('/mainpump/show/:id')
    .get(mainpump.show_mainpump);
  app.route('/mainpump/delete')
    .post(mainpump.delete_a_mainpump);
  app.route('/mainpump/delete/:id')
    .post(mainpump.delete_a_mainpump_id);
  app.route('/mainpump/activate/:id')
    .post(mainpump.activate_mainpump);
  app.route('/mainpump/deactivate/:id')
    .post(mainpump.deactivate_mainpump);
  app.route('/mainpump/turnon/id:')
    .post(mainpump.turnon_mainpump);
  app.route('/mainpump/turnoff/:id')
    .post(mainpump.turnoff_mainpump);
  app.route('/api/mainpump/turnon/:id')
    .post(mainpump.api_turnon_mainpump);
  app.route('/api/mainpump/turnoff/:id')
    .post(mainpump.api_turnoff_mainpump);
  app.route('/api/mainpump/set/description/:id/:value')
    .post(mainpump.api_set_description);
}
