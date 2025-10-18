import request from '../lib/request';

export type LaunchPayload = {
  title: string;
  description: string;
  iconHash: string;
  tags: string[];
  crowdfundingMode?: 'nft' | 'token' | 'dao' | 'presale';
  timestamp: number;
};

export async function submitIdea(payload: LaunchPayload): Promise<any> {
  return request.post('/api/launch', payload);
}
