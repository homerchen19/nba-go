import NBA from 'nba';
import pMap from 'p-map';

import playInfo from './info';

const player = async playerName => {
  await NBA.updatePlayers();

  const _players = await NBA.searchPlayers(playerName);

  pMap(
    _players,
    async _player => {
      const {
        commonPlayerInfo,
        playerHeadlineStats,
      } = await NBA.stats.playerInfo({
        PlayerID: _player.playerId,
      });
      playInfo({ ...commonPlayerInfo[0], ...playerHeadlineStats[0] });
    },
    { concurrency: 5 }
  );
};

export default player;
