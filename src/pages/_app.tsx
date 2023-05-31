import "@/app/globals.css";
import CardLayout from "@/components/layouts/CardLayout";
import { AppProps } from "next/app";
import { WalletProvider } from "@/contexts/WalletContext";
import { Analytics } from "@vercel/analytics/react";
import { StatusMessageProvider } from "@/contexts/StatusMessageContext";

const RPSLSApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <WalletProvider>
      <StatusMessageProvider>
        <CardLayout>
          <Component {...pageProps} />
          <Analytics />
        </CardLayout>
      </StatusMessageProvider>
    </WalletProvider>
  );
};

export default RPSLSApp;
