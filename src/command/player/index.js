import pMap from 'p-map';
import emoji from 'node-emoji';

import playerInfo from './info';
import seasonStats from './seasonStats';

import NBA from '../../utils/nba';
import catchAPIError from '../../utils/catchAPIError';

const player = async (playerName, option) => {
  await NBA.updatePlayers();

  const _players = await NBA.searchPlayers(playerName);

  pMap(
    _players,
    async _player => {
      let commonPlayerInfo;
      let playerHeadlineStats;

      try {
        const {
          commonPlayerInfo: _commonPlayerInfo,
          playerHeadlineStats: _playerHeadlineStats,
        } = await NBA.playerInfo({
          PlayerID: _player.playerId,
        });

        commonPlayerInfo = _commonPlayerInfo;
        playerHeadlineStats = _playerHeadlineStats;
      } catch (err) {
        catchAPIError(err, 'NBA.playerInfo()');
      }

      if (option.info) {
        playerInfo({ ...commonPlayerInfo[0], ...playerHeadlineStats[0] });
      }

      if (option.regular) {
        let seasonTotalsRegularSeason;
        let careerTotalsRegularSeason;

        try {
          const {
            seasonTotalsRegularSeason: _seasonTotalsRegularSeason,
            careerTotalsRegularSeason: _careerTotalsRegularSeason,
          } = await NBA.playerProfile({
            PlayerID: _player.playerId,
          });

          seasonTotalsRegularSeason = _seasonTotalsRegularSeason;
          careerTotalsRegularSeason = _careerTotalsRegularSeason;
        } catch (err) {
          catchAPIError(err, 'NBA.playerProfile()');
        }

        commonPlayerInfo[0].nowTeamAbbreviation =
          commonPlayerInfo[0].teamAbbreviation;

        seasonStats({
          seasonTtpe: 'Regular Season',
          ...commonPlayerInfo[0],
          seasonTotals: seasonTotalsRegularSeason,
          careerTotals: careerTotalsRegularSeason[0],
        });
      }

      if (option.playoffs) {
        let seasonTotalsPostSeason;
        let careerTotalsPostSeason;
        try {
          const {
            seasonTotalsPostSeason: _seasonTotalsPostSeason,
            careerTotalsPostSeason: _careerTotalsPostSeason,
          } = await NBA.playerProfile({
            PlayerID: _player.playerId,
          });

          seasonTotalsPostSeason = _seasonTotalsPostSeason;
          careerTotalsPostSeason = _careerTotalsPostSeason;
        } catch (err) {
          catchAPIError(err, 'NBA.playerProfile()');
        }

        if (careerTotalsPostSeason.length === 0) {
          console.log(
            `Sorry, ${_player.firstName} ${
              _player.lastName
            } doesn't have any playoffs data ${emoji.get('confused')}`
          );
        } else {
          commonPlayerInfo[0].nowTeamAbbreviation =
            commonPlayerInfo[0].teamAbbreviation;

          seasonStats({
            seasonTtpe: 'Playoffs',
            ...commonPlayerInfo[0],
            seasonTotals: seasonTotalsPostSeason,
            careerTotals: careerTotalsPostSeason[0],
          });
        }
      }
    },
    { concurrency: 1 }
  );
};

export default player;
