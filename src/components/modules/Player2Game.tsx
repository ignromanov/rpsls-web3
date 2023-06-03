import { GameData, Move } from "@/types";
import React, { useCallback, useState } from "react";
import MoveSelector from "../elements/MoveSelector";
import ActionButton from "../elements/ActionButton";
import PlayerWaiting from "./PlayerWaiting";

interface Player2GameProps {
  onPlay: (move: Move) => void;
  onJ1Timeout: () => void;
  gameData: GameData;
}

const Player2Game: React.FC<Player2GameProps> = ({
  onPlay,
  onJ1Timeout,
  gameData,
}) => {
  const [selectedMove, setSelectedMove] = useState<Move | null>(null);
  const { c2, j1, lastAction, timeout } = gameData;

  const handleMoveSelect = useCallback((move: Move) => {
    setSelectedMove(move);
  }, []);

  const handleMakeMove = useCallback(() => {
    if (!selectedMove) return;
    onPlay(selectedMove);
  }, [onPlay, selectedMove]);

  if (c2 === 0) {
    return (
      <>
        <h1 className="text-2xl font-semibold mt-6 text-violet-900">
          Duel in action!
        </h1>
        <p className="text-base mt-4 text-violet-600">Choose your move:</p>
        <MoveSelector
          selectedMove={selectedMove}
          onMoveSelect={handleMoveSelect}
        />
        <ActionButton
          isDisabled={!selectedMove}
          onClickHandler={handleMakeMove}
        >
          Make Move
        </ActionButton>
      </>
    );
  }

  if (!lastAction) return null;

  return (
    <PlayerWaiting
      opponentAddress={j1}
      timeout={timeout}
      lastAction={lastAction}
      onTimeout={onJ1Timeout}
    />
  );
};

export default Player2Game;
