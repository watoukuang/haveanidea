import React from 'react';
import Layout from '../components/Layout';

export default function NFTMint(): React.ReactElement {
  const [selectedIdea, setSelectedIdea] = React.useState('');
  const [mintAmount, setMintAmount] = React.useState(1);
  const [isConnected, setIsConnected] = React.useState(false);
  const [walletAddress, setWalletAddress] = React.useState('');
  const [isMinting, setIsMinting] = React.useState(false);
  const [txHash, setTxHash] = React.useState('');

  // 模拟的NFT众筹项目数据
  const nftProjects = [
    {
      id: 1,
      title: "AI Art Generator",
      creator: "0x1234...5678",
      nftPrice: "0.004",
      totalSupply: 2500,
      minted: 150,
      royalty: 10,
      iconHash: "QmX1234...",
      contractAddress: "0xabcd...1234"
    },
    {
      id: 2,
      title: "DeFi Yield Optimizer",
      creator: "0x5678...9012",
      nftPrice: "0.01",
      totalSupply: 1000,
      minted: 45,
      royalty: 15,
      iconHash: "QmY5678...",
      contractAddress: "0xefgh...5678"
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

  const mintNFT = async () => {
    if (!selectedIdea) return;
    
    const project = nftProjects.find(p => p.id.toString() === selectedIdea);
    if (!project) return;

    setIsMinting(true);
    
    try {
      // 模拟NFT铸造过程
      const totalCost = parseFloat(project.nftPrice) * mintAmount;
      
      // 实际实现中，这里会调用智能合约
      const mockTxHash = `0x${Math.random().toString(16).substring(2)}`;
      
      // 模拟区块链交易延迟
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setTxHash(mockTxHash);
      alert(`Successfully minted ${mintAmount} NFT(s) for ${totalCost} ETH!`);
      
    } catch (error) {
      console.error('Minting failed:', error);
      alert('Minting failed. Please try again.');
    } finally {
      setIsMinting(false);
    }
  };

  const selectedProject = nftProjects.find(p => p.id.toString() === selectedIdea);

  return (
    <Layout>
      <div className="px-4 lg:px-12 max-w-screen-2xl mx-auto py-8 md:py-12">
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">
            💎 NFT Minting Hub
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Support innovative ideas by minting NFTs. Get royalties and governance rights.
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

          {/* Available NFT Projects */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Available NFT Projects</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {nftProjects.map((project) => (
                <div
                  key={project.id}
                  className={`p-4 border rounded-xl cursor-pointer transition-all ${
                    selectedIdea === project.id.toString()
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedIdea(project.id.toString())}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg flex items-center justify-center text-white font-bold">
                      {project.title.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">{project.title}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        by {project.creator}
                      </p>
                      <div className="mt-2 space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span>Price:</span>
                          <span className="font-semibold">{project.nftPrice} ETH</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Minted:</span>
                          <span>{project.minted}/{project.totalSupply}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Royalty:</span>
                          <span>{project.royalty}%</span>
                        </div>
                      </div>
                      <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${(project.minted / project.totalSupply) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Minting Interface */}
          {selectedProject && isConnected && (
            <div className="p-6 bg-white dark:bg-[#1a1b1e] rounded-xl border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold mb-4">Mint NFT: {selectedProject.title}</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Amount to Mint</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={mintAmount}
                    onChange={(e) => setMintAmount(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Total Cost</label>
                  <div className="px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg font-semibold">
                    {(parseFloat(selectedProject.nftPrice) * mintAmount).toFixed(4)} ETH
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                  What you'll get:
                </h4>
                <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                  <li>• {mintAmount} unique NFT(s) with proof of support</li>
                  <li>• {selectedProject.royalty}% of future project revenue</li>
                  <li>• Governance voting rights</li>
                  <li>• Tradeable on NFT marketplaces</li>
                </ul>
              </div>

              <button
                onClick={mintNFT}
                disabled={isMinting}
                className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isMinting ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Minting...
                  </div>
                ) : (
                  `Mint ${mintAmount} NFT${mintAmount > 1 ? 's' : ''}`
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
