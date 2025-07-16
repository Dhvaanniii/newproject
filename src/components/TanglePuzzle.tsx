import React, { useState, useRef, useCallback } from 'react';
import { RotateCw, Trash2, CheckCircle, Move, Layers } from 'lucide-react';
import ShapeLibrary from './ShapeLibrary';
import ColorPalette from './ColorPalette';

interface Shape {
  id: string;
  type: 'triangle' | 'square' | 'circle' | 'hexagon' | 'diamond' | 'star' | 'heart';
  color: string;
  x: number;
  y: number;
  rotation: number;
  size: number;
  zIndex: number;
}

interface TanglePuzzleProps {
  level: number;
  onComplete: () => void;
  isPlaying: boolean;
}

const TanglePuzzle: React.FC<TanglePuzzleProps> = ({ level, onComplete, isPlaying }) => {
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [selectedShape, setSelectedShape] = useState<string | null>(null);
  const [draggedShape, setDraggedShape] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState('#3B82F6');
  const canvasRef = useRef<HTMLDivElement>(null);
  const dragOffset = useRef({ x: 0, y: 0 });
  const [nextZIndex, setNextZIndex] = useState(1);

  const addShape = (type: Shape['type']) => {
    if (!isPlaying) return;
    
    const newShape: Shape = {
      id: `shape-${Date.now()}`,
      type,
      color: selectedColor,
      x: 100 + Math.random() * 200,
      y: 100 + Math.random() * 200,
      rotation: 0,
      size: 60,
      zIndex: nextZIndex,
    };
    setShapes(prev => [...prev, newShape]);
    setNextZIndex(prev => prev + 1);
  };

  const handleMouseDown = useCallback((e: React.MouseEvent, shapeId: string) => {
    if (!isPlaying) return;
    
    e.preventDefault();
    setSelectedShape(shapeId);
    setDraggedShape(shapeId);
    
    const shape = shapes.find(s => s.id === shapeId);
    if (shape && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      dragOffset.current = {
        x: e.clientX - rect.left - shape.x,
        y: e.clientY - rect.top - shape.y,
      };
    }
  }, [shapes, isPlaying]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!draggedShape || !isPlaying || !canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const newX = e.clientX - rect.left - dragOffset.current.x;
    const newY = e.clientY - rect.top - dragOffset.current.y;
    
    setShapes(prev => prev.map(shape => 
      shape.id === draggedShape 
        ? { ...shape, x: Math.max(0, Math.min(newX, 500)), y: Math.max(0, Math.min(newY, 350)) }
        : shape
    ));
  }, [draggedShape, isPlaying]);

  const handleMouseUp = useCallback(() => {
    setDraggedShape(null);
  }, []);

  const rotateShape = (shapeId: string) => {
    if (!isPlaying) return;
    setShapes(prev => prev.map(shape => 
      shape.id === shapeId 
        ? { ...shape, rotation: (shape.rotation + 45) % 360 }
        : shape
    ));
  };

  const changeShapeColor = (shapeId: string, color: string) => {
    if (!isPlaying) return;
    setShapes(prev => prev.map(shape => 
      shape.id === shapeId 
        ? { ...shape, color }
        : shape
    ));
  };

  const bringToFront = (shapeId: string) => {
    if (!isPlaying) return;
    setShapes(prev => prev.map(shape => 
      shape.id === shapeId 
        ? { ...shape, zIndex: nextZIndex }
        : shape
    ));
    setNextZIndex(prev => prev + 1);
  };

  const sendToBack = (shapeId: string) => {
    if (!isPlaying) return;
    setShapes(prev => prev.map(shape => 
      shape.id === shapeId 
        ? { ...shape, zIndex: 0 }
        : shape
    ));
  };
  const deleteShape = (shapeId: string) => {
    if (!isPlaying) return;
    setShapes(prev => prev.filter(shape => shape.id !== shapeId));
    setSelectedShape(null);
  };

  const clearAll = () => {
    if (!isPlaying) return;
    setShapes([]);
    setSelectedShape(null);
  };

  const renderShape = (shape: Shape) => {
    const baseStyle = {
      position: 'absolute' as const,
      left: shape.x,
      top: shape.y,
      width: shape.size,
      height: shape.size,
      transform: `rotate(${shape.rotation}deg)`,
      cursor: isPlaying ? 'move' : 'default',
      transition: draggedShape === shape.id ? 'none' : 'all 0.2s ease',
      zIndex: selectedShape === shape.id ? 1000 : shape.zIndex,
    };

    const shapeStyle = {
      width: '100%',
      height: '100%',
      backgroundColor: shape.color,
      border: selectedShape === shape.id ? '3px solid #1F2937' : '2px solid rgba(0,0,0,0.1)',
      boxShadow: selectedShape === shape.id ? '0 4px 12px rgba(0,0,0,0.3)' : '0 2px 4px rgba(0,0,0,0.1)',
    };

    let shapeElement;
    switch (shape.type) {
      case 'circle':
        shapeElement = <div style={{ ...shapeStyle, borderRadius: '50%' }} />;
        break;
      case 'triangle':
        shapeElement = (
          <div style={{
            ...shapeStyle,
            backgroundColor: 'transparent',
            border: 'none',
            width: 0,
            height: 0,
            borderLeft: `${shape.size/2}px solid transparent`,
            borderRight: `${shape.size/2}px solid transparent`,
            borderBottom: `${shape.size}px solid ${shape.color}`,
            filter: selectedShape === shape.id ? 'drop-shadow(0 4px 12px rgba(0,0,0,0.3))' : 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
          }} />
        );
        break;
      case 'hexagon':
        shapeElement = (
          <div style={{
            ...shapeStyle,
            clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
          }} />
        );
        break;
      case 'diamond':
        shapeElement = (
          <div style={{
            ...shapeStyle,
            transform: 'rotate(45deg)',
            borderRadius: '4px',
          }} />
        );
        break;
      case 'star':
        shapeElement = (
          <svg 
            width={shape.size} 
            height={shape.size} 
            viewBox="0 0 100 100"
            style={{
              filter: selectedShape === shape.id ? 'drop-shadow(0 4px 12px rgba(0,0,0,0.3))' : 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
            }}
          >
            <polygon 
              points="50,5 61,35 95,35 69,57 79,91 50,70 21,91 31,57 5,35 39,35"
              fill={shape.color}
              stroke={selectedShape === shape.id ? '#1F2937' : 'rgba(0,0,0,0.1)'}
              strokeWidth={selectedShape === shape.id ? 3 : 2}
            />
          </svg>
        );
        break;
      case 'heart':
        shapeElement = (
          <svg 
            width={shape.size} 
            height={shape.size} 
            viewBox="0 0 24 24"
            style={{
              filter: selectedShape === shape.id ? 'drop-shadow(0 4px 12px rgba(0,0,0,0.3))' : 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
            }}
          >
            <path 
              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
              fill={shape.color}
              stroke={selectedShape === shape.id ? '#1F2937' : 'rgba(0,0,0,0.1)'}
              strokeWidth={selectedShape === shape.id ? 1 : 0.5}
            />
          </svg>
        );
        break;
      default:
        shapeElement = <div style={{ ...shapeStyle, borderRadius: '4px' }} />;
    }

    return (
      <div
        key={shape.id}
        style={baseStyle}
        onMouseDown={(e) => handleMouseDown(e, shape.id)}
        onClick={() => setSelectedShape(shape.id)}
      >
        {shapeElement}
      </div>
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Toolbar */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-4">
        <div className="flex flex-wrap items-center gap-4">
          {/* Shape Tools */}
          <div>
            <span className="text-sm font-medium text-gray-700">Shapes:</span>
            <div className="mt-2">
              <ShapeLibrary onShapeSelect={addShape} disabled={!isPlaying} />
            </div>
          </div>

          {/* Color Palette */}
          <div>
            <span className="text-sm font-medium text-gray-700">Colors:</span>
            <div className="mt-2">
              <ColorPalette 
                selectedColor={selectedColor}
                onColorSelect={setSelectedColor}
                disabled={!isPlaying}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 ml-auto">
            {selectedShape && (
              <>
                <button
                  onClick={() => rotateShape(selectedShape)}
                  disabled={!isPlaying}
                  className="flex items-center space-x-1 px-3 py-2 bg-yellow-100 hover:bg-yellow-200 rounded-lg transition-colors disabled:opacity-50"
                >
                  <RotateCw className="w-4 h-4" />
                  <span className="text-sm">Rotate</span>
                </button>
                <button
                  onClick={() => bringToFront(selectedShape)}
                  disabled={!isPlaying}
                  className="flex items-center space-x-1 px-3 py-2 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors disabled:opacity-50"
                >
                  <Layers className="w-4 h-4" />
                  <span className="text-sm">Front</span>
                </button>
                <button
                  onClick={() => sendToBack(selectedShape)}
                  disabled={!isPlaying}
                  className="flex items-center space-x-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
                >
                  <Layers className="w-4 h-4" />
                  <span className="text-sm">Back</span>
                </button>
                <button
                  onClick={() => deleteShape(selectedShape)}
                  disabled={!isPlaying}
                  className="flex items-center space-x-1 px-3 py-2 bg-red-100 hover:bg-red-200 rounded-lg transition-colors disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="text-sm">Delete</span>
                </button>
              </>
            )}
            <button
              onClick={clearAll}
              disabled={!isPlaying}
              className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50 text-sm"
            >
              Clear All
            </button>
            <button
              onClick={onComplete}
              disabled={!isPlaying || shapes.length === 0}
              className="flex items-center space-x-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Complete</span>
            </button>
          </div>
        </div>
      </div>

      {/* Canvas */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div
          ref={canvasRef}
          className="relative w-full h-96 bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-dashed border-gray-300"
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Grid Pattern */}
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `
                linear-gradient(to right, #e5e7eb 1px, transparent 1px),
                linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
              `,
              backgroundSize: '20px 20px'
            }}
          />
          
          {/* Target Area Hint */}
          <div className="absolute inset-4 border-2 border-blue-300 border-dashed rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-500">
              <div className="text-lg font-medium mb-2">Level {level} Target</div>
              <div className="text-sm">Drag and arrange shapes to match the pattern</div>
            </div>
          </div>

          {/* Shapes */}
          {shapes.map(renderShape)}
        </div>

        {/* Selected Shape Controls */}
        {selectedShape && (
          <div className="p-4 bg-gray-50 border-t">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-4">
                <span className="text-sm font-medium text-gray-700">Selected Shape:</span>
                <ColorPalette 
                  selectedColor={shapes.find(s => s.id === selectedShape)?.color || selectedColor}
                  onColorSelect={(color) => changeShapeColor(selectedShape, color)}
                  disabled={!isPlaying}
                  size="sm"
                />
              </div>
              <div className="text-sm text-gray-600">
                <Move className="inline w-4 h-4 mr-1" />
                Drag to move • Rotate • Layer • Change colors
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-medium text-blue-900 mb-2">How to Play:</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Click shape buttons to add new shapes to the canvas</li>
          <li>• Drag shapes around to position them</li>
          <li>• Click a shape to select it, then use rotate, layer, or color tools</li>
          <li>• Use "Front" and "Back" buttons to control which shapes appear on top</li>
          <li>• Arrange shapes to match the target pattern</li>
          <li>• Click "Complete" when you're satisfied with your arrangement</li>
        </ul>
      </div>
    </div>
  );
};

export default TanglePuzzle;