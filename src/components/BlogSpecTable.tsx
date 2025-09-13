import React from 'react';

export type SpecRow = { label: string; value: string };

type BlogSpecTableProps = {
  rows: SpecRow[];
};

const BlogSpecTable: React.FC<BlogSpecTableProps> = ({ rows }) => {
  if (!Array.isArray(rows) || rows.length === 0) return null;
  return (
    <div className="overflow-hidden rounded-xl ring-1 ring-gray-200">
      <table className="w-full text-sm">
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className={i % 2 ? 'bg-gray-50' : 'bg-white'}>
              <td className="w-44 px-4 py-2 font-semibold text-gray-700 align-top">{r.label}</td>
              <td className="px-4 py-2 text-gray-900" dangerouslySetInnerHTML={{ __html: r.value }} />
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BlogSpecTable;




