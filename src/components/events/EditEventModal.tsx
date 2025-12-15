import React, { useState, useEffect } from 'react';
import { Event } from '../../types/event';
import { X, Calendar, Clock, Users, MapPin } from 'lucide-react';
import { useUpdateEventMutation } from '../../hooks/queries/useEventQueries';
import toast from 'react-hot-toast';

interface EditEventModalProps {
  event: Event | null;
  isOpen: boolean;
  onClose: () => void;
}

const EditEventModal: React.FC<EditEventModalProps> = ({ event, isOpen, onClose }) => {
  const updateEventMutation = useUpdateEventMutation();

  const [formData, setFormData] = useState({
    date: '',
    start_time: '',
    end_time: '',
    max_slots: 0,
    type: '',
    meta_data: {
      name: '',
      level: '',
      description: '',
      muscleGroups: [] as string[],
      averageCaloriesBurned: 0,
    }
  });

  const [muscleGroupInput, setMuscleGroupInput] = useState('');

  useEffect(() => {
    if (event) {
      const startDate = new Date(event.start_time);
      const endDate = new Date(event.end_time);

      const formatDateForInput = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };

      const formatTimeForInput = (date: Date) => {
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${hours}:${minutes}`;
      };

      setFormData({
        date: formatDateForInput(startDate),
        start_time: formatTimeForInput(startDate),
        end_time: formatTimeForInput(endDate),
        max_slots: event.max_slots,
        type: event.type,
        meta_data: {
          name: event.meta_data?.name || '',
          level: event.meta_data?.level || '',
          description: event.meta_data?.description || '',
          muscleGroups: event.meta_data?.muscleGroups || [],
          averageCaloriesBurned: event.meta_data?.averageCaloriesBurned || 0,
        }
      });
    }
  }, [event]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!event) return;

    try {
      const dateObj = new Date(formData.date);
      const [startHours, startMinutes] = formData.start_time.split(':');
      const [endHours, endMinutes] = formData.end_time.split(':');

      const startDateTime = new Date(dateObj);
      startDateTime.setHours(parseInt(startHours), parseInt(startMinutes), 0, 0);

      const endDateTime = new Date(dateObj);
      endDateTime.setHours(parseInt(endHours), parseInt(endMinutes), 0, 0);

      const updateData = {
        date: formData.date,
        start_time: startDateTime.toISOString(),
        end_time: endDateTime.toISOString(),
        max_slots: formData.max_slots,
        type: formData.type,
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
                    <option value="fitness">Fitness</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    Max Slots
                  </label>
                  <input
                    type="number"
                    value={formData.max_slots}
                    onChange={(e) => setFormData(prev => ({ ...prev, max_slots: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    min="1"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={formData.start_time}
                    onChange={(e) => setFormData(prev => ({ ...prev, start_time: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    End Time
                  </label>
                  <input
                    type="time"
                    value={formData.end_time}
                    onChange={(e) => setFormData(prev => ({ ...prev, end_time: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>
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
