'use strict';

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

exports.list_all_mainpumps = function(req, res){
  var ref = db.ref('/mainpump');
  ref.once('value', function(snapshot) {
    var obj = snapshotToArray(snapshot);
    //console.log("Mainpump list => " + JSON.stringify(obj) + " with size of " + obj.length);
    res.render('dashboard/mainpump/list_mainpump.ejs', {mainpumps: obj});
  }, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
  });
};

exports.new_mainpump = function(req, res){
  res.render("dashboard/mainpump/create_mainpump.ejs", {moment: moment});
}

exports.create_a_mainpump = function(req, res){
  var _now = moment();
  var mainpump_id = uuidv1();
  var mainpump_token = req.body.add_mainpump_token;
  var mainpump_description = req.body.add_mainpump_description;
  var mainpump_pin = req.body.add_mainpump_pin;
  //var mainpump_sampling_time = req.body.add_mainpump_sampling_time;
  /*var ref = db.ref('/mainpump/' + pump_id).set({
    write_api_key: write_api_key
  });*/
    var ref = db.ref('/mainpump').child(mainpump_id).set({
      token: mainpump_token,      
      pin: mainpump_pin,
      description: mainpump_description,
      status: '-',
      //sampling_time: mainpump_sampling_time,
      //activated: 'false',
      last_read: _now.format(),
      created_at: _now.format(),
      data_created_at: _now.format(),
      last_updated: _now.format()
    });
  console.log('Mainpump[' + mainpump_id + "] has been successfully created...");
  res.redirect('/mainpump');
};

exports.edit_a_mainpump = function(req, res){
  var mainpump_id = req.params.id;
  var ref = db.ref('/mainpump/' + mainpump_id);
  ref.once('value', function(snapshot) {
    var obj = JSON.parse(JSON.stringify(snapshot));
    obj.id = mainpump_id;
    //res.redirect('../farm');
    //console.log("Edit farm[" + farm_id + "].......................................");
    var moment = require('moment');
    res.render('dashboard/mainpump/edit_mainpump.ejs', {mainpump: obj, moment: moment});
  });
};

exports.update_a_mainpump = function(req, res){
  var mainpump_id = req.body.edit_mainpump_id;
  var mainpump_description = req.body.edit_mainpump_description;
  var mainpump_pin = req.body.edit_mainpump_pin;
  var _now = moment();
  //var mainpump_sampling_time = req.body.edit_mainpump_sampling_time;
  console.log('Mainpump[' + mainpump_id + "] has been successfully updated...");
  var ref = db.ref('/mainpump').child(mainpump_id).update({
    description: mainpump_description,
    pin: mainpump_pin,
    last_updated: _now.format()
    //sampling_time: mainpump_sampling_time,
    //activated: 'false'
  });
  res.redirect('/mainpump');
};

exports.show_mainpump = function(req, res){
  var mainpump_id = req.params.id;
  var ref = db.ref('/mainpump/' + mainpump_id);
  //var mainpumpClient = new ThingSpeakClient();
  var async = require('async');

  async.waterfall([
    function(callback){
      ref.once('value', function(snapshot) {
        var obj = JSON.parse(JSON.stringify(snapshot));
        obj.id = mainpump_id;
        //res.redirect('../farm');
        //console.log("Edit farm[" + farm_id + "].......................................");
        callback(null, obj);
      });
    },
    function(mainpump, callback){
      //mainpumpClient.getLastEntryInChannelFeed(parseInt(mainpump_id), {}, function(err, resp){
      //var ts_json = JSON.stringify(resp);
      //console.log("Data from mainpump[" + mainpump_id + "] => ", resp);
      if(mainpump.token !== '000000')
      {
        var request = require('request');
        var str = 'http://blynk-cloud.com/' + mainpump.token + '/get/' + mainpump.pin;
        console.log("Sending -> ", str);
        request('http://blynk-cloud.com/' + mainpump.token + '/get/' + mainpump.pin, function (error, response, body) {
              console.log('Status:', response.statusCode);
              console.log('Headers:', JSON.stringify(response.headers));
              var svalue = body.split('"')[1];
              var _now = moment();
              console.log('mainpump status: ', svalue);
              db.ref('/mainpump').child(mainpump.id).update({status: svalue, last_read: _now.format()}, function(err){
                callback(null, svalue);
              });              
              
            });   
      }
      else{
        callback(null, '200');
      }
    },
    function(mainpump_value, callback){
      ref.once('value', function(snapshot) {
        var obj = JSON.parse(JSON.stringify(snapshot));
        obj.id = mainpump_id;
        //res.redirect('../farm');
        //console.log("Edit farm[" + farm_id + "].......................................");
        callback(null, obj);
      });
    }
  ], function(err, results){
      var moment = require('moment');
      res.render('dashboard/mainpump/show_mainpump.ejs', {mainpump: results, moment: moment});
  }); 
};

exports.delete_a_mainpump = function(req, res){
  var mainpump_id = req.body.delete_mainpump_id;
  console.log("Delete mainpump => " + mainpump_id);
  var ref = db.ref('/mainpump/'+mainpump_id).remove();
  res.redirect('../mainpump');
};

exports.delete_a_mainpump_id = function(req, res){
  var mainpump_id = req.params.id;
  console.log("Delete mainpump by id => " + mainpump_id);
  var ref = db.ref('/mainpump/'+mainpump_id).remove(function(err){
    if(err)
      res.render('dashboard/error405.ejs', {});
    res.redirect('/mainpump');
  });
};


exports.activate_mainpump = function(req, res){
  var mainpumpClient = new ThingSpeakClient();
  var mainpump_id = req.params.id;
  var count = 0;
  var ref = db.ref('/mainpump/'+mainpump_id);
  ref.once('value', function(snapshot) {
    var obj = JSON.parse(JSON.stringify(snapshot));
    //mainpump_sampling_time = parseInt(obj.sampling_time)*60000;
    ref.update({
      activated: 'true'
    });
    //console.log("mainpump activated => " + obj.activated + " with sampling time => " + obj.sampling_time + " minutes...");
    var mainpumpThingspeakIntervalId = setInterval(function(){
        // Attach an asynchronous callback to read the data at our posts reference
        /*ref.on("value", function(snapshot) {
          console.log(snapshot.val());
        }, function (errorObject) {
          console.log("The read failed: " + errorObject.code);
        }); */
        var ref2 = db.ref('/mainpump/'+mainpump_id);
        ref2.once('value', function(snapshot) {
          var obj = JSON.parse(JSON.stringify(snapshot));
          console.log("[setInterval] mainpump activated => " + obj.activated);
          if(obj.activated == 'false')
            {
              count = 0;
              console.log("mainpump[" + mainpump_id + "] deactivated.");
              clearInterval(mainpumpThingspeakIntervalId);
              return true;
            }
          }, function (errorObject) {
            console.log("The read failed: " + errorObject.code);
        });
        count++;
        console.log("Reading feed from thingspeak by => " + mainpump_id + " with count => " + count);
        mainpumpClient.getLastEntryInChannelFeed(parseInt(mainpump_id), {}, function(err, resp){
        var ts_json = JSON.stringify(resp);
        console.log("Data from mainpump[" + mainpump_id + "] => " + ts_json);
        if(typeof resp !== 'undefined')
        {
          db.ref('/mainpump').child(mainpump_id).update(resp);
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
        };
        return true;
        });
      }, obj.sampling_time * 60000);
    }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
  });

  res.redirect('../../mainpump');
};

exports.deactivate_mainpump = function(req, res){
  var mainpump_id = req.params.id;
  console.log("Deactivating mainpump[" + mainpump_id + "]...");
  var ref = db.ref('/mainpump/'+mainpump_id);
  ref.once('value', function(snapshot) {
    //var obj = JSON.parse(JSON.stringify(snapshot));
    ref.update({
      activated: 'false'
    });
    }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
  });
  res.redirect('../../mainpump');
};

exports.turnon_mainpump = function(req, res){
  var mainpump_id = req.params.id;
  var mainpump_write_api_key = req.params.key;
  var mainpump_field = req.params.field;
  //console.log("Field => " + mainpump_field);
  var mainpumpClient = new ThingSpeakClient();
  var async = require('async');

  async.series([
    function(callback){
      mainpumpClient.getLastEntryInChannelFeed(parseInt(mainpump_id), {}, function(err, resp){
        //console.log("Reading last entry in channel feed => " + JSON.stringify(resp));
        if(!err && resp.entry_id > 0)
        {
          switch(mainpump_field){
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
          //console.log("Updating mainpump[" + mainpump_id + "] with => " + JSON.stringify(resp) + " & key => " + mainpump_write_api_key);
          mainpumpClient.attachChannel(parseInt(mainpump_id),{writeKey: mainpump_write_api_key});
          mainpumpClient.updateChannel(parseInt(mainpump_id), resp, function(err, resp2){
            if(!err && resp2 > 0)
            {
              resp.last_updated = moment().format();
              db.ref('/mainpump').child(mainpump_id).update(resp,function(err){
              console.log("Turning on mainpump[" + mainpump_id + "] is done successfully...");
              callback(null, 1);
              });
            }
            else {
              console.log("Turning on mainpump[" + mainpump_id + "] with response = " + resp + " -> failed...");
              callback(null, 111);
            }
          });
        }
        else {
          //res.send("Read from ThingSpeak Error with " + JSON.stringify(resp));
          callback(null, 222);
        }
      });
    },
    function(callback){
      var ref = db.ref('/mainpump/' + mainpump_id);
      ref.once('value', function(snapshot) {
        var obj = JSON.parse(JSON.stringify(snapshot));
        obj.id = mainpump_id;
        //res.redirect('../farm');
        //console.log("Edit farm[" + farm_id + "].......................................");
        callback(null, obj);
      });
    }
  ], function(err, results){
    var moment = require('moment');
    res.render('dashboard/mainpump/show_mainpump.ejs', {mainpump: results[1], moment: moment});
  });
};

exports.api_turnon_mainpump = function(req, res){
  var mainpump_id = req.params.id;
  //console.log("Field => " + mainpump_field);
  var async = require('async');

  async.waterfall([
    function(callback){
      var ref = db.ref('/mainpump/' + mainpump_id);
      ref.once('value', function(snapshot) {
        var obj = JSON.parse(JSON.stringify(snapshot));
        obj.id = mainpump_id;
        //res.redirect('../farm');
        //console.log("Edit farm[" + farm_id + "].......................................");
        callback(null, obj);
      });
    },
    function(mainpump, callback){
      var request = require('request');
      console.log("Turning on mainpump[" + mainpump.id + "] with token[" + mainpump.token + "] @Pin[" + mainpump.pin + "]...");
      //console.log("Sending =>" + 'http://blynk-cloud.com/' + mainpump.token + '/update/' + mainpump.pin + "?value=1");
      request('http://blynk-cloud.com/' + mainpump.token + '/update/' + mainpump.pin + "?value=1", function (error, response, body) {
                console.log('Status:', response.statusCode);
                console.log('Headers:', JSON.stringify(response.headers));
                //var svalue = body.split('"')[1];
                //console.log("Reading sensor value => ", svalue);
                //sensor.value = svalue;
                //console.log('V1:', svalue);
                
                if(response.statusCode == '200')
                {
                  db.ref('/mainpump').child(mainpump.id).update({status: '1', last_read: moment().format()});
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

exports.turnoff_mainpump = function(req, res){
  var mainpump_id = req.params.id;
  var mainpump_write_api_key = req.params.key;
  var mainpump_field = req.params.field;
  //console.log("Field => " + mainpump_field);
  var mainpumpClient = new ThingSpeakClient();
  var async = require('async');

  async.series([
    function(callback){
      mainpumpClient.getLastEntryInChannelFeed(parseInt(mainpump_id), {}, function(err, resp){
        //console.log("Reading last entry in channel feed => " + JSON.stringify(resp));
        if(!err && resp.entry_id > 0)
        {
          switch(mainpump_field){
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
          //console.log("Updating mainpump[" + mainpump_id + "] with => " + JSON.stringify(resp) + " & key => " + mainpump_write_api_key);
          mainpumpClient.attachChannel(parseInt(mainpump_id),{writeKey: mainpump_write_api_key});
          mainpumpClient.updateChannel(parseInt(mainpump_id), resp, function(err, resp2){
            if(!err && resp2 > 0)
            {
              resp.last_updated = moment().format();
              db.ref('/mainpump').child(mainpump_id).update(resp,function(err){
              console.log("Turning off mainpump[" + mainpump_id + "] is done successfully...");
              callback(null, 1);
              });
            }
            else {
              console.log("Turning off mainpump[" + mainpump_id + "] with response = " + resp + " -> failed...");
              callback(null, -1);
            }
          });
        }
        else {
          res.render('dashboard/error405.ejs', {});
          callback(null, -2);
        }
      });
    },
    function(callback){
      var ref = db.ref('/mainpump/' + mainpump_id);
      ref.once('value', function(snapshot) {
        var obj = JSON.parse(JSON.stringify(snapshot));
        obj.id = mainpump_id;
        //res.redirect('../farm');
        //console.log("Edit farm[" + farm_id + "].......................................");
        callback(null, obj);
      });
    }
  ], function(err, results){
    var moment = require('moment');
    res.render('dashboard/mainpump/show_mainpump.ejs', {mainpump: results[1], moment: moment});
  });
};

exports.api_turnoff_mainpump = function(req, res){
  var mainpump_id = req.params.id;
  //console.log("Field => " + mainpump_field);
  var async = require('async');

  async.waterfall([
    function(callback){
      var ref = db.ref('/mainpump/' + mainpump_id);
      ref.once('value', function(snapshot) {
        var obj = JSON.parse(JSON.stringify(snapshot));
        obj.id = mainpump_id;
        //res.redirect('../farm');
        //console.log("Edit farm[" + farm_id + "].......................................");
        callback(null, obj);
      });
    },
    function(mainpump, callback){
      var request = require('request');
      console.log("Turning off mainpump[" + mainpump.id + "] with token[" + mainpump.token + "] @Pin[" + mainpump.pin + "]...");
      //console.log("Sending =>" + 'http://blynk-cloud.com/' + mainpump.token + '/update/' + mainpump.pin + "?value=1");
      request('http://blynk-cloud.com/' + mainpump.token + '/update/' + mainpump.pin + "?value=0", function (error, response, body) {
                console.log('Status:', response.statusCode);
                console.log('Headers:', JSON.stringify(response.headers));
                //var svalue = body.split('"')[1];
                //console.log("Reading sensor value => ", svalue);
                //sensor.value = svalue;
                //console.log('V1:', svalue);
                
                if(response.statusCode == '200')
                {
                  db.ref('/mainpump').child(mainpump.id).update({status: '0', last_read: moment().format()});
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


exports.api_set_description = function(req, res){
  var id = req.params.id;
  //console.log("Set sampling time of farm[" + farm_id + "] with value = " + sampling_time + " minutes...");
  var ref = db.ref('/mainpump/').child(id).update({
    description: req.params.value
  }, function(err){
    if(err)
    {
      console.log("Set description of mainpump[" + id + "] with value = " + re.params.value + " ...FAILED!");
      //res.send('{\"code\":\"500\", \"message\":\"ตั้งค่าตรวจสอบเซ็นเซอร์ไม่สำเร็จ\"}');
      res.send("201");
    }
    console.log("Set description of mainpump[" + id + "] with value = " + re.params.value + " ...OK!");
    //res.send('{\"code\":\"200\", \"message\":\"ตั้งค่าตรวจสอบเซ็นเซอร์เรียบร้อย\"}');
    res.send("200");
  });
}
