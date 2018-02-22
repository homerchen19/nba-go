import blessed from 'blessed';
import path from 'path';
import { right } from 'wide-align';

const getBlessed = (homeTeam, visitorTeam) => {
  const screen = blessed.screen({
    smartCSR: true,
    fullUnicode: true,
    title: 'NBA-GO',
  });

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
    top: 5,
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
    content: right(`HOME (${homeTeam.getWins()} - ${homeTeam.getLoses()})`, 15),
    style: {
      fg: '#fbfbfb',
    },
  });

  const homeTeamScoreText = blessed.bigtext({
    font: path.join(__dirname, './fonts/ter-u12n.json'),
    fontBold: path.join(__dirname, './fonts/ter-u12b.json'),
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
    font: path.join(__dirname, './fonts/ter-u12n.json'),
    fontBold: path.join(__dirname, './fonts/ter-u12b.json'),
    top: 2,
    left: '66%+6',
    width: 15,
    align: 'left',
    style: {
      fg: 'white',
    },
  });

  const seasonText = blessed.text({
    top: 0,
    left: 'center',
    align: 'center',
    style: {
      fg: 'white',
    },
  });

  const timeText = blessed.text({
    top: 13,
    left: 'center',
    align: 'center',
    style: {
      fg: 'white',
    },
  });

  const dateText = blessed.text({
    top: 2,
    left: 'center',
    align: 'center',
    style: {
      fg: 'white',
    },
  });

  const arenaText = blessed.text({
    top: 3,
    left: 'center',
    align: 'center',
    style: {
      fg: 'white',
    },
  });

  const networkText = blessed.text({
    top: 4,
    left: 'center',
    align: 'center',
    style: {
      fg: 'white',
    },
  });

  const playByPlayBox = blessed.box({
    parent: screen,
    top: 15,
    left: 3,
    width: '70%-3',
    height: '100%-15',
    padding: {
      top: 0,
      right: 0,
      left: 2,
      bottom: 0,
    },
    align: 'left',
    keys: true,
    mouse: false,
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

  const boxscoreTable = blessed.table({
    parent: screen,
    top: 15,
    left: '70%',
    width: '30%-3',
    height: '100%-15',
    tags: true,
    pad: 0,
    label: ' Box Score ',
    border: {
      type: 'line',
    },
  });

  screen.append(baseBox);
  screen.append(seasonText);
  screen.append(timeText);
  screen.append(dateText);
  screen.append(arenaText);
  screen.append(networkText);
  screen.append(homeTeamFullNameText);
  screen.append(homeTeamStandingsText);
  screen.append(homeTeamScoreText);
  screen.append(visitorTeamFullNameText);
  screen.append(visitorTeamStandingsText);
  screen.append(visitorTeamScoreText);
  screen.append(scoreboardTable);
  screen.append(playByPlayBox);
  screen.append(boxscoreTable);
  screen.key(['escape', 'q', 'C-c'], () => process.exit(1));

  return {
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
  };
};

export default getBlessed;
