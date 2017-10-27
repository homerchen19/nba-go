/* eslint-disable no-console */

import chalk from 'chalk';

import { getTeamMainColor } from '../../utils/nbaColor';
import { bold } from '../../utils/log';
import table from '../../utils/table';

const alignCenter = columns =>
  columns.map(content => ({ content, hAlign: 'center' }));

const regularSeason = async ({
  nowTeamAbbreviation,
  jersey,
  displayFirstLast,
  seasonTotalsRegularSeason,
  careerTotalsRegularSeason,
}) => {
  const seasonTable = table.basicTable();
  const playerName = chalk`{bold.white.bgHex('${getTeamMainColor(
    nowTeamAbbreviation
  )
    ? getTeamMainColor(nowTeamAbbreviation)
    : '#000'}') ${nowTeamAbbreviation}} {bold.white #${jersey} ${displayFirstLast}}`;
  seasonTable.push([{ colSpan: 14, content: playerName, hAlign: 'center' }]);
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

  seasonTotalsRegularSeason.reverse().forEach(season => {
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

    seasonTable.push(
      alignCenter([
        bold(seasonId),
        chalk`{bold.white.bgHex('${getTeamMainColor(teamAbbreviation)
          ? getTeamMainColor(teamAbbreviation)
          : '#000'}') ${teamAbbreviation}}`,
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
  });

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
  } = careerTotalsRegularSeason;

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

  console.log(seasonTable.toString());
};

export default regularSeason;
