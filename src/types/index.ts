enum Move {
  Rock = 1,
  Paper,
  Scissors,
  Spock,
  Lizard,
}

interface GameData {
  address: string | null;
  isGame: boolean | null;
  j1: string | null;
  j2: string | null;
  c1Hash: string | null;
  c2: number;
  stake: string | null;
  timeout: number;
  lastAction: number;
}

export { Move };
export type { GameData };
