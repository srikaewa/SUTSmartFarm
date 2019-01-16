var math = require('mathjs');
var moment = require('moment');

var admin = require("firebase-admin");

function snapshotToArray(snapshot) {
    var returnArr = [];

    snapshot.forEach(function(childSnapshot) {
        var item = childSnapshot.val();
        item.id = childSnapshot.key;

        returnArr.push(item);
    });

    return returnArr;
};

// Get a reference to the database service
var db = admin.database();

var getSensorValue = function(sensor_id, field, callback)
{
  var ref = db.ref('/sensor/' + sensor_id);
  ref.once('value', function(snapshot1) {
    var sensorObj = JSON.parse(JSON.stringify(snapshot1));
    var f = {};
    if(sensorObj.activated == 'true')
    {
      switch(field)
      {
        case 1:
          f.sensor_value = sensorObj.field1;
          console.log("get sensor[" + sensor_id + "] @field1 = ", f);
          break;
        case 2:
          f.sensor_value = sensorObj.field2;
          console.log("get sensor[" + sensor_id + "] @field2 = ", f);
          break;
        case 3:
          f.sensor_value = sensorObj.field3;
          console.log("get sensor[" + sensor_id + "] @field3 = ", f);
          break;
        case 4:
          f.sensor_value = sensorObj.field4;
          console.log("get sensor[" + sensor_id + "] @field4 = ", f);
          break;
        case 5:
          f.sensor_value = sensorObj.field5;
          console.log("get sensor[" + sensor_id + "] @field5 = ", f);
          break;
        case 6:
          f.sensor_value = sensorObj.field6;
          console.log("get sensor[" + sensor_id + "] @field6 = ", f);
          break;
        case 7:
          f.sensor_value = sensorObj.field7;
          console.log("get sensor[" + sensor_id + "] @field7 = ", f);
          break;
        case 8:
          f.sensor_value = sensorObj.field8;
          console.log("get sensor[" + sensor_id + "] @field8 = ", f);
          break;
      }
      f.created_at = sensorObj.created_at;
      callback(null, f);
    }
    else {
      f.sensor_value = -1;
      console.log("could not get sensor[" + sensor_id + "]... sensor is not activated!!!!!!!!");
      callback(-1, null);
    }
  });
}

module.exports.getSensorValue = getSensorValue;
