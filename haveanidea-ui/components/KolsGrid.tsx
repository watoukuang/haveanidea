import React, { useMemo, useState, useEffect } from 'react';
import KolCard from './KolCard';
import { KolItem, KolsGridProps, KolPlatform, TabItem } from '../types';

export default function KolsGrid({ items, platform = 'all' }: KolsGridProps): React.ReactElement {
  const [active, setActive] = useState<KolPlatform | 'all'>(platform);
  const [page, setPage] = useState<number>(1);
  const pageSize = 20;
  const tabs: TabItem[] = [
    { key: 'all', label: '全部' },
    { key: 'twitter', label: 'Twitter' },
    { key: 'reddit', label: 'Reddit' },
    { key: 'youtube', label: 'YouTube' },
  ];

  const list = useMemo(() => {
    return active === 'all' ? items : items.filter((i) => i.platform === active);
  }, [items, active]);

  // 切换 Tab 时重置页码
  useEffect(() => { setPage(1); }, [active, items]);

  const totalPages = Math.max(1, Math.ceil((list?.length || 0) / pageSize));
  const current = useMemo(() => {
    const start = (page - 1) * pageSize;
    return list.slice(start, start + pageSize);
  }, [list, page]);
  const go = (p: number) => setPage(Math.min(totalPages, Math.max(1, p)));

  return (
    <>
      {/* 动态 Tabs */}
      <div className="mb-4 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button key={t.key}
                  onClick={() => setActive(t.key as KolPlatform | 'all')}
                  className={`px-3 py-1.5 rounded-full border text-sm ${
                    active === t.key
                      ? 'bg-black text-white dark:bg-white dark:text-black'
                      : 'bg-white text-gray-800 dark:bg-[#1a1b1e] dark:text-gray-200 dark:border-[#2a2c31]'
                  }`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
        {current.length ? (
          current.map((k: KolItem) => <KolCard key={k.id} kol={k} />)
        ) : (
          <div className="col-span-full text-center py-10">
            <p className="text-gray-500 dark:text-gray-400">暂无数据</p>
          </div>
        )}
      </div>

      {/* 分页控件 */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          <button
            onClick={() => go(page - 1)}
            disabled={page === 1}
            className="px-3 py-1.5 rounded-md border text-sm bg-white disabled:opacity-50 dark:bg-[#1a1b1e] dark:border-[#2a2c31]"
          >
            上一页
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => go(p)}
              className={`px-3 py-1.5 rounded-md border text-sm hidden sm:inline-block ${
                p === page
                  ? 'bg-black text-white dark:bg-white dark:text-black'
                  : 'bg-white dark:bg-[#1a1b1e] dark:border-[#2a2c31]'
              }`}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => go(page + 1)}
            disabled={page === totalPages}
            className="px-3 py-1.5 rounded-md border text-sm bg-white disabled:opacity-50 dark:bg-[#1a1b1e] dark:border-[#2a2c31]"
          >
            下一页
          </button>
        </div>
      )}
    </>
  );
}
