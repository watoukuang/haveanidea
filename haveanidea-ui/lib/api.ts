import { Tool, IdeaApiResponse, KolItem, TwitterItem } from '../types';

const BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8181';
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === '1';

// 获取存储的 JWT token
function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token');
}

// 设置认证头
function getAuthHeaders(): HeadersInit {
  const token = getAuthToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

async function getJson<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers,
    },
  });
  
  if (!res.ok) {
    if (res.status === 401) {
      // Token 过期，清除本地存储
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
      }
    }
    throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  }
  
  const data = await res.json();
  if (data && typeof data === 'object' && 'data' in data) return data.data as T;
  return data as T;
}

async function postJson<T>(path: string, body: any, options: RequestInit = {}): Promise<T> {
  return getJson<T>(path, {
    method: 'POST',
    body: JSON.stringify(body),
    ...options,
  });
}

async function putJson<T>(path: string, body: any, options: RequestInit = {}): Promise<T> {
  return getJson<T>(path, {
    method: 'PUT',
    body: JSON.stringify(body),
    ...options,
  });
}

async function deleteJson<T>(path: string, options: RequestInit = {}): Promise<T> {
  return getJson<T>(path, {
    method: 'DELETE',
    ...options,
  });
}

const now = Date.now();
const mockCexs: Tool[] = [
  { id: 1, name: 'SOL SZN', icon: '🪪', bg_color: '#e8f0ff', messages: [{ title: 'Blockchain-verified business card system for Web3 professionals', created: now - 60_000, href: '#' }], category: 'NFT Ideas', type: 'nft', chain: 'eth', deployer: '0x1234567890abcdef1234567890ABCDEF12345678', launch: { priceEth: 0.1, fundingGoalEth: 10, revenueSharePct: 10, contacts: { twitter: '@solszn', discord: 'solszn#1234', telegram: '@solszn' } } },
  { id: 2, name: 'Pump It Hard', icon: '🚀', bg_color: '#eefde7', messages: [{ title: 'Growth hacking platform with tokenized rewards', created: now - 5 * 60_000, href: '#' }], category: 'Free Ideas', type: 'free', chain: 'eth', deployer: '0x1111111111111111111111111111111111111111' },
  { id: 3, name: 'Loan Agreement', icon: '📄', bg_color: '#fff7e6', messages: [{ title: 'Smart contract template generator with NFT certificates', created: now - 30 * 60_000, href: '#' }], category: 'NFT Ideas', type: 'nft', chain: 'sol', deployer: 'SoLanaOwnerAddress' },
  { id: 4, name: 'NTO', icon: '🧾', bg_color: '#f1f5f9', messages: [{ title: 'Real-world asset tokenization for invoice clearing', created: now - 2 * 60 * 60_000, href: '#' }], category: 'NFT Ideas', type: 'nft', chain: 'polygon', deployer: '0x2222222222222222222222222222222222222222' },
  { id: 5, name: 'SOLCAR', icon: '🚗', bg_color: '#e6f7ff', messages: [{ title: 'Ride-sharing loyalty points on blockchain', created: now - 3 * 60 * 60_000, href: '#' }], category: 'Free Ideas', type: 'free', chain: 'bsc', deployer: '0x3333333333333333333333333333333333333333' },
  { id: 6, name: 'MLO', icon: '🏥', bg_color: '#f0fdf4', messages: [{ title: 'Medical equipment rental marketplace with verified ownership', created: now - 24 * 60 * 60_000, href: '#' }], category: 'Free Ideas', type: 'free', chain: 'polygon', deployer: '0x4444444444444444444444444444444444444444' },
  { id: 7, name: 'Memeland', icon: '🧸', bg_color: '#fff1f2', messages: [{ title: 'Meme generator with NFT ownership and royalties', created: now - 40 * 60_000, href: '#' }], category: 'Trending', type: 'nft', chain: 'sol', deployer: 'SoLanaOwnerAddress2' },
  { id: 8, name: 'Green Fund', icon: '🌱', bg_color: '#ecfeff', messages: [{ title: 'Sustainable investment tracking with carbon credit NFTs', created: now - 15 * 60_000, href: '#' }], category: 'NFT Ideas', type: 'nft', chain: 'eth', deployer: '0x5555555555555555555555555555555555555555' },
];

const mockTwitters: TwitterItem[] = [
  { id: 1, name: 'KOL A', icon: '🦊', messages: 'SOL 生态本周值得关注的 5 个新项目', created: now - 90_000 },
  { id: 2, name: 'KOL B', icon: '🐼', messages: '盘点 RWA 新叙事', created: now - 10 * 60_000 },
];

const mockKols: KolItem[] = [
  { id: 1, name: 'Alice', description: 'Crypto Researcher', url: '#', platform: 'twitter' },
  { id: 2, name: 'Bob', description: 'DeFi Builder', url: '#', platform: 'youtube' },
];

// 认证相关接口
interface AuthRequest {
  wallet_address: string;
  signature: string;
  message: string;
}

interface AuthResponse {
  token: string;
  user: {
    id: number;
    wallet_address: string;
    email?: string;
    username?: string;
    avatar_url?: string;
  };
}

// 想法创建/更新接口
interface CreateIdeaRequest {
  name: string;
  description: string;
  icon: string;
  bg_color?: string;
  category?: string;
  type?: string;
  chain?: string;
  tags?: string;
}

interface UpdateLaunchParamsRequest {
  price_eth?: number;
  funding_goal_eth?: number;
  revenue_share_pct?: number;
  twitter?: string;
  discord?: string;
  telegram?: string;
}

export const api = {
  // 认证相关
  async login(authData: AuthRequest): Promise<AuthResponse> {
    const response = await postJson<AuthResponse>('/auth/login', authData);
    if (response.token) {
      localStorage.setItem('auth_token', response.token);
    }
    return response;
  },

  async getProfile() {
    return await getJson('/auth/profile');
  },

  async logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  },

  // 想法相关
  async getCexs(params?: { 
    category?: string; 
    chain?: string; 
    idea_type?: string; 
    page?: number; 
    limit?: number; 
  }): Promise<IdeaApiResponse[]> {
    try { 
      const searchParams = new URLSearchParams();
      if (params?.category) searchParams.set('category', params.category);
      if (params?.chain) searchParams.set('chain', params.chain);
      if (params?.idea_type) searchParams.set('idea_type', params.idea_type);
      if (params?.page) searchParams.set('page', params.page.toString());
      if (params?.limit) searchParams.set('limit', params.limit.toString());
      
      const query = searchParams.toString();
      return await getJson<IdeaApiResponse[]>(`/ideas${query ? '?' + query : ''}`); 
    } catch (err) { 
      throw err; 
    }
  },

  async getIdeaById(id: number): Promise<Tool> {
    return await getJson<Tool>(`/ideas/${id}`);
  },

  async createIdea(ideaData: CreateIdeaRequest): Promise<Tool> {
    return await postJson<Tool>('/ideas', ideaData);
  },

  async updateIdea(id: number, ideaData: Partial<CreateIdeaRequest>): Promise<Tool> {
    return await putJson<Tool>(`/ideas/${id}`, ideaData);
  },

  async updateLaunchParams(id: number, params: UpdateLaunchParamsRequest): Promise<void> {
    return await putJson<void>(`/ideas/${id}/launch`, params);
  },

  async deleteIdea(id: number): Promise<void> {
    return await deleteJson<void>(`/ideas/${id}`);
  },

  // 文件上传
  async uploadFile(file: File): Promise<{ url: string; filename: string }> {
    const formData = new FormData();
    formData.append('file', file);
    
    const token = getAuthToken();
    const headers: HeadersInit = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${BASE}/upload`, {
      method: 'POST',
      body: formData,
      headers,
    });

    if (!res.ok) {
      throw new Error(`Upload failed: ${res.statusText}`);
    }

    const data = await res.json();
    return data.data;
  },

  // 保持兼容性的旧接口
  async getKols(): Promise<KolItem[]> {
    if (USE_MOCK) return mockKols;
    try { return await getJson<KolItem[]>('/kols'); } catch { return mockKols; }
  },

  async getTwitters(): Promise<TwitterItem[]> {
    if (USE_MOCK) return mockTwitters;
    try { return await getJson<TwitterItem[]>('/twitters'); } catch { return mockTwitters; }
  },
};
