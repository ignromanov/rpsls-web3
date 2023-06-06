import { useStatusMessage } from "@/contexts/StatusMessageContext";

const StatusMessage: React.FC = () => {
  const { statusMessage } = useStatusMessage();

  if (!statusMessage) return null;

  return (
    <div className="fixed bottom-0 left-auto right-auto mx-8 mb-8 flex justify-center z-20 shadow-md">
      <div className="p-2 max-w-[100vw] rounded bg-violet-100 text-violet-900 overflow-auto whitespace-normal">
        {statusMessage}
      </div>
    </div>
  );
};

export default StatusMessage;
