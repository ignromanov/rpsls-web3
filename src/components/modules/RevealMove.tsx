import React from "react";
import ActionButton from "../elements/ActionButton";

interface RevealMoveProps {
  onSolve: () => void;
}

export const RevealMove: React.FC<RevealMoveProps> = ({ onSolve }) => {
  return (
    <>
      <h1 className="text-2xl font-semibold text-violet-900">
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
