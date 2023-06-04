import { Move } from "@/types";
import React, { useCallback, useState } from "react";
import MoveSelector from "../elements/MoveSelector";
import ActionButton from "../elements/ActionButton";
import WaitingPlayer from "../pages/WaitingPlayer";
import useGameTimeout from "@/hooks/useGameTimeout";
import Timeout from "../pages/Timeout";
import { useGameData } from "@/contexts/GameDataContext";

interface Player2GameProps {
  onPlay: (move: Move) => void;
  onJ1Timeout: () => void;
}

const Player2Game: React.FC<Player2GameProps> = ({ onPlay, onJ1Timeout }) => {
  const [selectedMove, setSelectedMove] = useState<Move | null>(null);
  const { gameData } = useGameData();
  const { c2, j1, lastAction, stake } = gameData;
  const { isTimeout, remainingSeconds } = useGameTimeout();

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
        <h1>Duel in action!</h1>
        <p className="text-base my-2 text-violet-600 text-center">
          Choose your move. The bet is{" "}
          <span className="font-semibold">{stake} wei</span>.
          <br />
          You have {remainingSeconds}s left to make your move.
        </p>
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

  return isTimeout ? (
    <Timeout opponentAddress={j1} onTimeout={onJ1Timeout} />
  ) : (
    <WaitingPlayer opponentAddress={j1} remainingSeconds={remainingSeconds} />
  );
};

export default Player2Game;
