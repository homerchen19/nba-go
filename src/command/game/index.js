/* eslint-disable no-await-in-loop, no-constant-condition */
import blessed from 'blessed';

import NBA from 'nba-stats-client';
import parse from 'date-fns/parse';
import addDays from 'date-fns/add_days';
import subDays from 'date-fns/sub_days';
import emoji from 'node-emoji';
import delay from 'delay';
import jsonfile from 'jsonfile';
import path from 'path';
import { right } from 'wide-align';

import createGameMenu from './createGameMenu';
import createGameScoreboard from './createGameScoreboard';
import createGameBoxScore from './createGameBoxScore';
import createGamePlayByPlay from './createGamePlayByPlay';
import { error } from '../../utils/log';
import { cfontsDate } from '../../utils/cfonts';

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

  const screen = blessed.screen({
    smartCSR: true,
    fullUnicode: true,
  });

  screen.title = 'NBA-GO';

  switch (gameData.period_time.game_status) {
    case '1': {
      console.log('pregame');
      break;
    }

    case 'Halftime':
    case '2': {
      console.log('');
      // const i = 1;

      const baseBox = blessed.box({
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        padding: 0,
        style: {
          fg: 'black',
          bg: 'black',
          border: {
            fg: '#f0f0f0',
            bg: 'black',
          },
        },
      });

      const scoreboardTable = blessed.table({
        top: 4,
        left: 'center',
        width: '33%',
        height: 8,
        tags: true,
        border: {
          type: 'line',
        },
        style: {
          header: {
            fg: 'white',
          },
          cell: {
            fg: 'white',
          },
        },
      });

      const homeTeamFullNameText = blessed.text({
        parent: screen,
        top: 7,
        left: `33%-${homeTeam.getFullName({ color: false }).length + 24}`,
        width: 25,
        align: 'left',
        content: `${homeTeam.getFullName({
          color: true,
        })}`,
        style: {
          fg: 'white',
        },
      });

      const homeTeamStandingsText = blessed.text({
        top: 8,
        left: '33%-39',
        width: 15,
        align: 'right',
        content: right(
          `HOME (${homeTeam.getWins()} - ${homeTeam.getLoses()})`,
          15
        ),
        style: {
          fg: '#fbfbfb',
        },
      });

      const homeTeamScoreText = blessed.bigtext({
        font: path.resolve(__filename, '../../../data/fonts/ter-u12n.json'),
        fontBold: path.resolve(__filename, '../../../data/fonts/ter-u12n.json'),
        top: 2,
        left: '33%-20',
        width: 15,
        align: 'right',
        vlign: 'center',
        style: {
          fg: 'white',
        },
      });

      const visitorTeamFullNameText = blessed.text({
        top: 7,
        left: '66%+28',
        width: 25,
        align: 'left',
        content: `${visitorTeam.getFullName({
          color: true,
        })}`,
        tags: true,
        style: {
          fg: 'white',
        },
      });

      const visitorTeamStandingsText = blessed.text({
        top: 8,
        left: '66%+28',
        width: 15,
        align: 'left',
        content: `(${visitorTeam.getWins()} - ${visitorTeam.getLoses()}) AWAY`,
        style: {
          fg: '#fbfbfb',
        },
      });

      const visitorTeamScoreText = blessed.bigtext({
        font: path.resolve(__filename, '../../../data/fonts/ter-u12n.json'),
        fontBold: path.resolve(__filename, '../../../data/fonts/ter-u12n.json'),
        top: 2,
        left: '66%+6',
        width: 15,
        align: 'left',
        style: {
          fg: 'white',
        },
      });

      const timeText = blessed.text({
        top: 2,
        left: 'center',
        width: 10,
        align: 'center',
        style: {
          fg: 'white',
        },
      });

      const playByPlayTable = blessed.box({
        parent: screen,
        top: 15,
        left: 5,
        width: '75%-5',
        height: '100%-15',
        padding: {
          top: 0,
          right: 0,
          left: 2,
          bottom: 0,
        },
        align: 'left',
        keys: true,
        vi: true,
        scrollable: true,
        focused: true,
        label: ' Play By Play ',
        border: {
          type: 'line',
        },
        scrollbar: {
          ch: ' ',
          track: {
            bg: '#0253a4',
          },
          style: {
            inverse: true,
          },
        },
      });

      screen.append(baseBox);
      screen.append(timeText);
      screen.append(homeTeamFullNameText);
      screen.append(homeTeamStandingsText);
      screen.append(homeTeamScoreText);
      screen.append(visitorTeamFullNameText);
      screen.append(visitorTeamStandingsText);
      screen.append(visitorTeamScoreText);
      screen.append(scoreboardTable);
      screen.append(playByPlayTable);
      screen.key(['escape', 'q', 'C-c'], () => process.exit(0));

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

        await delay(1000);
      }
      break;
    }

    case '3':
    default: {
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
