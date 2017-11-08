/* eslint-disable no-await-in-loop, no-constant-condition */

import NBA from 'nba';
import NBA_client from 'nba-stats-client';
import parse from 'date-fns/parse';
import addDays from 'date-fns/add_days';
import subDays from 'date-fns/sub_days';
import format from 'date-fns/format';
import getYear from 'date-fns/get_year';
import getMonth from 'date-fns/get_month';
import isValid from 'date-fns/is_valid';
import emoji from 'node-emoji';
import delay from 'delay';
import ora from 'ora';

import schedule from './schedule';
import preview from './preview';
import scoreboard from './scoreboard';
import boxScore from './boxScore';
import live from './live';

import { error, bold } from '../../utils/log';
import { cfontsDate } from '../../utils/cfonts';
import getBlessed from '../../utils/blessed';

const catchError = (err, apiName) => {
  error(err);
  console.log('');
  error(`Oops, ${apiName} goes wrong.`);
  error(
    'Please run nba-go again.\nIf it still does not work, feel free to open an issue on https://github.com/xxhomey19/nba-go/issues'
  );
  process.exit(1);
};

const getSeason = date => {
  const year = getYear(new Date(date));
  const month = getMonth(new Date(date));

  if (year < 2012 || (year === 2012 && month < 5)) {
    error(
      `Sorry, https://stats.nba.com/ doesn't provide season data before 2012-13 ${emoji.get(
        'confused'
      )}`
    );
    process.exit(1);
  }

  if (month > 9) {
    process.env.season = `${year}-${(year + 1).toString().slice(-2)}`;
  } else {
    process.env.season = `${year - 1}-${year.toString().slice(-2)}`;
  }
};

const game = async option => {
  let _date;
  let gamesData;
  let gameBoxScoreData;
  let seasonMetaData;

  if (option.date) {
    if (isValid(new Date(option.date))) {
      _date = format(parse(option.date), 'YYYY/MM/DD');
    } else {
      error('Date is invalid');
      process.exit(1);
    }
  } else if (option.today) {
    _date = Date.now();
  } else if (option.tomorrow) {
    _date = addDays(Date.now(), 1);
  } else if (option.yesterday) {
    _date = subDays(Date.now(), 1);
  } else {
    error(`Can't find any option ${emoji.get('confused')}`);
    process.exit(1);
  }

  getSeason(_date);

  cfontsDate(_date);

  try {
    const {
      sports_content: { games: { game: _gamesData } },
    } = await NBA_client.getGamesFromDate(new Date(_date));
    gamesData = _gamesData;
  } catch (err) {
    catchError(err, 'NBA_client.getGamesFromDate()');
  }

  const { game: { homeTeam, visitorTeam, gameData } } = await schedule(
    gamesData
  );

  try {
    const {
      sports_content: {
        game: _gameBoxScoreData,
        sports_meta: { season_meta: _seasonMetaData },
      },
    } = await NBA_client.getBoxScoreFromDate(new Date(_date), gameData.id);

    gameBoxScoreData = _gameBoxScoreData;
    seasonMetaData = _seasonMetaData;
  } catch (err) {
    catchError(err, 'NBA_client.getBoxScoreFromDate()');
  }

  const { home, visitor } = gameBoxScoreData;

  homeTeam.setGameStats(home.stats);
  homeTeam.setPlayers(home.players.player);
  homeTeam.setGameLeaders(home.Leaders);
  visitorTeam.setGameStats(visitor.stats);
  visitorTeam.setPlayers(visitor.players.player);
  visitorTeam.setGameLeaders(visitor.Leaders);

  const {
    screen,
    scoreboardTable,
    seasonText,
    timeText,
    dateText,
    arenaText,
    homeTeamScoreText,
    visitorTeamScoreText,
    playByPlayBox,
    boxscoreTable,
  } = getBlessed(homeTeam, visitorTeam);

  switch (gameData.period_time.game_status) {
    case '1': {
      screen.destroy();
      console.log('');

      const spinner = ora('Loading Game Preview').start();

      let homeTeamDashboardData;
      let visitorTeamDashboardData;

      try {
        const {
          overallTeamDashboard: [_homeTeamDashboardData],
        } = await NBA.stats.teamSplits({
          Season: process.env.season,
          TeamID: homeTeam.getID(),
        });
        const {
          overallTeamDashboard: [_visitorTeamDashboardData],
        } = await NBA.stats.teamSplits({
          Season: process.env.season,
          TeamID: visitorTeam.getID(),
        });

        homeTeamDashboardData = _homeTeamDashboardData;
        visitorTeamDashboardData = _visitorTeamDashboardData;
      } catch (err) {
        catchError(err, 'NBA.stats.teamSplits()');
      }

      spinner.stop();

      preview(homeTeam, visitorTeam, {
        ...seasonMetaData,
        ...gameBoxScoreData,
        homeTeamDashboardData,
        visitorTeamDashboardData,
      });
      break;
    }

    case 'Halftime':
    case '2': {
      let updatedPlayByPlayData;
      let updatedGameBoxScoreData;

      seasonText.setContent(
        bold(`${seasonMetaData.display_year} ${seasonMetaData.display_season}`)
      );
      const { arena, city, state, date, time } = gameBoxScoreData;
      dateText.setContent(
        `${emoji.get('calendar')}  ${format(date, 'YYYY/MM/DD')} ${time.slice(
          0,
          2
        )}:${time.slice(2, 4)}`
      );
      arenaText.setContent(
        `${emoji.get('house')}  ${arena} | ${city}, ${state}`
      );

      while (true) {
        let gamePlayByPlayData = {};

        try {
          const {
            sports_content: { game: _updatedPlayByPlayData },
          } = await NBA_client.getPlayByPlayFromDate(
            new Date(_date),
            gameData.id
          );

          updatedPlayByPlayData = _updatedPlayByPlayData;
        } catch (err) {
          catchError(err, 'NBA_client.getPlayByPlayFromDate()');
        }

        try {
          const {
            sports_content: { game: _updatedGameBoxScoreData },
          } = await NBA_client.getBoxScoreFromDate(
            new Date(_date),
            gameData.id
          );

          updatedGameBoxScoreData = _updatedGameBoxScoreData;
        } catch (err) {
          catchError(err, 'NBA_client.getBoxScoreFromDate()');
        }

        gamePlayByPlayData = updatedPlayByPlayData;
        gameBoxScoreData = updatedGameBoxScoreData;

        const lastPlay = gamePlayByPlayData.play.slice(-1).pop();
        homeTeam.setScore(lastPlay.home_score);
        visitorTeam.setScore(lastPlay.visitor_score);

        const isFinal =
          (lastPlay.period === '4' || +lastPlay.period > 4) &&
          lastPlay.description === 'End Period' &&
          lastPlay.home_score !== lastPlay.visitor_score;

        live(
          homeTeam,
          visitorTeam,
          {
            ...gamePlayByPlayData,
            ...seasonMetaData,
            isFinal,
          },
          gameBoxScoreData,
          {
            screen,
            scoreboardTable,
            timeText,
            homeTeamScoreText,
            visitorTeamScoreText,
            playByPlayBox,
            boxscoreTable,
          }
        );

        if (isFinal) {
          break;
        }

        await delay(
          gameData.period_time.game_status === 'Halftime' ? 15000 : 3000
        );
      }
      break;
    }

    case '3':
    default: {
      screen.destroy();
      console.log('');
      scoreboard(homeTeam, visitorTeam, {
        ...gameBoxScoreData,
        ...seasonMetaData,
      });
      console.log('');
      boxScore(homeTeam, visitorTeam);
    }
  }
};

export default game;
