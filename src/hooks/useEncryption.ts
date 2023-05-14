import { useCallback } from "react";
import { useWallet } from "./useWallet";
import { encrypt } from "@metamask/eth-sig-util";

interface EncryptionHookData {
  encryptMessage: (message: string) => Promise<string | undefined>;
  decryptMessage: (encryptedMessage: string) => Promise<string | undefined>;
}

export const useEncryption = (): EncryptionHookData => {
  const { provider, address } = useWallet();

  const encryptMessage = useCallback(
    async (message: string) => {
      if (!provider) {
        console.error("Wallet is not connected");
        return;
      }

      const signer = provider.getSigner();
      const account = await signer.getAddress();

      const encryptionPublicKey = await provider.send(
        "eth_getEncryptionPublicKey",
        [account]
      );
      console.log("encryptionPublicKey", encryptionPublicKey);

      const encryptedMessage = encrypt({
        publicKey: encryptionPublicKey,
        data: message,
        version: "x25519-xsalsa20-poly1305",
      });
      console.log("encryptedMessage", encryptedMessage);
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

      const decryptedMessage = await provider.send("eth_decrypt", [
        encryptedMessage,
        address,
      ]);
      return decryptedMessage;
    },
    [address, provider]
  );

  return { encryptMessage, decryptMessage };
};
