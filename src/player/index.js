const NBA = require('nba');
const pMap = require('p-map');

const playInfo = require('./info');

async function player(playerName) {
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
}

module.exports = player;
