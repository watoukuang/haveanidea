import React from 'react';
import { Tool } from '../types';
import IdeaCard from './IdeaCard';

interface CexsGridProps {
  tools: Tool[];
  selectedCategory: string;
  selectedType: string;
  selectedChain?: 'eth' | 'sol' | 'bsc' | 'polygon' | '';
}

export default function CexsGrid({ 
  tools, 
  selectedCategory, 
  selectedType, 
  selectedChain 
}: CexsGridProps): React.ReactElement {
  // 过滤逻辑
  const filteredTools = tools.filter((tool) => {
    // 分类过滤
    if (selectedCategory && selectedCategory !== 'all' && tool.category !== selectedCategory) {
      return false;
    }
    
    // 类型过滤
    if (selectedType && selectedType !== 'all' && tool.type !== selectedType) {
      return false;
    }
    
    // 链过滤
    if (selectedChain && selectedChain !== '' && tool.chain !== selectedChain) {
      return false;
    }
    
    return true;
  });

  if (filteredTools.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="text-6xl mb-4">💡</div>
        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
          No ideas found
        </h3>
        <p className="text-gray-500 dark:text-gray-400 max-w-md">
          Try adjusting your filters or be the first to submit an idea in this category.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
      {filteredTools.map((tool, index) => (
        <div
          key={tool.id}
          className="animate-in slide-in-from-bottom duration-500"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <IdeaCard cex={tool} />
        </div>
      ))}
    </div>
  );
}
