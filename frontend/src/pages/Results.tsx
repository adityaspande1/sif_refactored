import React from 'react';
import { useLocation } from 'react-router-dom';
import { Trash2, FileText, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

interface FileData {
  path: string;
  size: number;
}

interface ResultsState {
  data: {
    duplicates: FileData[][];
  };
}

const Results = () => {
  const location = useLocation();
  const { data } = location.state as ResultsState;

  const handleDelete = async (filePath: string) => {
    try {
      await fetch('http://localhost:8000/delete-file', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ file_path: filePath }),
      });
      // Refresh the page or update the state
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 pt-20 pb-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Comparison Results</h2>
          <Link
            to="/"
            className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Upload</span>
          </Link>
        </div>
        
        {data?.duplicates?.length > 0 ? (
          <div className="space-y-6">
            {data.duplicates.map((group, groupIndex) => (
              <motion.div
                key={groupIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: groupIndex * 0.1 }}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
              >
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-6 py-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Duplicate Group {groupIndex + 1}
                  </h3>
                </div>
                <div className="divide-y divide-gray-100">
                  {group.map((file, fileIndex) => (
                    <div
                      key={fileIndex}
                      className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <FileText className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-700">{file.path}</p>
                          <p className="text-xs text-gray-500">
                            {(file.size / 1024).toFixed(2)} KB
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDelete(file.path)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">No duplicate files found.</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Results;