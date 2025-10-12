import React from 'react';
import { KolCardProps } from '../types';

export default function KolCard({ kol }: KolCardProps): React.ReactElement {
  const isImage = kol.avatar && (kol.avatar.startsWith('http://') || kol.avatar.startsWith('https://'));
  return (
    <a href={kol.url} target="_blank" rel="noopener noreferrer"
       className="card group transition-transform hover:-translate-y-0.5 duration-200 hover:shadow-lg block">
      <div className="flex items-start">
        <div className="h-10 w-10 mr-3 rounded-xl flex items-center justify-center ring-1 ring-black/5 dark:ring-white/5 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-[#26292e] dark:to-[#1a1b1e] overflow-hidden">
          {isImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={kol.avatar} alt={kol.name} className="h-full w-full object-cover" />
          ) : (
            <span aria-hidden className="text-base select-none">
              {kol.avatar || '👤'}
            </span>
          )}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-[15px] md:text-base leading-snug truncate">{kol.name}</h3>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-700 dark:bg-[#26292e] dark:text-gray-300">
              {kol.platform.toUpperCase()}
            </span>
          </div>
          <p className="text-[13px] text-gray-700 dark:text-gray-300 line-clamp-2">{kol.description}</p>
        </div>
      </div>
    </a>
  );
}
