import React from "react";
import { useRouter } from "next/router";
import Game from "@/components/modules/Game";

const GamePage: React.FC = () => {
  const {
    query: { chainId, contractAddress },
  } = useRouter();

  return (
    <Game
      chainId={chainId as string}
      contractAddress={contractAddress as string}
    />
  );
};

export default GamePage;
