'use strict';

var async = require('async');
var moment = require('moment');
const uuidv1 = require('uuid/v1');
var admin = require("firebase");
var db = admin.database();

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

exports.list_all_plants = function(req, res) {
  var ref = db.ref('/plant');
  ref.once('value', function(snapshot) {
    var obj = snapshotToArray(snapshot);
    //console.log("Soil list => " + JSON.stringify(obj) + " with size of " + obj.length);
    res.render('dashboard/plant/list_plant.ejs', {plants: obj});
  }, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
  });
};

exports.new_plant = function(req, res){
  res.render("dashboard/plant/create_plant.ejs", {moment: moment});
}
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
exports.create_a_plant = function(req, res) {
  var plant_title = req.body.add_plant_title;
  var plant_week = req.body.add_plant_week;
  var created_at = moment();
  var plant_id = uuidv1();
  //console.log("Soil id => ", soil_id);
  //console.log("Soil title => ", soil_title);
  //console.log("Soil created_at => ", created_at);
  //console.log('Sensor id = ' + sensor_id + ", key = " + sensor_write_api_key);
  /*var ref = db.ref('/mainpump/' + pump_id).set({
    write_api_key: write_api_key
  });*/
  var kc_obj = [];
  var root_depth_obj = [];
  for(var i=0;i<plant_week;i++)
  {
    kc_obj.push(0);
    root_depth_obj.push(0);
  }
    var ref = db.ref('/plant').child(plant_id).set({
      title: plant_title,
      weeks: plant_week,
      kc: kc_obj,
      root_depth: root_depth_obj,
      created_at: created_at.format()
    });
  res.redirect('/plant')
};

exports.edit_a_plant = function(req, res){
  var plant_id = req.params.id;
  var ref = db.ref('/plant/' + plant_id);
  ref.once('value', function(snapshot) {
    var obj = JSON.parse(JSON.stringify(snapshot));
    //res.redirect('../farm');
    //console.log("Edit farm[" + farm_id + "].......................................");
    obj.id = plant_id;
    var moment = require('moment');
    res.render('dashboard/plant/edit_plant.ejs', {plant: obj, moment: moment});
  });
}

exports.update_a_plant = function(req, res){
  var plant_id = req.body.edit_plant_id;
  var plant_title = req.body.edit_plant_title;
  var kc_obj = req.body.edit_plant_kc;
  var root_depth_obj = req.body.edit_plant_root_depth;
  var created_at = moment();
  //console.log('plant id = ' + plant_id + ", kc = " + kc_obj + ", root depth = " + root_depth_obj);
  var ref = db.ref('/plant').child(plant_id).update({
    title: plant_title,
    kc: kc_obj,
    root_depth: root_depth_obj,
    created_at: created_at.format()
  });
  res.redirect('/plant');
};

exports.show_plant = function(req, res){
  var plant_id = req.params.id;
  var ref = db.ref('/plant/' + plant_id);
  ref.once('value', function(snapshot) {
    var obj = JSON.parse(JSON.stringify(snapshot));
    //res.redirect('../farm');
    //console.log("Edit farm[" + farm_id + "].......................................");
    obj.id = plant_id;
    var moment = require('moment');
    res.render('dashboard/plant/show_plant.ejs', {plant: obj, moment: moment});
  });
}

exports.add_kc_a_plant = function(req, res){
  var plant_id = req.body.add_kc_plant_id;
  var plant_title = req.body.add_kc_plant_title;
  var kc_week = req.body.add_kc_week;
  var kc_value = req.body.add_kc_value;
  var created_at = moment();
  //console.log('soil id = ' + soil_id + ", title = " + soil_title);
  var ref = db.ref('/plant').child(plant_id).update({
    title: plant_title,
    created_at: created_at.format()
  });
  res.redirect('/plant');
};

exports.delete_a_plant_id = function(req, res){
  var plant_id = req.params.id;
  console.log("Delete plant by id => " + plant_id);
  var ref = db.ref('/plant/'+plant_id).remove(function(err){
    if(err)
      res.render('/dashboard/error405.ejs', {});
    res.redirect('/plant');
  });
};
