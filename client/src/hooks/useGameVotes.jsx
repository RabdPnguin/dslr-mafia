import { useState, useEffect } from 'react';
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

    let isDay = false;
    let dayCount = 0;
    let game = [];

    for (let i = 1; i < posts.length; ++i) {
      const name = posts[i].name.toLowerCase().trim();
      const text = this._removeBlockQuotes(posts[i].post);

      if (name === moderator) {
        if (!isDay && this._parseIsDay(text)) {
          isDay = true;
          dayCount++;
          game.push({day: dayCount});
        } else if (isDay && this._parseIsNight(text)) {
          isDay = false;
        }
      }
    }
    
    return game;
  }

  _removeBlockQuotes = post => {
    const $ = cheerio.load(post, {decodeEntities: false});
    $('.bquote').remove();
    return $.html() ?? '';
  }

  _parseIsDay = post => {
    const pattern = this._combinePatterns(this.settings.dayPatterns);
    return post.search(new RegExp(pattern, 'gi')) !== -1;
  }

  _parseIsNight = post => {
    const pattern = this._combinePatterns(this.settings.nightPatterns);
    return post.search(new RegExp(pattern, 'gi')) !== -1;
  }

  _parsePlayers = post => {
    const pattern = this._combinePatterns(this.settings.playerListPatterns);
    const regex = new RegExp(pattern, 'gi');

    const match = regex.exec(post);
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

    return players;
  }

  _combinePatterns = patterns => {
    return patterns.map(p => `(${p.pattern})`).join('|');
  }

  _getPlayerName = playerNameOrAlias => {
    const name = playerNameOrAlias.toLowerCase().trim();
    const alias = this.settings.playerAliases
      .map(alias => ({
        name: alias.name.toLowerCase().trim(),
        aliases: alias.aliases.split(',').map(a => a.toLowerCase().trim())
      }))
      .find(alias => alias.name === name || alias.aliases.includes(name));

    return alias ?? name;
  }
}