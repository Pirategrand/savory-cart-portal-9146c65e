
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface ReviewItemContentProps {
  content: string;
  isLoading?: boolean;
}

const ReviewItemContent: React.FC<ReviewItemContentProps> = ({ content, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="mt-2 space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    );
  }
  
  return (
    <p className="mt-2 text-gray-700 dark:text-gray-300">{content}</p>
  );
};

export default ReviewItemContent;
