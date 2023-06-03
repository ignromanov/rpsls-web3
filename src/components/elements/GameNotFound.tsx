import React from "react";

const GameNotFound = React.memo(() => {
  return (
    <>
      <h1>Where did it go?</h1>
      <p className="text-lg my-2- text-red-600">Game not found!</p>
      <p className="text-base my-2 text-violet-600">
        <a href="/" className="text-blue-500 hover:text-blue-700 underline">
          Click here
        </a>
        &nbsp;to start a new game.
      </p>
    </>
  );
});
GameNotFound.displayName = "GameNotFound";

export default GameNotFound;
