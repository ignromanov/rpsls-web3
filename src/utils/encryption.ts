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

export const getHashedGame = (
  chainId: string,
  contractAddress: string,
  move: Move,
  salt: ethers.BigNumber
) => {
  const gameState = `${chainId}/${contractAddress}/${move}/${salt.toHexString()}`;
  const hashedGame = ethers.utils.keccak256(
    ethers.utils.toUtf8Bytes(gameState)
  );

  return hashedGame;
};

export const hashSaltedMove = (move: number, salt: ethers.BigNumber) => {
  const hash = ethers.utils.solidityKeccak256(
    ["uint8", "uint256"],
    [move, salt]
  );
  return hash;
};
