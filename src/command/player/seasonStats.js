import chalk from 'chalk';
import { getMainColor } from 'nba-color';

import { bold } from '../../utils/log';
import { basicTable } from '../../utils/table';

const alignCenter = columns =>
  columns.map(content => ({ content, hAlign: 'center', vAlign: 'center' }));

const seasonStats = ({
  seasonType,
  nowTeamAbbreviation,
  jersey,
  displayFirstLast,
  seasonTotals,
  careerTotals,
}) => {
  const nowTeamMainColor = getMainColor(nowTeamAbbreviation);
  const seasonTable = basicTable();
  const playerName = chalk`{bold.white.bgHex('${
    nowTeamMainColor ? nowTeamMainColor.hex : '#000'
  }') ${nowTeamAbbreviation}} {bold.white #${jersey} ${displayFirstLast} │ ${seasonType}}`;

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

  console.log(seasonTable.toString());
};

export default seasonStats;
