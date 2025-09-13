import React from 'react';

type BlogKeypointsProps = {
  items: string[];
};

const BlogKeypoints: React.FC<BlogKeypointsProps> = ({ items }) => {
  if (!Array.isArray(items) || items.length === 0) return null;
  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 my-4">
      {items.map((it, i) => (
        <li key={i} className="flex items-start gap-2 text-gray-900">
          <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-orange-100 text-[#f75000]">✓</span>
          <span dangerouslySetInnerHTML={{ __html: it }} />
        </li>
      ))}
    </ul>
  );
};

export default BlogKeypoints;




