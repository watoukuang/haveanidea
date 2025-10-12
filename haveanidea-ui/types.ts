import {ReactNode} from 'react';

export interface Tag {
    title: string;
    created: number
    href: string
}

export interface Tool {
    id: number;
    type?: string,
    name: string;
    icon: string;
    bg_color?: string;
    messages: Tag[];
    category?: string;
    chain?: 'eth' | 'sol' | 'bsc' | 'polygon';
    deployer?: string; // wallet address who deployed/owns the idea
    launch?: {
        priceEth?: number;
        fundingGoalEth?: number;
        revenueSharePct?: number;
        contacts?: {
            twitter?: string;
            discord?: string;
            telegram?: string;
        }
    };
}

export interface FilterDropdownProps {
    label: string;
    options: string[];
    value: string;
    onChange: (value: string) => void;
}

export interface ToolCardProps {
    cex: Tool;
}

export interface ToolsGridProps {
    tools: Tool[];
    selectedCategory: string;
    selectedType: string;
    selectedChain?: 'eth' | 'sol' | 'bsc' | 'polygon' | '';
}

// 推特情报站数据结构
export interface TwitterItem {
    id: number;
    name: string;      // 账号或分组名
    icon: string;      // 头像占位（可用 emoji 或后续换成图片）
    bg_color?: string;  // 卡片图标背景色
    messages: string;  // 最新情报/摘要
    created: number;   // 最新消息时间戳（秒或毫秒）
}

export interface TwitterCardProps {
    twitter: TwitterItem;
}

export interface TwittersGridProps {
    items: TwitterItem[];
}

// KOL 页面
export type KolPlatform = 'twitter' | 'reddit' | 'youtube';

export interface KolItem {
    id: number;
    name: string;         // 昵称
    avatar?: string;      // 头像链接或 emoji
    description: string;  // 简介
    url: string;          // 跳转地址
    platform: KolPlatform;// 平台
}

export interface KolCardProps {
    kol: KolItem;
}

export interface KolsGridProps {
    items: KolItem[];
    platform?: KolPlatform | 'all';
}

export interface TabItem {
    key: string;
    label: string;
}

export interface LayoutProps {
    children: ReactNode;
}

