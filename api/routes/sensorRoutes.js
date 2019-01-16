'use strict';

module.exports = function(app) {
  var sensor = require('../controllers/sensorController');

  app.route('/sensor')
    .get(sensor.list_all_sensors)
    .post(sensor.new_sensor);
  app.route('/sensor/create')
    .post(sensor.create_a_sensor);
  app.route('/sensor/edit/:id')
    .post(sensor.edit_a_sensor);
  app.route('/sensor/update/:id')
    .post(sensor.update_a_sensor);
  app.route('/sensor/delete')
    .post(sensor.delete_a_sensor);
  app.route('/sensor/delete/:id')
    .post(sensor.delete_a_sensor_id);
  app.route('/sensor/activate/:id')
    .post(sensor.activate_sensor);
  app.route('/sensor/deactivate/:id')
    .post(sensor.deactivate_sensor);
  app.route('/sensor/show/:id')
    .get(sensor.show_sensor);

  app.route('/api/sensor/update/:id')
    .post(sensor.api_update_sensor_value);
  /*app.route('/tasks/:taskId')
    .get(todoList.read_a_task)
    .put(todoList.update_a_task)
    .delete(todoList.delete_a_task);*/
}
