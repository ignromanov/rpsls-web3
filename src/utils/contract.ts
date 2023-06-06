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
    contractVersion === RPSVersion.RPSV2
      ? new RPSV2__factory(signer)
      : new RPS__factory(signer);
  return rpsFactory.deploy(hashedMove, opponentAddress, {
    value: ethers.utils.parseUnits(amount, "wei"),
  });
};

export const checkRPSVersion = (bytecode: string) => {
  if (bytecode.includes(ethers.utils.id("c1()").slice(2, 10))) {
    return RPSVersion.RPSV2;
  } else if (bytecode.includes(ethers.utils.id("c2()").slice(2, 10))) {
    return RPSVersion.RPS;
  } else {
    return undefined;
  }
};

export const checkWinner = async (
  contract: RPS | RPSV2,
  { c1, c2, j1, j2 }: GameData
) => {
  let winner: string | undefined | null = null;

  if (!c1 || !c2 || !j1 || !j2) {
    return winner;
  }

  if (await contract.win(c1, c2)) {
    winner = j1;
  } else if (await contract.win(c2, c1)) {
    winner = j2;
  } else {
    winner = undefined;
  }

  return winner;
};
