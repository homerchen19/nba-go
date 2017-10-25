const NbaEmoji = require('nba-emoji');

const teamColor = require('../utils/teamColor');

module.exports = class Team {
  constructor({ id, city, abbreviation, nickname }) {
    this.id = id;
    this.city = city;
    this.abbreviation = abbreviation;
    this.nickname = nickname;
  }

  getCity() {
    return this.city;
  }

  getAbbreviation() {
    return this.abbreviation;
  }

  getNickname() {
    return this.nickname;
  }

  getFullName() {
    return `${this.city} ${this.nickname}`;
  }

  getColor() {
    return teamColor[this.abbreviation].color;
  }

  getEmogiNickname(direction) {
    return direction === 'left'
      ? `${NbaEmoji.getEmoji(this.abbreviation)}  ${this.nickname}`
      : `${this.nickname} ${NbaEmoji.getEmoji(this.abbreviation)}`;
  }
};
