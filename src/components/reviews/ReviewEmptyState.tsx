
import React from 'react';
import { MessageSquareOff } from 'lucide-react';

const ReviewEmptyState: React.FC = () => {
  return (
    <div className="py-12 text-center border rounded-lg flex flex-col items-center justify-center">
      <MessageSquareOff className="h-12 w-12 text-muted-foreground mb-4" />
      <p className="text-muted-foreground">
        No reviews yet. Be the first to share your experience!
      </p>
    </div>
  );
};

export default ReviewEmptyState;
