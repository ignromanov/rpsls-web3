import React from "react";

interface StartGameButtonProps {
  isDisabled: boolean;
  onClickHandler: () => void;
  children: React.ReactNode;
}

const ActionButton: React.FC<StartGameButtonProps> = ({
  isDisabled,
  onClickHandler,
  children,
}) => {
  return (
    <button
      className={`w-full mt-2 p-2 font-semibold rounded ${
        isDisabled
          ? "bg-violet-300 text-gray-700 cursor-not-allowed"
          : "bg-violet-700 text-white hover:bg-violet-600"
      }`}
      onClick={onClickHandler}
      disabled={isDisabled}
    >
      {children}
    </button>
  );
};

export default ActionButton;
