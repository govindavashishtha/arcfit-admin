import React, { useMemo } from 'react';
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
import { Member } from '../../types/member';
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Edit2,
  Trash2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Award,
  Star
} from 'lucide-react';

interface MembersTableProps {
  data: Member[];
  isLoading: boolean;
  onEdit?: (member: Member) => void;
  onDelete?: (memberId: string) => void;
}

const columnHelper = createColumnHelper<Member>();

const MembersTable: React.FC<MembersTableProps> = ({
  data,
  isLoading,
  onEdit,
  onDelete
}) => {
  const columns = useMemo<ColumnDef<Member, any>[]>(() => [
    columnHelper.accessor('first_name', {
      id: 'name',
      header: 'Member',
      cell: ({ row }) => (
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
            <span className="font-medium text-white text-sm">
              {row.original.first_name.charAt(0)}{row.original.last_name.charAt(0)}
            </span>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              {row.original.salutation} {row.original.first_name} {row.original.last_name}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              ID: {row.original.id}
            </div>
          </div>
        </div>
      ),
    }),
    columnHelper.accessor('email', {
      header: 'Contact',
      cell: ({ row }) => (
        <div className="space-y-1">
          <div className="flex items-center text-sm text-gray-900 dark:text-white">
            <Mail className="h-3 w-3 mr-1 text-gray-400" />
            {row.original.email}
          </div>
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <Phone className="h-3 w-3 mr-1 text-gray-400" />
            {row.original.phone_number}
          </div>
        </div>
      ),
    }),
    columnHelper.accessor('address', {
      header: 'Location',
      cell: ({ row }) => (
        <div className="space-y-1">
          <div className="flex items-center text-sm text-gray-900 dark:text-white">
            <MapPin className="h-3 w-3 mr-1 text-gray-400" />
            {row.original.city}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-32">
            {row.original.address}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {row.original.pincode}
          </div>
        </div>
      ),
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: ({ getValue }) => {
        const status = getValue();
        const statusColors = {
          active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
          inactive: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
          pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
        };
        return (
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[status as keyof typeof statusColors]}`}>
            {status}
          </span>
        );
      },
    }),
    columnHelper.accessor('verification_status', {
      header: 'Verification',
      cell: ({ getValue }) => {
        const status = getValue();
        const statusColors = {
          verified: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
          pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
          rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
        };
        return (
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[status as keyof typeof statusColors]}`}>
            {status}
          </span>
        );
      },
    }),
    columnHelper.accessor('gender', {
      header: 'Gender',
      cell: ({ getValue }) => (
        <span className="text-sm text-gray-900 dark:text-white capitalize">
          {getValue()}
        </span>
      ),
    }),
    columnHelper.accessor('created_at', {
      header: 'Join Date',
      cell: ({ getValue }) => (
        <div className="flex items-center text-sm text-gray-900 dark:text-white">
          <Calendar className="h-3 w-3 mr-1 text-gray-400" />
          {new Date(getValue()).toLocaleDateString()}
        </div>
      ),
    }),
    columnHelper.display({
      id: 'points',
      header: 'Points',
      cell: ({ row }) => (
        <div className="space-y-1">
          <div className="flex items-center text-xs">
            <Award className="h-3 w-3 mr-1 text-blue-500" />
            <span className="text-gray-600 dark:text-gray-400">Badge: {row.original.badge_score}</span>
          </div>
          <div className="flex items-center text-xs">
            <Star className="h-3 w-3 mr-1 text-yellow-500" />
            <span className="text-gray-600 dark:text-gray-400">Reward: {row.original.reward_points}</span>
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Y:{row.original.yoga_points} | D:{row.original.df_points} | P:{row.original.pilates_points}
          </div>
        </div>
      ),
    }),
    // Commented out Actions column
    /*
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex space-x-2">
          {onEdit && (
            <button
              onClick={() => onEdit(row.original)}
              className="p-1 text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
              title="Edit member"
            >
              <Edit2 className="h-4 w-4" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(row.original.id.toString())}
              className="p-1 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
              title="Delete member"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      ),
    }),
    */
  ], [onEdit, onDelete]);

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
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-500 dark:text-gray-400">Loading members...</p>
        </div>
      </div>
    );
  }

  return (
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
  );
};

export default MembersTable;