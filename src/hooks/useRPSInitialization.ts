import { RPS, RPS__factory } from "@/contracts";
import {
  useState,
  useCallback,
  useEffect,
  Dispatch,
  SetStateAction,
} from "react";
import useWallet from "./useWallet";
import { GameData } from "@/types";

interface UseRPSInitialization {
  setGameData: Dispatch<SetStateAction<GameData>>;
  contractAddress: string | null;
}

const useRPSInitialization = ({
  contractAddress,
  setGameData,
}: UseRPSInitialization): RPS | null => {
  const { provider, address } = useWallet();
  const [rpsContract, setRpsContract] = useState<RPS | null>(null);

  const initContract = useCallback(async () => {
    if (!contractAddress || !provider) return;

    try {
      if ((await provider.getCode(contractAddress)) === "0x") {
        setGameData((prevGameData) => ({
          ...prevGameData,
          isGame: false,
        }));
        return;
      }
      const signer = provider.getSigner();
      const contract = RPS__factory.connect(contractAddress, signer);
      setRpsContract(contract);
    } catch (error) {
      console.error(error);
      setGameData((prevGameData) => ({
        ...prevGameData,
        isGame: false,
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contractAddress, provider, address]);

  useEffect(() => {
    initContract();
  }, [initContract]);

  return rpsContract;
};

export default useRPSInitialization;
