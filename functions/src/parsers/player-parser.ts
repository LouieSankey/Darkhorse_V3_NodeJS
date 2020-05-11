const playerParser = function(html, schedule){

    const dbInitializers = require('../db-initializers');

    const playerHtml = html.children('td').eq(1).children('span').eq(1);
    const playerName = playerHtml.find('a').text().trim();
    const injury = playerHtml.find('.icon-moon-injury').text().trim();
    const news = playerHtml.find('.icon-moon-news').text().trim();
    const playerUrl = playerHtml.find('a').attr('href');
    const playerPageUrl = "https://www.cbssports.com" + playerUrl;
    const playerLogsUrl = "https://www.cbssports.com" + playerUrl.replace('playerpage', 'player/gamelogs/2019');
    let playerDBRef = playerUrl.split('/')[5]
    playerDBRef = ((playerDBRef.charAt(0) === "-") ? playerDBRef.slice(1) : playerDBRef);

    const player = {
        'playerName': playerName,
        'playerPageUrl': playerPageUrl,
        'playerLogsUrl': playerLogsUrl,
        'logs': [],
        'inj': injury,
        'news': news,
        'gameStarted': false,
        'quarter': "",
        'playerDBRef': playerDBRef,
        'currentLog': dbInitializers.currentLog,
        'statPurchase': dbInitializers.statsPurchased,
        'fantAwards': dbInitializers.fantasyAwards,
        'dhScoreFP': 0.0,
        'gameScoreFP': 0.0,
        'playerPrice': 0,
        'gameUrl': schedule.homeTeamStatsURL,
        'teamAbbr': schedule.homeTeamAbbr,
        'gameTime': schedule.gameTime,
  
    }

    return player;

}
module.exports.playerParser = playerParser;