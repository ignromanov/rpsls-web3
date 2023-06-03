import React, { useEffect, useState } from "react";
import ActionButton from "../elements/ActionButton";
import { shortenAddress } from "@/utils/shorten";
import CopyInput from "../elements/CopyPageURL";

interface WaitingPlayerProps {
  opponentAddress: string | null;
  timeout: number;
  lastAction?: number;
  onTimeout: () => void;
}

const WaitingPlayer: React.FC<WaitingPlayerProps> = ({
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
      <h1>Duel in action!</h1>
      {isTimeoutButtonDisabled && (
        <>
          <p className="text-base mt-2 text-violet-600">
            Share the link below with another player:
          </p>
          <CopyInput value={window.location.href} />
        </>
      )}
      <p className="text-base my-2 text-violet-600 text-center">
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

export default WaitingPlayer;
