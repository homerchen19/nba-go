/* eslint-disable no-await-in-loop, no-constant-condition */

import R from 'ramda';
import parse from 'date-fns/parse';
import addDays from 'date-fns/add_days';
import subDays from 'date-fns/sub_days';
import format from 'date-fns/format';
import isValid from 'date-fns/is_valid';
import emoji from 'node-emoji';
import delay from 'delay';
import ora from 'ora';

import chooseGameFromSchedule, { getTeamInfo } from './schedule';
import preview from './preview';
import scoreboard from './scoreboard';
import boxScore from './boxScore';
import live from './live';
import getBroadcastNetworks from './network';

import setSeason from '../../utils/setSeason';
import getApiDate from '../../utils/getApiDate';
import NBA from '../../utils/nba';
import { error, bold } from '../../utils/log';
import { cfontsDate } from '../../utils/cfonts';
import getBlessed from '../../utils/blessed';
import catchAPIError from '../../utils/catchAPIError';

const getGameWithOptionalFilter = async (games, option) => {
  if (option.filter && option.filter.split('=')[0] === 'team') {
    // TODO: Add more robust filtering but use team as proof of concept
    const components = option.filter.split('=');
    const team = components[1].toLowerCase();
    const potentialGames = games.filter(
      data =>
        `${data.home.city.toLowerCase()} ${data.home.nickname.toLowerCase()}`.indexOf(
          team
        ) !== -1 ||
        `${data.visitor.city.toLowerCase()} ${data.visitor.nickname.toLowerCase()}`.indexOf(
          team
        ) !== -1
    );

    if (!potentialGames.length) {
      error(`Can't find any teams that match ${team}`);
    } else if (potentialGames.length === 1) {
      const homeTeam = await getTeamInfo(potentialGames[0].home);
      const visitorTeam = await getTeamInfo(potentialGames[0].visitor);

      return { game: { gameData: potentialGames[0], homeTeam, visitorTeam } };
    } else {
      return chooseGameFromSchedule(potentialGames);
    }
  }

  return chooseGameFromSchedule(games, option);
};

const game = async option => {
  let _date;
  let gamesData;
  let gameBoxScoreData;
  let seasonMetaData;

  if (option.date) {
    if (
      R.compose(
        isValid,
        parse
      )(option.date)
    ) {
      _date = format(option.date, 'YYYY-MM-DD');
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

  R.compose(
    cfontsDate,
    setSeason
  )(_date);

  const apiDate = getApiDate(_date);

  try {
    const {
      sports_content: {
        games: { game: _gamesData },
      },
    } = await NBA.getGames(apiDate);

    gamesData = _gamesData;
    if (!gamesData.length) {
      error('No game available on this date.');
      process.exit(1);
    }
  } catch (err) {
    catchAPIError(err, 'NBA.getGames()');
  }

  const {
    game: { homeTeam, visitorTeam, gameData },
  } = await getGameWithOptionalFilter(gamesData, option);

  try {
    const {
      sports_content: {
        game: _gameBoxScoreData,
        sports_meta: { season_meta: _seasonMetaData },
      },
    } = await NBA.getBoxScore({ ...apiDate, gameId: gameData.id });

    gameBoxScoreData = _gameBoxScoreData;
    seasonMetaData = _seasonMetaData;
  } catch (err) {
    catchAPIError(err, 'NBA.getBoxScore()');
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
    networkText,
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
        } = await NBA.teamSplits({
          Season: process.env.season,
          TeamID: homeTeam.getID(),
        });
        const {
          overallTeamDashboard: [_visitorTeamDashboardData],
        } = await NBA.teamSplits({
          Season: process.env.season,
          TeamID: visitorTeam.getID(),
        });

        homeTeamDashboardData = _homeTeamDashboardData;
        visitorTeamDashboardData = _visitorTeamDashboardData;
      } catch (err) {
        catchAPIError(err, 'NBA.teamSplits()');
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
      const { arena, city, state, date, time, broadcasters } = gameBoxScoreData;

      const networks = getBroadcastNetworks(broadcasters.tv.broadcaster);

      dateText.setContent(
        `${emoji.get('calendar')}  ${format(date, 'YYYY/MM/DD')} ${time.slice(
          0,
          2
        )}:${time.slice(2, 4)}`
      );
      arenaText.setContent(
        `${emoji.get('house')}  ${arena} | ${city}, ${state}`
      );
      networkText.setContent(
        `${networks.homeTeam} ${emoji.get('tv')}  ${networks.visitorTeam}`
      );
      while (true) {
        let gamePlayByPlayData = {};

        try {
          const {
            sports_content: { game: _updatedPlayByPlayData },
          } = await NBA.getPlayByPlay({ ...apiDate, gameId: gameData.id });

          updatedPlayByPlayData = _updatedPlayByPlayData;
        } catch (err) {
          catchAPIError(err, 'NBA.getPlayByPlay()');
        }

        try {
          const {
            sports_content: { game: _updatedGameBoxScoreData },
          } = await NBA.getBoxScore({ ...apiDate, gameId: gameData.id });

          updatedGameBoxScoreData = _updatedGameBoxScoreData;
        } catch (err) {
          catchAPIError(err, 'NBA.getBoxScore()');
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
