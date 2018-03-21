import chalk from 'chalk';
import format from 'date-fns/format';
import { getMainColor } from 'nba-color';

import { convertToCm, convertToKg } from '../../utils/convertUnit';
import table from '../../utils/table';
import { bold } from '../../utils/log';

const alignCenter = columns =>
  columns.map(content => ({ content, hAlign: 'center', vAlign: 'center' }));

const infoCompare = playerInfo => {
  const playerTable = table.basicTable();
  let nameStr = '';

  playerInfo.forEach(elem => {
    const {
      teamAbbreviation,
      jersey,
      displayFirstLast,
      height,
      weight,
      country,
      birthdate,
      seasonExp,
      draftYear,
      draftRound,
      draftNumber,
      pts,
      reb,
      ast,
    } = { ...elem.commonPlayerInfo[0], ...elem.playerHeadlineStats[0] };

    const teamMainColor = getMainColor(teamAbbreviation);
    const playerName = chalk`{bold.white.bgHex('${
      teamMainColor ? teamMainColor.hex : '#000'
    }') ${teamAbbreviation}} {bold.white #${jersey} ${displayFirstLast}}`;

    const draft =
      draftYear !== 'Undrafted'
        ? `${draftYear} Rnd ${draftRound} Pick ${draftNumber}`
        : 'Undrafted';

    nameStr += `${playerName}\n`;

    playerTable.push(
      alignCenter([
        `${height} / ${convertToCm(height)}`,
        `${weight} / ${convertToKg(weight)}`,
        country,
        `${format(birthdate, 'YYYY/MM/DD')}`,
        `${seasonExp} yrs`,
        draft,
        pts,
        reb,
        ast,
      ])
    );
  });

  playerTable.unshift(
    [
      {
        colSpan: 9,
        content: nameStr.trim(),
        hAlign: 'center',
        vAlign: 'center',
      },
    ],
    alignCenter([
      bold('Height'),
      bold('Weight'),
      bold('Country'),
      bold('Born'),
      bold('EXP'),
      bold('Draft'),
      bold('PTS'),
      bold('REB'),
      bold('AST'),
    ])
  );
  console.log(playerTable.toString());
};

export default infoCompare;
