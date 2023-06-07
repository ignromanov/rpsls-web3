import { useRouter } from "next/router";
import React, { useCallback } from "react";
import ActionButton from "../elements/ActionButton";

const GameNotFound = React.memo(() => {
  const router = useRouter();
  const clickHandler = useCallback(() => {
    router.push("/");
  }, [router]);

  return (
    <>
      <h1>Where did it go?</h1>
      <p className="text-lg my-2- text-red-600">Game not found!</p>
      <ActionButton isDisabled={false} onClickHandler={clickHandler}>
        Start New Game
      </ActionButton>
    </>
  );
});
GameNotFound.displayName = "GameNotFound";

export default GameNotFound;
