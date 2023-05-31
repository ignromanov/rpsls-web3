import { useStatusMessage } from "@/contexts/StatusMessageContext";

const StatusMessage: React.FC = () => {
  const { statusMessage } = useStatusMessage();

  if (!statusMessage) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 mx-8 mb-8 flex justify-center">
      <div className="p-2 rounded bg-violet-100 text-violet-900 overflow-auto whitespace-normal">
        {statusMessage}
      </div>
    </div>
  );
};

export default StatusMessage;
