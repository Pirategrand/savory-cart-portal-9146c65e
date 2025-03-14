
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const CheckoutSkeleton: React.FC = () => (
  <div className="space-y-6">
    <div className="flex items-center text-muted-foreground mb-6">
      <Skeleton className="h-4 w-4 mr-1" />
      <Skeleton className="h-4 w-28" />
    </div>
    
    <div className="md:grid md:grid-cols-3 md:gap-10">
      <div className="md:col-span-2 space-y-6">
        <Skeleton className="h-8 w-40 mb-2" />
        
        {/* Cart Items */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 subtle-shadow">
          <Skeleton className="h-8 w-48 mb-6" />
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-4">
                <Skeleton className="h-20 w-20 rounded-md" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-8 w-24" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Delivery Details */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 subtle-shadow">
          <Skeleton className="h-6 w-36 mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
        
        {/* Payment Method */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 subtle-shadow">
          <Skeleton className="h-6 w-36 mb-4" />
          <div className="flex gap-4 mb-6">
            <Skeleton className="h-10 w-32 rounded-md" />
            <Skeleton className="h-10 w-32 rounded-md" />
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-14" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Order Summary */}
      <div className="md:col-span-1">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 subtle-shadow">
          <Skeleton className="h-6 w-32 mb-4" />
          <div className="space-y-3 mb-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
            <Skeleton className="h-px w-full my-3" />
            <div className="flex justify-between">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-20" />
            </div>
          </div>
          <Skeleton className="h-12 w-full mb-4" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-4/5 mx-auto mt-1" />
        </div>
      </div>
    </div>
  </div>
);

export default CheckoutSkeleton;
