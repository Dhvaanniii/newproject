import React, { useState, useRef } from 'react';
import { Upload, FileText, Trash2, CheckCircle, AlertCircle, Folder, Eye } from 'lucide-react';

interface PDFLevel {
  levelNumber: number;
  pageNumber: number;
  category: 'tangle' | 'funthinker-basic' | 'funthinker-medium' | 'funthinker-hard';
  outlineUrl: string;
  unlockDate: Date;
  lockDate: Date;
  uploadDate: Date;
  hasBeenPlayed: boolean;
}

interface AdminPDFUploaderProps {
  category: 'tangle' | 'funthinker-basic' | 'funthinker-medium' | 'funthinker-hard';
  onLevelsCreated?: (levels: PDFLevel[]) => void;
}

const AdminPDFUploader: React.FC<AdminPDFUploaderProps> = ({ category, onLevelsCreated }) => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedLevels, setProcessedLevels] = useState<PDFLevel[]>([]);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [existingLevels, setExistingLevels] = useState<PDFLevel[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load existing levels on component mount
  React.useEffect(() => {
    loadExistingLevels();
  }, [category]);

  const loadExistingLevels = () => {
    const stored = localStorage.getItem(`${category}-levels`);
    if (stored) {
      try {
        const levels = JSON.parse(stored).map((level: any) => ({
          ...level,
          unlockDate: new Date(level.unlockDate),
          lockDate: new Date(level.lockDate),
          uploadDate: new Date(level.uploadDate),
          hasBeenPlayed: level.hasBeenPlayed || false
        }));
        setExistingLevels(levels);
      } catch (error) {
        console.error('Error loading existing levels:', error);
        setExistingLevels([]);
      }
    } else {
      setExistingLevels([]);
    }
  };

  const getExistingLevelCount = (): number => {
    return existingLevels.length;
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setError('Please select a PDF file');
      return;
    }

    // Check file size (limit to 50MB)
    if (file.size > 50 * 1024 * 1024) {
      setError('File size must be less than 50MB');
      return;
    }

    setUploadedFile(file);
    setError('');
    setSuccess('');
    setProcessedLevels([]);
  };

  const processPDF = async () => {
    if (!uploadedFile) return;

    setIsProcessing(true);
    setError('');

    try {
      // Simulate PDF processing with realistic delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // For demo purposes, we'll simulate extracting pages from PDF
      // In real implementation, you would use PDF.js or similar library
      const pageCount = Math.floor(Math.random() * 10) + 5; // Random 5-15 pages
      const existingCount = getExistingLevelCount();
      
      const newLevels: PDFLevel[] = [];
      
      for (let i = 1; i <= pageCount; i++) {
        const levelNumber = existingCount + i;
        const uploadDate = new Date();
        
        // Each level unlocks daily starting from tomorrow
        const unlockDate = new Date();
        unlockDate.setDate(unlockDate.getDate() + (levelNumber - 1));
        unlockDate.setHours(0, 0, 0, 0); // Midnight unlock
        
        // Level locks after 15 days if not played
        const lockDate = new Date(unlockDate);
        lockDate.setDate(lockDate.getDate() + 15);

        // Create mock outline URL - in real implementation, convert PDF page to image/SVG
        const canvas = document.createElement('canvas');
        canvas.width = 400;
        canvas.height = 300;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          // Create a simple outline pattern for demo
          ctx.fillStyle = '#f0f0f0';
          ctx.fillRect(0, 0, 400, 300);
          ctx.strokeStyle = '#333';
          ctx.lineWidth = 2;
          ctx.strokeRect(50, 50, 300, 200);
          ctx.font = '16px Arial';
          ctx.fillStyle = '#333';
          ctx.textAlign = 'center';
          ctx.fillText(`${category.toUpperCase()} Level ${levelNumber}`, 200, 150);
          ctx.fillText(`Page ${i} from PDF`, 200, 180);
        }
        const outlineUrl = canvas.toDataURL();

        newLevels.push({
          levelNumber,
          pageNumber: i,
          category,
          outlineUrl,
          unlockDate,
          lockDate,
          uploadDate,
          hasBeenPlayed: false
        });
      }

      setProcessedLevels(newLevels);
      
      // Save to localStorage (simulating database)
      const allLevels = [...existingLevels, ...newLevels];
      localStorage.setItem(`${category}-levels`, JSON.stringify(allLevels));
      setExistingLevels(allLevels);

      // Update file naming in storage path simulation
      const storagePath = `D:/PuzzleGame/outlines/${category}/`;
      newLevels.forEach(level => {
        console.log(`Saved: ${storagePath}level_${level.levelNumber}.svg`);
      });

      setSuccess(`Successfully processed ${pageCount} pages and created levels ${existingCount + 1} to ${existingCount + pageCount}!`);
      onLevelsCreated?.(newLevels);

    } catch (err) {
      setError('Failed to process PDF. Please try again.');
      console.error('PDF processing error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const clearUpload = () => {
    setUploadedFile(null);
    setProcessedLevels([]);
    setError('');
    setSuccess('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const deleteLevel = (levelNumber: number) => {
    const updatedLevels = existingLevels.filter(level => level.levelNumber !== levelNumber);
    localStorage.setItem(`${category}-levels`, JSON.stringify(updatedLevels));
    setExistingLevels(updatedLevels);
    
    // Also remove from processed levels if it's there
    setProcessedLevels(prev => prev.filter(level => level.levelNumber !== levelNumber));
  };

  const getCategoryDisplayName = () => {
    switch (category) {
      case 'tangle': return 'Tangles';
      case 'funthinker-basic': return 'Funthinker Basic';
      case 'funthinker-medium': return 'Funthinker Medium';
      case 'funthinker-hard': return 'Funthinker Hard';
      default: return category;
    }
  };

  const getStoragePath = () => {
    return `D:/PuzzleGame/outlines/${category}/`;
  };

  const previewLevel = (level: PDFLevel) => {
    // Open level outline in new window for preview
    const newWindow = window.open('', '_blank');
    if (newWindow) {
      newWindow.document.write(`
        <html>
          <head><title>Level ${level.levelNumber} Preview</title></head>
          <body style="margin: 0; padding: 20px; text-align: center;">
            <h2>${getCategoryDisplayName()} - Level ${level.levelNumber}</h2>
            <img src="${level.outlineUrl}" style="max-width: 100%; height: auto; border: 1px solid #ccc;" />
            <p>Page ${level.pageNumber} from uploaded PDF</p>
            <p>Unlocks: ${level.unlockDate.toLocaleDateString()}</p>
          </body>
        </html>
      `);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-800">
            PDF Upload - {getCategoryDisplayName()}
          </h3>
          <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
            <Folder className="w-4 h-4" />
            <span>Storage: {getStoragePath()}</span>
          </div>
        </div>
        <div className="text-sm text-gray-600">
          Existing Levels: {getExistingLevelCount()}
        </div>
      </div>

      {/* Upload Area */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-6 hover:border-blue-400 transition-colors">
        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-lg font-medium text-gray-700 mb-2">
          Upload PDF with Puzzle Outlines
        </p>
        <p className="text-sm text-gray-500 mb-4">
          Each page will become a new level. Auto-numbered starting from level {getExistingLevelCount() + 1}
        </p>
        
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={handleFileSelect}
          className="hidden"
        />
        
        <button
          onClick={() => fileInputRef.current?.click()}
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Upload className="w-4 h-4" />
          Choose PDF File
        </button>
        <p className="text-xs text-gray-400 mt-2">Maximum file size: 50MB</p>
      </div>

      {/* File Info */}
      {uploadedFile && (
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="w-8 h-8 text-red-600" />
              <div>
                <p className="font-medium text-gray-800">{uploadedFile.name}</p>
                <p className="text-sm text-gray-600">
                  {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={processPDF}
                disabled={isProcessing}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 transition-colors"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Process PDF
                  </>
                )}
              </button>
              <button
                onClick={clearUpload}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Status Messages */}
      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg mb-6">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-lg mb-6">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <p className="text-green-800">{success}</p>
        </div>
      )}

      {/* Processed Levels */}
      {processedLevels.length > 0 && (
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">
            Newly Created Levels ({processedLevels.length})
          </h4>
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {processedLevels.map((level) => (
              <div key={level.levelNumber} className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                <div>
                  <p className="font-medium text-gray-800">
                    Level {level.levelNumber} (Page {level.pageNumber})
                  </p>
                  <p className="text-sm text-gray-600">
                    Unlocks: {level.unlockDate.toLocaleDateString()} | 
                    Locks: {level.lockDate.toLocaleDateString()}
                  </p>
                  <p className="text-xs text-gray-500">
                    File: {getStoragePath()}level_{level.levelNumber}.svg
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => previewLevel(level)}
                    className="p-2 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                    title="Preview Level"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <div className="text-right">
                    <div className="text-sm font-medium text-green-600">✓ Created</div>
                    <div className="text-xs text-gray-500">Ready to play</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Existing Levels */}
      {existingLevels.length > 0 && (
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">
            All Existing Levels ({existingLevels.length})
          </h4>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {existingLevels.map((level) => (
              <div key={level.levelNumber} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800">
                    Level {level.levelNumber}
                  </p>
                  <p className="text-sm text-gray-600">
                    Unlocks: {level.unlockDate.toLocaleDateString()} | 
                    Status: {level.hasBeenPlayed ? 'Completed' : 'Available'}
                  </p>
                  <p className="text-xs text-gray-500">
                    Uploaded: {level.uploadDate.toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => previewLevel(level)}
                    className="p-2 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                    title="Preview Level"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteLevel(level.levelNumber)}
                    className="p-2 text-red-600 hover:bg-red-100 rounded transition-colors"
                    title="Delete Level"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
        <h5 className="font-medium text-yellow-800 mb-2">PDF Upload Instructions:</h5>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• Upload PDF where each page contains a puzzle outline</li>
          <li>• Pages automatically converted to levels (level_1, level_2, etc.)</li>
          <li>• Levels numbered sequentially from existing count + 1</li>
          <li>• Each level unlocks daily at midnight (12:00 AM)</li>
          <li>• Levels lock permanently after 15 days if unplayed</li>
          <li>• Files saved to: {getStoragePath()}</li>
          <li>• Maximum file size: 50MB</li>
          <li>• Supported format: PDF only</li>
        </ul>
      </div>
    </div>
  );
};

export default AdminPDFUploader;