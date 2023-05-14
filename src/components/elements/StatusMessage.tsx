interface StatusMessageProps {
  statusMessage: string | null;
}

const StatusMessage: React.FC<StatusMessageProps> = ({ statusMessage }) => {
  if (!statusMessage) return null;

  return <div className="mt-4 text-violet-900">{statusMessage}</div>;
};

export default StatusMessage;
