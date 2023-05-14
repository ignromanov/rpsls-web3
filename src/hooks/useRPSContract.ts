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
import { useEncryption } from "./useEncryption";
import { useWallet } from "./useWallet";

interface UseRPSContract {
  setStatusMessage?: Dispatch<SetStateAction<string>>;
  contractAddress?: string;
}

export const useRPSContract = ({
  setStatusMessage,
  contractAddress,
}: UseRPSContract) => {
  const { provider, address } = useWallet();
  const { encryptMessage, decryptMessage } = useEncryption();
  const [rpsContract, setRpsContract] = useState<RPS | null>(null);
  const [gameData, setGameData] = useState<{
    j1: string | null;
    j2: string | null;
    c1Hash: string | null;
    c2: number | null;
    stake: string | null;
    timeout: string | null;
    lastAction: string | null;
  }>({
    j1: null,
    j2: null,
    c1Hash: null,
    c2: null,
    stake: null,
    timeout: null,
    lastAction: null,
  });
  const initContract = useCallback(async () => {
    if (!contractAddress || !provider) return;
    const contract = RPS__factory.connect(contractAddress, provider);
    setRpsContract(contract);
  }, [contractAddress, provider]);

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
        j1,
        j2,
        c1Hash,
        c2,
        stake: ethers.utils.formatEther(stake),
        timeout: ethers.utils.formatEther(timeout),
        lastAction: ethers.utils.formatEther(lastAction),
      });
    };

    fetchContractData();
  }, [rpsContract]);

  const startGame = useCallback(
    async (selectedMove: Move, opponentAddress: string) => {
      if (!setStatusMessage) return;

      if (!provider) {
        setStatusMessage("No provider");
        return;
      }

      if (address === opponentAddress) {
        setStatusMessage("You can't play against yourself");
        return;
      }

      try {
        setStatusMessage("Starting the game...");

        // Generate a random salt
        const salt = ethers.BigNumber.from(ethers.utils.randomBytes(32));

        // Hash the selectedMove and salt using keccak256
        const hashedMove = ethers.utils.keccak256(
          ethers.utils.defaultAbiCoder.encode(
            ["uint8", "uint256"],
            [Move[selectedMove], salt]
          )
        );

        setStatusMessage("Deploying the contract...");

        // Deploy the RPS contract with the hashed commitment and opponent's address
        const signer = provider.getSigner();
        const rpsFactory = new RPS__factory(signer);
        const rpsContract = await rpsFactory.deploy(
          hashedMove,
          opponentAddress,
          {
            value: ethers.utils.parseEther("0.1"),
          }
        );
        await rpsContract.deployed();

        setStatusMessage("Encrypting salt...");

        // Encrypt the salt using the encryptMessage function from the useEncryption hook
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
          `Game started! Contract address: ${rpsContract.address}`
        );

        return rpsContract.address;
      } catch (error) {
        setStatusMessage(`Error starting the game: ${error}`);
      }
    },
    [address, encryptMessage, provider, setStatusMessage]
  );

  return {
    startGame,
    gameData,
  };
};
