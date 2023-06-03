import { useCallback, useState } from "react";
import useRPSContract from "../../hooks/useRPSContract";
import { useRouter } from "next/router";
import { Move } from "../../types";
import MoveSelector from "../elements/MoveSelector";
import ActionButton from "../elements/ActionButton";
import { ethers } from "ethers";
import useWallet from "@/hooks/useWallet";

const StartGame: React.FC = () => {
  const [selectedMove, setSelectedMove] = useState<Move | null>(null);
  const [amount, setAmount] = useState("");
  const [opponentAddress, setOpponentAddress] = useState("");

  const { player1Actions } = useRPSContract({});
  const { provider, chainId } = useWallet();
  const router = useRouter();

  const handleMoveSelect = useCallback((move: Move) => {
    setSelectedMove(move);
  }, []);

  const handleAddressChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setOpponentAddress(e.target.value);
    },
    []
  );

  const handleAmountChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setAmount((prevAmount) => {
        if (e.target.value === "") return "";

        const newAmount = parseInt(e.target.value);
        return isNaN(newAmount) ? prevAmount : newAmount.toFixed(0);
      });
    },
    []
  );

  const handleStartGame = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      if (selectedMove && opponentAddress && amount && provider) {
        const { contractAddress, _secretToSave } =
          await player1Actions.startGame(selectedMove, amount, opponentAddress);
        if (contractAddress) {
          router.push(`/game/${chainId}/${contractAddress}`);
        }
      }
    },
    [
      selectedMove,
      opponentAddress,
      amount,
      provider,
      player1Actions,
      router,
      chainId,
    ]
  );

  const isDisabled =
    !selectedMove ||
    !opponentAddress ||
    !amount ||
    !ethers.utils.isAddress(opponentAddress);

  return (
    <form className="flex flex-col items-center justify-center">
      <h1>Let the game begin!</h1>
      <input
        type="text"
        value={opponentAddress}
        onChange={handleAddressChange}
        placeholder="Opponent's address"
        className={`w-full p-2 my-2 rounded ${
          ethers.utils.isAddress(opponentAddress) || opponentAddress === ""
            ? "border-violet-400"
            : "border-red-600"
        }`}
      />
      <div className="relative my-2 flex items-stretch w-full">
        <input
          type="number"
          step={1}
          min={0}
          value={amount}
          onChange={handleAmountChange}
          placeholder="Bet amount"
          className="relative flex-grow min-w-0 block p-2 rounded-l border-violet-400"
        />
        <span className="flex items-center whitespace-nowrap rounded-r border border-l-0 border-solid border-violet-400 px-3 py-[0.25rem] text-center text-base font-normal leading-[1.6] ">
          wei
        </span>
      </div>
      <MoveSelector
        selectedMove={selectedMove}
        onMoveSelect={handleMoveSelect}
      />
      <ActionButton isDisabled={isDisabled} onClickHandler={handleStartGame}>
        Start Game
      </ActionButton>
    </form>
  );
};

export default StartGame;
