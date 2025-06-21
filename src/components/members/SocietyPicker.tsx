import React from 'react';
import { Building, ChevronDown } from 'lucide-react';
import { useSocietiesQuery } from '../../hooks/queries/useSocietyQueries';

interface SocietyPickerProps {
  selectedSocietyId: string;
  onSocietyChange: (societyId: string) => void;
  className?: string;
}

const SocietyPicker: React.FC<SocietyPickerProps> = ({
  selectedSocietyId,
  onSocietyChange,
  className = ''
}) => {
  const { data: societies = [], isLoading, error } = useSocietiesQuery();

  return (
    <div className={`relative ${className}`}>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        <Building className="inline h-4 w-4 mr-1" />
        Select Society
      </label>
      <div className="relative">
        <select
          value={selectedSocietyId}
          onChange={(e) => onSocietyChange(e.target.value)}
          disabled={isLoading}
          className="w-full pl-3 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white appearance-none"
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
          <ChevronDown className="h-5 w-5 text-gray-400" />
        </div>
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
          Failed to load societies
        </p>
      )}
    </div>
  );
};

export default SocietyPicker;