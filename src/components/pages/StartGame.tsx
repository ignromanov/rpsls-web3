import { useCallback, useEffect, useState } from "react";
import useRPSContract from "../../hooks/useRPSContract";
import { Move, Player1SecretData } from "../../types";
import MoveSelector from "../elements/MoveSelector";
import ActionButton from "../elements/ActionButton";
import { ethers } from "ethers";
import { useWallet } from "@/contexts/WalletContext";
import { EthEncryptedData } from "@metamask/eth-sig-util";
import SaveSecretData from "./SaveSecretData";
import { useGameData } from "@/contexts/GameDataContext";

const StartGame: React.FC = () => {
  const [selectedMove, setSelectedMove] = useState<Move | null>(null);
  const [amount, setAmount] = useState("1");
  const [opponentAddress, setOpponentAddress] = useState(
    "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"
  );
  const [_secretToSave, setSecretToSave] = useState<
    Player1SecretData | EthEncryptedData | null
  >(null);
  const [contractAddress, setContractAddress] = useState("");

  const { player1Actions } = useRPSContract();
  const { provider, chainId } = useWallet();
  const { resetGameData, setGameData } = useGameData();

  useEffect(() => {
    resetGameData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          setContractAddress(contractAddress);
          setGameData((prevGameData) => ({
            ...prevGameData,
            chainId,
            contractAddress: contractAddress,
            isGame: true,
          }));
          setSecretToSave(_secretToSave);
        }
      }
    },
    [
      selectedMove,
      opponentAddress,
      amount,
      provider,
      player1Actions,
      setGameData,
      chainId,
    ]
  );

  if (_secretToSave) {
    return (
      <SaveSecretData
        _secretToSave={_secretToSave}
        contractAddress={contractAddress}
        chainId={chainId}
      />
    );
  }

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
          min={1}
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
