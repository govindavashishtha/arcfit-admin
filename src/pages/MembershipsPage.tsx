import React, { useState } from 'react';
import { CreditCard, Plus } from 'lucide-react';
import { useCreateMembershipMutation } from '../hooks/queries/useMembershipQueries';
import { CreateMembershipData } from '../types/membership';
import CreateMembershipForm from '../components/memberships/CreateMembershipForm';
import toast from 'react-hot-toast';

const MembershipsPage: React.FC = () => {
  const [showForm, setShowForm] = useState(false);

  // TanStack Query hooks
  const createMembershipMutation = useCreateMembershipMutation();

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

  const isFormLoading = createMembershipMutation.isPending;

  if (showForm) {
    return (
      <div className="space-y-6">
        <CreateMembershipForm
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
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Membership
          </button>
        </div>
      </div>

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

      {/* Quick Stats */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Quick Actions
          </h3>
        </div>
        <div className="p-6">
          <div className="text-center">
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Get started by creating your first membership
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create First Membership
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MembershipsPage;