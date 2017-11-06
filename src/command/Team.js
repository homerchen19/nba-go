import emoji from 'node-emoji';
import { getMainColor } from 'nba-color';

import { colorTeamName } from '../utils/log';

export default class Team {
  constructor({
    teamId,
    teamCity,
    teamName,
    teamAbbreviation,
    score,
    w,
    l,
    divRank,
    linescores,
    isHomeTeam,
  }) {
    this.id = teamId;
    this.city = teamCity;
    this.name = teamName;
    this.abbreviation = teamAbbreviation;
    this.score = score === '' ? '0' : score;
    this.wins = w;
    this.loses = l;
    this.divRank = divRank;
    this.gameStats = {};
    this.players = [];
    this.gameLeaders = {};
    this.color = getMainColor(teamAbbreviation);
    this.isHomeTeam = isHomeTeam;

    if (linescores) {
      this.linescores = Array.isArray(linescores.period)
        ? linescores.period
        : [linescores.period];
    } else {
      this.linescores = [];
    }
  }

  getID() {
    return this.id;
  }

  getCity() {
    return this.city;
  }

  getAbbreviation({ color }) {
    return color === false
      ? this.abbreviation
      : colorTeamName(this.getColor(), this.abbreviation);
  }

  getName({ color }) {
    return color === false
      ? this.name
      : colorTeamName(this.getColor(), this.name);
  }

  getScore() {
    return this.score;
  }

  getWins() {
    return this.wins;
  }

  getLoses() {
    return this.loses;
  }

  getFullName({ color }) {
    return color === false
      ? `${this.city} ${this.name}`
      : colorTeamName(this.getColor(), `${this.city} ${this.name}`);
  }

  getColor() {
    return this.color ? this.color.hex : undefined;
  }

  getWinnerName(direction) {
    return direction === 'left'
      ? `${emoji.get('crown')}  ${colorTeamName(this.getColor(), this.name)}`
      : `${colorTeamName(this.getColor(), this.name)} ${emoji.get('crown')}`;
  }

  getQuarterScore(quarter) {
    return this.linescores.find(
      quarterData => quarterData.period_value === quarter
    ).score;
  }

  getGameStats() {
    return this.gameStats;
  }

  getPlayers() {
    return this.players;
  }

  getGameLeaders(sector) {
    return (
      this.gameLeaders[sector] || {
        StatValue: '-',
        leader: [
          {
            FirstName: '',
            LastName: '',
          },
        ],
      }
    );
  }

  getIsHomeTeam() {
    return this.isHomeTeam;
  }

  setScore(score) {
    this.score = score;
  }

  setGameStats(stats) {
    this.gameStats = stats;
  }

  setPlayers(players) {
    this.players = players;
  }

  setGameLeaders(leaders) {
    this.gameLeaders = leaders;
  }

  setQuarterScore(quarter, score) {
    this.linescores.find(
      quarterData => quarterData.period_value === quarter
    ).score = score;
  }
}
