import React from 'react';
import { Search, Filter, X } from 'lucide-react';
import { TrainerFilters as FilterType } from '../../types/trainer';
import { useSocietiesQuery } from '../../hooks/queries/useSocietyQueries';

interface TrainerFiltersProps {
  filters: FilterType;
  onFiltersChange: (filters: FilterType) => void;
  onClearFilters: () => void;
}

const TrainerFilters: React.FC<TrainerFiltersProps> = ({
  filters,
  onFiltersChange,
  onClearFilters
}) => {
  const { data: societies = [] } = useSocietiesQuery();

  const handleFilterChange = (key: keyof FilterType, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value || undefined
    });
  };

  const hasActiveFilters = Object.values(filters).some(value => value && value !== '');

  // Get unique specializations for filter options
  const specializations = [
    'Yoga',
    'Pilates',
    'CrossFit',
    'Zumba',
    'Aerobics',
    'Weight Training',
    'Cardio',
    'Dance Fitness',
    'Martial Arts',
    'Swimming'
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
          <Filter className="h-5 w-5 mr-2" />
          Filters & Search
        </h3>
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="flex items-center text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="h-4 w-4 mr-1" />
            Clear All
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search */}
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Search Trainers
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={filters.search || ''}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="pl-10 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
            />
          </div>
        </div>

        {/* Specialization Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Specialization
          </label>
          <select
            value={filters.specialization || ''}
            onChange={(e) => handleFilterChange('specialization', e.target.value)}
            className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
          >
            <option value="">All Specializations</option>
            {specializations.map((spec) => (
              <option key={spec} value={spec}>
                {spec}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Status
          </label>
          <select
            value={filters.status || ''}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="pending">Pending</option>
          </select>
        </div>

        {/* Society Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Society
          </label>
          <select
            value={filters.society_id || ''}
            onChange={(e) => handleFilterChange('society_id', e.target.value)}
            className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
          >
            <option value="">All Societies</option>
            {societies.map((society) => (
              <option key={society.society_id} value={society.society_id}>
                {society.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default TrainerFilters;