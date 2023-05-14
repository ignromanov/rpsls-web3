import React from "react";
import { useWallet } from "@/hooks/useWallet";

const WalletButton: React.FC = () => {
  const { provider, address, connectWallet, disconnectWallet } = useWallet();

  const handleButtonClick = () => {
    if (provider) {
      disconnectWallet();
    } else {
      connectWallet();
    }
  };

  const buttonText = provider
    ? `Disconnect (${address?.slice(0, 6)}...${address?.slice(-4)})`
    : "Connect";

  return (
    <button
      className="bg-violet-500 hover:bg-violet-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      onClick={handleButtonClick}
    >
      {buttonText}
    </button>
  );
};

export default WalletButton;
