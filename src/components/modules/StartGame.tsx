import { useCallback, useState } from "react";
import { useRPSContract } from "../../hooks/useRPSContract";
import { useRouter } from "next/router";
import { Move } from "../../types";
import MoveSelector from "../elements/MoveSelector";
import ActionButton from "../elements/ActionButton";
import StatusMessage from "../elements/StatusMessage";

const StartGame: React.FC = () => {
  const [statusMessage, setStatusMessage] = useState("");
  const [selectedMove, setSelectedMove] = useState<Move | null>(null);
  const [opponentAddress, setOpponentAddress] = useState("");
  const { startGame } = useRPSContract({ setStatusMessage });
  const router = useRouter();

  const handleMoveSelect = useCallback((move: Move) => {
    setSelectedMove(move);
  }, []);

  const handleStartGame = useCallback(async () => {
    if (selectedMove && opponentAddress) {
      const contractAddress = await startGame(selectedMove, opponentAddress);
      if (contractAddress) {
        router.push(`/game/${contractAddress}`);
      }
    }
  }, [opponentAddress, router, selectedMove, startGame]);

  const isDisabled = !selectedMove || !opponentAddress;

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
        className="w-full p-2 mb-2 mt-1 rounded border border-violet-400"
      />
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
