import React from 'react';
import { Building, ChevronDown } from 'lucide-react';
import { useCenter } from '../../contexts/CenterContext';

const CenterSelector: React.FC = () => {
  const { 
    selectedCenterId, 
    setSelectedCenterId, 
    centers, 
    isLoading 
  } = useCenter();

  return (
    <div className="px-5 py-4 border-b border-blue-700">
      <label className="block text-sm font-medium text-blue-200 mb-2">
        <Building className="inline h-4 w-4 mr-1" />
        Select Center
      </label>
      <div className="relative">
        <select
          value={selectedCenterId}
          onChange={(e) => setSelectedCenterId(e.target.value)}
          disabled={isLoading}
          className="w-full pl-3 pr-10 py-2 border border-blue-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-blue-700 text-white appearance-none"
        >
          <option value="">
            {isLoading ? 'Loading centers...' : 'Select a center'}
          </option>
          {centers.map((center) => (
            <option key={center.center_id} value={center.center_id}>
              {center.name} - {center.city}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <ChevronDown className="h-5 w-5 text-blue-300" />
        </div>
      </div>
      {selectedCenterId && (
        <div className="mt-2 text-xs text-blue-300">
          Selected center will be applied across all pages
        </div>
      )}
    </div>
  );
};

export default CenterSelector;