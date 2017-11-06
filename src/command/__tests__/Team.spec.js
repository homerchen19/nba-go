import Team from '../Team';

jest.mock('node-emoji');
jest.mock('../../utils/log');

const emoji = require('node-emoji');
const { colorTeamName } = require('../../utils/log');

const setup = () =>
  new Team({
    teamId: '123',
    teamCity: 'LA',
    teamName: 'Lakers',
    teamAbbreviation: 'LAL',
    score: '100',
    w: '1',
    l: '1',
    divRank: '1',
    linescores: {
      period: [{ period_value: '1', period_name: 'Q1', score: '1' }],
    },
    isHomeTeam: true,
  });

describe('Team', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('score should be 0 when parameter score is empty string', () => {
    const team = new Team({
      teamAbbreviation: 'LAL',
      score: '',
    });

    const score = team.getScore();

    expect(score).toBe('0');
  });

  it('linescores should be array when linescores score is an object', () => {
    const team = new Team({
      teamAbbreviation: 'LAL',
      linescores: {
        period: { period_value: '1', period_name: 'Q1', score: '1' },
      },
    });

    const score = team.getQuarterScore('1');

    expect(score).toBe('1');
  });

  it('method getID should work', () => {
    const team = setup();
    const id = team.getID();

    expect(id).toBe('123');
  });

  it('method getCity should work', () => {
    const team = setup();
    const city = team.getCity();

    expect(city).toBe('LA');
  });

  it('method getAbbreviation and color is false should work', () => {
    const team = setup();
    const abbreviation = team.getAbbreviation({ color: false });

    expect(abbreviation).toBe('LAL');
    expect(colorTeamName).not.toBeCalled();
  });

  it('method getAbbreviation and color is true should work', () => {
    colorTeamName.mockReturnValueOnce('LAL');
    const team = setup();
    const abbreviation = team.getAbbreviation({ color: true });

    expect(abbreviation).toBe('LAL');
    expect(colorTeamName).toBeCalled();
  });

  it('method getName and color is false should work', () => {
    const team = setup();
    const name = team.getName({ color: false });

    expect(name).toBe('Lakers');
    expect(colorTeamName).not.toBeCalled();
  });

  it('method getName and color is true should work', () => {
    colorTeamName.mockReturnValueOnce('Lakers');
    const team = setup();
    const name = team.getName({ color: true });

    expect(name).toBe('Lakers');
    expect(colorTeamName).toBeCalled();
  });

  it('method setScore and getScore should work', () => {
    const team = setup();
    const score = team.getScore();

    expect(score).toBe('100');

    team.setScore('102');
    const newScore = team.getScore();

    expect(newScore).toBe('102');
  });

  it('method getWins should work', () => {
    const team = setup();
    const wins = team.getWins();

    expect(wins).toBe('1');
  });

  it('method getLoses should work', () => {
    const team = setup();
    const loses = team.getLoses();

    expect(loses).toBe('1');
  });

  it('method getFullName and color is false should work', () => {
    const team = setup();
    const fullName = team.getFullName({ color: false });

    expect(fullName).toBe('LA Lakers');
    expect(colorTeamName).not.toBeCalled();
  });

  it('method getFullName and color is true should work', () => {
    colorTeamName.mockReturnValueOnce('LA Lakers');
    const team = setup();
    const fullName = team.getFullName({ color: true });

    expect(fullName).toBe('LA Lakers');
    expect(colorTeamName).toBeCalled();
  });

  it('method getColor should work', () => {
    const team = setup();
    const color = team.getColor();

    expect(color).toBe('#702f8a');
  });

  it('method getColor should return undefined when passing unknown teamAbbreviation', () => {
    const team = new Team({
      teamAbbreviation: 'QQQQ',
    });
    const color = team.getColor();

    expect(color).toBe(undefined);
  });

  it('method getWinnerName and direction is left should work', () => {
    colorTeamName.mockReturnValueOnce('LA Lakers');
    emoji.get.mockReturnValueOnce('Crown');
    const team = setup();
    const winnerName = team.getWinnerName('left');

    expect(winnerName).toBe('Crown  LA Lakers');
    expect(colorTeamName).toBeCalled();
  });

  it('method getWinnerName and direction is right should work', () => {
    colorTeamName.mockReturnValueOnce('LA Lakers');
    emoji.get.mockReturnValueOnce('Crown');
    const team = setup();
    const winnerName = team.getWinnerName('right');

    expect(winnerName).toBe('LA Lakers Crown');
    expect(colorTeamName).toBeCalled();
  });

  it('method setQuarterScore and getQuarterScore should work', () => {
    const team = setup();
    const score = team.getQuarterScore('1');

    expect(score).toBe('1');

    team.setQuarterScore('1', '3');
    const newScore = team.getQuarterScore('1');

    expect(newScore).toBe('3');
  });

  it('method getGameStats and setGameStats should work', () => {
    const team = setup();
    const stats = {
      points: '97',
      field_goals_made: '40',
      field_goals_attempted: '85',
      field_goals_percentage: '47.1',
      free_throws_made: '15',
      free_throws_attempted: '16',
      free_throws_percentage: '93.8',
      three_pointers_made: '2',
      three_pointers_attempted: '12',
      three_pointers_percentage: '16.7',
      rebounds_offensive: '9',
      rebounds_defensive: '25',
      team_rebounds: '7',
      assists: '12',
      fouls: '21',
      team_fouls: '6',
      technical_fouls: '1',
      steals: '11',
      turnovers: '12',
      team_turnovers: '2',
      blocks: '2',
      short_timeout_remaining: '1',
      full_timeout_remaining: '1',
    };

    team.setGameStats(stats);
    const gameStats = team.getGameStats();

    expect(gameStats).toEqual(stats);
  });

  it('method getPlayers and setPlayers should work', () => {
    const team = setup();
    const players = [
      {
        first_name: 'Kawhi',
        last_name: 'Leonard',
        jersey_number: '2',
        person_id: '202695',
        position_short: 'SF',
        position_full: 'Forward',
        minutes: '40',
        seconds: '18',
        points: '21',
      },
      {
        first_name: 'LaMarcus',
        last_name: 'Aldridge',
        jersey_number: '12',
        person_id: '200746',
        position_short: 'PF',
        position_full: 'Forward',
        minutes: '37',
        seconds: '6',
        points: '20',
      },
    ];

    team.setPlayers(players);
    const gamePlayers = team.getPlayers();

    expect(gamePlayers).toEqual(players);
  });

  it('method getGameLeaders and setGameLeaders should work', () => {
    const team = setup();
    const leaders = {
      Points: {
        PlayerCount: '1',
        StatValue: '22',
        leader: [
          {
            PersonID: '2225',
            PlayerCode: 'tony_parker',
            FirstName: 'Tony',
            LastName: 'Parker',
          },
        ],
      },
    };

    team.setGameLeaders(leaders);
    const gameLeaders = team.getGameLeaders('Points');

    expect(gameLeaders).toEqual(leaders.Points);
  });

  it('method getGameLeaders should work even did not set at first', () => {
    const team = setup();
    const gameLeaders = team.getGameLeaders('Points');

    expect(gameLeaders).toEqual({
      StatValue: '-',
      leader: [
        {
          FirstName: '',
          LastName: '',
        },
      ],
    });
  });

  it('method getIsHomeTeam should work', () => {
    const team = setup();
    const isHomeTeam = team.getIsHomeTeam();

    expect(isHomeTeam).toBe(true);
  });
});
