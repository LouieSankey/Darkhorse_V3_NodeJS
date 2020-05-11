
import * as cheerio from 'cheerio';
import * as request from "request-promise-native";
import * as moment from 'moment';

exports.handler = function(req, res, database){

    const keys = require('./keys/db-keys');
    const timeKeys = require('./keys/time-keys');

    const scheduleRef = database().collection(keys.nbaSchedule);

        scheduleRef.get()
        .then(deleteSchedule)
        .then(readSchedule)
        .then(writeSchedule)
        .catch(err => console.log("error writing schedule: " + err));
       
        function deleteSchedule(scheduleSnapshot){
                scheduleSnapshot.docs.forEach((doc) => {
                    doc.ref.delete();
                })
        } 

        const scheduleParser = require('./parsers/schedule-parser').scheduleParser
        async function readSchedule(){

            const scheduledGames = [];
            const options = {
                uri: 'https://www.cbssports.com/nba/schedule/' + timeKeys.urlDate,
                Connection: 'keep-alive',
                transform: function (body) {
                    return cheerio.load(body);
                }
            };
    
            await request(options)
            .then(($) => {

                $('tbody').children('tr').each((i, element) => {

                    console.log($(element).children('td').eq(1).find('a').attr('href'));

                    const params = {
                        html: $(element),
                        database: database,
                        urlDate: timeKeys.urlDate,
                        moment: moment
                    }

                    const schedule = scheduleParser(params);
                    scheduledGames.push(schedule);
            });
        })
        .catch((err) => console.log("error reading schedule: " + err));

        return scheduledGames;
        }
 
        function writeSchedule(scheduledGames){
            scheduledGames.forEach((game, index) => {
                scheduleRef.doc(game.urlString).set(game)
                .catch(function(error){
                    console.log(error);
                    res.status(500).send(error);
                });
            })

            res.send('updated schedule');
       
        } 

};
