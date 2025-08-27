import React, { useState, useEffect } from 'react';
import { UserCheck, Plus } from 'lucide-react';
import axios from 'axios';
import { 
  useTrainersQuery, 
  useDeleteTrainerMutation, 
  useCreateTrainerMutation, 
  useUpdateTrainerMutation 
} from '../hooks/queries/useTrainerQueries';
import { Trainer, TrainerFilters as TrainerFiltersType, TrainerQueryParams, CreateTrainerData } from '../types/trainer';
import TrainerFilters from '../components/trainers/TrainerFilters';
import TrainersTable from '../components/trainers/TrainersTable';
import TrainerForm from '../components/trainers/TrainerForm';
import toast from 'react-hot-toast';

const TrainersPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filters, setFilters] = useState<TrainerFiltersType>({});
  const [showForm, setShowForm] = useState(false);
  const [selectedTrainer, setSelectedTrainer] = useState<Trainer | null>(null);

  // Build query parameters
  const queryParams: TrainerQueryParams = {
    page: currentPage,
    limit: pageSize,
    ...filters
  };

  // TanStack Query hooks
  const { 
    data: trainersData, 
    isLoading, 
    error,
    refetch 
  } = useTrainersQuery(queryParams);
  
  const deleteTrainerMutation = useDeleteTrainerMutation();
  const createTrainerMutation = useCreateTrainerMutation();
  const updateTrainerMutation = useUpdateTrainerMutation();

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const handleFiltersChange = (newFilters: TrainerFiltersType) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({});
  };

  const handleEditTrainer = (trainer: Trainer) => {
    setSelectedTrainer(trainer);
    setShowForm(true);
  };

  const handleDeleteTrainer = async (trainerId: string) => {
    if (!confirm('Are you sure you want to delete this trainer?')) {
      return;
    }

    try {
      await deleteTrainerMutation.mutateAsync(trainerId);
      toast.success('Trainer deleted successfully');
    } catch (error) {
      console.error('Failed to delete trainer:', error);
      toast.error('Failed to delete trainer');
    }
  };

  const handleAddTrainer = () => {
    setSelectedTrainer(null);
    setShowForm(true);
  };

  const handleCreateTrainer = async (data: CreateTrainerData) => {
    try {
      await createTrainerMutation.mutateAsync(data);
      toast.success('Trainer created successfully!');
      setShowForm(false);
      setSelectedTrainer(null);
    } catch (error) {
      console.error('Failed to create trainer:', error);
      toast.error('Failed to create trainer');
      throw error; // Re-throw to let the form handle it
    }
  };

  const handleUpdateTrainer = async (data: CreateTrainerData) => {
    if (!selectedTrainer) return;

    try {
      await updateTrainerMutation.mutateAsync({
        id: selectedTrainer.id,
        ...data
      });
      toast.success('Trainer updated successfully!');
      setShowForm(false);
      setSelectedTrainer(null);
    } catch (error) {
      console.error('Failed to update trainer:', error);
      
      let errorMessage = 'Failed to update trainer';
      
      if (axios.isAxiosError(error)) {
        if (error.response) {
          // Server responded with error status
          const status = error.response.status;
          const data = error.response.data;
          
          if (status === 400) {
            errorMessage = data?.message || 'Invalid trainer data provided';
          } else if (status === 401) {
            errorMessage = 'You are not authorized to update this trainer';
          } else if (status === 403) {
            errorMessage = 'You do not have permission to update trainers';
          } else if (status === 404) {
            errorMessage = 'Trainer not found';
          } else if (status === 409) {
            errorMessage = data?.message || 'A trainer with this information already exists';
          } else if (status >= 500) {
            errorMessage = 'Server error occurred. Please try again later';
          } else {
            errorMessage = data?.message || `Update failed (${status})`;
          }
        } else if (error.request) {
          // Network error - no response received
          errorMessage = 'Unable to connect to server. Please check your internet connection';
        } else {
          // Request setup error
          errorMessage = 'Request failed to send. Please try again';
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
      throw error;
    }
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setSelectedTrainer(null);
  };

  const isFormLoading = createTrainerMutation.isPending || updateTrainerMutation.isPending;

  if (showForm) {
    return (
      <div className="space-y-6">
        <TrainerForm
          initialData={selectedTrainer || undefined}
          onSubmit={selectedTrainer ? handleUpdateTrainer : handleCreateTrainer}
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
            <UserCheck className="h-8 w-8 mr-3 text-green-600" />
            Trainers Management
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage and monitor fitness trainers across all centers
          </p>
        </div>
        
        <div className="mt-4 lg:mt-0">
          <button
            onClick={handleAddTrainer}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Trainer
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      {trainersData && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UserCheck className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Trainers</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {trainersData.pagination.total}
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
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Trainers</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {trainersData.data.filter(t => t.status === 'active').length}
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
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Specializations</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {new Set(trainersData.data.flatMap(t => t.specialisations)).size}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                  <div className="h-4 w-4 bg-purple-600 rounded-full"></div>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Avg Experience</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {trainersData.data.length > 0 
                    ? Math.round(trainersData.data.reduce((sum, t) => sum + t.experience_in_years, 0) / trainersData.data.length)
                    : 0
                  } yrs
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <TrainerFilters
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
                {error instanceof Error ? error.message : 'Failed to load trainers'}
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

      {/* Trainers Table */}
      <TrainersTable
        data={trainersData?.data || []}
        isLoading={isLoading}
        onEdit={handleEditTrainer}
        onDelete={handleDeleteTrainer}
      />

      {/* Server-side Pagination */}
      {trainersData && trainersData.pagination.pages > 1 && (
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
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, trainersData.pagination.pages))}
              disabled={currentPage === trainersData.pagination.pages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div className="flex items-center space-x-4">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Showing page <span className="font-medium">{currentPage}</span> of{' '}
                <span className="font-medium">{trainersData.pagination.pages}</span> ({trainersData.pagination.total} total trainers)
              </p>
              <div className="flex items-center space-x-2">
                <label className="text-sm text-gray-700 dark:text-gray-300">Show:</label>
                <select
                  value={pageSize}
                  onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                  className="border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 text-sm dark:bg-gray-700 dark:text-white"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
                <span className="text-sm text-gray-700 dark:text-gray-300">per page</span>
              </div>
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
                  {currentPage} / {trainersData.pagination.pages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, trainersData.pagination.pages))}
                  disabled={currentPage === trainersData.pagination.pages}
                  className="relative inline-flex items-center px-2 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
                <button
                  onClick={() => setCurrentPage(trainersData.pagination.pages)}
                  disabled={currentPage === trainersData.pagination.pages}
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

export default TrainersPage;