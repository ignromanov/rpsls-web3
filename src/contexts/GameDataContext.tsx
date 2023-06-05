import { createContext, useCallback, useContext, useState } from "react";
import { GameData, RPSVersion } from "../types";

interface GameDataContextData {
  gameData: GameData;
  setGameData: React.Dispatch<React.SetStateAction<GameData>>;
  resetGameData: (providedData?: Partial<GameData>) => void;
}

const GameDataContext = createContext<GameDataContextData | undefined>(
  undefined
);

interface GameDataProviderProps {
  children: React.ReactNode;
}

const defaultGameData: GameData = {
  chainId: null,
  contractAddress: null,
  contractVersion: RPSVersion.RPSV2,
  isGame: null,
  j1: null,
  j2: null,
  c1Hash: null,
  c1: 0,
  c2: 0,
  winner: null,
  stake: null,
  timeout: 0,
  lastAction: 0,
};

export const GameDataProvider: React.FC<GameDataProviderProps> = ({
  children,
}) => {
  const [gameData, setGameData] = useState<GameData>(defaultGameData);

  const resetGameData = useCallback((providedData: Partial<GameData> = {}) => {
    setGameData({ ...defaultGameData, ...providedData });
  }, []);

  return (
    <GameDataContext.Provider value={{ gameData, setGameData, resetGameData }}>
      {children}
    </GameDataContext.Provider>
  );
};

export const useGameData = () => {
  const context = useContext(GameDataContext);
  if (context === undefined) {
    throw new Error("useGameData must be used within a GameDataProvider");
  }
  return context;
};
