'use strict';

var moment = require('moment');
const uuidv1 = require('uuid/v1');

var firebase = require('firebase');
//var firebase_config = require('../../scripts/firebase_config');

  // Initialize Firebase
var config = {
  apiKey: "AIzaSyA1ZfV2sGC8Je4gmUTVcYqW1N0yD0vhMaA",
  authDomain: "brr-high-precision-sugarcane.firebaseapp.com",
  databaseURL: "https://brr-high-precision-sugarcane.firebaseio.com",
  projectId: "brr-high-precision-sugarcane",
  storageBucket: "brr-high-precision-sugarcane.appspot.com",
  messagingSenderId: "376848359206"
};
  firebase.initializeApp(config);

var userList = [];

var admin = require("firebase-admin");

var serviceAccount = require("../../keys/swi-high-precision-farm-firebase-adminsdk-ibwdt-cf8c50a22b.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://swi-high-precision-farm.firebaseio.com"
});

function snapshotToArray(snapshot) {
    var returnArr = [];

    snapshot.forEach(function(childSnapshot) {
        var item = childSnapshot.val();
        item.uid = childSnapshot.key;

        returnArr.push(item);
    });

    return returnArr;
};


// Get a reference to the database service
var db = admin.database();

exports.update_user = function(req, res){
  var async = require('async');

  //console.log("Logged in user => "+req.params.displayName);

  async.series([
    function(callback){
      var ref = db.ref('/users/' + req.params.uid);
      //console.log("Try reading user ====> " + ref);
      ref.once('value', function(snapshot){
        var userObj = JSON.parse(JSON.stringify(snapshot));
        //console.log("User snapshot => ", userObj);
        callback(null, userObj);
      });
    }
  ], function(err, results){
    if(results[0] == null)
    {
        var ref = db.ref('/users').child(req.params.uid).set({
          email: req.params.email,
          //photoURL: req.params.photoURL,
          displayName: req.params.displayName,
          created_at: moment().format(),
          activated: true,
          last_updated: moment().format(),
          role: {
            admin: false,
            user: true,
            farmer: false,
            farm_manager: false
          }
        });
    }else {
      var ref = db.ref('/users').child(req.params.uid).update({
        email: req.params.email,
        displayName: req.params.displayName,
        last_logged_in: moment().format(),
        last_updated: moment().format()
      });
    };
    res.render('dashboard/index.ejs',{});
  });


  /*
  ref.once('value', function(snapshot){
    var obj2 = JSON.parse(JSON.stringify(snapshot));


  var ref = db.ref('/users').child(req.params.uid).set({
    email: req.params.email,
    //photoURL: req.params.photoURL,
    displayName: req.params.displayName,
    created_at: moment().format()
  }); */
};

exports.login = function(req, res){
  res.render('login/login.ejs', {});
};

exports.login_email = function(req, res){
  var email = req.body.username;
  var password = req.body.password;
  // Initialize Firebase

};

exports.login_google = function(req, res){

};

exports.list_all_users = function(req, res){

  function listAllUsers(nextPageToken) {
   // List batch of users, 1000 at a time.
     admin.auth().listUsers(1000, nextPageToken)
       .then(function(listUsersResult) {
         //console.log("listUsersResult2 length => ", Object.keys(listUsersResult).length);
         /*userList.length = 0;
         listUsersResult.users.forEach(function(userRecord) {
           userList.push({
             uid : userRecord.uid,
             email : userRecord.email,
             displayName : userRecord.displayName,
             photoURL : userRecord.photoURL
           });*/
           //console.log("User list ... " + userList.length);
         //});
           //console.log("user added => ", userList[userList.length - 1]);
           //res.status(200).send("Number of user => ", Object.keys(listUsersResult).length);

         if (listUsersResult.pageToken) {
           // List next batch of users.
           console.log("user", listUsersResult.users);
           res.render('dashboard/user/list_user.ejs',{users: listUsersResult.users});
           listAllUsers(listUsersResult.pageToken);
           //console.log("listUsersResult3 length => ", Object.keys(listUsersResult).length);
         }
         //resolve(Object.keys(listUsersResult).length);
       })
       .catch(function(error) {
         console.log("Error listing users:", error);
         //reject(Object.keys(listUsersResult).length);
       });
   };

  listAllUsers();
};

exports.list_all_users_2 = function(req, res){
  var ref = db.ref('/users');
  //console.log("Try reading user ====> " + ref);
  ref.once('value', function(snapshot){
    var userObj = snapshotToArray(snapshot);
    //console.log("User snapshot => ", userObj);
    //res.send("200");
    res.render('dashboard/user/list_user.ejs',{users: userObj});
  });
}

exports.create_a_user = function(req, res){

};

exports.show_a_user = function(req, res){
  var uid = req.params.uid;
  var ref = db.ref('/users/' + uid);
  ref.once('value', function(snapshot) {
    var obj = JSON.parse(JSON.stringify(snapshot));
    obj.uid = uid;
    var moment = require('moment');
    res.render('dashboard/user/show_user.ejs', {user: obj, moment: moment});
  });
}

exports.api_delete_a_user = function(req, res){
  var uid = req.params.uid;
  var ref = db.ref('/users/'+ uid).remove(function(err){
    if(err)
    {
      console.log("Deleting user " + uid + "...FAILED!");
      res.send("201");
    }
    console.log("Deleting user " + uid + "...OK");
    res.send('200');
  });
};

exports.edit_a_user = function(req, res){
  var uid = req.params.uid;
  var ref = db.ref('/users/' + uid);
  ref.once('value', function(snapshot) {
    var obj = JSON.parse(JSON.stringify(snapshot));
    obj.uid = uid;
    var moment = require('moment');
    res.render('dashboard/user/edit_user.ejs', {user: obj, moment: moment});
  });
}

exports.update_a_user = function(req, res){
  var uid = req.params.uid;
  //console.log(uid + " ====> ", Boolean(req.body.edit_user_activated));
  var ref = db.ref('/users').child(uid).update({
    activated: Boolean(req.body.edit_user_activated),
    role: {
      admin: Boolean(req.body.edit_user_admin),
      farm_manager: Boolean(req.body.edit_user_farm_manager),
      farmer: Boolean(req.body.edit_user_farmer)
    },
    last_updated: moment().format()
  });
  res.redirect('/user/show/' + uid);
};