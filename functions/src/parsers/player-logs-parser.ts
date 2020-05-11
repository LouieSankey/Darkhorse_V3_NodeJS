const playerLogsParser = function(html){

    html('.fRight').remove();

    const imgSrc = html('.photo').find('img').attr('src');
    const logsRef = html('tbody').children('tr').not('.title').not('.label').not('#totals').not('.month');
    const playerLogs = []

    logsRef.each(function(i, element){

    //only gets logs for last 5 games
       if(i > logsRef.length - 8){

        var data = [];

        html(element).children('td').each(function(j,elem){
            data.push(html(elem).text());
        });

        if(data[1] !== undefined){

            const _3sMadeArray = data[6].split('-')
            const _3sMade = _3sMadeArray[0];

            playerLogs.push({
                'date': data[0],
                'opp': data[1],
                'result': data[2],
                'min': +data[3],
                'fg%': Math.round(+data[5]),
                'reb': +data[10],
                'ast':+data[11],
                'blk': +data[12],
                'stl': +data[13],
                'to': +data[15],
                'pts': +data[16],
                '3pt': +_3sMade,
                //'pf': data[14],
                // 'fgm-a': data[4],
                // '3pm-a': data[6],
                // '3p%': data[7],
                // 'ftm-a': data[8],
                // 'ft%': data[9],
            })
        }
    }

   


    });

    

    return {logs: playerLogs, imgSrc: imgSrc}

}

module.exports.playerLogsParser = playerLogsParser;