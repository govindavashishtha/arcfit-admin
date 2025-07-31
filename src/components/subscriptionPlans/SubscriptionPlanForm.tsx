import React, { useState, useEffect } from 'react';
import { CreateSubscriptionPlanData, SubscriptionPlan } from '../../types/subscriptionPlan';
import { useSociety } from '../../contexts/SocietyContext';
import FeaturesEditor from './FeaturesEditor';
import { 
  Tag, 
  FileText, 
  IndianRupee,
  Calendar,
  Globe,
  ArrowLeft,
  Building,
  Pause,
  Clock
} from 'lucide-react';

interface SubscriptionPlanFormProps {
  initialData?: SubscriptionPlan;
  onSubmit: (data: CreateSubscriptionPlanData) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

const SubscriptionPlanForm: React.FC<SubscriptionPlanFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading
}) => {
  const { selectedSocietyId, selectedSociety } = useSociety();
  
  const [formData, setFormData] = useState<CreateSubscriptionPlanData>({
    society_id: selectedSocietyId || '',
    name: '',
    type: '1M',
    description: '',
    features: {},
    original_amount: 0,
    payable_amount: 0,
    pay_online: 1,
    is_paused_allowed: false,
    max_allowed_pause_days: 0
  });

  const [error, setError] = useState<string>('');

  const planTypes = [
    { value: '1D', label: '1 Day' },
    { value: '15D', label: '15 Days' },
    { value: '1M', label: '1 Month' },
    { value: '3M', label: '3 Months' },
    { value: '6M', label: '6 Months' },
    { value: '12M', label: '12 Months' },
  ];

  useEffect(() => {
    if (initialData) {
      setFormData({
        society_id: initialData.society_id,
        name: initialData.name,
        type: initialData.type,
        description: initialData.description,
        features: initialData.features,
        original_amount: initialData.original_amount,
        payable_amount: initialData.payable_amount,
        pay_online: initialData.pay_online,
        is_paused_allowed: initialData.is_paused_allowed || false,
        max_allowed_pause_days: initialData.max_allowed_pause_days || 0
      });
    } else {
      // Set society_id for new plans
      setFormData(prev => ({
        ...prev,
        society_id: selectedSocietyId || ''
      }));
    }
  }, [initialData, selectedSocietyId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'original_amount' || name === 'payable_amount') {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else if (name === 'pay_online') {
      setFormData(prev => ({ ...prev, [name]: parseInt(value) as 0 | 1 }));
    } else if (name === 'is_paused_allowed') {
      const isPauseAllowed = value === 'true';
      setFormData(prev => ({ 
        ...prev, 
        [name]: isPauseAllowed,
        // Reset pause days if pause is disabled
        max_allowed_pause_days: isPauseAllowed ? prev.max_allowed_pause_days : 0
      }));
    } else if (name === 'max_allowed_pause_days') {
      setFormData(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFeaturesChange = (features: typeof formData.features) => {
    setFormData(prev => ({ ...prev, features }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.society_id) {
      setError('Society is required');
      return;
    }

    if (!formData.name.trim()) {
      setError('Plan name is required');
      return;
    }

    if (!formData.description.trim()) {
      setError('Plan description is required');
      return;
    }

    if (Object.keys(formData.features).length === 0) {
      setError('At least one feature is required');
      return;
    }

    if (formData.original_amount <= 0) {
      setError('Original amount must be greater than 0');
      return;
    }

    if (formData.payable_amount <= 0) {
      setError('Payable amount must be greater than 0');
      return;
    }

    if (formData.payable_amount > formData.original_amount) {
      setError('Payable amount cannot be greater than original amount');
      return;
    }

    try {
      await onSubmit(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while saving the subscription plan');
    }
  };

  const discountPercentage = formData.original_amount > 0 
    ? Math.round(((formData.original_amount - formData.payable_amount) / formData.original_amount) * 100)
    : 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {initialData ? 'Edit Subscription Plan' : 'Create New Subscription Plan'}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {initialData ? 'Update subscription plan details' : 'Create a new subscription plan for your society'}
            </p>
          </div>
          <button
            onClick={onCancel}
            className="flex items-center text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Plans
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

        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
            <Tag className="h-5 w-5 mr-2" />
            Basic Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Plan Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="e.g., Premium Quarterly Plan"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Plan Type *
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                {planTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Describe what this subscription plan offers..."
            />
          </div>
        </div>

        {/* Features */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Plan Features
          </h3>
          
          <FeaturesEditor
            features={formData.features}
            onChange={handleFeaturesChange}
            disabled={isLoading}
          />
        </div>

        {/* Pricing */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
            <IndianRupee className="h-5 w-5 mr-2" />
            Pricing Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Original Amount (₹) *
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 dark:text-gray-400 text-sm">₹</span>
                </div>
                <input
                  type="number"
                  name="original_amount"
                  value={formData.original_amount}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="pl-8 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Payable Amount (₹) *
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 dark:text-gray-400 text-sm">₹</span>
                </div>
                <input
                  type="number"
                  name="payable_amount"
                  value={formData.payable_amount}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="pl-8 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Discount Display */}
          {discountPercentage > 0 && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                    <span className="text-green-600 dark:text-green-400 font-bold text-sm">%</span>
                  </div>
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-green-800 dark:text-green-200">
                    Discount Applied: {discountPercentage}% OFF
                  </h4>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    Customers save ₹{(formData.original_amount - formData.payable_amount).toFixed(2)} with this plan
                  </p>
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Payment Method *
            </label>
            <select
              name="pay_online"
              value={formData.pay_online}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value={1}>Online Payment</option>
              <option value={0}>Offline Payment</option>
            </select>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Choose whether customers can pay online or need to pay offline
            </p>
          </div>
        </div>

        {/* Pause Settings */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
            <Pause className="h-5 w-5 mr-2" />
            Pause Settings
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Allow Pause *
              </label>
              <select
                name="is_paused_allowed"
                value={formData.is_paused_allowed ? 'true' : 'false'}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="false">No - Pause Not Allowed</option>
                <option value="true">Yes - Pause Allowed</option>
              </select>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Whether subscribers can pause their subscription
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Max Pause Days *
              </label>
              <input
                type="number"
                name="max_allowed_pause_days"
                value={formData.max_allowed_pause_days || 0}
                onChange={handleChange}
                required
                min="0"
                max="365"
                disabled={!formData.is_paused_allowed}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Maximum days a subscription can be paused (0 if pause not allowed)
              </p>
            </div>
          </div>

          {/* Pause Settings Preview */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white flex items-center mb-2">
              <Clock className="h-4 w-4 mr-2" />
              Pause Policy Preview
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center">
                <div className={`w-4 h-4 rounded-full mr-2 ${
                  formData.is_paused_allowed ? 'bg-green-500' : 'bg-red-500'
                }`}></div>
                <span className="text-gray-700 dark:text-gray-300">
                  Pause Status: {formData.is_paused_allowed ? 'Allowed' : 'Not Allowed'}
                </span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2 text-gray-400" />
                <span className="text-gray-700 dark:text-gray-300">
                  Max Days: {formData.max_allowed_pause_days} {formData.max_allowed_pause_days === 1 ? 'day' : 'days'}
                </span>
              </div>
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
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 disabled:cursor-not-allowed flex items-center"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                {initialData ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              <>
                <Tag className="h-4 w-4 mr-2" />
                {initialData ? 'Update Plan' : 'Create Plan'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SubscriptionPlanForm;