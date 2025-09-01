import React, { useState } from 'react';
import { Users, Upload, Download, AlertCircle, CheckCircle, FileText } from 'lucide-react';
import { useUploadBulkMembersMutation } from '../hooks/queries/useBulkMemberQueries';
import { useCenter } from '../contexts/CenterContext';
import BulkMemberUploadForm from '../components/bulkMembers/BulkMemberUploadForm';
import toast from 'react-hot-toast';

const BulkMembersPage: React.FC = () => {
  const { selectedCenterId, selectedCenter } = useCenter();
  const [uploadResult, setUploadResult] = useState<any>(null);
  const [showResult, setShowResult] = useState(false);

  const uploadBulkMembersMutation = useUploadBulkMembersMutation();

  const handleUpload = async (csvFile: File) => {
    if (!selectedCenterId) {
      toast.error('Please select a center from the sidebar');
      return;
    }

    try {
      const result = await uploadBulkMembersMutation.mutateAsync({
        center_id: selectedCenterId,
        csv_file: csvFile
      });
      
      setUploadResult(result);
      setShowResult(true);
      
      if (result.data?.successful_imports > 0) {
        toast.success(`Successfully imported ${result.data.successful_imports} members!`);
      }
      
      if (result.data?.failed_imports > 0) {
        toast.error(`${result.data.failed_imports} members failed to import`);
      }
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('Failed to upload members. Please check your CSV format and try again.');
    }
  };

  const handleNewUpload = () => {
    setShowResult(false);
    setUploadResult(null);
  };

  if (showResult && uploadResult) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
              <Users className="h-8 w-8 mr-3 text-blue-600" />
              Bulk Upload Results
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Upload completed for {selectedCenter?.name}
            </p>
          </div>
          
          <div className="mt-4 lg:mt-0">
            <button
              onClick={handleNewUpload}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload Another File
            </button>
          </div>
        </div>

        {/* Results Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Processed</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {uploadResult.data?.total_processed || 0}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Successful Imports</p>
                <p className="text-2xl font-semibold text-green-600">
                  {uploadResult.data?.successful_imports || 0}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Failed Imports</p>
                <p className="text-2xl font-semibold text-red-600">
                  {uploadResult.data?.failed_imports || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {uploadResult.data?.successful_imports > 0 && (
          <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <CheckCircle className="h-5 w-5 text-green-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700 dark:text-green-200">
                  Successfully imported {uploadResult.data.successful_imports} members to {selectedCenter?.name}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Error Details */}
        {uploadResult.data?.errors && uploadResult.data.errors.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                <AlertCircle className="h-5 w-5 mr-2 text-red-500" />
                Import Errors
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {uploadResult.data.errors.map((error: string, index: number) => (
                  <div key={index} className="text-sm text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-900/20 p-2 rounded">
                    {error}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* General Message */}
        {uploadResult.message && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-blue-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700 dark:text-blue-200">
                  {uploadResult.message}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <Users className="h-8 w-8 mr-3 text-blue-600" />
            Bulk Members Upload
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Upload multiple members at once using CSV files
          </p>
        </div>
      </div>

      {/* Empty State - No Center Selected */}
      {!selectedCenterId && (
        <>
          {/* Welcome Card */}
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg shadow-lg overflow-hidden">
            <div className="px-6 py-8 sm:px-10 sm:py-12">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="h-12 w-12 text-white" />
                </div>
                <div className="ml-6">
                  <h2 className="text-2xl font-bold text-white">
                    Bulk Members Import System
                  </h2>
                  <p className="mt-2 text-blue-100">
                    Efficiently import multiple members at once using CSV files with validation and error reporting.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <Upload className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    CSV Upload
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Upload CSV files up to 10MB
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Data Validation
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Automatic validation and error reporting
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                    <FileText className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Batch Processing
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Process hundreds of members efficiently
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CSV Format Guide */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                CSV Format Requirements
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
                    Required CSV Columns
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm text-blue-700 dark:text-blue-300">
                    <div>• first_name</div>
                    <div>• last_name</div>
                    <div>• email</div>
                    <div>• phone_number</div>
                    <div>• gender</div>
                    <div>• dob (YYYY-MM-DD)</div>
                    <div>• address</div>
                    <div>• city</div>
                    <div>• pincode</div>
                  </div>
                </div>
                
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-2">
                    Important Notes
                  </h4>
                  <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                    <li>• Phone numbers should include country code (e.g., +918360782226)</li>
                    <li>• Gender should be: male, female, or other</li>
                    <li>• Date of birth format: YYYY-MM-DD (e.g., 1990-01-15)</li>
                    <li>• Email addresses must be unique</li>
                    <li>• All fields are required unless specified otherwise</li>
                  </ul>
                </div>
              </div>

              <div className="text-center mt-6">
                <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Select a center from the sidebar to start uploading members
                </p>
                <div className="text-sm text-gray-400 dark:text-gray-500">
                  Once you select a center, you'll be able to upload CSV files with member data
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Upload Form */}
      {selectedCenterId && (
        <BulkMemberUploadForm
          onUpload={handleUpload}
          isLoading={uploadBulkMembersMutation.isPending}
          selectedCenter={selectedCenter}
        />
      )}
    </div>
  );
};

export default BulkMembersPage;