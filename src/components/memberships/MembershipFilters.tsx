import React from 'react';
import { Search, Filter, X, Calendar } from 'lucide-react';
import { MembershipFilters as FilterType } from '../../types/membership';
import useAuth from '../../hooks/useAuth';

interface MembershipFiltersProps {
  filters: FilterType;
  onFiltersChange: (filters: FilterType) => void;
  onClearFilters: () => void;
}

const MembershipFilters: React.FC<MembershipFiltersProps> = ({
  filters,
  onFiltersChange,
  onClearFilters
}) => {
  const { user } = useAuth();
  const isCenterAdmin = user?.role === 'center_admin';
  
  const handleFilterChange = (key: keyof FilterType, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value || undefined
    });
  };

  const hasActiveFilters = Object.values(filters).some(value => value && value !== '');

  const membershipTypes = [
    { value: 'NA', label: 'Not Applicable' },
    { value: '1D', label: '1 Day' },
    { value: '15D', label: '15 Days' },
    { value: '1M', label: '1 Month' },
    { value: '3M', label: '3 Months' },
    { value: '6M', label: '6 Months' },
    { value: '12M', label: '12 Months' },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className={`text-lg font-medium ${isCenterAdmin ? 'text-emerald-800' : 'text-gray-900'} dark:text-white flex items-center`}>
          <Filter className={`h-5 w-5 mr-2 ${isCenterAdmin ? 'text-emerald-600' : ''}`} />
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
        {/* Search */}
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Search Memberships
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by member name, email, or transaction ID..."
              value={filters.search || ''}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className={`pl-10 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm ${
                isCenterAdmin 
                  ? 'focus:border-emerald-500 focus:ring-emerald-500' 
                  : 'focus:border-purple-500 focus:ring-purple-500'
              } dark:bg-gray-700 dark:text-white sm:text-sm`}
            />
          </div>
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Status
          </label>
          <select
            value={filters.status || ''}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className={`block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm ${
              isCenterAdmin 
                ? 'focus:border-emerald-500 focus:ring-emerald-500' 
                : 'focus:border-purple-500 focus:ring-purple-500'
            } dark:bg-gray-700 dark:text-white sm:text-sm`}
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="expired">Expired</option>
            <option value="paused">Paused</option>
          </select>
        </div>

        {/* Type Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Type
          </label>
          <select
            value={filters.type || ''}
            onChange={(e) => handleFilterChange('type', e.target.value)}
            className={`block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm ${
              isCenterAdmin 
                ? 'focus:border-emerald-500 focus:ring-emerald-500' 
                : 'focus:border-purple-500 focus:ring-purple-500'
            } dark:bg-gray-700 dark:text-white sm:text-sm`}
          >
            <option value="">All Types</option>
            {membershipTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Start Date Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Start Date From
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="date"
              value={filters.start_date || ''}
              onChange={(e) => handleFilterChange('start_date', e.target.value)}
              className={`pl-10 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm ${
                isCenterAdmin 
                  ? 'focus:border-emerald-500 focus:ring-emerald-500' 
                  : 'focus:border-purple-500 focus:ring-purple-500'
              } dark:bg-gray-700 dark:text-white sm:text-sm`}
            />
          </div>
        </div>

        {/* End Date Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            End Date To
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="date"
              value={filters.end_date || ''}
              onChange={(e) => handleFilterChange('end_date', e.target.value)}
              className={`pl-10 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm ${
                isCenterAdmin 
                  ? 'focus:border-emerald-500 focus:ring-emerald-500' 
                  : 'focus:border-purple-500 focus:ring-purple-500'
              } dark:bg-gray-700 dark:text-white sm:text-sm`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MembershipFilters;