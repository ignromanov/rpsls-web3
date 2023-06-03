import React from "react";
import ActionButton from "../elements/ActionButton";

interface RevealMoveProps {
  onSolve: () => void;
}

export const RevealMove: React.FC<RevealMoveProps> = ({ onSolve }) => {
  return (
    <>
      <h1>Duel in action!</h1>
      <p className="text-base my-2 text-violet-600">
        <span className="font-semibold">Reveal your move</span> to end the game.
      </p>
      <ActionButton isDisabled={false} onClickHandler={onSolve}>
        Reveal Move
      </ActionButton>
    </>
  );
};
