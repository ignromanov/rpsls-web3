import { useCallback, useEffect, useState } from "react";
import { GameData } from "../types";
import useRPSInitialization from "./useRPSInitialization";
import useRPSFetchData from "./useRPSFetchData";
import useWallet from "./useWallet";
import useRPSPlayer1Actions from "./useRPSPlayer1Actions";
import useRPSPlayer2Actions from "./useRPSPlayer2Actions";

const defaultGameData: GameData = {
  address: null,
  isGame: null,
  j1: null,
  j2: null,
  c1Hash: null,
  c2: 0,
  stake: null,
  timeout: 0,
  lastAction: 0,
};

interface UseRPSContract {
  contractAddress?: string | null;
}

const useRPSContract = ({ contractAddress = null }: UseRPSContract) => {
  const [gameData, setGameData] = useState<GameData>({
    ...defaultGameData,
    address: contractAddress,
  });
  const [transactionCount, setTransactionCount] = useState(0);
  const { chainId } = useWallet();

  useEffect(() => {
    setTransactionCount(0);
    setGameData({
      ...defaultGameData,
      address: contractAddress,
    });
  }, [chainId, contractAddress]);

  const incrementTransactionCount = useCallback(() => {
    setTransactionCount((prevCount) => prevCount + 1);
  }, []);

  const rpsContract = useRPSInitialization({
    contractAddress,
    setGameData,
  });

  useRPSFetchData({ rpsContract, setGameData, transactionCount });

  const player1Actions = useRPSPlayer1Actions({
    rpsContract,
    gameData,
    incrementTransactionCount,
  });

  const player2Actions = useRPSPlayer2Actions({
    rpsContract,
    gameData,
    incrementTransactionCount,
  });

  return {
    gameData,
    player1Actions,
    player2Actions,
  };
};

export default useRPSContract;
