import React, { useState } from 'react';
import { format } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';
import { Review } from '@/lib/types';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Star, ThumbsUp, Trash, Edit } from 'lucide-react';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { deleteReview, voteReview, removeVote } from '@/lib/reviews';
import { toast } from 'sonner';
import ReviewForm from './ReviewForm';
import { Button } from '@/components/ui/button';

interface ReviewItemProps {
  review: Review;
  onReviewUpdated: (updatedReview: Review) => void;
  onReviewDeleted: (reviewId: string) => void;
}

const ReviewItem: React.FC<ReviewItemProps> = ({ 
  review, 
  onReviewUpdated, 
  onReviewDeleted 
}) => {
  const { user } = useAuth();
  const [isHelpful, setIsHelpful] = useState<boolean | undefined>(review.is_helpful);
  const [helpfulCount, setHelpfulCount] = useState(review.helpful_count || 0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const isOwner = user && user.id === review.user_id;
  
  const formattedDate = review.updated_at 
    ? format(new Date(review.updated_at), 'MMM d, yyyy')
    : format(new Date(review.created_at), 'MMM d, yyyy');
  
  const getInitials = () => {
    const firstName = review.user_profile?.first_name || '';
    const lastName = review.user_profile?.last_name || '';
    
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    } else if (firstName) {
      return firstName[0].toUpperCase();
    }
    
    return 'U';
  };
  
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
  
  const handleVote = async () => {
    if (!user) {
      toast.error('You must be logged in to vote on reviews');
      return;
    }
    
    if (user.id === review.user_id) {
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
  
  const handleDelete = async () => {
    if (!isOwner) return;
    
    try {
      const success = await deleteReview(review.id);
      if (success) {
        onReviewDeleted(review.id);
        toast.success('Your review has been deleted');
      } else {
        throw new Error('Failed to delete review');
      }
    } catch (error) {
      console.error('Error deleting review:', error);
      toast.error('Failed to delete review. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };
  
  if (isEditing) {
    return (
      <div className="border rounded-lg p-4 mb-4">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-medium">Edit your review</h4>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setIsEditing(false)}
          >
            Cancel
          </Button>
        </div>
        
        <ReviewForm 
          restaurantId={review.restaurant_id}
          existingReview={review}
          onReviewSubmitted={(updatedReview) => {
            onReviewUpdated(updatedReview);
            setIsEditing(false);
          }}
        />
      </div>
    );
  }
  
  return (
    <div className="border rounded-lg p-4 mb-4">
      <div className="flex items-start gap-4">
        <Avatar className="h-10 w-10">
          <AvatarFallback className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            {getInitials()}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
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
                  onClick={() => setIsEditing(true)} 
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  aria-label="Edit review"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button 
                  onClick={() => setIsDeleting(true)} 
                  className="text-gray-400 hover:text-red-500"
                  aria-label="Delete review"
                >
                  <Trash className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
          
          <p className="mt-2 text-gray-700 dark:text-gray-300">{review.content}</p>
          
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
        </div>
      </div>
      
      <AlertDialog open={isDeleting} onOpenChange={setIsDeleting}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Review</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete your review? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ReviewItem;
