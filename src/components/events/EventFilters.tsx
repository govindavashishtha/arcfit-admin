import React from 'react';
import { Search, Filter, X, Calendar } from 'lucide-react';
import { EventFilters as FilterType } from '../../types/event';
import { useSocietiesQuery } from '../../hooks/queries/useSocietyQueries';

interface EventFiltersProps {
  filters: FilterType;
  onFiltersChange: (filters: FilterType) => void;
  onClearFilters: () => void;
}

const EventFilters: React.FC<EventFiltersProps> = ({
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

  const eventTypes = [
    { value: 'yoga', label: 'Yoga' },
    { value: 'dance', label: 'Dance' },
    { value: 'pilates', label: 'Pilates' },
  ];

  const eventStatuses = [
    { value: 'scheduled', label: 'Scheduled' },
    { value: 'cancelled', label: 'Cancelled' },
    { value: 'completed', label: 'Completed' },
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Society Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Society
          </label>
          <select
            value={filters.society_id || ''}
            onChange={(e) => handleFilterChange('society_id', e.target.value)}
            className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
          >
            <option value="">All Societies</option>
            {societies.map((society) => (
              <option key={society.society_id} value={society.society_id}>
                {society.name}
              </option>
            ))}
          </select>
        </div>

        {/* Type Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Event Type
          </label>
          <select
            value={filters.type || ''}
            onChange={(e) => handleFilterChange('type', e.target.value)}
            className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
          >
            <option value="">All Types</option>
            {eventTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
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
            className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
          >
            <option value="">All Statuses</option>
            {eventStatuses.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>

        {/* From Date Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            From Date
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="date"
              value={filters.from_date || ''}
              onChange={(e) => handleFilterChange('from_date', e.target.value)}
              className="pl-10 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
            />
          </div>
        </div>

        {/* To Date Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            To Date
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="date"
              value={filters.to_date || ''}
              onChange={(e) => handleFilterChange('to_date', e.target.value)}
              className="pl-10 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventFilters;