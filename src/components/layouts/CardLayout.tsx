import WalletButton from "../elements/WalletButton";
import StatusMessage from "../elements/StatusMessage";
import AntiPhishingBanner from "../elements/AntiPhishingBanner";
import { useWallet } from "@/contexts/WalletContext";
import ShareGame from "../elements/ShareGame";

interface LayoutProps {
  children: React.ReactNode;
}

const CardLayout: React.FC<LayoutProps> = ({ children }) => {
  const { provider } = useWallet();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <AntiPhishingBanner />
      <div className="w-150 p-6 bg-violet-200 rounded-lg shadow-md">
        <div className="flex flex-col items-center justify-center">
          {!provider && <WalletButton />}
          {provider && children}
          {provider && <ShareGame />}
        </div>
      </div>
      {provider && (
        <div className="fixed top-0 right-0 p-4">
          <WalletButton />
        </div>
      )}
      <StatusMessage />
    </div>
  );
};

export default CardLayout;
