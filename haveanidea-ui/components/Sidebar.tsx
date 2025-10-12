import React from 'react';
import Link from 'next/link';
import {useRouter} from 'next/router';

interface MenuItem {
  icon: string;
  name: string;
  href: string;
  colorIcon?: string;   // 图标颜色（浅色 + 深色）
  colorBar?: string;    // 选中条颜色（浅色 + 深色）
}

export default function Sidebar(): React.ReactElement {
  const router = useRouter();
  const {pathname} = router;
  // 渲染合适的 SVG 图标
  const renderIcon = (label: string, className?: string) => {
    const cn = `h-5 w-5 ${className || ''}`;
    switch (label) {
      case '交易所快讯':
        // 闪电 - 快讯
        return (
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={cn}>
            <path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z"/>
          </svg>
        );
      case '推特情报站':
        // X / Twitter 标志
        return (
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={cn}>
            <path d="M18.244 2H21l-6.56 7.5L22.5 22H15.9l-5.02-6.54L4.96 22H2l6.99-8-6.5-8H9.1l4.6 6.02L18.244 2z"/>
          </svg>
        );
      case '推特红人':
        // 星标用户
        return (
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={cn}>
            <path d="M12 12a5 5 0 100-10 5 5 0 000 10zm-9 9a9 9 0 1118 0H3z"/>
            <path d="M17.5 9.5l1.2.7-.3-1.4 1-1-1.4-.2L17.5 6l-.6 1.6-1.4.2 1 1-.3 1.4 1.2-.7z"/>
          </svg>
        );
      case 'CEX交易所':
        // 银行/大楼
        return (
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={cn}>
            <path d="M12 3l9 5v2H3V8l9-5zM4 11h16v9H4v-9zM6 13v5h2v-5H6zm5 0v5h2v-5h-2zm5 0v5h2v-5h-2z"/>
          </svg>
        );
      case 'DEX交易所':
        // 六边形网络
        return (
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={cn}>
            <path d="M7 3l-5 3v6l5 3 5-3V6L7 3zm10 0l-5 3v6l5 3 5-3V6l-5-3zM7 15l-5 3v3l5-3 5 3v-3l-5-3zm10 0l-5 3v3l5-3 5 3v-3l-5-3z"/>
          </svg>
        );
      default:
        return (
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={cn}>
            <circle cx="12" cy="12" r="8"/>
          </svg>
        );
    }
  };
  const recoms: MenuItem[] = [
    {
      icon: "",
      name: "交易所快讯",
      href: "/",
      colorIcon: "text-amber-500 dark:text-amber-400",
      colorBar: "bg-amber-500 dark:bg-amber-400",
    },
    {
      icon: "",
      name: "推特情报站",
      href: "/lauch",
      colorIcon: "text-violet-600 dark:text-violet-400",
      colorBar: "bg-violet-600 dark:bg-violet-400",
    },
  ];

    const channels: MenuItem[] = [
        {
            icon: "🤖",
            name: "精选 KOL",
            href: "/ai-agents",
            colorIcon: "text-rose-500 dark:text-rose-400",
            colorBar: "bg-rose-500 dark:bg-rose-400"
        }

    ];
    return (
        <aside
            className="w-full lg:w-56 overflow-y-auto py-2 px-2 lg:px-4 lg:border-r lg:border-gray-200 dark:lg:border-[#2a2c31] lg:fixed lg:top-0 lg:h-screen dark:bg-[#1a1b1e]">
            {/* 品牌（桌面端作为主品牌展示） */}
            <div className="hidden lg:flex items-center gap-3 py-3 mb-2">
                <Link href="/" className="flex items-center">
                    <img src="/logo.png" alt="WaTouKuang" className="h-9 w-auto"/>
                    <span
                        className="ml-2 text-xl font-semibold tracking-tight bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent dark:from-sky-400 dark:to-emerald-300">WaTouKuang</span>
                </Link>
            </div>
            <div className="mb-4 pb-2 lg:pb-4 border-b border-gray-100 dark:border-gray-800 hidden lg:block">
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-300">
                  <span aria-hidden>✨</span>
                  热点消息
                </span>
            </div>
            <nav className="space-y-1">
                {recoms.map((item, index) => {
                    const active = pathname === item.href || pathname.startsWith(item.href + '/');
                    return (
                        <Link href={item.href} key={index}
                              className={`sidebar-link relative pl-3 ${active ? 'active' : ''}`}>
                            {active && <span aria-hidden
                                             className={`absolute left-0.5 top-1/2 -translate-y-1/2 h-6 w-1.5 rounded-full ${item.colorBar || ''}`}/>}
                            <span className={`mr-2 ${item.colorIcon || ''}`}>{renderIcon(item.name, '')}</span>
                            <span className="text-sm">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>
            <div className="mb-4 pb-2 lg:pb-4 border-b border-gray-100 dark:border-gray-800 hidden lg:block mt-10">
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-300">
                  <span aria-hidden>🧭</span>
                  热门分类
                </span>
            </div>
            <nav className="space-y-1">
                {channels.map((item, index) => {
                    const active = pathname === item.href || pathname.startsWith(item.href + '/');
                    return (
                        <Link href={item.href} key={index}
                              className={`sidebar-link relative pl-3 ${active ? 'active' : ''}`}>
                            {active && <span aria-hidden
                                             className={`absolute left-0.5 top-1/2 -translate-y-1/2 h-6 w-1.5 rounded-full ${item.colorBar || ''}`}/>}
                            <span className={`mr-2 ${item.colorIcon || ''}`}>{renderIcon(item.name, '')}</span>
                            <span className="text-sm">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}
