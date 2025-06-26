import React, { useState, useEffect } from 'react';
import { CreditCard, Plus } from 'lucide-react';
import { useCreateMembershipMutation, useMembershipsBySocietyQuery } from '../hooks/queries/useMembershipQueries';
import { CreateMembershipData, MembershipFilters as MembershipFiltersType, MembershipQueryParams } from '../types/membership';
import CreateMembershipForm from '../components/memberships/CreateMembershipForm';
import MembershipFilters from '../components/memberships/MembershipFilters';
import MembershipsTable from '../components/memberships/MembershipsTable';
import toast from 'react-hot-toast';
import { useSociety } from '../contexts/SocietyContext';

const MembershipsPage: React.FC = () => {
  const { selectedSocietyId } = useSociety();
  const [showForm, setShowForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [filters, setFilters] = useState<MembershipFiltersType>({});

  // Build query parameters
  const queryParams: MembershipQueryParams = {
    page: currentPage,
    limit: pageSize,
    ...filters
  };

  // TanStack Query hooks
  const createMembershipMutation = useCreateMembershipMutation();
  const { 
    data: membershipsData, 
    isLoading: membershipsLoading, 
    error: membershipsError,
    refetch: refetchMemberships 
  } = useMembershipsBySocietyQuery(selectedSocietyId, queryParams);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedSocietyId, filters]);

  const handleCreateMembership = async (data: CreateMembershipData) => {
    try {
      await createMembershipMutation.mutateAsync(data);
      toast.success('Membership created successfully!');
      setShowForm(false);
    } catch (error) {
      console.error('Failed to create membership:', error);
      toast.error('Failed to create membership');
      throw error; // Re-throw to let the form handle it
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
  };

  const handleFiltersChange = (newFilters: MembershipFiltersType) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({});
  };

  const isFormLoading = createMembershipMutation.isPending;

  if (showForm) {
    return (
      <div className="space-y-6">
        <CreateMembershipForm
          selectedSocietyId={selectedSocietyId}
          onSubmit={handleCreateMembership}
          onCancel={handleCancelForm}
          isLoading={isFormLoading}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <CreditCard className="h-8 w-8 mr-3 text-purple-600" />
            Memberships Management
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage member subscriptions and billing across all societies
          </p>
        </div>
        
        <div className="mt-4 lg:mt-0">
          <button
            onClick={() => setShowForm(true)}
            disabled={!selectedSocietyId}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:bg-purple-300 disabled:cursor-not-allowed"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Membership
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      {selectedSocietyId && membershipsData && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CreditCard className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Memberships</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {membershipsData.pagination.total}
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
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {membershipsData.data.filter(m => m.status === 'active').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center">
                  <div className="h-4 w-4 bg-yellow-600 rounded-full"></div>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Paused</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {membershipsData.data.filter(m => m.status === 'paused').length}
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
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Revenue</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  ₹{membershipsData.data.reduce((sum, m) => sum + m.payment_amount, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      {selectedSocietyId && (
        <MembershipFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onClearFilters={handleClearFilters}
        />
      )}

      {/* Error State */}
      {membershipsError && (
        <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700 dark:text-red-200">
                {membershipsError instanceof Error ? membershipsError.message : 'Failed to load memberships'}
              </p>
              <button 
                onClick={() => refetchMemberships()}
                className="mt-2 text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 underline"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!selectedSocietyId && (
        <>
          {/* Welcome Card */}
          <div className="bg-gradient-to-r from-purple-500 to-blue-600 rounded-lg shadow-lg overflow-hidden">
            <div className="px-6 py-8 sm:px-10 sm:py-12">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CreditCard className="h-12 w-12 text-white" />
                </div>
                <div className="ml-6">
                  <h2 className="text-2xl font-bold text-white">
                    Membership Management System
                  </h2>
                  <p className="mt-2 text-purple-100">
                    Create and manage member subscriptions with flexible billing options and pause functionality.
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
                  <div className="h-8 w-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                    <CreditCard className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Flexible Plans
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    15 days to 12 months options
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
                    Multiple Payment Methods
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    UPI, Cards, and Cash support
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center">
                    <div className="h-4 w-4 bg-yellow-600 rounded-full"></div>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Pause Functionality
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Available for 6M and 12M plans
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
                <CreditCard className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Select a society from the sidebar to start viewing and managing memberships
                </p>
                <div className="text-sm text-gray-400 dark:text-gray-500">
                  Once you select a society, you'll see all memberships for that location
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Memberships Table */}
      {selectedSocietyId && (
        <MembershipsTable
          data={membershipsData?.data || []}
          isLoading={membershipsLoading}
        />
      )}

      {/* Server-side Pagination */}
      {selectedSocietyId && membershipsData && membershipsData.pagination.pages > 1 && (
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
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, membershipsData.pagination.pages))}
              disabled={currentPage === membershipsData.pagination.pages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Showing page <span className="font-medium">{currentPage}</span> of{' '}
                <span className="font-medium">{membershipsData.pagination.pages}</span> ({membershipsData.pagination.total} total memberships)
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
                  {currentPage} / {membershipsData.pagination.pages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, membershipsData.pagination.pages))}
                  disabled={currentPage === membershipsData.pagination.pages}
                  className="relative inline-flex items-center px-2 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
                <button
                  onClick={() => setCurrentPage(membershipsData.pagination.pages)}
                  disabled={currentPage === membershipsData.pagination.pages}
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
  );
};

export default MembershipsPage;