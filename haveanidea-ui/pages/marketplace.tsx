import React, { useEffect, useMemo, useState } from 'react';
import Layout from '../components/Layout';
import CexsGrid from '../components/CexsGrid';
import { Tool } from '../types';
import { api } from '../lib/api';

export default function Marketplace(): React.ReactElement {
  const [items, setItems] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('nft'); // 默认交易以 NFT 类型为主
  const [selectedChain, setSelectedChain] = useState<'eth'|'sol'|'bsc'|'polygon'|''>('');

  useEffect(() => {
    let ignore = false;
    api.getCexs()
      .then((data) => { if (!ignore) { setItems(data || []); setLoading(false); } })
      .catch(() => { if (!ignore) { setItems([]); setLoading(false); } });
    return () => { ignore = true; };
  }, []);

  const tradables: Tool[] = useMemo(() => {
    // 交易的点子：优先展示 type 为 nft 的条目
    return (items || []).filter(t => (t.type || '').toLowerCase().includes('nft'));
  }, [items]);

  return (
    <Layout>
      <div className="px-4 lg:px-12 max-w-screen-2xl mx-auto py-6 md:py-8 pb-20 lg:pb-10">
        <div className="mb-4 md:mb-6 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight leading-tight 
                           bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 
                           dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400
                           bg-clip-text text-transparent bg-[length:200%_100%] animate-gradient-x">
              MARKETPLACE
            </h1>
            <p className="mt-1 text-[13.5px] md:text-base text-gray-600 dark:text-gray-300">
              Discover tradable ideas. Browse, evaluate, and acquire the inspirations you believe in.
            </p>
          </div>

          <div className="hidden md:flex items-center gap-2">
            <label htmlFor="chain-select" className="sr-only">Select blockchain</label>
            <select
              id="chain-select"
              value={selectedChain}
              onChange={(e) => setSelectedChain(e.target.value as any)}
              className="text-sm rounded-full px-3 py-2 bg-white/80 border border-gray-200/60 shadow-sm 
                         hover:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 
                         dark:bg-gray-900/80 dark:border-gray-700/60 dark:text-gray-200"
              aria-label="Select blockchain to filter tradable ideas"
            >
              <option value="">All Chains</option>
              <option value="eth">Ethereum</option>
              <option value="sol">Solana</option>
              <option value="bsc">BNB Chain</option>
              <option value="polygon">Polygon</option>
            </select>
          </div>
        </div>

        <div className="flex items-center flex-wrap gap-2 md:gap-3 mb-6 md:mb-8">
          <button
            onClick={() => { setSelectedCategory(''); setSelectedType('nft'); }}
            className={`px-4 py-2 rounded-full text-xs md:text-sm font-medium transition-all duration-300 transform hover:scale-105 
              ${selectedCategory === ''
                ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30'
                : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800 backdrop-blur-sm'}`}
          >
            All
          </button>
          <button
            onClick={() => setSelectedCategory('trending')}
            className={`px-4 py-2 rounded-full text-xs md:text-sm font-medium transition-all duration-300 transform hover:scale-105 backdrop-blur-sm 
              ${selectedCategory === 'trending'
                ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30'
                : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800'}`}
          >
            🔥 Trending
          </button>
        </div>

        <CexsGrid
          tools={tradables}
          selectedCategory={selectedCategory}
          selectedType={selectedType}
          selectedChain={selectedChain}
        />

        {(!loading && tradables.length === 0) && (
          <div className="text-center text-sm text-gray-600 dark:text-gray-400 mt-8">No tradable ideas yet.</div>
        )}
      </div>
    </Layout>
  );
}
