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

  let message: React.ReactNode;
  if (unEncryptedSecret) {
    message = (
      <p className="text-sm mt-2 bg-red-100 text-red-900 p-3 text-center">
        <span className="text-orange-600 font-bold text-lg">💡 Crucial!</span>{" "}
        <br />
        The secret data for your move is neither encrypted nor stored anywhere!
        <br />
        To avoid losing your funds, make sure to save this information
        immediately
        <br />
        and keep it safe until you need to reveal your move.
      </p>
    );
  } else {
    message = (
      <p className="text-base mt-2 text-violet-600 text-center">
        We&apos;ve encrypted and locally saved your move&apos;s secret data.
        <br />
        🛡️ Just in case, we recommend you to save it as well.
      </p>
    );
  }

  const handleContinue = () => {
    router.push(getGameRoute(chainId, contractAddress));
  };

  return (
    <>
      <h1>Save Your Secret Data</h1>
      {message}
      <CopyInput
        value={JSON.stringify(_secretToSave)}
        className="my-3"
        type={unEncryptedSecret ? "password" : "text"}
      />
      <ActionButton onClickHandler={handleContinue} isDisabled={false}>
        {unEncryptedSecret ? "I've saved the data" : "Continue"}
      </ActionButton>
    </>
  );
};

export default SaveSecretData;
