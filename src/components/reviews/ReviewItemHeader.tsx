
import React from 'react';
import { format } from 'date-fns';
import { Review } from '@/lib/types';
import { Star, Edit, Trash } from 'lucide-react';

interface ReviewItemHeaderProps {
  review: Review;
  isOwner: boolean;
  onEditClick: () => void;
  onDeleteClick: () => void;
}

const ReviewItemHeader: React.FC<ReviewItemHeaderProps> = ({ 
  review, 
  isOwner, 
  onEditClick, 
  onDeleteClick 
}) => {
  const formattedDate = review.updated_at 
    ? format(new Date(review.updated_at), 'MMM d, yyyy')
    : format(new Date(review.created_at), 'MMM d, yyyy');
  
  const getName = () => {
    const firstName = review.user_profile?.first_name;
    const lastName = review.user_profile?.last_name;
    
    if (firstName && lastName) {
      return `${firstName} ${lastName}`;
    } else if (firstName) {
      return firstName;
    }
    
    return 'Anonymous User';
  };

  return (
    <div className="flex justify-between items-start">
      <div>
        <h4 className="font-medium">{getName()}</h4>
        <div className="flex items-center mt-1">
          <div className="flex mr-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star 
                key={star} 
                className={`h-4 w-4 ${
                  star <= review.rating 
                    ? 'fill-yellow-400 text-yellow-400' 
                    : 'text-gray-300 dark:text-gray-700'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-muted-foreground">{formattedDate}</span>
        </div>
      </div>
      
      {isOwner && (
        <div className="flex gap-2">
          <button 
            onClick={onEditClick} 
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            aria-label="Edit review"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button 
            onClick={onDeleteClick} 
            className="text-gray-400 hover:text-red-500"
            aria-label="Delete review"
          >
            <Trash className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewItemHeader;
