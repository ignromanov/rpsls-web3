import React, { useEffect, useState } from "react";
import ActionButton from "./ActionButton";
import { shortenAddress } from "@/utils/shortern";

interface PlayerWaitingProps {
  opponentAddress: string | null;
  timeout: number;
  lastAction?: number;
  onTimeout: () => void;
}

const PlayerWaiting: React.FC<PlayerWaitingProps> = ({
  opponentAddress,
  timeout,
  lastAction = 0,
  onTimeout,
}) => {
  const [remainingTime, setRemainingTime] = useState<number>(0);
  const [isTimeoutButtonDisabled, setIsTimeoutButtonDisabled] = useState(true);

  useEffect(() => {
    const updateRemainingTime = () => {
      const currentTime = Math.floor(Date.now() / 1000);
      const elapsedTime = currentTime - lastAction;
      const remaining = timeout - elapsedTime;
      setRemainingTime(remaining);

      if (remaining <= 0) {
        setIsTimeoutButtonDisabled(false);
        return;
      }
    };

    updateRemainingTime();
    const timerId = setInterval(updateRemainingTime, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, [lastAction, timeout]);

  useEffect(() => {
    setIsTimeoutButtonDisabled(remainingTime > 0);
  }, [remainingTime]);

  return (
    <>
      <h1 className="text-2xl font-semibold mt-6 text-violet-900">
        Duel in action!
      </h1>
      <p className="text-base mt-4 text-violet-600">
        Waiting for{" "}
        <span className="font-semibold">{shortenAddress(opponentAddress)}</span>{" "}
        to move...
      </p>
      <ActionButton
        isDisabled={isTimeoutButtonDisabled}
        onClickHandler={onTimeout}
      >
        {isTimeoutButtonDisabled
          ? `Time remaining: ${remainingTime}s`
          : "Win the Game!"}
      </ActionButton>
    </>
  );
};

export default PlayerWaiting;
