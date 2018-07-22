'use strict';

module.exports = function(app) {
  var farmDetails = require('../controllers/farmDetailController');

  app.route('/form_common')
    .get(farmDetails.form_common);

  // todoList Routes
  app.route('/farm')
    .get(farmDetails.list_all_farm)
    .post(farmDetails.new_farm);
  app.route('/farm/:type')
    .get(farmDetails.list_all_farm_type);
  app.route('/farm/create')
    .post(farmDetails.create_a_farm);
  app.route('/farm/edit/:id')
    //.get(farmDetails.edit_mainpump);
    .post(farmDetails.edit_a_farm);
  app.route('/farm/update/:id')
    .post(farmDetails.update_a_farm);
  app.route('/farm/delete/:id')
    .post(farmDetails.delete_a_farm_id);
  app.route('/farm/activate1/:id')
    .post(farmDetails.activate_farm_1);
  app.route('/farm/deactivate1/:id')
    .post(farmDetails.deactivate_farm_1);
  app.route('/farm/activate2/:id')
    .post(farmDetails.activate_farm_2);
  app.route('/farm/deactivate2/:id')
    .post(farmDetails.deactivate_farm_2);
  app.route('/farm/turnon/alarm/:id')
    .post(farmDetails.turnon_farm2_alarm);
  app.route('/farm/turnoff/alarm/:id')
    .post(farmDetails.turnoff_farm2_alarm);
  app.route('/farm/location/:id')
    .get(farmDetails.show_farm_location);
  app.route('/farm/show/:id')
    .get(farmDetails.show_farm_detail);

  app.route('/api/farm/delete/:id')
    .post(farmDetails.api_delete_a_farm_id);
  app.route('/api/farm/update/title/:id/:value')
    .post(farmDetails.api_update_farm_title);
  app.route('/api/farm/update/description/:id/:value')
    .post(farmDetails.api_update_farm_description);
  app.route('/api/farm1/update/location/:id/:latitude/:longitude')
    .post(farmDetails.api_update_farm1_location);
  app.route('/api/farm2/update/location/:id/:latitude/:longitude')
    .post(farmDetails.api_update_farm2_location);
  app.route('/api/farm2/update/tape_interval/:id/:value')
    .post(farmDetails.api_update_farm2_tape_interval);
  app.route('/api/farm2/update/drip_interval/:id/:value')
    .post(farmDetails.api_update_farm2_drip_interval);
  app.route('/api/farm2/update/drip_flowrate/:id/:value')
    .post(farmDetails.api_update_farm2_drip_flowrate);
  app.route('/api/farm1/update/soil/:id/:soil_id')
    .post(farmDetails.api_update_farm1_soil_id);
  app.route('/api/farm2/update/soil/:id/:soil_id')
    .post(farmDetails.api_update_farm2_soil_id);
  app.route('/api/farm1/update/plant/:id/:plant_id')
    .post(farmDetails.api_update_farm1_plant_id);
  app.route('/api/farm2/update/plant/:id/:plant_id')
    .post(farmDetails.api_update_farm2_plant_id);
  app.route('/api/farm1/update/starting_date/:id/:value')
    .post(farmDetails.api_update_farm1_starting_date);
  app.route('/api/farm2/update/starting_date/:id/:value')
    .post(farmDetails.api_update_farm2_starting_date);
  app.route('/api/farm/update/rain_sensor_id/:id/:value')
    .post(farmDetails.api_update_farm_rain_sensor_id);
  app.route('/api/farm/update/humidity_sensor_id/:id/:value')
    .post(farmDetails.api_update_farm_humidity_sensor_id);
  app.route('/api/farm/update/mainpump_id/:id/:value')
    .post(farmDetails.api_update_farm_mainpump_id);
  app.route('/api/farm/update/valve_1_id/:id/:value')
    .post(farmDetails.api_update_farm_valve_1_id);
  app.route('/api/farm/update/valve_2_id/:id/:value')
    .post(farmDetails.api_update_farm_valve_2_id);
  app.route('/api/farm/update/linegroup_token/:id/:value')
    .post(farmDetails.api_update_farm_linegroup_token);

  app.route('/api/farm/activate1/:id')
    .post(farmDetails.api_activate_farm_1);
  app.route('/api/farm/deactivate1/:id')
    .post(farmDetails.api_deactivate_farm_1);
  app.route('/api/farm/set/sampling_time/:id/:value')
    .post(farmDetails.api_set_sampling_time);
  app.route('/api/farm/set/valve1/channel/:farm_id/:valve_id')
    .post(farmDetails.api_set_valve1_channel);
  app.route('/api/farm/set/valve2/channel/:farm_id/:valve_id')
    .post(farmDetails.api_set_valve2_channel);
  app.route('/api/farm/set/humidity/channel/:farm_id/:humidity_id')
    .post(farmDetails.api_set_humidity_channel);
  app.route('/api/farm/set/humidity_critical_point/:farm_id/:value')
    .post(farmDetails.api_set_humidity_critical_point);

  app.route('/api/farm/activate2/:id')
    .post(farmDetails.api_activate_farm_2);
  app.route('/api/farm/deactivate2/:id')
    .post(farmDetails.api_deactivate_farm_2);
  app.route('/api/farm/turnon/alarm/:id')
    .post(farmDetails.api_turnon_farm2_alarm);
  app.route('/api/farm/turnoff/alarm/:id')
    .post(farmDetails.api_turnoff_farm2_alarm);
  app.route('/api/farm2/update/alarm/:id/:value')
    .post(farmDetails.api_update_farm2_alarm);
  app.route('/api/farm2/update/alarm_interval/:id/:value')
    .post(farmDetails.api_update_farm2_alarm_interval);
  app.route('/api/farm/set/watering_complete/:id/:ws')
    .post(farmDetails.api_set_watering_complete);

  app.route('/valveschedule')
    .get(farmDetails.list_all_schedule)
    .post(farmDetails.new_schedule);
  app.route('/valveschedule/create')
    .post(farmDetails.create_schedule);
  app.route('/valveschedule/edit/:id')
    .post(farmDetails.edit_schedule);
  app.route('/valveschedule/update/:id')
    .post(farmDetails.update_schedule);

  app.route('/listHardware')
    .get(farmDetails.list_all_hardware);

  app.route('/computeETp/:latitude/:longitude')
    .get(farmDetails.compute_etp);
  app.route('/computeWateringSchedule/:farm_id')
    .get(farmDetails.compute_watering_schedule);
};
