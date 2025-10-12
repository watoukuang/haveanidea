import React, {useEffect, useState} from 'react';
import Layout from '../components/Layout';
import CexsGrid from '../components/CexsGrid';
import FilterDropdown from '../components/FilterDropdown';
import {Tool} from '../types';
import { api } from '../lib/api';

export default function Home(): React.ReactElement {
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [selectedType, setSelectedType] = useState<string>('');
    const [cexs, setCexs] = useState<Tool[]>([]);

    useEffect(() => {
      let ignore = false;
      api.getCexs()
        .then((data) => { if (!ignore) setCexs(data || []); })
        .catch(() => { if (!ignore) setCexs([]); });
      return () => { ignore = true; };
    }, []);

    // Extract unique categories and types from cexs data
//     const categories = [...new Set(cexs.map((tool: Tool) => tool.category))];
const categories = [...new Set(
  cexs.map((tool: Tool) => tool.category).filter((c): c is string => c !== undefined)
)];

    const types = [...new Set(cexs.map((tool: Tool) => tool.type).filter((t): t is string => t !== undefined))];

    return (
        <Layout>
            <div className="px-4 lg:px-12 max-w-screen-2xl mx-auto py-6 md:py-8 pb-20 lg:pb-10">
                <div className="mb-4 md:mb-6 flex items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight leading-tight bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 bg-clip-text text-transparent dark:from-sky-400 dark:via-indigo-400 dark:to-emerald-300">IDEAS</h1>
                        <p className="mt-1 text-[13.5px] md:text-base text-gray-600 dark:text-gray-300">Explore blockchain-verified inspirations. Own, trade, and collaborate on ideas.</p>
                    </div>
                    <div className="hidden md:flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="Search verified ideas"
                          className="bg-white border border-gray-200 rounded-full px-4 py-2 text-sm w-56 dark:bg-[#1a1b1e] dark:border-[#2a2c31]"
                        />
                        <button className="inline-flex items-center text-sm font-medium px-3 py-2 rounded-full whitespace-nowrap bg-amber-400 text-black hover:bg-amber-300">Mint Idea NFT</button>
                    </div>
                </div>

                <div className="flex items-center flex-wrap gap-2 md:gap-3 mb-6 md:mb-8">
                    <button className={`px-3 py-1.5 rounded-full text-xs md:text-sm bg-gray-900 text-white dark:bg-white dark:text-black`}>All</button>
                    <button className="px-3 py-1.5 rounded-full text-xs md:text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">NFT Ideas</button>
                    <button className="px-3 py-1.5 rounded-full text-xs md:text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">Free Ideas</button>
                    <button className="px-3 py-1.5 rounded-full text-xs md:text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">Trending</button>
                </div>

                <CexsGrid
                    tools={cexs}
                    selectedCategory={selectedCategory}
                    selectedType={selectedType}
                />
            </div>
        </Layout>
    );
}
