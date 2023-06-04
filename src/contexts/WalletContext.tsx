import React, {
  createContext,
  useState,
  ReactNode,
  useCallback,
  useEffect,
  useContext,
} from "react";
import { MetaMaskInpageProvider } from "@metamask/providers";

interface WalletContextData {
  provider: MetaMaskInpageProvider | null;
  address: string | null;
  chainId: string;
  connectWallet: () => Promise<string | null>;
  switchChainId: (chainId: string) => Promise<void>;
  disconnectWallet: () => void;
}

const WalletContext = createContext<WalletContextData | undefined>(undefined);

interface WalletProviderProps {
  children: ReactNode;
}

const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [provider, setProvider] = useState<MetaMaskInpageProvider | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [chainId, setChainId] = useState<string>("");

  useEffect(() => {
    const metamaskProvider = window.ethereum;
    if (!metamaskProvider) {
      console.error("Metamask is not detected");
      return;
    }

    setProvider(metamaskProvider);
    connectWallet();

    metamaskProvider.on("accountsChanged", (accounts) => {
      setAddress((accounts as string[])[0]);
    });
    metamaskProvider.on("chainChanged", (chainId) => {
      setChainId(chainId as string);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const connectWallet = useCallback(async () => {
    const metamaskProvider = window.ethereum;
    if (!metamaskProvider) {
      console.error("Metamask is not detected");
      return null;
    }

    try {
      setProvider(metamaskProvider);

      const providerChainId =
        ((await metamaskProvider.request<string>({
          method: "eth_chainId",
        })) as string) ?? null;
      setChainId(providerChainId);

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

  const switchChainId = useCallback(
    async (chainId: string) => {
      if (!provider) {
        console.error("Metamask is not detected");
        return;
      }

      try {
        await provider.request<string[]>({
          method: "wallet_switchEthereumChain",
          params: [{ chainId }],
        });
      } catch (switchError) {
        console.error(switchError);
      }
    },
    [provider]
  );

  const disconnectWallet = () => {
    setProvider(null);
    setAddress(null);
  };

  return (
    <WalletContext.Provider
      value={{
        provider,
        address,
        chainId,
        connectWallet,
        switchChainId,
        disconnectWallet,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

const useWallet = (): WalletContextData => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
};

export type { WalletContextData };
export { WalletContext, WalletProvider, useWallet };
