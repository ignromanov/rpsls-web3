import React from "react";
import { shortenAddress } from "@/utils/shorten";

interface WaitingPlayerProps {
  opponentAddress: string | null;
  remainingSeconds: number;
}

const WaitingPlayer: React.FC<WaitingPlayerProps> = ({
  opponentAddress,
  remainingSeconds,
}) => {
  return (
    <>
      <h1>Duel in action!</h1>
      <p className="text-base my-2 text-violet-600 text-center">
        Hang tight!
        <br />
        The player{" "}
        <span className="font-semibold">
          {shortenAddress(opponentAddress)}
        </span>{" "}
        still has <br />
        {remainingSeconds}s to make their move.
      </p>
    </>
  );
};

export default WaitingPlayer;
