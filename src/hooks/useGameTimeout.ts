import { useGameData } from "@/contexts/GameDataContext";
import { useState, useLayoutEffect } from "react";

const useGameTimeout = () => {
  const {
    gameData: { lastAction, timeout, winner },
  } = useGameData();

  const [remainingSeconds, setRemainingSeconds] = useState<number>(0);
  const [isTimeout, setIsTimeout] = useState(false);

  useLayoutEffect(() => {
    const updateRemainingTime = () => {
      if (lastAction === 0 || winner !== null) {
        setRemainingSeconds(0);
        setIsTimeout(false);
        return;
      }

      const currentTime = Math.floor(Date.now() / 1000);
      const elapsedTime = currentTime - lastAction;
      const remaining = timeout - elapsedTime;
      setRemainingSeconds(remaining < 0 ? 0 : remaining);

      if (remaining < 0) {
        setIsTimeout(true);
      } else {
        setIsTimeout(false);
      }
    };

    updateRemainingTime();
    const timerId = setInterval(updateRemainingTime, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, [lastAction, timeout, winner]);

  return { isTimeout, remainingSeconds };
};

export default useGameTimeout;
