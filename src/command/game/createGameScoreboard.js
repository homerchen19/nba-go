/* eslint-disable no-console */
import format from 'date-fns/format';
import emoji from 'node-emoji';

import { bold, neonGreen } from '../../utils/log';
import { basicTable } from '../../utils/table';

const vAlignCenter = columns =>
  columns.map(column => {
    if (typeof column === 'string') {
      return { content: column, vAlign: 'center', hAlign: 'center' };
    }

    return { ...column, vAlign: 'center' };
  });

const getStartingPlayers = team =>
  team
    .getPlayers()
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

const createGameScorebaord = (
  homeTeam,
  visitorTeam,
  { date, time, arena, city, state, display_year, display_season }
) => {
  const scoreboardTable = basicTable();

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
        content: bold(homeTeam.getName({ color: true })),
        hAlign: 'center',
      },
      {
        colSpan: 6,
        content: bold('Final'),
        hAlign: 'center',
      },
      {
        colSpan: 2,
        content: bold(visitorTeam.getName({ color: true })),
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
      `${homeTeam.getAbbreviation({
        color: true,
      })} (${homeTeam.getWins()}-${homeTeam.getLoses()})`,
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
      `${visitorTeam.getAbbreviation({
        color: true,
      })} (${visitorTeam.getWins()}-${visitorTeam.getLoses()})`,
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
        content: bold(
          `${emoji.get('calendar')}  ${format(
            date,
            'YYYY/MM/DD'
          )} ${formatedTime}`
        ),
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
        content: bold(`${emoji.get('house')}  ${arena} │ ${city}, ${state}`),
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
