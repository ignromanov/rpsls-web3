import React from "react";
import PlayerWaiting from "./PlayerWaiting";
import { GameData } from "@/types";
import { RevealMove } from "./RevealMove";

interface Player1GameProps {
  onSolve: () => void;
  onJ2Timeout: () => void;
  gameData: GameData;
}

const Player1Game: React.FC<Player1GameProps> = ({
  onSolve,
  onJ2Timeout,
  gameData,
}) => {
  const { c2, j2, lastAction, timeout } = gameData;

  if (c2 === 0 && lastAction) {
    return (
      <PlayerWaiting
        opponentAddress={j2}
        timeout={timeout}
        lastAction={lastAction}
        onTimeout={onJ2Timeout}
      />
    );
  }

  return <RevealMove onSolve={onSolve} />;
};

export default Player1Game;
