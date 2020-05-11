// gets players for every schedule

import * as cheerio from 'cheerio';
import * as request from "request-promise-native";

// import * as moment from 'moment';

exports.handler = function(req, res, database){

    const keys = require('./keys/db-keys');
    
	const scheduleRef = database().collection(keys.nbaSchedule);
    const nbaDraftRef = database().collection(keys.nbaDraft);
    const playerParser = require('./parsers/player-parser').playerParser

	//deletePlayers
	nbaDraftRef.get()
	.then(deletePlayers)
    .then(getSchedules)
    .then(readPlayers)
    .then(writePlayers)
	.catch(err => console.log("error writing players: " + err));
	
	function deletePlayers(playerSnapshot){
		playerSnapshot.docs.forEach((doc) => {
			doc.ref.delete();
		})
		return scheduleRef.get();
    }

    function getSchedules(scheduleSnapshot){
        const schedules = [];
            scheduleSnapshot.docs.forEach((doc) => {

                const homeTeam = doc.data();
                const awayTeamForRequest = doc.data()
                awayTeamForRequest.homeTeamStatsUrl = doc.data().awayTeamStatsURL
                awayTeamForRequest.homeTeamAbbr = doc.data().awayTeamAbbr

                schedules.push(homeTeam, awayTeamForRequest)
               
            });  

        return schedules;
    }

    async function readPlayers(schedules){

    const playerPromises = schedules.map(async (schedule, i) => {

        const options = {
          	gzip: true,
          	uri: schedule.homeTeamStatsURL,
          	Connection: 'keep-alive',
          	transform: function(body) {
            	return cheerio.load(body);
          	}
        };

        return { player: await request(options), schedule: schedule }

    });

      const players = await Promise.all(playerPromises);

      return players.reduce((allPlayers : any, response : any) =>{
        response.player('tbody').children('tr').each(function(j, html) {
            allPlayers.push(
                playerParser(response.player(html), response.schedule)
            );
            
        });
        return allPlayers;
    },[])

    }

    function writePlayers(allPlayers){
    allPlayers.forEach(player => {
		console.log("wrote player 1")
        nbaDraftRef.doc(player.playerDBRef)
            .set(player)
            .catch(error => 
                console.error("Error adding document: ", error + " : " + player.playerName)
            );
        });
        res.send("finished");
    }

};

