import React, { useState } from 'react';
import { Building, MapPin, Phone, Search, Plus, Edit2 } from 'lucide-react';
import { Society } from '../types/society';
import { 
  useSocietiesQuery, 
  useCreateSocietyMutation, 
  useUpdateSocietyMutation 
} from '../hooks/queries/useSocietyQueries';
import SocietyForm from '../components/society/SocietyForm';
import { formatTimeToIST } from '../utils/dateUtils';

const SocietyPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedSociety, setSelectedSociety] = useState<Society | null>(null);

  // TanStack Query hooks
  const { 
    data: societies = [], 
    isLoading, 
    error,
    refetch 
  } = useSocietiesQuery();
  
  const createSocietyMutation = useCreateSocietyMutation();
  const updateSocietyMutation = useUpdateSocietyMutation();

  const handleCreateSociety = async (data: any) => {
    try {
      await createSocietyMutation.mutateAsync(data);
      setShowForm(false);
    } catch (error) {
      console.error('Failed to create society:', error);
    }
  };

  const handleUpdateSociety = async (data: any) => {
    if (!selectedSociety) return;

    try {
      await updateSocietyMutation.mutateAsync({
        society_id: selectedSociety.society_id,
        ...data
      });
      setShowForm(false);
      setSelectedSociety(null);
    } catch (error) {
      console.error('Failed to update society:', error);
    }
  };

  const filteredSocieties = societies.filter(society => 
    society.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    society.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
    society.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isFormLoading = createSocietyMutation.isPending || updateSocietyMutation.isPending;

  if (showForm) {
    return (
      <div className="max-w-4xl mx-auto py-6">
        <h2 className="text-2xl font-bold mb-6">
          {selectedSociety ? 'Edit Society' : 'Add New Society'}
        </h2>
        <SocietyForm
          initialData={selectedSociety || undefined}
          onSubmit={selectedSociety ? handleUpdateSociety : handleCreateSociety}
          onCancel={() => {
            setShowForm(false);
            setSelectedSociety(null);
          }}
          isLoading={isFormLoading}
        />
      </div>
    );
  }

  return (
    <div className="animate-fadeIn">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Society Facilities</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Manage and monitor your society fitness facilities
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add New Facility
          </button>
        </div>
      </div>

      <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search facilities by name, location or contact person..."
            className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                {error instanceof Error ? error.message : 'Failed to load societies'}
              </p>
              <button 
                onClick={() => refetch()}
                className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {isLoading ? (
          <div className="col-span-2 flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredSocieties.length > 0 ? (
          filteredSocieties.map((society) => (
            <div key={society.society_id} className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full mr-4">
                      <Building className="h-6 w-6 text-blue-600 dark:text-blue-300" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{society.name}</h3>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <MapPin className="h-4 w-4 mr-1" />
                        {society.address}
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setSelectedSociety(society);
                        setShowForm(true);
                      }}
                      className="p-2 text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      <Edit2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                    <div className="text-sm text-gray-500 dark:text-gray-400">Contact Person</div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {society.meta_data?.contact_person || 'N/A'}
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                    <div className="text-sm text-gray-500 dark:text-gray-400">Phone</div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white flex items-center">
                      <Phone className="h-3.5 w-3.5 mr-1" />
                      {society.meta_data?.phone || 'N/A'}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Facilities</div>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {society?.facilities?.map((facility, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full"
                        >
                          {facility}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Event Types</div>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {society?.event_types?.map((event, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full"
                        >
                          {event}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="px-6 py-3 bg-gray-50 dark:bg-gray-700 flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Morning Hours</div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {formatTimeToIST(society.morning_start_time)} - {formatTimeToIST(society.morning_end_time)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Evening Hours</div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {formatTimeToIST(society.evening_start_time)} - {formatTimeToIST(society.evening_end_time)}
                    </div>
                  </div>
                </div>
                <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                  IST
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
            <p className="text-gray-500 dark:text-gray-400">No facilities found matching your search criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SocietyPage;