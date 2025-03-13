
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ReviewErrorProps {
  error: string;
  onRetry: () => void;
}

const ReviewError: React.FC<ReviewErrorProps> = ({ error, onRetry }) => {
  return (
    <div className="py-8 text-center text-red-500 flex flex-col items-center justify-center">
      <AlertCircle className="h-8 w-8 mb-2" />
      <p>{error}</p>
      <Button onClick={onRetry} variant="outline" className="mt-4">
        Try Again
      </Button>
    </div>
  );
};

export default ReviewError;
