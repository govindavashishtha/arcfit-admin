import React, { useState, useEffect } from 'react';
import { Tag, Plus } from 'lucide-react';
import { useSubscriptionPlansQuery } from '../hooks/queries/useSubscriptionPlanQueries';
import { SubscriptionPlanFilters as SubscriptionPlanFiltersType, SubscriptionPlanQueryParams } from '../types/subscriptionPlan';
import SubscriptionPlanFilters from '../components/subscriptionPlans/SubscriptionPlanFilters';
import SubscriptionPlansTable from '../components/subscriptionPlans/SubscriptionPlansTable';
import { useSociety } from '../contexts/SocietyContext';

const SubscriptionPlansPage: React.FC = () => {
  const { selectedSocietyId, selectedSociety } = useSociety();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [filters, setFilters] = useState<SubscriptionPlanFiltersType>({});

  // Build query parameters
  const queryParams: SubscriptionPlanQueryParams = {
    page: currentPage,
    limit: pageSize,
    society_id: selectedSocietyId,
  };

  // TanStack Query hooks
  const { 
    data: subscriptionPlansData, 
    isLoading, 
    error,
    refetch 
  } = useSubscriptionPlansQuery(queryParams);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedSocietyId, filters]);

  const handleFiltersChange = (newFilters: SubscriptionPlanFiltersType) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({});
  };

  // Filter data locally based on filters
  const filteredData = subscriptionPlansData?.items.filter(plan => {
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesSearch = 
        plan.name.toLowerCase().includes(searchLower) ||
        plan.description.toLowerCase().includes(searchLower);
      if (!matchesSearch) return false;
    }
    
    if (filters.type && plan.type !== filters.type) {
      return false;
    }
    
    return true;
  }) || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <Tag className="h-8 w-8 mr-3 text-indigo-600" />
            Subscription Plans
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage subscription plans for your society
          </p>
        </div>
      </div>

      {/* Empty State - No Society Selected */}
      {!selectedSocietyId && (
        <>
          {/* Welcome Card */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg shadow-lg overflow-hidden">
            <div className="px-6 py-8 sm:px-10 sm:py-12">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Tag className="h-12 w-12 text-white" />
                </div>
                <div className="ml-6">
                  <h2 className="text-2xl font-bold text-white">
                    Subscription Plans Management
                  </h2>
                  <p className="mt-2 text-indigo-100">
                    View and manage subscription plans with flexible pricing and features for your society members.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center">
                    <Tag className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Flexible Plans
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    1 day to 12 months options
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                    <div className="h-4 w-4 bg-green-600 rounded-full"></div>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Feature Management
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Customizable plan features
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <div className="h-4 w-4 bg-blue-600 rounded-full"></div>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Pricing Control
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Original & discounted pricing
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Getting Started */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Getting Started
              </h3>
            </div>
            <div className="p-6">
              <div className="text-center">
                <Tag className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Select a society from the sidebar to view its subscription plans
                </p>
                <div className="text-sm text-gray-400 dark:text-gray-500">
                  Once you select a society, you'll see all available subscription plans
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Society Selected Content */}
      {selectedSocietyId && (
        <>
          {/* Stats Card */}
          {subscriptionPlansData && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Tag className="h-8 w-8 text-indigo-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Total Subscription Plans for {selectedSociety?.name}
                  </p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {subscriptionPlansData.total}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Filters */}
          <SubscriptionPlanFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onClearFilters={handleClearFilters}
          />

          {/* Error State */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700 dark:text-red-200">
                    {error instanceof Error ? error.message : 'Failed to load subscription plans'}
                  </p>
                  <button 
                    onClick={() => refetch()}
                    className="mt-2 text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 underline"
                  >
                    Try again
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Subscription Plans Table */}
          <SubscriptionPlansTable
            data={filteredData}
            isLoading={isLoading}
          />

          {/* Server-side Pagination */}
          {subscriptionPlansData && Math.ceil(subscriptionPlansData.total / pageSize) > 1 && (
            <div className="bg-white dark:bg-gray-800 px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 rounded-lg shadow">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(subscriptionPlansData.total / pageSize)))}
                  disabled={currentPage === Math.ceil(subscriptionPlansData.total / pageSize)}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Showing page <span className="font-medium">{currentPage}</span> of{' '}
                    <span className="font-medium">{Math.ceil(subscriptionPlansData.total / pageSize)}</span> ({subscriptionPlansData.total} total plans)
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    <button
                      onClick={() => setCurrentPage(1)}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      First
                    </button>
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300">
                      {currentPage} / {Math.ceil(subscriptionPlansData.total / pageSize)}
                    </span>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(subscriptionPlansData.total / pageSize)))}
                      disabled={currentPage === Math.ceil(subscriptionPlansData.total / pageSize)}
                      className="relative inline-flex items-center px-2 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                    <button
                      onClick={() => setCurrentPage(Math.ceil(subscriptionPlansData.total / pageSize))}
                      disabled={currentPage === Math.ceil(subscriptionPlansData.total / pageSize)}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Last
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SubscriptionPlansPage;