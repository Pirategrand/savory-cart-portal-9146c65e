import React, { useState } from 'react';
import { ThumbsUp } from 'lucide-react';
import { Review } from '@/lib/types';
import { voteReview, removeVote } from '@/lib/reviews';
import { toast } from 'sonner';

interface ReviewItemActionsProps {
  review: Review;
  user: any;
  isOwner: boolean;
}

const ReviewItemActions: React.FC<ReviewItemActionsProps> = ({ review, user, isOwner }) => {
  const [isHelpful, setIsHelpful] = useState<boolean | undefined>(review.is_helpful);
  const [helpfulCount, setHelpfulCount] = useState(review.helpful_count || 0);

  const handleVote = async () => {
    if (!user) {
      toast.error('You must be logged in to vote on reviews');
      return;
    }
    
    if (isOwner) {
      toast.error('You cannot vote on your own review');
      return;
    }
    
    try {
      // If already marked as helpful, remove the vote
      if (isHelpful) {
        const success = await removeVote(review.id, user.id);
        if (success) {
          setIsHelpful(undefined);
          setHelpfulCount(prev => Math.max(0, prev - 1));
        }
      } else {
        // Otherwise add or update the vote
        const success = await voteReview(review.id, user.id, true);
        if (success) {
          // If switching from not helpful to helpful, add 1
          if (isHelpful === false) {
            setHelpfulCount(prev => prev + 1);
          } 
          // If new vote, add 1
          else if (isHelpful === undefined) {
            setHelpfulCount(prev => prev + 1);
          }
          setIsHelpful(true);
        }
      }
    } catch (error) {
      console.error('Error voting on review:', error);
      toast.error('Failed to register your vote. Please try again.');
    }
  };

  return (
    <div className="mt-4 flex items-center">
      <button 
        onClick={handleVote}
        disabled={isOwner || !user}
        className={`flex items-center gap-1 px-2 py-1 rounded text-sm ${
          isHelpful 
            ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' 
            : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'
        } ${isOwner || !user ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        aria-label={isHelpful ? "Remove helpful vote" : "Mark as helpful"}
      >
        <ThumbsUp className={`h-4 w-4 ${isHelpful ? 'fill-current' : ''}`} />
        <span>{helpfulCount > 0 ? helpfulCount : ''} Helpful</span>
      </button>
    </div>
  );
};

export default ReviewItemActions;
