import React, {useEffect, useState} from 'react';
import Layout from '../components/Layout';
import IdeasGrid from '../components/IdeasGrid';
import {Tool} from '../types';
import {getIdeas} from '../api/idea';

export default function Home(): React.ReactElement {
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [selectedType, setSelectedType] = useState<string>('');
    const [ideas, setIdeas] = useState<Tool[]>([]);
    const [selectedChain, setSelectedChain] = useState<'eth' | 'sol' | 'bsc' | 'polygon' | ''>('eth');

    useEffect(() => {
        let ignore = false;
        const load = async () => {
            try {
                const list = await getIdeas({
                    category: selectedCategory || undefined,
                    chain: selectedChain || undefined,
                    page: 1,
                    limit: 50,
                });
                if (!ignore) setIdeas(list || []);
            } catch (err) {
                console.error('Failed to fetch ideas:', err);
                if (!ignore) setIdeas([]);
            }
        };
        load();
        return () => { ignore = true; };
    }, [selectedCategory, selectedChain]);

    return (
        <Layout>
            <div className="px-4 lg:px-12 max-w-screen-2xl mx-auto py-6 md:py-8 pb-20 lg:pb-10">
                <div className="mb-4 md:mb-6 flex items-center justify-between gap-4">
                    <div className="animate-in slide-in-from-left duration-700">
                        <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight leading-tight 
                                       bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 
                                       dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400
                                       bg-clip-text text-transparent bg-[length:200%_100%] 
                                       animate-gradient-x">
                            IDEAS
                        </h1>
                        <p className="mt-1 text-[13.5px] md:text-base text-gray-600 dark:text-gray-300 animate-in slide-in-from-left duration-700 delay-150">
                            Explore blockchain-verified inspirations. Own, trade, and collaborate on ideas.
                        </p>
                    </div>
                    <div className="hidden md:flex items-center gap-2 animate-in slide-in-from-right duration-700">
                        <input
                            type="text"
                            placeholder="Search verified ideas"
                            className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-full px-4 py-2 text-sm w-56
                                     dark:bg-gray-900/80 dark:border-gray-700/50 
                                     focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 
                                     transition-all duration-300 hover:bg-white dark:hover:bg-gray-900"
                        />
                        <div className="flex items-center gap-2">
                            <label htmlFor="chain-select" className="sr-only">Select blockchain</label>
                            <select
                                id="chain-select"
                                value={selectedChain}
                                onChange={(e) => setSelectedChain(e.target.value as any)}
                                className="text-sm rounded-full px-3 py-2 bg-white/80 border border-gray-200/60 shadow-sm
                                       hover:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 
                                       dark:bg-gray-900/80 dark:border-gray-700/60 dark:text-gray-200"
                                aria-label="Select blockchain to filter ideas"
                            >
                                <option value="">All Chains</option>
                                <option value="eth">Ethereum</option>
                                <option value="sol">Solana</option>
                                <option value="bsc">BNB Chain</option>
                                <option value="polygon">Polygon</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div
                    className="flex items-center flex-wrap gap-2 md:gap-3 mb-6 md:mb-8 animate-in slide-in-from-bottom duration-700 delay-300">
                    <button
                        onClick={() => {
                            setSelectedCategory('');
                            setSelectedType('');
                        }}
                        className={`px-4 py-2 rounded-full text-xs md:text-sm font-medium transition-all duration-300 transform hover:scale-105 
                        ${selectedCategory === ''
                            ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30'
                            : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800 backdrop-blur-sm'}`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => {
                            setSelectedCategory('nft');
                        }}
                        className={`px-4 py-2 rounded-full text-xs md:text-sm font-medium transition-all duration-300 transform hover:scale-105 backdrop-blur-sm 
                        ${selectedCategory === 'nft'
                            ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30'
                            : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800'}`}
                    >
                        💎 NFT Ideas
                    </button>
                    <button
                        onClick={() => {
                            setSelectedCategory('free');
                        }}
                        className={`px-4 py-2 rounded-full text-xs md:text-sm font-medium transition-all duration-300 transform hover:scale-105 backdrop-blur-sm 
                        ${selectedCategory === 'free'
                            ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30'
                            : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800'}`}
                    >
                        🆓 Free Ideas
                    </button>
                    <button
                        onClick={() => {
                            setSelectedCategory('trending');
                        }}
                        className={`px-4 py-2 rounded-full text-xs md:text-sm font-medium transition-all duration-300 transform hover:scale-105 backdrop-blur-sm 
                        ${selectedCategory === 'trending'
                            ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30'
                            : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800'}`}
                    >
                        🔥 Trending
                    </button>
                </div>

                <IdeasGrid
                    tools={ideas}
                    selectedCategory={selectedCategory}
                    selectedType={selectedType}
                    selectedChain={selectedChain}
                />
            </div>
        </Layout>
    );
}
