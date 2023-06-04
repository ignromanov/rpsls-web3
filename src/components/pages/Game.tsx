import React, { useEffect } from "react";
import useRPSContract from "@/hooks/useRPSContract";
import Player1Game from "@/components/modules/Player1Game";
import Player2Game from "@/components/modules/Player2Game";
import GameNotFound from "./GameNotFound";
import GameEnded from "./GameEnded";
import { useStatusMessage } from "@/contexts/StatusMessageContext";
import { errorMessageHandler } from "@/utils/errors";
import { useWallet } from "@/contexts/WalletContext";
import { useGameData } from "@/contexts/GameDataContext";
import { SpinnerIcon } from "../elements/Icons";
import GameSteps from "../elements/GameSteps";

const Game: React.FC = () => {
  const { setStatusMessage } = useStatusMessage();

  const { address, provider, switchChainId, chainId } = useWallet();
  const { gameData } = useGameData();
  const { j1, j2, stake, isGame, chainId: gameChainId } = gameData;

  const { player1Actions, player2Actions } = useRPSContract();

  const isChainMismatch = !!chainId && !!gameChainId && chainId !== gameChainId;

  useEffect(() => {
    const switchChain = async (gameChainId: string) => {
      setStatusMessage("Switching networks...");
      try {
        await switchChainId(gameChainId);
      } catch (error) {
        setStatusMessage(
          `Failed to switch network: ${errorMessageHandler(error)}`
        );
      }
    };

    if (gameChainId && isChainMismatch) {
      switchChain(gameChainId);
      return;
    }

    if (isGame === null) {
      setStatusMessage("Loading...");
    } else {
      setStatusMessage("");
    }
  }, [
    j1,
    j2,
    setStatusMessage,
    stake,
    isGame,
    provider,
    gameChainId,
    switchChainId,
    isChainMismatch,
  ]);

  if (isGame === null || isChainMismatch) return <SpinnerIcon />;

  if (!isGame) return <GameNotFound />;

  const isGameEnded = stake === "0";
  return (
    <>
      {isGameEnded && <GameEnded />}
      {!isGameEnded && j1?.toLowerCase() === address?.toLowerCase() && (
        <Player1Game
          onSolve={player1Actions.onSolve}
          onJ2Timeout={player1Actions.onJ2Timeout}
        />
      )}
      {!isGameEnded && j2?.toLowerCase() === address?.toLowerCase() && (
        <Player2Game
          onPlay={player2Actions.onPlay}
          onJ1Timeout={player2Actions.onJ1Timeout}
        />
      )}
      <GameSteps />
    </>
  );
};

export default Game;
