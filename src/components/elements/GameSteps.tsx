import React from "react";
import { HandRaisedIcon, EyeIcon } from "./Icons";
import { useGameData } from "@/contexts/GameDataContext";
import { useWallet } from "@/contexts/WalletContext";
import useGameTimeout from "@/hooks/useGameTimeout";

interface StepProps {
  title: string;
  isFilled: boolean;
  IconComponent: React.ElementType;
}

const Step: React.FC<StepProps> = React.memo(
  ({ IconComponent, isFilled, title }) => {
    return (
      <li className="flex items-center relative" title={title}>
        <span
          className={`flex items-center justify-center w-10 h-10 ${
            isFilled ? "bg-violet-500" : "bg-violet-300"
          } rounded-full shrink-0`}
        >
          <IconComponent
            className={`w-5 h-5 ${isFilled ? "text-white" : "text-gray-700"}`}
          />
        </span>
      </li>
    );
  }
);
Step.displayName = "Step";

interface ProgressProps {
  percentRemain: number;
}

const Progress: React.FC<ProgressProps> = React.memo(({ percentRemain }) => {
  return (
    <li className="flex items-center relative h-1 w-full">
      <div
        className={
          "absolute inline-block h-1 w-full left-0 top-auto bottom-auto bg-violet-300"
        }
      />
      <div
        className="absolute inline-block h-1 left-0 top-auto bottom-auto bg-violet-500"
        style={{ width: `${100 - percentRemain}%` }}
      />
    </li>
  );
});
Progress.displayName = "Progress";

enum GameStep {
  Player1Move = 0,
  Player2Move,
  Player1Reveal,
  Timeout,
  Finished,
}

const GameSteps: React.FC = () => {
  const { gameData } = useGameData();
  const { address } = useWallet();

  const { isGame, stake, c1Hash, c2, timeout } = gameData;
  const { isTimeout, remainingSeconds } = useGameTimeout();

  let currentStep = GameStep.Player1Move;
  if (address !== null && !!isGame && c1Hash !== null) {
    if (stake === "0") {
      currentStep = GameStep.Finished;
    } else if (isTimeout) {
      currentStep = GameStep.Timeout;
    } else if (c2 !== 0) {
      currentStep = GameStep.Player1Reveal;
    } else if (c2 === 0) {
      currentStep = GameStep.Player2Move;
    }
  }
  const percentRemain =
    remainingSeconds > 0
      ? Math.floor((100 * remainingSeconds) / timeout) ?? 0
      : 0;

  return (
    <ol className="flex items-center w-full mt-4 justify-between">
      <Step
        key={GameStep.Player1Move}
        isFilled={currentStep > GameStep.Player1Move}
        title={"Player 1's Move"}
        IconComponent={HandRaisedIcon}
      />
      <Progress
        percentRemain={
          currentStep === GameStep.Player2Move
            ? percentRemain
            : currentStep > GameStep.Player2Move
            ? 0
            : 100
        }
      />
      <Step
        key={GameStep.Player2Move}
        isFilled={currentStep > GameStep.Player2Move}
        title={"Player 2's Move"}
        IconComponent={HandRaisedIcon}
      />
      <Progress
        percentRemain={
          currentStep === GameStep.Player1Reveal
            ? percentRemain
            : currentStep > GameStep.Player1Reveal
            ? 0
            : 100
        }
      />
      <Step
        key={GameStep.Player1Reveal}
        isFilled={currentStep >= GameStep.Finished}
        title={"Reveal Player 1's Move"}
        IconComponent={EyeIcon}
      />
    </ol>
  );
};

export default GameSteps;
