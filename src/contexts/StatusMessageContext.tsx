import { createContext, useState, useContext } from "react";

interface StatusMessageContextData {
  statusMessage: string;
  setStatusMessage: React.Dispatch<React.SetStateAction<string>>;
}

const StatusMessageContext = createContext<
  StatusMessageContextData | undefined
>(undefined);

interface StatusMessageProviderProps {
  children: React.ReactNode;
}

export const StatusMessageProvider: React.FC<StatusMessageProviderProps> = ({
  children,
}) => {
  const [statusMessage, setStatusMessage] = useState("");

  return (
    <StatusMessageContext.Provider value={{ statusMessage, setStatusMessage }}>
      {children}
    </StatusMessageContext.Provider>
  );
};

export const useStatusMessage = () => {
  const context = useContext(StatusMessageContext);
  if (context === undefined) {
    throw new Error(
      "useStatusMessage must be used within a StatusMessageProvider"
    );
  }
  return context;
};
