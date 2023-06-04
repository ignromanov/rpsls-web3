import { useGameData } from "@/contexts/GameDataContext";
import { RPS } from "@/contracts";
import { ethers } from "ethers";
import { useLayoutEffect } from "react";

interface UseRPSFetchData {
  rpsContract: RPS | null;
  transactionCount: number;
}
const useRPSFetchData = ({
  rpsContract,
  transactionCount,
}: UseRPSFetchData) => {
  const { gameData, setGameData } = useGameData();
  const { chainId, contractAddress } = gameData;

  // fetch basic game data
  useLayoutEffect(() => {
    if (!rpsContract || !contractAddress) return;

    const fetchBasicContractData = async () => {
      try {
        const [j1, j2, c1Hash, timeout] = await Promise.all([
          rpsContract.j1(),
          rpsContract.j2(),
          rpsContract.c1Hash(),
          rpsContract.TIMEOUT(),
        ]);
        setGameData((prevGameData) => ({
          ...prevGameData,
          isGame: true,
          j1,
          j2,
          c1Hash,
          timeout: timeout.toNumber(),
        }));
      } catch (error) {
        console.error(error);
        setGameData((prevGameData) => ({
          ...prevGameData,
          isGame: false,
        }));
      }
    };
    fetchBasicContractData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rpsContract, chainId, contractAddress]);

  // fetch game changes
  useLayoutEffect(() => {
    if (!rpsContract || !contractAddress) return;

    const fetchContractData = async () => {
      try {
        const [c2, stake, lastAction] = await Promise.all([
          rpsContract.c2(),
          rpsContract.stake(),
          rpsContract.lastAction(),
        ]);

        setGameData((prevGameData) => {
          const newLastAction = lastAction.toNumber();
          const newStake = ethers.utils.formatUnits(stake, "wei");
          if (
            prevGameData.c2 !== c2 ||
            prevGameData.lastAction !== newLastAction ||
            prevGameData.stake !== newStake
          ) {
            return {
              ...prevGameData,
              c2,
              stake: newStake,
              lastAction: newLastAction,
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
    }, 3000);

    return () => clearInterval(fetchInterval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rpsContract, transactionCount, chainId, contractAddress]);
};

export default useRPSFetchData;
