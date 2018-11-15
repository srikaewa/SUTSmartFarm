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



exports.update_a_valve = function(req, res){
  var valve_id = req.body.edit_valve_id;
  var valve_description = req.body.edit_valve_description;
  var valve_token = req.body.edit_valve_token;
  var valve_pin = req.body.edit_valve_pin;
  //var valve_sampling_time = req.body.edit_valve_sampling_time;
  //console.log('valve id = ' + valve_id + ", write_api_key = " + valve_write_api_key);
  //const { edit_valve_on_off } = req.body.edit_valve_on_off;
  //console.log('onoff => ' + (req.body.edit_valve_on_off==undefined ? 0 : 1));
  var _now = moment();
  //console.log('Valve updated at => ' + created_at.format());
  var ref = db.ref('/valve').child(valve_id).update({
    description: valve_description,
    token: valve_token,
    pin: valve_pin,
    //sampling_time: valve_sampling_time,
    //activated: valve
    /*onoff1: (req.body.edit_valve_on_off1==undefined ? 'false' : 'true'),
    onoff2: (req.body.edit_valve_on_off2==undefined ? 'false' : 'true'),
    onoff3: (req.body.edit_valve_on_off3==undefined ? 'false' : 'true'),
    onoff4: (req.body.edit_valve_on_off4==undefined ? 'false' : 'true'),
    onoff5: (req.body.edit_valve_on_off5==undefined ? 'false' : 'true'),
    onoff6: (req.body.edit_valve_on_off6==undefined ? 'false' : 'true'),
    onoff7: (req.body.edit_valve_on_off7==undefined ? 'false' : 'true'),
    onoff8: (req.body.edit_valve_on_off8==undefined ? 'false' : 'true'),*/
    last_updated: _now.format()
  });
  res.redirect('/valve');
};

exports.api_turnon_valve = function(req, res){
  var valve_id = req.params.id;
  //console.log("Field => " + valve_field);
  var async = require('async');

  async.waterfall([
    function(callback){
      var ref = db.ref('/valve/' + valve_id);
      ref.once('value', function(snapshot) {
        var obj = JSON.parse(JSON.stringify(snapshot));
        obj.id = valve_id;
        //res.redirect('../farm');
        //console.log("Edit farm[" + farm_id + "].......................................");
        callback(null, obj);
      });
    },
    function(valve, callback){
      var request = require('request');
      console.log("Turning on valve[" + valve.id + "] with token[" + valve.token + "] @Pin[" + valve.pin + "]...");
      //console.log("Sending =>" + 'http://blynk-cloud.com/' + valve.token + '/update/' + valve.pin + "?value=1");
      request('http://blynk-cloud.com/' + valve.token + '/update/' + valve.pin + "?value=1", function (error, response, body) {
                //console.log('Status:', response.statusCode);
                //console.log('Headers:', JSON.stringify(response.headers));
                //var svalue = body.split('"')[1];
                //console.log("Reading sensor value => ", svalue);
                //sensor.value = svalue;
                //console.log('V1:', svalue);
                
                if(response.statusCode == '200')
                {
                  var _now = moment().format();                  
                  db.ref('/valve').child(valve.id).update({status: '1', last_read: _now, last_datetime_on: _now});
                  callback(null, '200');              
                }
                else
                {

                  callback(null, '201');
                }
                
              });    
    }
  ], function(err, results){
    if(err)
      res.send("202")
    res.send("200");
  });
};

var getValveOnTime = function(startTime, stopTime){
    // parse time using 24-hour clock and use UTC to prevent DST issues
    // "2018-06-06T13:52:30+07:00"
  //console.log("Before start time => ", startTime);
  //var s = moment(startTime, "YYYY-MM-DDTHH:mm:ssZ");
  var start = moment(startTime);
  //start.subtract(2, 'hour');
  //console.log("Start time => ", start.format());
  var end = moment(stopTime);
  //console.log("End time => ", end.format());

  // account for crossing over to midnight the next day
  //if (end.isBefore(startTime)) end.add(1, 'day');

  // calculate the duration
  var m = end.diff(start, 'minutes');
  //var h = end.diff(startTime, 'hours');
  //console.log("Duration => " + m + ", " + h);

  // subtract the lunch break
  //d.subtract(30, 'minutes');

  // format a string result
  //return moment.utc(+d).format('H:mm');
  return m;
}

exports.api_reset_timer = function(req, res){
  var valve_id = req.params.id;
  var valve_field = req.params.field;
  var resp = {};
  switch(valve_field)
  {
    case '1':
      resp.time_on1 = 0;
      break;
    case '2':
      resp.time_on2 = 0;
      break;
    case '3':
      resp.time_on3 = 0;
      break;
    case '4':
      resp.time_on4 = 0;
      break;
    case '5':
      resp.time_on5 = 0;
      break;
    case '6':
      resp.time_on6 = 0;
      break;
    case '7':
      resp.time_on7 = 0;
      break;
    case '8':
      resp.time_on8 = 0;
      break;
  }
  //console.log("resp => ", resp);
  resp.last_updated = moment().format();
  db.ref('/valve').child(valve_id).update(resp,function(err){
    if(err)
      res.send("201");
    console.log("Reset valve[" + valve_id + "] #" + valve_field + " timer...OK");
    res.send("200");
  });
}

exports.turnoff_valve = function(req, res){
  var valve_id = req.params.id;
  var valve_write_api_key = req.params.key;
  var valve_field = req.params.field;
  //console.log("Field => " + valve_field);
  var valveClient = new ThingSpeakClient();
  var async = require('async');

  async.waterfall([
    function(callback){
      valveClient.getLastEntryInChannelFeed(parseInt(valve_id), {}, function(err, resp){
        //console.log("Reading last entry in channel feed => " + JSON.stringify(resp));
        if(!err && resp.entry_id > 0)
        {
          switch(valve_field){
            case '1':
              resp.field1 = "-1";
              break;
            case '2':
              resp.field2 = "-1";
              break;
            case '3':
              resp.field3 = "-1";
              break;
            case '4':
              resp.field4 = "-1";
              break;
            case '5':
              resp.field5 = "-1";
              break;
            case '6':
              resp.field6 = "-1";
              break;
            case '7':
              resp.field7 = "-1";
              break;
            case '8':
              resp.field8 = "-1";
              break;
          }
          //console.log("Updating valve[" + valve_id + "] with => " + JSON.stringify(resp) + " & key => " + valve_write_api_key);
          valveClient.attachChannel(parseInt(valve_id),{writeKey: valve_write_api_key});
          valveClient.updateChannel(parseInt(valve_id), resp, function(err, resp2){
            if(!err && resp2 > 0)
            {
              console.log("Turning off valve[" + valve_id + "] field #" + valve_field + " is done successfully...");
                callback(null, resp);
              //console.log("resp => ", resp);
            }
            else {
              console.log("Turning off valve[" + valve_id + "] field #" + valve_field + " failed...");
              res.render('dashboard/error405.ejs', {});
            }
          });
        }
        else {
          //res.send("Error with " + JSON.stringify(resp));
          res.render('dashboard/error405.ejs', {});
        }
      });
    },
    function(rr, callback){
      var ref = db.ref('/valve/' + valve_id);
      ref.once('value', function(snapshot) {
        var obj = JSON.parse(JSON.stringify(snapshot));
        var time_now = moment().format();
        var r = {};
        switch(valve_field){
          case '1':
            r.last_datetime_off1 = time_now;
            r.time_on1 = obj.time_on1 + getValveOnTime(obj.last_datetime_on1, time_now);
            r.field1 = rr.field1;
            break;
          case '2':
            r.last_datetime_off2 = time_now;
            r.time_on2 = obj.time_on2 + getValveOnTime(obj.last_datetime_on2, time_now);
            r.field2 = rr.field2;
            break;
          case '3':
            r.last_datetime_off3 = time_now;
            r.time_on3 = obj.time_on3 + getValveOnTime(obj.last_datetime_on3, time_now);
            r.field3 = rr.field3;
            break;
          case '4':
            r.last_datetime_off4 = time_now;
            r.time_on4 = obj.time_on4 + getValveOnTime(obj.last_datetime_on4, time_now);
            r.field4 = rr.field4;
            break;
          case '5':
            r.last_datetime_off5 = time_now;
            r.time_on5 = obj.time_on5 + getValveOnTime(obj.last_datetime_on5, time_now);
            r.field5 = rr.field5;
            break;
          case '6':
            r.last_datetime_off6 = time_now;
            r.time_on6 = obj.time_on6 + getValveOnTime(obj.last_datetime_on6, time_now);
            r.field6 = rr.field6;
            break;
          case '7':
            r.last_datetime_off7 = time_now;
            r.time_on7 = obj.time_on7 + getValveOnTime(obj.last_datetime_on7, time_now);
            r.field7 = rr.field7;
            break;
          case '8':
            r.last_datetime_off8 = time_now;
            r.time_on8 = obj.time_on8 + getValveOnTime(obj.last_datetime_on8, time_now);
            r.field8 = rr.field8;
            break;
        };
        r.last_updated = time_now;
        db.ref('/valve').child(valve_id).update(r, function(err){
          console.log("Update time off valve[" + valve_id + "] field #" + valve_field + " is done successfully...");
          callback(null, 2);
        });
      });
    },
    function(s, callback){
      var ref = db.ref('/valve/' + valve_id);
      ref.once('value', function(snapshot) {
        var obj = JSON.parse(JSON.stringify(snapshot));
        obj.id = valve_id;
        //res.redirect('../farm');
        //console.log("Edit farm[" + farm_id + "].......................................");
        callback(null, obj);
      });
    }
  ], function(err, results){
    var moment = require('moment');
    res.render('dashboard/valve/show_valve.ejs', {valve: results, moment: moment});
    //res.send({valve: results, moment: moment});
  });
};

exports.api_turnoff_valve = function(req, res){
  var valve_id = req.params.id;
  //console.log("Field => " + valve_field);
  var async = require('async');

  async.waterfall([
    function(callback){
      var ref = db.ref('/valve/' + valve_id);
      ref.once('value', function(snapshot) {
        var obj = JSON.parse(JSON.stringify(snapshot));
        obj.id = valve_id;
        //res.redirect('../farm');
        //console.log("Edit farm[" + farm_id + "].......................................");
        callback(null, obj);
      });
    },
    function(valve, callback){
      var request = require('request');
      console.log("Turning off valve[" + valve.id + "] with token[" + valve.token + "] @Pin[" + valve.pin + "]...");
      //console.log("Sending =>" + 'http://blynk-cloud.com/' + valve.token + '/update/' + valve.pin + "?value=1");
      request('http://blynk-cloud.com/' + valve.token + '/update/' + valve.pin + "?value=0", function (error, response, body) {
                //console.log('Status:', response.statusCode);
                //console.log('Headers:', JSON.stringify(response.headers));
                //var svalue = body.split('"')[1];
                //console.log("Reading sensor value => ", svalue);
                //sensor.value = svalue;
                //console.log('V1:', svalue);
                
                if(response.statusCode == '200')
                {
                  var _now = moment().format();
                  var timeon = valve.time_on + getValveOnTime(valve.last_datetime_on, _now);
                  db.ref('/valve').child(valve.id).update({status: '0', last_read: _now, last_datetime_off: _now, time_on: timeon});
                  callback(null, '200');              
                }
                else
                {
                  
                  callback(null, '201');
                }
                
              });    
    }
  ], function(err, results){
    if(err)
      res.send("202")
    res.send("200");
  });
};
