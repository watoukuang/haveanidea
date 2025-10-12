import React, {useEffect, useRef, useState} from 'react';
import Link from 'next/link';
import LoginModal from './LoginModal';
import {useRouter} from 'next/router';

export default function Header(): React.ReactElement {
    const router = useRouter();
    // Theme state: 'light' | 'dark' | 'system'
    const [theme, setTheme] = useState<'light' | 'dark' | 'system'>(() => {
        if (typeof window === 'undefined') return 'system';
        return (localStorage.getItem('theme') as 'light' | 'dark' | 'system') || 'system';
    });

    // 下拉开关 & 系统深色侦测
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement | null>(null);
    const [systemDark, setSystemDark] = useState(false);
    const [loginOpen, setLoginOpen] = useState(false);
    const [toolsMenuOpen, setToolsMenuOpen] = useState(false);
    const toolsMenuRef = useRef<HTMLDivElement | null>(null);

    // Apply theme based on preference and system setting
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const root = document.documentElement;
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        setSystemDark(mediaQuery.matches);

        const applyTheme = () => {
            const isDark = theme === 'dark' || (theme === 'system' && mediaQuery.matches);
            root.classList.toggle('dark', isDark);
        };

        // 初始应用主题
        applyTheme();
        localStorage.setItem('theme', theme);

        // 监听系统主题变化
        const handleSystemThemeChange = (e: MediaQueryListEvent) => {
            setSystemDark(e.matches);
            if (theme === 'system') {
                root.classList.toggle('dark', e.matches);
            }
        };

        // 添加事件监听 (兼容新旧API)
        if (mediaQuery.addEventListener) {
            mediaQuery.addEventListener('change', handleSystemThemeChange);
            return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
        } else {
            // 旧版浏览器支持
            mediaQuery.addListener(handleSystemThemeChange);
            return () => mediaQuery.removeListener(handleSystemThemeChange);
        }
    }, [theme]);

    // 点击外部关闭菜单
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (!menuRef.current) return;
            if (!menuRef.current.contains(e.target as Node)) setMenuOpen(false);
        };
        if (menuOpen) document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [menuOpen]);

    // 点击外部关闭工具菜单
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (!toolsMenuRef.current) return;
            if (!toolsMenuRef.current.contains(e.target as Node)) setToolsMenuOpen(false);
        };
        if (toolsMenuOpen) document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [toolsMenuOpen]);
    // 顶部导航菜单（来自原 Sidebar）
    const menuItems: { name: string; href: string }[] = [
        { name: 'IDEAS', href: '/' },
        { name: 'LAUNCH', href: '/launch' },
        { name: 'MARKETPLACE', href: '/marketplace' },
        { name: 'ABOUT', href: '/about' },
    ];

    // 众筹工具菜单
    const crowdfundingTools = [
        { name: '💎 NFT Minting', href: '/nft-mint', description: 'Mint supporter NFTs' },
        { name: '🪙 Token Sale', href: '/token-sale', description: 'Buy governance tokens' },
        { name: '🏛️ DAO Governance', href: '/dao-governance', description: 'Vote on proposals' },
        { name: '🎯 Presale Hub', href: '/presale', description: 'Early access deals' },
    ];

    return (
        <header
            className="sticky top-0 z-40 border-b border-gray-100 bg-white/85 backdrop-blur supports-[backdrop-filter]:bg-white/70 dark:border-gray-800 dark:bg-[#121212]/85">
            <div className="px-4 lg:px-12 max-w-screen-2xl mx-auto py-4">
            <div className="grid grid-cols-3 items-center">
                {/* 左：品牌 */}
                {/* 品牌在各端均显示 */}
                <Link href="/" className="flex items-center gap-2 group">
                    <img
                        src={(theme === 'dark' || (theme === 'system' && systemDark)) ? '/logo-dark.png' : '/logo.png'}
                        onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/logo.png'; }}
                        alt="WaTouKuang Logo"
                        className="h-10 w-auto select-none transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
                    />
                    <span
                        className="text-xl md:text-2xl font-semibold tracking-tight leading-none select-none 
                                   bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 
                                   dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400
                                   bg-clip-text text-transparent bg-[length:200%_100%] 
                                   hover:animate-pulse transition-all duration-500 
                                   group-hover:bg-[position:100%_0%]">
                        HAVE AN IDEA
                    </span>
                </Link>

                {/* 中：顶部导航（居中） */}
                <nav className="hidden md:flex items-center justify-center gap-3">
                    {menuItems.map((item) => {
                        const active = router.pathname === item.href || router.pathname.startsWith(item.href + '/');
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`px-4 py-2 rounded-full text-[15px] md:text-base font-semibold tracking-wide 
                                           transition-all duration-300 ease-out transform hover:scale-105 active:scale-95 ${
                                  active 
                                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 dark:from-blue-400 dark:to-indigo-500 dark:shadow-blue-400/20'
                                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-gray-100 dark:hover:bg-gray-800/50 backdrop-blur-sm'
                                }`}
                            >
                                {item.name}
                            </Link>
                        );
                    })}
                    
                </nav>
                {/* 右：功能区 */}
            <div className="flex items-center justify-end space-x-2 md:space-x-3">

                <div className="relative" ref={menuRef}>
                    <button
                        onClick={() => setMenuOpen((v) => !v)}
                        className="h-8 w-8 flex items-center justify-center transition-colors md:block"
                        aria-label="主题/设置"
                        aria-expanded={menuOpen}
                        aria-haspopup="menu"
                    >
                        {(theme === 'dark' || (theme === 'system' && systemDark)) ? (
                            <svg className="h-5 w-5 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
                            </svg>
                        ) : (
                            <svg className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
                            </svg>
                        )}
                    </button>
                    {menuOpen && (
                        <div
                            role="menu"
                            aria-label="主题切换"
                            className="absolute right-0 mt-2 w-56 rounded-2xl border bg-white/98 backdrop-blur-sm shadow-lg ring-1 ring-black/5 p-2
                                       border-gray-200 dark:bg-[#1e1e1e] dark:border-[#2d2d30] dark:ring-white/5 dark:text-gray-200 z-50"
                        >
                            <button
                                role="menuitemradio"
                                aria-checked={theme === 'light'}
                                onClick={() => { setTheme('light'); localStorage.setItem('theme','light'); document.documentElement.classList.remove('dark'); setMenuOpen(false); }}
                                className={`group flex w-full items-center gap-3 px-3 py-2 rounded-lg text-sm hover:bg-gray-100 dark:hover:bg-gray-800 ${theme === 'light' ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
                            >
                                <span className="text-yellow-500">☀️</span>
                                <span className="flex-1 text-left">明亮主题</span>
                                {theme === 'light' && (
                                  <span aria-hidden className="ml-2 inline-block h-1.5 w-1.5 rounded-full bg-blue-500"/>
                                )}
                            </button>
                            <div className="my-1 h-px bg-gray-200 dark:bg-gray-800"/>
                            <button
                                role="menuitemradio"
                                aria-checked={theme === 'dark'}
                                onClick={() => { setTheme('dark'); localStorage.setItem('theme','dark'); document.documentElement.classList.add('dark'); setMenuOpen(false); }}
                                className={`group flex w-full items-center gap-3 px-3 py-2 rounded-lg text-sm hover:bg-gray-100 dark:hover:bg-gray-800 ${theme === 'dark' ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
                            >
                                <span className="text-gray-700 dark:text-gray-300">🌙</span>
                                <span className="flex-1 text-left">暗黑主题</span>
                                {theme === 'dark' && (
                                  <span aria-hidden className="ml-2 inline-block h-1.5 w-1.5 rounded-full bg-blue-500"/>
                                )}
                            </button>
                            <div className="my-1 h-px bg-gray-200 dark:bg-gray-800"/>
                            <button
                                role="menuitemradio"
                                aria-checked={theme === 'system'}
                                onClick={() => { setTheme('system'); localStorage.setItem('theme','system'); document.documentElement.classList.toggle('dark', window.matchMedia('(prefers-color-scheme: dark)').matches); setMenuOpen(false); }}
                                className={`group flex w-full items-center gap-3 px-3 py-2 rounded-lg text-sm hover:bg-gray-100 dark:hover:bg-gray-800 ${theme === 'system' ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
                            >
                                <span className="text-indigo-600">🖥️</span>
                                <span className="flex-1 text-left">跟随系统</span>
                                {theme === 'system' && (
                                  <span aria-hidden className="ml-2 inline-block h-1.5 w-1.5 rounded-full bg-blue-500"/>
                                )}
                            </button>
                        </div>
                    )}
                </div>

                <button
                    onClick={() => setLoginOpen(true)}
                    className="px-4 py-2 rounded-full text-[15px] md:text-base font-semibold whitespace-nowrap
                               bg-gradient-to-r from-indigo-500 to-purple-600 text-white 
                               hover:from-indigo-600 hover:to-purple-700 hover:shadow-lg hover:shadow-purple-500/25
                               dark:from-indigo-400 dark:to-purple-500 dark:hover:from-indigo-500 dark:hover:to-purple-600
                               transition-all duration-300 ease-out transform hover:scale-105 active:scale-95 shadow-md"
                >
                    WALLET
                </button>
            </div>
            {/* 关闭 grid 容器 */}
            </div>
            {/* 关闭内层容器 */}
            </div>
            <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
        </header>
    );
}
