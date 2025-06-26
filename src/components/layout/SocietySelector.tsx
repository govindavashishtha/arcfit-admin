import React from 'react';
import { Building, ChevronDown } from 'lucide-react';
import { useSociety } from '../../contexts/SocietyContext';

const SocietySelector: React.FC = () => {
  const { 
    selectedSocietyId, 
    setSelectedSocietyId, 
    societies, 
    isLoading 
  } = useSociety();

  return (
    <div className="px-5 py-4 border-b border-blue-700">
      <label className="block text-sm font-medium text-blue-200 mb-2">
        <Building className="inline h-4 w-4 mr-1" />
        Select Society
      </label>
      <div className="relative">
        <select
          value={selectedSocietyId}
          onChange={(e) => setSelectedSocietyId(e.target.value)}
          disabled={isLoading}
          className="w-full pl-3 pr-10 py-2 border border-blue-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-blue-700 text-white appearance-none"
        >
          <option value="">
            {isLoading ? 'Loading societies...' : 'Select a society'}
          </option>
          {societies.map((society) => (
            <option key={society.society_id} value={society.society_id}>
              {society.name} - {society.city}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <ChevronDown className="h-5 w-5 text-blue-300" />
        </div>
      </div>
      {selectedSocietyId && (
        <div className="mt-2 text-xs text-blue-300">
          Selected society will be applied across all pages
        </div>
      )}
    </div>
  );
};

export default SocietySelector;