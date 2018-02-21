import chalk from 'chalk';
import { getMainColor } from 'nba-color';

import { bold } from '../../utils/log';
import table from '../../utils/table';
/*
Author: DoubleB123, bbrenner321@gmail.com
This is called by index.js when comparing the stats of players
It is similar to seasonStats.js but a few more steps to 
compile the data between players for display
*/

const alignCenter = columns =>
  columns.map(content => ({ content, hAlign: 'center', vAlign: 'center' }));

// takes in an array and gives the index of the max value,
// ignores the dashes in the array
const findMaxInd = arr => {
  let maxInd = 0;
  for (let i = 1; i < arr.length; i += 1) {
    if (arr[i] !== '-') {
      if (arr[i] > arr[maxInd]) {
        maxInd = i;
      }
    }
  }
  return maxInd;
};

// takes in the player info array and gets the names and jersey and creates a string containing them all
const makeNameStr = (playerInfo, seasonTtpe) => {
  let nameStr = '';
  playerInfo.forEach(player => {
    const { teamAbbreviation, jersey, displayFirstLast } = {
      ...player.commonPlayerInfo[0],
    };
    const teamMainColor = getMainColor(teamAbbreviation);
    const playerName = chalk`{bold.white.bgHex('${
      teamMainColor ? teamMainColor.hex : '#000'
    }') ${teamAbbreviation}} {bold.white #${jersey} ${displayFirstLast} │ ${
      seasonTtpe
    }}`;
    nameStr += `${playerName}\n`;
  });
  return nameStr;
};

// make an object where keys are the seasons
// each season maps to an array of the player stats for that season
// each array has the length of the number of players, entries initalized to empty object
const makeSeasonObj = (playerProfile, seasonStr) => {
  const seasonObj = {};
  let index = 0;
  playerProfile.forEach(player => {
    // access the season totals for either post or regular season
    const seasonArr = player[`seasonTotals${seasonStr}`];
    seasonArr.forEach(season => {
      const currentSeason = season.seasonId;
      // check if the season is already in the object
      if (seasonObj[currentSeason]) {
        // if it does add this players data to the array
        seasonObj[currentSeason][index] = season;
      } else {
        // otherwise create a new array with length of number of players
        seasonObj[currentSeason] = [...Array(playerProfile.length)].fill({});
        seasonObj[currentSeason][index] = season;
      }
    });
    index += 1;
  });
  return seasonObj;
};

// takes in all the data and returns an array with the player's totals as each entry
const makeOverall = (playerProfile, seasonStr) => {
  const overallArr = [];
  playerProfile.forEach(player => {
    overallArr.push(...player[`careerTotals${seasonStr}`]);
  });
  return overallArr;
};

// takes in the data for a season and combines the stats into strings to be pushed to table
/* eslint-disable no-param-reassign */
const makeRow = seasonData => {
  const template = {
    teamAbbreviation: [],
    playerAge: [],
    gp: [],
    min: [],
    pts: [],
    fgPct: [],
    fg3Pct: [],
    ftPct: [],
    ast: [],
    reb: [],
    stl: [],
    blk: [],
    tov: [],
  };
  let seasonId;
  seasonData.forEach(player => {
    // configure certain data before we append to string
    // make sure object isn't empty
    if (Object.keys(player).length !== 0) {
      player.fg3Pct = (player.fg3Pct * 100).toFixed(1);
      player.fgPct = (player.fgPct * 100).toFixed(1);
      player.ftPct = (player.ftPct * 100).toFixed(1);
      // overall stats dont have team abbreviation, have to check if exists
      if (player.teamAbbreviation) {
        const teamMainColor = getMainColor(player.teamAbbreviation);
        player.teamAbbreviation = chalk`{bold.white.bgHex('${
          teamMainColor ? teamMainColor.hex : '#000'
        }') ${player.teamAbbreviation}}`;
      }
      if (!template.seasonId) {
        seasonId = bold(player.seasonId);
      }
    }
    Object.keys(template).forEach(key => {
      // add data to str or if no data put in a dash
      template[key].push(player[key] || '-');
    });
  });

  Object.keys(template).forEach(key => {
    // find which player has best stat and color it green
    const maxInd = findMaxInd(template[key]);
    template[key][maxInd] = chalk.green(template[key][maxInd]);
    template[key] = template[key].join('\n');
  });

  // set seasonId, do this at the end because didnt want key in there when looping
  template.seasonId = seasonId;
  return template;
};
/* eslint-enable no-param-reassign */

// main function called by index.js
const seasonStatsCompare = (
  playerProfile,
  playerInfo,
  seasonTtpe = 'Regular Season'
) => {
  // these strings are used so we can get the correct data at the beginning and dont have to write same code twice
  const seasonStr = seasonTtpe.replace(/\s/g, '');

  // compile the data into a format to push to the table
  const seasonObj = makeSeasonObj(playerProfile, seasonStr);
  const overallArr = makeOverall(playerProfile, seasonStr);
  const nameStr = makeNameStr(playerInfo, seasonTtpe);

  // make sure we are adding rows in the correct order
  const seasonDates = Object.keys(seasonObj).sort((a, b) => {
    // date has form 2003-04
    const adate = a.split('-')[0];
    const bdate = b.split('-')[0];
    return adate - bdate;
  });

  // use all the strings we generated to make the table
  const seasonTable = table.basicTable();
  seasonTable.push([
    { colSpan: 14, content: nameStr.trim(), hAlign: 'center' },
  ]);
  seasonTable.push(
    alignCenter([
      bold('SEASON'),
      bold('TEAM'),
      bold('AGE'),
      bold('GP'),
      bold('MIN'),
      bold('PTS'),
      bold('FG%'),
      bold('3P%'),
      bold('FT%'),
      bold('AST'),
      bold('REB'),
      bold('STL'),
      bold('BLK'),
      bold('TOV'),
    ])
  );

  // go through each season and push it to table
  seasonDates.reverse().forEach(key => {
    const row = makeRow(seasonObj[key]);
    seasonTable.push(
      alignCenter([
        row.seasonId.trim(),
        row.teamAbbreviation.trim(),
        row.playerAge.trim(),
        row.gp.trim(),
        row.min.trim(),
        row.pts.trim(),
        row.fgPct.trim(),
        row.fg3Pct.trim(),
        row.ftPct.trim(),
        row.ast.trim(),
        row.reb.trim(),
        row.stl.trim(),
        row.blk.trim(),
        row.tov.trim(),
      ])
    );
  });

  // add the final Overall row
  const overallRow = makeRow(overallArr);
  seasonTable.push(
    alignCenter([
      bold('Overall'),
      bold(''),
      bold(''),
      bold(overallRow.gp.trim()),
      bold(overallRow.min.trim()),
      bold(overallRow.pts.trim()),
      bold(overallRow.fgPct.trim()),
      bold(overallRow.fg3Pct.trim()),
      bold(overallRow.ftPct.trim()),
      bold(overallRow.ast.trim()),
      bold(overallRow.reb.trim()),
      bold(overallRow.stl.trim()),
      bold(overallRow.blk.trim()),
      bold(overallRow.tov.trim()),
    ])
  );

  console.log(seasonTable.toString());
};

export default seasonStatsCompare;
