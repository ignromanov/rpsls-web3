import { useGameData } from "@/contexts/GameDataContext";
import { RPS, RPSV2 } from "@/contracts";
import { RPSVersion } from "@/types";
import { checkWinner } from "@/utils/contract";
import { ethers } from "ethers";
import { useLayoutEffect, useState } from "react";

interface UseRPSFetchData {
  rpsContract: RPS | RPSV2 | null;
  transactionCount: number;
}
const useRPSFetchData = ({
  rpsContract,
  transactionCount,
}: UseRPSFetchData) => {
  const [fetchIntervalTime, setFetchIntervalTime] = useState(5000);
  const { gameData, setGameData } = useGameData();
  const { chainId, contractAddress, contractVersion } = gameData;

  useLayoutEffect(() => {
    if (!rpsContract || !contractAddress) return;

    const fetchContractData = async () => {
      try {
        const [c1, c2, stake, lastAction, j1, j2, c1Hash, timeout] =
          await Promise.all([
            contractVersion === RPSVersion.RPSV2
              ? (rpsContract as RPSV2).c1()
              : 0,
            rpsContract.c2(),
            rpsContract.stake(),
            rpsContract.lastAction(),
            rpsContract.j1(),
            rpsContract.j2(),
            rpsContract.c1Hash(),
            rpsContract.TIMEOUT(),
          ]);

        const winner = await checkWinner(rpsContract, {
          ...gameData,
          c1,
          c2,
          j1,
          j2,
        });

        if (winner !== null || stake.eq(0)) {
          setFetchIntervalTime(60000);
        }
        setGameData((prevGameData) => {
          const newLastAction = lastAction.toNumber();
          const newStake = ethers.utils.formatUnits(stake, "wei");
          if (
            prevGameData.c1 !== c1 ||
            prevGameData.c2 !== c2 ||
            prevGameData.lastAction !== newLastAction ||
            prevGameData.stake !== newStake ||
            prevGameData.winner !== winner ||
            prevGameData.j1 !== j1 ||
            prevGameData.j2 !== j2 ||
            prevGameData.c1Hash !== c1Hash ||
            prevGameData.timeout !== timeout.toNumber()
          ) {
            return {
              ...prevGameData,
              c1,
              c2,
              winner,
              stake: newStake,
              lastAction: newLastAction,
              isGame: true,
              j1,
              j2,
              c1Hash,
              timeout: timeout.toNumber(),
            };
          }

          return prevGameData;
        });
      } catch (error) {
        console.error(error);
        setGameData((prevGameData) => ({
          ...prevGameData,
          isGame: false,
        }));
      }
    };

    fetchContractData();
    const fetchInterval = setInterval(() => {
      fetchContractData();
    }, fetchIntervalTime);

    return () => clearInterval(fetchInterval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    rpsContract,
    transactionCount,
    chainId,
    contractAddress,
    fetchIntervalTime,
  ]);
};

export default useRPSFetchData;
