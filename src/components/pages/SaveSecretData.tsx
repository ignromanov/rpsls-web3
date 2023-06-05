import { EthEncryptedData } from "@metamask/eth-sig-util";
import { useRouter } from "next/router";
import ActionButton from "../elements/ActionButton";
import CopyInput from "../elements/CopyInput";
import { Player1SecretData } from "@/types";
import { getGameRoute } from "@/utils/routes";

interface SaveSecretDataProps {
  _secretToSave: Player1SecretData | EthEncryptedData | null;
  contractAddress: string;
  chainId: string;
}

const SaveSecretData: React.FC<SaveSecretDataProps> = ({
  _secretToSave,
  contractAddress,
  chainId,
}) => {
  const router = useRouter();

  if (!_secretToSave) return null;
  const unEncryptedSecret = "move" in _secretToSave;

  let secretDataAlert: React.ReactNode;
  if (unEncryptedSecret) {
    secretDataAlert = (
      <p className="text-sm my-4 bg-red-100 text-red-900 p-3 text-center shadow-xl">
        <span className="text-orange-600 font-bold text-lg">🔐 ATTENTION!</span>{" "}
        <br />
        Your secret game data is currently being encrypted.
        <br />
        However, until the process is completed, it is not stored anywhere!
        <br />
        It&apos;s crucial to save and securely store this information
        <br />
        until you need to reveal your move.
        <CopyInput
          value={JSON.stringify(_secretToSave)}
          className="mt-3"
          type={unEncryptedSecret ? "password" : "text"}
        />
      </p>
    );
  } else {
    secretDataAlert = (
      <p className="text-base my-2 text-violet-600 text-center">
        We&apos;ve encrypted and locally saved your move&apos;s secret data.
        <br />
        🛡️ Just in case, we recommend you to save it as well.
        <CopyInput
          value={JSON.stringify(_secretToSave)}
          className="my-4"
          type={unEncryptedSecret ? "password" : "text"}
        />
      </p>
    );
  }

  const handleContinue = () => {
    router.push(getGameRoute(chainId, contractAddress));
  };

  return (
    <>
      <h1>Save Your Secret Data</h1>
      {secretDataAlert}
      <ActionButton onClickHandler={handleContinue} isDisabled={false}>
        {unEncryptedSecret ? "I've saved the data" : "Continue"}
      </ActionButton>
    </>
  );
};

export default SaveSecretData;
