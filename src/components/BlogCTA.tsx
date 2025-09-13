import React from 'react';

type BlogCTAProps = {
  href: string;
  label: string;
};

const BlogCTA: React.FC<BlogCTAProps> = ({ href, label }) => {
  return (
    <div className="not-prose mt-6">
      <a
        href={href}
        className="inline-flex items-center justify-center rounded-full bg-[#f75000] px-5 py-3 text-white shadow hover:bg-[#ff7a33] transition"
      >
        {label}
      </a>
    </div>
  );
};

export default BlogCTA;




