import { shortenAddress } from "@/utils/shorten";
import ActionButton from "../elements/ActionButton";
import { useState, useCallback } from "react";

interface TimeoutProps {
  opponentAddress: string | null;
  onTimeout: () => Promise<void>;
}

const Timeout: React.FC<TimeoutProps> = ({ opponentAddress, onTimeout }) => {
  const [isInterfaceDisabled, setIsInterfaceDisabled] = useState(false);

  const onTimeoutHandler = useCallback(async () => {
    setIsInterfaceDisabled(true);
    await onTimeout();
    setIsInterfaceDisabled(false);
  }, [onTimeout]);

  return (
    <>
      <h1>Duel in action!</h1>
      <p className="text-base my-2 text-violet-600 text-center">
        The time has expired for{" "}
        <span className="font-semibold">{shortenAddress(opponentAddress)}</span>
        !
        <br />
        Go ahead and win the game!
      </p>
      <ActionButton
        isDisabled={isInterfaceDisabled}
        onClickHandler={onTimeoutHandler}
      >
        Win the Game!
      </ActionButton>
    </>
  );
};

export default Timeout;
