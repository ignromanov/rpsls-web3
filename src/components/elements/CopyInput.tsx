import React, { useCallback } from "react";
import { useStatusMessage } from "@/contexts/StatusMessageContext";

interface CopyInputProps {
  value: string;
  type?: string;
  className?: string;
}

const CopyInput: React.FC<CopyInputProps> = ({
  value,
  type = "text",
  className = "",
}) => {
  const { setStatusMessage } = useStatusMessage();

  const handleCopyClick = useCallback(() => {
    navigator.clipboard.writeText(value);
    setStatusMessage("Copied to clipboard!");
  }, [value, setStatusMessage]);

  return (
    <div className={`relative flex items-stretch w-full ${className}`}>
      <input
        type={type}
        className="relative flex-grow min-w-0 block p-2 rounded-l border-violet-400 text-xs"
        value={value}
        readOnly={true}
        aria-label="Current page URL"
        aria-describedby="button-addon2"
      />
      <button
        type="button"
        className="z-[2] inline-block rounded-r bg-primary px-3 py-2 text-xs font-medium uppercase leading-tight bg-violet-700 text-white hover:bg-violet-600"
        onClick={handleCopyClick}
        id="button-addon2"
      >
        Copy
      </button>
    </div>
  );
};

export default CopyInput;
