// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require("firebase-admin");
const firebase = require('firebase');
var serviceAccount = require("../../keys/smart-irrigation-system-191707-firebase-adminsdk-c7t3e-a8a06b3f35.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://smart-irrigation-system-191707.firebaseio.com",
  authDomain: "smart-irrigation-system-191707.firebaseapp.com"
});

// Initialize Firebase
var config = {
  apiKey: "AIzaSyC65bubvLtPfHpJAab4FO102ChQBY3CrJc",
  authDomain: "smart-irrigation-system-191707.firebaseapp.com",
  databaseURL: "https://smart-irrigation-system-191707.firebaseio.com",
  projectId: "smart-irrigation-system-191707",
  storageBucket: "smart-irrigation-system-191707.appspot.com",
  messagingSenderId: "973156090960"
};
firebase.initializeApp(config);
