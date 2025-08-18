import React, { createContext, useState, useEffect, useContext } from 'react';
import { Center } from '../types/center';
import { useCentersQuery } from '../hooks/queries/useCenterQueries';
import useAuth from '../hooks/useAuth';

interface CenterContextType {
  selectedCenterId: string;
  setSelectedCenterId: (id: string) => void;
  centers: Center[];
  isLoading: boolean;
  error: Error | null;
  selectedCenter: Center | null;
  isSocietyAdmin: boolean;
}

const CenterContext = createContext<CenterContextType>({
  selectedCenterId: '',
  setSelectedCenterId: () => {},
  centers: [],
  isLoading: false,
  error: null,
  selectedCenter: null,
  isSocietyAdmin: false,
});

export const CenterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [selectedCenterId, setSelectedCenterId] = useState<string>('');
  
  const isSocietyAdmin = user?.role === 'society_admin';
  
  // Fetch centers
  const { 
    data: centers = [], 
    isLoading, 
    error 
  } = useCentersQuery();

  // Find the selected center object
  const selectedCenter = centers.find(center => center.center_id === selectedCenterId) || null;

  // Handle center selection based on user role
  useEffect(() => {
    if (isSocietyAdmin && user?.society_id) {
      // For society admin, auto-select their society
      setSelectedCenterId(user.society_id);
    } else if (!isSocietyAdmin) {
      // For regular admins, load from localStorage
      const savedCenterId = localStorage.getItem('selectedCenterId');
      if (savedCenterId) {
        setSelectedCenterId(savedCenterId);
      }
    }
  }, [isSocietyAdmin, user?.society_id]);

  // Save selected center to localStorage when it changes (only for non-society admins)
  useEffect(() => {
    if (selectedCenterId && !isSocietyAdmin) {
      localStorage.setItem('selectedCenterId', selectedCenterId);
    }
  }, [selectedCenterId, isSocietyAdmin]);

  return (
    <CenterContext.Provider
      value={{
        selectedCenterId,
        setSelectedCenterId: isSocietyAdmin ? () => {} : setSelectedCenterId, // Disable for society admin
        centers,
        isLoading,
        error: error as Error | null,
        selectedCenter,
        isSocietyAdmin,
      }}
    >
      {children}
    </CenterContext.Provider>
  );
};

export const useCenter = () => useContext(CenterContext);

export default CenterContext;