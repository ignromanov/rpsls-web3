import React from "react";
import { useRouter } from "next/router";
import Game from "@/components/modules/Game";

const GamePage: React.FC = () => {
  const router = useRouter();
  const contractAddress = router.query.contractAddress as string;

  return <Game contractAddress={contractAddress} />;
};

export default GamePage;
