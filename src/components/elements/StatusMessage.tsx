import { useStatusMessage } from "@/contexts/StatusMessageContext";

const StatusMessage: React.FC = () => {
  const { statusMessage } = useStatusMessage();

  if (!statusMessage) return null;

  return (
    <div className="mt-4 text-violet-900 bg-violet-100 rounded p-2">
      {statusMessage}
    </div>
  );
};

export default StatusMessage;
