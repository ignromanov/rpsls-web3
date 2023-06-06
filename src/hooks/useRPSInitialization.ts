import { RPS, RPS__factory, RPSV2, RPSV2__factory } from "@/contracts";
import { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import { useStatusMessage } from "@/contexts/StatusMessageContext";
import { errorMessageHandler } from "@/utils/errors";
import { useWallet } from "@/contexts/WalletContext";
import { useGameData } from "@/contexts/GameDataContext";
import { RPSVersion } from "@/types";
import { checkRPSVersion } from "@/utils/contract";
import { checkWinner } from "@/utils/contract";

const useRPSInitialization = (): RPS | RPSV2 | null => {
  const { gameData, setGameData } = useGameData();
  const { chainId: contractChainId, contractAddress } = gameData;

  const [rpsContract, setRpsContract] = useState<RPS | RPSV2 | null>(null);

  const { provider } = useWallet();
  const { setStatusMessage } = useStatusMessage();

  const handleGameStartedEvent = useCallback(
    (_c1Hash: string, _j2: string) => {
      setGameData((prevGameData) => ({
        ...prevGameData,
        c1Hash: _c1Hash,
        j2: _j2,
      }));
    },
    [setGameData]
  );

  const handleMoveMadeEvent = useCallback(
    (_c2: number) => {
      setGameData((prevGameData) => ({
        ...prevGameData,
        c2: _c2,
      }));
    },
    [setGameData]
  );

  const handleGameSolvedEvent = useCallback(
    (contract: RPSV2) => async (_c1: number) => {
      try {
        const c1 = _c1;
        const winner = await checkWinner(contract, { ...gameData, c1 });

        setGameData((prevGameData) => {
          return {
            ...prevGameData,
            c1: _c1,
            winner,
          };
        });
      } catch (error) {
        console.error(error);
        setStatusMessage(
          `Error while resolving game: ${errorMessageHandler(error)}`
        );
        setGameData((prevGameData) => ({
          ...prevGameData,
          isGame: false,
        }));
      }
    },
    [gameData, setGameData, setStatusMessage]
  );

  const handleJ1TimedOutEvent = useCallback(() => {
    setGameData((prevGameData) => ({
      ...prevGameData,
      winner: prevGameData.j2,
    }));
  }, [setGameData]);

  const handleJ2TimedOutEvent = useCallback(() => {
    setGameData((prevGameData) => ({
      ...prevGameData,
      winner: prevGameData.j1,
    }));
  }, [setGameData]);

  useEffect(() => {
    const initContract = async () => {
      if (!contractAddress || !provider) return;

      try {
        const ethersProvider = new ethers.providers.Web3Provider(
          provider as unknown as ethers.providers.ExternalProvider
        );
        const contractByteCode = await ethersProvider.getCode(contractAddress);
        if (contractByteCode === "0x") {
          setGameData((prevGameData) => ({
            ...prevGameData,
            isGame: false,
          }));
          return;
        }

        let contract: RPS | RPSV2;
        const signer = ethersProvider.getSigner();
        const contractVersion = checkRPSVersion(contractByteCode);
        if (contractVersion === RPSVersion.RPS) {
          contract = RPS__factory.connect(contractAddress, signer);
        } else if (contractVersion === RPSVersion.RPSV2) {
          contract = RPSV2__factory.connect(contractAddress, signer);
        } else {
          setGameData((prevGameData) => ({
            ...prevGameData,
            isGame: false,
          }));
          return;
        }

        if (contractVersion === RPSVersion.RPSV2) {
          contract = RPSV2__factory.connect(contractAddress, signer);

          contract.on("GameStarted(bytes32,address)", handleGameStartedEvent);
          contract.on("MoveMade(uint8)", handleMoveMadeEvent);
          contract.on(
            "GameSolved(uint8,uint256)",
            handleGameSolvedEvent(contract as RPSV2)
          );
          contract.on("J1TimedOut()", handleJ1TimedOutEvent);
          contract.on("J2TimedOut()", handleJ2TimedOutEvent);
        }

        setGameData((prevGameData) => ({
          ...prevGameData,
          contractVersion,
        }));
        setRpsContract(contract);
      } catch (error) {
        console.error(error);
        setStatusMessage(
          `Error while initializing contract: ${errorMessageHandler(error)}`
        );
        setGameData((prevGameData) => ({
          ...prevGameData,
          isGame: false,
        }));
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    };

    initContract();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    provider,
    contractChainId,
    contractAddress,
    setGameData,
    setStatusMessage,
  ]);

  return rpsContract;
};

export default useRPSInitialization;
