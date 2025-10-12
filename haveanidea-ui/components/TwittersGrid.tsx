import React, { useMemo, useState } from 'react';
import TwitterCard from './TwitterCard';
import { TwitterItem, TwittersGridProps } from '../types';

export default function TwittersGrid({ items }: TwittersGridProps): React.ReactElement {
  const list = useMemo(() => {
    return [...items].sort((a, b) => (b.created || 0) - (a.created || 0));
  }, [items]);
  const [page, setPage] = useState<number>(1);
  const pageSize = 20;
  const totalPages = Math.max(1, Math.ceil((list?.length || 0) / pageSize));
  const current = useMemo(() => {
    const start = (page - 1) * pageSize;
    return list.slice(start, start + pageSize);
  }, [list, page]);
  const go = (p: number) => setPage(Math.min(totalPages, Math.max(1, p)));
  React.useEffect(() => { setPage(1); }, [list]);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
        {current && current.length > 0 ? (
          current.map((it: TwitterItem) => (
            <TwitterCard key={it.id} twitter={it} />
          ))
        ) : (
          <div className="col-span-full text-center py-10">
            <p className="text-gray-500 dark:text-gray-400">暂无数据</p>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          <button onClick={() => go(page - 1)} disabled={page === 1}
                  className="px-3 py-1.5 rounded-md border text-sm bg-white disabled:opacity-50 dark:bg-[#1a1b1e] dark:border-[#2a2c31]">上一页</button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button key={p} onClick={() => go(p)}
                    className={`px-3 py-1.5 rounded-md border text-sm hidden sm:inline-block ${p === page ? 'bg-black text-white dark:bg-white dark:text-black' : 'bg-white dark:bg-[#1a1b1e] dark:border-[#2a2c31]'}`}>{p}</button>
          ))}
          <button onClick={() => go(page + 1)} disabled={page === totalPages}
                  className="px-3 py-1.5 rounded-md border text-sm bg-white disabled:opacity-50 dark:bg-[#1a1b1e] dark:border-[#2a2c31]">下一页</button>
        </div>
      )}
    </>
  );
}
