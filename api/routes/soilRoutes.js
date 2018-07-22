'use strict';

module.exports = function(app) {
  var soil = require('../controllers/soilController');

app.route('/soil')
  .get(soil.list_all_soils)
  .post(soil.new_soil);
app.route('/soil/create')
  .post(soil.create_a_soil);
app.route('/soil/edit/:id')
  .post(soil.edit_a_soil);
app.route('/soil/show/:id')
  .get(soil.show_soil);
app.route('/soil/delete/:id')
  .post(soil.delete_a_soil_id);

}
