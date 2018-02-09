import chalk from 'chalk';
import format from 'date-fns/format';
import { getMainColor } from 'nba-color';

import { convertToCm, convertToKg } from '../../utils/convertUnit';
import table from '../../utils/table';
import { bold } from '../../utils/log';

const alignCenter = columns =>
  columns.map(content => ({ content, hAlign: 'center', vAlign: 'center' }));

// in the original info.js it it doesn't have a foreach loop
// here i loop through each player and create table entries and at the end push to the table
const infoCompare = playerInfo => {
  const playerTable = table.basicTable();
  // these will be the table entries, append to them and then add a new line
  // after the loop push to the table
  let nameStr = '';
  let heightStr = '';
  let weightStr = '';
  let countryStr = '';
  let birthStr = '';
  let seasonStr = '';
  let draftStr = '';
  let ptsStr = '';
  let rebStr = '';
  let astStr = '';

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
    heightStr += `${height} / ${convertToCm(height)}\n`;
    weightStr += `${weight} / ${convertToKg(weight)}\n`;
    countryStr += `${country}\n`;
    birthStr += `${format(birthdate, 'YYYY/MM/DD')}\n`;
    seasonStr += `${seasonExp} yrs\n`;
    draftStr += `${draft}\n`;
    ptsStr += `${pts}\n`;
    rebStr += `${reb}\n`;
    astStr += `${ast}\n`;
  });

  playerTable.push(
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
    ]),
    alignCenter([
      heightStr.trim(),
      weightStr.trim(),
      countryStr.trim(),
      birthStr.trim(),
      seasonStr.trim(),
      draftStr.trim(),
      ptsStr.trim(),
      rebStr.trim(),
      astStr.trim(),
    ])
  );
  console.log(playerTable.toString());
};

export default infoCompare;
