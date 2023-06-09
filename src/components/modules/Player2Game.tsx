import { Move } from "@/types";
import React, { useCallback, useState } from "react";
import MoveSelector from "../elements/MoveSelector";
import ActionButton from "../elements/ActionButton";
import WaitingPlayer from "../pages/WaitingPlayer";
import useGameTimeout from "@/hooks/useGameTimeout";
import Timeout from "../pages/Timeout";
import { useGameData } from "@/contexts/GameDataContext";

interface Player2GameProps {
  onPlay: (move: Move) => Promise<void>;
  onJ1Timeout: () => Promise<void>;
}

const Player2Game: React.FC<Player2GameProps> = ({ onPlay, onJ1Timeout }) => {
  const [isInterfaceDisabled, setIsInterfaceDisabled] = useState(false);
  const [selectedMove, setSelectedMove] = useState<Move | null>(null);
  const { gameData } = useGameData();
  const { c2, j1, lastAction, stake } = gameData;
  const { isTimeout, remainingSeconds } = useGameTimeout();

  const handleMoveSelect = useCallback((move: Move) => {
    setSelectedMove(move);
  }, []);

  const handleMakeMove = useCallback(async () => {
    if (!selectedMove) return;
    setIsInterfaceDisabled(true);
    await onPlay(selectedMove);
    setIsInterfaceDisabled(false);
  }, [onPlay, selectedMove]);

  if (c2 === 0) {
    return (
      <>
        <h1>Duel in action!</h1>
        <p className="text-base my-2 text-violet-600 text-center">
          The bet is <span className="font-semibold">{stake} wei</span>.
          <br />
          Choose your move.
          <br />
          You have {remainingSeconds}s left to make your move.
        </p>
        <MoveSelector
          selectedMove={selectedMove}
          onMoveSelect={handleMoveSelect}
          isDisabled={isInterfaceDisabled}
        />
        <ActionButton
          isDisabled={!selectedMove || isInterfaceDisabled}
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
