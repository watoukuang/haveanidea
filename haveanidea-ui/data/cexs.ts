import { Tool } from '../types';

const now = Date.now();

export const cexs: Tool[] = [
  {
    id: 1,
    name: 'Binance',
    icon: '🟡',
    bg_color: '#fff7cc',
    messages: [
      { title: 'Binance 上线新交易对 XYZ/USDT，开盘涨幅超 12%', created: Math.floor((now - 5 * 60_000) / 1000), href: 'https://www.binance.com/' },
      { title: '期货永续合约增加杠杆上限至 50x（部分标的）', created: Math.floor((now - 45 * 60_000) / 1000), href: 'https://www.binance.com/' },
      { title: '公告：系统维护预计在 2 小时内完成，现货交易不受影响', created: Math.floor((now - 2 * 60 * 60_000) / 1000), href: 'https://www.binance.com/' },
      { title: '研究院发布季度报告：交易深度与流动性回升', created: Math.floor((now - 6 * 60 * 60_000) / 1000), href: 'https://research.binance.com/' },
    ],
  },
  {
    id: 2,
    name: 'OKX',
    icon: '⚫',
    bg_color: '#eaeaea',
    messages: [
      { title: 'OKX Earn 上线新理财产品，年化最高 8%', created: Math.floor((now - 10 * 60_000) / 1000), href: 'https://www.okx.com/' },
      { title: 'Jumpstart 第 28 期申购将于明日开启', created: Math.floor((now - 3 * 60 * 60_000) / 1000), href: 'https://www.okx.com/' },
      { title: '钱包新增对某公链生态 DApp 的一键连接', created: Math.floor((now - 26 * 60 * 60_000) / 1000), href: 'https://www.okx.com/wallet' },
    ],
  },
  {
    id: 3,
    name: 'Coinbase',
    icon: '🔵',
    bg_color: '#e6f0ff',
    messages: [
      { title: 'Coinbase 推出机构托管新功能，提升风控与审计', created: Math.floor((now - 15 * 60_000) / 1000), href: 'https://www.coinbase.com/' },
      { title: 'Base 链上周活跃用户数创新高', created: Math.floor((now - 5 * 60 * 60_000) / 1000), href: 'https://base.org/' },
      { title: '与某支付服务合作扩展合规购币通道', created: Math.floor((now - 30 * 60 * 60_000) / 1000), href: 'https://www.coinbase.com/' },
    ],
  },
  {
    id: 4,
    name: 'Gate',
    icon: '🔺',
    bg_color: '#fff0f5',
    messages: [
      { title: 'Gate Launchpad 新项目认购开启，支持 USDT 与 GT', created: Math.floor((now - 20 * 60_000) / 1000), href: 'https://www.gate.io/' },
      { title: '现货区新增 5 个新币交易对，交易开启时间 18:00', created: Math.floor((now - 3 * 60 * 60_000) / 1000), href: 'https://www.gate.io/' },
      { title: '合约系统维护公告：凌晨 2:00-2:30 期间短暂不可用', created: Math.floor((now - 22 * 60 * 60_000) / 1000), href: 'https://www.gate.io/' },
    ],
  },
  {
    id: 5,
    name: 'Bybit',
    icon: '🟠',
    bg_color: '#fff4e5',
    messages: [
      { title: 'Bybit 将上调部分永续合约的资金费率上限', created: Math.floor((now - 35 * 60_000) / 1000), href: 'https://www.bybit.com/' },
      { title: 'Earn 活动：质押特定资产可享额外奖励', created: Math.floor((now - 7 * 60 * 60_000) / 1000), href: 'https://www.bybit.com/' },
      { title: 'API 速率限制优化，提升高频交易稳定性', created: Math.floor((now - 28 * 60 * 60_000) / 1000), href: 'https://www.bybit.com/' },
    ],
  },
  {
    id: 6,
    name: 'KuCoin',
    icon: '🟢',
    bg_color: '#e8fff0',
    messages: [
      { title: 'KuCoin 新增法币买币通道，支持更多地区银行卡', created: Math.floor((now - 12 * 60_000) / 1000), href: 'https://www.kucoin.com/' },
      { title: 'KuCoin Labs 发布生态投资进展月报', created: Math.floor((now - 9 * 60 * 60_000) / 1000), href: 'https://www.kucoin.com/' },
    ],
  },
  {
    id: 7,
    name: 'MEXC',
    icon: '🟣',
    bg_color: '#f3e8ff',
    messages: [
      { title: 'MEXC 将上线合约跟单新功能，开放内测名额', created: Math.floor((now - 25 * 60_000) / 1000), href: 'https://www.mexc.com/' },
      { title: '上线新币 ABC，开启上线福利活动', created: Math.floor((now - 4 * 60 * 60_000) / 1000), href: 'https://www.mexc.com/' },
      { title: '充提维护公告：部分链将于今晚进行节点升级', created: Math.floor((now - 20 * 60 * 60_000) / 1000), href: 'https://www.mexc.com/' },
    ],
  },
  {
    id: 8,
    name: 'Bitget',
    icon: '🟧',
    bg_color: '#fff2e6',
    messages: [
      { title: 'Bitget 新增跟单策略市场，支持更多合约标的', created: Math.floor((now - 18 * 60_000) / 1000), href: 'https://www.bitget.com/' },
      { title: '充值返佣活动开启，限时 7 天', created: Math.floor((now - 6 * 60 * 60_000) / 1000), href: 'https://www.bitget.com/' },
    ],
  },
  {
    id: 9,
    name: 'Huobi',
    icon: '🟥',
    bg_color: '#ffe6e6',
    messages: [
      { title: 'Huobi 公告：部分交易对临时下线维护', created: Math.floor((now - 50 * 60_000) / 1000), href: 'https://www.htx.com/' },
      { title: 'Earn 新手专区上线，年化最高 10%', created: Math.floor((now - 11 * 60 * 60_000) / 1000), href: 'https://www.htx.com/' },
    ],
  },
  {
    id: 10,
    name: 'Kraken',
    icon: '🟪',
    bg_color: '#efe6ff',
    messages: [
      { title: 'Kraken 推出合规新进展说明，拓展更多地区服务', created: Math.floor((now - 75 * 60_000) / 1000), href: 'https://www.kraken.com/' },
      { title: '质押服务新增资产支持，APR 略有上调', created: Math.floor((now - 14 * 60 * 60_000) / 1000), href: 'https://www.kraken.com/' },
    ],
  },
];

export default cexs;
