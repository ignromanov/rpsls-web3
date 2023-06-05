import React from "react";

interface StartGameButtonProps {
  isDisabled: boolean;
  onClickHandler: (event: React.MouseEvent<HTMLButtonElement>) => void;
  children: React.ReactNode;
}

const ActionButton: React.FC<StartGameButtonProps> = ({
  isDisabled,
  onClickHandler,
  children,
}) => {
  return (
    <button
      type="button"
      className={`relative overflow-hidden  w-full mt-2 p-2 font-semibold rounded  ${
        isDisabled
          ? "text-gray-700 cursor-not-allowed bg-violet-300"
          : "text-white hover:bg-violet-600 bg-violet-700"
      }`}
      onClick={onClickHandler}
      disabled={isDisabled}
    >
      <span className="relative">{children}</span>
    </button>
  );
};

export default ActionButton;
