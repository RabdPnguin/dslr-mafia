import { useSetRecoilState } from 'recoil';
import * as atoms from '../atoms';

export default
function useSetSettingsState() {
  const setPlayerAliasState = useSetRecoilState(atoms.playerAliasState);
  const setPlayerListPatternState = useSetRecoilState(atoms.playerListPatternState);
  const setVotePatternState = useSetRecoilState(atoms.votePatternState);
  const setDayPatternState = useSetRecoilState(atoms.dayPatternState);
  const setNightPatternState = useSetRecoilState(atoms.nightPatternState);
  const setNightKillPatternState = useSetRecoilState(atoms.nightKillPatternState);

  const settingState = {
    setPlayerAliasState,
    setPlayerListPatternState,
    setVotePatternState,
    setDayPatternState,
    setNightPatternState,
    setNightKillPatternState
  };

  const setSettings = settings => {
    Object.entries(settings ?? {})
      .forEach(([k, v]) => {
        const setting = k.charAt(0).toUpperCase() + k.slice(1);
        const funcName = `set${setting}State`;
        settingState[funcName](v);
      });
  }

  return setSettings;
}