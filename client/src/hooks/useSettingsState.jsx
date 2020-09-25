import { useRecoilState } from 'recoil';
import * as atoms from '../atoms';

export default
function useSettingsState() {
  const [playerAliases, setPlayerAliasState] = useRecoilState(atoms.playerAliasState);
  const [playerListPatterns, setPlayerListPatternState] = useRecoilState(atoms.playerListPatternState);
  const [votesPatterns, setVotePatternState] = useRecoilState(atoms.votePatternState);
  const [dayPatterns, setDayPatternState] = useRecoilState(atoms.dayPatternState);
  const [nightPatterns, setNightPatternState] = useRecoilState(atoms.nightPatternState);
  const [nightKillPatterns, setNightKillPatternState] = useRecoilState(atoms.nightKillPatternState);

  const setSettingFunctions = {
    setPlayerAliasState,
    setPlayerListPatternState,
    setVotePatternState,
    setDayPatternState,
    setNightPatternState,
    setNightKillPatternState
  };

  const settings = {
    playerAliases,
    playerListPatterns,
    votesPatterns,
    dayPatterns,
    nightPatterns,
    nightKillPatterns
  };

  const setSettings = settings => {
    Object.entries(settings ?? {})
      .forEach(([k, v]) => {
        const setting = k.charAt(0).toUpperCase() + k.slice(1);
        const funcName = `set${setting}State`;
        setSettingFunctions[funcName](v);
      });
  }

  return [settings, setSettings];
}