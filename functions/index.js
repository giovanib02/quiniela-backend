// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

const setGroupFile=require("./endpoints/setGroup.js");
// Take the text parameter passed to this HTTP endpoint and insert it into the
// Realtime Database under the path /messages/:pushId/original
exports.addMessage = functions.https.onRequest((req, res) => {
  // Grab the text parameter.
  const original = req.query.text;
  // Push the new message into the Realtime Database using the Firebase Admin SDK.
  return admin.database().ref('/messages').push({original: original}).then((snapshot) => {
    // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
    return res.redirect(303, snapshot.ref);
  });
});

// Listens for new messages added to /messages/:pushId/original and creates an
// uppercase version of the message to /messages/:pushId/uppercase
exports.makeUppercase = functions.database.ref('/messages/{pushId}/original').onWrite((event) => {
  // Grab the current value of what was written to the Realtime Database.
  const original = event.data.val();
  console.log('Uppercasing', event.params.pushId, original);
  const uppercase = original.toUpperCase();
  // You must return a Promise when performing asynchronous tasks inside a Functions such as
  // writing to the Firebase Realtime Database.
  // Setting an "uppercase" sibling in the Realtime Database returns a Promise.
  return event.data.ref.parent.child('uppercase').set(uppercase);
});

exports.setMatch = functions.https.onRequest((req, res) => {
    // Grab the text parameter.
    var local=req.query.local;
    var visit=req.query.visit;
    var firstGoal=req.query.firstGoal;
    var localGoals=req.query.localGoals;
    var visitGoals=req.query.visitGoals;
    var competition=req.query.competition;
    return admin.database().ref('/matches').push({local: local, 
                                                    visit: visit, 
                                                    firstGoal: firstGoal, 
                                                    localGoals: localGoals, 
                                                    visitGoals: visitGoals,
                                                    competition:competition}).then((snapshot) => {
    
      res.set('Content-Type', 'application/json');
      return res.send("[{\"successful\": true}]");
    });
    
  });

  exports.setGroup = functions.https.onRequest((req, res) => {
    // Grab the text parameter.
    var userId=req.query.userId;
    var groupName=req.query.groupName;
    var tournamentId=req.query.tournamentId;
   
    setGroupFile.setGroup(req,res,admin,userId,groupName,tournamentId);

  });
