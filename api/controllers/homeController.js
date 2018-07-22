'use strict';

var admin = require("firebase");
var firebase_config = require("../../scripts/firebase_config");
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

exports.dashboard = function(req, res) {
  var ref = db.ref('/farm');
  ref.once('value', function(snapshot) {
    var obj = snapshotToArray(snapshot);
    //console.log("Mainpump list => " + JSON.stringify(obj) + " with size of " + obj.length);
    //console.log("farms..............", obj);
    var moment = require('moment');
    //console.log("Firebase config ===> ", firebase_config);
    res.render('dashboard/index.ejs', {farms: obj, moment: moment, firebase_config: firebase_config});
  }, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
    res.render('dashboard/error405.ejs', {});
  });
};

exports.welcome = function(req, res){
  res.render('login/welcome/index.ejs', {});
}
