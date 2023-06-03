import { createContext, useContext, useState } from "react";
import { GameData } from "../types";

interface GameDataContextData {
  gameData: GameData;
  setGameData: React.Dispatch<React.SetStateAction<GameData>>;
}

const GameDataContext = createContext<GameDataContextData | undefined>(
  undefined
);

interface GameDataProviderProps {
  children: React.ReactNode;
}

export const GameDataProvider: React.FC<GameDataProviderProps> = ({
  children,
}) => {
  const [gameData, setGameData] = useState<GameData>({
    address: null,
    isGame: null,
    j1: null,
    j2: null,
    c1Hash: null,
    c2: 0,
    stake: null,
    timeout: 0,
    lastAction: 0,
  });

  return (
    <GameDataContext.Provider value={{ gameData, setGameData }}>
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
