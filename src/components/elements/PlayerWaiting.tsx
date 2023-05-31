import React, { useEffect, useState } from "react";
import ActionButton from "./ActionButton";
import { shortenAddress } from "@/utils/shorten";
import CopyPageURL from "./CopyPageURL";

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
      {isTimeoutButtonDisabled && (
        <>
          <p className="text-base mt-4 text-violet-600">
            Share the link below with another player:
          </p>
          <CopyPageURL />
        </>
      )}
      <p className="text-base mt-4 text-violet-600 text-center">
        {isTimeoutButtonDisabled ? (
          <>
            Hang tight!
            <br />
            The player{" "}
            <span className="font-semibold">
              {shortenAddress(opponentAddress)}
            </span>{" "}
            still has <br />
            {remainingTime}s to make their move.
          </>
        ) : (
          <>
            The time has expired for{" "}
            <span className="font-semibold">
              {shortenAddress(opponentAddress)}
            </span>
            !
            <br />
            Go ahead and win the game!
          </>
        )}
      </p>{" "}
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
