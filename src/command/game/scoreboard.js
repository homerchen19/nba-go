import format from 'date-fns/format';
import emoji from 'node-emoji';
import { center } from 'wide-align';

import getBroadcastNetworks from './network';

import { bold, nbaRed, neonGreen } from '../../utils/log';
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
    .filter(
      player => player.starting_position !== '' || player.on_court === '1'
    )
    .map(player => ({
      name: `${player.first_name} ${player.last_name}`,
      position: player.starting_position || player.position_short,
    }));

const teamGameLeaders = (homeTeam, visitorTeam, field) =>
  vAlignCenter([
    {
      colSpan: 3,
      content: bold(
        `${homeTeam.getGameLeaders(field).leader[0].FirstName} ${
          homeTeam.getGameLeaders(field).leader[0].LastName
        }`
      ),
      hAlign: 'right',
    },
    nbaRed(homeTeam.getGameLeaders(field).StatValue),
    {
      colSpan: 2,
      content: field,
      hAlign: 'center',
    },
    nbaRed(visitorTeam.getGameLeaders(field).StatValue),
    {
      colSpan: 3,
      content: bold(
        `${visitorTeam.getGameLeaders(field).leader[0].FirstName} ${
          visitorTeam.getGameLeaders(field).leader[0].LastName
        }`
      ),
      hAlign: 'left',
    },
  ]);

const scoreboard = (
  homeTeam,
  visitorTeam,
  { date, time, arena, city, state, display_year, display_season, broadcasters }
) => {
  const scoreboardTable = basicTable();

  const formatedTime = `${time.slice(0, 2)}:${time.slice(2, 4)}`;

  const homeTeamStartingPlayers = getStartingPlayers(homeTeam);
  const visitorTeamStartingPlayers = getStartingPlayers(visitorTeam);

  const networks = getBroadcastNetworks(broadcasters.tv.broadcaster);

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
          homeTeamStartingPlayers.filter(
            player => player.position.indexOf('G') > -1
          )[1].name
        ),
        hAlign: 'left',
      },
      bold('Team'),
      bold('Q1'),
      bold('Q2'),
      bold('Q3'),
      bold('Q4'), // FIXME OT
      bold(center('Total', 9)),
      'PG',
      {
        content: bold(
          visitorTeamStartingPlayers.filter(
            player => player.position.indexOf('G') > -1
          )[1].name
        ),
        hAlign: 'left',
      },
    ]),
    vAlignCenter([
      'SG',
      {
        content: bold(
          homeTeamStartingPlayers.filter(
            player => player.position.indexOf('G') > -1
          )[0].name
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
            player => player.position.indexOf('G') > -1
          )[0].name
        ),
        hAlign: 'left',
      },
    ]),
    vAlignCenter([
      'SF',
      {
        content: bold(
          homeTeamStartingPlayers.filter(
            player => player.position.indexOf('F') > -1
          )[1].name
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
            player => player.position.indexOf('F') > -1
          )[1].name
        ),
        hAlign: 'left',
      },
    ]),
    vAlignCenter([
      'PF',
      {
        content: bold(
          homeTeamStartingPlayers.filter(
            player => player.position.indexOf('F') > -1
          )[0].name
        ),
        hAlign: 'left',
      },
      {
        colSpan: 6,
        content: bold(
          `${emoji.get('calendar')}  ${format(date, 'YYYY/MM/DD')} ${
            formatedTime
          }`
        ),
        hAlign: 'center',
      },
      'PF',
      {
        content: bold(
          visitorTeamStartingPlayers.filter(
            player => player.position.indexOf('F') > -1
          )[0].name
        ),
        hAlign: 'left',
      },
    ]),
    vAlignCenter([
      'C',
      {
        content: bold(
          homeTeamStartingPlayers.find(player => player.position === 'C').name
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
          visitorTeamStartingPlayers.find(player => player.position === 'C')
            .name
        ),
        hAlign: 'left',
      },
    ]),
    vAlignCenter([
      {
        colSpan: 10,
        content: bold(
          `${networks.homeTeam} ${emoji.get('tv')}  ${networks.visitorTeam}`
        ),
        hAlign: 'center',
      },
    ]),
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

export default scoreboard;
