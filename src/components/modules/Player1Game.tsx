import React from "react";
import ActionButton from "../elements/ActionButton";
import PlayerWaiting from "../elements/PlayerWaiting";
import { GameData } from "@/types";

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

  return (
    <>
      <h1 className="text-2xl font-semibold mt-6 text-violet-900">
        Duel in action!
      </h1>
      <p className="text-base mt-4 text-violet-600">
        <span className="font-semibold">Reveal your move</span> to end the game.
      </p>
      <ActionButton isDisabled={false} onClickHandler={onSolve}>
        Reveal Move
      </ActionButton>
    </>
  );
};

export default Player1Game;
