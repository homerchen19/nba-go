/* eslint-disable */
import chalk from 'chalk';
import { getMainColor } from 'nba-color';

import { bold } from '../../utils/log';
import table from '../../utils/table';

const alignCenter = columns =>
  columns.map(content => ({ content, hAlign: 'center', vAlign: 'center' }));

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
const makeSeasonObj = (playerProfile, seasonStr) => {
  const seasonObj = {};
  playerProfile.forEach(player => {
    // access the season totals for either post or regular season
    const seasonArr = player[`seasonTotals${seasonStr}`];
    seasonArr.forEach(season => {
      const currentSeason = season.seasonId;
      // check if the season is already in the object
      if (seasonObj[currentSeason]) {
        // if it does add this players data to the array
        seasonObj[currentSeason].push(season);
      } else {
        // otherwise create a new array
        seasonObj[currentSeason] = [season];
      }
    });
  });
  return seasonObj;
};

// takes in the object contining seasons and returns an array where each entry represents a season
// the entries will be objects where keys map to strings to push to table
const makeRow = seasonData => {
  const template = {
    teamAbbreviation: '',
    playerAge: '',
    gp: '',
    min: '',
    pts: '',
    fgPct: '',
    fg3Pct: '',
    ftPct: '',
    ast: '',
    reb: '',
    stl: '',
    blk: '',
    tov: '',
  };

  seasonData.forEach(player => {
    //configure certain data before we append to string
    if(player !== {}){
      player.fg3Pct = (player.fg3Pct * 100).toFixed(1)
      player.fgPct = (player.fgPct * 100).toFixed(1)
      player.ftPct = (player.ftPct * 100).toFixed(1)
      let teamMainColor = getMainColor(player.teamAbbreviation);
      player.teamAbbreviation = chalk`{bold.white.bgHex('${
          teamMainColor ? teamMainColor.hex : '#000'
        }') ${player.teamAbbreviation}}`
    }
    Object.keys(template).forEach(key =>{
      //add data to str or if no data put in a dash
      template[key] += (player[key] + '\n') || '-\n';
    });
  });

  template.seasonId = bold(seasonData[0].seasonId);
  return template;
};

const seasonStatsCompare = (
  playerProfile,
  playerInfo,
  seasonTtpe = 'Regular Season'
) => {
  // these strings are used so we can get the correct data at the beginning and dont have to write same code twice
  const seasonStr = seasonTtpe.replace(/\s/g, '');

  const seasonObj = makeSeasonObj(playerProfile, seasonStr);

  const nameStr = makeNameStr(playerInfo, seasonTtpe);
  //const seasonDataStr = makeSeasonStr(seasonObj);

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

  //for each season in seasonObj
  //row = makeRow
  //table.push(row)
  Object.keys(seasonObj).forEach(key => {
    debugger;
    const row = makeRow(seasonObj[key]);
    debugger;
  
    seasonTable.push(
      alignCenter([
        row.seasonId,
        row.teamAbbreviation,
        row.playerAge,
        row.gp,
        row.min,
        row.pts,
        row.fgPct,
        row.fg3Pct,
        row.ftPct,
        row.ast,
        row.reb,
        row.stl,
        row.blk,
        row.tov,
      ])
    );
  });

  console.log(seasonTable.toString());
};

export default seasonStatsCompare;
