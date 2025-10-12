import React, { useEffect, useRef, useState } from 'react';
import { FilterDropdownProps } from '../types';

export default function FilterDropdown({ label, options, value, onChange }: FilterDropdownProps): React.ReactElement {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [query, setQuery] = useState<string>('');
  const rootRef = useRef<HTMLDivElement | null>(null);
  const btnRef = useRef<HTMLButtonElement | null>(null);

  // 点击外部关闭
  useEffect(() => {
    const onDocMouseDown = (e: MouseEvent) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target as Node)) setIsOpen(false);
    };
    if (isOpen) document.addEventListener('mousedown', onDocMouseDown);
    return () => document.removeEventListener('mousedown', onDocMouseDown);
  }, [isOpen]);

  // 键盘 Esc 关闭
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    if (isOpen) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen]);

  // 焦点移出（Tab 导航）时关闭
  useEffect(() => {
    const onFocusIn = (e: FocusEvent) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target as Node)) setIsOpen(false);
    };
    if (isOpen) document.addEventListener('focusin', onFocusIn);
    return () => document.removeEventListener('focusin', onFocusIn);
  }, [isOpen]);
  
  return (
    <div className="relative" ref={rootRef}>
      <button 
        ref={btnRef}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-44 px-4 py-2 rounded-md border bg-white text-gray-800 border-gray-200 shadow-sm
                   dark:bg-[#1a1b1e] dark:text-gray-200 dark:border-[#2a2c31]"
      >
        <span>{value || label}</span>
        <svg 
          className={`w-4 h-4 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isOpen && (
        <div
          className="absolute z-30 w-60 md:w-64 mt-1 rounded-md border bg-white text-gray-800 shadow-lg ring-1 ring-black/5
                        dark:bg-[#1a1b1e] dark:text-gray-200 dark:border-[#2a2c31]"
          onMouseLeave={() => setIsOpen(false)}
          role="listbox"
          aria-label={label}
        >
          {/* 关键字过滤 */}
          <div className="p-2 border-b border-gray-200 dark:border-[#2a2c31]">
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`搜索${label}`}
              className="w-full px-2 py-1.5 rounded-md text-sm bg-gray-50 border border-gray-200 text-gray-800
                         focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-[#121315] dark:text-gray-200 dark:border-[#2a2c31]"
            />
          </div>
          <ul className="py-1 max-h-60 overflow-auto outline-none">
            <li 
              className="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-[#26292e]"
              onClick={() => {
                onChange('');
                setIsOpen(false);
              }}
              role="option"
              aria-selected={!value}
            >
              {label}
            </li>
            {(Array.isArray(options) ? options : [])
              .filter((opt) => {
                const q = query.trim().toLowerCase();
                const s = (opt ?? '').toString().toLowerCase();
                return s.includes(q);
              })
              .map((option, index) => (
              <li 
                key={index}
                className={`px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-[#26292e] ${option === value ? 'bg-gray-50 dark:bg-[#23262b]' : ''}`}
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                }}
                role="option"
                aria-selected={option === value}
              >
                {option}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
