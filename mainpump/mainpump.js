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

var getMainpumpValue = function(mainpump_id, field, callback)
{
  var ref = db.ref('/mainpump/' + mainpump_id);
  ref.once('value', function(snapshot1) {
    var mainpumpObj = JSON.parse(JSON.stringify(snapshot1));
    var f = {};
    if(mainpumpObj.activated == 'true')
    {
      switch(field)
      {
        case 1:
          f.mainpump_value = mainpumpObj.field1;
          console.log("get mainpump[" + mainpump_id + "] @field1 = ", f);
          break;
        case 2:
          f.mainpump_value = mainpumpObj.field2;
          console.log("get mainpump[" + mainpump_id + "] @field2 = ", f);
          break;
        case 3:
          f.mainpump_value = mainpumpObj.field3;
          console.log("get mainpump[" + mainpump_id + "] @field3 = ", f);
          break;
        case 4:
          f.mainpump_value = mainpumpObj.field4;
          console.log("get mainpump[" + mainpump_id + "] @field4 = ", f);
          break;
        case 5:
          f.mainpump_value = mainpumpObj.field5;
          console.log("get mainpump[" + mainpump_id + "] @field5 = ", f);
          break;
        case 6:
          f.mainpump_value = mainpumpObj.field6;
          console.log("get mainpump[" + mainpump_id + "] @field6 = ", f);
          break;
        case 7:
          f.mainpump_value = mainpumpObj.field7;
          console.log("get mainpump[" + mainpump_id + "] @field7 = ", f);
          break;
        case 8:
          f.mainpump_value = mainpumpObj.field8;
          console.log("get mainpump[" + mainpump_id + "] @field8 = ", f);
          break;
      }
      f.created_at = mainpumpObj.created_at;
      f.mainpump_id = mainpump_id;
      callback(null, f);
    }
    else {
      f.mainpump_value = -1;
      f.mainpump_id = mainpump_id;
      console.log("could not get mainpump[" + mainpump_id + "]... mainpump is not activated!!!!!!!!");
      callback(-1, null);
    }
  });
}

module.exports.getMainpumpValue = getMainpumpValue;
