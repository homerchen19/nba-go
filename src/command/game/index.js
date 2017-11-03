/* eslint-disable no-await-in-loop, no-constant-condition */

import NBA from 'nba-stats-client';
import parse from 'date-fns/parse';
import addDays from 'date-fns/add_days';
import subDays from 'date-fns/sub_days';
import emoji from 'node-emoji';
import delay from 'delay';
import jsonfile from 'jsonfile';
import path from 'path';

import createGameMenu from './createGameMenu';
import createGameScoreboard from './createGameScoreboard';
import createGameBoxScore from './createGameBoxScore';
import createGamePlayByPlay from './createGamePlayByPlay';
import { error, bold } from '../../utils/log';
import { cfontsDate } from '../../utils/cfonts';
import getBlessed from '../../utils/blessed';

const game = async option => {
  let _date;
  let gamesData;
  let gameBoxScoreData;
  let seasonMeta;

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

  if (process.env.NODE_ENV === 'development_fake') {
    const {
      sports_content: { games: { game: fakeGamesData } },
    } = await jsonfile.readFileSync(
      path.resolve(__filename, '../../../data/scoreboard.json')
    );

    gamesData = fakeGamesData;
  } else {
    const {
      sports_content: { games: { game: realGamesData } },
    } = await NBA.getGamesFromDate(parse(_date));

    gamesData = realGamesData;
  }

  const { game: { homeTeam, visitorTeam, gameData } } = await createGameMenu(
    gamesData
  );

  if (process.env.NODE_ENV === 'development_fake') {
    const {
      sports_content: {
        game: fakeGameBoxScoreData,
        sports_meta: { season_meta: fakeSeasonMeta },
      },
    } = await jsonfile.readFileSync(
      path.resolve(__filename, '../../../data/boxscore.json')
    );

    gameBoxScoreData = fakeGameBoxScoreData;
    seasonMeta = fakeSeasonMeta;
  } else {
    const {
      sports_content: {
        game: realGameBoxScoreData,
        sports_meta: { season_meta: realSeasonMeta },
      },
    } = await NBA.getBoxScoreFromDate(parse(_date), gameData.id);

    gameBoxScoreData = realGameBoxScoreData;
    seasonMeta = realSeasonMeta;
  }
  const { home, visitor } = gameBoxScoreData;

  homeTeam.setGameStats(home.stats);
  homeTeam.setPlayers(home.players.player);
  homeTeam.setGameLeaders(home.Leaders);
  visitorTeam.setGameStats(visitor.stats);
  visitorTeam.setPlayers(visitor.players.player);
  visitorTeam.setGameLeaders(visitor.Leaders);

  // gameData.period_time.game_status = '2';

  const {
    screen,
    scoreboardTable,
    seasonText,
    timeText,
    arenaText,
    homeTeamScoreText,
    visitorTeamScoreText,
    playByPlayTable,
  } = getBlessed(homeTeam, visitorTeam);

  switch (gameData.period_time.game_status) {
    case '1': {
      console.log('pregame');
      break;
    }

    case 'Halftime':
    case '2': {
      console.log('');
      // let i = 1;
      seasonText.setContent(
        bold(`${seasonMeta.display_year} ${seasonMeta.display_season}`)
      );
      const { arena, city, state } = gameBoxScoreData;
      arenaText.setContent(`🏠  ${arena} | ${city}, ${state}`);

      while (true) {
        let gamePlayByPlayData = {};

        if (process.env.NODE_ENV === 'development_fake') {
          const {
            sports_content: { game: fakePlayByPlayData },
          } = await jsonfile.readFileSync(
            path.resolve(__filename, '../../../data/playbyplay.json')
          );
          gamePlayByPlayData = fakePlayByPlayData;
        } else {
          const {
            sports_content: { game: realPlayByPlayData },
          } = await NBA.getPlayByPlayFromDate(parse(_date), gameData.id);
          gamePlayByPlayData = realPlayByPlayData;
        }

        const lastPlay = gamePlayByPlayData.play.slice(-1).pop();
        homeTeam.setGameScore(lastPlay.home_score);
        visitorTeam.setGameScore(lastPlay.visitor_score);
        // homeTeam.setGameScore(`${(i += 3)}`);
        // visitorTeam.setGameScore(`${(i += 3)}`);

        const isFinal =
          (lastPlay.period === '4' || +lastPlay.period > 4) &&
          lastPlay.description === 'End Period' &&
          lastPlay.home_score !== lastPlay.visitor_score;

        createGamePlayByPlay(
          homeTeam,
          visitorTeam,
          {
            ...gamePlayByPlayData,
            ...seasonMeta,
            isFinal,
          },
          {
            screen,
            scoreboardTable,
            timeText,
            homeTeamScoreText,
            visitorTeamScoreText,
            playByPlayTable,
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
      createGameScoreboard(homeTeam, visitorTeam, {
        ...gameBoxScoreData,
        ...seasonMeta,
      });
      console.log('');
      createGameBoxScore(homeTeam, visitorTeam);
    }
  }
};

export default game;
