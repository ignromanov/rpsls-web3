import { useCallback, useState } from "react";
import useRPSContract from "../../hooks/useRPSContract";
import { useRouter } from "next/router";
import { Move } from "../../types";
import MoveSelector from "../elements/MoveSelector";
import ActionButton from "../elements/ActionButton";
import StatusMessage from "../elements/StatusMessage";

const StartGame: React.FC = () => {
  const [statusMessage, setStatusMessage] = useState("");
  const [selectedMove, setSelectedMove] = useState<Move | null>(null);
  const [amount, setAmount] = useState("");
  const [opponentAddress, setOpponentAddress] = useState("");
  const { playerActions } = useRPSContract({ setStatusMessage });
  const router = useRouter();

  const handleMoveSelect = useCallback((move: Move) => {
    setSelectedMove(move);
  }, []);

  const handleStartGame = useCallback(async () => {
    if (selectedMove && opponentAddress && amount) {
      const contractAddress = await playerActions.startGame(
        selectedMove,
        amount,
        opponentAddress
      );
      if (contractAddress) {
        router.push(`/${contractAddress}`);
      }
    }
  }, [selectedMove, opponentAddress, amount, playerActions, router]);

  const isDisabled = !selectedMove || !opponentAddress || !amount;

  return (
    <>
      <h1 className="text-2xl font-semibold mt-6 text-violet-900">
        Let the game begin!
      </h1>
      <input
        type="text"
        value={opponentAddress}
        onChange={(e) => setOpponentAddress(e.target.value)}
        placeholder="Opponent's address"
        className="w-full p-2 mb-2 mt-2 rounded border border-violet-400"
      />
      <div className="relative mb-4 mt-2 flex items-stretch w-full">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Bet amount"
          className="relative flex-grow min-w-0 block p-2 rounded-l border border-solid border-violet-400"
        />
        <span className="flex items-center whitespace-nowrap rounded-r border border-l-0 border-solid border-violet-400 px-3 py-[0.25rem] text-center text-base font-normal leading-[1.6] ">
          Wei
        </span>
      </div>
      <MoveSelector
        selectedMove={selectedMove}
        onMoveSelect={handleMoveSelect}
      />
      <ActionButton isDisabled={isDisabled} onClickHandler={handleStartGame}>
        Start Game
      </ActionButton>
      <StatusMessage statusMessage={statusMessage} />
    </>
  );
};

export default StartGame;
