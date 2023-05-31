import React, {
  createContext,
  useState,
  ReactNode,
  useCallback,
  useEffect,
} from "react";
import { ethers } from "ethers";
import { MetaMaskInpageProvider } from "@metamask/providers";

interface WalletContextData {
  provider: MetaMaskInpageProvider | null;
  address: string | null;
  connectWallet: () => Promise<string | null>;
  disconnectWallet: () => void;
}

const WalletContext = createContext<WalletContextData | undefined>(undefined);

interface WalletProviderProps {
  children: ReactNode;
}

const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [provider, setProvider] =
    useState<ethers.providers.Web3Provider | null>(null);
  const [address, setAddress] = useState<string | null>(null);

  useEffect(() => {
    const metamaskProvider = window.ethereum;
    if (!metamaskProvider) {
      console.log("Metamask is not detected");
      return;
    }

    connectWallet();
    metamaskProvider.on("accountsChanged", (accounts) => {
        setAddress((accounts as string[])[0]);
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const connectWallet = useCallback(async () => {
    const metamaskProvider = window.ethereum;
    if (!metamaskProvider) {
      console.error("Metamask is not detected");
      return null;
    }

    try {
      const accounts =
        (await metamaskProvider.request<string[]>({
          method: "eth_requestAccounts",
        })) ?? null;

      if (accounts && accounts.length > 0 && accounts[0]) {
        setAddress(accounts[0]);
        return accounts[0];
      } else {
        return null;
      }
    } catch (error) {
      console.error("Failed to connect wallet", error);
      return null;
    }
  }, []);

  const disconnectWallet = () => {
    setProvider(null);
    setAddress(null);
  };

  return (
    <WalletContext.Provider
      value={{ provider, address, connectWallet, disconnectWallet }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export type { WalletContextData };
export { WalletContext, WalletProvider };
