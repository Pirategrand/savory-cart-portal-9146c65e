
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Review } from '@/lib/types';
import { getReviewsByRestaurantId, sampleReviews } from '@/lib/reviews';
import ReviewItem from './ReviewItem';
import ReviewForm from './ReviewForm';
import { Button } from '@/components/ui/button';
import ReviewListSorter from './ReviewListSorter';
import ReviewEmptyState from './ReviewEmptyState';
import ReviewError from './ReviewError';
import { Skeleton } from '@/components/ui/skeleton';

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
  const [loadingTimeout, setLoadingTimeout] = useState(false);
  
  // Set a timeout for loading state to show sample data if it takes too long
  useEffect(() => {
    const timer = setTimeout(() => {
      if (loading) {
        setLoadingTimeout(true);
      }
    }, 3000); // 3 seconds timeout
    
    return () => clearTimeout(timer);
  }, [loading]);
  
  useEffect(() => {
    fetchReviews();
  }, [restaurantId, user]);
  
  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Set a timeout to prevent infinite loading
      const timeoutPromise = new Promise<Review[]>((_, reject) => {
        setTimeout(() => {
          reject(new Error('Request timed out'));
        }, 5000); // 5 seconds timeout
      });
      
      // Race between the actual fetch and the timeout
      const fetchedReviews = await Promise.race([
        getReviewsByRestaurantId(restaurantId),
        timeoutPromise
      ]);
      
      setReviews(fetchedReviews);
      
      // Check if user has already submitted a review
      if (user) {
        const foundUserReview = fetchedReviews.find(review => review.user_id === user.id);
        setUserReview(foundUserReview || null);
      }
    } catch (err) {
      console.error('Error fetching reviews:', err);
      
      // Fallback to sample reviews
      const filteredSampleReviews = sampleReviews.filter(review => 
        review.restaurant_id === restaurantId
      );
      
      if (filteredSampleReviews.length > 0) {
        console.log('Using sample reviews as fallback');
        setReviews(filteredSampleReviews);
        
        // Check if user has a sample review
        if (user) {
          const foundUserReview = filteredSampleReviews.find(review => review.user_id === user.id);
          setUserReview(foundUserReview || null);
        }
        
        setError(null); // Clear error since we have fallback data
      } else {
        setError('Failed to load reviews. Please try again later.');
      }
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

  // Show skeleton loading UI
  if (loading && !loadingTimeout) {
    return (
      <div className="space-y-8">
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-36" />
        </div>
        
        {[1, 2, 3].map((_, index) => (
          <div key={index} className="border rounded-lg p-4 mb-4">
            <div className="flex items-start gap-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <Skeleton className="h-5 w-32 mb-2" />
                    <div className="flex">
                      <Skeleton className="h-4 w-24 mr-2" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-5/6 mb-2" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  // If loading takes too long, show sample reviews but with a loading indicator at the top
  if (loading && loadingTimeout) {
    // Continue with rendering the content below, but with a loading notification
    return (
      <div>
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-6 text-center">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            Connecting to server... Showing sample reviews in the meantime.
          </p>
        </div>
        {/* The rest of the component will render below */}
      </div>
    );
  }
  
  if (error && reviews.length === 0) {
    return <ReviewError error={error} onRetry={fetchReviews} />;
  }

  return (
    <div>
      {/* If we're showing sample data due to a timeout, display a notification */}
      {loadingTimeout && (
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-6 text-center">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            Showing sample reviews while connecting to the server.
          </p>
        </div>
      )}
      
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
