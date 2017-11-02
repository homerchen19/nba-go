/* eslint-disable no-console */

import { basicTable } from '../../utils/table';
import { bold, neonGreen } from '../../utils/log';

const alignCenter = columns =>
  columns.map(content => ({ content, hAlign: 'left', vAlign: 'center' }));

const createTeamBoxScore = team => {
  const players = team.getPlayers();
  const stats = team.getGameStats();
  const boxScoreTable = basicTable();

  boxScoreTable.push(
    [
      {
        colSpan: 16,
        content: team.getFullName({ color: true }),
        hAlign: 'left',
        vAlign: 'center',
      },
    ],
    alignCenter([
      bold('PLAYER'),
      bold(''),
      bold('MIN'),
      bold('FG'),
      bold('3FG'),
      bold('FT'),
      bold('+/-'),
      bold('OREB'),
      bold('DREB'),
      bold('REB'),
      bold('AST'),
      bold('STL'),
      bold('BLK'),
      bold('TO'),
      bold('PF'),
      bold('PTS'),
    ])
  );

  players.forEach(player => {
    const {
      first_name,
      last_name,
      position_short,
      minutes,
      field_goals_made,
      field_goals_attempted,
      three_pointers_made,
      three_pointers_attempted,
      free_throws_made,
      free_throws_attempted,
      plus_minus,
      rebounds_offensive,
      rebounds_defensive,
      assists,
      steals,
      blocks,
      turnovers,
      fouls,
      points,
    } = player;

    boxScoreTable.push(
      alignCenter([
        bold(`${first_name} ${last_name}`),
        position_short,
        minutes,
        `${field_goals_made}-${field_goals_attempted}`,
        `${three_pointers_made}-${three_pointers_attempted}`,
        `${free_throws_made}-${free_throws_attempted}`,
        plus_minus,
        rebounds_offensive,
        rebounds_defensive,
        parseInt(rebounds_offensive, 10) + parseInt(rebounds_defensive, 10),
        assists,
        steals,
        blocks,
        turnovers,
        fouls,
        points,
      ])
    );
  });

  const {
    points,
    field_goals_made,
    field_goals_attempted,
    free_throws_made,
    free_throws_attempted,
    three_pointers_made,
    three_pointers_attempted,
    rebounds_offensive,
    rebounds_defensive,
    assists,
    fouls,
    steals,
    turnovers,
    blocks,
  } = stats;

  boxScoreTable.push(
    alignCenter([
      'Totals',
      '',
      '',
      bold(`${field_goals_made}-${field_goals_attempted}`),
      bold(`${three_pointers_made}-${three_pointers_attempted}`),
      bold(`${free_throws_made}-${free_throws_attempted}`),
      '',
      bold(rebounds_offensive),
      bold(rebounds_defensive),
      bold(parseInt(rebounds_offensive, 10) + parseInt(rebounds_defensive, 10)),
      bold(assists),
      bold(steals),
      bold(blocks),
      bold(turnovers),
      bold(fouls),
      bold(neonGreen(points)),
    ])
  );

  console.log(boxScoreTable.toString());
};

const createGameBoxScore = (homeTeam, visitorTeam) => {
  createTeamBoxScore(homeTeam);
  console.log('');
  createTeamBoxScore(visitorTeam);
};

export default createGameBoxScore;
