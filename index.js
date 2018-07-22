
//const functions = require('firebase-functions');
const express = require('express');
const bodyParser = require('body-parser');


// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

const app = express();

//var ThingSpeakClient = require('thingspeakclient');
//var client = new ThingSpeakClient();

var path = require('path');

//global.appRoot = path.resolve(__dirname);
//app.use(express.static(dir);
//app.use('/js',express.static(path.join(__dirname, './js')));
//console.log("home directory => ", __dirname);
app.use('/_scripts',express.static(path.join(__dirname,'/scripts')))
app.use('/_dashboard',express.static(path.join(__dirname,'/views/dashboard')))
app.use('/_js',express.static(path.join(__dirname,'/views/dashboard/js')));
app.use('/_css',express.static(path.join(__dirname,'/views/dashboard/css')));
app.use('/_img',express.static(path.join(__dirname,'/views/dashboard/img')));
app.use('/_font-awesome',express.static(path.join(__dirname,'/views/dashboard/font-awesome')));
app.use('/_welcome',express.static(path.join(__dirname,'/views/login/welcome')));


// set the view engine to ejs
app.set('view engine', 'ejs');
// get data from thingspeak and write to database
/*app.get('/dashboard', (req, res) => {
  res.render('dashboard/index.ejs')
});
app.get('/login', (req, res) => {
  res.render('login.ejs');
}); */

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

require('./api/routes/userRoutes')(app);
require('./api/routes/homeRoutes')(app);
require('./api/routes/farmDetailRoutes')(app); //importing route
require('./api/routes/soilRoutes')(app);
require('./api/routes/mainpumpRoutes')(app);
require('./api/routes/valveRoutes')(app);
require('./api/routes/sensorRoutes')(app);
require('./api/routes/plantRoutes')(app);

//setInterval(function(){
  // Attach an asynchronous callback to read the data at our posts reference
  /*ref.on("value", function(snapshot) {
    console.log(snapshot.val());
  }, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
  }); */

  //client.getLastEntryInChannelFeed(406519, {}, function(err, resp){
  //    console.log(resp);
  //});
//}, 20000);



//exports.app = functions.https.onRequest(app);
//app.listen(8080);
var port = process.env.PORT || 3000;
var server = app.listen(port, function() {
  console.log('Smart Irrigation System server listening on port ' + port);
});
//console.log('Smart Irrigation System is up and running...');
