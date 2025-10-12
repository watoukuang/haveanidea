import { KolItem } from '../types';

const now = Date.now();
const min = (m: number) => Math.floor((now - m * 60_000) / 1000);

export const kols: KolItem[] = [
  { id: 1,  name: 'CZ_Binance',     avatar: '🧢', description: 'Binance 创始人，行业观点与合规进展', url: 'https://twitter.com/cz_binance', platform: 'twitter' },
  { id: 2,  name: 'OKX_Official',   avatar: '⚫', description: 'OKX 官方资讯与活动',                 url: 'https://twitter.com/okx',        platform: 'twitter' },
  { id: 3,  name: 'Coinbase',       avatar: '🔵', description: 'Coinbase 官方账号与 Base 生态动态',  url: 'https://twitter.com/coinbase',   platform: 'twitter' },
  { id: 4,  name: 'r/CryptoCurrency', avatar: '👥', description: '最大加密 Reddit 社区，热点讨论',     url: 'https://reddit.com/r/CryptoCurrency', platform: 'reddit' },
  { id: 5,  name: 'r/ethfinance',   avatar: '🟣', description: '以太坊投资与研究社群',               url: 'https://reddit.com/r/ethfinance',     platform: 'reddit' },
  { id: 6,  name: 'Coin Bureau',    avatar: '🎥', description: '优质加密科普与深度分析频道',         url: 'https://www.youtube.com/@CoinBureau', platform: 'youtube' },
  { id: 7,  name: 'Bankless',       avatar: '🏦', description: 'Web3/DeFi 访谈与评论节目',            url: 'https://www.youtube.com/@Bankless',   platform: 'youtube' },
  { id: 8,  name: 'Bybit',          avatar: '🟠', description: 'Bybit 官方账号，活动与公告',         url: 'https://twitter.com/Bybit_Official',  platform: 'twitter' },
  { id: 9,  name: 'MEXC',           avatar: '🟣', description: 'MEXC 官方账号，功能更新',            url: 'https://twitter.com/MEXC_Global',    platform: 'twitter' },
  { id: 10, name: 'Kraken',         avatar: '🟪', description: 'Kraken 官方账号与合规说明',          url: 'https://twitter.com/krakenfx',       platform: 'twitter' },
  { id: 11, name: 'r/defi',         avatar: '💧', description: 'DeFi 话题讨论版块',                   url: 'https://reddit.com/r/defi',          platform: 'reddit' },
  { id: 12, name: 'a16zcrypto',     avatar: '🧠', description: 'a16z 加密研究与投资观点',            url: 'https://twitter.com/a16zcrypto',     platform: 'twitter' },
  { id: 13, name: 'Wassie Capital', avatar: '🦆', description: '加密梗与市场评论',                    url: 'https://twitter.com/WassieCapital',  platform: 'twitter' },
  { id: 14, name: 'Finematics',     avatar: '📺', description: 'DeFi 解释动画频道',                   url: 'https://www.youtube.com/@Finematics', platform: 'youtube' },
  { id: 15, name: 'r/Bitcoin',      avatar: '₿',  description: '比特币相关讨论区',                   url: 'https://reddit.com/r/Bitcoin',       platform: 'reddit' },
];

export default kols;
