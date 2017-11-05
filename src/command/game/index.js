/* eslint-disable no-await-in-loop, no-constant-condition */

import NBA from 'nba';
import NBA_client from 'nba-stats-client';
import parse from 'date-fns/parse';
import addDays from 'date-fns/add_days';
import subDays from 'date-fns/sub_days';
import emoji from 'node-emoji';
import delay from 'delay';
import ora from 'ora';
import format from 'date-fns/format';

import schedule from './schedule';
import preview from './preview';
import scoreboard from './scoreboard';
import boxScore from './boxScore';
import live from './live';

import { error, bold } from '../../utils/log';
import { cfontsDate } from '../../utils/cfonts';
import getBlessed from '../../utils/blessed';

const game = async option => {
  let _date;

  if (option.date) {
    _date = option.date;
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

  cfontsDate(_date);

  const {
    sports_content: { games: { game: gamesData } },
  } = await NBA_client.getGamesFromDate(parse(_date));

  const { game: { homeTeam, visitorTeam, gameData } } = await schedule(
    gamesData
  );

  const {
    sports_content: {
      game: _gameBoxScoreData,
      sports_meta: { season_meta: seasonMetaData },
    },
  } = await NBA_client.getBoxScoreFromDate(parse(_date), gameData.id);

  let gameBoxScoreData = _gameBoxScoreData;

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

      const {
        overallTeamDashboard: [homeTeamDashboardData],
      } = await NBA.stats.teamSplits({
        Season: '2017-18',
        TeamID: homeTeam.getID(),
      });
      const {
        overallTeamDashboard: [visitorTeamDashboardData],
      } = await NBA.stats.teamSplits({
        Season: '2017-18',
        TeamID: visitorTeam.getID(),
      });

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

        const {
          sports_content: { game: updatedPlayByPlayData },
        } = await NBA_client.getPlayByPlayFromDate(parse(_date), gameData.id);
        const {
          sports_content: { game: updatedGameBoxScoreData },
        } = await NBA_client.getBoxScoreFromDate(parse(_date), gameData.id);

        gamePlayByPlayData = updatedPlayByPlayData;
        gameBoxScoreData = updatedGameBoxScoreData;

        const lastPlay = gamePlayByPlayData.play.slice(-1).pop();
        homeTeam.setGameScore(lastPlay.home_score);
        visitorTeam.setGameScore(lastPlay.visitor_score);

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
