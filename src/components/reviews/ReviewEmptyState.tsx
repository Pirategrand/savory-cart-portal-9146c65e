
import React from 'react';

const ReviewEmptyState: React.FC = () => {
  return (
    <div className="py-8 text-center border rounded-lg">
      <p className="text-muted-foreground">
        No reviews yet. Be the first to share your experience!
      </p>
    </div>
  );
};

export default ReviewEmptyState;
