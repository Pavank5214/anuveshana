import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
// Corrected: Replaced File3d with Box
import { UploadCloud, Box, X } from 'lucide-react';

function FileUpload() {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      validateAndSetFile(selectedFile);
    }
  };

  const validateAndSetFile = (fileToValidate) => {
    const fileExtension = fileToValidate.name.split('.').pop().toLowerCase();
    if (fileExtension !== 'stl') {
      setError('Invalid file type. Please upload a .stl file.');
      setFile(null);
    } else {
      setError('');
      setFile(fileToValidate);
    }
  };

  const handleDragEvents = (e, dragging) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(dragging);
  };
  
  const handleDrop = (e) => {
    handleDragEvents(e, false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      validateAndSetFile(droppedFile);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setError('');
  };

  const openFileDialog = () => {
    inputRef.current.click();
  };

  return (
    <section id="upload" className="py-20 bg-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Upload Your File for a Quote</h2>
        <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
          Drag and drop your .STL file below, or click to select. We'll get back to you with a detailed quote as soon as possible.
        </p>

        <div
          className={`relative w-full max-w-2xl mx-auto border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-all duration-300 ${
            isDragging ? 'border-orange-500 bg-orange-50' : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragEnter={(e) => handleDragEvents(e, true)}
          onDragOver={(e) => handleDragEvents(e, true)}
          onDragLeave={(e) => handleDragEvents(e, false)}
          onDrop={handleDrop}
          onClick={openFileDialog}
        >
          <input
            type="file"
            ref={inputRef}
            className="hidden"
            onChange={handleFileChange}
            accept=".stl"
          />
          
          {file ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center text-left"
            >
              {/* Corrected: Replaced File3d with Box */}
              <Box size={48} className="text-green-500 mb-4" />
              <p className="font-semibold text-gray-800">File Selected:</p>
              <p className="text-gray-600 break-all">{file.name}</p>
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent re-opening file dialog
                  handleRemoveFile();
                }}
                className="mt-4 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white text-sm font-bold py-2 px-4 rounded-full transition-colors duration-300"
              >
                <X size={16} className="mr-1" />
                Remove File
              </button>
            </motion.div>
          ) : (
            <div className="flex flex-col items-center justify-center text-gray-500">
              <UploadCloud size={48} className="mb-4" />
              <p className="font-semibold">Drag & drop your STL file here</p>
              <p className="text-sm mt-2">or click to browse</p>
            </div>
          )}
        </div>
        
        {error && (
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 text-red-500 font-semibold"
          >
            {error}
          </motion.p>
        )}
      </div>
    </section>
  );
}

export default FileUpload;