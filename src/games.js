const leftPad = require('left-pad');
const rightPad = require('right-pad');
const NBA = require('nba-stats-client');
const parse = require('date-fns/parse');
const inquirer = require('inquirer');
const emoji = require('node-emoji');

const Team = require('./Team');

async function games(date) {
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
  gamesData.forEach(game => {
    const homeTeam = new Team(game.home);
    const visitorTeam = new Team(game.visitor);

    questions[0].choices.push({
      name: `${leftPad(homeTeam.getEmogiNickname('left'), 15)} ${emoji.get(
        'basketball'
      )}  ${rightPad(visitorTeam.getEmogiNickname('right'), 15)}`,
      value: game,
    });
  });

  const answer = await inquirer.prompt(questions);
  console.log(answer);
}

module.exports = games;
