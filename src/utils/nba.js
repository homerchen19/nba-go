import R from 'ramda';
import NBA from 'nba';
import NBA_client from 'nba-stats-client';

const essentialMethods = [
  'updatePlayers',
  'searchPlayers',
  'playerInfo',
  'playerProfile',
  'teamSplits',
  'teamInfoCommon',
  'getGamesFromDate',
  'getBoxScoreFromDate',
  'getPlayByPlayFromDate',
];

const pickEssentialMethods = obj => R.pick(essentialMethods, obj);

export default R.compose(R.mergeAll, R.map(pickEssentialMethods))([
  R.omit(['stats'], NBA),
  R.prop('stats', NBA),
  NBA_client,
]);
