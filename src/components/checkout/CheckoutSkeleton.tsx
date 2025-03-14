
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const CheckoutSkeleton: React.FC = () => (
  <div className="space-y-6">
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 subtle-shadow">
      <Skeleton className="h-8 w-48 mb-6" />
      <div className="space-y-6">
        {[1, 2].map((i) => (
          <div key={i} className="flex gap-4">
            <Skeleton className="h-20 w-20 rounded-md" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-1/4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default CheckoutSkeleton;
