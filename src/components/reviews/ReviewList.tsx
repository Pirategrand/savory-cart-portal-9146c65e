
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Review } from '@/lib/types';
import { getReviewsByRestaurantId, getReviewVotes, getUserVotes } from '@/lib/reviews';
import ReviewItem from './ReviewItem';
import ReviewForm from './ReviewForm';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle } from 'lucide-react';

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
      
      if (fetchedReviews.length > 0) {
        // Get review IDs
        const reviewIds = fetchedReviews.map(review => review.id);
        
        // Get vote counts for all reviews
        const voteCountMap = await getReviewVotes(reviewIds);
        
        // Get user votes if logged in
        let userVoteMap = new Map<string, boolean>();
        if (user) {
          userVoteMap = await getUserVotes(reviewIds, user.id);
        }
        
        // Enrich reviews with vote information
        const enrichedReviews = fetchedReviews.map(review => ({
          ...review,
          helpful_count: voteCountMap.get(review.id) || 0,
          is_helpful: userVoteMap.get(review.id) || undefined
        }));
        
        setReviews(enrichedReviews);
        
        // Check if user has already submitted a review
        if (user) {
          const foundUserReview = enrichedReviews.find(review => review.user_id === user.id);
          if (foundUserReview) {
            setUserReview(foundUserReview);
          } else {
            setUserReview(null);
          }
        }
      } else {
        setReviews([]);
        setUserReview(null);
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
  
  const sortedReviews = [...reviews].sort((a, b) => {
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
  
  const displayReviews = userReview
    ? [userReview, ...sortedReviews.filter(review => review.id !== userReview.id)]
    : sortedReviews;
  
  if (loading) {
    return <div className="py-8 text-center text-muted-foreground">Loading reviews...</div>;
  }
  
  if (error) {
    return (
      <div className="py-8 text-center text-red-500 flex flex-col items-center justify-center">
        <AlertCircle className="h-8 w-8 mb-2" />
        <p>{error}</p>
        <Button onClick={fetchReviews} variant="outline" className="mt-4">
          Try Again
        </Button>
      </div>
    );
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
        
        <div className="flex items-center gap-2">
          <Label htmlFor="sort-by" className="text-sm whitespace-nowrap">
            Sort by:
          </Label>
          <Select value={sortBy} onValueChange={(value) => setSortBy(value as any)}>
            <SelectTrigger id="sort-by" className="w-[130px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="highest">Highest Rating</SelectItem>
              <SelectItem value="lowest">Lowest Rating</SelectItem>
              <SelectItem value="helpful">Most Helpful</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {displayReviews.length > 0 ? (
        <div>
          {displayReviews.map((review) => (
            <ReviewItem 
              key={review.id} 
              review={review}
              onReviewUpdated={handleReviewUpdated}
              onReviewDeleted={handleReviewDeleted}
            />
          ))}
        </div>
      ) : (
        <div className="py-8 text-center border rounded-lg">
          <p className="text-muted-foreground">
            No reviews yet. Be the first to share your experience!
          </p>
        </div>
      )}
    </div>
  );
};

export default ReviewList;
