import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { Tool, Tag } from '../../types';
import { api } from '../../lib/api';

export default function IdeaDetail(): React.ReactElement {
  const router = useRouter();
  const { id } = router.query;
  const [items, setItems] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [account, setAccount] = useState<string>('');

  useEffect(() => {
    let ignore = false;
    api.getCexs().then((data) => { if (!ignore) { setItems(data || []); setLoading(false); } }).catch(() => setLoading(false));
    return () => { ignore = true; };
  }, []);

  // Read connected EVM address (MetaMask or compatible)
  useEffect(() => {
    const eth: any = (typeof window !== 'undefined') ? (window as any).ethereum : undefined;
    if (!eth) return;
    let mounted = true;
    const fetch = async () => {
      try {
        const accounts: string[] = await eth.request({ method: 'eth_accounts' });
        if (mounted) setAccount((accounts?.[0] || '').toLowerCase());
      } catch {}
    };
    fetch();
    const onChanged = (accs: string[]) => setAccount((accs?.[0] || '').toLowerCase());
    eth.on?.('accountsChanged', onChanged);
    return () => { mounted = false; eth.removeListener?.('accountsChanged', onChanged); };
  }, []);

  const idea: Tool | undefined = useMemo(() => {
    const num = Number(id);
    if (!id || Number.isNaN(num)) return undefined;
    return items.find(t => t.id === num);
  }, [id, items]);

  const first: Tag | undefined = idea?.messages?.[0];
  const isOwner = useMemo(() => {
    const d = (idea?.deployer || '').toLowerCase();
    return d && account && d === account;
  }, [idea?.deployer, account]);

  return (
    <Layout>
      <div className="px-4 lg:px-12 max-w-screen-2xl mx-auto py-6 md:py-10">
        {/* 返回导航 */}
        <button onClick={() => router.back()} className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">← Back</button>

        {/* 头部信息 */}
        <div className="mt-4 flex items-start gap-4">
          <div className="h-16 w-16 rounded-2xl flex items-center justify-center text-4xl select-none bg-gray-100 dark:bg-[#1d2026]" style={{ backgroundColor: idea?.bg_color || undefined }}>
            <span style={{ fontFamily: 'Apple Color Emoji, Segoe UI Emoji, Noto Color Emoji, emoji' }}>{idea?.icon || '💡'}</span>
          </div>
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">{idea?.name || (loading ? 'Loading…' : 'Not Found')}</h1>
            <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              {idea ? (
                <>
                  <span className="mr-3">Category: {idea.category || '—'}</span>
                  <span>Type: {idea.type || '—'}</span>
                </>
              ) : null}
            </div>
          </div>
        </div>

        {/* 主体内容 */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="rounded-xl border border-gray-200 bg-white p-5 dark:bg-[#15171b] dark:border-[#23252a]">
              <h2 className="text-lg font-semibold">Overview</h2>
              <p className="mt-2 text-[15px] text-gray-700 dark:text-gray-300">
                {first?.title || 'No description yet.'}
              </p>
            </div>

            <div className="mt-6 rounded-xl border border-gray-200 bg-white p-5 dark:bg-[#15171b] dark:border-[#23252a]">
              <h2 className="text-lg font-semibold">Latest Updates</h2>
              <ul className="mt-3 space-y-3">
                {(idea?.messages || []).map((m, i) => (
                  <li key={i} className="rounded-lg p-3 bg-gray-50 dark:bg-[#1b1e24]">
                    <div className="text-sm text-gray-800 dark:text-gray-200">{m.title}</div>
                    {m.href ? (
                      <a href={m.href} target="_blank" rel="noopener noreferrer" className="mt-1 inline-block text-xs text-indigo-600 hover:underline dark:text-indigo-400">Source</a>
                    ) : null}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 侧栏 */}
          <aside>
            {/* 根据类型和用户身份显示不同工具 */}
            {idea?.type?.toLowerCase().includes('nft') ? (
              <div className="rounded-xl border border-gray-200 bg-white p-4 dark:bg-[#15171b] dark:border-[#23252a]">
                <h3 className="text-base font-semibold mb-3">NFT Tools</h3>
                <div className="space-y-2">
                  <Link href="/nft-mint" className="block w-full px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 transition-all text-center">
                    💎 Mint NFT
                  </Link>
                  <Link href={`/nft-mint?collection=${idea.id}`} className="block w-full px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-purple-500 to-pink-600 text-white hover:from-purple-600 hover:to-pink-700 transition-all text-center">
                    🎨 View Collection
                  </Link>
                  {isOwner && (
                    <Link href={`/marketplace/sell?idea=${idea.id}`} className="block w-full px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 transition-all text-center">
                      💰 List for Sale
                    </Link>
                  )}
                </div>
              </div>
            ) : idea?.type?.toLowerCase().includes('token') ? (
              <div className="rounded-xl border border-gray-200 bg-white p-4 dark:bg-[#15171b] dark:border-[#23252a]">
                <h3 className="text-base font-semibold mb-3">Token Tools</h3>
                <div className="space-y-2">
                  <Link href="/token-sale" className="block w-full px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-yellow-500 to-orange-600 text-white hover:from-yellow-600 hover:to-orange-700 transition-all text-center">
                    🪙 Buy Tokens
                  </Link>
                  <Link href="/dao-governance" className="block w-full px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 transition-all text-center">
                    🏛️ Governance
                  </Link>
                  {isOwner && (
                    <Link href={`/token-sale?manage=${idea.id}`} className="block w-full px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 transition-all text-center">
                      📊 Manage Sale
                    </Link>
                  )}
                </div>
              </div>
            ) : idea?.type?.toLowerCase().includes('dao') ? (
              <div className="rounded-xl border border-gray-200 bg-white p-4 dark:bg-[#15171b] dark:border-[#23252a]">
                <h3 className="text-base font-semibold mb-3">DAO Tools</h3>
                <div className="space-y-2">
                  <Link href="/dao-governance" className="block w-full px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-blue-500 to-cyan-600 text-white hover:from-blue-600 hover:to-cyan-700 transition-all text-center">
                    🗳️ Vote on Proposals
                  </Link>
                  <Link href={`/dao-governance?join=${idea.id}`} className="block w-full px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:from-purple-600 hover:to-indigo-700 transition-all text-center">
                    💼 Join DAO
                  </Link>
                  {isOwner && (
                    <Link href={`/dao-governance?manage=${idea.id}`} className="block w-full px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 transition-all text-center">
                      ⚙️ DAO Settings
                    </Link>
                  )}
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-gray-200 bg-white p-4 dark:bg-[#15171b] dark:border-[#23252a]">
                <h3 className="text-base font-semibold mb-3">General Tools</h3>
                <div className="space-y-2">
                  <Link href="/nft-mint" className="block w-full px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-amber-400 to-orange-500 text-black hover:from-amber-500 hover:to-orange-600 transition-all text-center">
                    ✨ Mint Proof
                  </Link>
                  <Link href="/presale" className="block w-full px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 transition-all text-center">
                    🤝 Support Project
                  </Link>
                  {isOwner && (
                    <Link href="/marketplace" className="block w-full px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 transition-all text-center">
                      🏪 Create Marketplace
                    </Link>
                  )}
                </div>
              </div>
            )}

            {/* Owner-only launch configuration display */}
            {isOwner && idea?.launch && (
              <div className="mt-6 rounded-xl border border-gray-200 bg-white p-4 dark:bg-[#15171b] dark:border-[#23252a]">
                <h3 className="text-base font-semibold">Launch Parameters</h3>
                <dl className="mt-3 space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  {idea.launch.priceEth !== undefined && (
                    <div className="flex justify-between"><dt>NFT Price (ETH)</dt><dd>{idea.launch.priceEth}</dd></div>
                  )}
                  {idea.launch.fundingGoalEth !== undefined && (
                    <div className="flex justify-between"><dt>Funding Goal (ETH)</dt><dd>{idea.launch.fundingGoalEth}</dd></div>
                  )}
                  {idea.launch.revenueSharePct !== undefined && (
                    <div className="flex justify-between"><dt>Revenue Share %</dt><dd>{idea.launch.revenueSharePct}%</dd></div>
                  )}
                </dl>
                {(idea.launch.contacts && (idea.launch.contacts.twitter || idea.launch.contacts.discord || idea.launch.contacts.telegram)) && (
                  <div className="mt-3">
                    <div className="text-sm font-medium">Creator Contact</div>
                    <ul className="mt-1 space-y-1 text-sm text-gray-600 dark:text-gray-400">
                      {idea.launch.contacts.twitter && (<li>Twitter: {idea.launch.contacts.twitter}</li>)}
                      {idea.launch.contacts.discord && (<li>Discord: {idea.launch.contacts.discord}</li>)}
                      {idea.launch.contacts.telegram && (<li>Telegram: {idea.launch.contacts.telegram}</li>)}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {!isOwner && idea?.deployer && (
              <div className="mt-6 text-xs text-gray-500 dark:text-gray-500">
                Owner-only launch details. Connect the owner wallet to view.
              </div>
            )}
          </aside>
        </div>
      </div>
    </Layout>
  );
}
