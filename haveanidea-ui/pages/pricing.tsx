import React, { useState } from 'react';
import Layout from '../components/Layout';
import Link from 'next/link';

const plans = [
  {
    name: '自由的',
    price: '0',
    period: '每月',
    badge: '',
    features: [
      { label: 'DEX 交易机器人', value: '无限' },
      { label: '链节点', value: '私人的' },
      { label: '交易费', value: '0.5%' },
      { label: '自动化 API 和 WS', value: '无限' },
      { label: '营销 API 和 WS', value: '可扩展' },
    ],
    cta: '加入',
  },
  {
    name: '加',
    price: '19',
    period: '每月',
    badge: 'HOT',
    features: [
      { label: 'DEX 交易机器人', value: '无限' },
      { label: '链节点', value: '私人的' },
      { label: '交易费', value: '0.2%' },
      { label: '自动化 API 和 WS', value: '无限' },
      { label: '营销 API 和 WS', value: '可扩展' },
    ],
    cta: '开始',
  },
  {
    name: '专业版',
    price: '89',
    period: '每月',
    badge: 'ALPHA',
    features: [
      { label: 'DEX 交易机器人', value: '无限' },
      { label: '链节点', value: '私人的' },
      { label: '交易费', value: '0.03%' },
      { label: '自动化 API 和 WS', value: '无限' },
      { label: '营销 API 和 WS', value: '可扩展' },
    ],
    cta: '开始',
  },
  {
    name: '企业',
    price: '599',
    period: '每月',
    badge: 'ALPHA',
    features: [
      { label: 'DEX 交易机器人', value: '无限' },
      { label: '链节点', value: '私人的' },
      { label: '交易费', value: '0.01%' },
      { label: '自动化 API 和 WS', value: '无限' },
      { label: '营销 API 和 WS', value: '可扩展' },
    ],
    cta: '开始',
  },
];

const faqs = [
  {
    q: '我可以使用哪些方式付款？',
    a: '支持加密货币和信用卡支付；加密货币支持 Solana、以太坊、BNB Chain 等；信用卡支持 VISA、Mastercard、American Express 等。',
  },
  {
    q: '付款后如何查看和使用我的增值服务功能？',
    a: '完成支付后，会自动开通对应权限，您可以在个人中心查看使用状态。',
  },
  {
    q: '如何查看我的订单信息和发票？',
    a: '可在账户设置中查看订单记录及发票下载。',
  },
  {
    q: '如果有关订单或付款的问题应该联系谁？',
    a: '请通过底部的联系邮箱联系我们，我们将尽快回复。',
  },
  {
    q: '成为付费订阅会员后，会有专属客服吗？',
    a: '专业版与企业计划提供优先客服支持。',
  },
  {
    q: '我可以更改或取消我的计划吗？',
    a: '可以随时升级或降级，下个计费周期生效。',
  },
];

export default function Pricing(): React.ReactElement {
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly');
  const discount = billing === 'yearly' ? '（节省高达 20%）' : '';

  return (
    <Layout>
      <div className="px-4 lg:px-12 max-w-screen-2xl mx-auto py-10 md:py-14">
        {/* 标题与切换 */}
        <header className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">只需一个计划，即可进入 AI 世界</h1>
          <div className="inline-flex items-center gap-2 rounded-full bg-gray-100 p-1 dark:bg-[#1e1e1e]">
            <button onClick={() => setBilling('monthly')} className={`px-4 py-1.5 rounded-full text-sm ${billing==='monthly' ? 'bg-white shadow dark:bg-[#2a2c31]' : 'opacity-70'}`}>每月</button>
            <button onClick={() => setBilling('yearly')} className={`px-4 py-1.5 rounded-full text-sm ${billing==='yearly' ? 'bg-white shadow dark:bg-[#2a2c31]' : 'opacity-70'}`}>每年 <span className="opacity-70">{discount}</span></button>
          </div>
        </header>

        {/* 价格卡片 */}
        <section className="grid md:grid-cols-3 gap-5 md:gap-6 mb-8">
          {plans.slice(0,3).map((p, i) => (
            <div key={i} className="rounded-2xl border bg-white/80 backdrop-blur p-5 dark:bg-[#15161a]/80 dark:border-[#2a2c31]">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold">{p.name}</h3>
                {p.badge && <span className="text-xs px-2 py-0.5 rounded bg-red-600/90 text-white">{p.badge}</span>}
              </div>
              <div className="mb-4">
                <span className="text-3xl font-extrabold">{p.price}</span>
                <span className="ml-1 text-sm">美元</span>
                <span className="ml-2 text-sm text-gray-500">{p.period}</span>
              </div>
              <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300 mb-5">
                {p.features.map((f, idx) => (
                  <li key={idx} className="flex items-center justify-between">
                    <span className="flex items-center gap-2"><span className="text-emerald-500">✔</span>{f.label}</span>
                    <span className="opacity-80">{f.value}</span>
                  </li>
                ))}
              </ul>
              <button className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-lime-500 text-white py-2.5 hover:opacity-90">{p.cta}</button>
            </div>
          ))}
        </section>

        {/* 企业卡片 */}
        <section className="mb-12">
          <div className="rounded-2xl border bg-white/80 backdrop-blur p-5 dark:bg-[#15161a]/80 dark:border-[#2a2c31]">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">阿尔法</h3>
                <ol className="list-decimal pl-5 space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  <li>ALPHA 版本内测通道，仅对付费用户开放。</li>
                  <li>内测期间所有付费订阅（Plus / Pro / Enterprise）均自动加入 ALPHA 会员渠道。</li>
                  <li>所有 ALPHA 订阅均保留审批权，直到主动取消或暂停。</li>
                  <li>当前支持主流公链与稳定币（USDT、USDC）与信用卡支付。</li>
                  <li>若支付出现延迟，请耐心等待或联系支持；重复支付或失败可退费。</li>
                </ol>
              </div>
              <div className="rounded-2xl border dark:border-[#2a2c31] p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold">企业</h3>
                  <span className="text-xs px-2 py-0.5 rounded bg-violet-600 text-white">ALPHA</span>
                </div>
                <div className="mb-4"><span className="text-3xl font-extrabold">599</span><span className="ml-1 text-sm">美元</span><span className="ml-2 text-sm text-gray-500">每月</span></div>
                <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300 mb-5">
                  <li className="flex items-center justify-between"><span className="flex items-center gap-2"><span className="text-emerald-500">✔</span>DEX 交易机器人</span><span>无限</span></li>
                  <li className="flex items-center justify-between"><span className="flex items-center gap-2"><span className="text-emerald-500">✔</span>链节点</span><span>私人的</span></li>
                  <li className="flex items-center justify-between"><span className="flex items-center gap-2"><span className="text-emerald-500">✔</span>交易费</span><span>0.01%</span></li>
                  <li className="flex items-center justify-between"><span className="flex items-center gap-2"><span className="text-emerald-500">✔</span>自动化 API 和 WS</span><span>无限</span></li>
                  <li className="flex items-center justify-between"><span className="flex items-center gap-2"><span className="text-emerald-500">✔</span>营销 API 和 WS</span><span>可扩展</span></li>
                </ul>
                <button className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-lime-500 text-white py-2.5 hover:opacity-90">开始</button>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-center">常见问题解答</h2>
          <div className="space-y-3">
            {faqs.map((f, i) => (
              <details key={i} className="rounded-2xl border p-4 bg-white/70 dark:bg-[#15161a]/70 dark:border-[#2a2c31]">
                <summary className="cursor-pointer list-none font-medium flex items-center justify-between">
                  <span>{f.q}</span>
                  <span className="opacity-60">+</span>
                </summary>
                <div className="mt-2 text-sm text-gray-700 dark:text-gray-300">{f.a}</div>
              </details>
            ))}
          </div>
        </section>

        {/* 比较计划（占位） */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-center">比较计划</h2>
          <div className="rounded-2xl border p-6 text-center text-sm text-gray-500 dark:text-gray-400 bg-white/50 dark:bg-[#15161a]/50 dark:border-[#2a2c31]">
            即将上线详细对比表。
          </div>
        </section>

        {/* 联系 CTA */}
        <section className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">企业需求或定制支持？</p>
          <Link href="mailto:contact@watoukuang.com" className="inline-flex items-center rounded-xl border px-4 py-2 dark:border-[#2a2c31]">联系我们</Link>
        </section>
      </div>
    </Layout>
  );
}
