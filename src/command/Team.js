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
  }) {
    this.id = teamId;
    this.city = teamCity;
    this.name = teamName;
    this.abbreviation = teamAbbreviation;
    this.score = score === '' ? '0' : score;
    this.wins = w;
    this.loses = l;
    this.divRank = divRank;
    this.linescores = linescores ? linescores.period : [];
    this.gameStats = {};
    this.players = [];
    this.gameLeaders = {};
    this.color = getMainColor(teamAbbreviation);
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
    return this.linescores
      .filter(quarterData => quarterData.period_value === quarter)
      .map(quarterData => quarterData.score)[0];
  }

  getGameStats() {
    return this.gameStats;
  }

  getPlayers() {
    return this.players;
  }

  getGameLeaders(sector) {
    return this.gameLeaders[sector];
  }

  setGameScore(score) {
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
}
