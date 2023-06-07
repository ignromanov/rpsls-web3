import { useRouter } from "next/router";
import React, { SVGAttributes, useCallback } from "react";
import ActionButton from "../elements/ActionButton";
import { useGameData } from "@/contexts/GameDataContext";
import Image from "next/image";
import { Move } from "@/types";
import { useWallet } from "@/contexts/WalletContext";
import {
  MinusIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  SpinnerIcon,
} from "../elements/Icons";
import { shortenAddress } from "@/utils/shorten";

type GetGameResultDataType = (
  j1: string,
  j2: string,
  c1: Move | null,
  c2: Move | null,
  winner: string | null | undefined,
  address: string
) => {
  h1: string;
  text: string | React.ReactNode;
  firstMove: Move | null;
  secondMove: Move | null;
  ArrowComponent:
    | ((props: React.SVGAttributes<SVGElement>) => React.JSX.Element)
    | null;
};

const getGameResultData: GetGameResultDataType = (
  j1,
  j2,
  c1,
  c2,
  winner,
  address
) => {
  const isAddressJ1 = address.toLowerCase() === j1.toLowerCase();
  const isAddressJ2 = address.toLowerCase() === j2.toLowerCase();

  if (winner === null) {
    return {
      h1: "Game ended",
      text: "The game has ended with no clear winner",
      firstMove: null,
      secondMove: null,
      ArrowComponent: null,
    };
  } else if (winner === undefined) {
    return {
      h1: "Draw game",
      text: "The game has ended in a draw",
      firstMove: isAddressJ1 ? c1 : isAddressJ2 ? c2 : c1,
      secondMove: isAddressJ1 ? c2 : isAddressJ2 ? c1 : c2,
      ArrowComponent: MinusIcon,
    };
  } else if (winner.toLowerCase() === j1.toLowerCase()) {
    return {
      h1: isAddressJ1
        ? "You Win!"
        : isAddressJ2
        ? "Opponent Wins"
        : `Player ${shortenAddress(j1)} Wins`,
      text: isAddressJ1 ? (
        <>
          🎉 Congratulations! <br />
          You&apos;ve won the game
        </>
      ) : isAddressJ2 ? (
        "Your opponent has won the game"
      ) : (
        `Player ${shortenAddress(j1)} has won the game`
      ),
      firstMove: isAddressJ1 ? c1 : isAddressJ2 ? c2 : c1,
      secondMove: isAddressJ1 ? c2 : isAddressJ2 ? c1 : c2,
      ArrowComponent: isAddressJ1
        ? ArrowLeftIcon
        : isAddressJ2
        ? ArrowRightIcon
        : ArrowLeftIcon,
    };
  } else if (winner.toLowerCase() === j2.toLowerCase()) {
    return {
      h1: isAddressJ1
        ? "Opponent Wins"
        : isAddressJ2
        ? "You Win!"
        : `Player ${shortenAddress(j2)} Wins`,
      text: isAddressJ1 ? (
        "Your opponent has won the game"
      ) : isAddressJ2 ? (
        <>
          🎉 Congratulations! <br />
          You&apos;ve won the game
        </>
      ) : (
        `Player ${shortenAddress(j2)} has won the game`
      ),
      firstMove: isAddressJ1 ? c1 : isAddressJ2 ? c2 : c1,
      secondMove: isAddressJ1 ? c2 : isAddressJ2 ? c1 : c2,
      ArrowComponent: isAddressJ1
        ? ArrowRightIcon
        : isAddressJ2
        ? ArrowLeftIcon
        : ArrowRightIcon,
    };
  } else {
    return {
      h1: "Game ended",
      text: "The game has ended with no clear winner",
      firstMove: null,
      secondMove: null,
      ArrowComponent: null,
    };
  }
};

const GameEnded: React.FC = () => {
  const router = useRouter();
  const { address } = useWallet();
  const {
    gameData: { j1, j2, c1, c2, winner },
  } = useGameData();

  const clickHandler = useCallback(() => {
    router.push("/");
  }, [router]);

  if (!j1 || !j2 || !address) return <SpinnerIcon />;
  const isAddressJ1 = address.toLowerCase() === j1.toLowerCase();
  const isAddressJ2 = address.toLowerCase() === j2.toLowerCase();

  const { h1, text, firstMove, secondMove, ArrowComponent } = getGameResultData(
    j1,
    j2,
    c1,
    c2,
    winner,
    address
  );

  return (
    <>
      <h1>{h1}</h1>
      <p className="text-base mb-3 text-violet-500 text-center">{text}</p>
      {winner !== null && firstMove && secondMove && (
        <>
          <div className="flex items-center justify-between w-full">
            <div className="text-center w-full">
              <Image
                src={`/images/${Move[firstMove].toString().toLowerCase()}.jpg`}
                title={Move[firstMove].toString()}
                alt={Move[firstMove].toString()}
                placeholder={"empty"}
                className={`w-12 h-12 sm:w-20 sm:h-20 border rounded-md border-transparent`}
                width={80}
                height={80}
              />
            </div>
            <div className="text-center">
              {ArrowComponent && (
                <ArrowComponent className="mx-4 w-10 h-10 fill-violet-800 text-violet-800" />
              )}
            </div>
            <div className="text-center w-full">
              <Image
                src={`/images/${Move[secondMove].toString().toLowerCase()}.jpg`}
                title={Move[secondMove].toString()}
                alt={Move[secondMove].toString()}
                placeholder={"empty"}
                className={`w-12 h-12 sm:w-20 sm:h-20 border rounded-md border-transparent ml-auto`}
                width={80}
                height={80}
              />
            </div>
          </div>
          <div className="w-full flex items-center justify-between mb-2 px-1">
            <p className="text-xs mt-1 text-violet-500">
              {isAddressJ1 || isAddressJ2 ? "You" : shortenAddress(j1)}
            </p>
            <p className="text-xs mt-1 text-violet-500">
              {isAddressJ1 || isAddressJ2 ? "Opponent" : shortenAddress(j2)}
            </p>
          </div>
        </>
      )}
      <ActionButton isDisabled={false} onClickHandler={clickHandler}>
        Start New Game
      </ActionButton>
    </>
  );
};

export default GameEnded;
