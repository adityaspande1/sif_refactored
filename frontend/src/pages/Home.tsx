import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useNavigate } from 'react-router-dom';
import { FolderOpen, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Home = () => {
  const [sourceFiles, setSourceFiles] = useState<File[]>([]);
  const [destFiles, setDestFiles] = useState<File[]>([]);
  const navigate = useNavigate();

  const onDropSource = useCallback((acceptedFiles: File[]) => {
    setSourceFiles(acceptedFiles);
  }, []);

  const onDropDest = useCallback((acceptedFiles: File[]) => {
    setDestFiles(acceptedFiles);
  }, []);

  const { getRootProps: getSourceRootProps, getInputProps: getSourceInputProps, isDragActive: isSourceDragActive } = useDropzone({
    onDrop: onDropSource,
    multiple: true,
  });

const { getRootProps: getDestRootProps, getInputProps: getDestInputProps, isDragActive: isDestDragActive } = useDropzone({
    onDrop: onDropDest,
    multiple: true,
});

  const handleCompare = async () => {
    try {
      const formData = new FormData();
      sourceFiles.forEach(file => formData.append('source_files', file));
      destFiles.forEach(file => formData.append('dest_files', file));

      const response = await fetch('http://localhost:8000/compare-directories', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      navigate('/results', { state: { data } });
    } catch (error) {
      console.error('Error:', error);
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
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Find Duplicate Files Instantly
          </h1>
          <p className="text-gray-600 text-lg">
            Upload your folders and let our MinHash algorithm detect duplicates efficiently
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div
              {...getSourceRootProps()}
              className={`
                relative border-2 border-dashed rounded-xl p-8 transition-colors
                ${isSourceDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-500'}
              `}
            >
              <input {...getSourceInputProps()} multiple />
              <div className="text-center">
                <FolderOpen className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">Drop your source folder here</p>
                <p className="text-sm text-gray-500">or click to select folder</p>
              </div>
              {sourceFiles.length > 0 && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">{sourceFiles.length} files selected</p>
                </div>
              )}
            </div>

            <div
              {...getDestRootProps()}
              className={`
                relative border-2 border-dashed rounded-xl p-8 transition-colors
                ${isDestDragActive ? 'border-purple-500 bg-purple-50' : 'border-gray-300 hover:border-purple-500'}
              `}
            >
              <input {...getDestInputProps()} multiple />
              <div className="text-center">
                <FolderOpen className="w-12 h-12 text-purple-500 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">Drop your destination folder here</p>
                <p className="text-sm text-gray-500">or click to select folder</p>
              </div>
              {destFiles.length > 0 && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">{destFiles.length} files selected</p>
                </div>
              )}
            </div>

            <button
              onClick={handleCompare}
              disabled={!sourceFiles.length || !destFiles.length}
              className={`
                w-full py-3 px-4 rounded-lg flex items-center justify-center space-x-2
                ${sourceFiles.length && destFiles.length
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:opacity-90'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }
              `}
            >
              <span>Compare Files</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-8">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">How it Works</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm text-blue-600 font-medium">1</span>
                </div>
                <p className="text-gray-600">Upload your source and destination folders</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm text-indigo-600 font-medium">2</span>
                </div>
                <p className="text-gray-600">Our MinHash algorithm processes and analyzes the files</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm text-purple-600 font-medium">3</span>
                </div>
                <p className="text-gray-600">View and manage duplicate files in an organized interface</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Home;