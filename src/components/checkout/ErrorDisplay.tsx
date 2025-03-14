
import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface ErrorDisplayProps {
  errorMessage: string;
  onRetry: () => void;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ errorMessage, onRetry }) => {
  return (
    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 mb-8">
      <div className="flex flex-col items-center text-center">
        <AlertTriangle className="h-8 w-8 text-red-500 mb-2" />
        <h3 className="text-lg font-medium text-red-700 dark:text-red-400">Order Submission Failed</h3>
        <p className="text-red-600 dark:text-red-300 mb-4">{errorMessage}</p>
        <Button 
          onClick={onRetry}
          variant="outline" 
          className="border-red-300 dark:border-red-700 text-red-700 dark:text-red-400"
        >
          Try Again
        </Button>
      </div>
    </div>
  );
};

export default ErrorDisplay;
