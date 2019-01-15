import R from 'ramda';
import NBA from 'nba';
import { getGames, getBoxScore, getPlayByPlay } from 'nba-stats-client';

const nbaClient = {
  getGames,
  getBoxScore,
  getPlayByPlay,
};

const essentialMethods = [
  'updatePlayers',
  'searchPlayers',
  'playerInfo',
  'playerProfile',
  'teamSplits',
  'teamInfoCommon',
  'getGames',
  'getBoxScore',
  'getPlayByPlay',
];

const pickEssentialMethods = obj => R.pick(essentialMethods, obj);

export default R.compose(
  R.mergeAll,
  R.map(pickEssentialMethods)
)([R.omit(['stats'], NBA), R.prop('stats', NBA), nbaClient]);
