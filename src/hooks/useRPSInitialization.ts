import { RPS, RPS__factory } from "@/contracts";
import {
  useState,
  useCallback,
  useEffect,
  Dispatch,
  SetStateAction,
} from "react";
import { GameData } from "@/types";
import { ethers } from "ethers";
import { useStatusMessage } from "@/contexts/StatusMessageContext";
import { errorMessageHandler } from "@/utils/errors";
import { useWallet } from "@/contexts/WalletContext";

interface UseRPSInitialization {
  setGameData: Dispatch<SetStateAction<GameData>>;
  contractAddress: string | null;
}

const useRPSInitialization = ({
  contractAddress,
  setGameData,
}: UseRPSInitialization): RPS | null => {
  const [rpsContract, setRpsContract] = useState<RPS | null>(null);

  const { provider, address, chainId } = useWallet();
  const { setStatusMessage } = useStatusMessage();

  const initContract = useCallback(async () => {
    if (!contractAddress || !provider) return;

    try {
      const ethersProvider = new ethers.providers.Web3Provider(
        provider as unknown as ethers.providers.ExternalProvider
      );
      if ((await ethersProvider.getCode(contractAddress)) === "0x") {
        setGameData((prevGameData) => ({
          ...prevGameData,
          isGame: false,
        }));
        return;
      }
      const signer = ethersProvider.getSigner();
      const contract = RPS__factory.connect(contractAddress, signer);
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
  }, [contractAddress, provider, address, chainId]);

  useEffect(() => {
    initContract();
  }, [initContract]);

  return rpsContract;
};

export default useRPSInitialization;
