enum RPSVersion {
  RPS = 1,
  RPSV2,
}

enum Move {
  Rock = 1,
  Paper,
  Scissors,
  Spock,
  Lizard,
}

interface GameData {
  chainId: string | null;
  contractAddress: string | null;
  contractVersion: RPSVersion;
  isGame: boolean | null;
  j1: string | null;
  j2: string | null;
  c1Hash: string | null;
  c1: number;
  c2: number;
  winner: null | string | undefined;
  stake: string | null;
  timeout: number;
  lastAction: number;
}

interface Player1SecretData {
  move: Move;
  salt: string;
  hash: string | null;
}

export { Move, RPSVersion };
export type { GameData, Player1SecretData };
