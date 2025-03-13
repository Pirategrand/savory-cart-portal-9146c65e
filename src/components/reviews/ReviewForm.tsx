
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Star } from 'lucide-react';
import { submitReview, updateReview } from '@/lib/reviews';
import { Review } from '@/lib/types';

interface ReviewFormProps {
  restaurantId: string;
  onReviewSubmitted: (review: Review) => void;
  existingReview?: Review;
  className?: string;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ 
  restaurantId, 
  onReviewSubmitted, 
  existingReview,
  className = ''
}) => {
  const { user } = useAuth();
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [hoverRating, setHoverRating] = useState(0);
  const [content, setContent] = useState(existingReview?.content || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('You must be logged in to submit a review');
      return;
    }
    
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }
    
    if (!content.trim()) {
      toast.error('Please enter a review');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      let review: Review | null;
      
      if (existingReview) {
        review = await updateReview(existingReview.id, rating, content);
        if (review) {
          toast.success('Your review has been updated!');
        }
      } else {
        review = await submitReview(restaurantId, rating, content, user.id);
        if (review) {
          toast.success('Your review has been submitted!');
        }
      }
      
      if (review) {
        onReviewSubmitted(review);
        
        // Clear form if it's a new review
        if (!existingReview) {
          setRating(0);
          setContent('');
        }
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 ${className}`}>
      <div className="space-y-2">
        <label className="text-sm font-medium">Your Rating</label>
        <div className="flex space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="focus:outline-none"
            >
              <Star 
                className={`h-6 w-6 transition-all ${
                  (hoverRating ? star <= hoverRating : star <= rating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300 dark:text-gray-600'
                }`}
              />
            </button>
          ))}
        </div>
      </div>
      
      <div className="space-y-2">
        <label htmlFor="review" className="text-sm font-medium">Your Review</label>
        <Textarea
          id="review"
          placeholder="Share your experience with this restaurant..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
          className="resize-none"
        />
      </div>
      
      <Button 
        type="submit" 
        disabled={isSubmitting || !user}
        className="bg-orange-500 hover:bg-orange-600 text-white"
      >
        {isSubmitting 
          ? 'Submitting...' 
          : existingReview 
            ? 'Update Review' 
            : 'Submit Review'
        }
      </Button>
      
      {!user && (
        <p className="text-sm text-muted-foreground mt-2">
          Please log in to submit a review.
        </p>
      )}
    </form>
  );
};

export default ReviewForm;
