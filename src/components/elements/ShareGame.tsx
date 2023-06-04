import React from "react";
import CopyInput from "./CopyInput";
import { useGameData } from "@/contexts/GameDataContext";
import { getGameRoute } from "@/utils/routes";

const ShareGame: React.FC = React.memo(() => {
  const {
    gameData: { contractAddress, chainId },
  } = useGameData();

  if (!contractAddress || !chainId) return null;

  const value = window.location.origin + getGameRoute(chainId, contractAddress);

  return (
    <>
      <p className="text-base mt-6 text-violet-600">Share the game:</p>
      <CopyInput value={value} className="mt-1" />
    </>
  );
});
ShareGame.displayName = "ShareGame";

export default ShareGame;
