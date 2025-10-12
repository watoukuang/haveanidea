import { Tool, KolItem, TwitterItem } from '../types';

const BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://192.168.1.177:8181';
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === '1';

async function getJson<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) throw new Error(String(res.status));
  const data = await res.json();
  if (data && typeof data === 'object' && 'data' in data) return data.data as T;
  return data as T;
}

const now = Date.now();
const mockCexs: Tool[] = [
  { id: 1, name: 'SOL SZN', icon: '🪪', bg_color: '#e8f0ff', messages: [{ title: 'Blockchain-verified business card system for Web3 professionals', created: now - 60_000, href: '#' }], category: 'NFT Ideas', type: 'nft' },
  { id: 2, name: 'Pump It Hard', icon: '🚀', bg_color: '#eefde7', messages: [{ title: 'Growth hacking platform with tokenized rewards', created: now - 5 * 60_000, href: '#' }], category: 'Free Ideas', type: 'free' },
  { id: 3, name: 'Loan Agreement', icon: '📄', bg_color: '#fff7e6', messages: [{ title: 'Smart contract template generator with NFT certificates', created: now - 30 * 60_000, href: '#' }], category: 'NFT Ideas', type: 'nft' },
  { id: 4, name: 'NTO', icon: '🧾', bg_color: '#f1f5f9', messages: [{ title: 'Real-world asset tokenization for invoice clearing', created: now - 2 * 60 * 60_000, href: '#' }], category: 'NFT Ideas', type: 'nft' },
  { id: 5, name: 'SOLCAR', icon: '🚗', bg_color: '#e6f7ff', messages: [{ title: 'Ride-sharing loyalty points on blockchain', created: now - 3 * 60 * 60_000, href: '#' }], category: 'Free Ideas', type: 'free' },
  { id: 6, name: 'MLO', icon: '🏥', bg_color: '#f0fdf4', messages: [{ title: 'Medical equipment rental marketplace with verified ownership', created: now - 24 * 60 * 60_000, href: '#' }], category: 'Free Ideas', type: 'free' },
  { id: 7, name: 'Memeland', icon: '🧸', bg_color: '#fff1f2', messages: [{ title: 'Meme generator with NFT ownership and royalties', created: now - 40 * 60_000, href: '#' }], category: 'Trending', type: 'nft' },
  { id: 8, name: 'Green Fund', icon: '🌱', bg_color: '#ecfeff', messages: [{ title: 'Sustainable investment tracking with carbon credit NFTs', created: now - 15 * 60_000, href: '#' }], category: 'NFT Ideas', type: 'nft' },
];

const mockTwitters: TwitterItem[] = [
  { id: 1, name: 'KOL A', icon: '🦊', messages: 'SOL 生态本周值得关注的 5 个新项目', created: now - 90_000 },
  { id: 2, name: 'KOL B', icon: '🐼', messages: '盘点 RWA 新叙事', created: now - 10 * 60_000 },
];

const mockKols: KolItem[] = [
  { id: 1, name: 'Alice', description: 'Crypto Researcher', url: '#', platform: 'twitter' },
  { id: 2, name: 'Bob', description: 'DeFi Builder', url: '#', platform: 'youtube' },
];

export const api = {
  async getCexs(): Promise<Tool[]> {
    if (USE_MOCK) return mockCexs;
    try { return await getJson<Tool[]>('/cexs'); } catch { return mockCexs; }
  },
  async getKols(): Promise<KolItem[]> {
    if (USE_MOCK) return mockKols;
    try { return await getJson<KolItem[]>('/kols'); } catch { return mockKols; }
  },
  async getTwitters(): Promise<TwitterItem[]> {
    if (USE_MOCK) return mockTwitters;
    try { return await getJson<TwitterItem[]>('/twitters'); } catch { return mockTwitters; }
  },
};
