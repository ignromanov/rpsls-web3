import { useCallback } from "react";
import useWallet from "./useWallet";
import { encrypt } from "@metamask/eth-sig-util";
import { ethers, BigNumber } from "ethers";

interface EncryptionHookData {
  encryptMessage: (message: string) => Promise<string | undefined>;
  decryptMessage: (encryptedMessage: string) => Promise<string | undefined>;
  hashSaltedMove: (move: number, salt: BigNumber) => string;
}

const useEncryption = (): EncryptionHookData => {
  const { provider, address } = useWallet();

  const encryptMessage = useCallback(
    async (message: string) => {
      if (!provider) {
        console.error("Wallet is not connected");
        return;
      }

      const ethersProvider = new ethers.providers.Web3Provider(
        provider as unknown as ethers.providers.ExternalProvider
      );
      const signer = ethersProvider.getSigner();
      const account = await signer.getAddress();

      const encryptionPublicKey = await ethersProvider.send(
        "eth_getEncryptionPublicKey",
        [account]
      );

      const encryptedMessage = encrypt({
        publicKey: encryptionPublicKey,
        data: message,
        version: "x25519-xsalsa20-poly1305",
      });
      return JSON.stringify(encryptedMessage);
    },
    [provider]
  );

  const decryptMessage = useCallback(
    async (encryptedMessage: string) => {
      if (!provider) {
        console.error("Wallet is not connected");
        return;
      }

      const ethersProvider = new ethers.providers.Web3Provider(
        provider as unknown as ethers.providers.ExternalProvider
      );
      const decryptedMessage = (await ethersProvider.send("eth_decrypt", [
        encryptedMessage,
        address,
      ])) as string;
      return decryptedMessage;
    },
    [address, provider]
  );

  const hashSaltedMove = useCallback((move: number, salt: BigNumber) => {
    const hash = ethers.utils.solidityKeccak256(
      ["uint8", "uint256"],
      [move, salt]
    );
    return hash;
  }, []);

  return { encryptMessage, decryptMessage, hashSaltedMove };
};

export default useEncryption;
