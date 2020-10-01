import React, { useState, useEffect } from 'react';
import { useRecoilValueLoadable } from 'recoil';
import { postsQuery } from '../atoms';
import useSettingsState from '../hooks/useSettingsState';
import cheerio from 'cheerio';

export default
function useGameVotes() {
  const posts = useRecoilValueLoadable(postsQuery);
  const [settings] = useSettingsState();
  const loading = posts.state === 'loading';
  const [gameVotes, setGameVotes] = useState([]);

  useEffect(() => {
    if (!loading) {
      const parser = new Parser(settings);
      setGameVotes(parser.Parse(posts.contents));
    }
  }, [loading, posts.contents]);

  return [gameVotes, loading];
}

class Parser {
  constructor(settings) {
    this.settings = settings;
  }

  Parse = (posts = []) => {
    if (posts.length === 0) return posts;

    const moderator = posts[0].name.toLowerCase().trim();
    const players = this._parsePlayers(posts[0].post);

    let game = [];
    let nightKills = [];
    let dayCount = 0;
    let isDay = false;
    
    if (this._parseIsDay(posts[0].post)) {
      isDay = true;
      dayCount++;
      game.push({day: dayCount, players: this._createPlayerList(players)});
    }

    for (let i = 1; i < posts.length; ++i) {
      const name = posts[i].name.toLowerCase().trim();
      const text = this._removeBlockQuotes(posts[i].post);
      this._calculateDeadPlayers(game, dayCount);

      if (name === moderator) {
        const deaths = isDay
          ? this._parseDayKill(text)
          : this._parseNightKill(text);
        if (deaths) {
          nightKills.push(deaths);
        }

        if (!isDay && this._parseIsDay(text)) {
          isDay = true;
          dayCount++;
          game.push({day: dayCount, players: this._createPlayerList(players)});
          for (let nightKill of nightKills) {
            const player = game[dayCount - 1].players[nightKill];
            if (player) {
              player.isDead = true;
            }
          }
          nightKills = [];
        } else if (isDay && this._parseIsNight(text)) {
          isDay = false;
        }
      } else {
        if (isDay) {
          const currentDay = game[dayCount - 1];
          const player = currentDay.players[name];
          const isLynch = this._calculateIsLynch(Object.values(currentDay.players));
          const isValidPlayer = players.includes(name) && !player.isDead && !isLynch;
          if (!isValidPlayer) continue;

          const currentVote = player.vote;
          const [newVote, isValidVote] = this._parsePlayerVote(currentDay.players, player, text);
          if (currentVote !== newVote) {
            if (currentVote && currentDay.players[currentVote]) {
              currentDay.players[currentVote].votesFrom =
                currentDay.players[currentVote].votesFrom.filter(v => v !== player.name);
            }

            if (newVote && currentDay.players[newVote]) {
              currentDay.players[newVote].votesFrom.push(player.name);
            }

            player.vote = newVote;
            player.isValidVote = isValidVote;
          }

          currentDay.players[name] = player;
        }
      }
    }

    this._calculateDeadPlayers(game, dayCount);
    return game.map(g => ({
      ...g,
      players: Object.values(g.players).map(v => v)
    }));
  }

  _parseDayKill = post => {
    if (!this.settings.dayKillPatterns.length) return '';

    const pattern = this._combinePatterns(this.settings.dayKillPatterns);
    const matches = post.matchAll(new RegExp(pattern, 'gi'));
    for (let match of matches) {
      const key = Object.keys(match.groups).find(k => match.groups[k]);
      const name = (match.groups[key] ?? '').toLowerCase().trim();
      return this._getPlayerName(name);
    }

    return '';
  }

  _parseNightKill = post => {
    if (!this.settings.nightKillPatterns.length) return '';

    const pattern = this._combinePatterns(this.settings.nightKillPatterns);
    const matches = post.matchAll(new RegExp(pattern, 'gi'));
    for (let match of matches) {
      const key = Object.keys(match.groups).find(k => match.groups[k]);
      const name = (match.groups[key] ?? '').toLowerCase().trim();
      return this._getPlayerName(name);
    }

    return '';
  }

  _calculateIsLynch = players => {
    const numActivePlayers = players.filter(p => !p.isDead).length;
    const votesToLynch = Math.ceil(numActivePlayers / 2);
    return players.some(p => p.votesFrom.length >= votesToLynch);
  }

  _calculateDeadPlayers = (game, day) => {
    const currentDay = day - 1;
    
    for (let i = 0; i <= currentDay; ++i) {
      const players = Object.values(game[i].players);
      const yesterday = i > 0 
        ? Object.values(game[i-1].players)
        : [];
      
      for (let player of players) {
        if (i > 0) {
          if (yesterday.find(p => p.name === player.name).isDead) {
              player.isDead = true;
            } 
        }
      }
    }
  }

  _createPlayerList = players => {
    return players.reduce((acc, cur) => ({...acc, [cur]: {
      name: cur, 
      vote: '',
      isValidVote: true,
      votesFrom: [],
      isDead: false}}), {});
  }

  _parsePlayerVote = (players, player, post) => {
    if (!this.settings.votePatterns.length) return ['', false];

    const votePattern = this._combinePatterns(this.settings.votePatterns);
    const unvotePattern = `${votePattern.replaceAll('vote', 'unvote').replaceAll('?<player', '?<unvote_player')}|<b> *?(?<unvote>unvote)<\\/b>`;
    const pattern = `${votePattern}|${unvotePattern}`;
    const matches = post.matchAll(new RegExp(pattern, 'gi'));

    let vote = player.vote;
    let isValidVote = false;

    for (let match of matches) {
      const key = Object.keys(match.groups).find(k => match.groups[k]);
      if (!key) continue;

      const unvote = key.includes('unvote');
      const withPlayer = key.includes('player');
      const name = (match.groups[key] ?? '').toLowerCase().trim();
      const playerName = this._getPlayerName(name);

      if (unvote && ((!withPlayer) || (withPlayer && playerName === vote))) {
        vote = ''
        isValidVote = true;
      } else if (!unvote && playerName) {
        vote = playerName
        isValidVote = this._isValidPlayerNameOrAlias(name) || Object.keys(players).some(p => p === name);
      }
    }

    return [vote, isValidVote];
  }

  _removeBlockQuotes = post => {
    const $ = cheerio.load(post, {decodeEntities: false});
    $('.bquote').remove();
    return $.html() ?? '';
  }

  _parseIsDay = post => {
    if (!this.settings.dayPatterns.length) return false;
    const pattern = this._combinePatterns(this.settings.dayPatterns);
    return post.search(new RegExp(pattern, 'gi')) !== -1;
  }

  _parseIsNight = post => {
    if (!this.settings.nightPatterns.length) return true;
    const pattern = this._combinePatterns(this.settings.nightPatterns);
    return post.search(new RegExp(pattern, 'gi')) !== -1;
  }

  _parsePlayers = post => {
    if (!this.settings.playerListPatterns.length) return [];

    const pattern = this._combinePatterns(this.settings.playerListPatterns);
    const regex = new RegExp(pattern, 'gi');

    const match = regex.exec(post);
    if (!match || !match[0]) {
      return [];
    }

    const parsedPlayers = post
      .substr(match.index + match[0].length)
      .split(/\r?\n/);

    let players = [];
    let playerFound = false;
    for (let i = 0; i < parsedPlayers.length; ++i) {
      const parsedPlayer = parsedPlayers[i];
      const match = parsedPlayer.match(/^(?:<.*?>)?(?<player>.*?)(?:<\/.*?>)?$/i);
  
      if (playerFound && !match[1]) {
        break;
      } else if (match[1]) {
        playerFound = true;
        const player = this._getPlayerName(match.groups.player.toLowerCase());

        players.push(player);
      }
    }

    return players.sort();
  }

  _combinePatterns = patterns => {
    return patterns
      .map((p, i) => `(${p.pattern})`.replace('?<player>', `?<player${i}>`))
      .join('|');
  }

  _isValidPlayerNameOrAlias = playerNameOrAlias => {
    const name = playerNameOrAlias.toLowerCase().trim();
    const alias = this.settings.playerAliases
      .map(alias => ({
        name: alias.name.toLowerCase().trim(),
        aliases: alias.aliases.split(',').map(a => a.toLowerCase().trim())
      }))
      .find(alias => alias.name === name || alias.aliases.includes(name));

    return !!alias;
  }

  _getPlayerName = playerNameOrAlias => {
    const name = playerNameOrAlias.toLowerCase().trim();
    const alias = this.settings.playerAliases
      .map(alias => ({
        name: alias.name.toLowerCase().trim(),
        aliases: alias.aliases.split(',').map(a => a.toLowerCase().trim())
      }))
      .find(alias => alias.name === name || alias.aliases.includes(name));

    return alias?.name ?? name;
  }
}