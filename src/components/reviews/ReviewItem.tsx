
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Review } from '@/lib/types';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { deleteReview } from '@/lib/reviews';
import { toast } from 'sonner';
import ReviewForm from './ReviewForm';
import { Button } from '@/components/ui/button';
import ReviewItemHeader from './ReviewItemHeader';
import ReviewItemContent from './ReviewItemContent';
import ReviewItemActions from './ReviewItemActions';
import ReviewDeleteDialog from './ReviewDeleteDialog';

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
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const isOwner = user && user.id === review.user_id;
  
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
            {getInitials(review)}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <ReviewItemHeader 
            review={review} 
            isOwner={isOwner} 
            onEditClick={() => setIsEditing(true)}
            onDeleteClick={() => setIsDeleting(true)}
          />
          
          <ReviewItemContent content={review.content} />
          
          <ReviewItemActions 
            review={review} 
            user={user} 
            isOwner={isOwner}
          />
        </div>
      </div>
      
      <ReviewDeleteDialog 
        isOpen={isDeleting} 
        onOpenChange={setIsDeleting}
        onConfirm={handleDelete}
      />
    </div>
  );
};

// Helper function to get user initials
const getInitials = (review: Review): string => {
  const firstName = review.user_profile?.first_name || '';
  const lastName = review.user_profile?.last_name || '';
  
  if (firstName && lastName) {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  } else if (firstName) {
    return firstName[0].toUpperCase();
  }
  
  return 'U';
};

export default ReviewItem;
