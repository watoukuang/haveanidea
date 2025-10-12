import React from 'react';
import Layout from '../components/Layout';

interface Proposal {
  id: number;
  title: string;
  description: string;
  proposer: string;
  status: 'active' | 'passed' | 'rejected' | 'pending';
  votesFor: number;
  votesAgainst: number;
  totalVotes: number;
  endTime: string;
  category: string;
}

export default function DAOGovernance(): React.ReactElement {
  const [isConnected, setIsConnected] = React.useState(false);
  const [walletAddress, setWalletAddress] = React.useState('');
  const [selectedDAO, setSelectedDAO] = React.useState('');
  const [userVotingPower, setUserVotingPower] = React.useState(0);
  const [isVoting, setIsVoting] = React.useState(false);

  // 模拟的DAO项目数据
  const daoProjects = [
    {
      id: 1,
      name: "EcoTech DAO",
      symbol: "ECO",
      description: "Sustainable technology development collective",
      totalMembers: 1250,
      totalVotingPower: 500000,
      treasury: "125.5",
      governanceToken: "ECO"
    },
    {
      id: 2,
      name: "CreatorSpace DAO",
      symbol: "CREATE",
      description: "Digital content creators collaboration platform",
      totalMembers: 890,
      totalVotingPower: 350000,
      treasury: "89.2",
      governanceToken: "CREATE"
    }
  ];

  // 模拟的提案数据
  const proposals: Proposal[] = [
    {
      id: 1,
      title: "Allocate 50 ETH for Green Energy Research",
      description: "Proposal to fund renewable energy research project focusing on solar panel efficiency improvements. This initiative aims to develop next-generation photovoltaic technology.",
      proposer: "0x1234...5678",
      status: "active",
      votesFor: 125000,
      votesAgainst: 45000,
      totalVotes: 170000,
      endTime: "2024-01-15",
      category: "Funding"
    },
    {
      id: 2,
      title: "Update Governance Parameters",
      description: "Modify voting period from 7 days to 5 days and reduce proposal threshold to 1000 tokens to increase participation efficiency.",
      proposer: "0x5678...9012",
      status: "active",
      votesFor: 89000,
      votesAgainst: 67000,
      totalVotes: 156000,
      endTime: "2024-01-12",
      category: "Governance"
    },
    {
      id: 3,
      title: "Partnership with Climate Foundation",
      description: "Establish strategic partnership with Global Climate Foundation for carbon offset verification and environmental impact tracking.",
      proposer: "0x9012...3456",
      status: "passed",
      votesFor: 198000,
      votesAgainst: 32000,
      totalVotes: 230000,
      endTime: "2024-01-08",
      category: "Partnership"
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
          // 模拟用户投票权重
          setUserVotingPower(Math.floor(Math.random() * 5000) + 1000);
        }
      } else {
        alert('Please install MetaMask');
      }
    } catch (err) {
      console.error('Wallet connection failed:', err);
    }
  };

  const vote = async (proposalId: number, support: boolean) => {
    setIsVoting(true);
    try {
      // 模拟投票过程
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert(`Vote ${support ? 'FOR' : 'AGAINST'} proposal ${proposalId} submitted successfully!`);
    } catch (error) {
      alert('Voting failed. Please try again.');
    } finally {
      setIsVoting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20';
      case 'passed': return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      case 'rejected': return 'text-red-600 bg-red-100 dark:bg-red-900/20';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Funding': return 'text-purple-600 bg-purple-100 dark:bg-purple-900/20';
      case 'Governance': return 'text-orange-600 bg-orange-100 dark:bg-orange-900/20';
      case 'Partnership': return 'text-teal-600 bg-teal-100 dark:bg-teal-900/20';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  const selectedDAOData = daoProjects.find(d => d.id.toString() === selectedDAO);

  return (
    <Layout>
      <div className="px-4 lg:px-12 max-w-screen-2xl mx-auto py-8 md:py-12">
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">
            🏛️ DAO Governance Hub
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Participate in decentralized governance. Vote on proposals and shape the future of innovative projects.
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
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span className="font-mono text-sm">{walletAddress}</span>
                </div>
                <div className="text-sm">
                  <span className="text-gray-500">Voting Power: </span>
                  <span className="font-semibold">{userVotingPower.toLocaleString()}</span>
                </div>
              </div>
            )}
          </div>

          {/* DAO Selection */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Select DAO</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {daoProjects.map((dao) => (
                <div
                  key={dao.id}
                  className={`p-4 border rounded-xl cursor-pointer transition-all ${
                    selectedDAO === dao.id.toString()
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedDAO(dao.id.toString())}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                      {dao.symbol}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">{dao.name}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {dao.description}
                      </p>
                      <div className="mt-3 grid grid-cols-2 gap-4 text-xs">
                        <div>
                          <span className="text-gray-500">Members:</span>
                          <div className="font-semibold">{dao.totalMembers}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Treasury:</span>
                          <div className="font-semibold">{dao.treasury} ETH</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Proposals */}
          {selectedDAOData && isConnected && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">
                  Active Proposals - {selectedDAOData.name}
                </h3>
                <button className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600">
                  Create Proposal
                </button>
              </div>

              <div className="space-y-4">
                {proposals.map((proposal) => (
                  <div
                    key={proposal.id}
                    className="p-6 bg-white dark:bg-[#1a1b1e] rounded-xl border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(proposal.status)}`}>
                            {proposal.status.toUpperCase()}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(proposal.category)}`}>
                            {proposal.category}
                          </span>
                        </div>
                        <h4 className="text-lg font-semibold mb-2">{proposal.title}</h4>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                          {proposal.description}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>Proposed by {proposal.proposer}</span>
                          <span>Ends: {proposal.endTime}</span>
                        </div>
                      </div>
                    </div>

                    {/* Voting Results */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span>Voting Progress</span>
                        <span>{proposal.totalVotes.toLocaleString()} votes</span>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-green-600 text-sm w-12">For</span>
                          <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-green-500 h-2 rounded-full"
                              style={{ width: `${(proposal.votesFor / proposal.totalVotes) * 100}%` }}
                            />
                          </div>
                          <span className="text-sm w-20 text-right">{proposal.votesFor.toLocaleString()}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <span className="text-red-600 text-sm w-12">Against</span>
                          <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-red-500 h-2 rounded-full"
                              style={{ width: `${(proposal.votesAgainst / proposal.totalVotes) * 100}%` }}
                            />
                          </div>
                          <span className="text-sm w-20 text-right">{proposal.votesAgainst.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Voting Buttons */}
                    {proposal.status === 'active' && (
                      <div className="flex gap-3">
                        <button
                          onClick={() => vote(proposal.id, true)}
                          disabled={isVoting}
                          className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
                        >
                          {isVoting ? 'Voting...' : 'Vote FOR'}
                        </button>
                        <button
                          onClick={() => vote(proposal.id, false)}
                          disabled={isVoting}
                          className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50"
                        >
                          {isVoting ? 'Voting...' : 'Vote AGAINST'}
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
