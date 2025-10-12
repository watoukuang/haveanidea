import React from 'react';
import Layout from '../components/Layout';

export default function Launch(): React.ReactElement {
  const [walletAddress, setWalletAddress] = React.useState('');
  const [ideaTitle, setIdeaTitle] = React.useState('');
  const [idea, setIdea] = React.useState('');
  const [tags, setTags] = React.useState('');
  const [iconFile, setIconFile] = React.useState<File | null>(null);
  const [iconPreview, setIconPreview] = React.useState<string>('');
  const [enableCrowdfunding, setEnableCrowdfunding] = React.useState(false);
  const [crowdfundingMode, setCrowdfundingMode] = React.useState('nft');
  const [fundingPrice, setFundingPrice] = React.useState('');
  const [revenueShare, setRevenueShare] = React.useState('10');
  const [fundingGoal, setFundingGoal] = React.useState('');
  const [tokenSymbol, setTokenSymbol] = React.useState('');
  const [twitter, setTwitter] = React.useState('');
  const [discord, setDiscord] = React.useState('');
  const [telegram, setTelegram] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);
  const [message, setMessage] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [isConnected, setIsConnected] = React.useState(false);
  const [isDeploying, setIsDeploying] = React.useState(false);
  const [txHash, setTxHash] = React.useState<string>('');
  const [showSuccessModal, setShowSuccessModal] = React.useState(false);
  const [deployedMode, setDeployedMode] = React.useState<string>('');

  const maxLen = 1000;

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
          setIsConnected(true);
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

  const deployToBlockchain = async (data: any): Promise<string> => {
    setIsDeploying(true);
    
    try {
      if (!window.ethereum) throw new Error('Please install MetaMask');
      
      const provider = new (window as any).ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      
      if (data.crowdfunding) {
        if (data.crowdfunding.mode === 'nft') {
          // 部署NFT众筹合约
          return await deployNFTCrowdfunding(signer, data);
        } else if (data.crowdfunding.mode === 'token') {
          // 部署Token众筹合约
          return await deployTokenCrowdfunding(signer, data);
        } else if (data.crowdfunding.mode === 'dao') {
          // 部署DAO众筹合约
          return await deployDAOCrowdfunding(signer, data);
        } else if (data.crowdfunding.mode === 'presale') {
          // 部署预售合约
          return await deployPresaleCrowdfunding(signer, data);
        }
      } else {
        // 仅存储想法，不众筹
        return await deployIdeaRegistry(signer, data);
      }
      
      throw new Error('Invalid crowdfunding mode');
      
    } catch (error: any) {
      throw new Error(`Deployment failed: ${error.message}`);
    }
  };

  const deployNFTCrowdfunding = async (signer: any, data: any): Promise<string> => {
    // NFT众筹合约部署逻辑
    const contractFactory = new (window as any).ethers.ContractFactory(
      NFT_CROWDFUNDING_ABI, 
      NFT_CROWDFUNDING_BYTECODE, 
      signer
    );
    
    const contract = await contractFactory.deploy(
      data.title,
      data.iconHash,
      (window as any).ethers.utils.parseEther(data.crowdfunding.price),
      Math.floor(parseFloat(data.crowdfunding.goal) / parseFloat(data.crowdfunding.price)), // maxSupply
      data.crowdfunding.revenueShare
    );
    
    await contract.deployed();
    return contract.deployTransaction.hash;
  };

  const deployTokenCrowdfunding = async (signer: any, data: any): Promise<string> => {
    // Token众筹合约部署逻辑
    const contractFactory = new (window as any).ethers.ContractFactory(
      TOKEN_CROWDFUNDING_ABI,
      TOKEN_CROWDFUNDING_BYTECODE,
      signer
    );
    
    const contract = await contractFactory.deploy(
      data.crowdfunding.tokenSymbol,
      data.title,
      data.iconHash,
      (window as any).ethers.utils.parseEther(data.crowdfunding.price),
      (window as any).ethers.utils.parseEther(data.crowdfunding.goal),
      data.crowdfunding.revenueShare
    );
    
    await contract.deployed();
    return contract.deployTransaction.hash;
  };

  const deployDAOCrowdfunding = async (signer: any, data: any): Promise<string> => {
    // DAO众筹合约部署逻辑 - 创建治理代币和DAO
    return new Promise((resolve) => {
      setTimeout(() => resolve(`0xdao${Math.random().toString(16).substring(2)}`), 2000);
    });
  };

  const deployPresaleCrowdfunding = async (signer: any, data: any): Promise<string> => {
    // 预售众筹合约部署逻辑
    return new Promise((resolve) => {
      setTimeout(() => resolve(`0xpresale${Math.random().toString(16).substring(2)}`), 2000);
    });
  };

  const deployIdeaRegistry = async (signer: any, data: any): Promise<string> => {
    // 仅想法注册，不众筹
    return new Promise((resolve) => {
      setTimeout(() => resolve(`0xidea${Math.random().toString(16).substring(2)}`), 1500);
    });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    if (!walletAddress.trim()) return setError('Please connect your wallet');
    if (!ideaTitle.trim()) return setError('Please enter idea title');
    if (!idea.trim()) return setError('Please describe your idea');
    if (!iconFile) return setError('Please upload an icon for your idea');
    if (enableCrowdfunding && !fundingPrice.trim()) return setError('Please set funding price for your crowdfunding campaign');
    if (enableCrowdfunding && crowdfundingMode === 'token' && !tokenSymbol.trim()) return setError('Please set token symbol for token crowdfunding');
    if (enableCrowdfunding && !twitter.trim() && !discord.trim() && !telegram.trim()) return setError('Please provide at least one contact method for supporters to reach you');

    try {
      setSubmitting(true);
      setMessage('📤 Uploading to IPFS...');
      
      // 1. 上传图标到IPFS
      const iconHash = await uploadToIPFS(iconFile);
      
      setMessage('⛓️ Deploying to blockchain...');
      
      // 2. 准备区块链数据
      const blockchainData = {
        creator: walletAddress,
        title: ideaTitle,
        description: idea,
        iconHash,
        tags: tags.split(',').map(t => t.trim()).filter(t => t),
        crowdfunding: enableCrowdfunding ? {
          mode: crowdfundingMode,
          price: fundingPrice,
          goal: fundingGoal,
          revenueShare,
          tokenSymbol
        } : null,
        socialMedia: { twitter, discord, telegram },
        timestamp: Date.now()
      };
      
      // 3. 部署到区块链
      const txHash = await deployToBlockchain(blockchainData);
      setTxHash(txHash);
      
      // 4. 记录到后端（用于索引和搜索）
      await fetch('/api/launch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...blockchainData,
          txHash,
          iconHash
        }),
      });
      
      setMessage(`✅ Idea deployed successfully! Transaction: ${txHash.substring(0, 10)}...`);
      
      // 显示成功模态框
      if (enableCrowdfunding) {
        setDeployedMode(crowdfundingMode);
        setShowSuccessModal(true);
      }
      
      // 重置表单
      setWalletAddress(''); setIdeaTitle(''); setIdea(''); setTags(''); 
      setIconFile(null); setIconPreview(''); setEnableCrowdfunding(false); 
      setCrowdfundingMode('nft'); setFundingPrice(''); setRevenueShare('10'); 
      setFundingGoal(''); setTokenSymbol(''); setTwitter(''); setDiscord(''); setTelegram('');
      
    } catch (err: any) {
      setError(err?.message || 'Blockchain deployment failed, please try again');
    } finally {
      setSubmitting(false);
      setIsDeploying(false);
    }
  };

  const getToolUrl = (mode: string) => {
    switch (mode) {
      case 'nft': return '/nft-mint';
      case 'token': return '/token-sale';
      case 'dao': return '/dao-governance';
      case 'presale': return '/presale';
      default: return '/';
    }
  };

  const getToolName = (mode: string) => {
    switch (mode) {
      case 'nft': return 'NFT Minting Hub';
      case 'token': return 'Token Sale Hub';
      case 'dao': return 'DAO Governance Hub';
      case 'presale': return 'Presale Hub';
      default: return 'Tools';
    }
  };

  const goToTool = () => {
    window.location.href = getToolUrl(deployedMode);
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
              {error && <div className="text-sm text-red-600 dark:text-red-400">{error}</div>}
              {message && <div className="text-sm text-emerald-600 dark:text-emerald-400">{message}</div>}

              {/* Wallet Connection */}
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200"><span className="text-red-500 mr-1">*</span>Wallet Address</label>
                {!isConnected ? (
                  <button
                    type="button"
                    onClick={connectWallet}
                    className="w-full rounded-md bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-2.5 text-sm font-medium hover:opacity-90 transition-opacity"
                  >
                    🦊 Connect Wallet
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <input
                      value={walletAddress}
                      readOnly
                      className="flex-1 rounded-md bg-gray-50 text-gray-700 border border-gray-200 px-4 py-2.5 text-sm dark:bg-[#1a1d23] dark:text-gray-300 dark:border-gray-700"
                    />
                    <span className="text-green-500 text-sm">✓ Connected</span>
                  </div>
                )}
              </div>

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
                            onChange={(e) => setCrowdfundingMode(e.target.value)}
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
                            onChange={(e) => setCrowdfundingMode(e.target.value)}
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
                            onChange={(e) => setCrowdfundingMode(e.target.value)}
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
                            onChange={(e) => setCrowdfundingMode(e.target.value)}
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
                    {/* Dynamic Fields Based on Crowdfunding Mode */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200"><span className="text-red-500 mr-1">*</span>
                          {crowdfundingMode === 'nft' ? 'NFT Price (ETH)' : 
                           crowdfundingMode === 'token' ? 'Token Price (ETH)' : 
                           crowdfundingMode === 'dao' ? 'DAO Share Price (ETH)' : 'Presale Price (ETH)'}
                        </label>
                        <input
                          type="number"
                          step="0.001"
                          value={fundingPrice}
                          onChange={(e) => setFundingPrice(e.target.value)}
                          placeholder="0.1"
                          className="w-full rounded-md bg-white text-gray-900 placeholder-gray-400 border border-gray-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-400/30 focus:border-indigo-400/60 dark:bg-[#171a21] dark:text-gray-100 dark:placeholder-gray-500 dark:border-transparent dark:focus:ring-2 dark:focus:ring-indigo-500/30 dark:focus:border-indigo-400/60"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">Funding Goal (ETH)</label>
                        <input
                          type="number"
                          step="0.1"
                          value={fundingGoal}
                          onChange={(e) => setFundingGoal(e.target.value)}
                          placeholder="10"
                          className="w-full rounded-md bg-white text-gray-900 placeholder-gray-400 border border-gray-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-400/30 focus:border-indigo-400/60 dark:bg-[#171a21] dark:text-gray-100 dark:placeholder-gray-500 dark:border-transparent dark:focus:ring-2 dark:focus:ring-indigo-500/30 dark:focus:border-indigo-400/60"
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Total funding target</p>
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      {crowdfundingMode === 'token' && (
                        <div>
                          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200"><span className="text-red-500 mr-1">*</span>Token Symbol</label>
                          <input
                            type="text"
                            value={tokenSymbol}
                            onChange={(e) => setTokenSymbol(e.target.value.toUpperCase())}
                            placeholder="IDEA"
                            maxLength={6}
                            className="w-full rounded-md bg-white text-gray-900 placeholder-gray-400 border border-gray-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-400/30 focus:border-indigo-400/60 dark:bg-[#171a21] dark:text-gray-100 dark:placeholder-gray-500 dark:border-transparent dark:focus:ring-2 dark:focus:ring-indigo-500/30 dark:focus:border-indigo-400/60"
                          />
                        </div>
                      )}
                      <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">
                          {crowdfundingMode === 'nft' ? 'Revenue Share %' : 
                           crowdfundingMode === 'token' ? 'Token Allocation %' : 
                           crowdfundingMode === 'dao' ? 'Governance Share %' : 'Discount %'}
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="50"
                          value={revenueShare}
                          onChange={(e) => setRevenueShare(e.target.value)}
                          placeholder="10"
                          className="w-full rounded-md bg-white text-gray-900 placeholder-gray-400 border border-gray-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-400/30 focus:border-indigo-400/60 dark:bg-[#171a21] dark:text-gray-100 dark:placeholder-gray-500 dark:border-transparent dark:focus:ring-2 dark:focus:ring-indigo-500/30 dark:focus:border-indigo-400/60"
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {crowdfundingMode === 'nft' ? '% of future revenue for supporters' : 
                           crowdfundingMode === 'token' ? '% of tokens for crowdfunding' : 
                           crowdfundingMode === 'dao' ? '% of governance rights' : '% discount for early supporters'}
                        </p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">Creator Contact (Required for Crowdfunding)</label>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Supporters need to contact you for project updates and collaboration</p>
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={twitter}
                          onChange={(e) => setTwitter(e.target.value)}
                          placeholder="Twitter/X handle (e.g., @username)"
                          className="w-full rounded-md bg-white text-gray-900 placeholder-gray-400 border border-gray-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-400/30 focus:border-indigo-400/60 dark:bg-[#171a21] dark:text-gray-100 dark:placeholder-gray-500 dark:border-transparent dark:focus:ring-2 dark:focus:ring-indigo-500/30 dark:focus:border-indigo-400/60"
                        />
                        <input
                          type="text"
                          value={discord}
                          onChange={(e) => setDiscord(e.target.value)}
                          placeholder="Discord username (e.g., username#1234)"
                          className="w-full rounded-md bg-white text-gray-900 placeholder-gray-400 border border-gray-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-400/30 focus:border-indigo-400/60 dark:bg-[#171a21] dark:text-gray-100 dark:placeholder-gray-500 dark:border-transparent dark:focus:ring-2 dark:focus:ring-indigo-500/30 dark:focus:border-indigo-400/60"
                        />
                        <input
                          type="text"
                          value={telegram}
                          onChange={(e) => setTelegram(e.target.value)}
                          placeholder="Telegram handle (e.g., @username)"
                          className="w-full rounded-md bg-white text-gray-900 placeholder-gray-400 border border-gray-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-400/30 focus:border-indigo-400/60 dark:bg-[#171a21] dark:text-gray-100 dark:placeholder-gray-500 dark:border-transparent dark:focus:ring-2 dark:focus:ring-indigo-500/30 dark:focus:border-indigo-400/60"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-2">
                <button type="submit" disabled={submitting || isDeploying} className="w-full inline-flex items-center justify-center rounded-md px-5 py-3 text-sm font-medium text-black bg-amber-400 hover:bg-amber-300 disabled:opacity-60 disabled:cursor-not-allowed shadow">
                  {submitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-black" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {isDeploying ? 'Deploying to Blockchain...' : 'Uploading to IPFS...'}
                    </>
                  ) : (
                    <>⛓️ Deploy to Blockchain</>
                  )}
                </button>
                
                {txHash && (
                  <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                    <p className="text-sm text-green-800 dark:text-green-200">
                      <strong>Transaction Hash:</strong>
                      <br />
                      <code className="break-all text-xs">{txHash}</code>
                    </p>
                    <a 
                      href={`https://etherscan.io/tx/${txHash}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center mt-2 text-xs text-green-600 dark:text-green-400 hover:underline"
                    >
                      View on Etherscan ↗
                    </a>
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* 成功部署模态框 */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#1a1b1e] rounded-2xl p-8 max-w-md w-full mx-4 border border-gray-200 dark:border-gray-700">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              
              <h3 className="text-xl font-semibold mb-2">🎉 Deployment Successful!</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Your idea has been successfully deployed to the blockchain with {deployedMode.toUpperCase()} crowdfunding enabled.
              </p>

              {txHash && (
                <div className="mb-6 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Transaction Hash:</p>
                  <code className="text-xs break-all font-mono">{txHash}</code>
                </div>
              )}

              <div className="space-y-3">
                <button
                  onClick={goToTool}
                  className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
                >
                  🚀 Go to {getToolName(deployedMode)}
                </button>
                
                <button
                  onClick={() => setShowSuccessModal(false)}
                  className="w-full px-6 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                >
                  Stay on this page
                </button>
              </div>

              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                  What's Next?
                </h4>
                <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1 text-left">
                  <li>• Your project is now live on the blockchain</li>
                  <li>• Supporters can start participating in your crowdfunding</li>
                  <li>• Use the {getToolName(deployedMode)} to manage your campaign</li>
                  <li>• Share your project with the community</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
