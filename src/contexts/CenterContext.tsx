import React, { createContext, useState, useEffect, useContext } from 'react';
import { Center } from '../types/center';
import { useCentersQuery } from '../hooks/queries/useCenterQueries';

interface CenterContextType {
  selectedCenterId: string;
  setSelectedCenterId: (id: string) => void;
  centers: Center[];
  isLoading: boolean;
  error: Error | null;
  selectedCenter: Center | null;
}

const CenterContext = createContext<CenterContextType>({
  selectedCenterId: '',
  setSelectedCenterId: () => {},
  centers: [],
  isLoading: false,
  error: null,
  selectedCenter: null,
});

export const CenterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedCenterId, setSelectedCenterId] = useState<string>('');
  
  // Fetch centers
  const { 
    data: centers = [], 
    isLoading, 
    error 
  } = useCentersQuery();

  // Find the selected center object
  const selectedCenter = centers.find(center => center.center_id === selectedCenterId) || null;

  // Load selected center from localStorage on mount
  useEffect(() => {
    const savedCenterId = localStorage.getItem('selectedCenterId');
    if (savedCenterId) {
      setSelectedCenterId(savedCenterId);
    }
  }, []);

  // Save selected center to localStorage when it changes
  useEffect(() => {
    if (selectedCenterId) {
      localStorage.setItem('selectedCenterId', selectedCenterId);
    }
  }, [selectedCenterId]);

  return (
    <CenterContext.Provider
      value={{
        selectedCenterId,
        setSelectedCenterId,
        centers,
        isLoading,
        error: error as Error | null,
        selectedCenter,
      }}
    >
      {children}
    </CenterContext.Provider>
  );
};

export const useCenter = () => useContext(CenterContext);

export default CenterContext;