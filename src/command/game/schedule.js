import NBA from 'nba';
import inquirer from 'inquirer';
import emoji from 'node-emoji';
import { limit } from 'stringz';
import { center, left, right } from 'wide-align';
import pMap from 'p-map';
import ora from 'ora';

import Team from '../Team';

import { bold, neonGreen } from '../../utils/log';

const MAX_WIDTH = 81;
const TEAMNAME_WIDTH = 20;
const STATUS_WIDTH = 18;

const padHomeTeamName = name => bold(right(name, TEAMNAME_WIDTH));
const padVisitorTeamName = name => bold(left(name, TEAMNAME_WIDTH));
const padGameStatus = status => center(status, STATUS_WIDTH);

const createGameChoice = (homeTeam, visitorTeam, periodTime) => {
  let winner = '';
  const { period_status: periodStatus, game_clock: gameClock } = periodTime;

  if (+homeTeam.getScore() > +visitorTeam.getScore()) {
    winner = 'home';
  } else if (+homeTeam.getScore() === +visitorTeam.getScore()) {
    winner = null;
  } else {
    winner = 'visitor';
  }

  const homeTeamName = padHomeTeamName(
    winner === 'home'
      ? homeTeam.getWinnerName('left')
      : homeTeam.getName({ color: true })
  );
  const visitorTeamName = padVisitorTeamName(
    winner === 'visitor'
      ? visitorTeam.getWinnerName('right')
      : visitorTeam.getName({ color: true })
  );
  const match = `${homeTeamName}${center(
    emoji.get('basketball'),
    8
  )}${visitorTeamName}`;
  const homeTeamScore =
    winner === 'home'
      ? right(bold(neonGreen(homeTeam.getScore())), 4)
      : right(bold(homeTeam.getScore()), 4);
  const visitorTeamScore =
    winner === 'visitor'
      ? left(bold(neonGreen(visitorTeam.getScore())), 4)
      : left(bold(visitorTeam.getScore()), 4);
  const score = `${homeTeamScore} : ${visitorTeamScore}`;

  return `│⌘${match}│${score}│${padGameStatus(
    `${bold(periodStatus)} ${gameClock}`
  )}│`;
};

const schedule = async gamesData => {
  const spinner = ora('Loading Game Schedule').start();
  const header = `│ ${padHomeTeamName('Home')}${center(
    emoji.get('basketball'),
    8
  )}${padVisitorTeamName('Away')}│${center('Score', 11)}│${padGameStatus(
    'Status'
  )}│`;

  const questions = [
    {
      name: 'game',
      message: 'Which game do you want to watch?',
      type: 'list',
      pageSize: 30,
      choices: [
        new inquirer.Separator(`${limit('', MAX_WIDTH, '─')}`),
        new inquirer.Separator(header),
        new inquirer.Separator(`${limit('', MAX_WIDTH, '─')}`),
      ],
    },
  ];

  const last = gamesData.length - 1;

  await pMap(
    gamesData,
    async (gameData, index) => {
      const { home, visitor, period_time } = gameData;

      const {
        teamInfoCommon: homeTeamInfoCommon,
      } = await NBA.stats.teamInfoCommon({
        TeamID: home.id,
        Season: process.env.season,
      });
      const {
        teamInfoCommon: visitorTeamInfoCommon,
      } = await NBA.stats.teamInfoCommon({
        TeamID: visitor.id,
        Season: process.env.season,
      });

      const homeTeam = new Team({
        ...homeTeamInfoCommon[0],
        score: home.score,
        linescores: home.linescores,
        isHomeTeam: true,
      });
      const visitorTeam = new Team({
        ...visitorTeamInfoCommon[0],
        score: visitor.score,
        linescores: visitor.linescores,
        isHomeTeam: false,
      });

      questions[0].choices.push({
        name: createGameChoice(homeTeam, visitorTeam, period_time),
        value: { gameData, homeTeam, visitorTeam },
      });

      if (index !== last) {
        questions[0].choices.push(
          new inquirer.Separator(`${limit('', MAX_WIDTH, '-')}`)
        );
      } else {
        questions[0].choices.push(
          new inquirer.Separator(`${limit('', MAX_WIDTH, '─')}`)
        );
      }
    },
    { concurrency: 1 }
  );

  spinner.stop();

  const answer = await inquirer.prompt(questions);

  return answer;
};

export default schedule;
