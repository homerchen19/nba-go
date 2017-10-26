/* eslint-disable no-console */

import chalk from 'chalk';
import Table from 'cli-table2';
import format from 'date-fns/format';

import teamColor from '../../utils/teamColor';
import { convertToCm, convertToKg } from '../../utils/convertUnit';

const alignCenter = columns =>
  columns.map(content => ({ content, hAlign: 'center' }));

const info = async playerInfo => {
  const playerTable = new Table({
    head: [],
    chars: {
      top: '═',
      'top-mid': '╤',
      'top-left': '╔',
      'top-right': '╗',
      bottom: '═',
      'bottom-mid': '╧',
      'bottom-left': '╚',
      'bottom-right': '╝',
      left: '║',
      'left-mid': '╟',
      mid: '─',
      'mid-mid': '┼',
      right: '║',
      'right-mid': '╢',
      middle: '│',
    },
  });

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
  } = playerInfo;

  const playerName = chalk`{bold.white.bgHex('${teamColor[teamAbbreviation]
    ? teamColor[teamAbbreviation].color
    : '#000'}') ${teamAbbreviation}} {bold.white #${jersey} ${displayFirstLast}}`;

  const draft =
    draftYear !== 'Undrafted'
      ? `${draftYear} Rnd ${draftRound} Pick ${draftNumber}`
      : 'Undrafted';

  playerTable.push(
    [{ colSpan: 9, content: playerName, hAlign: 'center' }],
    alignCenter([
      'Height',
      'Weight',
      'Country',
      'Born',
      'EXP',
      'Draft',
      'PTS',
      'REB',
      'AST',
    ]),
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
  console.log(playerTable.toString());
};

export default info;
