import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import { Move } from "../types";
import { BigNumber, ethers } from "ethers";
import { RPS, RPS__factory } from "@/contracts";
import useEncryption from "./useEncryption";
import useWallet from "./useWallet";
import { shortenAddress } from "@/utils/shortern";

interface UseRPSContract {
  setStatusMessage?: Dispatch<SetStateAction<string>>;
  contractAddress?: string;
}

interface GameData {
  gameAddress: string | null;
  j1: string | null;
  j2: string | null;
  c1Hash: string | null;
  c2: number;
  stake: string | null;
  timeout: number;
  lastAction: number;
}

const defaultGameData: GameData = {
  gameAddress: null,
  j1: null,
  j2: null,
  c1Hash: null,
  c2: 0,
  stake: null,
  timeout: 0,
  lastAction: 0,
};

const useRPSContract = ({
  setStatusMessage,
  contractAddress,
}: UseRPSContract) => {
  const { provider, address } = useWallet();
  const { encryptMessage, decryptMessage, hashSaltedMove } = useEncryption();
  const [rpsContract, setRpsContract] = useState<RPS | null>(null);
  const [gameData, setGameData] = useState<GameData>(defaultGameData);
  const [transactionCount, setTransactionCount] = useState(0);
  const incrementTransactionCount = useCallback(() => {
    setTransactionCount((prevCount) => prevCount + 1);
  }, []);

  const initContract = useCallback(async () => {
    if (!contractAddress || !provider) return;
    if ((await provider.getCode(contractAddress)) === "0x") {
      setGameData({
        ...defaultGameData,
        gameAddress: contractAddress,
      });
      return;
    }
    const signer = provider.getSigner();
    const contract = RPS__factory.connect(contractAddress, signer);
    setRpsContract(contract);
    incrementTransactionCount();
    if (setStatusMessage) setStatusMessage("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contractAddress, provider, address]);

  useEffect(() => {
    initContract();
  }, [initContract]);

  useEffect(() => {
    if (!rpsContract) return;

    const fetchContractData = async () => {
      const [j1, j2, c1Hash, c2, stake, timeout, lastAction] =
        await Promise.all([
          rpsContract.j1(),
          rpsContract.j2(),
          rpsContract.c1Hash(),
          rpsContract.c2(),
          rpsContract.stake(),
          rpsContract.TIMEOUT(),
          rpsContract.lastAction(),
        ]);
      setGameData({
        gameAddress: rpsContract.address,
        j1,
        j2,
        c1Hash,
        c2,
        stake: ethers.utils.formatEther(stake),
        timeout: timeout.toNumber(),
        lastAction: lastAction.toNumber(),
      });
    };

    fetchContractData();
  }, [rpsContract, transactionCount]);

  const startGame = useCallback(
    async (selectedMove: Move, amount: string, opponentAddress: string) => {
      if (!setStatusMessage || !provider) return;

      if (address === opponentAddress) {
        setStatusMessage("You can't play against yourself");
        return;
      }

      try {
        setStatusMessage("Starting the game...");

        const salt = ethers.BigNumber.from(ethers.utils.randomBytes(32));
        const hashedMove = hashSaltedMove(parseInt(Move[selectedMove]), salt);

        setStatusMessage("Deploying the contract...");

        const signer = provider.getSigner();
        const rpsFactory = new RPS__factory(signer);
        const rpsContract = await rpsFactory.deploy(
          hashedMove,
          opponentAddress,
          {
            value: ethers.utils.parseEther(amount),
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
          value: ethers.utils.parseEther(gameData.stake || "0"),
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
    if (!rpsContract || !setStatusMessage || !contractAddress || !provider)
      return;

    try {
      setStatusMessage("Decrypting your move...");

      const encryptedTurn = localStorage.getItem(contractAddress);
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

      localStorage.removeItem(contractAddress);

      setStatusMessage("Move revealed successfully.");
      incrementTransactionCount();
    } catch (error) {
      setStatusMessage(`Error revealing move: ${error}`);
    }
  }, [
    rpsContract,
    setStatusMessage,
    contractAddress,
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

  return {
    startGame,
    gameData,
    onPlay,
    onSolve,
    onJ1Timeout,
    onJ2Timeout,
  };
};

export default useRPSContract;
export type { GameData };
