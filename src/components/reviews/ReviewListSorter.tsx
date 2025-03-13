
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface ReviewListSorterProps {
  value: string;
  onValueChange: (value: string) => void;
}

const ReviewListSorter: React.FC<ReviewListSorterProps> = ({ value, onValueChange }) => {
  return (
    <div className="flex items-center gap-2">
      <Label htmlFor="sort-by" className="text-sm whitespace-nowrap">
        Sort by:
      </Label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger id="sort-by" className="w-[130px]">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">Newest</SelectItem>
          <SelectItem value="highest">Highest Rating</SelectItem>
          <SelectItem value="lowest">Lowest Rating</SelectItem>
          <SelectItem value="helpful">Most Helpful</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default ReviewListSorter;
