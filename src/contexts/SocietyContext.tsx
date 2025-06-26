import React, { createContext, useState, useEffect, useContext } from 'react';
import { Society } from '../types/society';
import { useSocietiesQuery } from '../hooks/queries/useSocietyQueries';

interface SocietyContextType {
  selectedSocietyId: string;
  setSelectedSocietyId: (id: string) => void;
  societies: Society[];
  isLoading: boolean;
  error: Error | null;
  selectedSociety: Society | null;
}

const SocietyContext = createContext<SocietyContextType>({
  selectedSocietyId: '',
  setSelectedSocietyId: () => {},
  societies: [],
  isLoading: false,
  error: null,
  selectedSociety: null,
});

export const SocietyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedSocietyId, setSelectedSocietyId] = useState<string>('');
  
  // Fetch societies
  const { 
    data: societies = [], 
    isLoading, 
    error 
  } = useSocietiesQuery();

  // Find the selected society object
  const selectedSociety = societies.find(society => society.society_id === selectedSocietyId) || null;

  // Load selected society from localStorage on mount
  useEffect(() => {
    const savedSocietyId = localStorage.getItem('selectedSocietyId');
    if (savedSocietyId) {
      setSelectedSocietyId(savedSocietyId);
    }
  }, []);

  // Save selected society to localStorage when it changes
  useEffect(() => {
    if (selectedSocietyId) {
      localStorage.setItem('selectedSocietyId', selectedSocietyId);
    }
  }, [selectedSocietyId]);

  return (
    <SocietyContext.Provider
      value={{
        selectedSocietyId,
        setSelectedSocietyId,
        societies,
        isLoading,
        error: error as Error | null,
        selectedSociety,
      }}
    >
      {children}
    </SocietyContext.Provider>
  );
};

export const useSociety = () => useContext(SocietyContext);

export default SocietyContext;