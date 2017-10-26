import NBA from 'nba-stats-client';
import parse from 'date-fns/parse';

import createGameList from './createGameList';

const game = async date => {
  const {
    sports_content: { games: { game: gamesData } },
  } = await NBA.getGamesFromDate(parse(date));

  const answer = await createGameList(gamesData);
  console.log(answer);
};

export default game;
