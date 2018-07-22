'use strict';

var async = require('async');
var moment = require('moment');
const uuidv1 = require('uuid/v1');
var admin = require("firebase");
var db = admin.database();

var ThingSpeakClient = require('thingspeakclient');

function snapshotToArray(snapshot) {
    var returnArr = [];

    snapshot.forEach(function(childSnapshot) {
        var item = childSnapshot.val();
        item.id = childSnapshot.key;

        returnArr.push(item);
    });

    return returnArr;
};

exports.list_all_valves = function(req, res){
  var ref = db.ref('/valve');
  ref.once('value', function(snapshot) {
    var obj = snapshotToArray(snapshot);
    //console.log("Valve list => " + JSON.stringify(obj) + " with size of " + obj.length);
    res.render('dashboard/valve/list_valve.ejs', {valves: obj});
  }, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
  });
};

exports.new_valve = function(req, res){
  res.render("dashboard/valve/create_valve.ejs", {moment: moment});
};

exports.create_a_valve = function(req, res){
  var valveClient = new ThingSpeakClient();
  var _now = moment();
  var valve_id = req.body.add_valve_id;
  var valve_description = req.body.add_valve_description;
  var valve_write_api_key = req.body.add_valve_write_api_key;
  //var valve_sampling_time = (req.body.add_valve_sampling_time==null||req.body.add_valve_sampling_time==""? 5 : req.body.add_valve_sampling_time);
  //console.log('valve id = ' + valve_id + ", key = " + valve_write_api_key + ", sampling time = " + valve_sampling_time);
  /*var ref = db.ref('/valve/' + pump_id).set({
    write_api_key: write_api_key
  });*/
    var ref = db.ref('/valve').child(valve_id).set({
      description: valve_description,
      write_api_key: valve_write_api_key,
      //sampling_time: valve_sampling_time,
      activated: 'false',
      entry_id: -1,
      field1: "0",
      field2: "0",
      field3: "0",
      field4: "0",
      field5: "0",
      field6: "0",
      field7: "0",
      field8: "0",
      created_at: _now.format(),
      /*onoff1: "false",
      onoff2: "false",
      onoff3: "false",
      onoff4: "false",
      onoff5: "false",
      onoff6: "false",
      onoff7: "false",
      onoff8: "false", */
      last_datetime_on1: _now.format(),
      last_datetime_on2: _now.format(),
      last_datetime_on3: _now.format(),
      last_datetime_on4: _now.format(),
      last_datetime_on5: _now.format(),
      last_datetime_on6: _now.format(),
      last_datetime_on7: _now.format(),
      last_datetime_on8: _now.format(),
      last_datetime_off1: _now.format(),
      last_datetime_off2: _now.format(),
      last_datetime_off3: _now.format(),
      last_datetime_off4: _now.format(),
      last_datetime_off5: _now.format(),
      last_datetime_off6: _now.format(),
      last_datetime_off7: _now.format(),
      last_datetime_off8: _now.format(),
      time_on1: 0,
      time_on2: 0,
      time_on3: 0,
      time_on4: 0,
      time_on5: 0,
      time_on6: 0,
      time_on7: 0,
      time_on8: 0,
      data_created_at: _now.format(),
      last_updated: _now.format()
    });
  res.redirect('/valve');
};

exports.edit_a_valve = function(req, res){
  var valve_id = req.params.id;
  var ref = db.ref('/valve/' + valve_id);
  ref.once('value', function(snapshot) {
    var obj = JSON.parse(JSON.stringify(snapshot));
    obj.id = valve_id;
    //res.redirect('../farm');
    //console.log("Edit farm[" + farm_id + "].......................................");
    var moment = require('moment');
    res.render('dashboard/valve/edit_valve.ejs', {valve: obj, moment: moment});
  });
};

exports.update_a_valve = function(req, res){
  var valve_id = req.body.edit_valve_id;
  var valve_description = req.body.edit_valve_description;
  var valve_write_api_key = req.body.edit_valve_write_api_key;
  //var valve_sampling_time = req.body.edit_valve_sampling_time;
  //console.log('valve id = ' + valve_id + ", write_api_key = " + valve_write_api_key);
  //const { edit_valve_on_off } = req.body.edit_valve_on_off;
  //console.log('onoff => ' + (req.body.edit_valve_on_off==undefined ? 0 : 1));
  var _now = moment();
  //console.log('Valve updated at => ' + created_at.format());
  var ref = db.ref('/valve').child(valve_id).update({
    description: valve_description,
    write_api_key: valve_write_api_key,
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

exports.show_valve = function(req, res){
  var valve_id = req.params.id;
  var ref = db.ref('/valve/' + valve_id);
  var valveClient = new ThingSpeakClient();
  var async = require('async');

  async.series([
    function(callback){
      valveClient.getLastEntryInChannelFeed(parseInt(valve_id), {}, function(err, resp){
      //var ts_json = JSON.stringify(resp);
      //console.log("Data from valve[" + valve_id + "] => ", resp);
      if(typeof resp !== 'undefined')
      {
        db.ref('/valve').child(valve_id).update(resp);
      /*          last_entry_id: resp.entry_id,
          last_entry_field1: resp.field1,
          last_entry_field2: resp.field2,
          last_entry_field3: resp.field3,
          last_entry_field4: resp.field4,
          last_entry_field5: resp.field5,
          last_entry_field6: resp.field6,
          last_entry_field7: resp.field7,
          last_entry_field8: resp.field8,
          last_entry_created_at: resp.created_at*/
        //);
        callback(null, 1);
        }
      });
    },
    function(callback){
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
      res.render('dashboard/valve/show_valve.ejs', {valve: results[1], moment: moment});
  });
};

exports.delete_a_valve = function(req, res){
  var valve_id = req.body.delete_valve_id;
  console.log("Delete valve => " + valve_id);
  var ref = db.ref('/valve/'+valve_id).remove();
  res.redirect('/valve');
};

exports.delete_a_valve_id = function(req, res){
  var valve_id = req.params.id;
  console.log("Delete valve by id => " + valve_id);
  var ref = db.ref('/valve/'+valve_id).remove(function(err){
    if(err)
      res.render('dashboard/error405.ejs', {});
    res.redirect('/valve');
  });
};

exports.activate_valve = function(req, res){
  var valveClient = new ThingSpeakClient();
  var valve_id = req.params.id;
  var count = 0;
  var ref = db.ref('/valve/'+valve_id);
  ref.once('value', function(snapshot) {
    var valveObj = JSON.parse(JSON.stringify(snapshot));
    ref.update({
      activated: 'true'
    });
    var valveThingspeakIntervalId = setInterval(function(){
        // Attach an asynchronous callback to read the data at our posts reference
        /*ref.on("value", function(snapshot) {
          console.log(snapshot.val());
        }, function (errorObject) {
          console.log("The read failed: " + errorObject.code);
        }); */
        var ref2 = db.ref('/valve/'+valve_id);
        ref2.once('value', function(snapshot) {
          var obj = JSON.parse(JSON.stringify(snapshot));
          console.log("[setInterval] valve activated => " + obj.activated);
          if(obj.activated == 'false')
            {
              count = 0;
              clearInterval(valveThingspeakIntervalId);
            }
          }, function (errorObject) {
            console.log("The read failed: " + errorObject.code);
        });
        count++;
        console.log("Reading feed from thingspeak by => " + valve_id + " with count => " + count);
        valveClient.getLastEntryInChannelFeed(parseInt(valve_id), {}, function(err, resp){
        var ts_json = JSON.stringify(resp);
        //console.log("Data from valve[" + valve_id + "] => " + ts_json);
        if(typeof resp !== 'undefined')
        {
          db.ref('/valve').child(valve_id).update(resp);
  /*          last_entry_id: resp.entry_id,
            last_entry_field1: resp.field1,
            last_entry_field2: resp.field2,
            last_entry_field3: resp.field3,
            last_entry_field4: resp.field4,
            last_entry_field5: resp.field5,
            last_entry_field6: resp.field6,
            last_entry_field7: resp.field7,
            last_entry_field8: resp.field8,
            last_entry_created_at: resp.created_at*/
          //);
          }
        });
      }, valveObj.sampling_time*60000);
    console.log("valve activated => " + valveObj.activated);
    }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
  });
      res.redirect('/valve');
};

exports.deactivate_valve = function(req, res){
  var valve_id = req.params.id;
  var ref = db.ref('/valve/'+valve_id);
  ref.once('value', function(snapshot) {
    var obj = JSON.parse(JSON.stringify(snapshot));
    ref.update({
      activated: 'false'
    });
    console.log("valve activated => " + obj.activated);
    }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
  });
  res.redirect('/valve');
};

exports.turnon_valve = function(req, res){
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
              resp.field1 = "1";
              break;
            case '2':
              resp.field2 = "1";
              break;
            case '3':
              resp.field3 = "1";
              break;
            case '4':
              resp.field4 = "1";
              break;
            case '5':
              resp.field5 = "1";
              break;
            case '6':
              resp.field6 = "1";
              break;
            case '7':
              resp.field7 = "1";
              break;
            case '8':
              resp.field8 = "1";
              break;
          }
          //console.log("Updating valve[" + valve_id + "] with => " + JSON.stringify(resp) + " & key => " + valve_write_api_key);
          valveClient.attachChannel(parseInt(valve_id),{writeKey: valve_write_api_key});
          valveClient.updateChannel(parseInt(valve_id), resp, function(err, resp2){
            if(!err && resp2 > 0)
            {
                console.log("Turning on valve[" + valve_id + "] is done successfully...");
                callback(null, resp);
            }
            else {
              console.log("Turning on valve[" + valve_id + "] failed...");
              //callback(null, 222);
              res.render('dashboard/error405.ejs', {});
            }
          });
        }
        else {
          //res.send("Error with " + JSON.stringify(resp));
          //callback(null, 333);
          res.render('dashboard/error405.ejs', {});
        }
      });
    }
    ,
    function(r, callback){
      var time_now = moment().format();
      switch(valve_field){
        case '1':
          r.last_datetime_on1 = time_now;
          r.field1 = '1';
          break;
        case '2':
          r.last_datetime_on2 = time_now;
          r.field2 = '1';
          break;
        case '3':
          r.last_datetime_on3 = time_now;
          r.field3 = '1';
          break;
        case '4':
          r.last_datetime_on4 = time_now;
          r.field4 = '1';
          break;
        case '5':
          r.last_datetime_on5 = time_now;
          r.field5 = '1';
          break;
        case '6':
          r.last_datetime_on6 = time_now;
          r.field6 = '1';
          break;
        case '7':
          r.last_datetime_on7 = time_now;
          r.field7 = '1';
          break;
        case '8':
          r.last_datetime_on8 = time_now;
          r.field8 = '1';
          break;
      };
      r.last_updated = time_now;
      db.ref('/valve').child(valve_id).update(r,function(err){
        console.log("Update time on valve[" + valve_id + "] field #" + valve_field + " is done successfully...");
        callback(null, 1);
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
  ], function(err, valveObj){
    var moment = require('moment');
    res.render('dashboard/valve/show_valve.ejs', {valve: valveObj, moment: moment});
  });

};

exports.api_turnon_valve = function(req, res){
  var valve_id = req.params.id;
  var valve_write_api_key = req.params.key;
  var valve_field = req.params.field;
  //console.log("Field => " + valve_field);
  var valveClient = new
  ThingSpeakClient();
  var async = require('async');

  async.waterfall([
    function(callback){
      valveClient.getLastEntryInChannelFeed(parseInt(valve_id), {}, function(err, resp){
        //console.log("Reading last entry in channel feed => " + JSON.stringify(resp));
        if(!err && resp.entry_id > 0)
        {
          switch(valve_field){
            case '1':
              resp.field1 = "1";
              break;
            case '2':
              resp.field2 = "1";
              break;
            case '3':
              resp.field3 = "1";
              break;
            case '4':
              resp.field4 = "1";
              break;
            case '5':
              resp.field5 = "1";
              break;
            case '6':
              resp.field6 = "1";
              break;
            case '7':
              resp.field7 = "1";
              break;
            case '8':
              resp.field8 = "1";
              break;
          };
          //console.log("Updating valve[" + valve_id + "] with => " + JSON.stringify(resp) + " & key => " + valve_write_api_key);
          valveClient.attachChannel(parseInt(valve_id),{writeKey: valve_write_api_key});
          valveClient.updateChannel(parseInt(valve_id), resp, function(err, resp2){
            if(!err && resp2 > 0)
            {
              console.log("Turning on valve[" + valve_id + "] field #" + valve_field + " is done successfully...");
              callback(null, resp);
            }
            else {
              console.log("Turning on valve[" + valve_id + "] field #" + valve_field + " failed...");
              //callback("301", "เปิดวาล์ว[" + valve_id + "] field #" + valve_field + " ไม่สำเร็จ!");
              res.send("201");
            }
          });
        }
        else {
          //res.send("Error with " + JSON.stringify(resp));
          //callback("302", "ไม่สามารถติดต่อ ThingSpeak.com!");
          res.send("202");
        }
      });
    },
    function(r, callback){
      var time_now = moment().format();
      switch(valve_field){
        case '1':
          r.last_datetime_on1 = time_now;
          r.field1 = '1';
          break;
        case '2':
          r.last_datetime_on2 = time_now;
          r.field2 = '1';
          break;
        case '3':
          r.last_datetime_on3 = time_now;
          r.field3 = '1';
          break;
        case '4':
          r.last_datetime_on4 = time_now;
          r.field4 = '1';
          break;
        case '5':
          r.last_datetime_on5 = time_now;
          r.field5 = '1';
          break;
        case '6':
          r.last_datetime_on6 = time_now;
          r.field6 = '1';
          break;
        case '7':
          r.last_datetime_on7 = time_now;
          r.field7 = '1';
          break;
        case '8':
          r.last_datetime_on8 = time_now;
          r.field8 = '1';
          break;
      };
      r.last_updated = time_now;
      db.ref('/valve').child(valve_id).update(r,function(err){
        console.log("Update time on valve[" + valve_id + "] field #" + valve_field + " is done successfully...");
        callback(null, "200");
      });
    }
    /*,
    function(callback){
      var ref = db.ref('/valve/' + valve_id);
      ref.once('value', function(snapshot) {
        var obj = JSON.parse(JSON.stringify(snapshot));
        obj.id = valve_id;
        //res.redirect('../farm');
        //console.log("Edit farm[" + farm_id + "].......................................");
        callback(null, obj);
      });
    }*/
  ], function(err, successfull){
    /*switch(err)
    {
      case "301":
        console.log("err => ", results);
        res.send("301");
        break;
      case "302":
        console.log("err => ", results);
        res.send("302");
        break;
    }*/
    if(err)
      res.send("203")
    res.send(successfull);  // turn on valve OK
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
              res.send("201");  // update to ThingSpeak failed
            }
          });
        }
        else {
          //res.send("Error with " + JSON.stringify(resp));
          res.send("202");  // read from ThingSpeak failed
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
        db.ref('/valve').child(valve_id).update(r,function(err){
          if(err)
            res.send("203");  // update Firebase failed
          console.log("Update time off valve[" + valve_id + "] field #" + valve_field + " is done successfully...");
          callback(null, "200");
        });
      });
    }
    /*function(callback){
      var ref = db.ref('/valve/' + valve_id);
      ref.once('value', function(snapshot) {
        var obj = JSON.parse(JSON.stringify(snapshot));
        obj.id = valve_id;
        //res.redirect('../farm');
        //console.log("Edit farm[" + farm_id + "].......................................");
        callback(null, obj);
      });
    }*/
  ], function(err, successfull){
    if(err)
      res.send("204");
    res.send(successfull);
  });
};
