import { useCallback, useEffect, useState } from "react";
import useRPSInitialization from "./useRPSInitialization";
import useRPSFetchData from "./useRPSFetchData";
import useRPSPlayer1Actions from "./useRPSPlayer1Actions";
import useRPSPlayer2Actions from "./useRPSPlayer2Actions";
import { useWallet } from "@/contexts/WalletContext";
import { useGameData } from "@/contexts/GameDataContext";

const useRPSContract = () => {
  const { gameData } = useGameData();
  const { contractAddress } = gameData;

  const [transactionCount, setTransactionCount] = useState(0);
  const { chainId } = useWallet();

  const rpsContract = useRPSInitialization();

  useEffect(() => {
    setTransactionCount(0);
  }, [chainId, contractAddress, rpsContract]);

  const incrementTransactionCount = useCallback(() => {
    setTransactionCount((prevCount) => prevCount + 1);
  }, []);

  useRPSFetchData({ rpsContract, transactionCount });

  const player1Actions = useRPSPlayer1Actions({
    rpsContract,
    incrementTransactionCount,
  });

  const player2Actions = useRPSPlayer2Actions({
    rpsContract,
    incrementTransactionCount,
  });

  return {
    player1Actions,
    player2Actions,
    rpsContract,
  };
};

export default useRPSContract;
