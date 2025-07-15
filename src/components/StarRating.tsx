import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  stars: number;
  size?: 'sm' | 'md' | 'lg';
  showNumber?: boolean;
}

const StarRating: React.FC<StarRatingProps> = ({ stars, size = 'md', showNumber = false }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <div className="flex items-center space-x-1">
      {Array.from({ length: 3 }, (_, i) => (
        <Star
          key={i}
          className={`${sizeClasses[size]} ${
            i < stars ? 'text-yellow-500 fill-current' : 'text-gray-300'
          } transition-colors duration-200`}
        />
      ))}
      {showNumber && <span className="ml-2 text-sm text-gray-600">({stars}/3)</span>}
    </div>
  );
};

export default StarRating;