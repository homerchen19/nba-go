import inquirer from 'inquirer';
import emoji from 'node-emoji';
import { limit } from 'stringz';
import { center, left, right } from 'wide-align';
import pMap from 'p-map';
import ora from 'ora';

import getBroadcastNetworks from './network';
import Team from '../Team';

import NBA from '../../utils/nba';
import { bold, neonGreen } from '../../utils/log';

const MAX_WIDTH = 81;
const TEAMNAME_WIDTH = 20;
const STATUS_WIDTH = 18;
const NETWORK_WIDTH = 35;
const MAX_WIDTH_WITH_NETWORKS = 156;

const padHomeTeamName = name => bold(right(name, TEAMNAME_WIDTH));
const padVisitorTeamName = name => bold(left(name, TEAMNAME_WIDTH));
const padGameStatus = status => center(status, STATUS_WIDTH);
const padHomeTeamNetwork = network => bold(right(network, NETWORK_WIDTH));
const padAwayTeamNetwork = network => bold(left(network, NETWORK_WIDTH));

const createGameChoice = (homeTeam, visitorTeam, periodTime, broadcasters) => {
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
  const match = `${homeTeamName}${center(emoji.get('basketball'), 8)}${
    visitorTeamName
  }`;
  const homeTeamScore =
    winner === 'home'
      ? right(bold(neonGreen(homeTeam.getScore())), 4)
      : right(bold(homeTeam.getScore()), 4);
  const visitorTeamScore =
    winner === 'visitor'
      ? left(bold(neonGreen(visitorTeam.getScore())), 4)
      : left(bold(visitorTeam.getScore()), 4);
  const score = `${homeTeamScore} : ${visitorTeamScore}`;

  if (broadcasters) {
    const networks = getBroadcastNetworks(broadcasters.tv.broadcaster);
    const networksOutput = `${padHomeTeamNetwork(
      networks.homeTeam
    )} ${emoji.get('tv')}  ${padAwayTeamNetwork(networks.visitorTeam)}|`;
    return `│⌘${match}│${score}│${padGameStatus(
      `${bold(periodStatus)} ${gameClock}`
    )}│${networksOutput}`;
  }
  return `│⌘${match}│${score}│${padGameStatus(
    `${bold(periodStatus)} ${gameClock}`
  )}│`;
};

const getTeamInfo = async (team, seasonId) => {
  const { teamInfoCommon: teamInfo } = await NBA.teamInfoCommon({
    TeamID: team.id,
    Season: seasonId,
  });

  return new Team({
    ...teamInfo[0],
    score: team.score,
    linescores: team.linescores,
    isHomeTeam: true,
  });
};

const chooseGameFromSchedule = async (gamesData, option) => {
  const spinner = ora('Loading Game Schedule').start();
  let networksHeader = '';
  if (option.networks) {
    networksHeader = `${padHomeTeamNetwork('Home')} ${emoji.get(
      'tv'
    )}  ${padAwayTeamNetwork('Away')}|`;
  }
  const header = `│ ${padHomeTeamName('Home')}${center(
    emoji.get('basketball'),
    8
  )}${padVisitorTeamName('Away')}│${center('Score', 11)}│${padGameStatus(
    'Status'
  )}│${networksHeader}`;

  const tableWidth = !option.networks ? MAX_WIDTH : MAX_WIDTH_WITH_NETWORKS;
  const questions = [
    {
      name: 'game',
      message: 'Which game do you want to watch?',
      type: 'list',
      pageSize: 30,
      choices: [
        new inquirer.Separator(`${limit('', tableWidth, '─')}`),
        new inquirer.Separator(header),
        new inquirer.Separator(`${limit('', tableWidth, '─')}`),
      ],
    },
  ];

  const last = gamesData.length - 1;

  await pMap(
    gamesData,
    async (gameData, index) => {
      const { home, visitor, period_time, broadcasters } = gameData;
      const homeTeam = await getTeamInfo(home, process.env.season);
      const visitorTeam = await getTeamInfo(visitor, process.env.season);

      questions[0].choices.push({
        name: createGameChoice(
          homeTeam,
          visitorTeam,
          period_time,
          !option.networks ? null : broadcasters
        ),
        value: { gameData, homeTeam, visitorTeam },
      });

      if (index !== last) {
        questions[0].choices.push(
          new inquirer.Separator(`${limit('', tableWidth, '─')}`)
        );
      } else {
        questions[0].choices.push(
          new inquirer.Separator(`${limit('', tableWidth, '─')}`)
        );
      }
    },
    { concurrency: 1 }
  );

  spinner.stop();

  const answer = await inquirer.prompt(questions);

  return answer;
};

export default chooseGameFromSchedule;
export { getTeamInfo };
