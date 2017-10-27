/* eslint-disable no-console */

import chalk from 'chalk';
import format from 'date-fns/format';

import { getTeamMainColor } from '../../utils/nbaColor';
import { convertToCm, convertToKg } from '../../utils/convertUnit';
import table from '../../utils/table';

const alignCenter = columns =>
  columns.map(content => ({ content, hAlign: 'center' }));

const info = async playerInfo => {
  const playerTable = table.basicTable();

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

  const playerName = chalk`{bold.white.bgHex('${getTeamMainColor(
    teamAbbreviation
  )
    ? getTeamMainColor(teamAbbreviation)
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
