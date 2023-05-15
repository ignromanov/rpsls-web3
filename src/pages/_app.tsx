import "@/app/globals.css";
import CardLayout from "@/components/layouts/CardLayout";
import { AppProps } from "next/app";
import { WalletProvider } from "@/contexts/WalletContext";
import { Analytics } from "@vercel/analytics/react";

const RPSLSApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <WalletProvider>
      <CardLayout>
        <Component {...pageProps} />
        <Analytics />
      </CardLayout>
    </WalletProvider>
  );
};

export default RPSLSApp;
