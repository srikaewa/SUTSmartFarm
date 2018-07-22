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

var getValveValue = function(valve_id, field, callback)
{
  var ref = db.ref('/valve/' + valve_id);
  ref.once('value', function(snapshot1) {
    var valveObj = JSON.parse(JSON.stringify(snapshot1));
    var f = {};
    if(valveObj.activated == 'true')
    {
      switch(field)
      {
        case 1:
          f.valve_value = valveObj.field1;
          console.log("get valve[" + valve_id + "] @field1 = ", f);
          break;
        case 2:
          f.valve_value = valveObj.field2;
          console.log("get valve[" + valve_id + "] @field2 = ", f);
          break;
        case 3:
          f.valve_value = valveObj.field3;
          console.log("get valve[" + valve_id + "] @field3 = ", f);
          break;
        case 4:
          f.valve_value = valveObj.field4;
          console.log("get valve[" + valve_id + "] @field4 = ", f);
          break;
        case 5:
          f.valve_value = valveObj.field5;
          console.log("get valve[" + valve_id + "] @field5 = ", f);
          break;
        case 6:
          f.valve_value = valveObj.field6;
          console.log("get valve[" + valve_id + "] @field6 = ", f);
          break;
        case 7:
          f.valve_value = valveObj.field7;
          console.log("get valve[" + valve_id + "] @field7 = ", f);
          break;
        case 8:
          f.valve_value = valveObj.field8;
          console.log("get valve[" + valve_id + "] @field8 = ", f);
          break;
      }
      f.created_at = valveObj.created_at;
      f.valve_id = valve_id;
      callback(null, f);
    }
    else {
      f.valve_value = -1;
      f.valve_id = valve_id;
      console.log("could not get valve[" + valve_id + "]... valve is not activated!!!!!!!!");
      callback(-1, null);
    }
  });
}

module.exports.getValveValue = getValveValue;
