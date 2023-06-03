import { Move, Player1SecretData } from "@/types";
import { ethers } from "ethers";

export const prepareMessageToSave = (
  move: Move,
  salt: ethers.BigNumber,
  chainId?: string,
  contractAddress?: string
): Player1SecretData => {
  const hashedGame =
    chainId && contractAddress
      ? getHashedGame(chainId, contractAddress, move, salt)
      : null;

  const dataToEncrypt: Player1SecretData = {
    move,
    salt: salt.toHexString(),
    hash: hashedGame,
  };

  return dataToEncrypt;
};
