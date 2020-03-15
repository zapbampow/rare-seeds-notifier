
require('dotenv').config();
var firebase = require('firebase/app');
require('firebase/database');

const apiKey = process.env.FIREBASE_API_KEY;
const authDomain = process.env.FIREBASE_AUTH_URL;
const databaseURL = process.env.FIREBASE_DATABASE_URL;

var firebaseConfig = {
  apiKey,
  authDomain,
  databaseURL
};

firebase.initializeApp(firebaseConfig);
var database = firebase.database();

// GET MESSAGE SENT STATE
async function messageAlreadySent() {
  let value = await database.ref('/product-availability/messageAlreadySent').once('value')
  .then(function(snapshot) {
    console.log('snapshot', snapshot.val())
    return snapshot.val();
  })
  .catch(function(err) {
    console.log('err', err);
  })
  return value;
}

// CHANGE MESSAGE SENT STATE
function updateSentState(bool) {
  database.ref('product-availability/messageAlreadySent').set(true);
}

// LOG ATTEMPT
function logAttempt() {
  let date = new Date();
  database.ref('product-availability/lastAttempt').set(date.toString(), function(error) {
    if(error) {
      console.log('log attempt error', error);
       process.exit(1);
    } else {
      process.exit(1);
    }
  });
 
}

exports.updateSentState = updateSentState;
exports.messageAlreadySent = messageAlreadySent;
exports.logAttempt = logAttempt;