/* eslint-disable no-console */

import chalk from 'chalk';

import { bold, neonGreen } from '../../utils/log';
import { basicTable } from '../../utils/table';

const alignCenter = columns =>
  columns.map(content => ({ content, hAlign: 'center', vAlign: 'center' }));

const colorTeamName = (color, teamAbbreviation) =>
  chalk`{bold.white.bgHex('${color}') ${teamAbbreviation}}`;

const createGameScorebaord = (homeTeam, visitorTeam, gameData) => {
  const scoreboardTable = basicTable();
  const {
    date,
    time,
    arena,
    city,
    state,
    period_time: { period_status: periodStatus, game_clock: gameClock },
  } = gameData;

  const formatedDate = `${date.slice(0, 4)}/${date.slice(4, 6)}/${date.slice(
    6,
    8
  )}`;
  const formatedTime = `${time.slice(0, 2)}:${time.slice(2, 4)}`;

  scoreboardTable.push(
    [
      {
        colSpan: 7,
        content: bold(`${formatedDate} ${formatedTime}`),
        hAlign: 'center',
        vAlign: 'center',
      },
    ],
    alignCenter([
      '',
      bold('Team'),
      bold('Q1'),
      bold('Q2'),
      bold('Q3'),
      bold('Q4'),
      bold('Total'),
    ]),
    alignCenter([
      bold('Home'),
      `${colorTeamName(
        homeTeam.getColor(),
        homeTeam.getAbbreviation()
      )} (${homeTeam.getWins()}-${homeTeam.getLoses()})`,
      bold(homeTeam.getQuarterScore('1')),
      bold(homeTeam.getQuarterScore('2')),
      bold(homeTeam.getQuarterScore('3')),
      bold(homeTeam.getQuarterScore('4')),
      bold(neonGreen(homeTeam.getScore())),
    ]),
    alignCenter([
      bold('Away'),
      `${colorTeamName(
        visitorTeam.getColor(),
        visitorTeam.getAbbreviation()
      )} (${visitorTeam.getWins()}-${visitorTeam.getLoses()})`,
      bold(visitorTeam.getQuarterScore('1')),
      bold(visitorTeam.getQuarterScore('2')),
      bold(visitorTeam.getQuarterScore('3')),
      bold(visitorTeam.getQuarterScore('4')),
      bold(neonGreen(visitorTeam.getScore())),
    ]),
    [
      {
        colSpan: 7,
        content: bold(`${periodStatus} ${gameClock}`),
        hAlign: 'center',
        vAlign: 'center',
      },
    ],
    [
      {
        colSpan: 7,
        content: bold(`${arena} │ ${city}, ${state}`),
        hAlign: 'center',
        vAlign: 'center',
      },
    ]
  );

  console.log(scoreboardTable.toString());
};

export default createGameScorebaord;
