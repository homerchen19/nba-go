/* eslint-disable no-console */

import chalk from 'chalk';

import { bold, neonGreen } from '../../utils/log';
import { basicTable } from '../../utils/table';

const vAlignCenter = columns =>
  columns.map(column => {
    if (typeof column === 'string') {
      return { content: column, vAlign: 'center', hAlign: 'center' };
    }

    return { ...column, vAlign: 'center' };
  });

const colorTeamName = (color, teamAbbreviation) =>
  chalk`{bold.white.bgHex('${color}') ${teamAbbreviation}}`;

const getStartingPlayers = team =>
  team
    .getGamePlayers()
    .filter(player => player.starting_position !== '')
    .map(player => ({
      name: `${player.first_name} ${player.last_name}`,
      position: player.starting_position,
    }));

const teamGameLeaders = (homeTeam, visitorTeam, field) =>
  vAlignCenter([
    {
      colSpan: 3,
      content: bold(
        `${homeTeam.getGameLeaders(field).leader[0]
          .FirstName} ${homeTeam.getGameLeaders(field).leader[0].LastName}`
      ),
      hAlign: 'right',
    },
    bold(homeTeam.getGameLeaders(field).StatValue),
    {
      colSpan: 2,
      content: field,
      hAlign: 'center',
    },
    bold(visitorTeam.getGameLeaders(field).StatValue),
    {
      colSpan: 3,
      content: bold(
        `${visitorTeam.getGameLeaders(field).leader[0]
          .FirstName} ${visitorTeam.getGameLeaders(field).leader[0].LastName}`
      ),
      hAlign: 'left',
    },
  ]);

const createGameScorebaord = (homeTeam, visitorTeam, gameData) => {
  const scoreboardTable = basicTable();
  const {
    date,
    time,
    arena,
    city,
    state,
    display_year,
    display_season,
  } = gameData;

  const formatedDate = `${date.slice(0, 4)}/${date.slice(4, 6)}/${date.slice(
    6,
    8
  )}`;
  const formatedTime = `${time.slice(0, 2)}:${time.slice(2, 4)}`;

  const homeTeamStartingPlayers = getStartingPlayers(homeTeam);
  const visitorTeamStartingPlayers = getStartingPlayers(visitorTeam);

  scoreboardTable.push(
    vAlignCenter([
      {
        colSpan: 10,
        content: bold(`${display_year} ${display_season}`),
        hAlign: 'center',
      },
    ]),
    vAlignCenter([
      {
        colSpan: 2,
        content: bold(colorTeamName(homeTeam.getColor(), homeTeam.getName())),
        hAlign: 'center',
      },
      {
        colSpan: 6,
        content: bold('Final'),
        hAlign: 'center',
      },
      {
        colSpan: 2,
        content: bold(
          colorTeamName(visitorTeam.getColor(), visitorTeam.getName())
        ),
        hAlign: 'center',
      },
    ]),
    vAlignCenter([
      'PG',
      {
        content: bold(
          homeTeamStartingPlayers.filter(player => player.position === 'PG')[0]
            .name
        ),
        hAlign: 'left',
      },
      bold('Team'),
      bold('Q1'),
      bold('Q2'),
      bold('Q3'),
      bold('Q4'),
      bold('Total'),
      'PG',
      {
        content: bold(
          visitorTeamStartingPlayers.filter(
            player => player.position === 'PG'
          )[0].name
        ),
        hAlign: 'left',
      },
    ]),
    vAlignCenter([
      'SG',
      {
        content: bold(
          homeTeamStartingPlayers.filter(player => player.position === 'SG')[0]
            .name
        ),
        hAlign: 'left',
      },
      `${colorTeamName(
        homeTeam.getColor(),
        homeTeam.getAbbreviation()
      )} (${homeTeam.getWins()}-${homeTeam.getLoses()})`,
      bold(homeTeam.getQuarterScore('1')),
      bold(homeTeam.getQuarterScore('2')),
      bold(homeTeam.getQuarterScore('3')),
      bold(homeTeam.getQuarterScore('4')),
      bold(neonGreen(homeTeam.getScore())),
      'SG',
      {
        content: bold(
          visitorTeamStartingPlayers.filter(
            player => player.position === 'SG'
          )[0].name
        ),
        hAlign: 'left',
      },
    ]),
    vAlignCenter([
      'SF',
      {
        content: bold(
          homeTeamStartingPlayers.filter(player => player.position === 'SF')[0]
            .name
        ),
        hAlign: 'left',
      },
      `${colorTeamName(
        visitorTeam.getColor(),
        visitorTeam.getAbbreviation()
      )} (${visitorTeam.getWins()}-${visitorTeam.getLoses()})`,
      bold(visitorTeam.getQuarterScore('1')),
      bold(visitorTeam.getQuarterScore('2')),
      bold(visitorTeam.getQuarterScore('3')),
      bold(visitorTeam.getQuarterScore('4')),
      bold(neonGreen(visitorTeam.getScore())),
      'SF',
      {
        content: bold(
          visitorTeamStartingPlayers.filter(
            player => player.position === 'SF'
          )[0].name
        ),
        hAlign: 'left',
      },
    ]),
    vAlignCenter([
      'PF',
      {
        content: bold(
          homeTeamStartingPlayers.filter(player => player.position === 'PF')[0]
            .name
        ),
        hAlign: 'left',
      },
      {
        colSpan: 6,
        content: bold(`${formatedDate} ${formatedTime}`),
        hAlign: 'center',
      },
      'PF',
      {
        content: bold(
          visitorTeamStartingPlayers.filter(
            player => player.position === 'PF'
          )[0].name
        ),
        hAlign: 'left',
      },
    ]),
    vAlignCenter([
      'C',
      {
        content: bold(
          homeTeamStartingPlayers.filter(player => player.position === 'C')[0]
            .name
        ),
        hAlign: 'left',
      },
      {
        colSpan: 6,
        content: bold(`${arena} │ ${city}, ${state}`),
        hAlign: 'center',
      },
      'C',
      {
        content: bold(
          visitorTeamStartingPlayers.filter(
            player => player.position === 'C'
          )[0].name
        ),
        hAlign: 'left',
      },
    ]),
    [],
    vAlignCenter([
      {
        colSpan: 10,
        content: bold('Game Record Leaders'),
        hAlign: 'center',
      },
    ]),
    teamGameLeaders(homeTeam, visitorTeam, 'Points'),
    teamGameLeaders(homeTeam, visitorTeam, 'Assists'),
    teamGameLeaders(homeTeam, visitorTeam, 'Rebounds')
  );

  console.log(scoreboardTable.toString());
};

export default createGameScorebaord;
