'use strict';

module.exports = function(app) {
  var valve = require('../controllers/valveController');

  // Valves
  app.route('/valve')
    .get(valve.list_all_valves)
    .post(valve.new_valve);
  app.route('/valve/create')
    .post(valve.create_a_valve);
  app.route('/valve/edit/:id')
      //.get(farmDetails.edit_mainpump);
    .post(valve.edit_a_valve);
  app.route('/valve/update/:id')
    .post(valve.update_a_valve);
  app.route('/valve/show/:id')
    .get(valve.show_valve);
  app.route('/valve/delete')
    .post(valve.delete_a_valve);
  app.route('/valve/delete/:id')
    .post(valve.delete_a_valve_id);
  app.route('/valve/activate/:id')
    .post(valve.activate_valve);
  app.route('/valve/deactivate/:id')
    .post(valve.deactivate_valve);
  app.route('/valve/turnon/:id/:key/:field')
    .post(valve.turnon_valve);
  app.route('/valve/turnoff/:id/:key/:field')
    .post(valve.turnoff_valve);
  app.route('/api/valve/reset_timer/:id/:field')
    .post(valve.api_reset_timer);
  app.route('/api/valve/turnon/:id/:key/:field')
    .post(valve.api_turnon_valve);
  app.route('/api/valve/turnoff/:id/:key/:field')
    .post(valve.api_turnoff_valve);
}
