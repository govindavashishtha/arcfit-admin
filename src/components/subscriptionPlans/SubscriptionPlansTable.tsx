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
import { SubscriptionPlan } from '../../types/subscriptionPlan';
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Calendar,
  IndianRupee,
  Tag,
  Star,
  Globe,
  CheckCircle,
  Edit2,
  Trash2,
  Pause,
  Clock
} from 'lucide-react';
import { formatDateToIST } from '../../utils/dateUtils';

interface SubscriptionPlansTableProps {
  data: SubscriptionPlan[];
  isLoading: boolean;
  onEdit?: (plan: SubscriptionPlan) => void;
  onDelete?: (planId: string) => void;
}

const columnHelper = createColumnHelper<SubscriptionPlan>();

const SubscriptionPlansTable: React.FC<SubscriptionPlansTableProps> = ({
  data,
  isLoading,
  onEdit,
  onDelete
}) => {
  const columns = useMemo<ColumnDef<SubscriptionPlan, any>[]>(() => [
    columnHelper.accessor('name', {
      header: 'Plan Name',
      cell: ({ row }) => (
        <div className="space-y-1">
          <div className="text-sm font-medium text-gray-900 dark:text-white">
            {row.original.name}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            ID: {row.original.id.slice(0, 8)}...
          </div>
        </div>
      ),
    }),
    columnHelper.accessor('type', {
      header: 'Plan Type',
      cell: ({ getValue }) => {
        const type = getValue();
        const typeLabels = {
          '1D': '1 Day',
          '15D': '15 Days',
          '1M': '1 Month',
          '3M': '3 Months',
          '6M': '6 Months',
          '12M': '12 Months',
        };
        const typeColors = {
          '1D': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
          '15D': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
          '1M': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
          '3M': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
          '6M': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
          '12M': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
        };
        return (
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${typeColors[type]}`}>
            {typeLabels[type]}
          </span>
        );
      },
    }),
    columnHelper.accessor('description', {
      header: 'Description',
      cell: ({ getValue }) => (
        <div className="max-w-xs">
          <p className="text-sm text-gray-900 dark:text-white truncate" title={getValue()}>
            {getValue()}
          </p>
        </div>
      ),
    }),
    columnHelper.accessor('features', {
      header: 'Features',
      cell: ({ getValue }) => {
        const features = getValue();
        const featureEntries = Object.entries(features);
        return (
          <div className="space-y-1">
            {featureEntries.slice(0, 2).map(([key, value], index) => (
              <div key={key} className="flex items-center text-xs text-gray-600 dark:text-gray-400">
                <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                <span className="truncate max-w-32" title={value}>
                  {value}
                </span>
              </div>
            ))}
            {featureEntries.length > 2 && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                +{featureEntries.length - 2} more features
              </span>
            )}
          </div>
        );
      },
    }),
    columnHelper.accessor('original_amount', {
      header: 'Pricing',
      cell: ({ row }) => (
        <div className="space-y-1">
          <div className="flex items-center text-sm text-gray-900 dark:text-white">
            <IndianRupee className="h-3 w-3 mr-1 text-gray-400" />
            <span className="font-medium">₹{row.original.payable_amount}</span>
          </div>
          {row.original.original_amount !== row.original.payable_amount && (
            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
              <span className="line-through">₹{row.original.original_amount}</span>
              <span className="ml-1 text-green-600 dark:text-green-400 font-medium">
                Save ₹{(row.original.original_amount - row.original.payable_amount).toFixed(2)}
              </span>
            </div>
          )}
          <div className="flex items-center text-xs">
            <Globe className="h-3 w-3 mr-1 text-gray-400" />
            <span className={`${
              row.original.pay_online === 1 
                ? 'text-green-600 dark:text-green-400' 
                : 'text-red-600 dark:text-red-400'
            }`}>
              {row.original.pay_online === 1 ? 'Online Payment' : 'Offline Payment'}
            </span>
          </div>
        </div>
      ),
    }),
    columnHelper.accessor('created_at', {
      header: 'Created',
      cell: ({ getValue }) => (
        <div className="space-y-1">
          <div className="flex items-center text-sm text-gray-900 dark:text-white">
            <Calendar className="h-3 w-3 mr-1 text-gray-400" />
            {formatDateToIST(getValue())}
          </div>
          <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">
            IST
          </div>
        </div>
      ),
    }),
    // Actions column
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex space-x-2">
          {onEdit && (
            <button
              onClick={() => onEdit(row.original)}
              className="p-2 text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
              title="Edit subscription plan"
            >
              <Edit2 className="h-4 w-4" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(row.original.id)}
              className="p-2 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              title="Delete subscription plan"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      ),
    }),
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
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-gray-500 dark:text-gray-400">Loading subscription plans...</p>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="p-8 text-center">
          <Tag className="h-12 w-12 text-gray-400 mx-auto" />
          <p className="mt-4 text-gray-500 dark:text-gray-400">No subscription plans found for this society.</p>
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

export default SubscriptionPlansTable;