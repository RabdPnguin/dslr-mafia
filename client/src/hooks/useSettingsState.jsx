import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import * as atoms from '../atoms';

export default
function useSettingsState() {
  const [playerAliases, setPlayerAliasState] = useRecoilState(atoms.playerAliasState);
  const [playerListPatterns, setPlayerListPatternState] = useRecoilState(atoms.playerListPatternState);
  const [votePatterns, setVotePatternState] = useRecoilState(atoms.votePatternState);
  const [dayPatterns, setDayPatternState] = useRecoilState(atoms.dayPatternState);
  const [nightPatterns, setNightPatternState] = useRecoilState(atoms.nightPatternState);
  const [killPatterns, setKillPatternState] = useRecoilState(atoms.killPatternState);

  const [settings, setSettings] = useState({
    playerAliases,
    playerAliasesDisplay: 'Player Aliases',
    playerListPatterns,
    playerListPatternsDisplay: 'Player List Patterns',
    votePatterns,
    votePatternsDisplay: 'Vote Patterns',
    dayPatterns,
    dayPatternsDisplay: 'Day Patterns',
    nightPatterns,
    nightPatternsDisplay: 'Night Patterns',
    killPatterns,
    killPatternsDisplay: 'Kill Patterns',
  });

  useEffect(() => {
    setSettings(s => ({
      ...s,
      playerAliases,
      playerListPatterns,
      votePatterns,
      dayPatterns,
      nightPatterns,
      killPatterns,
    }));
  }, [playerAliases, playerListPatterns, votePatterns, dayPatterns, nightPatterns, killPatterns]);

  const setSettingFunctions = {
    setPlayerAliasState,
    setPlayerListPatternState,
    setVotePatternState,
    setDayPatternState,
    setNightPatternState,
    setKillPatternState
  };

  const setAllSettings = settings => {
    Object.entries(settings ?? {})
      .forEach(([k, v]) => {
        const setting = k.charAt(0).toUpperCase() + k.slice(1);
        const funcName = `set${setting}State`;
        setSettingFunctions[funcName](v);
      });
  };

  return [settings, setAllSettings];
}