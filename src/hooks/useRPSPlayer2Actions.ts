import { useCallback } from "react";
import { RPS, RPSV2 } from "@/contracts";
import { Move } from "@/types";
import { ethers } from "ethers";
import { useStatusMessage } from "@/contexts/StatusMessageContext";
import { errorMessageHandler } from "@/utils/errors";
import { useWallet } from "@/contexts/WalletContext";
import { useGameData } from "@/contexts/GameDataContext";

type UseRPSPlayer2Actions = (params: {
  rpsContract: RPS | RPSV2 | null;
  incrementTransactionCount: () => void;
}) => {
  onPlay: (move: Move) => void;
  onJ1Timeout: () => void;
};

const useRPSPlayer2Actions: UseRPSPlayer2Actions = ({
  rpsContract,
  incrementTransactionCount,
}) => {
  const { gameData } = useGameData();
  const { provider } = useWallet();
  const { setStatusMessage } = useStatusMessage();

  const onPlay = useCallback(
    async (move: Move) => {
      if (!rpsContract || !setStatusMessage || !provider) return;

      try {
        setStatusMessage("Submitting your move...");

        const tx = await rpsContract.play(Move[move], {
          value: ethers.utils.parseUnits(gameData.stake || "0", "wei"),
        });

        setStatusMessage("Waiting for the transaction to be mined...");

        await tx.wait();

        setStatusMessage("Move submitted successfully.");
        incrementTransactionCount();
      } catch (error) {
        setStatusMessage(
          `Error submitting move: ${errorMessageHandler(error)}`
        );
      }
    },
    [
      rpsContract,
      setStatusMessage,
      provider,
      gameData.stake,
      incrementTransactionCount,
    ]
  );

  const onJ1Timeout = useCallback(async () => {
    if (!rpsContract || !setStatusMessage || !provider) return;

    try {
      setStatusMessage("Claiming funds due to player 1 timeout...");

      const tx = await rpsContract.j1Timeout();

      setStatusMessage("Waiting for the transaction to be mined...");

      await tx.wait();

      setStatusMessage("Funds claimed successfully.");
      incrementTransactionCount();
    } catch (error) {
      setStatusMessage(`Error claiming funds: ${errorMessageHandler(error)}`);
    }
  }, [rpsContract, setStatusMessage, provider, incrementTransactionCount]);

  return { onPlay, onJ1Timeout };
};

export default useRPSPlayer2Actions;
