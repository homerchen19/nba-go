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

// takes in the object contining seasons and returns an array where each entry represents a season
// the entries will be objects where keys map to strings to push to table
const makeSeasonStr = seasonObj => {
  const template = {
    seasonId: '',
    abbreviaton: '',
    playerAge: '',
    gp: '',
    min: '',
    pts: '',
    fpPct: '',
    fg3Pct: '',
    ftPct: '',
    ast: '',
    reb: '',
    stl: '',
    blk: '',
    tov: '',
  };
  /*
  seasonTable.push(
    alignCenter([
      bold(seasonId),
      chalk`{bold.white.bgHex('${
        teamMainColor ? teamMainColor.hex : '#000'
      }') ${teamAbbreviation}}`,
      playerAge,
      gp,
      min,
      pts,
      (fgPct * 100).toFixed(1),
      (fg3Pct * 100).toFixed(1),
      (ftPct * 100).toFixed(1),
      ast,
      reb,
      stl,
      blk,
      tov,
    ])
  );
  */
};

const seasonStatsCompare = (
  playerProfile,
  playerInfo,
  seasonTtpe = 'Regular Season'
) => {
  // these strings are used so we can get the correct data at the beginning and dont have to write same code twice
  const seasonStr = seasonTtpe.replace(/\s/g, '');

  const seasonObj = makeSeasonTable(playerProfile, seasonStr);
  const seasonDataStr = makeSeasonStr(seasonObj);

  const nameStr = makeNameStr(playerInfo, seasonTtpe);

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

  console.log(seasonTable.toString());

  /*
  seasonTable.push(
    alignCenter([
      bold(seasonId),
      chalk`{bold.white.bgHex('${
        teamMainColor ? teamMainColor.hex : '#000'
      }') ${teamAbbreviation}}`,
      playerAge,
      gp,
      min,
      pts,
      (fgPct * 100).toFixed(1),
      (fg3Pct * 100).toFixed(1),
      (ftPct * 100).toFixed(1),
      ast,
      reb,
      stl,
      blk,
      tov,
    ])
  );

  seasonTotals.reverse().forEach(season => {
    const {
      seasonId,
      teamAbbreviation,
      playerAge,
      gp,
      min,
      pts,
      fgPct,
      fg3Pct,
      ftPct,
      ast,
      reb,
      stl,
      blk,
      tov,
    } = season;
    const teamMainColor = getMainColor(teamAbbreviation);

  const {
    gp,
    min,
    pts,
    fgPct,
    fg3Pct,
    ftPct,
    ast,
    reb,
    stl,
    blk,
    tov,
  } = careerTotals;

  seasonTable.push(
    alignCenter([
      bold('Overall'),
      bold(''),
      bold(''),
      bold(gp),
      bold(min),
      bold(pts),
      bold((fgPct * 100).toFixed(1)),
      bold((fg3Pct * 100).toFixed(1)),
      bold((ftPct * 100).toFixed(1)),
      bold(ast),
      bold(reb),
      bold(stl),
      bold(blk),
      bold(tov),
    ])
  );
*/
};

// make an object where keys are the seasons
// each season maps to an array of the player stats for that season
const makeSeasonTable = (playerProfile, seasonStr) => {
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

export default seasonStatsCompare;
