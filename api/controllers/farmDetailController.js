'use strict';

var moment = require('moment');
const uuidv1 = require('uuid/v1');
var admin = require("firebase");
var db = admin.database();

var ThingSpeakClient = require('thingspeakclient');

var userList = [];

function snapshotToArray(snapshot) {
    var returnArr = [];

    snapshot.forEach(function(childSnapshot) {
        var item = childSnapshot.val();
        item.id = childSnapshot.key;

        returnArr.push(item);
    });

    return returnArr;
};

function snapshotToArray2(snapshot, type) {
    var returnArr = [];

    snapshot.forEach(function(childSnapshot) {
        var item = childSnapshot.val();
        if(item.watering_scheme == type)
        {
          item.id = childSnapshot.key;
          returnArr.push(item);
        }
    });

    return returnArr;
};


function findSoilObject(id)
{
  var ref = db.ref('/soil');
  ref.once('value', function(snapshot){
    var obj2 = JSON.parse(JSON.stringify(snapshot));
    var idObj2 = Object.keys(obj2);
    var soils = idObj2.map(function (key) {
      return obj2[key];
    });
    var i = 0;
    soils.forEach(function(s){
      console.log("compare soil id => " + id + " with " + idObj2[i]);
      if(idObj2[i] == id)
      {
            console.log("found one!!!!!!!!!!!!!!!");
            s.id = id;
            return s;
      }
      i++;
    });
  });
}

function findPlantObject(id)
{
  var ref = db.ref('/plant');
  ref.once('value', function(snapshot){
    var obj2 = JSON.parse(JSON.stringify(snapshot));
    var idObj2 = Object.keys(obj2);
    var soils = idObj2.map(function (key) {
      return obj2[key];
    });
    var ss;
    var i = 0;
    soils.forEach(function(s){
      if(idObj2[i] == id)
      {
            s.id = id;
            return s;
      }
      i++;
    });
  });
}

exports.list_all_farm = function(req, res) {
  var ref = db.ref('/farm');
  ref.once('value', function(snapshot) {
    var obj = snapshotToArray(snapshot);
    //console.log("Mainpump list => " + JSON.stringify(obj) + " with size of " + obj.length);
    //console.log("farms..............", obj);
    res.render('dashboard/farm/list_farm.ejs', {farms: obj});
    //res.render('dashboard/error403.ejs', {});
  }, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
    res.render('dashboard/error405.ejs', {});
  });
};

exports.list_all_farm_type = function(req, res) {
  var farm_type = req.params.type;
  var ref = db.ref('/farm');
  ref.once('value', function(snapshot) {
    var obj = snapshotToArray2(snapshot, farm_type);
    //console.log("Mainpump list => " + JSON.stringify(obj) + " with size of " + obj.length);
    //console.log("farms..............", obj);
    res.render('dashboard/farm/list_farm.ejs', {farms: obj});
  }, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
    res.render('dashboard/error405.ejs', {});
  });
};


exports.new_farm = function(req, res) {
  var ref = db.ref('/soil');
  ref.once('value', function(snapshot){
    var obj2 = JSON.parse(JSON.stringify(snapshot));
    var idObj2 = Object.keys(obj2);
    var soils = [];
    for(var i=0;i<idObj2.length;i++)
    {
      soils.push(obj2[idObj2[i]]);
      soils[i].id = idObj2[i];
    }

    //console.log("Soil.............. ", vals);
    ref = db.ref('/plant');
    ref.once('value', function(snapshot){
      var obj3 = JSON.parse(JSON.stringify(snapshot));
      var idObj3 = Object.keys(obj3);
      var plants = [];
      for(var i=0;i<idObj3.length;i++)
      {
        plants.push(obj3[idObj3[i]]);
        plants[i].id = idObj3[i];
      }
      var moment = require('moment');
      res.render('dashboard/farm/create_farm.ejs', {soils: soils, plants: plants, moment:moment});
    });
  });
};



//exports.create_a_farm = function(req, res) {
  /*int id;
  String title;
  String description;
  String latitude;
  String longitude;
  int zone_number;
  int watering_scheme;
  int soil_type;
  String soil_type_label;
  int photoId;
  Calendar calendar = Calendar.getInstance();
  int start_day = calendar.get(Calendar.DAY_OF_MONTH);
  int start_month = calendar.get(Calendar.MONTH);
  int start_year = calendar.get(Calendar.YEAR);*/
  /*var farm_id = uuidv1();
  var farm_title = req.body.add_farm_title;
  var farm_description = req.body.add_farm_description;
  var farm_latitude = req.body.add_farm_latitude;
  var farm_longitude = req.body.add_farm_longitude;
  var farm_tape_interval = req.body.add_farm_tape_interval;
  var farm_drip_interval = req.body.add_farm_drip_interval;
  var farm_drip_flowrate = req.body.add_farm_drip_flowrate;
  var farm_created_at = moment().format();

  // compute
  var farm_total_drip_per_rai = Math.floor(1600/(farm_tape_interval*farm_drip_interval));
  var farm_total_flowrate_per_rai = farm_total_drip_per_rai*farm_drip_flowrate;

  console.log('Create farm id = ' + farm_id);

  */
  /*var ref = db.ref('/mainpump/' + pump_id).set({
    write_api_key: write_api_key
  });*/

  /*
    var ref = db.ref('/farm').child(farm_id).set({
      title: farm_title,
      description: farm_description,
      latitude: farm_latitude,
      longitude: farm_longitude,
      tape_interval: farm_tape_interval,
      drip_interval: farm_drip_interval,
      drip_flowrate: farm_drip_flowrate,
      total_drip_per_rai: farm_total_drip_per_rai,
      total_flowrate_per_rai: farm_total_flowrate_per_rai,
      created_at: farm_created_at
    });
  res.redirect('farm');
};  */

exports.create_a_farm = function(req, res) {
    var watering_scheme = req.body.create_farm_watering_scheme;
    console.log("Watering schemeeeeeeeeeeeeee => ", watering_scheme);
    var ref = db.ref('/soil');
    ref.once('value', function(snapshot){
      var obj2 = JSON.parse(JSON.stringify(snapshot));
      var selected_soil = obj2[req.body.create_soil_id];
      //console.log("selected soil.....................", selected_soil);
      ref = db.ref('/plant');
      ref.once('value', function(snapshot){
        var obj3 = JSON.parse(JSON.stringify(snapshot));
        var selected_plant = obj3[req.body.create_plant_id];
        console.log("creating new farm data...");
        var farm_id = uuidv1();
        var farm_created_at = moment().format();
        //, soils: obj2 compute


        /*var ref = db.ref('/mainpump/' + pump_id).set({
          write_api_key: write_api_key
        });*/
        switch(watering_scheme)
        {
          case '1':
          var ref = db.ref('/farm').child(farm_id).set({
              uid: req.body.create_farm_uid,
              title: req.body.create_farm_title,
              description: req.body.create_farm_description,
              latitude: req.body.create_farm_latitude,
              longitude: req.body.create_farm_longitude,
              soil_id: req.body.create_soil_id,
              soil_title: selected_soil.title_thai,
              plant_id: req.body.create_plant_id,
              plant_title: selected_plant.title,
              starting_date: req.body.create_farm_starting_date,
              watering_scheme: watering_scheme,
              humidity_sensor_id: "000000",
              humidity_critical_point: "15",
              humidity_last_checked: farm_created_at,
              humidity_last_read: "0",
              mainpump_id: "-",
              valve_1_id: "-",
              valve_2_id: "-",
              valve_3_id: "-",
              valve_4_id: "-",
              valve_5_id: "-",
              valve_6_id: "-",
              valve_7_id: "-",
              valve_8_id: "-",
              valve_9_id: "-",
              valve_10_id: "-",
              //humidity_sensor_id: req.body.create_farm_humidity_sensor_id,
              //mainpump_id: req.body.create_farm_mainpump_id,
              //valve_1_id: req.body.create_farm_valve_1_id,
              //valve_2_id: req.body.create_farm_valve_2_id,
              sampling_time: "15",
              linegroup_token: req.body.create_farm_linegroup_token,
              activated: 'false',
              last_activated_at: farm_created_at,
              need_watering: 'false',
              public: 'true',
              farm_last_checked: farm_created_at,
              created_at: farm_created_at,
              last_updated: farm_created_at
            }, function(err){
              if(err)
                res.render('dashboard/error405.ejs', {});
              else {
                res.redirect('/farm');
              }
            });
            break;
          case '2':
            // compute
            var farm_tape_interval = "1.2";
            var farm_drip_interval = "0.3";
            var farm_drip_flowrate = "1.3";
            var farm_total_drip_per_rai = Math.floor(1600/(farm_tape_interval*farm_drip_interval));
            var farm_total_flowrate_per_rai = farm_total_drip_per_rai*farm_drip_flowrate;
            var ref = db.ref('/farm').child(farm_id).set({
                uid: req.body.create_farm_uid,
                title: req.body.create_farm_title,
                description: req.body.create_farm_description,
                latitude: req.body.create_farm_latitude,
                longitude: req.body.create_farm_longitude,
                tape_interval: farm_tape_interval,
                drip_interval: farm_drip_interval,
                drip_flowrate: farm_drip_flowrate,
                total_drip_per_rai: farm_total_drip_per_rai,
                total_flowrate_per_rai: farm_total_flowrate_per_rai,
                soil_id: req.body.create_soil_id,
                soil_title: selected_soil.title_thai,
                plant_id: req.body.create_plant_id,
                plant_title: selected_plant.title,
                watering_scheme: watering_scheme,
                rain_sensor_id: "000000",
                rain_last_checked: farm_created_at,
                rain_last_read: "0",
                mainpump_id: "-",
                valve_1_id: "-",
                valve_2_id: "-",
                valve_3_id: "-",
                valve_4_id: "-",
                valve_5_id: "-",
                valve_6_id: "-",
                valve_7_id: "-",
                valve_8_id: "-",
                valve_9_id: "-",
                valve_10_id: "-",
                starting_date: req.body.create_farm_starting_date,
                linegroup_token: req.body.create_farm_linegroup_token,
                alarm_time: "08:00",
                alarm_start: "false",
                alarm_interval: "15",
                activated: 'false',
                last_activated_at: farm_created_at,
                need_watering: 'false',
                public: 'true',
                created_at: farm_created_at,
                last_updated: moment().format()
              }, function(err){
                if(err)
                  res.render('dashboard/error405.ejs', {});
                else {
                  var ETp = require('../../etp/ETp.js');
                  var watering_schedule = ETp.computeWateringSchedule(farm_id, function(ws){
                    ref = db.ref('/farm').child(farm_id).update({
                      watering_schedule: ws
                    }, function(err){
                        if(err)
                          res.render('dashboard/error405.ejs', {});
                        else
                          res.redirect('/farm');
                    });
                  });
                };
              });
            break;
        }

          /*
            var ref = db.ref('/farm').child(farm_id).set({
                title: req.body.create_farm_title,
                description: req.body.create_farm_description,
                latitude: req.body.create_farm_latitude,
                longitude: req.body.create_farm_longitude,
                tape_interval: req.body.create_farm_tape_interval,
                drip_interval: req.body.create_farm_drip_interval,
                drip_flowrate: req.body.create_farm_drip_flowrate,
                total_drip_per_rai: farm_total_drip_per_rai,
                total_flowrate_per_rai: farm_total_flowrate_per_rai,
                soil_id: req.body.create_soil_id,
                soil_title: selected_soil.title_thai,
                plant_id: req.body.create_plant_id,
                plant_title: selected_plant.title,
                starting_date: req.body.create_farm_starting_date,
                water_scheme: water_scheme,
                created_at: farm_created_at
              }, function(err){
                if(err)
                  res.send("703");
                else {
                  res.redirect('../farm');
                }
              });
              */
      });
    });

};

exports.edit_a_farm = function(req, res) {
  var async = require('async');
  var farm_id = req.params.id;
  async.parallel([
    function(callback){
      var ref = db.ref('/farm/' + farm_id);
      ref.once('value', function(snapshot) {
        var farm = JSON.parse(JSON.stringify(snapshot));
        //res.redirect('../farm');
        //console.log("Edit farm[" + farm_id + "].......................................");
        farm.id = farm_id;
        callback(null, farm);
      });
    },
    function(callback){
      var ref = db.ref('/soil');
      ref.once('value', function(snapshot){
        var obj2 = JSON.parse(JSON.stringify(snapshot));
        var idObj2 = Object.keys(obj2);
        var soils = [];
        for(var i=0;i<idObj2.length;i++)
        {
          soils.push(obj2[idObj2[i]]);
          soils[i].id = idObj2[i];
        }
        callback(null, soils);
      });
    },
    function(callback){
      var ref = db.ref('/plant');
      ref.once('value', function(snapshot){
        var obj3 = JSON.parse(JSON.stringify(snapshot));
        var idObj3 = Object.keys(obj3);
        var plants = [];
        for(var i=0;i<idObj3.length;i++)
        {
          plants.push(obj3[idObj3[i]]);
          plants[i].id = idObj3[i];
        }
        callback(null, plants);
      });
    },
    function(callback){
      var ref = db.ref('/sensor');
      ref.once('value', function(snapshot){
        var obj3 = JSON.parse(JSON.stringify(snapshot));
        var idObj3 = Object.keys(obj3);
        var sensors = [];
        for(var i=0;i<idObj3.length;i++)
        {
          sensors.push(obj3[idObj3[i]]);
          sensors[i].id = idObj3[i];
        }
        callback(null, sensors);
      });
    },
    function(callback){
      var ref = db.ref('/mainpump');
      ref.once('value', function(snapshot){
        var obj3 = JSON.parse(JSON.stringify(snapshot));
        var idObj3 = Object.keys(obj3);
        var mainpumps = [];
        for(var i=0;i<idObj3.length;i++)
        {
          mainpumps.push(obj3[idObj3[i]]);
          mainpumps[i].id = idObj3[i];
        }
        callback(null, mainpumps);
      });
    },
    function(callback){
      var ref = db.ref('/valve');
      ref.once('value', function(snapshot){
        var obj3 = JSON.parse(JSON.stringify(snapshot));
        var idObj3 = Object.keys(obj3);
        var valves = [];
        for(var i=0;i<idObj3.length;i++)
        {
          valves.push(obj3[idObj3[i]]);
          valves[i].id = idObj3[i];
        }
        callback(null, valves);
      });
    }
  ], function(err, results){
      if(err)
        send(err);
      var moment = require('moment');
      switch(results[0].watering_scheme)
      {
        case '1':
          res.render('dashboard/farm/edit_farm1.ejs', {farm: results[0], soils: results[1], plants: results[2], sensors: results[3], mainpumps: results[4], valves: results[5], moment: moment});
          break;
        case '2':
          res.render('dashboard/farm/edit_farm2.ejs', {farm: results[0], soils: results[1], plants: results[2], sensors: results[3], mainpumps: results[4], valves: results[5], moment: moment});
          break;
      }
  });
};

exports.edit_a_farm2 = function(req, res) {
  var farm_id = req.params.id;
  var ref = db.ref('/farm/' + farm_id);
  ref.once('value', function(snapshot) {
    var obj = JSON.parse(JSON.stringify(snapshot));
    //res.redirect('../farm');
    //console.log("Edit farm[" + farm_id + "].......................................");
    obj.id = farm_id;
    ref = db.ref('/soil');
    ref.once('value', function(snapshot){
      var obj2 = JSON.parse(JSON.stringify(snapshot));
      var idObj2 = Object.keys(obj2);
      var soils = [];
      for(var i=0;i<idObj2.length;i++)
      {
        soils.push(obj2[idObj2[i]]);
        soils[i].id = idObj2[i];
      }

      //console.log("Soil.............. ", vals);
      ref = db.ref('/plant');
      ref.once('value', function(snapshot){
        var obj3 = JSON.parse(JSON.stringify(snapshot));
        var idObj3 = Object.keys(obj3);
        var plants = [];
        for(var i=0;i<idObj3.length;i++)
        {
          plants.push(obj3[idObj3[i]]);
          plants[i].id = idObj3[i];
        }
        var moment = require('moment');
        switch(obj.watering_scheme)
        {
          case '1':
            res.render('dashboard/farm/edit_farm1.ejs', {farm: obj, soils: soils, plants: plants, moment: moment});
            break;
          case '2':
            res.render('dashboard/farm/edit_farm2.ejs', {farm: obj, soils: soils, plants: plants, moment: moment});
            break;
        }

      });
    });
  });
};

exports.update_a_farm = function(req, res) {
  //, soils: obj2 compute

  /*var ref = db.ref('/mainpump/' + pump_id).set({
    write_api_key: write_api_key
  });*/
  var last_updated = moment().format();
  var ref = db.ref('/soil');
  ref.once('value', function(snapshot){
    var obj2 = JSON.parse(JSON.stringify(snapshot));
    var selected_soil = obj2[req.body.edit_soil_id];
    //console.log("selected soil.....................", selected_soil);
    ref = db.ref('/plant');
    ref.once('value', function(snapshot){
      var obj3 = JSON.parse(JSON.stringify(snapshot));
      var selected_plant = obj3[req.body.edit_plant_id];
      var farm_id = req.body.edit_farm_id;
      var farm_starting_date = req.body.edit_farm_starting_date;
      var farm_created_at = moment().format();
      var farm_watering_scheme = req.body.edit_farm_watering_scheme;

      switch(farm_watering_scheme){
        case '1':
          /*var ref = db.ref('/mainpump/' + pump_id).set({
            write_api_key: write_api_key
          });*/
          var ref = db.ref('/farm').child(farm_id).update({
              title: req.body.edit_farm_title,
              description: req.body.edit_farm_description,
              latitude: req.body.edit_farm_latitude,
              longitude: req.body.edit_farm_longitude,
              soil_id: req.body.edit_soil_id,
              soil_title: selected_soil.title_thai,
              plant_id: req.body.edit_plant_id,
              plant_title: selected_plant.title,
              humidity_critical_point: req.body.edit_farm_humidity_critical_point,
              watering_scheme: farm_watering_scheme,
              starting_date: farm_starting_date,
              humidity_sensor_id: req.body.edit_farm_humidity_sensor_id,
              mainpump_id: req.body.edit_farm_mainpump_id,
              valve_1_id: req.body.edit_farm_valve_1_id,
              valve_2_id: req.body.edit_farm_valve_2_id,
              sampling_time: req.body.edit_farm_sampling_time,
              linegroup_token: req.body.edit_farm_linegroup_token,
              last_updated: last_updated
            }, function(err){
              if(err)
                res.render('dashboard/error405.ejs', {});
              else {
                //console.log("current edit farm directory => ", __dirname);
                res.redirect('/farm');
              }
            });
          break;
        case '2':
        //, soils: obj2 compute
        var farm_total_drip_per_rai = Math.floor(1600/(req.body.edit_farm_tape_interval*req.body.edit_farm_drip_interval));
        var farm_total_flowrate_per_rai = farm_total_drip_per_rai*req.body.edit_farm_drip_flowrate;

        /*var ref = db.ref('/mainpump/' + pump_id).set({
          write_api_key: write_api_key
        });*/
          var ref = db.ref('/farm').child(farm_id).update({
              title: req.body.edit_farm_title,
              description: req.body.edit_farm_description,
              latitude: req.body.edit_farm_latitude,
              longitude: req.body.edit_farm_longitude,
              tape_interval: req.body.edit_farm_tape_interval,
              drip_interval: req.body.edit_farm_drip_interval,
              drip_flowrate: req.body.edit_farm_drip_flowrate,
              total_drip_per_rai: farm_total_drip_per_rai,
              total_flowrate_per_rai: farm_total_flowrate_per_rai,
              soil_id: req.body.edit_soil_id,
              soil_title: selected_soil.title_thai,
              plant_id: req.body.edit_plant_id,
              plant_title: selected_plant.title,
              watering_scheme: farm_watering_scheme,
              starting_date: farm_starting_date,
              rain_sensor_id: req.body.edit_farm_rain_sensor_id,
              mainpump_id: req.body.edit_farm_mainpump_id,
              valve_1_id: req.body.edit_farm_valve_1_id,
              valve_2_id: req.body.edit_farm_valve_2_id,
              alarm_time: req.body.edit_farm_alarm_time,
              alarm_interval: req.body.edit_farm_alarm_interval,
              linegroup_token: req.body.edit_farm_linegroup_token,
              last_updated: moment().format()
            }, function(err){
              if(err)
                res.render('dashboard/error405.ejs', {});
              else {
                var ETp = require('../../etp/ETp.js');
                var watering_schedule = ETp.computeWateringSchedule(farm_id, function(ws){
                  ref = db.ref('/farm').child(farm_id).update({
                    watering_schedule: ws
                  }, function(err){
                      if(err)
                        res.render('dashboard/error405.ejs', {});
                      else
                        res.redirect('/farm/show/' + farm_id);
                  });
                });
              };
            });
          break;
      }
    });
  });
};

exports.update_a_farm2 = function(req, res) {
  //, soils: obj2 compute

  /*var ref = db.ref('/mainpump/' + pump_id).set({
    write_api_key: write_api_key
  });*/
  var ref = db.ref('/soil');
  ref.once('value', function(snapshot){
    var obj2 = JSON.parse(JSON.stringify(snapshot));
    var selected_soil = obj2[req.body.edit_soil_id];
    //console.log("selected soil.....................", selected_soil);
    ref = db.ref('/plant');
    ref.once('value', function(snapshot){
      var obj3 = JSON.parse(JSON.stringify(snapshot));
      var selected_plant = obj3[req.body.edit_plant_id];
      var farm_id = req.body.edit_farm_id;
      var farm_starting_date = req.body.edit_farm_starting_date;
      var farm_created_at = moment().format();
      var farm_watering_scheme = req.body.edit_farm_watering_scheme;

      switch(farm_watering_scheme){
        case '1':
          /*var ref = db.ref('/mainpump/' + pump_id).set({
            write_api_key: write_api_key
          });*/
          var ref = db.ref('/farm').child(farm_id).update({
              title: req.body.edit_farm_title,
              description: req.body.edit_farm_description,
              latitude: req.body.edit_farm_latitude,
              longitude: req.body.edit_farm_longitude,
              soil_id: req.body.edit_soil_id,
              soil_title: selected_soil.title_thai,
              plant_id: req.body.edit_plant_id,
              plant_title: selected_plant.title,
              humidity_critical_point: req.body.edit_farm_humidity_critical_point,
              watering_scheme: farm_watering_scheme,
              starting_date: farm_starting_date,
              humidity_sensor_id: req.body.edit_farm_humidity_sensor_id,
              mainpump_id: req.body.edit_farm_mainpump_id,
              valve_1_id: req.body.edit_farm_valve_1_id,
              valve_2_id: req.body.edit_farm_valve_2_id,
              sampling_time: req.body.edit_farm_sampling_time,
              linegroup_token: req.body.edit_farm_linegroup_token,
              last_updated: last_updated
            }, function(err){
              if(err)
                res.render('dashboard/error405.ejs', {});
              else {
                //console.log("current edit farm directory => ", __dirname);
                res.redirect('/farm');
              }
            });
          break;
        case '2':
        //, soils: obj2 compute
        var farm_total_drip_per_rai = Math.floor(1600/(req.body.edit_farm_tape_interval*req.body.edit_farm_drip_interval));
        var farm_total_flowrate_per_rai = farm_total_drip_per_rai*req.body.edit_farm_drip_flowrate;

        /*var ref = db.ref('/mainpump/' + pump_id).set({
          write_api_key: write_api_key
        });*/
        var ETp = require('../../etp/ETp.js');
        var watering_schedule = ETp.computeWateringSchedule(farm_id, function(ws){
          var ref = db.ref('/farm').child(farm_id).update({
              title: req.body.edit_farm_title,
              description: req.body.edit_farm_description,
              latitude: req.body.edit_farm_latitude,
              longitude: req.body.edit_farm_longitude,
              tape_interval: req.body.edit_farm_tape_interval,
              drip_interval: req.body.edit_farm_drip_interval,
              drip_flowrate: req.body.edit_farm_drip_flowrate,
              total_drip_per_rai: farm_total_drip_per_rai,
              total_flowrate_per_rai: farm_total_flowrate_per_rai,
              soil_id: req.body.edit_soil_id,
              soil_title: selected_soil.title_thai,
              plant_id: req.body.edit_plant_id,
              plant_title: selected_plant.title,
              watering_scheme: farm_watering_scheme,
              watering_schedule: ws,
              starting_date: farm_starting_date,
              mainpump_id: req.body.edit_farm_mainpump_id,
              valve_1_id: req.body.edit_farm_valve_1_id,
              valve_2_id: req.body.edit_farm_valve_2_id,
              linegroup_token: req.body.edit_farm_linegroup_token,
              last_updated: moment().format()
            }, function(err){
              if(err)
                res.render('dashboard/error405.ejs', {});
              else {
                var ETp = require('../../etp/ETp.js');
                var watering_schedule = ETp.computeWateringSchedule(farm_id, function(ws){
                  ref = db.ref('/farm').child(farm_id).update({
                    watering_schedule: ws
                  }, function(err){
                      if(err)
                        res.render('dashboard/error405.ejs', {});
                      else
                        res.redirect('/farm');
                  });
                });
              };
            });
          });
          break;
      }
    });
  });
};

exports.show_farm_detail = function(req, res) {
  var async = require('async');
  var farm = [];
  var mainpump = [];
  var sensor = [];
  var valve1 = [];
  var valve2 = [];
  var farm_id = req.params.id;
  async.parallel([
    function(cb){
      var async2 = require('async');
      async2.series([
        function(callback){
          var ref = db.ref('/farm/' + farm_id);
          ref.once('value', function(snapshot) {
            farm = JSON.parse(JSON.stringify(snapshot));
            //res.redirect('../farm');
            //console.log("Edit farm[" + farm_id + "].......................................");
            farm.id = farm_id;
            //console.log("Farm...." + farm.description);
            callback(null, farm);
          });
        },
        function(callback){
          var ref = db.ref('/mainpump/'+farm.mainpump_id);
          ref.once('value', function(snapshot){
            mainpump = JSON.parse(JSON.stringify(snapshot));
            callback(null, mainpump);
          });
        },
        function(callback){
          if(farm.watering_scheme == "1")
          {
            var ref = db.ref('/sensor/'+farm.humidity_sensor_id);
            ref.once('value', function(snapshot){
              sensor = JSON.parse(JSON.stringify(snapshot));
              //console.log("Sensor...." + farm.humidity_sensor_id + sensor);
              callback(null, sensor);
            });
          }
          else if(farm.watering_scheme == "2") {
            var ref = db.ref('/sensor/'+farm.rain_sensor_id);
            ref.once('value', function(snapshot){
              sensor = JSON.parse(JSON.stringify(snapshot));
              //console.log("Sensor...." + farm.humidity_sensor_id + sensor);
              callback(null, sensor);
            });
          }
        },
        function(callback){
          var ref = db.ref('/valve/'+farm.valve_1_id);
          ref.once('value', function(snapshot){
            valve1 = JSON.parse(JSON.stringify(snapshot));
            callback(null, valve1);
          });
        },
        function(callback){
          var ref = db.ref('/valve/'+farm.valve_2_id);
          ref.once('value', function(snapshot){
            valve2 = JSON.parse(JSON.stringify(snapshot));
            callback(null, valve2);
          });
        },
      ], function(err, sresults){
            cb(null, sresults);
      });
    },
    function(callback){
      var ref = db.ref('/soil');
      ref.once('value', function(snapshot){
        var obj2 = JSON.parse(JSON.stringify(snapshot));
        var idObj2 = Object.keys(obj2);
        var soils = [];
        for(var i=0;i<idObj2.length;i++)
        {
          soils.push(obj2[idObj2[i]]);
          soils[i].id = idObj2[i];
        }
        callback(null, soils);
      });
    },
    function(callback){
      var ref = db.ref('/plant');
      ref.once('value', function(snapshot){
        var obj3 = JSON.parse(JSON.stringify(snapshot));
        var idObj3 = Object.keys(obj3);
        var plants = [];
        for(var i=0;i<idObj3.length;i++)
        {
          plants.push(obj3[idObj3[i]]);
          plants[i].id = idObj3[i];
        }
        callback(null, plants);
      });
    },
    function(callback){
      var ref = db.ref('/mainpump');
      ref.once('value', function(snapshot){
        var obj3 = JSON.parse(JSON.stringify(snapshot));
        var idObj3 = Object.keys(obj3);
        var plants = [];
        for(var i=0;i<idObj3.length;i++)
        {
          plants.push(obj3[idObj3[i]]);
          plants[i].id = idObj3[i];
        }
        callback(null, plants);
      });
    },
  ], function(err, results){
    if(err)
      send(err);
    var moment = require('moment');
    switch(farm.watering_scheme)
      {
        case '1':
          //console.log(sensor);
          res.render('dashboard/farm/show_farm1.ejs', {farm: results[0][0], soils: results[1], plants: results[2], moment: moment, mainpump: results[0][1], sensor: results[0][2], valve1: results[0][3], valve2: results[0][4]});
          break;
        case '2':
          //var ws = snapshotToArray(farm.watering_schedule);

          res.render('dashboard/farm/show_farm2.ejs', {farm: results[0][0], soils: results[1], plants: results[2], moment: moment, mainpump: results[0][1], sensor: results[0][2], valve1: results[0][3], valve2: results[0][4]});
          break;
      }
  });
};

exports.form_common = function(req, res){
  res.render('dashboard/form-common.ejs', {});
};

exports.delete_a_farm_id = function(req, res){
  var farm_id = req.params.id;
  var ref = db.ref('/farm/'+farm_id).remove(function(err){
    if(err)
      res.render('dashboard/error405.ejs', {});
    res.redirect('/farm');
    console.log("Farm [" + farm_id + "] has been deleted!");
  });
};

exports.api_delete_a_farm_id = function(req, res){
  var farm_id = req.params.id;
  //console.log("Delete farm by id => " + farm_id);
  var ref = db.ref('/farm/'+farm_id).remove(function(err){
    if(err)
    {
      res.send("201");
    }
    else {
      console.log("Farm [" + farm_id + "] has been deleted!");
      res.send("200");
    }
  });
};

exports.api_update_farm_title = function(req, res){
  //console.log("Update farm title recieve => ", req.params);
  var farm_id = req.params.id;
  //console.log("Set sampling time of farm[" + farm_id + "] with value = " + sampling_time + " minutes...");
  var ref = db.ref('/farm/').child(farm_id).update({
    title: req.params.value,
    last_updated: moment().format()
  }, function(err){
    if(err)
    {
      console.log("Update title of farm[" + farm_id + "] with value = " + req.params.value + "...FAILED!");
      //res.send('{\"code\":\"500\", \"message\":\"ตั้งค่าตรวจสอบเซ็นเซอร์ไม่สำเร็จ\"}');
      res.send("201");
    }
    console.log("Update title of farm[" + farm_id + "] with value = " + req.params.value + "...OK!");
    //res.send('{\"code\":\"200\", \"message\":\"ตั้งค่าตรวจสอบเซ็นเซอร์เรียบร้อย\"}');
    res.send("200");
  });
}

exports.api_update_farm_description = function(req, res){
  //console.log("Update farm title recieve => ", req.params);
  var farm_id = req.params.id;
  //console.log("Set sampling time of farm[" + farm_id + "] with value = " + sampling_time + " minutes...");
  var ref = db.ref('/farm/').child(farm_id).update({
    description: req.params.value,
    last_updated: moment().format()
  }, function(err){
    if(err)
    {
      console.log("Update description of farm[" + farm_id + "] with value = " + req.params.value + "...FAILED!");
      //res.send('{\"code\":\"500\", \"message\":\"ตั้งค่าตรวจสอบเซ็นเซอร์ไม่สำเร็จ\"}');
      res.send("201");
    }
    console.log("Update description of farm[" + farm_id + "] with value = " + req.params.value + "...OK!");
    //res.send('{\"code\":\"200\", \"message\":\"ตั้งค่าตรวจสอบเซ็นเซอร์เรียบร้อย\"}');
    res.send("200");
  });
}

exports.api_update_farm1_location = function(req, res){
  //console.log("Update farm title recieve => ", req.params);
  var farm_id = req.params.id;
  //console.log("Set sampling time of farm[" + farm_id + "] with value = " + sampling_time + " minutes...");
  var ref = db.ref('/farm/').child(farm_id).update({
    latitude: req.params.latitude,
    longitude: req.params.longitude,
    last_updated: moment().format()
  }, function(err){
    if(err)
    {
      console.log("Update location of farm[" + farm_id + "] with value = " + req.params.latitude + "," + req.params.longitude + "...FAILED!");
      //res.send('{\"code\":\"500\", \"message\":\"ตั้งค่าตรวจสอบเซ็นเซอร์ไม่สำเร็จ\"}');
      res.send("201");
    }
    console.log("Update location of farm[" + farm_id + "] with value = " + req.params.latitude + "," + req.params.longitude + "...OK!");
    //res.send('{\"code\":\"200\", \"message\":\"ตั้งค่าตรวจสอบเซ็นเซอร์เรียบร้อย\"}');
    res.send("200");
  });
}

exports.api_update_farm2_location = function(req, res){
  var farm_id = req.params.id;
  var ref = db.ref('/farm').child(farm_id).update({
              latitude: req.params.latitude,
              longitude: req.params.longitude,
              last_updated: moment().format()
            }, function(err){
              if(err)
              {
                console.log("Update location of farm[" + farm_id + "] with value = " + req.params.latitude + "," + req.params.longitude + "...FAILED!");
                res.send("201");
              }
              else {
                var ETp = require('../../etp/ETp.js');
                var watering_schedule = ETp.computeWateringSchedule(farm_id, function(ws){
                  ref = db.ref('/farm').child(farm_id).update({
                    watering_schedule: ws
                  }, function(err){
                      if(err)
                      {
                        console.log("Update location of farm[" + farm_id + "] with value = " + req.params.latitude + "," + req.params.longitude + "...FAILED!");
                        res.send("202");
                      }
                      else
                      {
                        console.log("Update location of farm[" + farm_id + "] with value = " + req.params.latitude + "," + req.params.longitude + "...OK!");
                        res.send("200");
                      }
                  });
                });
              };
            });
}

exports.api_update_farm2_tape_interval = function(req, res){
  var farm_id = req.params.id;
  var ref = db.ref('/farm/' + farm_id);
  ref.once('value', function(snapshot) {
    var farm = JSON.parse(JSON.stringify(snapshot));
    //res.redirect('../farm');
    //console.log("Edit farm[" + farm_id + "].......................................");
    farm.id = farm_id;
    var farm_total_drip_per_rai = Math.floor(1600/(req.params.value*farm.drip_interval));
    var farm_total_flowrate_per_rai = farm_total_drip_per_rai*farm.drip_flowrate;
    var ref2 = db.ref('/farm').child(farm_id).update({
      total_drip_per_rai: farm_total_drip_per_rai,
      total_flowrate_per_rai: farm_total_flowrate_per_rai,
      tape_interval: req.params.value,
      last_updated: moment().format()
    }, function(err){
      if(err)
      {
        console.log("Update tape interval of farm[" + farm_id + "] with value = " + req.params.value+ "...FAILED!");
        res.send("201");
      }
      else {
        var ETp = require('../../etp/ETp.js');
        var watering_schedule = ETp.computeWateringSchedule(farm_id, function(ws){
          ref = db.ref('/farm').child(farm_id).update({
            watering_schedule: ws
          }, function(err){
              if(err)
              {
                console.log("Update tape interval of farm[" + farm_id + "] with value = " + req.params.value+ "...FAILED!");
                res.send("202");
              }
              else
              {
                console.log("Update tape interval of farm[" + farm_id + "] with value = " + req.params.value+ "...OK!");
                res.send("200");
              }
          });
        });
      };
    });
  });
}

exports.api_update_farm2_drip_interval = function(req, res){
  var farm_id = req.params.id;
  var ref = db.ref('/farm/' + farm_id);
          ref.once('value', function(snapshot) {
            var farm = JSON.parse(JSON.stringify(snapshot));
            //res.redirect('../farm');
            //console.log("Edit farm[" + farm_id + "].......................................");
            farm.id = farm_id;
            var farm_total_drip_per_rai = Math.floor(1600/(farm.tape_interval*req.params.value));
            var farm_total_flowrate_per_rai = farm_total_drip_per_rai*farm.drip_flowrate;
            //console.log("Farm...." + farm.description);
            var ref2 = db.ref('/farm').child(farm_id).update({
              total_drip_per_rai: farm_total_drip_per_rai,
              total_flowrate_per_rai: farm_total_flowrate_per_rai,
              drip_interval: req.params.value,
              last_updated: moment().format()
            }, function(err){
              if(err)
              {
                console.log("Update drip interval of farm[" + farm_id + "] with value = " + req.params.value+ "...FAILED!");
                res.send("201");
              }
              else {
                var ETp = require('../../etp/ETp.js');
                var watering_schedule = ETp.computeWateringSchedule(farm_id, function(ws){
                  ref = db.ref('/farm').child(farm_id).update({
                    watering_schedule: ws
                  }, function(err){
                      if(err)
                      {
                        console.log("Update drip interval of farm[" + farm_id + "] with value = " + req.params.value+ "...FAILED!");
                        res.send("202");
                      }
                      else
                      {
                        console.log("Update drip interval of farm[" + farm_id + "] with value = " + req.params.value+ "...OK!");
                        res.send("200");
                      }
                  });
                });
              };
            });
          });
}

exports.api_update_farm2_drip_flowrate = function(req, res){
  var farm_id = req.params.id;
  var ref = db.ref('/farm/' + farm_id);
  ref.once('value', function(snapshot) {
    var farm = JSON.parse(JSON.stringify(snapshot));
    //res.redirect('../farm');
    //console.log("Edit farm[" + farm_id + "].......................................");
    farm.id = farm_id;
    //var farm_total_drip_per_rai = Math.floor(1600/(farm.tape_interval*farm.drip_interval));
    var farm_total_flowrate_per_rai = farm.total_drip_per_rai*req.params.value;
    var ref2 = db.ref('/farm').child(farm_id).update({
      total_flowrate_per_rai: farm_total_flowrate_per_rai,
      drip_flowrate: req.params.value,
      last_updated: moment().format()
    }, function(err){
      if(err)
      {
        console.log("Update drip flowrate of farm[" + farm_id + "] with value = " + req.params.value+ "...FAILED!");
        res.send("201");
      }
      else {
        var ETp = require('../../etp/ETp.js');
        var watering_schedule = ETp.computeWateringSchedule(farm_id, function(ws){
          ref = db.ref('/farm').child(farm_id).update({
            watering_schedule: ws
          }, function(err){
              if(err)
              {
                console.log("Update drip flowrate of farm[" + farm_id + "] with value = " + req.params.value+ "...FAILED!");
                res.send("202");
              }
              else
              {
                console.log("Update drip flowrate of farm[" + farm_id + "] with value = " + req.params.value+ "...OK!");
                res.send("200");
              }
          });
        });
      };
    });
  });
}

exports.api_update_farm1_soil_id = function(req, res) {
  var farm_id = req.params.id;
  var ref = db.ref('/soil');
  ref.once('value', function(snapshot){
    var obj2 = JSON.parse(JSON.stringify(snapshot));
    var selected_soil = obj2[req.params.soil_id];

          var ref = db.ref('/farm').child(farm_id).update({
              soil_id: req.params.soil_id,
              soil_title: selected_soil.title_thai,
              last_updated: moment().format()
            }, function(err){
              if(err)
              {
                console.log("Update soil id of farm[" + farm_id + "] with value = " + req.params.soil_id + "...FAILED!");
                res.send("201");
              }
              else {
                console.log("Update soil id of farm[" + farm_id + "] with value = " + req.params.soil_id + "...OK!");
                res.send("200");
              };
            });
  });
};

exports.api_update_farm2_soil_id = function(req, res) {
  var farm_id = req.params.id;
  var ref = db.ref('/soil');
  ref.once('value', function(snapshot){
    var obj2 = JSON.parse(JSON.stringify(snapshot));
    var selected_soil = obj2[req.params.soil_id];

          var ref = db.ref('/farm').child(farm_id).update({
              soil_id: req.params.soil_id,
              soil_title: selected_soil.title_thai,
              last_updated: moment().format()
            }, function(err){
              if(err)
              {
                console.log("Update soil id of farm[" + farm_id + "] with value = " + req.params.soil_id + "...FAILED!");
                res.send("201");
              }
              else {
                var ETp = require('../../etp/ETp.js');
                var watering_schedule = ETp.computeWateringSchedule(farm_id, function(ws){
                  ref = db.ref('/farm').child(farm_id).update({
                    watering_schedule: ws
                  }, function(err){
                      if(err)
                      {
                        console.log("Update soil id of farm[" + farm_id + "] with value = " + req.params.soil_id + "...FAILED!");
                        res.send("202");
                      }
                      else
                      {
                        console.log("Update soil id of farm[" + farm_id + "] with value = " + req.params.soil_id + "...OK!");
                        res.send("200");
                      }

                  });
                });
              };
            });
  });
};

exports.api_update_farm1_plant_id = function(req, res) {
  var farm_id = req.params.id;
  var ref = db.ref('/plant');
  ref.once('value', function(snapshot){
    var obj2 = JSON.parse(JSON.stringify(snapshot));
    var selected_plant = obj2[req.params.plant_id];

          var ref = db.ref('/farm').child(farm_id).update({
              plant_id: req.params.plant_id,
              plant_title: selected_plant.title,
              last_updated: moment().format()
            }, function(err){
              if(err)
              {
                console.log("Update plant id of farm[" + farm_id + "] with value = " + req.params.plant_id+ "...FAILED!");
                res.send("201");
              }

              else {
                console.log("Update plant id of farm[" + farm_id + "] with value = " + req.params.plant_id+ "...OK!");
                res.send("200");
              };
            });
  });
};

exports.api_update_farm2_plant_id = function(req, res) {
  var farm_id = req.params.id;
  var ref = db.ref('/plant');
  ref.once('value', function(snapshot){
    var obj2 = JSON.parse(JSON.stringify(snapshot));
    var selected_plant = obj2[req.params.plant_id];

          var ref = db.ref('/farm').child(farm_id).update({
              plant_id: req.params.plant_id,
              plant_title: selected_plant.title,
              last_updated: moment().format()
            }, function(err){
              if(err)
              {
                console.log("Update plant id of farm[" + farm_id + "] with value = " + req.params.plant_id+ "...FAILED!");
                res.send("201");
              }

              else {
                var ETp = require('../../etp/ETp.js');
                var watering_schedule = ETp.computeWateringSchedule(farm_id, function(ws){
                  ref = db.ref('/farm').child(farm_id).update({
                    watering_schedule: ws
                  }, function(err){
                      if(err)
                      {
                        console.log("Update plant id of farm[" + farm_id + "] with value = " + req.params.plant_id+ "...FAILED!");
                        res.send("202");
                      }
                      else
                      {
                        console.log("Update plant id of farm[" + farm_id + "] with value = " + req.params.plant_id+ "...OK!");
                        res.send("200");
                      }
                  });
                });
              };
            });
  });
};

exports.api_update_farm1_starting_date = function(req, res){
  var farm_id = req.params.id;
  var ref = db.ref('/farm').child(farm_id).update({
              starting_date: req.params.value,
              last_updated: moment().format()
            }, function(err){
              if(err)
              {
                console.log("Update starting date of farm[" + farm_id + "] with value = " + req.params.value + "...FAILED!");
                res.send("201");
              }
              else {
                console.log("Update starting date of farm[" + farm_id + "] with value = " + req.params.value+ "...OK!");
                res.send("200");
              };
            });
}

exports.api_update_farm2_starting_date = function(req, res){
  var farm_id = req.params.id;
  var ref = db.ref('/farm').child(farm_id).update({
              starting_date: req.params.value,
              last_updated: moment().format()
            }, function(err){
              if(err)
              {
                console.log("Update starting date of farm[" + farm_id + "] with value = " + req.params.value + "...FAILED!");
                res.send("201");
              }              else {
                var ETp = require('../../etp/ETp.js');
                var watering_schedule = ETp.computeWateringSchedule(farm_id, function(ws){
                  ref = db.ref('/farm').child(farm_id).update({
                    watering_schedule: ws
                  }, function(err){
                      if(err)
                      {
                        console.log("Update starting date of farm[" + farm_id + "] with value = " + req.params.value+ "...FAILED!");
                        res.send("202");
                      }
                       else
                       {
                         console.log("Update starting date of farm[" + farm_id + "] with value = " + req.params.value+ "...OK!");
                         res.send("200");
                       }
                  });
                });
              };
            });
}

exports.api_update_farm_humidity_sensor_id = function(req, res){
  //console.log("Update farm title recieve => ", req.params);
  var farm_id = req.params.id;
  //console.log("Set sampling time of farm[" + farm_id + "] with value = " + sampling_time + " minutes...");
  var ref = db.ref('/farm/').child(farm_id).update({
    humidity_sensor_id: req.params.value,
    last_updated: moment().format()
  }, function(err){
    if(err)
    {
      console.log("Update humidity sensor ID of farm[" + farm_id + "] with value = " + req.params.value + "...FAILED!");
      //res.send('{\"code\":\"500\", \"message\":\"ตั้งค่าตรวจสอบเซ็นเซอร์ไม่สำเร็จ\"}');
      res.send("201");
    }
    console.log("Update humidity sensor ID of farm[" + farm_id + "] with value = " + req.params.value + "...OK!");
    //res.send('{\"code\":\"200\", \"message\":\"ตั้งค่าตรวจสอบเซ็นเซอร์เรียบร้อย\"}');
    res.send("200");
  });
}

exports.api_update_farm_rain_sensor_id = function(req, res){
  //console.log("Update farm title recieve => ", req.params);
  var farm_id = req.params.id;
  //console.log("Set sampling time of farm[" + farm_id + "] with value = " + sampling_time + " minutes...");
  var ref = db.ref('/farm/').child(farm_id).update({
    rain_sensor_id: req.params.value,
    last_updated: moment().format()
  }, function(err){
    if(err)
    {
      console.log("Update rain sensor ID of farm[" + farm_id + "] with value = " + req.params.value + "...FAILED!");
      //res.send('{\"code\":\"500\", \"message\":\"ตั้งค่าตรวจสอบเซ็นเซอร์ไม่สำเร็จ\"}');
      res.send("201");
    }
    console.log("Update rain sensor ID of farm[" + farm_id + "] with value = " + req.params.value + "...OK!");
    //res.send('{\"code\":\"200\", \"message\":\"ตั้งค่าตรวจสอบเซ็นเซอร์เรียบร้อย\"}');
    res.send("200");
  });
}

exports.api_update_farm_mainpump_id = function(req, res){
  //console.log("Update farm title recieve => ", req.params);
  var farm_id = req.params.id;
  //console.log("Set sampling time of farm[" + farm_id + "] with value = " + sampling_time + " minutes...");
  var ref = db.ref('/farm/').child(farm_id).update({
    mainpump_id: req.params.value,
    last_updated: moment().format()
  }, function(err){
    if(err)
    {
      console.log("Update mainpump ID of farm[" + farm_id + "] with value = " + req.params.value + "...FAILED!");
      //res.send('{\"code\":\"500\", \"message\":\"ตั้งค่าตรวจสอบเซ็นเซอร์ไม่สำเร็จ\"}');
      res.send("201");
    }
    console.log("Update mainpump ID of farm[" + farm_id + "] with value = " + req.params.value + "...OK!");
    //res.send('{\"code\":\"200\", \"message\":\"ตั้งค่าตรวจสอบเซ็นเซอร์เรียบร้อย\"}');
    res.send("200");
  });
}

exports.api_update_farm_valve_1_id = function(req, res){
  //console.log("Update farm title recieve => ", req.params);
  var farm_id = req.params.id;
  //console.log("Set sampling time of farm[" + farm_id + "] with value = " + sampling_time + " minutes...");
  var ref = db.ref('/farm/').child(farm_id).update({
    valve_1_id: req.params.value,
    last_updated: moment().format()
  }, function(err){
    if(err)
    {
      console.log("Update valve #1 ID of farm[" + farm_id + "] with value = " + req.params.value + "...FAILED!");
      //res.send('{\"code\":\"500\", \"message\":\"ตั้งค่าตรวจสอบเซ็นเซอร์ไม่สำเร็จ\"}');
      res.send("201");
    }
    console.log("Update valve #1 ID of farm[" + farm_id + "] with value = " + req.params.value + "...OK!");
    //res.send('{\"code\":\"200\", \"message\":\"ตั้งค่าตรวจสอบเซ็นเซอร์เรียบร้อย\"}');
    res.send("200");
  });
}

exports.api_update_farm_valve_2_id = function(req, res){
  //console.log("Update farm title recieve => ", req.params);
  var farm_id = req.params.id;
  //console.log("Set sampling time of farm[" + farm_id + "] with value = " + sampling_time + " minutes...");
  var ref = db.ref('/farm/').child(farm_id).update({
    valve_2_id: req.params.value,
    last_updated: moment().format()
  }, function(err){
    if(err)
    {
      console.log("Update valve #2 ID of farm[" + farm_id + "] with value = " + req.params.value + "...FAILED!");
      //res.send('{\"code\":\"500\", \"message\":\"ตั้งค่าตรวจสอบเซ็นเซอร์ไม่สำเร็จ\"}');
      res.send("201");
    }
    console.log("Update valve #2 ID of farm[" + farm_id + "] with value = " + req.params.value + "...OK!");
    //res.send('{\"code\":\"200\", \"message\":\"ตั้งค่าตรวจสอบเซ็นเซอร์เรียบร้อย\"}');
    res.send("200");
  });
}

exports.api_update_farm_valve_3_id = function(req, res){
  //console.log("Update farm title recieve => ", req.params);
  var farm_id = req.params.id;
  //console.log("Set sampling time of farm[" + farm_id + "] with value = " + sampling_time + " minutes...");
  var ref = db.ref('/farm/').child(farm_id).update({
    valve_3_id: req.params.value,
    last_updated: moment().format()
  }, function(err){
    if(err)
    {
      console.log("Update valve #3 ID of farm[" + farm_id + "] with value = " + req.params.value + "...FAILED!");
      //res.send('{\"code\":\"500\", \"message\":\"ตั้งค่าตรวจสอบเซ็นเซอร์ไม่สำเร็จ\"}');
      res.send("201");
    }
    console.log("Update valve #3 ID of farm[" + farm_id + "] with value = " + req.params.value + "...OK!");
    //res.send('{\"code\":\"200\", \"message\":\"ตั้งค่าตรวจสอบเซ็นเซอร์เรียบร้อย\"}');
    res.send("200");
  });
}

exports.api_update_farm_valve_4_id = function(req, res){
  //console.log("Update farm title recieve => ", req.params);
  var farm_id = req.params.id;
  //console.log("Set sampling time of farm[" + farm_id + "] with value = " + sampling_time + " minutes...");
  var ref = db.ref('/farm/').child(farm_id).update({
    valve_4_id: req.params.value,
    last_updated: moment().format()
  }, function(err){
    if(err)
    {
      console.log("Update valve #4 ID of farm[" + farm_id + "] with value = " + req.params.value + "...FAILED!");
      //res.send('{\"code\":\"500\", \"message\":\"ตั้งค่าตรวจสอบเซ็นเซอร์ไม่สำเร็จ\"}');
      res.send("201");
    }
    console.log("Update valve #4 ID of farm[" + farm_id + "] with value = " + req.params.value + "...OK!");
    //res.send('{\"code\":\"200\", \"message\":\"ตั้งค่าตรวจสอบเซ็นเซอร์เรียบร้อย\"}');
    res.send("200");
  });
}

exports.api_update_farm_valve_5_id = function(req, res){
  //console.log("Update farm title recieve => ", req.params);
  var farm_id = req.params.id;
  //console.log("Set sampling time of farm[" + farm_id + "] with value = " + sampling_time + " minutes...");
  var ref = db.ref('/farm/').child(farm_id).update({
    valve_5_id: req.params.value,
    last_updated: moment().format()
  }, function(err){
    if(err)
    {
      console.log("Update valve #5 ID of farm[" + farm_id + "] with value = " + req.params.value + "...FAILED!");
      //res.send('{\"code\":\"500\", \"message\":\"ตั้งค่าตรวจสอบเซ็นเซอร์ไม่สำเร็จ\"}');
      res.send("201");
    }
    console.log("Update valve #5 ID of farm[" + farm_id + "] with value = " + req.params.value + "...OK!");
    //res.send('{\"code\":\"200\", \"message\":\"ตั้งค่าตรวจสอบเซ็นเซอร์เรียบร้อย\"}');
    res.send("200");
  });
}

exports.api_update_farm_valve_6_id = function(req, res){
  //console.log("Update farm title recieve => ", req.params);
  var farm_id = req.params.id;
  //console.log("Set sampling time of farm[" + farm_id + "] with value = " + sampling_time + " minutes...");
  var ref = db.ref('/farm/').child(farm_id).update({
    valve_6_id: req.params.value,
    last_updated: moment().format()
  }, function(err){
    if(err)
    {
      console.log("Update valve #6 ID of farm[" + farm_id + "] with value = " + req.params.value + "...FAILED!");
      //res.send('{\"code\":\"500\", \"message\":\"ตั้งค่าตรวจสอบเซ็นเซอร์ไม่สำเร็จ\"}');
      res.send("201");
    }
    console.log("Update valve #6 ID of farm[" + farm_id + "] with value = " + req.params.value + "...OK!");
    //res.send('{\"code\":\"200\", \"message\":\"ตั้งค่าตรวจสอบเซ็นเซอร์เรียบร้อย\"}');
    res.send("200");
  });
}

exports.api_update_farm_valve_7_id = function(req, res){
  //console.log("Update farm title recieve => ", req.params);
  var farm_id = req.params.id;
  //console.log("Set sampling time of farm[" + farm_id + "] with value = " + sampling_time + " minutes...");
  var ref = db.ref('/farm/').child(farm_id).update({
    valve_7_id: req.params.value,
    last_updated: moment().format()
  }, function(err){
    if(err)
    {
      console.log("Update valve #7 ID of farm[" + farm_id + "] with value = " + req.params.value + "...FAILED!");
      //res.send('{\"code\":\"500\", \"message\":\"ตั้งค่าตรวจสอบเซ็นเซอร์ไม่สำเร็จ\"}');
      res.send("201");
    }
    console.log("Update valve #7 ID of farm[" + farm_id + "] with value = " + req.params.value + "...OK!");
    //res.send('{\"code\":\"200\", \"message\":\"ตั้งค่าตรวจสอบเซ็นเซอร์เรียบร้อย\"}');
    res.send("200");
  });
}

exports.api_update_farm_valve_8_id = function(req, res){
  //console.log("Update farm title recieve => ", req.params);
  var farm_id = req.params.id;
  //console.log("Set sampling time of farm[" + farm_id + "] with value = " + sampling_time + " minutes...");
  var ref = db.ref('/farm/').child(farm_id).update({
    valve_8_id: req.params.value,
    last_updated: moment().format()
  }, function(err){
    if(err)
    {
      console.log("Update valve #8 ID of farm[" + farm_id + "] with value = " + req.params.value + "...FAILED!");
      //res.send('{\"code\":\"500\", \"message\":\"ตั้งค่าตรวจสอบเซ็นเซอร์ไม่สำเร็จ\"}');
      res.send("201");
    }
    console.log("Update valve #8 ID of farm[" + farm_id + "] with value = " + req.params.value + "...OK!");
    //res.send('{\"code\":\"200\", \"message\":\"ตั้งค่าตรวจสอบเซ็นเซอร์เรียบร้อย\"}');
    res.send("200");
  });
}

exports.api_update_farm_valve_9_id = function(req, res){
  //console.log("Update farm title recieve => ", req.params);
  var farm_id = req.params.id;
  //console.log("Set sampling time of farm[" + farm_id + "] with value = " + sampling_time + " minutes...");
  var ref = db.ref('/farm/').child(farm_id).update({
    valve_9_id: req.params.value,
    last_updated: moment().format()
  }, function(err){
    if(err)
    {
      console.log("Update valve #9 ID of farm[" + farm_id + "] with value = " + req.params.value + "...FAILED!");
      //res.send('{\"code\":\"500\", \"message\":\"ตั้งค่าตรวจสอบเซ็นเซอร์ไม่สำเร็จ\"}');
      res.send("201");
    }
    console.log("Update valve #9 ID of farm[" + farm_id + "] with value = " + req.params.value + "...OK!");
    //res.send('{\"code\":\"200\", \"message\":\"ตั้งค่าตรวจสอบเซ็นเซอร์เรียบร้อย\"}');
    res.send("200");
  });
}

exports.api_update_farm_valve_10_id = function(req, res){
  //console.log("Update farm title recieve => ", req.params);
  var farm_id = req.params.id;
  //console.log("Set sampling time of farm[" + farm_id + "] with value = " + sampling_time + " minutes...");
  var ref = db.ref('/farm/').child(farm_id).update({
    valve_10_id: req.params.value,
    last_updated: moment().format()
  }, function(err){
    if(err)
    {
      console.log("Update valve #10 ID of farm[" + farm_id + "] with value = " + req.params.value + "...FAILED!");
      //res.send('{\"code\":\"500\", \"message\":\"ตั้งค่าตรวจสอบเซ็นเซอร์ไม่สำเร็จ\"}');
      res.send("201");
    }
    console.log("Update valve #10 ID of farm[" + farm_id + "] with value = " + req.params.value + "...OK!");
    //res.send('{\"code\":\"200\", \"message\":\"ตั้งค่าตรวจสอบเซ็นเซอร์เรียบร้อย\"}');
    res.send("200");
  });
}

exports.api_update_farm2_alarm_interval = function(req, res){
  //console.log("Update farm title recieve => ", req.params);
  var farm_id = req.params.id;
  //console.log("Set sampling time of farm[" + farm_id + "] with value = " + sampling_time + " minutes...");
  var ref = db.ref('/farm/').child(farm_id).update({
    alarm_interval: req.params.value,
    last_updated: moment().format()
  }, function(err){
    if(err)
    {
      console.log("Update alarm interval of farm[" + farm_id + "] with value = " + req.params.value + "...FAILED!");
      //res.send('{\"code\":\"500\", \"message\":\"ตั้งค่าตรวจสอบเซ็นเซอร์ไม่สำเร็จ\"}');
      res.send("201");
    }
    console.log("Update alarm interval of farm[" + farm_id + "] with value = " + req.params.value + "...OK!");
    //res.send('{\"code\":\"200\", \"message\":\"ตั้งค่าตรวจสอบเซ็นเซอร์เรียบร้อย\"}');
    res.send("200");
  });
}

exports.api_update_farm_linegroup_token = function(req, res){
  //console.log("Update farm title recieve => ", req.params);
  var farm_id = req.params.id;
  //console.log("Set sampling time of farm[" + farm_id + "] with value = " + sampling_time + " minutes...");
  var ref = db.ref('/farm/').child(farm_id).update({
    linegroup_token: req.params.value,
    last_updated: moment().format()
  }, function(err){
    if(err)
    {
      console.log("Update linegroup token of farm[" + farm_id + "] with value = " + req.params.value + "...FAILED!");
      //res.send('{\"code\":\"500\", \"message\":\"ตั้งค่าตรวจสอบเซ็นเซอร์ไม่สำเร็จ\"}');
      res.send("201");
    }
    console.log("Update linegroup token of farm[" + farm_id + "] with value = " + req.params.value + "...OK!");
    //res.send('{\"code\":\"200\", \"message\":\"ตั้งค่าตรวจสอบเซ็นเซอร์เรียบร้อย\"}');
    res.send("200");
  });
}

// line token : THjkeVJ24lVVXIscna7PpX45jdvlZDLKhAPMINN1EFg

var runFarm = function(fo, count)
{

          //var ref = db.ref('/sensor/'+ fo.farm_id);
          var ref3 = db.ref('/sensor/' + fo.humidity_sensor_id);
          var async = require('async');
          var line = require('../../line/line.js');

          async.waterfall([
            function(callback){
              ref3.once('value', function(snapshot) {
                var sensor = JSON.parse(JSON.stringify(snapshot));
                sensor.id = fo.humidity_sensor_id;
                callback(null, sensor);
              });
            },
            function(sensor, callback){
              console.log("Reading sensor[" + sensor.id + "] with token[" + sensor.token + "] @Pin["+ sensor.pin + "]...");
              var request = require('request');
              request('http://blynk-cloud.com/' + sensor.token + '/get/'+ sensor.pin, function (error, response, body) {
                    //console.log('Status:', response.statusCode);
                    //console.log('Headers:', JSON.stringify(response.headers));
                    var svalue = body.split('"')[1];
                    console.log('Sensor value => ', svalue);
                    db.ref('/sensor').child(sensor.id).update({value: svalue});
                    sensor.value = svalue;
                    //console.log('Reading sensor value: ', svalue);
                    callback(null, sensor);    
                  }); 
            },
            function(sensor, callback){
              fo.humidity_last_checked = moment().format();
              db.ref('/farm').child(fo.farm_id).update({
                humidity_last_checked: fo.humidity_last_checked,
              });
              callback(null, sensor);
            }
          ], function(err, results){
                var _now = moment().format();
                console.log("farm[" + fo.farm_id + "] checking humidity sensor #" + count + " = " + results.value + " value at time => " + results.last_read);
                if(parseFloat(results.value) < parseFloat(fo.humidity_critical_point))
                {
                  console.log("humidity deplete!!!...alert for watering");
                  line.lineGroupNotify("ความชื้นในแปลงเท่ากับ " + results.value.substring(0,5) + "% มีค่าต่ำกว่าจุดวิกฤต " + fo.humidity_critical_point + "% ณ เวลา " + fo.humidity_last_checked + " แปลงต้องการน้ำสำหรับ" + fo.title, fo.linegroup_token);
                  var ref = db.ref('/farm').child(fo.farm_id).update({
                        need_watering: "true",
                        humidity_last_read: results.value.substring(0,5),
                        humidity_last_checked: results.last_read,
                        farm_last_checked: _now
                      });
                }
                else {
                  line.lineGroupNotify("ความชื้นในแปลงเท่ากับ " + results[1].value.substring(0,5) + "% มีค่ามากกว่าจุดวิกฤต " + fo.humidity_critical_point + "% ณ เวลา " + fo.humidity_last_checked + " แปลงไม่ต้องการน้ำสำหรับ" + fo.title, fo.linegroup_token);
                  var ref = db.ref('/farm').child(fo.farm_id).update({
                        need_watering: "false",
                        humidity_last_read: results.value.substring(0,5),
                        humidity_last_checked: results.last_read,
                        farm_last_checked: _now
                      });
                }
          });
}

var runFarm2 = function(fo, count)
{

          var sensorClient = new ThingSpeakClient();
          //var ref = db.ref('/sensor/'+ fo.farm_id);
          var ref3 = db.ref('/sensor/' + fo.humidity_sensor_id);
          var async = require('async');
          var line = require('../../line/line.js');

          async.series([
            function(callback){
              sensorClient.getLastEntryInChannelFeed(parseInt(fo.humidity_sensor_id), {}, function(err, resp){
                if(typeof resp !== 'undefined')
                {
                  db.ref('/sensor').child(fo.humidity_sensor_id).update(resp);
                  callback(null, 1);
                }
              });
            },
            function(callback){
              ref3.once('value', function(snapshot) {
                var sensorObj = JSON.parse(JSON.stringify(snapshot));
                sensorObj.id = fo.humidity_sensor_id;
                //res.redirect('../farm');
                //console.log("Edit farm[" + farm_id + "].......................................");
                callback(null, sensorObj);
              });
            },
            function(callback){
              fo.humidity_last_checked = moment().format();
              fo.last_updated = moment().format();
              db.ref('/farm').child(fo.farm_id).update({
                humidity_last_checked: fo.humidity_last_checked,
                last_updated: fo.last_updated
              });
              callback(null, fo);
            }
          ], function(err, results){
                var _now = moment().format();
                console.log("farm[" + fo.farm_id + "] checking humidity sensor #" + count + " = " + results[1].field1 + " value at time => " + results[1].created_at);
                if(parseFloat(results[1].field1) < parseFloat(fo.humidity_critical_point))
                {
                  console.log("humidity deplete!!!...alert for watering");
                  line.lineGroupNotify("ความชื้นในแปลงเท่ากับ " + results[1].field1.substring(0,5) + "% มีค่าต่ำกว่าจุดวิกฤต " + fo.humidity_critical_point + "% ณ เวลา " + fo.humidity_last_checked + " แปลงต้องการน้ำสำหรับ" + fo.title, fo.linegroup_token);
                  var ref = db.ref('/farm').child(fo.farm_id).update({
                        need_watering: "true",
                        humidity_last_read: results[1].field1.substring(0,5),
                        humidity_last_checked: _now
                      });
                }
                else {
                  line.lineGroupNotify("ความชื้นในแปลงเท่ากับ " + results[1].field1.substring(0,5) + "% มีค่ามากกว่าจุดวิกฤต " + fo.humidity_critical_point + "% ณ เวลา " + fo.humidity_last_checked + " แปลงไม่ต้องการน้ำสำหรับ" + fo.title, fo.linegroup_token);
                  var ref = db.ref('/farm').child(fo.farm_id).update({
                        need_watering: "false",
                        humidity_last_read: results[1].field1.substring(0,5),
                        humidity_last_checked: _now
                      });
                }
          });
}

exports.activate_farm_1 = function(req, res){
  var farm_id = req.params.id;
  var farm_sampling_time;
  var count = 1;
  var line = require('../../line/line.js');
  var ref = db.ref('/farm/'+farm_id);
  ref.once('value', function(snapshot) {
    var farmObj = JSON.parse(JSON.stringify(snapshot));
    if(farmObj.activated == "false")
    {
      farm_sampling_time = parseInt(farmObj.sampling_time)*60000;
      farmObj.farm_id = farm_id;
      var ref2 = db.ref('/farm/').child(farm_id);
      ref2.update({
        activated: 'true',
        last_activated_at: moment().format()
      }, function(err){
          if(err)
            res.respond("705");
          else {
            var time_now = moment().format();
            console.log("farm[" + farm_id + "] has been activated! with sampling time => " + farmObj.sampling_time + " นาที @" + time_now);
            line.lineGroupNotify("เปิดระบบฟาร์ม" + farmObj.title + " @" + time_now + " ทำการตรวจสอบค่าเซ็นเซอร์ความชื้นทุก ๆ " + farmObj.sampling_time + " นาที", farmObj.linegroup_token);
            //var CronJob = require('cron').CronJob;
            //var job = new CronJob('*/8 * * * *', function() {
            runFarm(farmObj, count);
            var farmIntervalObj = setInterval(function(farm_id){
              //console.log("Farm [" + farm_id + "] counting => " + count);
              var ref3 = db.ref('/farm/' + farm_id);
              ref3.once('value', function(snapshot){
                var fo = JSON.parse(JSON.stringify(snapshot));
                fo.farm_id = farm_id;
                if(fo.activated == 'false')
                  {
                    count = 1;
                    console.log("farm[" + farm_id + "] has been deactivated.");
                    //job.stop();
                    clearInterval(farmIntervalObj);
                  }
                  else{
                    count++;
                    console.log("Farm [" + farm_id + "] counting => " + count);
                    runFarm(fo, count);
                  }
                });
            }, farm_sampling_time, farm_id);
              console.log("finished activating farm!!!!!!!!!");
              //res.send("start farm[" + farm_id + "]... done!");
              //res.setHeader("Content-Type", "text/html");
              res.redirect("/farm");
              //console.log("finished redirecting farm!!!!!!!!!");
        }
      });
    };
  }, function (errorObject) {
    console.log("Read farm failed: " + errorObject.code);
    });
};

exports.api_activate_farm_1 = function(req, res){
  var farm_id = req.params.id;
  var farm_sampling_time;
  var count = 1;
  var line = require('../../line/line.js');
  var ref = db.ref('/farm/'+farm_id);
  ref.once('value', function(snapshot) {
    var farmObj = JSON.parse(JSON.stringify(snapshot));
    if(farmObj.activated == "false")
    {
      farm_sampling_time = parseInt(farmObj.sampling_time)*60000;
      farmObj.farm_id = farm_id;
      var ref2 = db.ref('/farm/').child(farm_id);
      ref2.update({
        activated: 'true',
        last_activated_at: moment().format()
      }, function(err){
          if(err)
            res.send("1001");
          else {
            var time_now = moment().format();
            //console.log("farm[" + farm_id + "] has been activated! with sampling time => " + farmObj.sampling_time + " นาที @" + time_now);
            line.lineGroupNotify("เปิดระบบฟาร์ม" + farmObj.title + " @" + time_now + " ทำการตรวจสอบค่าเซ็นเซอร์ความชื้นทุก ๆ " + farmObj.sampling_time + " นาที", farmObj.linegroup_token);
            //var CronJob = require('cron').CronJob;
            //var job = new CronJob('*/8 * * * *', function() {
            runFarm(farmObj, count);
            var farmIntervalObj = setInterval(function(farm_id){
              //console.log("Farm [" + farm_id + "] counting => " + count);
              var ref3 = db.ref('/farm/' + farm_id);
              ref3.once('value', function(snapshot){
                var fo = JSON.parse(JSON.stringify(snapshot));
                fo.farm_id = farm_id;
                if(fo.activated == 'false')
                  {
                    count = 1;
                    //console.log("farm[" + farm_id + "] has been deactivated.");
                    //job.stop();
                    clearInterval(farmIntervalObj);
                  }
                  else{
                    count++;
                    //console.log("Farm [" + farm_id + "] counting => " + count);
                    runFarm(fo, count);
                  }
                });
            }, farm_sampling_time, farm_id);
              //console.log("finished activating farm!!!!!!!!!");
              //res.send("start farm[" + farm_id + "]... done!");
              //res.setHeader("Content-Type", "text/html");
              console.log("farm[" + farm_id + "] has been activated! @" + time_now);
              res.send("200");
              //console.log("finished redirecting farm!!!!!!!!!");
        }
      });
    }
  }, function (errorObject) {
      //console.log("Read farm failed: " + errorObject.code);
      res.send("202");
    });
};

var getNextWateringDate = function(ws)
{
  //console.log("Farm watering schedule => ", ws);
  var today_date = moment();
  for(var w in ws){
    if(ws.hasOwnProperty(w))
    {
      var w_date = moment(ws[w].current_date, "YYYY-MM-DD");
      //console.log("Watering date => ", w_date.diff(today_date, 'days'));
      var dd = w_date.diff(today_date, 'days');
      if(dd >= 0)
      {
        if(dd == 0)
        {
          ws[w].is_today = true;
        }
        else {
          ws[w].is_today = false;
        }
        console.log("Next watering date => ", ws[w]);
        return ws[w];
      }
    }
  }
}


exports.activate_farm_2 = function(req, res){
  var farm_id = req.params.id;
  var farm_alarm_interval;
  var count = 1;
  var line = require('../../line/line.js');
  var schedule = require('node-schedule');
  //var date = new Date(2012, 11, 21, 5, 30, 0);
  var ref = db.ref('/farm/'+farm_id);
  ref.once('value', function(snapshot) {
    var farmObj = JSON.parse(JSON.stringify(snapshot));
    if(farmObj.activated == "false")
    {
      farm_alarm_interval = parseInt(farmObj.alarm_interval)*60000;
      farmObj.farm_id = farm_id;
      var ref2 = db.ref('/farm/').child(farm_id);
      ref2.update({
        activated: 'true',
        last_activated_at: moment().format()
      }, function(err){
          if(err)
            res.respond("705");
          else {
            var time_now = moment().format();
            console.log("farm[" + farm_id + "] has been activated!");
            line.lineGroupNotify("เปิดระบบฟาร์ม" + farmObj.title + " @" + time_now, farmObj.linegroup_token);
            //var CronJob = require('cron').CronJob;
            //var job = new CronJob('*/8 * * * *', function() {
            var next_w = getNextWateringDate(farmObj.watering_schedule);
            var next_w_date = moment(next_w.current_date, "YYYY-MM-DD");
            var next_alarm = moment(farmObj.alarm_time, "HH:mm:ss");
            console.log("Next watering => " + next_w_date.format("YYYY") + ", " + next_w_date.format("MM") + ", " + next_w_date.format("DD") + ", " + next_alarm.format("HH") + ", " + next_alarm.format("mm") + ", " + next_alarm.format("ss"));
            var date = new Date(next_w_date.format("YYYY"), next_w_date.subtract(1, 'months').format("MM"), next_w_date.format("DD"), next_alarm.format("HH"), next_alarm.format("mm") , next_alarm.format("ss"));
            var rdate = new Date(next_w_date.format("YYYY"), next_w_date.format("MM"), next_w_date.format("DD"), next_alarm.format("HH"), next_alarm.subtract(1, 'minutes').format("mm") , next_alarm.format("ss"));
            console.log("Date => " + date + ", RDate => " + rdate);
            if(next_w.is_today)
            {
              line.lineGroupNotify("วันนี้ฟาร์ม" + farmObj.title + " ต้องการการให้น้ำเป็นเวลา " + next_w.hours + " ชั่วโมง " + next_w.mins + "นาที @" + time_now, farmObj.linegroup_token);
            }
            else{
              var td = moment().format("YYYY-MM-DD");;
              line.lineGroupNotify("ตารางให้น้ำของฟาร์ม" + farmObj.title + " ครั้งต่อไปอีก " + moment(next_w.current_date).diff(td, 'days') + " วัน @" + next_w.current_date, farmObj.linegroup_token);            };

            // read rain sensor after activate farm
            var sensorClient = new ThingSpeakClient();
            var sensor_id = farmObj.rain_sensor_id;
            var ref = db.ref('/sensor/' + sensor_id);
            var async = require('async');

            async.series([
              function(callback){
                sensorClient.getLastEntryInChannelFeed(parseInt(sensor_id), {}, function(err, resp){
                  if(typeof resp !== 'undefined')
                  {
                    db.ref('/sensor').child(sensor_id).update(resp);
                    callback(null, resp);
                  }
                });
              },
              function(callback){
                ref.once('value', function(snapshot) {
                  var obj = JSON.parse(JSON.stringify(snapshot));
                  obj.id = sensor_id;
                  //res.redirect('../farm');
                  //console.log("Edit farm[" + farm_id + "].......................................");
                  callback(null, obj);
                });
              }
            ], function(err, results){
                //var moment = require('moment');
                //res.render('dashboard/sensor/show_sensor.ejs', {sensor: results[1], moment: moment});
                var rtime_now = moment().format();
                if(results[1].field1 != null)
                {
                  console.log("Check rain sensor before alarm the today watering => ", results[1].field1);
                  line.lineGroupNotify("ปริมาณน้ำฝนในฟาร์ม" + farmObj.title + " เท่ากับ " + results[1].field1 + " มม. @" + rtime_now, farmObj.linegroup_token);
                  db.ref('/farm').child(farmObj.farm_id).update({
                    rain_last_checked: results[1].created_at,
                    rain_last_read: results[1].field1.substring(0,6),
                    last_updated: rtime_now
                  });
                }
                else {
                  console.log("Check rain sensor before alarm the today watering => FAILED");
                  line.lineGroupNotify("ไม่สามารถอ่านค่าเซ็นเซอร์น้ำฝนในฟาร์ม" + farmObj.title + "ได้ @" + rtime_now, farmObj.linegroup_token);
                }
            });

            var r_schedule = schedule.scheduleJob(rdate, function(){
              // check rain sensor before watering alarm to adjust the amount of watering
              var sensorClient = new ThingSpeakClient();
              var sensor_id = farmObj.rain_sensor_id;
              var ref = db.ref('/sensor/' + sensor_id);
              var async = require('async');

              async.series([
                function(callback){
                  sensorClient.getLastEntryInChannelFeed(parseInt(sensor_id), {}, function(err, resp){
                    if(typeof resp !== 'undefined')
                    {
                      db.ref('/sensor').child(sensor_id).update(resp);
                      callback(null, resp);
                    }
                  });
                },
                function(callback){
                  ref.once('value', function(snapshot) {
                    var obj = JSON.parse(JSON.stringify(snapshot));
                    obj.id = sensor_id;
                    //res.redirect('../farm');
                    //console.log("Edit farm[" + farm_id + "].......................................");
                    callback(null, obj);
                  });
                }
              ], function(err, results){
                  //var moment = require('moment');
                  //res.render('dashboard/sensor/show_sensor.ejs', {sensor: results[1], moment: moment});
                  var rtime_now = moment().format();
                  if(results[1].field1 != null)
                  {
                    console.log("Check rain sensor before alarm the today watering => ", results[1].field1);
                    line.lineGroupNotify("ปริมาณน้ำฝนในฟาร์ม" + farmObj.title + " เท่ากับ " + results[1].field1 + " มม. @" + rtime_now, farmObj.linegroup_token);
                    db.ref('/farm').child(farmObj.farm_id).update({
                      rain_last_checked: results[1].created_at,
                      rain_last_read: results[1].field1.substring(0,6),
                      last_updated: rtime_now
                    });
                  }
                  else {
                    console.log("Check rain sensor before alarm the today watering => FAILED");
                    line.lineGroupNotify("ไม่สามารถอ่านค่าเซ็นเซอร์น้ำฝนในฟาร์ม" + farmObj.title + "ได้ @" + rtime_now, farmObj.linegroup_token);
                  }
              });
            });

            var w_schedule = schedule.scheduleJob(date, function(){
              if(farmObj.alarm_start == "false")
              {
                var ref = db.ref('/farm/').child(farm_id).update({
                  alarm_start: "true",
                  need_watering: "true"
                }, function(err){
                  // notify the system to water
                  var time_now = moment().format();
                  console.log("Time to water for " + next_w.hours + " ชั่วโมง " + next_w.mins + " นาที");
                  line.lineGroupNotify("ฟาร์ม" + farmObj.title + " ต้องการการให้น้ำเป็นเวลา " + next_w.hours + " ชั่วโมง " + next_w.mins + "นาที @" + time_now, farmObj.linegroup_token);
                  line.lineGroupNotify("กรุณาเปิด mobile application เพื่อควบคุมการให้น้ำหรือปิดการแจ้งเตือนนี้", farmObj.linegroup_token);

                  var alarmIntervalObj = setInterval(function(farm_id, ws){
                    var ref3 = db.ref('/farm/' + farm_id);
                    ref3.once('value', function(snapshot){
                      var fo = JSON.parse(JSON.stringify(snapshot));
                      fo.farm_id = farm_id;
                      if(fo.alarm_start == "true")
                      {
                        var time_now2 = moment().format();
                        line.lineGroupNotify("วันนี้ฟาร์ม" + fo.title + " ต้องการการให้น้ำเป็นเวลา " + ws.hours + " ชั่วโมง " + ws.mins + "นาที @" + time_now2, fo.linegroup_token);
                        line.lineGroupNotify("กรุณาเปิด mobile application เพื่อควบคุมการให้น้ำหรือปิดการแจ้งเตือนนี้", fo.linegroup_token);
                      }
                      else {
                          //line.lineGroupNotify("ปิดการแจ้งเตือนการให้น้ำของฟาร์ม" + fo.title, fo.linegroup_token);
                          //line.lineGroupNotify("ตารางให้น้ำของฟาร์ม" + fo.title + " ครั้งต่อไปอีก " + ws.days + " วัน @" + ws.next_date, fo.linegroup_token);
                          clearInterval(alarmIntervalObj);
                      }
                      var ref4 = db.ref('/farm').child(fo.farm_id).update({
                        farm_last_checked: moment().format()
                      });
                    });
                  }, farm_alarm_interval, farm_id, next_w);
                  // reschedule for the next watering
                  next_w_date = moment(next_w.next_date, "YYYY-MM-DD");
                  date = new Date(next_w_date.format("YYYY"), next_w_date.subtract(1, 'months').format("MM"), next_w_date.format("DD"), next_alarm.format("HH"), next_alarm.format("mm"), next_alarm.format("ss"));
                  console.log("Next watering => " + next_w_date.format("YYYY") + ", " + next_w_date.format("MM") + ", " + next_w_date.format("DD") + ", " + next_alarm.format("HH") + ", " + next_alarm.format("mm") + ", " + next_alarm.format("ss"));
                  //date = new Date(2018, 5, 20, 5, 19, 0);
                  w_schedule.reschedule(date);
                });
              }
            });
            /*var farmIntervalObj = setInterval(function(farm_id){
              var ref3 = db.ref('/farm/' + farm_id);
              ref3.once('value', function(snapshot){
                var fo = JSON.parse(JSON.stringify(snapshot));
                fo.farm_id = farm_id;
                if(fo.activated == 'false')
                  {
                    count = 1;
                    console.log("farm[" + farm_id + "] has been deactivated.");
                    //job.stop();
                    clearInterval(farmIntervalObj);
                  }
                  else{
                    count++;
                    console.log("Farm [" + farm_id + "] counting => " + count);
                    runFarm(fo, count);
                  }
                });
            }, farm_sampling_time, farm_id); */
              console.log("finished activating farm!!!!!!!!!");
              //res.send("start farm[" + farm_id + "]... done!");
              //res.setHeader("Content-Type", "text/html");
              res.redirect("/farm");
              //console.log("finished redirecting farm!!!!!!!!!");
        }
      });
    };
  }, function (errorObject) {
      console.log("Read farm failed: " + errorObject.code);
      res.render('dashboard/error405.ejs', {});
    });
};

exports.api_activate_farm_2 = function(req, res){
  var farm_id = req.params.id;
  var farm_alarm_interval;
  var count = 1;
  var line = require('../../line/line.js');
  var schedule = require('node-schedule');
  //var date = new Date(2012, 11, 21, 5, 30, 0);
  var ref = db.ref('/farm/'+farm_id);
  ref.once('value', function(snapshot) {
    var farmObj = JSON.parse(JSON.stringify(snapshot));
    if(farmObj.activated == "false")
    {
      farm_alarm_interval = parseInt(farmObj.alarm_interval)*60000;
      farmObj.farm_id = farm_id;
      var ref2 = db.ref('/farm/').child(farm_id);
      ref2.update({
        activated: 'true',
        last_activated_at: moment().format()
      }, function(err){
          if(err)
            res.respond("1201");
          else {
            var time_now = moment().format();
            console.log("farm[" + farm_id + "] has been activated!");
            line.lineGroupNotify("เปิดระบบฟาร์ม" + farmObj.title + " @" + time_now, farmObj.linegroup_token);
            //var CronJob = require('cron').CronJob;
            //var job = new CronJob('*/8 * * * *', function() {
            var next_w = getNextWateringDate(farmObj.watering_schedule);
            var next_w_date = moment(next_w.current_date, "YYYY-MM-DD");
            var next_alarm = moment(farmObj.alarm_time, "HH:mm:ss");
            console.log("Next watering => " + next_w_date.format("YYYY") + ", " + next_w_date.format("MM") + ", " + next_w_date.format("DD") + ", " + next_alarm.format("HH") + ", " + next_alarm.format("mm") + ", " + next_alarm.format("ss"));
            var date = new Date(next_w_date.format("YYYY"), next_w_date.subtract(1, 'months').format("MM"), next_w_date.format("DD"), next_alarm.format("HH"), next_alarm.format("mm") , next_alarm.format("ss"));
            var rdate = new Date(next_w_date.format("YYYY"), next_w_date.format("MM"), next_w_date.format("DD"), next_alarm.format("HH"), next_alarm.subtract(1, 'minutes').format("mm") , next_alarm.format("ss"));
            console.log("Date => " + date + ", RDate => " + rdate);
            if(next_w.is_today)
            {
              line.lineGroupNotify("วันนี้ฟาร์ม" + farmObj.title + " ต้องการการให้น้ำเป็นเวลา " + next_w.hours + " ชั่วโมง " + next_w.mins + "นาที @" + time_now, farmObj.linegroup_token);
            }
            else{
              var td = moment().format("YYYY-MM-DD");;
              line.lineGroupNotify("ตารางให้น้ำของฟาร์ม" + farmObj.title + " ครั้งต่อไปอีก " + moment(next_w.current_date).diff(td, 'days') + " วัน @" + next_w.current_date, farmObj.linegroup_token);
            }

            // read rain sensor after activate farm
            var sensorClient = new ThingSpeakClient();
            var sensor_id = farmObj.rain_sensor_id;
            var ref = db.ref('/sensor/' + sensor_id);
            var async = require('async');

            async.series([
              function(callback){
                sensorClient.getLastEntryInChannelFeed(parseInt(sensor_id), {}, function(err, resp){
                  if(typeof resp !== 'undefined')
                  {
                    db.ref('/sensor').child(sensor_id).update(resp);
                    callback(null, resp);
                  }
                });
              },
              function(callback){
                ref.once('value', function(snapshot) {
                  var obj = JSON.parse(JSON.stringify(snapshot));
                  obj.id = sensor_id;
                  //res.redirect('../farm');
                  //console.log("Edit farm[" + farm_id + "].......................................");
                  callback(null, obj);
                });
              }
            ], function(err, results){
                //var moment = require('moment');
                //res.render('dashboard/sensor/show_sensor.ejs', {sensor: results[1], moment: moment});
                var rtime_now = moment().format();
                if(results[1].field1 != null)
                {
                  console.log("Check rain sensor before alarm the today watering => ", results[1].field1);
                  line.lineGroupNotify("ปริมาณน้ำฝนในฟาร์ม" + farmObj.title + " เท่ากับ " + results[1].field1 + " มม. @" + rtime_now, farmObj.linegroup_token);
                  db.ref('/farm').child(farmObj.farm_id).update({
                    rain_last_checked: results[1].created_at,
                    rain_last_read: results[1].field1.substring(0,6),
                    last_updated: rtime_now
                  });
                }
                else {
                  console.log("Check rain sensor before alarm the today watering => FAILED");
                  line.lineGroupNotify("ไม่สามารถอ่านค่าเซ็นเซอร์น้ำฝนในฟาร์ม" + farmObj.title + "ได้ @" + rtime_now, farmObj.linegroup_token);
                }
            });

            var r_schedule = schedule.scheduleJob(rdate, function(){
              // check rain sensor before watering alarm to adjust the amount of watering
              var sensorClient = new ThingSpeakClient();
              var sensor_id = farmObj.rain_sensor_id;
              var ref = db.ref('/sensor/' + sensor_id);
              var async = require('async');

              async.series([
                function(callback){
                  sensorClient.getLastEntryInChannelFeed(parseInt(sensor_id), {}, function(err, resp){
                    if(typeof resp !== 'undefined')
                    {
                      db.ref('/sensor').child(sensor_id).update(resp);
                      callback(null, 1);
                    }
                  });
                },
                function(callback){
                  ref.once('value', function(snapshot) {
                    var obj = JSON.parse(JSON.stringify(snapshot));
                    obj.id = sensor_id;
                    //res.redirect('../farm');
                    //console.log("Edit farm[" + farm_id + "].......................................");
                    callback(null, obj);
                  });
                }
              ], function(err, results){
                  //var moment = require('moment');
                  //res.render('dashboard/sensor/show_sensor.ejs', {sensor: results[1], moment: moment});
                  var rtime_now = moment().format();
                  if(results[1].field1 != null)
                  {
                    console.log("Check rain sensor before alarm the today watering => ", results[1].field1);
                    line.lineGroupNotify("ปริมาณน้ำฝนในฟาร์ม" + farmObj.title + " เท่ากับ " + results[1].field1 + " มม. @" + rtime_now, farmObj.linegroup_token);
                    db.ref('/farm').child(farmObj.farm_id).update({
                      rain_last_checked: results[1].created_at,
                      rain_last_read: results[1].field1.substring(0,6),
                      last_updated: rtime_now
                    });
                  }
                  else {
                    console.log("Check rain sensor before alarm the today watering => FAILED");
                    line.lineGroupNotify("ไม่สามารถอ่านค่าเซ็นเซอร์น้ำฝนในฟาร์ม" + farmObj.title + "ได้ @" + rtime_now, farmObj.linegroup_token);
                  }
              });
            });

            var w_schedule = schedule.scheduleJob(date, function(){
              if(farmObj.alarm_start == "false")
              {
                var ref = db.ref('/farm/').child(farm_id).update({
                  alarm_start: "true",
                  need_watering: "true"
                }, function(err){
                  // notify the system to water
                  var time_now = moment().format();
                  console.log("Time to water for " + next_w.hours + " ชั่วโมง " + next_w.mins + " นาที");
                  line.lineGroupNotify("ฟาร์ม" + farmObj.title + " ต้องการการให้น้ำเป็นเวลา " + next_w.hours + " ชั่วโมง " + next_w.mins + "นาที @" + time_now, farmObj.linegroup_token);
                  line.lineGroupNotify("กรุณาเปิด mobile application เพื่อควบคุมการให้น้ำหรือปิดการแจ้งเตือนนี้", farmObj.linegroup_token);
                  var alarmIntervalObj = setInterval(function(farm_id, ws){
                    var ref3 = db.ref('/farm/' + farm_id);
                    ref3.once('value', function(snapshot){
                      var fo = JSON.parse(JSON.stringify(snapshot));
                      fo.farm_id = farm_id;
                      if(fo.alarm_start == "true")
                      {
                        var time_now2 = moment().format();
                        line.lineGroupNotify("วันนี้ฟาร์ม" + fo.title + " ต้องการการให้น้ำเป็นเวลา " + ws.hours + " ชั่วโมง " + ws.mins + "นาที @" + time_now2, fo.linegroup_token);
                        line.lineGroupNotify("กรุณาเปิด mobile application เพื่อควบคุมการให้น้ำหรือปิดการแจ้งเตือนนี้", fo.linegroup_token);
                      }
                      else {
                          //line.lineGroupNotify("ปิดการแจ้งเตือนการให้น้ำของฟาร์ม" + fo.title, fo.linegroup_token);
                          //line.lineGroupNotify("ตารางให้น้ำของฟาร์ม" + fo.title + " ครั้งต่อไปอีก " + ws.days + " วัน @" + ws.next_date, fo.linegroup_token);
                          clearInterval(alarmIntervalObj);
                      }
                      var ref4 = db.ref('/farm').child(fo.farm_id).update({
                        farm_last_checked: moment().format()
                      });
                    });
                  }, farm_alarm_interval, farm_id, next_w);
                  // reschedule for the next watering
                  next_w_date = moment(next_w.next_date, "YYYY-MM-DD");
                  date = new Date(next_w_date.format("YYYY"), next_w_date.subtract(1, 'months').format("MM"), next_w_date.format("DD"), next_alarm.format("HH"), next_alarm.format("mm"), next_alarm.format("ss"));
                  console.log("Next watering => " + next_w_date.format("YYYY") + ", " + next_w_date.format("MM") + ", " + next_w_date.format("DD") + ", " + next_alarm.format("HH") + ", " + next_alarm.format("mm") + ", " + next_alarm.format("ss"));
                  //date = new Date(2018, 5, 20, 5, 19, 0);
                  w_schedule.reschedule(date);
                });
              }
            });
            /*var farmIntervalObj = setInterval(function(farm_id){
              var ref3 = db.ref('/farm/' + farm_id);
              ref3.once('value', function(snapshot){
                var fo = JSON.parse(JSON.stringify(snapshot));
                fo.farm_id = farm_id;
                if(fo.activated == 'false')
                  {
                    count = 1;
                    console.log("farm[" + farm_id + "] has been deactivated.");
                    //job.stop();
                    clearInterval(farmIntervalObj);
                  }
                  else{
                    count++;
                    console.log("Farm [" + farm_id + "] counting => " + count);
                    runFarm(fo, count);
                  }
                });
            }, farm_sampling_time, farm_id); */
              console.log("finished activating farm!!!!!!!!!");
              //res.send("start farm[" + farm_id + "]... done!");
              //res.setHeader("Content-Type", "text/html");
              res.send("200");
              //console.log("finished redirecting farm!!!!!!!!!");
        }
      });
    };
  }, function (errorObject) {
      console.log("Read farm failed: " + errorObject.code);
      res.send("202");
    });
};

exports.api_set_watering_complete = function(req, res){
  var farm_id = req.params.id;
  var ws = req.params.ws;
  console.log("Updating watering complete for farm[" + farm_id + "] at #" + ws + "...");
  var ref = db.ref('/farm/' + farm_id + '/watering_schedule/' + ws + '/');
  ref.update({
    watering_complete: true
  }, function(err){
    if(err)
      res.send("201");
    var ref2 = db.ref('/farm/').child(farm_id).update(
      {
        last_updated: moment().format()
      }, function(err){
        if(err)
        {
          res.send("202");
        }
        console.log("Update watering complete for farm[" + farm_id + "] at #" + ws);
        res.send("200");
      }
    );
  });
}


exports.turnon_farm2_alarm = function(req, res){
  var line = require('../../line/line.js');
  var farm_id = req.params.id;
  var ref = db.ref('/farm/'+farm_id);
  ref.once('value', function(snapshot) {
    var farmObj = JSON.parse(JSON.stringify(snapshot));
    var ref = db.ref('/farm/').child(farm_id).update({
      alarm_start: "true",
      need_watering: "true",
      last_updated: moment().format()
    }, function(err){
      if(err)
      {
        console.log("Turn on alarm of farm[" + farm_id + "...FAILED!");
        //res.send('{\"code\":\"500\", \"message\":\"ตั้งค่าตรวจสอบเซ็นเซอร์ไม่สำเร็จ\"}');
        res.render('dashboard/error405.ejs', {});
      }
      console.log("Turn on alarm of farm[" + farm_id + "...OK!");
      line.lineGroupNotify("ปิดการแจ้งเตือนการให้น้ำของฟาร์ม" + farmObj.title, farmObj.linegroup_token);
      //res.send('{\"code\":\"200\", \"message\":\"ตั้งค่าตรวจสอบเซ็นเซอร์เรียบร้อย\"}');
      res.redirect("/farm/show/" + farm_id);
    });
  });
}

exports.turnoff_farm2_alarm = function(req, res){
  var line = require('../../line/line.js');
  var farm_id = req.params.id;
  var ref = db.ref('/farm/'+farm_id);
  ref.once('value', function(snapshot) {
    var farmObj = JSON.parse(JSON.stringify(snapshot));

    var ref = db.ref('/farm/').child(farm_id).update({
      alarm_start: "false",
      need_watering: "false",
      last_updated: moment().format()
    }, function(err){
      if(err)
      {
        console.log("Turnoff alarm of farm[" + farm_id + "...FAILED!");
        //res.send('{\"code\":\"500\", \"message\":\"ตั้งค่าตรวจสอบเซ็นเซอร์ไม่สำเร็จ\"}');
        res.render('dashboard/error405.ejs', {});
      }
      console.log("Turnoff alarm of farm[" + farm_id + "...OK!");
      line.lineGroupNotify("ปิดการแจ้งเตือนการให้น้ำของฟาร์ม" + farmObj.title, farmObj.linegroup_token);
      //res.send('{\"code\":\"200\", \"message\":\"ตั้งค่าตรวจสอบเซ็นเซอร์เรียบร้อย\"}');
      res.redirect("/farm/show/" + farm_id);
    });

  });
}

exports.api_turnon_farm2_alarm = function(req, res){
  var line = require('../../line/line.js');
  var farm_id = req.params.id;
  var ref = db.ref('/farm/'+farm_id);
  ref.once('value', function(snapshot) {
    var farmObj = JSON.parse(JSON.stringify(snapshot));
    var ref = db.ref('/farm/').child(farm_id).update({
      alarm_start: "true",
      need_watering: "true",
      last_updated: moment().format()
    }, function(err){
      if(err)
      {
        console.log("Turn on alarm of farm[" + farm_id + "...FAILED!");
        //res.send('{\"code\":\"500\", \"message\":\"ตั้งค่าตรวจสอบเซ็นเซอร์ไม่สำเร็จ\"}');
        res.send("201");
      }
      console.log("Turn on alarm of farm[" + farm_id + "...OK!");
      line.lineGroupNotify("ปิดการแจ้งเตือนการให้น้ำของฟาร์ม" + farmObj.title, farmObj.linegroup_token);
      //res.send('{\"code\":\"200\", \"message\":\"ตั้งค่าตรวจสอบเซ็นเซอร์เรียบร้อย\"}');
      res.send("200");
    });

  });
}

exports.api_turnoff_farm2_alarm = function(req, res){
  var line = require('../../line/line.js');
  var farm_id = req.params.id;
  var ref = db.ref('/farm/'+farm_id);
  ref.once('value', function(snapshot) {
    var farmObj = JSON.parse(JSON.stringify(snapshot));
    var ref = db.ref('/farm/').child(farm_id).update({
      alarm_start: "false",
      need_watering: "false",
      last_updated: moment().format()
    }, function(err){
      if(err)
      {
        console.log("Turnoff alarm of farm[" + farm_id + "...FAILED!");
        //res.send('{\"code\":\"500\", \"message\":\"ตั้งค่าตรวจสอบเซ็นเซอร์ไม่สำเร็จ\"}');
        res.send("201");
      }
      console.log("Turnoff alarm of farm[" + farm_id + "...OK!");
      line.lineGroupNotify("ปิดการแจ้งเตือนการให้น้ำของฟาร์ม" + farmObj.title, farmObj.linegroup_token);
      //res.send('{\"code\":\"200\", \"message\":\"ตั้งค่าตรวจสอบเซ็นเซอร์เรียบร้อย\"}');
      res.send("200");
    });
  });
}

exports.api_update_farm2_alarm = function(req, res){
  var farm_id = req.params.id;
  //var alarm_time = req.params.value.sutstring(0,1) + ":" + req.params.value.sutstring(2,3) + ":00";
  var alarm_time = req.params.value;
  var ref = db.ref('/farm/').child(farm_id).update({
    //alarm_time: alarm_time.substring(0,1) + ":" + alarm_time.substring(2,3) + ":00"
    alarm_time: alarm_time,
    last_updated: moment().format()
  }, function(err){
    if(err)
    {
      console.log("Set new alarm of farm[" + farm_id + " with value = " + req.params.value + "...FAILED!");
      //res.send('{\"code\":\"500\", \"message\":\"ตั้งค่าตรวจสอบเซ็นเซอร์ไม่สำเร็จ\"}');
      res.send("201");
    }
    console.log("Set new alarm of farm[" + farm_id + " with value = " + req.params.value + "...OK!");
    //res.send('{\"code\":\"200\", \"message\":\"ตั้งค่าตรวจสอบเซ็นเซอร์เรียบร้อย\"}');
    res.send("200");
  });
}

exports.api_set_sampling_time = function(req, res){
  var farm_id = req.params.id;
  var sampling_time = req.params.value;
  //console.log("Set sampling time of farm[" + farm_id + "] with value = " + sampling_time + " minutes...");
  var ref = db.ref('/farm/').child(farm_id).update({
    sampling_time: req.params.value,
    last_updated: moment().format()
  }, function(err){
    if(err)
    {
      console.log("Set sampling time of farm[" + farm_id + "] with value = " + sampling_time + " minutes...FAILED!");
      //res.send('{\"code\":\"500\", \"message\":\"ตั้งค่าตรวจสอบเซ็นเซอร์ไม่สำเร็จ\"}');
      res.send("201");
    }
    console.log("Set sampling time of farm[" + farm_id + "] with value = " + sampling_time + " minutes...OK!");
    //res.send('{\"code\":\"200\", \"message\":\"ตั้งค่าตรวจสอบเซ็นเซอร์เรียบร้อย\"}');
    res.send("200");
  });
}

exports.api_set_valve1_channel = function(req, res){
  var farm_id = req.params.farm_id;
  //console.log("Set sampling time of farm[" + farm_id + "] with value = " + sampling_time + " minutes...");
  var ref = db.ref('/farm/').child(farm_id).update({
    valve_1_id: req.params.valve_id,
    last_updated: moment().format()
  }, function(err){
    if(err)
    {
      console.log("Set valve #1 of farm[" + farm_id + "] with channel = " + req.params.valve_id + " ...FAILED!");
      //res.send('{\"code\":\"500\", \"message\":\"ตั้งค่าตรวจสอบเซ็นเซอร์ไม่สำเร็จ\"}');
      res.send("201");
    }
    console.log("Set valve #1 of farm[" + farm_id + "] with channel = " + req.params.valve_id + " ...OK!");
    //res.send('{\"code\":\"200\", \"message\":\"ตั้งค่าตรวจสอบเซ็นเซอร์เรียบร้อย\"}');
    res.send("200");
  });
}

exports.api_set_valve2_channel = function(req, res){
  var farm_id = req.params.farm_id;
  //console.log("Set sampling time of farm[" + farm_id + "] with value = " + sampling_time + " minutes...");
  var ref = db.ref('/farm/').child(farm_id).update({
    valve_2_id: req.params.valve_id,
    last_updated: moment().format()
  }, function(err){
    if(err)
    {
      console.log("Set valve #2 of farm[" + farm_id + "] with channel = " + req.params.valve_id + " ...FAILED!");
      //res.send('{\"code\":\"500\", \"message\":\"ตั้งค่าตรวจสอบเซ็นเซอร์ไม่สำเร็จ\"}');
      res.send("201");
    }
    console.log("Set valve #2 of farm[" + farm_id + "] with channel = " + req.params.valve_id + " ...OK!");
    //res.send('{\"code\":\"200\", \"message\":\"ตั้งค่าตรวจสอบเซ็นเซอร์เรียบร้อย\"}');
    res.send("200");
  });
}

exports.api_set_humidity_channel = function(req, res){
  var farm_id = req.params.farm_id;
  //console.log("Set sampling time of farm[" + farm_id + "] with value = " + sampling_time + " minutes...");
  var ref = db.ref('/farm/').child(farm_id).update({
    humidity_sensor_id: req.params.humidity_id,
    last_updated: moment().format()
  }, function(err){
    if(err)
    {
      console.log("Set humidity sensor of farm[" + farm_id + "] with channel = " + req.params.humidity_id + " ...FAILED!");
      //res.send('{\"code\":\"500\", \"message\":\"ตั้งค่าตรวจสอบเซ็นเซอร์ไม่สำเร็จ\"}');
      res.send("201");
    }
    console.log("Set humidity sensor of farm[" + farm_id + "] with channel = " + req.params.humidity_id + " ...OK!");
    //res.send('{\"code\":\"200\", \"message\":\"ตั้งค่าตรวจสอบเซ็นเซอร์เรียบร้อย\"}');
    res.send("200");
  });
}

exports.api_set_humidity_critical_point = function(req, res){
  var farm_id = req.params.farm_id;
  //console.log("Set sampling time of farm[" + farm_id + "] with value = " + sampling_time + " minutes...");
  var ref = db.ref('/farm/').child(farm_id).update({
    humidity_critical_point: req.params.value,
    last_updated: moment().format()
  }, function(err){
    if(err)
    {
      console.log("Set humidity critical point of farm[" + farm_id + "] with value = " + req.params.value + " ...FAILED!");
      //res.send('{\"code\":\"500\", \"message\":\"ตั้งค่าตรวจสอบเซ็นเซอร์ไม่สำเร็จ\"}');
      res.send("201");
    }
    console.log("Set humidity critical point of farm[" + farm_id + "] with value = " + req.params.value + " ...OK!");
    //res.send('{\"code\":\"200\", \"message\":\"ตั้งค่าตรวจสอบเซ็นเซอร์เรียบร้อย\"}');
    res.send("200");
  });
}

function Watering1On(farm_id)
{
  // get farm info
  var ref = db.ref('/farm/'+farm_id);
  ref.once('value', function(snapshot) {
    var farmObj = JSON.parse(JSON.stringify(snapshot));
    // check mainpump
    var ref2 = db.ref('/mainpump/'+farmObj.mainpump_id);
    ref2.once('value', function(snapshot){
        var mainpumpObj = JSON.parse(JSON.stringify(snapshot));
    });
  });
}

exports.deactivate_farm_1 = function(req, res){
  var line = require('../../line/line.js');
  var farm_id = req.params.id;
  var ref = db.ref('/farm/').child(farm_id).update({
    activated: 'false',
    last_activated_at: moment().format()
  }, function(err){
    if(err)
      res.render('dashboard/error405.ejs', {});
    else {
      //console.log("farm[" + farm_id + "] is going to be deactivated...");
      //res.send("farm[" + farm_id + "] has been deactivated...");

      var ref2 = db.ref('/farm/' + farm_id);
      ref2.once('value', function(snapshot) {
        var farmObj = JSON.parse(JSON.stringify(snapshot));
        var time_now = moment().format();
        console.log("farm[" + farm_id + "] has been deactivated! @" + time_now);
        line.lineGroupNotify("ปิดระบบฟาร์ม" + farmObj.title + " @" + time_now, farmObj.linegroup_token);
        res.redirect("/farm/show/"+farm_id);
      });
    };
  });
};

exports.api_deactivate_farm_1 = function(req, res){
  var line = require('../../line/line.js');
  var farm_id = req.params.id;
  var ref = db.ref('/farm/').child(farm_id).update({
    activated: 'false',
    last_activated_at: moment().format()
  }, function(err){
    if(err)
      res.send("201");
    else {
      //console.log("farm[" + farm_id + "] is going to be deactivated...");
      //res.send("farm[" + farm_id + "] has been deactivated...");

      var ref2 = db.ref('/farm/' + farm_id);
      ref2.once('value', function(snapshot) {
        var farmObj = JSON.parse(JSON.stringify(snapshot));
        var time_now = moment().format();
        console.log("farm[" + farm_id + "] has been deactivated! @" + time_now);
        line.lineGroupNotify("ปิดระบบฟาร์ม" + farmObj.title + " @" + time_now, farmObj.linegroup_token);
        res.send("200");
      });
    }
  });
};

exports.deactivate_farm_2 = function(req, res){
  var line = require('../../line/line.js');
  var farm_id = req.params.id;
  var ref = db.ref('/farm/').child(farm_id).update({
    activated: 'false',
    alarm_start: 'false',
    last_activated_at: moment().format()
  }, function(err){
    if(err)
      res.render('dashboard/error405.ejs', {});
    else {
      //console.log("farm[" + farm_id + "] is going to be deactivated...");
      //res.send("farm[" + farm_id + "] has been deactivated...");

      var ref2 = db.ref('/farm/' + farm_id);
      ref2.once('value', function(snapshot) {
        var farmObj = JSON.parse(JSON.stringify(snapshot));
        var time_now = moment().format();
        console.log("farm[" + farm_id + "] has been deactivated! @" + time_now);
        line.lineGroupNotify("ปิดระบบฟาร์ม" + farmObj.title + " @" + time_now, farmObj.linegroup_token);
        res.redirect("/farm/show/"+farm_id);
      });
    }
  });
};

exports.api_deactivate_farm_2 = function(req, res){
  var line = require('../../line/line.js');
  var farm_id = req.params.id;
  var ref = db.ref('/farm/').child(farm_id).update({
    activated: 'false',
    alarm_start: 'false',
    last_activated_at: moment().format()
  }, function(err){
    if(err)
      res.send("201");
    else {
      //console.log("farm[" + farm_id + "] is going to be deactivated...");
      //res.send("farm[" + farm_id + "] has been deactivated...");

      var ref2 = db.ref('/farm/' + farm_id);
      ref2.once('value', function(snapshot) {
        var farmObj = JSON.parse(JSON.stringify(snapshot));
        var time_now = moment().format();
        console.log("farm[" + farm_id + "] has been deactivated! @" + time_now);
        line.lineGroupNotify("ปิดระบบฟาร์ม" + farmObj.title + " @" + time_now, farmObj.linegroup_token);
        res.send("200");
      });
    }
  });
};

exports.show_farm_location = function(req, res){
  var farm_id = req.params.id;
  var ref = db.ref('/farm/' + farm_id);
  ref.once('value', function(snapshot) {
    var farmObj = JSON.parse(JSON.stringify(snapshot));
    res.render('dashboard/farm/show_farm_location.ejs', {farm: farmObj});
  });
};


exports.list_all_hardware = function(req, res){
  ref.on("value", function(snapshot) {
    var obj = JSON.stringify(snapshot.val());
    //console.log("Number of object => " + obj.length);
    res.render(obj);
  }, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
  });
};


exports.compute_etp = function(req, res){
  var ETp = require('../../etp/ETp.js');
  var latitude = req.params.latitude;
  var longitude = req.params.longitude;
  console.log("Compute ETp with (lat,long) => ", latitude, longitude);
  //14.8766249,102.0061992
  var etp = ETp.computeETp(latitude, longitude);
  res.send(etp);
}

exports.compute_watering_schedule = function(req, res){
  var ETp = require('../../etp/ETp.js');
  var farm_id = req.params.farm_id;
  /*async.waterfall([
      function(callback){
        var watering_schedule = ETp.computeWateringSchedule(farm_id);
        console.log("Watering Schedule 0");
        callback(null, watering_schedule);
      },
      function(a, callback){
        console.log("Watering Schedule 1 => ", a);
        callback(null, a);
      }
  ], function(err, c){
    console.log("Watering Schedule 2 => ", c);
    res.send(c);
  }); */
  function computeWateringScheduleFinished(next_watering, res){
    console.log("Watering schedule finished!!!!!!!!!!!")
    //console.log(next_watering);
    res.send(next_watering);
  }

  ETp.computeWateringSchedule(farm_id, computeWateringScheduleFinished, res);

}

exports.list_all_schedule = function(req, res) {
  var ref = db.ref('/valveschedule');
  ref.once('value', function(snapshot) {
    var obj = snapshotToArray(snapshot);
    //console.log("Mainpump list => " + JSON.stringify(obj) + " with size of " + obj.length);
    //console.log("farms..............", obj);
    res.render('dashboard/farm/list_valveschedule.ejs', {valveschedules: obj});
  }, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
  });
};

exports.new_schedule = function(req, res) {
  var moment = require('moment');
  res.render('dashboard/farm/create_valve_schedule.ejs', {moment:moment});
};

exports.create_schedule = function(req, res) {
  var schedule_id = uuidv1();
  var ref = db.ref('/farm').child(schedul_id).set({
              title: req.body.create_farm_title,
              description: req.body.create_farm_description,
              latitude: req.body.create_farm_latitude,
              longitude: req.body.create_farm_longitude,
              soil_id: req.body.create_soil_id,
              soil_title: selected_soil.title_thai,
              plant_id: req.body.create_plant_id,
              plant_title: selected_plant.title,
              starting_date: req.body.create_farm_starting_date,
              watering_scheme: watering_scheme,
              humidity_critical_point: 15,
              //humidity_sensor_id: req.body.create_farm_humidity_sensor_id,
              //mainpump_id: req.body.create_farm_mainpump_id,
              //valve_1_id: req.body.create_farm_valve_1_id,
              //valve_2_id: req.body.create_farm_valve_2_id,
              sampling_time: 15,
              linegroup_token: req.body.create_farm_linegroup_token,
              activated: 'false',
              created_at: farm_created_at
            }, function(err){
              if(err)
                res.render('dashboard/error405.ejs', {});
              else {
                res.redirect('/farm');
              }
            });

};

exports.edit_schedule = function(req, res) {
  var async = require('async');
  var farm_id = req.params.id;
  async.parallel([
    function(callback){
      var ref = db.ref('/farm/' + farm_id);
      ref.once('value', function(snapshot) {
        var farm = JSON.parse(JSON.stringify(snapshot));
        //res.redirect('../farm');
        //console.log("Edit farm[" + farm_id + "].......................................");
        farm.id = farm_id;
        callback(null, farm);
      });
    },
    function(callback){
      var ref = db.ref('/soil');
      ref.once('value', function(snapshot){
        var obj2 = JSON.parse(JSON.stringify(snapshot));
        var idObj2 = Object.keys(obj2);
        var soils = [];
        for(var i=0;i<idObj2.length;i++)
        {
          soils.push(obj2[idObj2[i]]);
          soils[i].id = idObj2[i];
        }
        callback(null, soils);
      });
    },
    function(callback){
      var ref = db.ref('/plant');
      ref.once('value', function(snapshot){
        var obj3 = JSON.parse(JSON.stringify(snapshot));
        var idObj3 = Object.keys(obj3);
        var plants = [];
        for(var i=0;i<idObj3.length;i++)
        {
          plants.push(obj3[idObj3[i]]);
          plants[i].id = idObj3[i];
        }
        callback(null, plants);
      });
    },
    function(callback){
      var ref = db.ref('/sensor');
      ref.once('value', function(snapshot){
        var obj3 = JSON.parse(JSON.stringify(snapshot));
        var idObj3 = Object.keys(obj3);
        var sensors = [];
        for(var i=0;i<idObj3.length;i++)
        {
          sensors.push(obj3[idObj3[i]]);
          sensors[i].id = idObj3[i];
        }
        callback(null, sensors);
      });
    },
    function(callback){
      var ref = db.ref('/mainpump');
      ref.once('value', function(snapshot){
        var obj3 = JSON.parse(JSON.stringify(snapshot));
        var idObj3 = Object.keys(obj3);
        var mainpumps = [];
        for(var i=0;i<idObj3.length;i++)
        {
          mainpumps.push(obj3[idObj3[i]]);
          mainpumps[i].id = idObj3[i];
        }
        callback(null, mainpumps);
      });
    },
    function(callback){
      var ref = db.ref('/valve');
      ref.once('value', function(snapshot){
        var obj3 = JSON.parse(JSON.stringify(snapshot));
        var idObj3 = Object.keys(obj3);
        var valves = [];
        for(var i=0;i<idObj3.length;i++)
        {
          valves.push(obj3[idObj3[i]]);
          valves[i].id = idObj3[i];
        }
        callback(null, valves);
      });
    }
  ], function(err, results){
      if(err)
        send(err);
      var moment = require('moment');
      switch(results[0].watering_scheme)
      {
        case '1':
          res.render('dashboard/farm/edit_farm1.ejs', {farm: results[0], soils: results[1], plants: results[2], sensors: results[3], mainpumps: results[4], valves: results[5], moment: moment});
          break;
        case '2':
          res.render('dashboard/farm/edit_farm2.ejs', {farm: results[0], soils: results[1], plants: results[2], moment: moment});
          break;
      }
  });
};

exports.update_schedule = function(req, res) {
  //, soils: obj2 compute

  /*var ref = db.ref('/mainpump/' + pump_id).set({
    write_api_key: write_api_key
  });*/
  var ref = db.ref('/soil');
  ref.once('value', function(snapshot){
    var obj2 = JSON.parse(JSON.stringify(snapshot));
    var selected_soil = obj2[req.body.edit_soil_id];
    //console.log("selected soil.....................", selected_soil);
    ref = db.ref('/plant');
    ref.once('value', function(snapshot){
      var obj3 = JSON.parse(JSON.stringify(snapshot));
      var selected_plant = obj3[req.body.edit_plant_id];
      var farm_id = req.body.edit_farm_id;
      var farm_starting_date = req.body.edit_farm_starting_date;
      var farm_created_at = moment().format();
      var farm_watering_scheme = req.body.edit_farm_watering_scheme;

      switch(farm_watering_scheme){
        case '1':
          /*var ref = db.ref('/mainpump/' + pump_id).set({
            write_api_key: write_api_key
          });*/
          var ref = db.ref('/farm').child(farm_id).update({
              title: req.body.edit_farm_title,
              description: req.body.edit_farm_description,
              latitude: req.body.edit_farm_latitude,
              longitude: req.body.edit_farm_longitude,
              soil_id: req.body.edit_soil_id,
              soil_title: selected_soil.title_thai,
              plant_id: req.body.edit_plant_id,
              plant_title: selected_plant.title,
              humidity_critical_point: req.body.edit_farm_humidity_critical_point,
              watering_scheme: farm_watering_scheme,
              starting_date: farm_starting_date,
              humidity_sensor_id: req.body.edit_farm_humidity_sensor_id,
              mainpump_id: req.body.edit_farm_mainpump_id,
              valve_1_id: req.body.edit_farm_valve_1_id,
              valve_2_id: req.body.edit_farm_valve_2_id,
              sampling_time: req.body.edit_farm_sampling_time,
              linegroup_token: req.body.edit_farm_linegroup_token,
              created_at: farm_created_at,
              last_updated: moment().format()
            }, function(err){
              if(err)
                res.render('dashboard/error405.ejs', {});
              else {
                //console.log("current edit farm directory => ", __dirname);
                res.redirect('/farm');
              }
            });
          break;
        case '2':
        //, soils: obj2 compute
        var farm_total_drip_per_rai = Math.floor(1600/(req.body.edit_farm_tape_interval*req.body.edit_farm_drip_interval));
        var farm_total_flowrate_per_rai = farm_total_drip_per_rai*req.body.edit_farm_drip_flowrate;

        /*var ref = db.ref('/mainpump/' + pump_id).set({
          write_api_key: write_api_key
        });*/
        var ETp = require('../../etp/ETp.js');
        var watering_schedule = ETp.computeWateringSchedule(farm_id, function(ws){
          var ref = db.ref('/farm').child(farm_id).update({
              title: req.body.edit_farm_title,
              description: req.body.edit_farm_description,
              latitude: req.body.edit_farm_latitude,
              longitude: req.body.edit_farm_longitude,
              tape_interval: req.body.edit_farm_tape_interval,
              drip_interval: req.body.edit_farm_drip_interval,
              drip_flowrate: req.body.edit_farm_drip_flowrate,
              total_drip_per_rai: farm_total_drip_per_rai,
              total_flowrate_per_rai: farm_total_flowrate_per_rai,
              soil_id: req.body.edit_soil_id,
              soil_title: selected_soil.title_thai,
              plant_id: req.body.edit_plant_id,
              plant_title: selected_plant.title,
              watering_scheme: farm_watering_scheme,
              watering_schedule: ws,
              starting_date: farm_starting_date,
              mainpump_id: req.body.edit_farm_mainpump_id,
              valve_1_id: req.body.edit_farm_valve_1_id,
              valve_2_id: req.body.edit_farm_valve_2_id,
              linegroup_token: req.body.edit_farm_linegroup_token,
              created_at: farm_created_at,
              last_updated: moment().format()
            }, function(err){
              if(err)
                res.render('dashboard/error405.ejs', {});
              else {
                var ETp = require('../../etp/ETp.js');
                var watering_schedule = ETp.computeWateringSchedule(farm_id, function(ws){
                  ref = db.ref('/farm').child(farm_id).update({
                    watering_schedule: ws
                  }, function(err){
                      if(err)
                        res.render('dashboard/error405.ejs', {});
                      else
                        res.redirect('/farm');
                  });
                });
              };
            });
          });
          break;
      }
    });
  });
};
