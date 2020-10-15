export const calcVotesToLynch = numPlayers => {
  const avg = numPlayers / 2;
  const votesToLynch = Math.ceil(avg);
  return votesToLynch === avg ? votesToLynch + 1 : votesToLynch;
}