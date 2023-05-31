import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useStatusMessage } from "@/contexts/StatusMessageContext";

const CopyPageURL: React.FC = () => {
  const router = useRouter();
  const { setStatusMessage } = useStatusMessage();

  const [currentURL, setCurrentURL] = useState("");

  useEffect(() => {
    setCurrentURL(window.location.href);
  }, [router.asPath]);

  const handleCopyClick = useCallback(() => {
    navigator.clipboard.writeText(currentURL);
    setStatusMessage("Link copied to clipboard!");
  }, [currentURL, setStatusMessage]);

  return (
    <div className="relative mb-2 mt-2 flex items-stretch w-full">
      <input
        type="text"
        className="relative flex-grow min-w-0 block p-2 rounded-l border-violet-400"
        value={currentURL}
        readOnly={true}
        aria-label="Current page URL"
        aria-describedby="button-addon2"
      />
      <button
        type="button"
        className="z-[2] inline-block rounded-r bg-primary px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal bg-violet-700 text-white hover:bg-violet-600"
        onClick={handleCopyClick}
        id="button-addon2"
      >
        Copy
      </button>
    </div>
  );
};

export default CopyPageURL;
