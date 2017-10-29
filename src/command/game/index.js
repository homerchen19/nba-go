import NBA from 'nba-stats-client';
import parse from 'date-fns/parse';
import addDays from 'date-fns/add_days';
import subDays from 'date-fns/sub_days';
import emoji from 'node-emoji';

import createGameMenu from './createGameMenu';
import createGameScoreboard from './createGameScoreboard';
import createGameBoxScore from './createGameBoxScore';
import { error } from '../../utils/log';
import { cfontsDate, cfontsGameTitle } from '../../utils/cfonts';

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
  } = await NBA.getGamesFromDate(parse(_date));

  const { game: { homeTeam, visitorTeam, gameData } } = await createGameMenu(
    gamesData
  );

  switch (gameData.period_time.game_status) {
    case '1': {
      console.log('pregame');
      break;
    }

    case 'Halftime':
    case '2': {
      console.log('gaming');
      break;
    }

    case '3':
    default: {
      cfontsGameTitle(homeTeam);
      createGameScoreboard(homeTeam, visitorTeam, gameData);
      cfontsGameTitle(visitorTeam);

      const {
        sports_content: { game: { home, visitor } },
      } = await NBA.getBoxScoreFromDate(parse(_date), gameData.id);

      homeTeam.setGameStats(home.stats);
      homeTeam.setGamePlayers(home.players.player);
      visitorTeam.setGameStats(visitor.stats);
      visitorTeam.setGamePlayers(visitor.players.player);

      createGameBoxScore(homeTeam, visitorTeam);
    }
  }
};

export default game;
