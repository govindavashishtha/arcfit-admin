import React, { useState, useEffect } from 'react';
import { Users, Plus } from 'lucide-react';
import { useMembersQuery, useDeleteMemberMutation } from '../hooks/queries/useMemberQueries';
import { Member, MemberFilters as MemberFiltersType, MemberQueryParams } from '../types/member';
import SocietyPicker from '../components/members/SocietyPicker';
import MemberFilters from '../components/members/MemberFilters';
import MembersTable from '../components/members/MembersTable';

const MembersPage: React.FC = () => {
  const [selectedSocietyId, setSelectedSocietyId] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [filters, setFilters] = useState<MemberFiltersType>({});

  // Build query parameters
  const queryParams: MemberQueryParams = {
    page: currentPage,
    limit: pageSize,
    society_id: selectedSocietyId,
    ...filters
  };

  // TanStack Query hooks
  const { 
    data: membersData, 
    isLoading, 
    error,
    refetch 
  } = useMembersQuery(queryParams);
  
  const deleteMemberMutation = useDeleteMemberMutation();

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedSocietyId, filters]);

  const handleSocietyChange = (societyId: string) => {
    setSelectedSocietyId(societyId);
    setFilters({}); // Clear filters when society changes
  };

  const handleFiltersChange = (newFilters: MemberFiltersType) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({});
  };

  const handleEditMember = (member: Member) => {
    // TODO: Implement edit functionality
    console.log('Edit member:', member);
  };

  const handleDeleteMember = async (memberId: string) => {
    if (!confirm('Are you sure you want to delete this member?')) {
      return;
    }

    try {
      await deleteMemberMutation.mutateAsync(memberId);
    } catch (error) {
      console.error('Failed to delete member:', error);
    }
  };

  const handleAddMember = () => {
    // TODO: Implement add member functionality
    console.log('Add member for society:', selectedSocietyId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <Users className="h-8 w-8 mr-3 text-blue-600" />
            Society Members
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage and monitor members across different societies
          </p>
        </div>
        
        {/* Commented out Add Member Button */}
        {/* 
        <div className="mt-4 lg:mt-0">
          <button
            onClick={handleAddMember}
            disabled={!selectedSocietyId}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Member
          </button>
        </div>
        */}
      </div>

      {/* Society Picker */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <SocietyPicker
            selectedSocietyId={selectedSocietyId}
            onSocietyChange={handleSocietyChange}
          />
        </div>
        
        {/* Stats Cards */}
        {selectedSocietyId && membersData && (
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Members</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {membersData.pagination.total}
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
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Members</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {membersData.data.filter(m => m.status === 'active').length}
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
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Pending Verification</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {membersData.data.filter(m => m.verification_status === 'pending').length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Filters */}
      {selectedSocietyId && (
        <MemberFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onClearFilters={handleClearFilters}
        />
      )}

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
                {error instanceof Error ? error.message : 'Failed to load members'}
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

      {/* Empty State */}
      {!selectedSocietyId && (
        <div className="text-center py-12">
          <Users className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No society selected</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Please select a society to view its members.
          </p>
        </div>
      )}

      {/* Members Table */}
      {selectedSocietyId && (
        <MembersTable
          data={membersData?.data || []}
          isLoading={isLoading}
          onEdit={handleEditMember}
          onDelete={handleDeleteMember}
        />
      )}

      {/* Server-side Pagination */}
      {selectedSocietyId && membersData && membersData.pagination.pages > 1 && (
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
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, membersData.pagination.pages))}
              disabled={currentPage === membersData.pagination.pages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Showing page <span className="font-medium">{currentPage}</span> of{' '}
                <span className="font-medium">{membersData.pagination.pages}</span> ({membersData.pagination.total} total members)
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
                  {currentPage} / {membersData.pagination.pages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, membersData.pagination.pages))}
                  disabled={currentPage === membersData.pagination.pages}
                  className="relative inline-flex items-center px-2 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
                <button
                  onClick={() => setCurrentPage(membersData.pagination.pages)}
                  disabled={currentPage === membersData.pagination.pages}
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

export default MembersPage;