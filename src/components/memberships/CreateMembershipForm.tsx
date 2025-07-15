import React, { useState, useEffect } from 'react';
import { CreateMembershipData } from '../../types/membership';
import { useMembersQuery } from '../../hooks/queries/useMemberQueries';
import { useSocietiesQuery } from '../../hooks/queries/useSocietyQueries';
import MemberSearchSelect from './MemberSearchSelect';
import { 
  User, 
  CreditCard, 
  Calendar, 
  IndianRupee,
  Building,
  Clock,
  Pause,
  ArrowLeft
} from 'lucide-react';

interface CreateMembershipFormProps {
  selectedSocietyId: string;
  onSubmit: (data: CreateMembershipData) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

const CreateMembershipForm: React.FC<CreateMembershipFormProps> = ({
  selectedSocietyId,
  onSubmit,
  onCancel,
  isLoading
}) => {
  const { data: societies = [] } = useSocietiesQuery();
  
  const [formData, setFormData] = useState<CreateMembershipData>({
    user_id: '',
    type: '1M',
    transaction_id: '',
    is_paused_allowed: false,
    max_allowed_pause_days: 0,
    payment_amount: 0,
    payment_method: 'upi'
  });

  const [error, setError] = useState<string>('');

  // Fetch members for selected society
  const { data: membersData, isLoading: membersLoading } = useMembersQuery(
    selectedSocietyId ? { society_id: selectedSocietyId } : undefined
  );

  const selectedSociety = societies.find(s => s.society_id === selectedSocietyId);

  const membershipTypes = [
    { value: '1D', label: '1 Day', defaultPrice: 269 },
    { value: '15D', label: '15 Days', defaultPrice: 1799 },
    { value: '1M', label: '1 Month', defaultPrice: 2999 },
    { value: '3M', label: '3 Months', defaultPrice: 7500 },
    { value: '6M', label: '6 Months', defaultPrice: 12000 },
    { value: '12M', label: '12 Months', defaultPrice: 18000 },
  ];

  const paymentMethods = [
    { value: 'upi', label: 'UPI', icon: '📱' },
    { value: 'credit_card', label: 'Credit Card', icon: '💳' },
    { value: 'debit_card', label: 'Debit Card', icon: '💳' },
    { value: 'cash', label: 'Cash', icon: '💵' },
  ];

  // Generate random transaction ID
  const generateTransactionId = () => {
    return 'TXN' + Math.random().toString(36).substr(2, 9).toUpperCase();
  };

  useEffect(() => {
    // Generate transaction ID on component mount
    setFormData(prev => ({
      ...prev,
      transaction_id: generateTransactionId()
    }));
  }, []);

  useEffect(() => {
    // Update pause settings based on membership type
    const updatePauseSettings = () => {
      let isPauseAllowed = false;
      let maxPauseDays = 0;

      if (formData.type === '1D' || formData.type === '15D') {
        isPauseAllowed = false;
        maxPauseDays = 0;
      } else if (formData.type === '6M') {
        isPauseAllowed = true;
        maxPauseDays = 15;
      } else if (formData.type === '12M') {
        isPauseAllowed = true;
        maxPauseDays = 28;
      }

      setFormData(prev => ({
        ...prev,
        is_paused_allowed: isPauseAllowed,
        max_allowed_pause_days: maxPauseDays
      }));
    };

    updatePauseSettings();
  }, [formData.type]);

  useEffect(() => {
    // Update default price based on membership type
    const selectedType = membershipTypes.find(type => type.value === formData.type);
    if (selectedType) {
      setFormData(prev => ({
        ...prev,
        payment_amount: selectedType.defaultPrice
      }));
    }
  }, [formData.type]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'payment_amount') {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleMemberSelect = (userId: string) => {
    setFormData(prev => ({ ...prev, user_id: userId }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!selectedSocietyId) {
      setError('Society is required');
      return;
    }

    if (!formData.user_id) {
      setError('Please select a member');
      return;
    }

    if (!formData.payment_amount || formData.payment_amount <= 0) {
      setError('Please enter a valid payment amount');
      return;
    }

    try {
      await onSubmit(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while creating the membership');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Create New Membership
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Add a new membership for {selectedSociety?.name}
            </p>
          </div>
          <button
            onClick={onCancel}
            className="flex items-center text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Society Selection
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Society Info */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
          <div className="flex items-center">
            <Building className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
            <div>
              <h3 className="text-sm font-medium text-blue-900 dark:text-blue-100">
                Selected Society
              </h3>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                {selectedSociety?.name} - {selectedSociety?.city}
              </p>
            </div>
          </div>
        </div>

        {/* Member Selection */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
            <User className="h-5 w-5 mr-2" />
            Member Selection
          </h3>
          
          {membersLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              <span className="ml-3 text-gray-500 dark:text-gray-400">Loading members...</span>
            </div>
          ) : (
            <MemberSearchSelect
              members={membersData?.data || []}
              selectedMemberId={formData.user_id}
              onMemberSelect={handleMemberSelect}
              placeholder="Search by name, phone, or email..."
            />
          )}
        </div>

        {/* Membership Details */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Membership Details
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Membership Type *
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                {membershipTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label} - ₹{type.defaultPrice}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Transaction ID
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  type="text"
                  name="transaction_id"
                  value={formData.transaction_id}
                  onChange={handleChange}
                  required
                  readOnly
                  className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white bg-gray-50 dark:bg-gray-600"
                />
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, transaction_id: generateTransactionId() }))}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
                >
                  Regenerate
                </button>
              </div>
            </div>
          </div>

          {/* Pause Settings Display */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white flex items-center mb-2">
              <Pause className="h-4 w-4 mr-2" />
              Pause Settings
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center">
                <div className={`w-4 h-4 rounded-full mr-2 ${
                  formData.is_paused_allowed ? 'bg-green-500' : 'bg-red-500'
                }`}></div>
                <span className="text-gray-700 dark:text-gray-300">
                  Pause Allowed: {formData.is_paused_allowed ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2 text-gray-400" />
                <span className="text-gray-700 dark:text-gray-300">
                  Max Pause Days: {formData.max_allowed_pause_days}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
            <IndianRupee className="h-5 w-5 mr-2" />
            Payment Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Payment Amount (₹) *
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 dark:text-gray-400 text-sm">₹</span>
                </div>
                <input
                  type="number"
                  name="payment_amount"
                  value={formData.payment_amount}
                  onChange={handleChange}
                  required
                  min="1"
                  step="0.01"
                  className="pl-8 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Payment Method *
              </label>
              <select
                name="payment_method"
                value={formData.payment_method}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                {paymentMethods.map((method) => (
                  <option key={method.value} value={method.value}>
                    {method.icon} {method.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700 dark:text-red-200">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:bg-purple-300 disabled:cursor-not-allowed flex items-center"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                Creating...
              </>
            ) : (
              'Create Membership'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateMembershipForm;