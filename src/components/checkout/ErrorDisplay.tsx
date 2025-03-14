
import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, WifiOff, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ErrorDisplayProps {
  errorMessage: string;
  onRetry: () => void;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ errorMessage, onRetry }) => {
  const isNetworkError = errorMessage.toLowerCase().includes('network') || 
                         errorMessage.toLowerCase().includes('internet') ||
                         errorMessage.toLowerCase().includes('offline') ||
                         errorMessage.toLowerCase().includes('connection') ||
                         errorMessage.toLowerCase().includes('timeout');

  return (
    <div className={`${
      isNetworkError ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800' : 
                      'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
    } border rounded-xl p-6 mb-8`}>
      <div className="flex flex-col items-center text-center">
        {isNetworkError ? (
          <WifiOff className={`h-8 w-8 text-yellow-500 mb-2`} />
        ) : (
          <AlertTriangle className={`h-8 w-8 text-red-500 mb-2`} />
        )}
        
        <h3 className={`text-lg font-medium ${
          isNetworkError ? 'text-yellow-700 dark:text-yellow-400' : 'text-red-700 dark:text-red-400'
        } mb-1`}>
          {isNetworkError ? 'Connection Error' : 'Order Submission Failed'}
        </h3>
        
        <p className={`${
          isNetworkError ? 'text-yellow-600 dark:text-yellow-300' : 'text-red-600 dark:text-red-300'
        } mb-4`}>
          {errorMessage}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            onClick={onRetry}
            variant="outline" 
            className={`${
              isNetworkError 
                ? 'border-yellow-300 dark:border-yellow-700 text-yellow-700 dark:text-yellow-400'
                : 'border-red-300 dark:border-red-700 text-red-700 dark:text-red-400'
            } flex items-center`}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
          
          <Link to="/">
            <Button 
              variant="ghost" 
              className="text-muted-foreground hover:text-foreground flex items-center"
            >
              <Home className="h-4 w-4 mr-2" />
              Return Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ErrorDisplay;
