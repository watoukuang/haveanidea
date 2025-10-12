import { TwitterItem } from '../types';

const now = Date.now();

export const twitters: TwitterItem[] = [
  { id: 1, name: 'CZ_Binance',    icon: '🧢', bg_color: '#e6f0ff', messages: '推出新合规举措，强调用户资产透明化', created: Math.floor((now - 5 * 60_000) / 1000) },
  { id: 2, name: 'OKX_Official',  icon: '⚫', bg_color: '#eaeaea',  messages: 'Jumpstart 项目预热，社区 AMA 本周进行', created: Math.floor((now - 12 * 60_000) / 1000) },
  { id: 3, name: 'coinbase',      icon: '🔵', bg_color: '#e6f0ff', messages: 'Base 生态开发者大会倒计时 7 天', created: Math.floor((now - 25 * 60_000) / 1000) },
  { id: 4, name: 'gate_official', icon: '🔺', bg_color: '#fff0f5', messages: '新 Launchpad 报名即将开启，规则公布', created: Math.floor((now - 40 * 60_000) / 1000) },
  { id: 5, name: 'Bybit_Official',icon: '🟠', bg_color: '#fff4e5', messages: '合约资金费率机制优化公告', created: Math.floor((now - 55 * 60_000) / 1000) },
  { id: 6, name: 'kucoincom',     icon: '🟢', bg_color: '#e8fff0', messages: 'KuCoin Labs 发布投研月报摘要', created: Math.floor((now - 80 * 60_000) / 1000) },
  { id: 7, name: 'MEXC_Global',   icon: '🟣', bg_color: '#f3e8ff', messages: '跟单内测计划开放申请', created: Math.floor((now - 100 * 60_000) / 1000) },
  { id: 8, name: 'bitgetglobal',  icon: '🟧', bg_color: '#fff2e6', messages: '战略合作伙伴计划升级', created: Math.floor((now - 2 * 60 * 60_000) / 1000) },
  { id: 9, name: 'HTX_Global',    icon: '🟥', bg_color: '#ffe6e6', messages: '合约系统维护窗口时间公告', created: Math.floor((now - 3 * 60 * 60_000) / 1000) },
  { id: 10, name: 'krakenfx',     icon: '🟪', bg_color: '#efe6ff', messages: '质押服务新增资产', created: Math.floor((now - 3.5 * 60 * 60_000) / 1000) },
  // 补充更多 KOL 或交易所官方账号
  { id: 11, name: 'SBF_FTX',        icon: '🧑‍⚖️', bg_color: '#f5f5f5', messages: '关于加密合规的看法与辩论', created: Math.floor((now - 4 * 60 * 60_000) / 1000) },
  { id: 12, name: 'APompliano',     icon: '🟦',   bg_color: '#e6f0ff', messages: '市场周期与机构入场的讨论', created: Math.floor((now - 5 * 60 * 60_000) / 1000) },
  { id: 13, name: 'WillyWoo',       icon: '📊',   bg_color: '#fffbe6', messages: '链上数据：活跃地址增长明显', created: Math.floor((now - 6 * 60 * 60_000) / 1000) },
  { id: 14, name: 'hsaka',          icon: '📈',   bg_color: '#e6fff8', messages: '衍生品资金费率与价差观察', created: Math.floor((now - 7 * 60 * 60_000) / 1000) },
  { id: 15, name: 'Cobie',          icon: '🎙️',  bg_color: '#f0f0ff', messages: '播客预告：与某项目方对谈', created: Math.floor((now - 8 * 60 * 60_000) / 1000) },
  { id: 16, name: 'TheBlock',       icon: '📰',   bg_color: '#f7f7f7', messages: '头条：交易平台上新、融资与合规汇总', created: Math.floor((now - 9 * 60 * 60_000) / 1000) },
  { id: 17, name: 'MessariCrypto',  icon: '📚',   bg_color: '#eef7ff', messages: '研究报告节选：板块轮动与估值框架', created: Math.floor((now - 10 * 60 * 60_000) / 1000) },
  { id: 18, name: 'Delphi_Digital', icon: '🔬',   bg_color: '#e8faff', messages: '投研观点：L2 生态与费率市场', created: Math.floor((now - 11 * 60 * 60_000) / 1000) },
  { id: 19, name: 'Glassnode',      icon: '🔍',   bg_color: '#f0fff4', messages: '长期持有者指标与抛压分析', created: Math.floor((now - 12 * 60 * 60_000) / 1000) },
  { id: 20, name: 'CryptoQuant',    icon: '🔎',   bg_color: '#fff0f0', messages: '交易所储备变动，短期或影响波动', created: Math.floor((now - 13 * 60 * 60_000) / 1000) },
  { id: 21, name: 'Paradigm',       icon: '💼',   bg_color: '#f5fff0', messages: '支持开源与新型 AMM 研究', created: Math.floor((now - 14 * 60 * 60_000) / 1000) },
  { id: 22, name: 'a16zcrypto',     icon: '🧠',   bg_color: '#f0fff5', messages: '监管框架建议与基础设施投资', created: Math.floor((now - 15 * 60 * 60_000) / 1000) },
  { id: 23, name: 'balajis',        icon: '🧩',   bg_color: '#f7fff7', messages: '网络国家、去中心化社交讨论', created: Math.floor((now - 16 * 60 * 60_000) / 1000) },
  { id: 24, name: 'vitalik',        icon: '🧠',   bg_color: '#f0fff0', messages: '以太坊扩容路线与研究动态', created: Math.floor((now - 17 * 60 * 60_000) / 1000) },
  { id: 25, name: 'elonmusk',       icon: '🚀',   bg_color: '#fffbe6', messages: '关于 X 平台功能更新的讨论', created: Math.floor((now - 18 * 60 * 60_000) / 1000) },
  { id: 26, name: 'SBF_Case',       icon: '⚖️',  bg_color: '#f7f7f7', messages: '法律进展与公开听证消息', created: Math.floor((now - 19 * 60 * 60_000) / 1000) },
  { id: 27, name: 'binance_angel',  icon: '😇',   bg_color: '#e6f0ff', messages: '社区志愿者活动与产品建议收集', created: Math.floor((now - 20 * 60 * 60_000) / 1000) },
  { id: 28, name: 'OKX_TR',         icon: '⚫',   bg_color: '#eaeaea',  messages: '地区活动与交易竞赛公告', created: Math.floor((now - 21 * 60 * 60_000) / 1000) },
  { id: 29, name: 'coinbase_dev',   icon: '🔵',  bg_color: '#e6f0ff', messages: '开发者工具与 SDK 更新', created: Math.floor((now - 22 * 60 * 60_000) / 1000) },
  { id: 30, name: 'gate_research',  icon: '🔺',  bg_color: '#fff0f5', messages: '研究报告：板块轮动与交易量结构', created: Math.floor((now - 23 * 60 * 60_000) / 1000) },
  { id: 31, name: 'Bybit_Research', icon: '🟠',  bg_color: '#fff4e5', messages: '市场结构观察：资金费率与持仓量', created: Math.floor((now - 24 * 60 * 60_000) / 1000) },
  { id: 32, name: 'kucoin_news',    icon: '🟢',  bg_color: '#e8fff0', messages: '上币公告与活动汇总', created: Math.floor((now - 25 * 60 * 60_000) / 1000) },
  { id: 33, name: 'mexc_news',      icon: '🟣',  bg_color: '#f3e8ff', messages: '合约功能升级与风控提示', created: Math.floor((now - 26 * 60 * 60_000) / 1000) },
  { id: 34, name: 'bitget_earn',    icon: '🟧',  bg_color: '#fff2e6', messages: 'Earn 产品新手引导', created: Math.floor((now - 27 * 60 * 60_000) / 1000) },
  { id: 35, name: 'htx_announce',   icon: '🟥',  bg_color: '#ffe6e6', messages: '公告：系统维护与升级计划', created: Math.floor((now - 28 * 60 * 60_000) / 1000) },
  { id: 36, name: 'kraken_support', icon: '🟪',  bg_color: '#efe6ff', messages: '支持中心：常见问题与安全提醒', created: Math.floor((now - 29 * 60 * 60_000) / 1000) },
  { id: 37, name: 'defillama',      icon: '🦙',  bg_color: '#f0fff5', messages: 'TVL 变动与跨链桥活跃数据', created: Math.floor((now - 30 * 60 * 60_000) / 1000) },
  { id: 38, name: 'arb_foundation', icon: '🅰️',  bg_color: '#e6f7ff', messages: '生态资助计划更新', created: Math.floor((now - 31 * 60 * 60_000) / 1000) },
  { id: 39, name: 'optimismFND',    icon: '🅾️',  bg_color: '#ffe6f7', messages: 'OP Stack 与治理提案进展', created: Math.floor((now - 32 * 60 * 60_000) / 1000) },
  { id: 40, name: 'LineaBuild',     icon: '🟦',  bg_color: '#e6f0ff', messages: '主网投产工具链升级', created: Math.floor((now - 33 * 60 * 60_000) / 1000) },
];

export default twitters;
