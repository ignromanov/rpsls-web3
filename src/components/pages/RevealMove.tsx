import React, { useCallback, useEffect } from "react";
import ActionButton from "../elements/ActionButton";
import useGameTimeout from "@/hooks/useGameTimeout";
import { useGameData } from "@/contexts/GameDataContext";
import { isInLocalStorage } from "@/utils/storage";

interface RevealMoveProps {
  onSolve: (_moveSecret: string | null) => void;
}

export const RevealMove: React.FC<RevealMoveProps> = ({ onSolve }) => {
  const [secretSaved, setSecretSaved] = React.useState(true);
  const [_moveSecret, setMoveSecret] = React.useState<string | null>(null);

  const { remainingSeconds } = useGameTimeout();
  const { gameData } = useGameData();

  useEffect(() => {
    if (!gameData.chainId || !gameData.contractAddress) return;
    if (!isInLocalStorage(gameData.chainId, gameData.contractAddress)) {
      setSecretSaved(false);
    }
  }, [gameData, onSolve]);

  const handleRevealMove = useCallback(() => {
    onSolve(_moveSecret);
  }, [_moveSecret, onSolve]);

  return (
    <>
      <h1>Duel in action!</h1>
      <p className="text-base my-2 text-violet-600 text-center">
        <span className="font-semibold">Reveal your move</span> to end the game.
        <br />
        You have {remainingSeconds}s left to make your move.
      </p>
      {!secretSaved && (
        <>
          <p className="text-base mt-2 text-violet-600 text-center">
            It seems we couldn&apos;t find your saved move.
            <br />
            Please, enter the move you&apos;ve saved earlier.
          </p>
          <input
            type="text"
            value={_moveSecret ?? ""}
            onChange={(e) => setMoveSecret(e.target.value)}
            placeholder="Your saved move"
            className={`w-full p-2 my-2 rounded border-violet-400`}
          />
        </>
      )}
      <ActionButton
        isDisabled={!secretSaved && !_moveSecret}
        onClickHandler={handleRevealMove}
      >
        Reveal Move
      </ActionButton>
    </>
  );
};
