const scheduleParser = function(params){

    const html = params.html;
    const database = params.database;
    const urlDate = params.urlDate;
    const moment = params.moment;

    const homeTeamStatsURL = html.children('td').eq(1).find('a').attr('href');
    const awayTeamStatsURL = html.children('td').eq(0).find('a').attr('href');
    const gameTime = html.children('td').eq(2).find('a').text();
    const start = moment(gameTime, 'h:mm a').subtract(3, 'hours');
    const date = database.Timestamp.fromDate(start.clone().add(8, "hours").toDate());
    const homeTeamAbbr = homeTeamStatsURL.split('/')[3];
    const awayTeamAbbr = awayTeamStatsURL.split('/')[3];
    const matchupString =  awayTeamAbbr + "@" + homeTeamAbbr;
    const URLString = "NBA_" + urlDate + "_" + matchupString;
    const boxScoreURL = "www.cbssports.com/nba/gametracker/boxscore/" + URLString;

    const game = {
        homeTeamAbbr: homeTeamAbbr,
        awayTeamAbbr: awayTeamAbbr,
        homeTeamStatsURL: "https://www.cbssports.com" + homeTeamStatsURL + "roster",
        awayTeamStatsURL: "https://www.cbssports.com" + awayTeamStatsURL + "roster",
        boxScoreURL: boxScoreURL,
        isFinished: false, 
        urlDate: urlDate,
        urlString: URLString,
        gameTime: start.format('h:mm a'),
        date: date
    };

    return game;
}


module.exports.scheduleParser = scheduleParser;
