import React, { useEffect } from "react";
import useRPSContract from "@/hooks/useRPSContract";
import useWallet from "@/hooks/useWallet";
import Player1Game from "@/components/modules/Player1Game";
import Player2Game from "@/components/modules/Player2Game";
import GameNotFound from "../elements/GameNotFound";
import GameEnded from "../elements/GameEnded";
import { useStatusMessage } from "@/contexts/StatusMessageContext";

interface GameProps {
  contractAddress: string;
}

const Game: React.FC<GameProps> = ({ contractAddress }) => {
  const { setStatusMessage } = useStatusMessage();

  const { address } = useWallet();
  const { gameData, playerActions } = useRPSContract({
    contractAddress,
  });

  const { j1, j2, stake, isGame } = gameData;

  useEffect(() => {
    if (isGame === null) {
      setStatusMessage("Loading...");
      return;
    }
    setStatusMessage("");
  }, [j1, j2, setStatusMessage, stake, isGame]);

  if (isGame === null) return null;

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
    </>
  );
};

export default Game;
