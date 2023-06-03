// import { useGameDataContext } from "./GameDataContext";
import React from "react";
import { HandRaisedIcon, ClockIcon, EyeIcon } from "./Icons";
import { useGameData } from "@/contexts/GameDataContext";
import { useWallet } from "@/contexts/WalletContext";

const GameSteps: React.FC = () => {
  const { gameData } = useGameData();
  const { address } = useWallet();

  const { isGame, stake, c1Hash, c2 } = gameData;
  const isStep1 = !!isGame && address !== null;
  const isStep2 = isStep1 && c1Hash !== null && c2 !== 0;
  const isStep3 = isStep2 && stake === "0";

  const stepStyles = (isFilled: boolean, isLast: boolean) => ({
    baseStyle: `flex items-center ${isLast ? "w-auto" : "w-full"}`,
    filledStyle: `text-white ${
      !isLast
        ? "after:content-[''] after:w-full after:h-1 after:border-b after:border-violet-500 after:border-4 after:inline-block"
        : ""
    }`,
    unfilledStyle: `text-gray-700 ${
      !isLast
        ? "after:content-[''] after:w-full after:h-1 after:border-b after:border-violet-300 after:border-4 after:inline-block"
        : ""
    }`,
    iconStyle: `flex items-center justify-center w-10 h-10 ${
      isFilled ? "bg-violet-500" : "bg-violet-300"
    } rounded-full lg:h-12 lg:w-12 dark:bg-gray-700 shrink-0`,
    svgStyle: `w-5 h-5 ${
      isFilled ? "text-white" : "text-gray-700"
    } lg:w-6 lg:h-6`,
  });

  const Step = ({
    isFilled,
    stepName,
    SvgIcon,
    isLast = false,
  }: {
    isFilled: boolean;
    stepName: string;
    SvgIcon: React.ElementType;
    isLast?: boolean;
  }) => {
    const styles = stepStyles(isFilled, isLast);

    return (
      <li
        title={stepName}
        className={`${styles.baseStyle} ${
          isFilled ? styles.filledStyle : styles.unfilledStyle
        }`}
      >
        <span className={styles.iconStyle}>
          <SvgIcon className={styles.svgStyle} />
        </span>
      </li>
    );
  };

  return (
    <ol className="flex items-center w-full mt-4 justify-between stepper">
      <Step
        isFilled={isStep1}
        stepName={"Player 1's Move"}
        SvgIcon={HandRaisedIcon}
      />
      <Step
        isFilled={isStep2}
        stepName={"Player 2's Move"}
        SvgIcon={HandRaisedIcon}
      />
      <Step
        isFilled={isStep3}
        stepName={"Reveal Player 1's Move"}
        SvgIcon={EyeIcon}
        isLast
      />
    </ol>
  );
};

export default GameSteps;
