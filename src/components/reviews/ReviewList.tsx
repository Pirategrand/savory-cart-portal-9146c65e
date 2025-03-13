
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Review } from '@/lib/types';
import { getReviewsByRestaurantId } from '@/lib/reviews';
import ReviewItem from './ReviewItem';
import ReviewForm from './ReviewForm';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { AlertCircle } from 'lucide-react';
import ReviewListSorter from './ReviewListSorter';
import ReviewEmptyState from './ReviewEmptyState';
import ReviewError from './ReviewError';

interface ReviewListProps {
  restaurantId: string;
}

const ReviewList: React.FC<ReviewListProps> = ({ restaurantId }) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'newest' | 'highest' | 'lowest' | 'helpful'>('newest');
  const [userReview, setUserReview] = useState<Review | null>(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  
  useEffect(() => {
    fetchReviews();
  }, [restaurantId, user]);
  
  const fetchReviews = async () => {
    try {
      setLoading(true);
      const fetchedReviews = await getReviewsByRestaurantId(restaurantId);
      setReviews(fetchedReviews);
      
      // Check if user has already submitted a review
      if (user) {
        const foundUserReview = fetchedReviews.find(review => review.user_id === user.id);
        setUserReview(foundUserReview || null);
      }
    } catch (err) {
      console.error('Error fetching reviews:', err);
      setError('Failed to load reviews. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleReviewSubmitted = (newReview: Review) => {
    fetchReviews();
    setShowReviewForm(false);
  };
  
  const handleReviewUpdated = (updatedReview: Review) => {
    setReviews(prevReviews => 
      prevReviews.map(review => 
        review.id === updatedReview.id ? { ...review, ...updatedReview } : review
      )
    );
    
    if (userReview && userReview.id === updatedReview.id) {
      setUserReview(updatedReview);
    }
  };
  
  const handleReviewDeleted = (reviewId: string) => {
    setReviews(prevReviews => prevReviews.filter(review => review.id !== reviewId));
    
    if (userReview && userReview.id === reviewId) {
      setUserReview(null);
    }
  };
  
  const getSortedReviews = () => {
    const sorted = [...reviews].sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'highest':
          return b.rating - a.rating;
        case 'lowest':
          return a.rating - b.rating;
        case 'helpful':
          return (b.helpful_count || 0) - (a.helpful_count || 0);
        default:
          return 0;
      }
    });
    
    // Always show user's review at the top if it exists
    return userReview
      ? [userReview, ...sorted.filter(review => review.id !== userReview.id)]
      : sorted;
  };

  if (loading) {
    return <div className="py-8 text-center text-muted-foreground">Loading reviews...</div>;
  }
  
  if (error) {
    return <ReviewError error={error} onRetry={fetchReviews} />;
  }

  return (
    <div>
      {user && !userReview && !showReviewForm && (
        <div className="mb-6">
          <Button 
            onClick={() => setShowReviewForm(true)}
            className="bg-orange-500 hover:bg-orange-600 text-white"
          >
            Write a Review
          </Button>
        </div>
      )}
      
      {showReviewForm && (
        <div className="mb-8 border-b pb-8">
          <h3 className="text-xl font-medium mb-4">Write Your Review</h3>
          <ReviewForm 
            restaurantId={restaurantId}
            onReviewSubmitted={handleReviewSubmitted}
            className="max-w-xl"
          />
        </div>
      )}
      
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-medium">
          Customer Reviews 
          <span className="text-sm font-normal text-muted-foreground ml-2">
            ({reviews.length})
          </span>
        </h3>
        
        <ReviewListSorter value={sortBy} onValueChange={(value) => setSortBy(value as any)} />
      </div>
      
      {getSortedReviews().length > 0 ? (
        <div>
          {getSortedReviews().map((review) => (
            <ReviewItem 
              key={review.id} 
              review={review}
              onReviewUpdated={handleReviewUpdated}
              onReviewDeleted={handleReviewDeleted}
            />
          ))}
        </div>
      ) : (
        <ReviewEmptyState />
      )}
    </div>
  );
};

export default ReviewList;
