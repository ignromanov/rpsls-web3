import { Dispatch, SetStateAction, useCallback, useState } from "react";
import { GameData } from "../types";
import useRPSInitialization from "./useRPSInitialization";
import useRPSPlayerActions from "./useRPSPlayerActions";
import useRPSFetchData from "./useRPSFetchData";

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
  setStatusMessage?: Dispatch<SetStateAction<string>>;
  contractAddress?: string | null;
}

const useRPSContract = ({
  setStatusMessage,
  contractAddress = null,
}: UseRPSContract) => {
  const [gameData, setGameData] = useState<GameData>({
    ...defaultGameData,
    address: contractAddress,
  });
  const [transactionCount, setTransactionCount] = useState(0);

  const incrementTransactionCount = useCallback(() => {
    setTransactionCount((prevCount) => prevCount + 1);
  }, []);

  const rpsContract = useRPSInitialization({
    contractAddress,
    setGameData,
  });

  useRPSFetchData({ rpsContract, setGameData, transactionCount });

  const playerActions = useRPSPlayerActions({
    rpsContract,
    gameData,
    setStatusMessage,
    incrementTransactionCount,
  });

  return {
    gameData,
    playerActions,
  };
};

export default useRPSContract;
