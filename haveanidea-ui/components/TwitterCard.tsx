import React from 'react';
import { TwitterCardProps } from '../types';

export default function TwitterCard({ twitter }: TwitterCardProps): React.ReactElement {
  const formatTime = (ts: number) => {
    try {
      const diff = Date.now() - (ts * (ts > 1e12 ? 1 : 1000));
      const m = Math.floor(Math.max(0, diff) / 60000);
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
  return (
    <div className="card group transition-transform hover:-translate-y-0.5 duration-200 hover:shadow-lg">
      <div className="flex items-start mb-2">
        <div
          className="h-10 w-10 mr-3 rounded-xl flex items-center justify-center ring-1 ring-black/5"
          style={{ backgroundColor: twitter.bg_color || '#f3f4f6' }}
          aria-hidden
        >
          <span
            className="text-base select-none"
            style={{
              color: 'initial',
              filter: 'none',
              mixBlendMode: 'normal',
              fontFamily: 'Apple Color Emoji, Segoe UI Emoji, Noto Color Emoji, emoji'
            }}
          >
            {twitter.icon}
          </span>
        </div>
        <div className="min-w-0">
          <h3 className="font-semibold text-[15px] md:text-base leading-snug truncate">{twitter.name}</h3>
          <p className="text-[13px] text-gray-700 dark:text-gray-300 line-clamp-3">{twitter.messages}</p>
          <div className="mt-1 text-[11px] text-gray-500 dark:text-gray-400">{formatTime(twitter.created)}</div>
        </div>
      </div>
    </div>
  );
}
