import React from 'react';
import Link from 'next/link';
import { Tool } from '../types';

interface IdeaCardProps {
  idea: Tool;
}

export default function IdeaCard({ idea }: IdeaCardProps): React.ReactElement {
  const formatTimeAgo = (timestamp: number) => {
    // tolerate both seconds and milliseconds
    const tsMs = timestamp > 1e12 ? timestamp : timestamp * 1000;
    const now = Date.now();
    const diff = now - tsMs;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const getChainIcon = (chain?: string) => {
    switch (chain) {
      case 'eth': return '⟠';
      case 'sol': return '◎';
      case 'bsc': return '🟡';
      case 'polygon': return '🟣';
      default: return '🔗';
    }
  };

  const getCategoryBadge = (category?: string) => {
    switch (category) {
      case 'NFT Ideas': return { icon: '💎', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' };
      case 'Free Ideas': return { icon: '🆓', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' };
      case 'Trending': return { icon: '🔥', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' };
      default: return { icon: '💡', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' };
    }
  };

  const latestMessage = idea.messages?.[0];
  const badge = getCategoryBadge(idea.category);

  return (
    <Link href={`/ideas/${idea.id}`}>
      <div className="group relative bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 
                      hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-300 
                      hover:shadow-lg dark:hover:shadow-2xl hover:-translate-y-1 cursor-pointer overflow-hidden">
        
        {/* 顶部图标区域 */}
        <div className="p-4 pb-2">
          <div className="flex items-start justify-between mb-3">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-sm"
              style={{ backgroundColor: idea.bg_color || '#f3f4f6' }}
            >
              {idea.icon}
            </div>
            
            <div className="flex items-center gap-2">
              {/* 链标识 */}
              {idea.chain && (
                <span className="text-lg" title={idea.chain}>
                  {getChainIcon(idea.chain)}
                </span>
              )}
              
              {/* 分类标签 */}
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${badge.color}`}>
                {badge.icon}
              </span>
            </div>
          </div>

          {/* 标题 */}
          <h3 className="font-semibold text-gray-900 dark:text-white text-lg mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {idea.name}
          </h3>

          {/* 描述 */}
          {latestMessage && (
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
              {latestMessage.title}
            </p>
          )}
        </div>

        {/* 底部信息 */}
        <div className="px-4 pb-4">
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            {/* 时间 */}
            {latestMessage && (
              <span>{formatTimeAgo(latestMessage.created)}</span>
            )}
            
            {/* 部署者地址 */}
            {idea.deployer && (
              <span className="font-mono">
                {idea.deployer.slice(0, 6)}...{idea.deployer.slice(-4)}
              </span>
            )}
          </div>

          {/* 众筹信息 */}
          {idea.launch && (
            <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-800">
              <div className="flex items-center justify-between text-xs">
                {idea.launch.priceEth && (
                  <span className="text-green-600 dark:text-green-400 font-medium">
                    {idea.launch.priceEth} ETH
                  </span>
                )}
                {idea.launch.fundingGoalEth && (
                  <span className="text-gray-500 dark:text-gray-400">
                    Goal: {idea.launch.fundingGoalEth} ETH
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Hover 效果 */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>
    </Link>
  );
}
