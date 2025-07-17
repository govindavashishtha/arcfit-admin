import React, { useState } from 'react';
import { Plus, X, Edit3 } from 'lucide-react';
import { SubscriptionPlanFeatures } from '../../types/subscriptionPlan';

interface FeaturesEditorProps {
  features: SubscriptionPlanFeatures;
  onChange: (features: SubscriptionPlanFeatures) => void;
  disabled?: boolean;
}

const FeaturesEditor: React.FC<FeaturesEditorProps> = ({
  features,
  onChange,
  disabled = false
}) => {
  const [newFeatureKey, setNewFeatureKey] = useState('');
  const [newFeatureValue, setNewFeatureValue] = useState('');
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState('');

  const handleAddFeature = () => {
    if (!newFeatureKey.trim() || !newFeatureValue.trim()) {
      return;
    }

    // Check if key already exists
    if (features[newFeatureKey]) {
      alert('Feature key already exists. Please use a different key.');
      return;
    }

    const updatedFeatures = {
      ...features,
      [newFeatureKey.trim()]: newFeatureValue.trim()
    };

    onChange(updatedFeatures);
    setNewFeatureKey('');
    setNewFeatureValue('');
  };

  const handleRemoveFeature = (key: string) => {
    const updatedFeatures = { ...features };
    delete updatedFeatures[key];
    onChange(updatedFeatures);
  };

  const handleEditFeature = (key: string) => {
    setEditingKey(key);
    setEditingValue(features[key]);
  };

  const handleSaveEdit = () => {
    if (!editingKey || !editingValue.trim()) {
      return;
    }

    const updatedFeatures = {
      ...features,
      [editingKey]: editingValue.trim()
    };

    onChange(updatedFeatures);
    setEditingKey(null);
    setEditingValue('');
  };

  const handleCancelEdit = () => {
    setEditingKey(null);
    setEditingValue('');
  };

  const featureEntries = Object.entries(features);

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Plan Features *
      </label>

      {/* Existing Features */}
      <div className="space-y-3">
        {featureEntries.map(([key, value]) => (
          <div
            key={key}
            className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
          >
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Feature Key
                </label>
                <div className="px-3 py-2 bg-gray-100 dark:bg-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-300">
                  {key}
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Feature Value
                </label>
                {editingKey === key ? (
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={editingValue}
                      onChange={(e) => setEditingValue(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="Enter feature value"
                      disabled={disabled}
                    />
                    <button
                      type="button"
                      onClick={handleSaveEdit}
                      disabled={disabled}
                      className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      disabled={disabled}
                      className="px-3 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-300">
                    {value}
                  </div>
                )}
              </div>
            </div>
            
            {!disabled && editingKey !== key && (
              <div className="flex space-x-1">
                <button
                  type="button"
                  onClick={() => handleEditFeature(key)}
                  className="p-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                  title="Edit feature"
                >
                  <Edit3 className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleRemoveFeature(key)}
                  className="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  title="Remove feature"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add New Feature */}
      {!disabled && (
        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4">
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Feature Key
                </label>
                <input
                  type="text"
                  value={newFeatureKey}
                  onChange={(e) => setNewFeatureKey(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="e.g., feature1, premium_access"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Feature Value
                </label>
                <input
                  type="text"
                  value={newFeatureValue}
                  onChange={(e) => setNewFeatureValue(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="e.g., Access to all premium content"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddFeature()}
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleAddFeature}
                disabled={!newFeatureKey.trim() || !newFeatureValue.trim()}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Feature
              </button>
            </div>
          </div>
        </div>
      )}

      {featureEntries.length === 0 && (
        <div className="text-center py-6 text-gray-500 dark:text-gray-400">
          <Edit3 className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No features added yet. Add your first feature above.</p>
        </div>
      )}
    </div>
  );
};

export default FeaturesEditor;