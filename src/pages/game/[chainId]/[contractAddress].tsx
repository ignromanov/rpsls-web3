import React, { useLayoutEffect } from "react";
import { useRouter } from "next/router";
import Game from "@/components/pages/Game";
import { useGameData } from "@/contexts/GameDataContext";

const GamePage: React.FC = () => {
  const { resetGameData } = useGameData();
  const {
    query: { chainId, contractAddress },
  } = useRouter();

  useLayoutEffect(() => {
    if (!chainId || !contractAddress) return;
    resetGameData({
      chainId: chainId as string,
      contractAddress: contractAddress as string,
    });
  }, [chainId, contractAddress, resetGameData]);

  return <Game />;
};

export default GamePage;
