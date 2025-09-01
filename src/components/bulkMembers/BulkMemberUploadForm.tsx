import React, { useState, useRef } from 'react';
import { Upload, FileText, AlertCircle, Download, Building } from 'lucide-react';
import { Center } from '../../types/center';

interface BulkMemberUploadFormProps {
  onUpload: (csvFile: File) => Promise<void>;
  isLoading: boolean;
  selectedCenter: Center | null;
}

const BulkMemberUploadForm: React.FC<BulkMemberUploadFormProps> = ({
  onUpload,
  isLoading,
  selectedCenter
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      alert('Please select a CSV file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      alert('File size must be less than 10MB');
      return;
    }

    setSelectedFile(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Please select a CSV file');
      return;
    }

    await onUpload(selectedFile);
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const downloadSampleCSV = () => {
    const sampleData = [
      'first_name,last_name,salutation,email,phone_number,gender,dob,address,city,pincode',
      'John,Doe,Mr,john.doe@example.com,+918360782226,male,1990-01-15,"123 Main Street",Mumbai,400001',
      'Jane,Smith,Ms,jane.smith@example.com,+919876543210,female,1985-05-20,"456 Oak Avenue",Delhi,110001',
      'Alex,Johnson,Mr,alex.johnson@example.com,+917654321098,other,1992-12-10,"789 Pine Road",Bangalore,560001'
    ].join('\n');

    const blob = new Blob([sampleData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample_members.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Center Info */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
        <div className="flex items-center">
          <Building className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
          <div>
            <h3 className="text-sm font-medium text-blue-900 dark:text-blue-100">
              Selected Center
            </h3>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              {selectedCenter?.name} - {selectedCenter?.city}
            </p>
          </div>
        </div>
      </div>

      {/* Sample CSV Download */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            CSV Template
          </h3>
          <button
            onClick={downloadSampleCSV}
            className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Download className="h-4 w-4 mr-2" />
            Download Sample CSV
          </button>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            Download the sample CSV file to see the exact format required for bulk member upload.
          </p>
          <div className="text-xs text-gray-500 dark:text-gray-500">
            The sample includes example data with proper formatting for all required fields.
          </div>
        </div>
      </div>

      {/* File Upload */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Upload Members CSV
        </h3>
        
        <div
          className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragOver
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
              : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileInputChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          
          {selectedFile ? (
            <div className="space-y-3">
              <div className="flex items-center justify-center">
                <FileText className="h-12 w-12 text-green-600" />
              </div>
              <div className="text-lg font-medium text-gray-900 dark:text-white">
                {selectedFile.name}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {(selectedFile.size / 1024).toFixed(1)} KB
              </div>
              <div className="flex justify-center space-x-3">
                <button
                  onClick={handleUpload}
                  disabled={isLoading}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Members
                    </>
                  )}
                </button>
                <button
                  onClick={removeFile}
                  disabled={isLoading}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Remove File
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-center">
                <Upload className="h-12 w-12 text-gray-400" />
              </div>
              <div className="text-lg text-gray-600 dark:text-gray-400">
                <span className="font-medium text-blue-600 dark:text-blue-400">Click to upload</span> or drag and drop
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                CSV files only, up to 10MB
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Upload Instructions
          </h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400">1</span>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                  Download the sample CSV template
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Use the "Download Sample CSV" button to get the correct format with example data.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400">2</span>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                  Prepare your member data
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Fill in your member information following the exact column names and format shown in the sample.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400">3</span>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                  Upload and review results
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Upload your CSV file and review the import results. Any errors will be clearly displayed.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkMembersPage;