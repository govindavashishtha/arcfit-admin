import React, { useState } from 'react';
import { useMarketingQuery, useDeleteMarketingMutation } from '../hooks/queries/useMarketingQueries';
import { useCenter } from '../contexts/CenterContext';
import { Megaphone, Calendar, AlertCircle, Plus, Trash2 } from 'lucide-react';
import { formatDateToIST } from '../utils/dateUtils';
import CreateMarketingModal from '../components/marketing/CreateMarketingModal';
import ConfirmationModal from '../components/ui/ConfirmationModal';
import toast from 'react-hot-toast';

const MarketingPage: React.FC = () => {
  const { selectedCenterId } = useCenter();
  const { data: marketingContent, isLoading, error } = useMarketingQuery(selectedCenterId);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [deleteContentId, setDeleteContentId] = useState<string | null>(null);
  const deleteMutation = useDeleteMarketingMutation();

  const handleDelete = async () => {
    if (!deleteContentId) return;

    try {
      await deleteMutation.mutateAsync(deleteContentId);
      toast.success('Marketing content deleted successfully!');
      setDeleteContentId(null);
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to delete marketing content');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Failed to load marketing content</p>
        </div>
      </div>
    );
  }

  if (!selectedCenterId) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Please select a society to view marketing content</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
            <Megaphone className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Marketing Content</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Promotional materials and campaigns
            </p>
          </div>
        </div>
        {selectedCenterId && (
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span>Create Content</span>
          </button>
        )}
      </div>

      {!marketingContent || marketingContent.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-12">
          <div className="text-center">
            <Megaphone className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Marketing Content</h3>
            <p className="text-gray-500 dark:text-gray-400">
              No marketing content available for this society yet.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {marketingContent.map((content) => (
            <div
              key={content.id}
              className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer h-80"
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-110"
                style={{ backgroundImage: `url(${content.bg_image})` }}
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

              <div className="absolute top-4 right-4 flex items-center space-x-2 z-20">
                {content.markdown && (
                  <div className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                    Details
                  </div>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeleteContentId(content.id);
                  }}
                  className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors opacity-0 group-hover:opacity-100 shadow-lg"
                  title="Delete content"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="absolute inset-0 p-6 flex flex-col justify-end pointer-events-none z-10">
                <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">
                  {content.title}
                </h3>

                <p className="text-gray-200 text-sm mb-4 line-clamp-2">
                  {content.description}
                </p>

                <div className="flex items-center text-xs text-gray-300">
                  <Calendar className="h-3 w-3 mr-1" />
                  {formatDateToIST(content.created_at)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedCenterId && (
        <CreateMarketingModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          centerId={selectedCenterId}
        />
      )}

      <ConfirmationModal
        open={!!deleteContentId}
        onClose={() => setDeleteContentId(null)}
        onConfirm={handleDelete}
        title="Delete Marketing Content"
        message="Are you sure you want to delete this marketing content? This action cannot be undone."
        confirmText="Delete"
        confirmColor="error"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};

export default MarketingPage;
