import React, { useState } from 'react';
import { FileText, Plus, Users } from 'lucide-react';
import { 
  useDietPlansByUserQuery, 
  useCreateDietPlanMutation, 
  useDeleteDietPlanMutation 
} from '../hooks/queries/useDietPlanQueries';
import { useMembersQuery } from '../hooks/queries/useMemberQueries';
import { CreateDietPlanData } from '../types/dietPlan';
import UserSelector from '../components/dietPlans/UserSelector';
import DietPlansTable from '../components/dietPlans/DietPlansTable';
import CreateDietPlanForm from '../components/dietPlans/CreateDietPlanForm';
import ConfirmationModal from '../components/ui/ConfirmationModal';
import toast from 'react-hot-toast';
import { useCenter } from '../contexts/CenterContext';

const DietPlansPage: React.FC = () => {
  const { selectedCenterId, selectedCenter } = useCenter();
  const [selectedUserId, setSelectedUserId] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [dietPlanToDelete, setDietPlanToDelete] = useState<{ id: string; userId: string; userName: string } | null>(null);

  // TanStack Query hooks
  const createDietPlanMutation = useCreateDietPlanMutation();
  const deleteDietPlanMutation = useDeleteDietPlanMutation();
  
  // Fetch members for user selection
  const { 
    data: membersData, 
    isLoading: membersLoading, 
    error: membersError 
  } = useMembersQuery(
    selectedCenterId ? { center_id: selectedCenterId } : undefined
  );

  // Fetch diet plans for selected user
  const { 
    data: dietPlansData, 
    isLoading: dietPlansLoading, 
    error: dietPlansError 
  } = useDietPlansByUserQuery(selectedUserId);

  const handleCreateDietPlan = async (data: CreateDietPlanData) => {
    try {
      await createDietPlanMutation.mutateAsync(data);
      toast.success('Diet plan created successfully!');
      setShowForm(false);
    } catch (error) {
      console.error('Failed to create diet plan:', error);
      toast.error('Failed to create diet plan');
      throw error;
    }
  };

  const handleDeleteDietPlan = (dietPlanId: string, userId: string) => {
    const user = membersData?.data.find(member => member.user_id === userId);
    const userName = user ? `${user.first_name} ${user.last_name}` : 'Unknown User';
    
    setDietPlanToDelete({
      id: dietPlanId,
      userId,
      userName
    });
  };

  const handleConfirmDelete = async () => {
    if (!dietPlanToDelete) return;

    try {
      await deleteDietPlanMutation.mutateAsync({
        dietPlanId: dietPlanToDelete.id,
        userId: dietPlanToDelete.userId
      });
      toast.success('Diet plan deleted successfully!');
      setDietPlanToDelete(null);
    } catch (error) {
      console.error('Failed to delete diet plan:', error);
      toast.error('Failed to delete diet plan');
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
  };

  const isFormLoading = createDietPlanMutation.isPending;

  if (showForm) {
    return (
      <div className="space-y-6">
        <CreateDietPlanForm
          users={membersData?.data || []}
          isLoadingUsers={membersLoading}
          onSubmit={handleCreateDietPlan}
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
            <FileText className="h-8 w-8 mr-3 text-orange-600" />
            Diet Plans Management
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage and upload diet plan PDFs for members
          </p>
        </div>
        
        <div className="mt-4 lg:mt-0">
          <button
            onClick={() => setShowForm(true)}
          disabled={!selectedCenterId}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:bg-orange-300 disabled:cursor-not-allowed"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Diet Plan
          </button>
        </div>
      </div>

      {/* Empty State - No Society Selected */}
      {!selectedCenterId && (
        <>
          {/* Welcome Card */}
          <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-lg shadow-lg overflow-hidden">
            <div className="px-6 py-8 sm:px-10 sm:py-12">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FileText className="h-12 w-12 text-white" />
                </div>
                <div className="ml-6">
                  <h2 className="text-2xl font-bold text-white">
                    Diet Plans Management System
                  </h2>
                  <p className="mt-2 text-orange-100">
                    Upload and manage personalized diet plan PDFs for your members with date ranges and easy access.
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
                  <div className="h-8 w-8 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
                    <FileText className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    PDF Upload
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Upload diet plan PDFs up to 10MB
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Member Selection
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Search and assign to specific members
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
                    Date Management
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Set start and end dates for plans
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
                <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Select a center from the sidebar to start managing diet plans for its members
                </p>
                <div className="text-sm text-gray-400 dark:text-gray-500">
                  Once you select a center, you'll be able to upload and manage diet plans
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* User Selection and Diet Plans */}
      {selectedCenterId && (
        <>
          {/* User Selection */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Select Member to View Diet Plans
              </h3>
              {selectedCenter && (
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Center: {selectedCenter.name} - {selectedCenter.city}
                </div>
              )}
            </div>
            
            {membersLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
                <span className="ml-3 text-gray-500 dark:text-gray-400">Loading members...</span>
              </div>
            ) : membersError ? (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700 dark:text-red-200">
                      Failed to load members for this center
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="max-w-md">
                <UserSelector
                  users={membersData?.data || []}
                  selectedUserId={selectedUserId}
                  onUserSelect={setSelectedUserId}
                  placeholder="Search and select a member..."
                />
                {membersData?.data.length === 0 && (
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    No members found for this center
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Members Stats */}
          {membersData && membersData.data.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Total Members in {selectedCenter?.name}
                  </p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {membersData.pagination.total}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Stats Card */}
          {selectedUserId && dietPlansData && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FileText className="h-8 w-8 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Total Diet Plans for Selected Member
                  </p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {dietPlansData.count}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Error State */}
          {dietPlansError && (
            <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700 dark:text-red-200">
                    {dietPlansError instanceof Error ? dietPlansError.message : 'Failed to load diet plans'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Diet Plans Table */}
          {selectedUserId && (
            <DietPlansTable
              data={dietPlansData?.diet_plans || []}
              isLoading={dietPlansLoading}
              onDelete={handleDeleteDietPlan}
            />
          )}

          {/* No User Selected State */}
          {!selectedUserId && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
              <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Select a Member
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Choose a member from the dropdown above to view their diet plans
              </p>
            </div>
          )}
        </>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        open={!!dietPlanToDelete}
        onClose={() => setDietPlanToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Diet Plan"
        message={`Are you sure you want to delete the diet plan for ${dietPlanToDelete?.userName}?\n\nThis action cannot be undone and the PDF file will be permanently removed.`}
        confirmText="Delete Diet Plan"
        cancelText="Keep Diet Plan"
        confirmColor="error"
        isLoading={deleteDietPlanMutation.isPending}
        icon={<FileText size={28} color="#dc2626" />}
      />
    </div>
  );
};

export default DietPlansPage;