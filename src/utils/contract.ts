import { RPS, RPSV2, RPSV2__factory, RPS__factory } from "@/contracts";
import { GameData, RPSVersion } from "@/types";
import { MetaMaskInpageProvider } from "@metamask/providers";
import { ethers } from "ethers";

export const deployContract = async (
  provider: MetaMaskInpageProvider,
  contractVersion: RPSVersion,
  hashedMove: string,
  opponentAddress: string,
  amount: string
) => {
  const ethersProvider = new ethers.providers.Web3Provider(
    provider as unknown as ethers.providers.ExternalProvider
  );
  const signer = ethersProvider.getSigner();
  const rpsFactory =
    contractVersion === RPSVersion.RPS
      ? new RPS__factory(signer)
      : new RPSV2__factory(signer);
  return rpsFactory.deploy(hashedMove, opponentAddress, {
    value: ethers.utils.parseUnits(amount, "wei"),
  });
};

export const checkRPSVersion = (RPSContract: RPS | RPSV2) => {
  if ("c2" in RPSContract) {
    return RPSVersion.RPSV2;
  }
  return RPSVersion.RPS;
};
