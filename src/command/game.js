import leftPad from 'left-pad';
import rightPad from 'right-pad';
import NBA from 'nba-stats-client';
import parse from 'date-fns/parse';
import inquirer from 'inquirer';
import emoji from 'node-emoji';

import Team from './Team';

const game = async date => {
  const questions = [
    {
      name: 'game',
      message: 'Which game do you want to watch?',
      type: 'list',
      pageSize: 30,
      choices: [],
    },
  ];
  const {
    sports_content: { games: { game: gamesData } },
  } = await NBA.getGamesFromDate(parse(date));
  gamesData.forEach(gameData => {
    const homeTeam = new Team(gameData.home);
    const visitorTeam = new Team(gameData.visitor);

    questions[0].choices.push({
      name: `${leftPad(homeTeam.getEmogiNickname('left'), 15)} ${emoji.get(
        'basketball'
      )}  ${rightPad(visitorTeam.getEmogiNickname('right'), 15)}`,
      value: gameData,
    });
  });

  const answer = await inquirer.prompt(questions);
  console.log(answer);
};

export default game;
