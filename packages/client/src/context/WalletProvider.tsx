import { useWallet, UseWalletReturns } from "hooks/useWallet";
import { createContext, FC, useContext } from "react";

type WalletContextType = UseWalletReturns;

export const WalletContext = createContext<WalletContextType>({
  isConnected: false,
  requestToConnect: () => {
    throw new Error("requestToConnect function is not initialized");
  },
});

export const useWalletContext = () => useContext(WalletContext);

export const WalletContextProvider: FC = ({ children }) => {
  const wallet = useWallet();

  return (
    <WalletContext.Provider value={wallet}>{children}</WalletContext.Provider>
  );
};
