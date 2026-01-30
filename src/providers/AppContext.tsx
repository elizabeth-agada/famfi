"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { WalletState } from '../types';
import { toast } from "../components/ui/use-toast";

interface WalletContextType extends WalletState {
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  isLoading: boolean;
  activeFamilyIndex: number;
  setIsLoading: React.Dispatch<React.SetStateAction<any>>;
  setActiveFamilyIndex: React.Dispatch<React.SetStateAction<any>>;
}

const AppContext = createContext<WalletContextType | undefined>(undefined);

export function useWallet() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}

interface WalletProviderProps {
  children: ReactNode;
}

const AppProvider = ({ children }: WalletProviderProps) => {
  const [walletState, setWalletState] = useState<WalletState>({
    address: null,
    isConnected: false,
    isConnecting: false,
    error: null,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeFamilyIndex, setActiveFamilyIndex] = useState<number>(0);
  const [stacksConnect, setStacksConnect] = useState<any>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Dynamically import @stacks/connect only on client-side
    import("@stacks/connect").then((module) => {
      setStacksConnect(module);
    }).catch(err => {
      console.error("Failed to load @stacks/connect:", err);
    });
  }, []);

  const connectWallet = async () => {
    if (!stacksConnect) {
      toast({
        variant: "error",
        description: "Wallet library is still loading or not installed.",
      });
      return;
    }

    setWalletState(prev => ({ ...prev, isConnecting: true, error: null }));

    try {
      // Request account access
      const response = await stacksConnect.connect();
      const address = response?.addresses?.[2].address;
      
      setWalletState({
        address,
        isConnected: true,
        isConnecting: false,
        error: null,
      });
      console.log("Wallet connected successfully", address);
    } catch (error: any) {
      toast({
        variant: "error",
        description: `Failed to connect wallet: ${error instanceof Error ? error.message : String(error)}`
      });
      
      console.error('Failed to connect wallet:', error);
      setWalletState(prev => ({
        ...prev,
        isConnecting: false,
        error: error.message || 'Failed to connect wallet',
      }));
    }
  };

  const disconnectWallet = () => {
    if (!stacksConnect) return;

    stacksConnect.disconnect();
    setWalletState({
      address: null,
      isConnected: false,
      isConnecting: false,
      error: null,
    });
    console.log("User disconnected successfully");
  };
  
  // Check if already connected on mount
  useEffect(() => {
    const checkConnection = async () => {
      if (typeof window === "undefined" || !stacksConnect) return false; // SSR guard

      try {
        const userData = stacksConnect.getLocalStorage();

        if (userData?.addresses) {
          setWalletState({
            address: userData.addresses.stx[0].address,
            isConnected: true,
            isConnecting: false,
            error: null,
          });
        }
      } catch (error) {
        console.error('Error checking wallet connection:', error);
      }
    };

    checkConnection();
  }, [stacksConnect]);

  const value: WalletContextType = {
    isLoading,
    activeFamilyIndex,
    setActiveFamilyIndex,
    setIsLoading,
    ...walletState,
    connectWallet,
    disconnectWallet,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export { AppContext, AppProvider };