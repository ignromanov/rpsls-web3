import React from "react";

const GameNotFound = React.memo(() => {
  return (
    <>
      <h1 className="text-2xl font-semibold text-violet-900">
        Where did it go?
      </h1>
      <p className="text-lg mt-2 text-red-600">Game not found!</p>
      <p className="text-base mt-4 text-violet-600">
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
