import React, { useMemo, useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
  ColumnDef,
} from '@tanstack/react-table';
import { Event } from '../../types/event';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Calendar,
  Clock,
  Users,
  Activity,
  MapPin,
  User,
  Tag,
  Dumbbell,
  Star,
  X,
  AlertTriangle,
  Edit2
} from 'lucide-react';
import { useCancelEventMutation } from '../../hooks/queries/useEventQueries';
import toast from 'react-hot-toast';
import ConfirmationModal from '../ui/ConfirmationModal';
import { formatDateToIST, formatTimeToIST, formatDateTimeToIST } from '../../utils/dateUtils';

interface EventsTableProps {
  data: Event[];
  isLoading: boolean;
  onEdit?: (event: Event) => void;
}

const columnHelper = createColumnHelper<Event>();

const EventsTable: React.FC<EventsTableProps> = ({
  data,
  isLoading,
  onEdit
}) => {
  const cancelEventMutation = useCancelEventMutation();
  const [eventToCancel, setEventToCancel] = useState<Event | null>(null);

  const handleCancelEvent = (event: Event) => {
    setEventToCancel(event);
  };

  const handleConfirmCancel = async () => {
    if (!eventToCancel) return;

    try {
      await cancelEventMutation.mutateAsync(eventToCancel.event_id);
      toast.success('Event cancelled successfully!');
      setEventToCancel(null);
    } catch (error) {
      console.error('Failed to cancel event:', error);
      toast.error('Failed to cancel event. Please try again.');
    }
  };

  const handleCloseModal = () => {
    setEventToCancel(null);
  };

  const columns = useMemo<ColumnDef<Event, any>[]>(() => [
    columnHelper.accessor('meta_data.name', {
      id: 'name',
      header: 'Event',
      cell: ({ row }) => {
        const eventName = row.original.meta_data?.name || 'Unnamed Event';
        const eventType = row.original.type;
        const eventLevel = row.original.meta_data?.level || 'N/A';
        
        return (
          <div className="flex flex-col space-y-1">
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              {eventName}
            </div>
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                eventType === 'yoga' 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                  : eventType === 'dance'
                  ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                  : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
              }`}>
                {eventType.charAt(0).toUpperCase() + eventType.slice(1)}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Level: {eventLevel.charAt(0).toUpperCase() + eventLevel.slice(1)}
              </span>
            </div>
          </div>
        );
      },
    }),
    columnHelper.accessor('society.name', {
      header: 'Center',
      cell: ({ row }) => (
        <div className="flex items-center space-x-1">
          <MapPin className="h-3 w-3 text-gray-400" />
          <span className="text-sm text-gray-900 dark:text-white">
            {row.original.center.name}
          </span>
        </div>
      ),
    }),
    columnHelper.accessor('trainer', {
      header: 'Trainer',
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gradient-to-r from-green-500 to-blue-600 flex items-center justify-center">
            <span className="font-medium text-white text-xs">
              {row.original.trainer.first_name.charAt(0)}{row.original.trainer.last_name.charAt(0)}
            </span>
          </div>
          <div className="text-sm text-gray-900 dark:text-white">
            {row.original.trainer.first_name} {row.original.trainer.last_name}
          </div>
        </div>
      ),
    }),
    columnHelper.accessor('date', {
      header: 'Date & Time',
      cell: ({ row }) => {
        // Format date to IST but use start_time and end_time directly as they're already in IST
        // Format date with day name as dd/MM/yyyy AA
        const dateObj = new Date(row.original.date);
        const day = dateObj.toLocaleDateString('en-IN', { weekday: 'short' }); // AA (Mon, Tue, etc.)
        const formattedDate = dateObj.toLocaleDateString('en-IN', { 
          day: '2-digit', 
          month: '2-digit', 
          year: 'numeric' 
        }); // dd/MM/yyyy
        const date = `${formattedDate} ${day}`;
        
        // Extract time directly from ISO string since it's already in IST
        const startTimeISO = row.original.start_time; // "2025-08-08T06:00:00Z"
        const endTimeISO = row.original.end_time; // "2025-08-08T07:00:00Z"
        
        // Parse time from ISO string directly (T06:00:00Z -> 06:00)
        const startHour = parseInt(startTimeISO.split('T')[1].split(':')[0]);
        const startMinute = parseInt(startTimeISO.split('T')[1].split(':')[1]);
        const endHour = parseInt(endTimeISO.split('T')[1].split(':')[0]);
        const endMinute = parseInt(endTimeISO.split('T')[1].split(':')[1]);
        
        // Format to 12-hour format
        const formatTime = (hour: number, minute: number) => {
          const period = hour >= 12 ? 'PM' : 'AM';
          const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
          const displayMinute = minute.toString().padStart(2, '0');
          return `${displayHour}:${displayMinute} ${period}`;
        };
        
        const startTime = formatTime(startHour, startMinute);
        const endTime = formatTime(endHour, endMinute);
        
        return (
          <div className="space-y-1">
            <div className="flex items-center text-sm text-gray-900 dark:text-white">
              <Calendar className="h-3 w-3 mr-1 text-gray-400" />
              {date}
            </div>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <Clock className="h-3 w-3 mr-1 text-gray-400" />
              {startTime} - {endTime}
            </div>
            <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">
              IST
            </div>
          </div>
        );
      },
    }),
    columnHelper.accessor('max_slots', {
      header: 'Capacity',
      cell: ({ row }) => {
        const maxSlots = row.original.max_slots;
        const remainingSlots = row.original.remaining_slots;
        const filledSlots = maxSlots - remainingSlots;
        const fillPercentage = Math.round((filledSlots / maxSlots) * 100);
        
        return (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500 dark:text-gray-400">
                <Users className="h-3 w-3 inline mr-1" />
                {filledSlots}/{maxSlots}
              </span>
              <span className="text-gray-500 dark:text-gray-400">
                {fillPercentage}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
              <div 
                className={`h-1.5 rounded-full ${
                  fillPercentage > 80 
                    ? 'bg-red-500' 
                    : fillPercentage > 50 
                    ? 'bg-yellow-500' 
                    : 'bg-green-500'
                }`}
                style={{ width: `${fillPercentage}%` }}
              ></div>
            </div>
          </div>
        );
      },
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: ({ getValue }) => {
        const status = getValue();
        const statusColors = {
          scheduled: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
          cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
          completed: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
        };
        return (
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[status as keyof typeof statusColors]}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        );
      },
    }),
    columnHelper.accessor('trainer_attendance_time', {
      header: 'Trainer Attendance',
      cell: ({ getValue }) => {
        const attendanceTime = getValue();
        
        if (!attendanceTime) {
          return (
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <Clock className="h-3 w-3 mr-1 text-gray-400" />
              Not marked
            </div>
          );
        }
        
        // Parse the ISO string and format directly without timezone conversion
        const date = new Date(attendanceTime);
        const formattedDate = date.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        });
        const formattedTime = date.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        });
        
        return (
          <div className="space-y-1">
            <div className="flex items-center text-sm text-gray-900 dark:text-white">
              <Clock className="h-3 w-3 mr-1 text-green-500" />
              {formattedDate}, {formattedTime}
            </div>
          </div>
        );
      },
    }),
    columnHelper.accessor('meta_data.muscleGroups', {
      header: 'Focus Areas',
      cell: ({ getValue }) => {
        const muscleGroups = getValue() || [];
        return (
          <div className="flex flex-wrap gap-1">
            {muscleGroups.slice(0, 3).map((muscle: string, index: number) => (
              <span 
                key={index}
                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200"
              >
                <Dumbbell className="h-2.5 w-2.5 mr-1" />
                {muscle}
              </span>
            ))}
            {muscleGroups.length > 3 && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                +{muscleGroups.length - 3} more
              </span>
            )}
          </div>
        );
      },
    }),
    columnHelper.accessor('meta_data.averageCaloriesBurned', {
      header: 'Calories',
      cell: ({ getValue }) => {
        const calories = getValue() || 0;
        return (
          <div className="flex items-center text-sm text-gray-900 dark:text-white">
            <Activity className="h-3 w-3 mr-1 text-orange-500" />
            {calories} cal
          </div>
        );
      },
    }),
    // Actions column
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const event = row.original;
        const canCancel = event.status === 'scheduled';
        const canEdit = event.status === 'scheduled';

        return (
          <div className="flex space-x-2">
            {canEdit && onEdit && (
              <button
                onClick={() => onEdit(event)}
                className="p-2 text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                title="Edit event"
              >
                <Edit2 className="h-4 w-4" />
              </button>
            )}
            {canCancel && (
              <button
                onClick={() => handleCancelEvent(event)}
                disabled={cancelEventMutation.isPending}
                className="p-2 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                title="Cancel event"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        );
      },
    }),
  ], [cancelEventMutation.isPending, onEdit]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-gray-500 dark:text-gray-400">Loading events...</p>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="p-8 text-center">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto" />
          <p className="mt-4 text-gray-500 dark:text-gray-400">No events found matching your criteria.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th
                      key={header.id}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <div className="flex items-center space-x-1">
                        <span>
                          {header.isPlaceholder
                            ? null
                            : flexRender(header.column.columnDef.header, header.getContext())
                          }
                        </span>
                        {header.column.getCanSort() && (
                          <span className="ml-1">
                            {{
                              asc: <ArrowUp className="h-3 w-3" />,
                              desc: <ArrowDown className="h-3 w-3" />,
                            }[header.column.getIsSorted() as string] ?? <ArrowUpDown className="h-3 w-3 opacity-50" />}
                          </span>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {table.getRowModel().rows.map(row => (
                <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-gray-50 dark:bg-gray-900 px-6 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Showing{' '}
                <span className="font-medium">
                  {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}
                </span>{' '}
                to{' '}
                <span className="font-medium">
                  {Math.min(
                    (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                    table.getFilteredRowModel().rows.length
                  )}
                </span>{' '}
                of{' '}
                <span className="font-medium">{table.getFilteredRowModel().rows.length}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => table.setPageIndex(0)}
                  disabled={!table.getCanPreviousPage()}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronsLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                  className="relative inline-flex items-center px-2 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                </span>
                <button
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                  className="relative inline-flex items-center px-2 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
                <button
                  onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                  disabled={!table.getCanNextPage()}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronsRight className="h-5 w-5" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Confirmation Modal */}
      <ConfirmationModal
        open={!!eventToCancel}
        onClose={handleCloseModal}
        onConfirm={handleConfirmCancel}
        title="Cancel Event"
        message={`Are you sure you want to cancel the event "${eventToCancel?.meta_data?.name || 'Unnamed Event'}"?\n\nThis action cannot be undone and all participants will be notified.`}
        confirmText="Cancel Event"
        cancelText="Keep Event"
        confirmColor="error"
        isLoading={cancelEventMutation.isPending}
        icon={<AlertTriangle size={28} color="#dc2626" />}
      />
    </>
  );
};

export default EventsTable;