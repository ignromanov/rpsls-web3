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

interface Player1SecretData {
  move: Move;
  salt: string;
  hash: string | null;
}

export { Move };
export type { GameData, Player1SecretData };
