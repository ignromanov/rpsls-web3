import React from "react";
import WaitingPlayer from "../pages/WaitingPlayer";
import { RevealMove } from "../pages/RevealMove";
import Timeout from "../pages/Timeout";
import useGameTimeout from "@/hooks/useGameTimeout";
import { useGameData } from "@/contexts/GameDataContext";

interface Player1GameProps {
  onSolve: (_moveSecret: string | null) => Promise<void>;
  onJ2Timeout: () => Promise<void>;
}

const Player1Game: React.FC<Player1GameProps> = ({ onSolve, onJ2Timeout }) => {
  const { gameData } = useGameData();
  const { c2, j2, lastAction } = gameData;
  const { isTimeout, remainingSeconds } = useGameTimeout();

  if (c2 === 0 && lastAction) {
    return isTimeout ? (
      <Timeout opponentAddress={j2} onTimeout={onJ2Timeout} />
    ) : (
      <WaitingPlayer opponentAddress={j2} remainingSeconds={remainingSeconds} />
    );
  }

  return <RevealMove onSolve={onSolve} />;
};

export default Player1Game;
