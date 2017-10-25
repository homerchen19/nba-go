/* eslint-disable no-console */

const chalk = require('chalk');
const Table = require('cli-table2');
const format = require('date-fns/format');

const teamColor = require('../../utils/teamColor');
const { convertToCm, convertToKg } = require('../../utils/convertToCm');

const alignCenter = columns =>
  columns.map(content => ({ content, hAlign: 'center' }));

async function info(playerInfo) {
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
}

module.exports = info;
