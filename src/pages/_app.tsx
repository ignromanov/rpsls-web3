import "@/app/globals.css";
import CardLayout from "@/components/layouts/CardLayout";
import { AppProps } from "next/app";
import { WalletProvider } from "@/contexts/WalletContext";

const RPSLSApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <WalletProvider>
      <CardLayout>
        <Component {...pageProps} />
      </CardLayout>
    </WalletProvider>
  );
};

export default RPSLSApp;
