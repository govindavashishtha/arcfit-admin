import React, { useState, useEffect, useMemo } from 'react';
import { Event } from '../../types/event';
import { X, Calendar, Clock, Users, MapPin, Search } from 'lucide-react';
import { useUpdateEventMutation } from '../../hooks/queries/useEventQueries';
import { useTrainersQuery } from '../../hooks/queries/useTrainerQueries';
import { useCenter } from '../../contexts/CenterContext';
import toast from 'react-hot-toast';

interface EditEventModalProps {
  event: Event | null;
  isOpen: boolean;
  onClose: () => void;
}

const EditEventModal: React.FC<EditEventModalProps> = ({ event, isOpen, onClose }) => {
  const updateEventMutation = useUpdateEventMutation();
  const { selectedCenterId } = useCenter();

  const { data: trainersData, isLoading: trainersLoading } = useTrainersQuery({
    center_id: selectedCenterId || undefined,
    status: 'active',
    limit: 100
  });

  const [formData, setFormData] = useState({
    type: '',
    trainer_id: '',
    meta_data: {
      name: '',
      level: '',
      description: '',
      muscleGroups: [] as string[],
      averageCaloriesBurned: 0,
    }
  });

  const [muscleGroupInput, setMuscleGroupInput] = useState('');
  const [trainerSearchQuery, setTrainerSearchQuery] = useState('');
  const [showTrainerDropdown, setShowTrainerDropdown] = useState(false);

  const filteredTrainers = useMemo(() => {
    if (!trainersData?.data) return [];

    if (!trainerSearchQuery) return trainersData.data;

    const query = trainerSearchQuery.toLowerCase();
    return trainersData.data.filter(trainer =>
      `${trainer.first_name} ${trainer.last_name}`.toLowerCase().includes(query) ||
      trainer.email.toLowerCase().includes(query)
    );
  }, [trainersData, trainerSearchQuery]);

  useEffect(() => {
    if (event) {
      setFormData({
        type: event.type,
        trainer_id: event.trainer_id,
        meta_data: {
          name: event.meta_data?.name || '',
          level: event.meta_data?.level || '',
          description: event.meta_data?.description || '',
          muscleGroups: event.meta_data?.muscleGroups || [],
          averageCaloriesBurned: event.meta_data?.averageCaloriesBurned || 0,
        }
      });

      const currentTrainer = trainersData?.data.find(t => t.user_id === event.trainer_id);
      if (currentTrainer) {
        setTrainerSearchQuery(`${currentTrainer.first_name} ${currentTrainer.last_name}`);
      }
    }
  }, [event, trainersData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!event) return;

    try {
      const updateData = {
        type: formData.type,
        trainer_id: formData.trainer_id,
        meta_data: formData.meta_data
      };

      await updateEventMutation.mutateAsync({
        eventId: event.event_id,
        eventData: updateData
      });

      toast.success('Event updated successfully!');
      onClose();
    } catch (error) {
      console.error('Failed to update event:', error);
      toast.error('Failed to update event. Please try again.');
    }
  };

  const handleAddMuscleGroup = () => {
    if (muscleGroupInput.trim() && !formData.meta_data.muscleGroups.includes(muscleGroupInput.trim())) {
      setFormData(prev => ({
        ...prev,
        meta_data: {
          ...prev.meta_data,
          muscleGroups: [...prev.meta_data.muscleGroups, muscleGroupInput.trim()]
        }
      }));
      setMuscleGroupInput('');
    }
  };

  const handleRemoveMuscleGroup = (group: string) => {
    setFormData(prev => ({
      ...prev,
      meta_data: {
        ...prev.meta_data,
        muscleGroups: prev.meta_data.muscleGroups.filter(g => g !== group)
      }
    }));
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.trainer-dropdown-container')) {
        setShowTrainerDropdown(false);
      }
    };

    if (showTrainerDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showTrainerDropdown]);

  if (!isOpen || !event) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose}></div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                Edit Event
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Event Name
                  </label>
                  <input
                    type="text"
                    value={formData.meta_data.name}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      meta_data: { ...prev.meta_data, name: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Event Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    required
                  >
                    <option value="yoga">Yoga</option>
                    <option value="dance">Dance</option>
                    <option value="pilates">Pilates</option>
                    <option value="aerobics">Aerobics</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Trainer
                </label>
                <div className="relative trainer-dropdown-container">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      value={trainerSearchQuery}
                      onChange={(e) => {
                        setTrainerSearchQuery(e.target.value);
                        setShowTrainerDropdown(true);
                      }}
                      onFocus={() => setShowTrainerDropdown(true)}
                      placeholder="Search trainer..."
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      required={!formData.trainer_id}
                    />
                  </div>

                  {showTrainerDropdown && (
                    <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-auto">
                      {trainersLoading ? (
                        <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                          Loading trainers...
                        </div>
                      ) : filteredTrainers.length === 0 ? (
                        <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                          No trainers found
                        </div>
                      ) : (
                        filteredTrainers.map((trainer) => (
                          <button
                            key={trainer.user_id}
                            type="button"
                            onClick={() => {
                              setFormData(prev => ({ ...prev, trainer_id: trainer.user_id }));
                              setTrainerSearchQuery(`${trainer.first_name} ${trainer.last_name}`);
                              setShowTrainerDropdown(false);
                            }}
                            className={`w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 ${
                              formData.trainer_id === trainer.user_id
                                ? 'bg-blue-50 dark:bg-blue-900/20'
                                : ''
                            }`}
                          >
                            <div className="flex items-center space-x-3">
                              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gradient-to-r from-green-500 to-blue-600 flex items-center justify-center">
                                <span className="font-medium text-white text-xs">
                                  {trainer.first_name.charAt(0)}{trainer.last_name.charAt(0)}
                                </span>
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                  {trainer.first_name} {trainer.last_name}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  {trainer.email}
                                </div>
                              </div>
                            </div>
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Level
                </label>
                <select
                  value={formData.meta_data.level}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    meta_data: { ...prev.meta_data, level: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  required
                >
                  <option value="">Select Level</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.meta_data.description}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    meta_data: { ...prev.meta_data, description: e.target.value }
                  }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Average Calories Burned
                </label>
                <input
                  type="number"
                  value={formData.meta_data.averageCaloriesBurned}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    meta_data: { ...prev.meta_data, averageCaloriesBurned: parseInt(e.target.value) || 0 }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Muscle Groups
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={muscleGroupInput}
                    onChange={(e) => setMuscleGroupInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddMuscleGroup())}
                    placeholder="Add muscle group"
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={handleAddMuscleGroup}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.meta_data.muscleGroups.map((group, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                    >
                      {group}
                      <button
                        type="button"
                        onClick={() => handleRemoveMuscleGroup(group)}
                        className="ml-2 text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-100"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                  disabled={updateEventMutation.isPending}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={updateEventMutation.isPending}
                >
                  {updateEventMutation.isPending ? 'Updating...' : 'Update Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditEventModal;
