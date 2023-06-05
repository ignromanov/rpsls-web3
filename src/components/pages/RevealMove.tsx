import React, { useCallback, useEffect } from "react";
import ActionButton from "../elements/ActionButton";
import useGameTimeout from "@/hooks/useGameTimeout";
import { useGameData } from "@/contexts/GameDataContext";
import { isInLocalStorage } from "@/utils/storage";

interface RevealMoveProps {
  onSolve: (_moveSecret: string | null) => void;
}

export const RevealMove: React.FC<RevealMoveProps> = ({ onSolve }) => {
  const [isSecretSaved, setIsSecretSaved] = React.useState(true);
  const [_moveSecret, setMoveSecret] = React.useState<string | null>(null);

  const { remainingSeconds } = useGameTimeout();
  const { gameData } = useGameData();

  useEffect(() => {
    if (!gameData.chainId || !gameData.contractAddress) return;
    if (!isInLocalStorage(gameData.chainId, gameData.contractAddress)) {
      setIsSecretSaved(false);
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
      {!isSecretSaved && (
        <div className="text-sm my-2 bg-red-100 text-red-900 p-3 text-center shadow-xl">
          <p className="text-center">
            🚫 We were unable to locate your previously saved move.
            <br />
            Please input the move you saved earlier.
          </p>
          <input
            type="text"
            value={_moveSecret ?? ""}
            onChange={(e) => setMoveSecret(e.target.value)}
            placeholder="Your saved move"
            className={`w-full p-2 my-2 rounded border-violet-400`}
          />
        </div>
      )}
      <ActionButton
        isDisabled={!isSecretSaved && !_moveSecret}
        onClickHandler={handleRevealMove}
      >
        Reveal Move
      </ActionButton>
    </>
  );
};
