import React from "react";
import useWallet from "@/hooks/useWallet";
import { shortenAddress } from "@/utils/shorten";

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
    ? `Disconnect (${shortenAddress(address)})`
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
