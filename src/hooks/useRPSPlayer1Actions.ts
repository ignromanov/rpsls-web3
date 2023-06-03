import { useCallback } from "react";
import useEncryption from "./useEncryption";
import useWallet from "./useWallet";
import { RPS } from "@/contracts";
import { GameData, Move, Player1SecretData } from "@/types";
import { shortenAddress } from "@/utils/shorten";
import { ethers, BigNumber } from "ethers";
import { useStatusMessage } from "@/contexts/StatusMessageContext";
import { errorMessageHandler } from "@/utils/errors";
import {
  getHashedGame,
  hashSaltedMove,
  prepareMessageToSave,
} from "@/utils/encryption";
import { deployContract } from "@/utils/contract";
import { EthEncryptedData } from "@metamask/eth-sig-util";

type UseRPSPlayer1Actions = (input: {
  rpsContract: RPS | null;
  gameData: GameData;
  incrementTransactionCount: () => void;
}) => {
  startGame: (
    selectedMove: Move,
    amount: string,
    opponentAddress: string
  ) => Promise<{
    contractAddress: string | null;
    _secretToSave: Player1SecretData | EthEncryptedData | null;
  }>;
  onSolve: () => Promise<void>;
  onJ2Timeout: () => Promise<void>;
};

const useRPSPlayer1Actions: UseRPSPlayer1Actions = ({
  rpsContract,
  gameData,
  incrementTransactionCount,
}) => {
  const { provider, address, chainId } = useWallet();
  const { encryptMessage, decryptMessage } = useEncryption();
  const { setStatusMessage } = useStatusMessage();

  const startGame = useCallback(
    async (
      selectedMove: Move,
      amount: string,
      opponentAddress: string
    ): Promise<{
      contractAddress: string | null;
      _secretToSave: Player1SecretData | EthEncryptedData | null;
    }> => {
      let contractAddress: string | null = null;
      let _secretToSave: Player1SecretData | EthEncryptedData | null = null;

      if (!setStatusMessage || !provider)
        return { contractAddress, _secretToSave };

      if (address?.toLowerCase() === opponentAddress.toLowerCase()) {
        setStatusMessage("You can't play against yourself");
        return { contractAddress, _secretToSave };
      }

      incrementTransactionCount();
      try {
        setStatusMessage("Starting the game...");
        const salt = ethers.BigNumber.from(ethers.utils.randomBytes(32));
        const hashedMove = hashSaltedMove(parseInt(Move[selectedMove]), salt);
        _secretToSave = prepareMessageToSave(selectedMove, salt);

        setStatusMessage("Deploying the contract...");
        const rpsContract = await deployContract(
          provider,
          hashedMove,
          opponentAddress,
          amount
        );

        setStatusMessage("Waiting for the contract to be deployed...");
        await rpsContract.deployed();
        contractAddress = rpsContract.address;

        setStatusMessage("Encrypting secret...");
        const messageToEncrypt = prepareMessageToSave(
          selectedMove,
          salt,
          chainId,
          contractAddress
        );
        _secretToSave = messageToEncrypt;

        const encryptedData = await encryptMessage(messageToEncrypt);
        if (encryptedData) {
          _secretToSave = encryptedData;
          localStorage.setItem(contractAddress, JSON.stringify(encryptedData));
        } else {
          setStatusMessage("Error encrypting secret data");
          return {
            contractAddress,
            _secretToSave,
          };
        }

        setStatusMessage(
          `Game started! Contract address: ${shortenAddress(
            rpsContract.address
          )}`
        );

        return { contractAddress, _secretToSave };
      } catch (error) {
        console.error(error);
        setStatusMessage(
          `Error starting the game: ${errorMessageHandler(error)}`
        );
        return { contractAddress, _secretToSave };
      }
    },
    [
      address,
      chainId,
      encryptMessage,
      incrementTransactionCount,
      provider,
      setStatusMessage,
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

      const decryptedTurn = await decryptMessage(JSON.parse(encryptedTurn));
      if (!decryptedTurn) {
        setStatusMessage("Error decrypting move.");
        return;
      }

      setStatusMessage("Revealing your move...");

      const tx = await rpsContract.solve(Move[move], BigNumber.from(salt));

      setStatusMessage("Waiting for the transaction to be mined...");

      await tx.wait();

      localStorage.removeItem(gameData.address);

      setStatusMessage("Move revealed successfully.");
      incrementTransactionCount();
    } catch (error) {
      console.error(error);
      setStatusMessage(`Error revealing move: ${errorMessageHandler(error)}`);
    }
  }, [
    rpsContract,
    setStatusMessage,
    gameData.address,
    provider,
    decryptMessage,
    incrementTransactionCount,
  ]);

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
      setStatusMessage(`Error claiming funds: ${errorMessageHandler(error)}`);
    }
  }, [rpsContract, setStatusMessage, provider, incrementTransactionCount]);

  return { startGame, onSolve, onJ2Timeout };
};

export default useRPSPlayer1Actions;
