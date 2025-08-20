import React, { createContext, useContext, useState, useEffect } from 'react';
import { Center } from '../types/center';
import { useCentersQuery } from '../hooks/queries/useCenterQueries';
import useAuth from '../hooks/useAuth';

interface CenterContextType {
  selectedCenterId: string;
  setSelectedCenterId: (centerId: string) => void;
  selectedCenter: Center | null;
  centers: Center[];
  isLoading: boolean;
  isCenterAdmin: boolean;
}

const CenterContext = createContext<CenterContextType | undefined>(undefined);

export const CenterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [selectedCenterId, setSelectedCenterId] = useState<string>('');
  
  const isCenterAdmin = user?.role === 'center_admin';
  
  // Fetch all centers
  const { data: centers = [], isLoading } = useCentersQuery();
  
  // Auto-select center for center admins
  useEffect(() => {
    if (isCenterAdmin && user?.society_id) {
      setSelectedCenterId(user.society_id);
    } else if (!isCenterAdmin) {
      // Load saved center for regular admins
      const savedCenterId = localStorage.getItem('selectedCenterId');
      if (savedCenterId && centers.some(c => c.center_id === savedCenterId)) {
        setSelectedCenterId(savedCenterId);
      }
    }
  }, [isCenterAdmin, user?.society_id, centers]);

  // Save selected center to localStorage for non-center admins
  useEffect(() => {
    if (selectedCenterId && !isCenterAdmin) {
      localStorage.setItem('selectedCenterId', selectedCenterId);
    }
  }, [selectedCenterId, isCenterAdmin]);

  const selectedCenter = centers.find(c => c.center_id === selectedCenterId) || null;

  const contextValue: CenterContextType = {
    selectedCenterId,
    setSelectedCenterId: isCenterAdmin ? () => {} : setSelectedCenterId, // Disable for center admin
    selectedCenter,
    centers,
    isLoading,
    isCenterAdmin,
  };

  return (
    <CenterContext.Provider value={contextValue}>
      {children}
    </CenterContext.Provider>
  );
};

export const useCenter = () => {
  const context = useContext(CenterContext);
  if (context === undefined) {
    throw new Error('useCenter must be used within a CenterProvider');
  }
  return context;
};