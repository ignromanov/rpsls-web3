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
      <h1>Checkmate</h1>
      <p className="text-lg my-2 text-violet-500">The game has ended.</p>
      <ActionButton isDisabled={false} onClickHandler={clickHandler}>
        Start New Game
      </ActionButton>
    </>
  );
});
GameEnded.displayName = "GameEnded";

export default GameEnded;
