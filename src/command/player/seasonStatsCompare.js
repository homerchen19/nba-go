import R from 'ramda';
import chalk from 'chalk';
import { getMainColor } from 'nba-color';

import { bold } from '../../utils/log';
import table from '../../utils/table';

const alignCenter = columns =>
  columns.map(content => ({ content, hAlign: 'center', vAlign: 'center' }));

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

const makeSeasonObj = (playerProfile, seasonStr) => {
  const seasonObj = {};
  let index = 0;
  playerProfile.forEach(player => {
    const seasonArr = player[`seasonTotals${seasonStr}`];
    seasonArr.forEach(season => {
      const currentSeason = season.seasonId;
      if (seasonObj[currentSeason]) {
        seasonObj[currentSeason][index] = season;
      } else {
        seasonObj[currentSeason] = [...Array(playerProfile.length)].fill({});
        seasonObj[currentSeason][index] = season;
      }
    });
    index += 1;
  });
  return seasonObj;
};

const makeOverall = (playerProfile, seasonStr) => {
  const overallArr = [];
  playerProfile.forEach(player => {
    overallArr.push(...player[`careerTotals${seasonStr}`]);
  });
  return overallArr;
};

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
    if (Object.keys(player).length !== 0) {
      player.fg3Pct = (player.fg3Pct * 100).toFixed(1);
      player.fgPct = (player.fgPct * 100).toFixed(1);
      player.ftPct = (player.ftPct * 100).toFixed(1);
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
    const templatePusher = (val, key) => {
      template[key].push(player[key] || '-');
    };
    R.forEachObjIndexed(templatePusher, template);
  });

  const colorStats = (val, key) => {
    const maxInd = findMaxInd(template[key]);
    template[key][maxInd] = chalk.green(template[key][maxInd]);
    template[key] = template[key].join('\n');
  };
  R.forEachObjIndexed(colorStats, template);

  template.seasonId = seasonId;
  return template;
};

/* eslint-enable no-param-reassign */
const seasonStatsCompare = (
  playerProfile,
  playerInfo,
  seasonTtpe = 'Regular Season'
) => {
  const seasonStr = seasonTtpe.replace(/\s/g, '');

  const seasonObj = makeSeasonObj(playerProfile, seasonStr);
  const overallArr = makeOverall(playerProfile, seasonStr);
  const nameStr = makeNameStr(playerInfo, seasonTtpe);

  const sorter = (a, b) => {
    const adate = a.split('-')[0];
    const bdate = b.split('-')[0];
    return adate - bdate;
  };
  const seasonDates = R.sort(sorter, R.keys(seasonObj));

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
