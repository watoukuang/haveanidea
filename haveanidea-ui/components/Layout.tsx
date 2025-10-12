import React from 'react';
import Header from './Header';
import Footer from './Footer';
import {LayoutProps} from '../types';

export default function Layout({children}: LayoutProps): React.ReactElement {
    return (
        <div className="flex flex-col min-h-screen dark:bg-[#121212]">
            <div className="flex flex-col flex-1">
                <Header/>
                {/* 顶部分隔渐隐（仅暗色） */}
                <div aria-hidden className="h-3 bg-transparent dark:bg-gradient-to-b dark:from-white/5 dark:to-transparent"/>
                {/* Main content */}
                <main className="flex-1 pt-8 md:pt-10 px-4 lg:px-12 max-w-screen-2xl mx-auto w-full">
                    {children}
                </main>
                <Footer/>
            </div>
        </div>
    );
}
