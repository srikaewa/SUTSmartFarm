'use strict';

module.exports = function(app) {
  var plant = require('../controllers/plantController');


  app.route('/plant')
    .get(plant.list_all_plants)
    .post(plant.new_plant);
  app.route('/plant/create')
    .post(plant.create_a_plant);
  app.route('/plant/edit/:id')
    .post(plant.edit_a_plant);
  app.route('/plant/update/:id')
    .post(plant.update_a_plant);
  app.route('/plant/show/:id')
    .get(plant.show_plant);
  app.route('/plant/delete/:id')
    .post(plant.delete_a_plant_id);
  app.route('/plant/kc/add/:id/:week')
    .post(plant.add_kc_a_plant);
}
