import useWallet from "@/hooks/useWallet";
import WalletButton from "../elements/WalletButton";
import StatusMessage from "../elements/StatusMessage";

interface LayoutProps {
  children: React.ReactNode;
}

const CardLayout: React.FC<LayoutProps> = ({ children }) => {
  const { provider } = useWallet();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="w-150 p-4 bg-violet-200 rounded-lg shadow-md">
        <div className="flex flex-col items-center justify-center">
          <WalletButton />
          {provider && children}
        </div>
      </div>
      <StatusMessage />
    </div>
  );
};

export default CardLayout;
