import React from 'react';
import Link from 'next/link';

export default function Footer(): React.ReactElement {
    return (
        <footer
            className="mt-8 border-t border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-[#141517]/70 backdrop-blur">
            <div className="px-4 lg:px-12 max-w-screen-2xl mx-auto py-6 md:py-8">
                <div className="grid gap-6 md:gap-8 md:grid-cols-5 items-start">
                    {/* 左侧品牌与备案（占两列） */}
                    <div className="md:col-span-2">
                        <div className="flex items-center gap-2 mb-2">
                            <img src="/logo.png" alt="WaTouKuang Logo" className="h-7 w-7"/>
                            <span className="text-base md:text-lg font-semibold">HAVE AN IDEA</span>
                        </div>
                        <div className="space-y-1.5 text-xs md:text-[13px] text-gray-600 dark:text-gray-400">
                            <p>© {new Date().getFullYear()} watoukuang.com · All rights reserved</p>
                        </div>
                    </div>

                    {/* 中间：站点链接 */}
                    <div>
                        <ul className="space-y-1 text-sm">
                            <li><Link
                                className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                                href="/about">About</Link></li>
                            <li><Link
                                className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                                href="/submit-tool">Submit Tool</Link></li>
                        </ul>
                    </div>

                    {/* 右侧：政策 */}
                    <div>
                        <ul className="space-y-1 text-sm">
                            <li>
                                <Link
                                  className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                                  href="/disclaimer">Disclaimer
                                </Link>
                            </li>
                            <li>
                                <Link
                                className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                                href="/terms">Terms of Use
                                </Link>
                            </li>
                            <li><Link
                                className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                                href="/privacy">Privacy Policy</Link></li>
                        </ul>
                    </div>
                    <div>
                        <ul className="space-y-1 text-sm">
                            <li>
                              <a
                                className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                                href="mailto:contact@watoukuang.com">Contact: contact@watoukuang.com</a>
                            </li>
                            <li>
                              <div className="flex items-center gap-3 pt-1">
                                {/* Discord */}
                                <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Discord"
                                   className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-600 hover:text-indigo-600 hover:border-indigo-300 dark:border-[#2a2c31] dark:text-gray-300 dark:hover:text-indigo-400">
                                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden>
                                    <path d="M20.317 4.369A19.791 19.791 0 0016.558 3c-.2.36-.43.85-.59 1.23a18.2 18.2 0 00-7.936 0A8.827 8.827 0 007.442 3 19.736 19.736 0 003.683 4.37C1.398 8.164.76 11.84 1.051 15.47a19.93 19.93 0 006.089 3.12c.49-.67.93-1.39 1.31-2.15a12.65 12.65 0 01-1.99-.76c.17-.12.34-.25.5-.38a13.97 13.97 0 0010.08 0c.16.13.33.26.5.38-.65.27-1.31.53-1.99.76.38.76.82 1.48 1.31 2.15a19.93 19.93 0 006.09-3.12c.33-3.95-.57-7.6-2.64-11.1zM9.3 14.2c-1.02 0-1.86-.93-1.86-2.06 0-1.14.82-2.07 1.86-2.07s1.88.93 1.86 2.07c0 1.13-.82 2.06-1.86 2.06zm5.4 0c-1.02 0-1.86-.93-1.86-2.06 0-1.14.83-2.07 1.87-2.07 1.03 0 1.86.93 1.86 2.07 0 1.13-.83 2.06-1.87 2.06z"/>
                                  </svg>
                                </a>
                                {/* Twitter/X */}
                                <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Twitter"
                                   className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-600 hover:text-sky-600 hover:border-sky-300 dark:border-[#2a2c31] dark:text-gray-300 dark:hover:text-sky-400">
                                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden>
                                    <path d="M18.244 2H21l-6.56 7.5L22.5 22H15.9l-5.02-6.54L4.96 22H2l6.99-8-6.5-8H9.1l4.6 6.02L18.244 2z"/>
                                  </svg>
                                </a>
                                {/* Telegram */}
                                <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Telegram"
                                   className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-600 hover:text-blue-600 hover:border-blue-300 dark:border-[#2a2c31] dark:text-gray-300 dark:hover:text-blue-400">
                                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden>
                                    <path d="M9.036 15.803l-.375 5.297c.535 0 .767-.23 1.045-.505l2.507-2.41 5.195 3.805c.953.525 1.636.25 1.897-.884l3.438-16.098c.314-1.46-.557-2.03-1.49-1.675L1.28 10.064c-1.41.548-1.388 1.337-.24 1.69l5.41 1.687 12.57-7.94c.59-.36 1.127-.16.685.2"/>
                                  </svg>
                                </a>
                              </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    );
}
