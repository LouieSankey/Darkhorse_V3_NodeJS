import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp(functions.config().firebase);

export const database = admin.firestore;

const getSchedule = require('./get-schedule');
const getPlayers = require('./get-players');
const getPlayerLogs = require('./get-player-logs');


exports.getSchedule = functions.runWith({memory: '2GB',timeoutSeconds: 300}).https.onRequest((req, res) => {
    getSchedule.handler(req, res, database);
});

exports.getPlayers = functions.runWith({memory: '2GB',timeoutSeconds: 300}).https.onRequest((req, res) => {
    getPlayers.handler(req, res, database);
});

exports.getPlayerLogs = functions.runWith({memory: '2GB',timeoutSeconds: 300}).https.onRequest((req, res) => {
    getPlayerLogs.handler(req, res, database);
});



