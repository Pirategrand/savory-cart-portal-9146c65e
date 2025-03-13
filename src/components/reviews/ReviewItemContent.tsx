
import React from 'react';

interface ReviewItemContentProps {
  content: string;
}

const ReviewItemContent: React.FC<ReviewItemContentProps> = ({ content }) => {
  return (
    <p className="mt-2 text-gray-700 dark:text-gray-300">{content}</p>
  );
};

export default ReviewItemContent;
