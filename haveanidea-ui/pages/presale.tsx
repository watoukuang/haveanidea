import React from 'react';
import Layout from '../components/Layout';

interface PresaleProject {
  id: number;
  title: string;
  description: string;
  creator: string;
  productType: string;
  originalPrice: string;
  presalePrice: string;
  discount: number;
  totalSlots: number;
  soldSlots: number;
  deliveryDate: string;
  features: string[];
  contractAddress: string;
}

export default function Presale(): React.ReactElement {
  const [selectedProject, setSelectedProject] = React.useState('');
  const [quantity, setQuantity] = React.useState(1);
  const [isConnected, setIsConnected] = React.useState(false);
  const [walletAddress, setWalletAddress] = React.useState('');
  const [isPurchasing, setIsPurchasing] = React.useState(false);
  const [txHash, setTxHash] = React.useState('');

  // 模拟的预售项目数据
  const presaleProjects: PresaleProject[] = [
    {
      id: 1,
      title: "AI Code Assistant Pro",
      description: "Advanced AI-powered development tool with multi-language support and intelligent code completion",
      creator: "0x1234...5678",
      productType: "Software License",
      originalPrice: "0.2",
      presalePrice: "0.12",
      discount: 40,
      totalSlots: 1000,
      soldSlots: 234,
      deliveryDate: "2024-03-15",
      features: [
        "Lifetime license included",
        "Priority customer support",
        "Early access to new features",
        "Custom AI model training",
        "API access for integration"
      ],
      contractAddress: "0xcode...1234"
    },
    {
      id: 2,
      title: "DeFi Portfolio Tracker",
      description: "Professional-grade portfolio management tool for DeFi investments with real-time analytics",
      creator: "0x5678...9012",
      productType: "SaaS Subscription",
      originalPrice: "0.1",
      presalePrice: "0.07",
      discount: 30,
      totalSlots: 500,
      soldSlots: 89,
      deliveryDate: "2024-02-28",
      features: [
        "12 months premium subscription",
        "Advanced analytics dashboard",
        "Portfolio optimization AI",
        "Risk assessment tools",
        "Multi-chain support"
      ],
      contractAddress: "0xdefi...5678"
    },
    {
      id: 3,
      title: "NFT Creator Studio",
      description: "Complete NFT creation and minting platform with advanced design tools and marketplace integration",
      creator: "0x9012...3456",
      productType: "Platform Access",
      originalPrice: "0.15",
      presalePrice: "0.105",
      discount: 30,
      totalSlots: 750,
      soldSlots: 156,
      deliveryDate: "2024-04-01",
      features: [
        "Unlimited NFT creation",
        "Advanced design templates",
        "Automated metadata generation",
        "Multi-marketplace listing",
        "Royalty management system"
      ],
      contractAddress: "0xnft...9012"
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

  const purchasePresale = async () => {
    if (!selectedProject) return;
    
    const project = presaleProjects.find(p => p.id.toString() === selectedProject);
    if (!project) return;

    setIsPurchasing(true);
    
    try {
      const totalCost = parseFloat(project.presalePrice) * quantity;
      
      // 模拟预售购买过程
      const mockTxHash = `0x${Math.random().toString(16).substring(2)}`;
      
      // 模拟区块链交易延迟
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setTxHash(mockTxHash);
      alert(`Successfully purchased ${quantity} ${project.productType}(s) for ${totalCost.toFixed(3)} ETH!`);
      
    } catch (error) {
      console.error('Purchase failed:', error);
      alert('Purchase failed. Please try again.');
    } finally {
      setIsPurchasing(false);
    }
  };

  const selectedProjectData = presaleProjects.find(p => p.id.toString() === selectedProject);
  const totalCost = selectedProjectData ? parseFloat(selectedProjectData.presalePrice) * quantity : 0;
  const totalSavings = selectedProjectData ? (parseFloat(selectedProjectData.originalPrice) - parseFloat(selectedProjectData.presalePrice)) * quantity : 0;

  return (
    <Layout>
      <div className="px-4 lg:px-12 max-w-screen-2xl mx-auto py-8 md:py-12">
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">
            🎯 Presale Hub
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Get early access to innovative products at discounted prices. Support creators and save money.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
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

          {/* Available Presale Projects */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Active Presales</h3>
            <div className="grid lg:grid-cols-2 gap-6">
              {presaleProjects.map((project) => (
                <div
                  key={project.id}
                  className={`p-6 border rounded-xl cursor-pointer transition-all ${
                    selectedProject === project.id.toString()
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedProject(project.id.toString())}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h4 className="text-xl font-semibold mb-2">{project.title}</h4>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                        {project.description}
                      </p>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/20 text-purple-600 text-xs rounded-full">
                          {project.productType}
                        </span>
                        <span className="px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-600 text-xs rounded-full">
                          {project.discount}% OFF
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">
                        by {project.creator} • Delivery: {project.deliveryDate}
                      </p>
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-lg font-bold text-green-600">
                        {project.presalePrice} ETH
                      </div>
                      <div className="text-sm text-gray-500 line-through">
                        {project.originalPrice} ETH
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span>Presale Progress</span>
                      <span>{project.soldSlots}/{project.totalSlots} sold</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-orange-400 to-red-500 h-2 rounded-full"
                        style={{ width: `${(project.soldSlots / project.totalSlots) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h5 className="font-semibold text-sm">What's Included:</h5>
                    {project.features.slice(0, 3).map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                        <span className="text-green-500">✓</span>
                        {feature}
                      </div>
                    ))}
                    {project.features.length > 3 && (
                      <div className="text-xs text-gray-500">
                        +{project.features.length - 3} more features...
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Purchase Interface */}
          {selectedProjectData && isConnected && (
            <div className="p-6 bg-white dark:bg-[#1a1b1e] rounded-xl border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold mb-4">
                Purchase: {selectedProjectData.title}
              </h3>
              
              <div className="grid lg:grid-cols-2 gap-8">
                <div>
                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-2">Quantity</label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={quantity}
                      onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
                    />
                  </div>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span>Unit Price:</span>
                      <span className="font-semibold">{selectedProjectData.presalePrice} ETH</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Cost:</span>
                      <span className="font-semibold">{totalCost.toFixed(3)} ETH</span>
                    </div>
                    <div className="flex justify-between text-green-600">
                      <span>You Save:</span>
                      <span className="font-semibold">{totalSavings.toFixed(3)} ETH</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Complete Feature List:</h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {selectedProjectData.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-2 text-sm">
                        <span className="text-green-500 mt-0.5">✓</span>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <h4 className="font-semibold text-orange-800 dark:text-orange-200 mb-2">
                  🎁 Presale Benefits:
                </h4>
                <ul className="text-sm text-orange-700 dark:text-orange-300 space-y-1">
                  <li>• {selectedProjectData.discount}% discount from regular price</li>
                  <li>• Priority access and early delivery</li>
                  <li>• Exclusive presale holder benefits</li>
                  <li>• Direct communication with creators</li>
                  <li>• Lifetime updates and support</li>
                </ul>
              </div>

              <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                  📅 Delivery Information:
                </h4>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Expected delivery date: <strong>{selectedProjectData.deliveryDate}</strong>
                  <br />
                  You'll receive access credentials and download links via your connected wallet address.
                </p>
              </div>

              <button
                onClick={purchasePresale}
                disabled={isPurchasing}
                className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPurchasing ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing Purchase...
                  </div>
                ) : (
                  `Purchase ${quantity} ${selectedProjectData.productType}${quantity > 1 ? 's' : ''} for ${totalCost.toFixed(3)} ETH`
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
