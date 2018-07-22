'use strict';

var async = require('async');
var moment = require('moment');
const uuidv1 = require('uuid/v1');
//var admin = require("firebase-admin");
var admin = require('firebase');

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

exports.list_all_soils = function(req, res) {
  var ref = db.ref('/soil');
  ref.once('value', function(snapshot) {
    var obj = snapshotToArray(snapshot);
    //console.log("Soil list => " + JSON.stringify(obj) + " with size of " + obj.length);
    res.render('dashboard/soil/list_soil.ejs', {soils: obj});
  }, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
  });
};

exports.new_soil = function(req, res){
  res.render("dashboard/soil/create_soil.ejs", {moment: moment});
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
exports.create_a_soil = function(req, res) {
  var soil_title = req.body.add_soil_title;
  var soil_title2 = req.body.add_soil_title2;
  var soil_water_holding_capacity = req.body.add_soil_water_holding_capacity;
  var soil_water_allowance = req.body.add_soil_water_allowance;
  var created_at = moment();
  var soil_id = uuidv1()
  //console.log("Soil id => ", soil_id);
  //console.log("Soil title => ", soil_title);
  //console.log("Soil created_at => ", created_at);
  //console.log('Sensor id = ' + sensor_id + ", key = " + sensor_write_api_key);
  /*var ref = db.ref('/mainpump/' + pump_id).set({
    write_api_key: write_api_key
  });*/
    var ref = db.ref('/soil').child(soil_id).set({
      title_eng: soil_title,
      title_thai: soil_title2,
      water_holding_capacity: soil_water_holding_capacity,
      water_allowance: soil_water_allowance,
      created_at: created_at.format()
    });
  res.redirect('/soil');
};

exports.edit_a_soil = function(req, res){
  var soil_id = req.params.id;
  var ref = db.ref('/soil/' + soil_id);
  ref.once('value', function(snapshot) {
    var obj = JSON.parse(JSON.stringify(snapshot));
    //res.redirect('../farm');
    //console.log("Edit farm[" + farm_id + "].......................................");
    obj.id = soil_id;
    var moment = require('moment');
    res.render('dashboard/soil/edit_soil.ejs', {soil: obj, moment: moment});
  });
}

exports.update_a_soil = function(req, res){
  var soil_id = req.body.edit_soil_id;
  var soil_title = req.body.edit_soil_title;
  var soil_title2 = req.body.edit_soil_title2;
  var soil_water_holding_capacity = req.body.edit_soil_water_holding_capacity;
  var soil_water_allowance = req.body.edit_soil_water_allowance;
  var created_at = moment();
  //console.log('soil id = ' + soil_id + ", title = " + soil_title);
  var ref = db.ref('/soil').child(soil_id).update({
    title_eng: soil_title,
    title_thai: soil_title2,
    water_holding_capacity: soil_water_holding_capacity,
    water_allowance: soil_water_allowance,
    created_at: created_at.format()
  });
  res.redirect('/soil');
};

exports.show_soil = function(req, res){
  var soil_id = req.params.id;
  var ref = db.ref('/soil/' + soil_id);
  ref.once('value', function(snapshot) {
    var obj = JSON.parse(JSON.stringify(snapshot));
    //res.redirect('../farm');
    //console.log("Edit farm[" + farm_id + "].......................................");
    obj.id = soil_id;
    var moment = require('moment');
    res.render('dashboard/soil/show_soil.ejs', {soil: obj, moment: moment});
  });
}

exports.delete_a_soil_id = function(req, res){
  var soil_id = req.params.id;
  console.log("Delete soil by id => " + soil_id);
  var ref = db.ref('/soil/'+soil_id).remove(function(err){
    if(err)
      res.render('dashboard/error405.ejs', {});
    res.redirect('/soil');
  });
};
