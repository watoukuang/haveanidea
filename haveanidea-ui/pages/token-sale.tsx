import React from 'react';
import Layout from '../components/Layout';

export default function TokenSale(): React.ReactElement {
  const [selectedProject, setSelectedProject] = React.useState('');
  const [purchaseAmount, setPurchaseAmount] = React.useState('');
  const [isConnected, setIsConnected] = React.useState(false);
  const [walletAddress, setWalletAddress] = React.useState('');
  const [isPurchasing, setIsPurchasing] = React.useState(false);
  const [txHash, setTxHash] = React.useState('');

  // 模拟的Token众筹项目数据
  const tokenProjects = [
    {
      id: 1,
      title: "GameFi Protocol",
      symbol: "GAME",
      creator: "0x1234...5678",
      tokenPrice: "0.001",
      totalSupply: 1000000,
      sold: 150000,
      allocation: 30, // 30% for crowdfunding
      description: "Revolutionary gaming protocol with play-to-earn mechanics",
      contractAddress: "0xgame...1234",
      vestingPeriod: "6 months"
    },
    {
      id: 2,
      title: "Green Energy DAO",
      symbol: "GREEN",
      creator: "0x5678...9012",
      tokenPrice: "0.002",
      totalSupply: 500000,
      sold: 75000,
      allocation: 25,
      description: "Decentralized renewable energy investment platform",
      contractAddress: "0xgreen...5678",
      vestingPeriod: "12 months"
    }
  ];

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
        alert('Please install MetaMask');
      }
    } catch (err) {
      console.error('Wallet connection failed:', err);
    }
  };

  const purchaseTokens = async () => {
    if (!selectedProject || !purchaseAmount) return;
    
    const project = tokenProjects.find(p => p.id.toString() === selectedProject);
    if (!project) return;

    setIsPurchasing(true);
    
    try {
      const ethAmount = parseFloat(purchaseAmount);
      const tokenAmount = ethAmount / parseFloat(project.tokenPrice);
      
      // 模拟代币购买过程
      const mockTxHash = `0x${Math.random().toString(16).substring(2)}`;
      
      // 模拟区块链交易延迟
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setTxHash(mockTxHash);
      alert(`Successfully purchased ${tokenAmount.toFixed(0)} ${project.symbol} tokens!`);
      
    } catch (error) {
      console.error('Purchase failed:', error);
      alert('Purchase failed. Please try again.');
    } finally {
      setIsPurchasing(false);
    }
  };

  const selectedProjectData = tokenProjects.find(p => p.id.toString() === selectedProject);
  const tokenAmount = purchaseAmount ? parseFloat(purchaseAmount) / parseFloat(selectedProjectData?.tokenPrice || '1') : 0;

  return (
    <Layout>
      <div className="px-4 lg:px-12 max-w-screen-2xl mx-auto py-8 md:py-12">
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">
            🪙 Token Sale Hub
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Invest in innovative projects by purchasing governance tokens. Shape the future together.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Wallet Connection */}
          <div className="mb-8 p-4 bg-white dark:bg-[#1a1b1e] rounded-xl border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold mb-3">🦊 Wallet Connection</h3>
            {!isConnected ? (
              <button
                onClick={connectWallet}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Connect Wallet
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span className="font-mono text-sm">{walletAddress}</span>
              </div>
            )}
          </div>

          {/* Available Token Projects */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Active Token Sales</h3>
            <div className="space-y-4">
              {tokenProjects.map((project) => (
                <div
                  key={project.id}
                  className={`p-6 border rounded-xl cursor-pointer transition-all ${
                    selectedProject === project.id.toString()
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedProject(project.id.toString())}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                      {project.symbol}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="text-xl font-semibold">{project.title}</h4>
                          <p className="text-gray-600 dark:text-gray-400 mt-1">
                            {project.description}
                          </p>
                          <p className="text-sm text-gray-500 mt-2">
                            by {project.creator}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-green-600">
                            {project.tokenPrice} ETH
                          </div>
                          <div className="text-sm text-gray-500">per {project.symbol}</div>
                        </div>
                      </div>
                      
                      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Total Supply:</span>
                          <div className="font-semibold">{project.totalSupply.toLocaleString()}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Sold:</span>
                          <div className="font-semibold">{project.sold.toLocaleString()}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Allocation:</span>
                          <div className="font-semibold">{project.allocation}%</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Vesting:</span>
                          <div className="font-semibold">{project.vestingPeriod}</div>
                        </div>
                      </div>

                      <div className="mt-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Sale Progress</span>
                          <span>{((project.sold / (project.totalSupply * project.allocation / 100)) * 100).toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                          <div
                            className="bg-gradient-to-r from-green-400 to-blue-500 h-3 rounded-full"
                            style={{ width: `${(project.sold / (project.totalSupply * project.allocation / 100)) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Purchase Interface */}
          {selectedProjectData && isConnected && (
            <div className="p-6 bg-white dark:bg-[#1a1b1e] rounded-xl border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold mb-4">
                Purchase {selectedProjectData.symbol} Tokens
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">ETH Amount</label>
                  <input
                    type="number"
                    step="0.001"
                    value={purchaseAmount}
                    onChange={(e) => setPurchaseAmount(e.target.value)}
                    placeholder="0.1"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">You'll Receive</label>
                  <div className="px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg font-semibold">
                    {tokenAmount.toFixed(0)} {selectedProjectData.symbol}
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">
                  Token Holder Benefits:
                </h4>
                <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                  <li>• Governance voting rights in project decisions</li>
                  <li>• Revenue sharing from project success</li>
                  <li>• Early access to new features and products</li>
                  <li>• Staking rewards and yield farming opportunities</li>
                  <li>• Tradeable on DEX platforms after vesting</li>
                </ul>
              </div>

              <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                  ⚠️ Vesting Schedule:
                </h4>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  Tokens will be locked for {selectedProjectData.vestingPeriod} and then released gradually to prevent market manipulation.
                </p>
              </div>

              <button
                onClick={purchaseTokens}
                disabled={isPurchasing || !purchaseAmount}
                className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPurchasing ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Purchasing...
                  </div>
                ) : (
                  `Purchase ${selectedProjectData.symbol} Tokens`
                )}
              </button>

              {txHash && (
                <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
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
          )}
        </div>
      </div>
    </Layout>
  );
}
