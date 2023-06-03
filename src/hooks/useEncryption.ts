import { useCallback } from "react";
import useWallet from "./useWallet";
import { EthEncryptedData, encrypt } from "@metamask/eth-sig-util";
import { ethers } from "ethers";
import { Player1SecretData } from "@/types";

interface EncryptionHookData {
  encryptMessage: (
    dataToEncrypt: Player1SecretData
  ) => Promise<EthEncryptedData | undefined>;
  decryptMessage: (
    encryptedMessage: EthEncryptedData
  ) => Promise<Player1SecretData | undefined>;
}

const useEncryption = (): EncryptionHookData => {
  const { provider, address } = useWallet();

  const encryptMessage: EncryptionHookData["encryptMessage"] = useCallback(
    async (dataToEncrypt) => {
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
        data: JSON.stringify(dataToEncrypt),
        version: "x25519-xsalsa20-poly1305",
      });
      return encryptedMessage;
    },
    [provider]
  );
  const decryptMessage: EncryptionHookData["decryptMessage"] = useCallback(
    async (encryptedMessage) => {
      if (!provider) {
        console.error("Wallet is not connected");
        return;
      }

      const ethersProvider = new ethers.providers.Web3Provider(
        provider as unknown as ethers.providers.ExternalProvider
      );
      const decryptedMessage = (await ethersProvider.send("eth_decrypt", [
        JSON.stringify(encryptedMessage),
        address,
      ])) as string;
      return JSON.parse(decryptedMessage);
    },
    [address, provider]
  );

  return { encryptMessage, decryptMessage };
};

export default useEncryption;
