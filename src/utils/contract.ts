import { RPS__factory } from "@/contracts";
import { MetaMaskInpageProvider } from "@metamask/providers";
import { ethers } from "ethers";

export const deployContract = async (
  provider: MetaMaskInpageProvider,
  hashedMove: string,
  opponentAddress: string,
  amount: string
) => {
  const ethersProvider = new ethers.providers.Web3Provider(
    provider as unknown as ethers.providers.ExternalProvider
  );
  const signer = ethersProvider.getSigner();
  const rpsFactory = new RPS__factory(signer);
  return rpsFactory.deploy(hashedMove, opponentAddress, {
    value: ethers.utils.parseUnits(amount, "wei"),
  });
};
