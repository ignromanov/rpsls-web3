import { useCallback } from "react";
import useEncryption from "./useEncryption";
import useWallet from "./useWallet";
import { RPS, RPS__factory } from "@/contracts";
import { GameData, Move } from "@/types";
import { shortenAddress } from "@/utils/shorten";
import { ethers, BigNumber } from "ethers";
import { useStatusMessage } from "@/contexts/StatusMessageContext";

interface UseRPSPlayerActions {
  rpsContract: RPS | null;
  gameData: GameData;
  incrementTransactionCount: () => void;
}

const useRPSPlayerActions = ({
  rpsContract,
  gameData,
  incrementTransactionCount,
}: UseRPSPlayerActions) => {
  const { provider, address } = useWallet();
  const { encryptMessage, decryptMessage, hashSaltedMove } = useEncryption();
  const { setStatusMessage } = useStatusMessage();

  const startGame = useCallback(
    async (selectedMove: Move, amount: string, opponentAddress: string) => {
      if (!setStatusMessage || !provider) return;

      if (address?.toLowerCase() === opponentAddress.toLowerCase()) {
        setStatusMessage("You can't play against yourself");
        return;
      }

      try {
        setStatusMessage("Starting the game...");

        const salt = ethers.BigNumber.from(ethers.utils.randomBytes(32));
        const hashedMove = hashSaltedMove(parseInt(Move[selectedMove]), salt);

        setStatusMessage("Deploying the contract...");

        const ethersProvider = new ethers.providers.Web3Provider(
          provider as unknown as ethers.providers.ExternalProvider
        );
        const signer = ethersProvider.getSigner();
        const rpsFactory = new RPS__factory(signer);
        const rpsContract = await rpsFactory.deploy(
          hashedMove,
          opponentAddress,
          {
            value: ethers.utils.parseUnits(amount, "wei"),
          }
        );

        setStatusMessage("Waiting for the contract to be deployed...");

        await rpsContract.deployed();

        setStatusMessage("Encrypting salt...");

        // Encryption
        const turnToEncrypt = JSON.stringify({
          move: selectedMove,
          salt: salt.toHexString(),
        });
        const encryptedTurn = await encryptMessage(turnToEncrypt);

        if (encryptedTurn) {
          localStorage.setItem(rpsContract.address, encryptedTurn);
        } else {
          setStatusMessage("Error encrypting salt");
          return;
        }

        setStatusMessage(
          `Game started! Contract address: ${shortenAddress(
            rpsContract.address
          )}`
        );
        incrementTransactionCount();

        return rpsContract.address;
      } catch (error) {
        setStatusMessage(`Error starting the game: ${error}`);
      }
    },
    [
      address,
      encryptMessage,
      hashSaltedMove,
      incrementTransactionCount,
      provider,
      setStatusMessage,
    ]
  );

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
        setStatusMessage(`Error submitting move: ${error}`);
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

  const onSolve = useCallback(async () => {
    if (!rpsContract || !setStatusMessage || !gameData.address || !provider)
      return;

    try {
      setStatusMessage("Decrypting your move...");

      const encryptedTurn = localStorage.getItem(gameData.address);
      if (!encryptedTurn) {
        setStatusMessage("Error: Encrypted move not found in localStorage.");
        return;
      }

      const decryptedTurn = await decryptMessage(encryptedTurn);
      if (!decryptedTurn) {
        setStatusMessage("Error decrypting move.");
        return;
      }

      setStatusMessage("Revealing your move...");

      const { move, salt } = JSON.parse(decryptedTurn);

      const tx = await rpsContract.solve(Move[move], BigNumber.from(salt));

      setStatusMessage("Waiting for the transaction to be mined...");

      await tx.wait();

      localStorage.removeItem(gameData.address);

      setStatusMessage("Move revealed successfully.");
      incrementTransactionCount();
    } catch (error) {
      console.error(error);
      setStatusMessage(`Error revealing move: ${error}`);
    }
  }, [
    rpsContract,
    setStatusMessage,
    gameData.address,
    provider,
    decryptMessage,
    incrementTransactionCount,
  ]);

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
      setStatusMessage(`Error claiming funds: ${error}`);
    }
  }, [rpsContract, setStatusMessage, provider, incrementTransactionCount]);

  const onJ2Timeout = useCallback(async () => {
    if (!rpsContract || !setStatusMessage || !provider) return;

    try {
      setStatusMessage("Claiming funds due to player 2 timeout...");

      const tx = await rpsContract.j2Timeout();

      setStatusMessage("Waiting for the transaction to be mined...");

      await tx.wait();

      setStatusMessage("Funds claimed successfully.");
      incrementTransactionCount();
    } catch (error) {
      setStatusMessage(`Error claiming funds: ${error}`);
    }
  }, [rpsContract, setStatusMessage, provider, incrementTransactionCount]);

  return { startGame, onPlay, onSolve, onJ1Timeout, onJ2Timeout };
};

export default useRPSPlayerActions;
