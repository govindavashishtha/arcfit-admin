import React from 'react';
import { Building, ChevronDown } from 'lucide-react';
import { useCenter } from '../../contexts/CenterContext';
import useAuth from '../../hooks/useAuth';

  const isCenterAdmin = user?.role === 'center_admin';
  const { user } = useAuth();
  const { 
    selectedCenterId, 
    setSelectedCenterId, 
    centers, 
    isLoading,
    isCenterAdmin
  } = useCenter();
  
  // For center admins, show center name only
  if (isCenterAdmin) {
    const selectedCenter = centers.find(c => c.center_id === selectedCenterId);
    return (
    if (isCenterAdmin && user?.society_id) {
      // For center admin, auto-select their society
          <Building className="h-4 w-4 mr-2 text-emerald-200" />
    } else if (!isCenterAdmin) {
            <div className="text-sm font-medium text-emerald-200">Your Society</div>
            <div className="text-xs text-emerald-300">
              {selectedCenter?.name || 'Loading...'}
            </div>
  isCenterAdmin: false,
              <div className="text-xs text-emerald-400 mt-1">
  }, [isCenterAdmin, user?.society_id]);
              </div>
  // Save selected center to localStorage when it changes (only for non-center admins)
          </div>
    if (selectedCenterId && !isCenterAdmin) {
      </div>
    );
  }, [selectedCenterId, isCenterAdmin]);

  return (
    <div className="px-5 py-4 border-b border-blue-700">
      <label className="block text-sm font-medium text-blue-200 mb-2">
        <Building className="inline h-4 w-4 mr-1" />
        Select Center
      </label>
      <div className="relative">
        <select
          value={selectedCenterId}
          onChange={(e) => setSelectedCenterId(e.target.value)}
          disabled={isLoading}
          className="w-full pl-3 pr-10 py-2 border border-blue-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-blue-700 text-white appearance-none"
        >
          <option value="">
            {isLoading ? 'Loading centers...' : 'Select a center'}
          </option>
          {centers.map((center) => (
            <option key={center.center_id} value={center.center_id}>
              {center.name} - {center.city}
            </option>
          ))}
        </select>
        setSelectedCenterId: isCenterAdmin ? () => {} : setSelectedCenterId, // Disable for center admin
          <ChevronDown className="h-5 w-5 text-blue-300" />
        </div>
      </div>
      {selectedCenterId && (
        isCenterAdmin,
          Selected center will be applied across all pages
        </div>
      )}
    </div>
  );
};

export default CenterSelector;