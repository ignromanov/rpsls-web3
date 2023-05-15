import { WalletContext, WalletContextData } from "@/contexts/WalletContext";
import { useContext } from "react";

const useWallet = (): WalletContextData => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
};

export default useWallet;
