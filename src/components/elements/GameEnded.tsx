import React from "react";

const GameEnded = React.memo(() => {
  return (
    <>
      <h1 className="text-2xl font-semibold mt-6 text-violet-900">Checkmate</h1>
      <p className="text-base mt-2 text-violet-600">The game has ended.</p>
      <p className="text-base text-violet-600">
        <a href="/" className="text-blue-500 hover:text-blue-700 underline">
          Click here
        </a>
        &nbsp;to start a new game.
      </p>
    </>
  );
});
GameEnded.displayName = "GameEnded";

export default GameEnded;
