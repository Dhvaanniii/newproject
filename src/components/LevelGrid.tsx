import React from 'react';
import { useGame } from '../contexts/GameContext';
import { Star, Lock, Play } from 'lucide-react';

interface LevelGridProps {
  category: string;
  totalLevels: number;
  onLevelClick: (level: number) => void;
}

const LevelGrid: React.FC<LevelGridProps> = ({ category, totalLevels, onLevelClick }) => {
  const { isLevelUnlocked, getLevelProgress } = useGame();

  const renderStars = (stars: number) => {
    return Array.from({ length: 3 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < stars ? 'text-yellow-500 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  const levels = Array.from({ length: totalLevels }, (_, i) => i + 1);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {levels.map(level => {
        const levelId = `${category}-${level}`;
        const isUnlocked = isLevelUnlocked(levelId, category);
        const progress = getLevelProgress(levelId);
        
        return (
          <div
            key={level}
            className={`
              relative aspect-square rounded-xl border-2 transition-all duration-300
              ${isUnlocked 
                ? 'border-blue-300 bg-white cursor-pointer hover:border-blue-500 hover:shadow-lg transform hover:scale-105' 
                : 'border-gray-300 bg-gray-100 cursor-not-allowed opacity-50'
              }
            `}
            onClick={() => isUnlocked && onLevelClick(level)}
          >
            <div className="absolute inset-0 flex flex-col items-center justify-center p-2">
              {!isUnlocked ? (
                <Lock className="w-6 h-6 text-gray-400 mb-1" />
              ) : (
                <Play className="w-6 h-6 text-blue-500 mb-1" />
              )}
              
              <span className={`text-sm font-bold ${isUnlocked ? 'text-gray-800' : 'text-gray-400'}`}>
                {level}
              </span>
              
              {progress && progress.completed && (
                <div className="flex space-x-1 mt-1">
                  {renderStars(progress.stars)}
                </div>
              )}
            </div>
            
            {progress && progress.completed && (
              <div className="absolute top-1 right-1 w-3 h-3 bg-green-500 rounded-full"></div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default LevelGrid;