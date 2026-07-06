import { createContext, useContext, useState, ReactNode } from 'react';
import { Contract } from '../types';

interface AppContextType {
  selectedContract: Contract | null;
  setSelectedContract: (c: Contract | null) => void;
}

const AppContext = createContext<AppContextType>(null!);

export function AppProvider({ children }: { children: ReactNode }) {
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  return (
    <AppContext.Provider value={{ selectedContract, setSelectedContract }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be inside AppProvider');
  return ctx;
}
