import request from '../lib/request';
import {api} from '../lib/api';
import type {IdeaApiResponse, Tool} from '../types';

export type LaunchPayload = {
    title: string;
    description: string;
    iconHash: string;
    tags: string[];
    crowdfundingMode?: 'nft' | 'token' | 'dao' | 'presale';
    chain?: 'eth' | 'sol' | 'bsc' | 'polygon';
    deployer?: string;
    timestamp: number;
};

export async function submitIdea(payload: LaunchPayload): Promise<any> {
    return request.post('/api/launch', payload);
}

// 首页 ideas 获取与映射（后端: haveanidea-api）
export async function getIdeas(params?: {
    category?: string;
    chain?: 'eth' | 'sol' | 'bsc' | 'polygon' | '';
    idea_type?: string;
    page?: number;
    limit?: number;
}): Promise<Tool[]> {
    const query = {
        ...(params?.category ? {category: params.category} : {}),
        ...(params?.chain ? {chain: params.chain} : {}),
        ...(params?.idea_type ? {idea_type: params.idea_type} : {}),
        page: params?.page ?? 1,
        limit: params?.limit ?? 50,
    };

    // 调用后端 /ideas 列表接口
    const resp: any = await request.get('/ideas/page', {params: query});
    const data: IdeaApiResponse[] = Array.isArray(resp) ? resp : (resp?.data ?? []);

    const transformed: Tool[] = (data || []).map((idea) => ({
        id: idea.id,
        name: idea.title || idea.name || `Idea #${idea.id}`,
        icon: idea.icon_hash || idea.icon || '💡',
        bg_color: idea.bg_color || '#f3f4f6',
        messages: [
            {
                title: idea.description || 'No description available',
                created: parseInt(idea.timestamp || idea.created || '0') || Date.now(),
                href: `/ideas/${idea.id}`,
            },
        ],
        category: idea.category || 'Free Ideas',
        type: idea.crowdfunding_mode || idea.crowdfundingMode || 'free',
        chain: idea.chain,
        deployer: idea.deployer,
    }));

    return transformed;
}
