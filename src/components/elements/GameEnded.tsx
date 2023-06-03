import { useRouter } from "next/router";
import React, { useCallback } from "react";
import ActionButton from "./ActionButton";

const GameEnded = React.memo(() => {
  const router = useRouter();

  const clickHandler = useCallback(() => {
    router.push("/");
  }, [router]);

  return (
    <>
      <h1 className="text-3xl font-bold text-violet-900">Checkmate</h1>
      <p className="text-lg mt-2 text-violet-500">The game has ended.</p>
      <p className="text-base mt-4 text-violet-600">Start a new game:</p>
      <ActionButton isDisabled={false} onClickHandler={clickHandler}>
        Start New Game
      </ActionButton>
    </>
  );
});
GameEnded.displayName = "GameEnded";

export default GameEnded;
