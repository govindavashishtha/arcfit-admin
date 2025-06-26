import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Upload, Filter } from 'lucide-react';
import { useEventsQuery } from '../hooks/queries/useEventQueries';
import { useSocietiesQuery } from '../hooks/queries/useSocietyQueries';
import { EventFilters as EventFiltersType, EventQueryParams } from '../types/event';
import EventFilters from '../components/events/EventFilters';
import EventsTable from '../components/events/EventsTable';
import BulkUploadModal from '../components/events/BulkUploadModal';

const EventsPage: React.FC = () => {
  const [showBulkUploadModal, setShowBulkUploadModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [filters, setFilters] = useState<EventFiltersType>({});
  const [selectedSocietyId, setSelectedSocietyId] = useState<string>('');

  // Build query parameters
  const queryParams: EventQueryParams = {
    page: currentPage,
    limit: pageSize,
    ...filters
  };

  // TanStack Query hooks
  const { 
    data: eventsData, 
    isLoading: eventsLoading, 
    error: eventsError,
    refetch: refetchEvents 
  } = useEventsQuery(queryParams);

  const { data: societies = [] } = useSocietiesQuery();

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const handleFiltersChange = (newFilters: EventFiltersType) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({});
  };

  const handleSocietyChange = (societyId: string) => {
    setSelectedSocietyId(societyId);
    setFilters(prev => ({
      ...prev,
      society_id: societyId || undefined
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <Calendar className="h-8 w-8 mr-3 text-indigo-600" />
            Events Management
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage and organize events across all societies
          </p>
        </div>
        
        <div className="mt-4 lg:mt-0 flex space-x-3">
          <button
            onClick={() => setShowBulkUploadModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Upload className="h-4 w-4 mr-2" />
            Add Bulk Events
          </button>
          <button
            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Single Event
          </button>
        </div>
      </div>

      {/* Society Selection */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center mb-4">
              <Filter className="h-5 w-5 mr-2" />
              Quick Filters
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Society
                </label>
                <select
                  value={selectedSocietyId}
                  onChange={(e) => handleSocietyChange(e.target.value)}
                  className="w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">All Societies</option>
                  {societies.map((society) => (
                    <option key={society.society_id} value={society.society_id}>
                      {society.name} - {society.city}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Event Type
                </label>
                <div className="space-y-2">
                  <button
                    onClick={() => handleFiltersChange({ ...filters, type: 'yoga' })}
                    className={`w-full px-3 py-2 text-sm rounded-md ${
                      filters.type === 'yoga'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    Yoga
                  </button>
                  <button
                    onClick={() => handleFiltersChange({ ...filters, type: 'dance' })}
                    className={`w-full px-3 py-2 text-sm rounded-md ${
                      filters.type === 'dance'
                        ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    Dance
                  </button>
                  <button
                    onClick={() => handleFiltersChange({ ...filters, type: 'pilates' })}
                    className={`w-full px-3 py-2 text-sm rounded-md ${
                      filters.type === 'pilates'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    Pilates
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Status
                </label>
                <div className="space-y-2">
                  <button
                    onClick={() => handleFiltersChange({ ...filters, status: 'scheduled' })}
                    className={`w-full px-3 py-2 text-sm rounded-md ${
                      filters.status === 'scheduled'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    Scheduled
                  </button>
                  <button
                    onClick={() => handleFiltersChange({ ...filters, status: 'completed' })}
                    className={`w-full px-3 py-2 text-sm rounded-md ${
                      filters.status === 'completed'
                        ? 'bg-gray-300 text-gray-800 dark:bg-gray-600 dark:text-gray-200'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    Completed
                  </button>
                  <button
                    onClick={() => handleFiltersChange({ ...filters, status: 'cancelled' })}
                    className={`w-full px-3 py-2 text-sm rounded-md ${
                      filters.status === 'cancelled'
                        ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    Cancelled
                  </button>
                </div>
              </div>
              
              {Object.keys(filters).length > 0 && (
                <button
                  onClick={handleClearFilters}
                  className="w-full mt-4 px-3 py-2 text-sm text-indigo-600 dark:text-indigo-400 border border-indigo-600 dark:border-indigo-400 rounded-md hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-6">
          {/* Advanced Filters */}
          <EventFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onClearFilters={handleClearFilters}
          />

          {/* Error State */}
          {eventsError && (
            <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700 dark:text-red-200">
                    {eventsError instanceof Error ? eventsError.message : 'Failed to load events'}
                  </p>
                  <button 
                    onClick={() => refetchEvents()}
                    className="mt-2 text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 underline"
                  >
                    Try again
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Events Table */}
          <EventsTable
            data={eventsData?.data || []}
            isLoading={eventsLoading}
          />

          {/* Server-side Pagination */}
          {eventsData && eventsData.pagination.pages > 1 && (
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
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, eventsData.pagination.pages))}
                  disabled={currentPage === eventsData.pagination.pages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Showing page <span className="font-medium">{currentPage}</span> of{' '}
                    <span className="font-medium">{eventsData.pagination.pages}</span> ({eventsData.pagination.total} total events)
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
                      {currentPage} / {eventsData.pagination.pages}
                    </span>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, eventsData.pagination.pages))}
                      disabled={currentPage === eventsData.pagination.pages}
                      className="relative inline-flex items-center px-2 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                    <button
                      onClick={() => setCurrentPage(eventsData.pagination.pages)}
                      disabled={currentPage === eventsData.pagination.pages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Last
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bulk Upload Modal */}
      <BulkUploadModal
        isOpen={showBulkUploadModal}
        onClose={() => setShowBulkUploadModal(false)}
      />
    </div>
  );
};

export default EventsPage;