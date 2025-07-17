import React from 'react';

type GoogleReviewProps = {
  author: string;
  content: string;
  rating: number;
};

const GoogleReview: React.FC<GoogleReviewProps> = ({ author, content, rating }) => (
  <div className="bg-white shadow rounded p-4 mb-4">
    <div className="flex items-center mb-2">
      <span className="font-bold mr-2">{author}</span>
      <span className="text-yellow-400">{'★'.repeat(rating)}</span>
    </div>
    <p>{content}</p>
  </div>
);

export default GoogleReview; 