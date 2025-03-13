
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ReviewErrorProps {
  error: string;
  onRetry: () => void;
}

const ReviewError: React.FC<ReviewErrorProps> = ({ error, onRetry }) => {
  return (
    <div className="py-8 text-center flex flex-col items-center justify-center">
      <AlertCircle className="h-8 w-8 mb-2 text-red-500" />
      <p className="text-red-500 mb-4">{error}</p>
      <Button onClick={onRetry} variant="outline" className="mt-2">
        Try Again
      </Button>
    </div>
  );
};

export default ReviewError;
