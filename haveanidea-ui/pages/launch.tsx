import React from 'react';
import Layout from '../components/Layout';
import { submitIdea, type LaunchPayload } from '../api/idea';

export default function Launch(): React.ReactElement {
  const [walletAddress, setWalletAddress] = React.useState('');
  const [ideaTitle, setIdeaTitle] = React.useState('');
  const [idea, setIdea] = React.useState('');
  const [tags, setTags] = React.useState('');
  const [iconFile, setIconFile] = React.useState<File | null>(null);
  const [iconPreview, setIconPreview] = React.useState<string>('');
  const [enableCrowdfunding, setEnableCrowdfunding] = React.useState(false);
  const [crowdfundingMode, setCrowdfundingMode] = React.useState<'nft' | 'token' | 'dao' | 'presale'>('nft');
  const [submitting, setSubmitting] = React.useState(false);
  const [message, setMessage] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  
  

  const maxLen = 1000;

  React.useEffect(() => {
    try {
      const saved = typeof window !== 'undefined' ? localStorage.getItem('walletAddress') : null;
      if (saved) {
        setWalletAddress(saved);
        setError(null);
      }
    } catch {}

    const handler = (e: any) => {
      if (e?.detail?.address) {
        setWalletAddress(e.detail.address);
        setError(null);
      }
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('wallet_connected', handler as any);
    }
    // 检查现有账户
    const eth = (typeof window !== 'undefined' && (window as any).ethereum) ? (window as any).ethereum : null;
    const initAccounts = async () => {
      try {
        if (!eth) return;
        const accounts = await eth.request({ method: 'eth_accounts' });
        const addr = accounts?.[0];
        if (addr) {
          setWalletAddress(addr);
          setError(null);
          try { localStorage.setItem('walletAddress', addr); } catch {}
        }
      } catch {}
    };
    initAccounts();

    // 监听账户变更
    const onAccountsChanged = (accounts: string[]) => {
      const addr = accounts?.[0] || '';
      setWalletAddress(addr);
      if (addr) setError(null);
      try {
        if (addr) localStorage.setItem('walletAddress', addr); else localStorage.removeItem('walletAddress');
      } catch {}
    };
    if (eth && eth.on) eth.on('accountsChanged', onAccountsChanged);
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('wallet_connected', handler as any);
      }
      if (eth && eth.removeListener) eth.removeListener('accountsChanged', onAccountsChanged);
    };
  }, []);

  const handleIconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        setError('Icon file size must be less than 2MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        setError('Please upload an image file');
        return;
      }
      setIconFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setIconPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const connectWallet = async () => {
    try {
      if (typeof window !== 'undefined' && (window as any).ethereum) {
        const accounts = await (window as any).ethereum.request({
          method: 'eth_requestAccounts',
        });
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
          setError(null);
          try {
            localStorage.setItem('walletAddress', accounts[0]);
          } catch {}
          try {
            window.dispatchEvent(new CustomEvent('wallet_connected', { detail: { address: accounts[0] } }));
          } catch {}
        }
      } else {
        setError('Please install MetaMask or another Web3 wallet');
      }
    } catch (err: any) {
      setError('Failed to connect wallet: ' + err.message);
    }
  };

  const uploadToIPFS = async (file: File): Promise<string> => {
    // 模拟IPFS上传，实际应该调用IPFS API
    // 返回IPFS哈希
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(`QmX${Math.random().toString(36).substring(2)}`);
      }, 1000);
    });
  };

  // 移除链上部署逻辑，仅与后端交互

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    if (!walletAddress.trim()) return setError('请先连接钱包');
    if (!ideaTitle.trim()) return setError('Please enter idea title');
    if (!idea.trim()) return setError('Please describe your idea');
    if (!iconFile) return setError('Please upload an icon for your idea');

    try {
      setSubmitting(true);
      setMessage('📤 Uploading to IPFS...');
      
      // 1. 上传图标到IPFS
      const iconHash = await uploadToIPFS(iconFile);
      
      setMessage('📝 Saving...');
      
      // 2. 准备提交数据（仅后端）
      const blockchainData: LaunchPayload = {
        title: ideaTitle,
        description: idea,
        iconHash,
        tags: tags.split(',').map(t => t.trim()).filter(t => t),
        timestamp: Date.now(),
        ...(enableCrowdfunding && { crowdfundingMode })
      };
      
      // 3. 记录到后端（用于索引和搜索）
      await submitIdea(blockchainData);
      
      setMessage('✅ Idea submitted successfully!');
      
      // 重置表单
      setWalletAddress(''); setIdeaTitle(''); setIdea(''); setTags(''); 
      setIconFile(null); setIconPreview(''); setEnableCrowdfunding(false); 
      setCrowdfundingMode('nft');
      
    } catch (err: any) {
      setError(err?.message || 'Blockchain deployment failed, please try again');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="px-4 lg:px-12 max-w-screen-2xl mx-auto py-8 md:py-12 pb-24 lg:pb-16">
        <div className="mb-8 md:mb-12 text-center">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight mb-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 bg-clip-text text-transparent dark:from-sky-400 dark:via-indigo-400 dark:to-emerald-300">Launch · Deploy Your Idea On-Chain</h1>
          <p className="mx-auto max-w-2xl text-[13.5px] md:text-base leading-relaxed text-gray-600 dark:text-gray-300">Store your idea permanently on blockchain with IPFS. Immutable, verifiable, and truly decentralized ownership.</p>
        </div>

        <div className="relative max-w-2xl mx-auto">
          <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-emerald-400/70 via-sky-500/70 to-fuchsia-600/70 blur-2xl opacity-35"></div>
          <div className="relative rounded-2xl border bg-white/90 border-gray-200 dark:bg-[#0f1115]/90 dark:border-violet-500/40 backdrop-blur px-6 md:px-7 py-7 md:py-8 shadow-sm md:shadow dark:shadow-[0_0_0_1px_rgba(67,56,202,0.5)]">
            <form onSubmit={onSubmit} className="space-y-5 md:space-y-6">
              {error && (
                error === '请先连接钱包' ? (
                  <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/80 dark:border-blue-800/50 dark:bg-blue-900/20">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className="text-xl leading-none">🦊</div>
                        <div>
                          <div className="font-medium text-blue-900 dark:text-blue-200">请先连接钱包</div>
                          <div className="text-xs text-blue-800/80 dark:text-blue-300/80 mt-0.5">提交前需连接钱包以完成签名与部署。</div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={connectWallet}
                        className="shrink-0 inline-flex items-center px-3 py-1.5 rounded-md text-white text-xs font-medium bg-gradient-to-r from-purple-500 to-blue-500 hover:opacity-90"
                      >
                        立即连接
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-red-600 dark:text-red-400">{error}</div>
                )
              )}
              {message && (
                <div className="p-3 rounded-lg border border-emerald-300 bg-emerald-50/80 text-emerald-800 text-sm dark:border-emerald-700/60 dark:bg-emerald-900/20 dark:text-emerald-200">
                  {message}
                </div>
              )}


              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200"><span className="text-red-500 mr-1">*</span>Idea Title</label>
                <input value={ideaTitle} onChange={(e)=>setIdeaTitle(e.target.value)} placeholder="Give your idea a catchy title" className="w-full rounded-md bg-white text-gray-900 placeholder-gray-400 border border-gray-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-400/30 focus:border-indigo-400/60 dark:bg-[#171a21] dark:text-gray-100 dark:placeholder-gray-500 dark:border-transparent dark:focus:ring-2 dark:focus:ring-indigo-500/30 dark:focus:border-indigo-400/60" />
              </div>

              {/* Icon Upload */}
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200"><span className="text-red-500 mr-1">*</span>Idea Icon</label>
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0">
                    {iconPreview ? (
                      <img src={iconPreview} alt="Icon preview" className="w-16 h-16 rounded-xl object-cover border border-gray-200 dark:border-gray-700" />
                    ) : (
                      <div className="w-16 h-16 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center">
                        <span className="text-2xl">🎨</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleIconUpload}
                      className="hidden"
                      id="icon-upload"
                    />
                    <label
                      htmlFor="icon-upload"
                      className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-[#171a21] hover:bg-gray-50 dark:hover:bg-[#1f2329] cursor-pointer"
                    >
                      📁 Upload Icon
                    </label>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      PNG, JPG, GIF up to 2MB. Recommended: 256x256px
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">Tags</label>
                <input value={tags} onChange={(e)=>setTags(e.target.value)} placeholder="e.g. DeFi, NFT, Gaming, AI (comma separated)" className="w-full rounded-md bg-white text-gray-900 placeholder-gray-400 border border-gray-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-400/30 focus:border-indigo-400/60 dark:bg-[#171a21] dark:text-gray-100 dark:placeholder-gray-500 dark:border-transparent dark:focus:ring-2 dark:focus:ring-indigo-500/30 dark:focus:border-indigo-400/60" />
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200"><span className="text-red-500 mr-1">*</span>Your Idea & Requirements</label>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{idea.length}/{maxLen}</span>
                </div>
                <textarea value={idea} onChange={(e)=>setIdea(e.target.value.slice(0,maxLen))} rows={6} placeholder="Briefly describe your idea, target audience, timeline, and any resources you need" className="w-full rounded-md bg-white text-gray-900 placeholder-gray-400 border border-gray-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-400/30 focus:border-indigo-400/60 resize-y dark:bg-[#171a21] dark:text-gray-100 dark:placeholder-gray-500 dark:border-transparent dark:focus:ring-2 dark:focus:ring-indigo-500/30 dark:focus:border-indigo-400/60" />
              </div>

              {/* Crowdfunding Options */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-5">
                <div className="flex items-center gap-3 mb-4">
                  <input
                    type="checkbox"
                    id="enableCrowdfunding"
                    checked={enableCrowdfunding}
                    onChange={(e) => setEnableCrowdfunding(e.target.checked)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="enableCrowdfunding" className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    🚀 Enable Crowdfunding (Optional)
                  </label>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                  Launch a crowdfunding campaign to get support for your idea. Choose from multiple funding models.
                </p>

                {enableCrowdfunding && (
                  <div className="space-y-4 pl-7">
                    {/* Crowdfunding Mode Selection */}
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">Crowdfunding Model</label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 dark:border-gray-600">
                          <input
                            type="radio"
                            name="crowdfundingMode"
                            value="nft"
                            checked={crowdfundingMode === 'nft'}
                            onChange={(e) => setCrowdfundingMode(e.target.value as 'nft' | 'token' | 'dao' | 'presale')}
                            className="mr-3"
                          />
                          <div>
                            <div className="font-medium text-sm">💎 NFT Crowdfunding</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              • Deploy ERC-721 contract<br/>
                              • Supporters mint NFTs at set price<br/>
                              • Automatic royalty distribution
                            </div>
                          </div>
                        </label>
                        <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 dark:border-gray-600">
                          <input
                            type="radio"
                            name="crowdfundingMode"
                            value="token"
                            checked={crowdfundingMode === 'token'}
                            onChange={(e) => setCrowdfundingMode(e.target.value as 'nft' | 'token' | 'dao' | 'presale')}
                            className="mr-3"
                          />
                          <div>
                            <div className="font-medium text-sm">🪙 Token Crowdfunding</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              • Deploy ERC-20 token contract<br/>
                              • Supporters buy tokens with ETH<br/>
                              • Governance voting rights included
                            </div>
                          </div>
                        </label>
                        <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 dark:border-gray-600">
                          <input
                            type="radio"
                            name="crowdfundingMode"
                            value="dao"
                            checked={crowdfundingMode === 'dao'}
                            onChange={(e) => setCrowdfundingMode(e.target.value as 'nft' | 'token' | 'dao' | 'presale')}
                            className="mr-3"
                          />
                          <div>
                            <div className="font-medium text-sm">🏛️ DAO Crowdfunding</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              • Deploy DAO + governance token<br/>
                              • Members vote on decisions<br/>
                              • Collective project ownership
                            </div>
                          </div>
                        </label>
                        <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 dark:border-gray-600">
                          <input
                            type="radio"
                            name="crowdfundingMode"
                            value="presale"
                            checked={crowdfundingMode === 'presale'}
                            onChange={(e) => setCrowdfundingMode(e.target.value as 'nft' | 'token' | 'dao' | 'presale')}
                            className="mr-3"
                          />
                          <div>
                            <div className="font-medium text-sm">🎯 Presale Crowdfunding</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              • Deploy presale contract<br/>
                              • Early access to products<br/>
                              • Discounted pricing for supporters
                            </div>
                          </div>
                        </label>
                      </div>
                    </div>
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <p className="text-sm text-blue-800 dark:text-blue-200">
                        💡 <strong>Launch Parameters:</strong> After deployment, configure pricing, funding goals, and contact details in your idea's detail page (owner-only access).
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-2">
                <button type="submit" disabled={submitting} className="w-full inline-flex items-center justify-center rounded-md px-5 py-3 text-sm font-medium text-black bg-amber-400 hover:bg-amber-300 disabled:opacity-60 disabled:cursor-not-allowed shadow">
                  {submitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-black" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    <>Submit</>
                  )}
                </button>
                

              </div>
            </form>
          </div>
          </div>
        </div>
    </Layout>
  );
}
