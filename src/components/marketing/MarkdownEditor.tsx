import React, { useState } from 'react';
import { Eye, Edit3 } from 'lucide-react';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  value,
  onChange,
  label = 'Markdown Content',
  placeholder = 'Enter markdown content...',
}) => {
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');

  const renderMarkdown = (markdown: string) => {
    const lines = markdown.split('\n');
    return lines.map((line, index) => {
      if (line.startsWith('# ')) {
        return <h1 key={index} className="text-3xl font-bold mb-4">{line.substring(2)}</h1>;
      }
      if (line.startsWith('## ')) {
        return <h2 key={index} className="text-2xl font-bold mb-3 mt-4">{line.substring(3)}</h2>;
      }
      if (line.startsWith('### ')) {
        return <h3 key={index} className="text-xl font-bold mb-2 mt-3">{line.substring(4)}</h3>;
      }
      if (line.startsWith('- ')) {
        return <li key={index} className="ml-4">{line.substring(2)}</li>;
      }
      if (line.startsWith('**') && line.endsWith('**')) {
        return <p key={index} className="font-bold mb-2">{line.substring(2, line.length - 2)}</p>;
      }
      if (line.trim() === '') {
        return <br key={index} />;
      }
      const processedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      return <p key={index} className="mb-2" dangerouslySetInnerHTML={{ __html: processedLine }} />;
    });
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}

      <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
        <div className="flex bg-gray-100 dark:bg-gray-700 border-b border-gray-300 dark:border-gray-600">
          <button
            type="button"
            onClick={() => setActiveTab('edit')}
            className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'edit'
                ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
          >
            <Edit3 className="h-4 w-4" />
            <span>Edit</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'preview'
                ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
          >
            <Eye className="h-4 w-4" />
            <span>Preview</span>
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800">
          {activeTab === 'edit' ? (
            <textarea
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              rows={12}
              className="w-full p-4 text-sm font-mono bg-transparent border-0 focus:outline-none focus:ring-0 text-gray-900 dark:text-gray-100 resize-none"
            />
          ) : (
            <div className="p-4 min-h-[288px] prose dark:prose-invert max-w-none text-gray-900 dark:text-gray-100">
              {value ? (
                renderMarkdown(value)
              ) : (
                <p className="text-gray-400 dark:text-gray-500 italic">No content to preview</p>
              )}
            </div>
          )}
        </div>
      </div>

      <p className="text-xs text-gray-500 dark:text-gray-400">
        Supports basic markdown: # headers, ## subheaders, **bold**, - lists
      </p>
    </div>
  );
};

export default MarkdownEditor;
