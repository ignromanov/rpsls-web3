import React, { useEffect, useState } from "react";
import useRPSContract from "@/hooks/useRPSContract";
import StatusMessage from "@/components/elements/StatusMessage";
import useWallet from "@/hooks/useWallet";
import Player1Game from "@/components/modules/Player1Game";
import Player2Game from "@/components/modules/Player2Game";
import GameNotFound from "../elements/GameNotFound";
import GameEnded from "../elements/GameEnded";

interface GameProps {
  contractAddress: string;
}

const Game: React.FC<GameProps> = ({ contractAddress }) => {
  const { address } = useWallet();
  const [statusMessage, setStatusMessage] = useState("");
  const { gameData, playerActions } = useRPSContract({
    setStatusMessage,
    contractAddress,
  });

  const { j1, j2, stake, isGame } = gameData;

  useEffect(() => {
    setStatusMessage("");
  }, [j1, j2, stake]);

  if (isGame === null) return <StatusMessage statusMessage={"Loading..."} />;

  if (!isGame) return <GameNotFound />;

  if (stake === "0.0") return <GameEnded />;

  return (
    <>
      {j1?.toLowerCase() === address?.toLowerCase() && (
        <Player1Game
          onSolve={playerActions.onSolve}
          onJ2Timeout={playerActions.onJ2Timeout}
          gameData={gameData}
        />
      )}
      {j2?.toLowerCase() === address?.toLowerCase() && (
        <Player2Game
          onPlay={playerActions.onPlay}
          onJ1Timeout={playerActions.onJ1Timeout}
          gameData={gameData}
        />
      )}
      <StatusMessage statusMessage={statusMessage} />
    </>
  );
};

export default Game;
