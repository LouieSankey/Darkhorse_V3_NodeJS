

import * as cheerio from 'cheerio';
import * as request from "request-promise-native";

exports.handler = function(req, res, database){

    const keys = require('./keys/db-keys');
    const nbaDraftRef = database().collection(keys.nbaDraft);
    const playerLogsParser = require('./parsers/player-logs-parser').playerLogsParser

    nbaDraftRef.get()
    .then(getPlayerUrls)
    .then(readPlayerLogs)
    .then(writePlayerLogs)
    .catch(err => console.log("error writing schedule: " + err));

    function getPlayerUrls(snapshot){

        const playerLogUrls = []
        snapshot.docs.forEach((doc) => {
            const player = doc.data();
            const playerLogsUrl = player.playerLogsUrl;
            playerLogUrls.push(playerLogsUrl);

        });

        return playerLogUrls
    }

   
    async function readPlayerLogs(logUrls){

        const Promise = require("bluebird");
        
        const logPromises = Promise.map(logUrls, async (logUrl, index, length) => {
            const options = {
                gzip: true,
                uri: logUrl,
                Connection: 'keep-alive',
                transform: function(body) {
                  return cheerio.load(body);
                }
          };    
            return {logsObject: await request(options), logUrl: logUrl};
        },
        {
            concurrency: 4
        });

        return await Promise.all(logPromises);

    }

   function writePlayerLogs(promises){

        promises.forEach(response => {

            const playerNameSplit = response.logUrl.split('/')
            const playerRef = playerNameSplit[9];
        
            const player = playerLogsParser(response.logsObject)
            const logs = player.logs
            const imgSrc = player.imgSrc

            nbaDraftRef.doc(playerRef)
            .update({
                'logs': logs,
                'imgSrc': imgSrc
            })
        }); 

        res.send('got player logs and photo');
    }

}