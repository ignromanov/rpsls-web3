import { RPSVersion } from "@/types";
import React from "react";

interface ContractTogglerProps {
  contractVersion: RPSVersion;
  setContractVersion: React.Dispatch<React.SetStateAction<RPSVersion>>;
}

const ContractToggler: React.FC<ContractTogglerProps> = ({
  setContractVersion,
}) => {
  return (
    <>
      <p className="text-base mt-3 text-violet-600 text-center">
        Select the contract version you want to use:
      </p>
      <label className="relative mb-3 mt-1 inline-flex items-center cursor-pointer">
        <span
          className="mr-3 w-10 text-base text-right font-medium text-violet-800"
          title="Basic RPS contract"
        >
          RPS
        </span>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            value=""
            className="sr-only peer"
            onChange={(e) =>
              setContractVersion(
                e.target.checked ? RPSVersion.RPSV2 : RPSVersion.RPS
              )
            }
          />
          <div className="w-11 h-6 bg-violet-400 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-violet-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-violet-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all  peer-checked:bg-violet-600"></div>
        </label>
        <span
          className="ml-3 w-10 text-base font-medium text-violet-800"
          title="RPS contract V2 (with events)"
        >
          RPSV2
        </span>
      </label>
    </>
  );
};

export default ContractToggler;
