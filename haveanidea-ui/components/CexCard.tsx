import React from 'react';
import { ToolCardProps, Tag } from '../types';

export default function CexCard({ cex }: ToolCardProps): React.ReactElement {
  // 相对时间格式
  const formatTime = (ts: number) => {
    try {
      const diff = Date.now() - (ts * (ts > 1e12 ? 1 : 1000)); // 兼容秒/毫秒
      const abs = Math.max(0, diff);
      const m = Math.floor(abs / 60000);
      if (m < 1) return '刚刚';
      if (m < 60) return `${m} 分钟前`;
      const h = Math.floor(m / 60);
      if (h < 24) return `${h} 小时前`;
      const d = Math.floor(h / 24);
      if (d < 7) return `${d} 天前`;
      const date = new Date(ts * (ts > 1e12 ? 1 : 1000));
      return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
    } catch { return ''; }
  };

  const first: Tag | undefined = cex.messages?.[0];

  return (
    <div className="group rounded-xl overflow-hidden border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow dark:bg-[#15171b] dark:border-[#23252a]">
      {/* Thumbnail area */}
      <div className="relative aspect-[16/10] bg-gray-100 dark:bg-[#1d2026] flex items-center justify-center">
        <div className="h-16 w-16 rounded-2xl flex items-center justify-center text-4xl select-none" style={{ backgroundColor: cex.bg_color || '#eef2ff' }}>
          <span style={{ fontFamily: 'Apple Color Emoji, Segoe UI Emoji, Noto Color Emoji, emoji' }}>{cex.icon}</span>
        </div>
        <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden>
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-white/5 dark:to-white/10"/>
        </div>
      </div>

      {/* Body */}
      <div className="p-3.5 md:p-4">
        <h3 className="font-semibold text-[15px] md:text-base leading-snug line-clamp-1">{cex.name}</h3>
        {first ? (
          <p className="mt-1 text-[12.5px] text-gray-600 dark:text-gray-400 line-clamp-2">{first.title}</p>
        ) : (
          <p className="mt-1 text-[12.5px] text-gray-500 dark:text-gray-500">暂无简介</p>
        )}

        {/* Footer meta */}
        <div className="mt-3 flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400">
          <span>{first ? `更新于 ${formatTime(first.created)}` : '未更新'}</span>
          {first?.href && (
            <a href={first.href} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline dark:text-indigo-400">详情</a>
          )}
        </div>
      </div>
    </div>
  );
}
