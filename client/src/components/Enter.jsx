import React, { useState, useEffect } from 'react'
import PriceChart from './PriceChart'

const Enter = ({ onBack, onCreateBattle }) => {
  console.log('Enter component rendered') // Debug log

  const [priceData, setPriceData] = useState({
    ETH: [],
    BTC: []
  })

  useEffect(() => {
    // Simulated price data - replace with actual Supra API call
    const fetchPriceData = async () => {
      try {
        // Example data structure - replace with actual API response
        const mockData = {
          ETH: Array.from({ length: 24 }, (_, i) => ({
            timestamp: Date.now() - i * 3600000,
            price: 2000 + Math.random() * 200
          })).reverse(),
          BTC: Array.from({ length: 24 }, (_, i) => ({
            timestamp: Date.now() - i * 3600000,
            price: 40000 + Math.random() * 2000
          })).reverse()
        }
        setPriceData(mockData)
      } catch (error) {
        console.error('Error fetching price data:', error)
      }
    }

    fetchPriceData()
    const interval = setInterval(fetchPriceData, 60000) // Update every minute
    return () => clearInterval(interval)
  }, [])

  const ongoingBattles = [
    {
      id: 1,
      token1: {
        symbol: "ETH",
        amount: "10.5",
        usdValue: "23,450",
      },
      token2: {
        symbol: "BTC",
        amount: "0.85",
        usdValue: "25,500",
      },
      totalPlayers: 156,
      timeLeft: "23:45:30",
      status: "LIVE"
    },
    {
      id: 2,
      token1: {
        symbol: "SUPRA",
        amount: "50000",
        usdValue: "15,000",
      },
      token2: {
        symbol: "USDT",
        amount: "15000",
        usdValue: "15,000",
      },
      totalPlayers: 89,
      timeLeft: "22:15:45",
      status: "LIVE"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary overflow-hidden">
      {/* Header */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <button 
            onClick={onBack}
            className="text-gray-400 hover:text-primary transition-colors"
          >
            ← Back to Home
          </button>
          <button 
            onClick={onCreateBattle}
            className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/80 transition-all flex items-center gap-2 group"
          >
            <span className="text-xl">+</span>
            Create Battle
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-white mb-12">
          Active <span className="text-primary">Battles</span>
        </h1>

        <div className="grid md:grid-cols-2 gap-8">
          {ongoingBattles.map((battle) => (
            <div 
              key={battle.id}
              className="bg-secondary/50 backdrop-blur-sm rounded-2xl p-8 hover:shadow-[0_0_30px_rgba(255,51,102,0.2)] transition-all hover:scale-[1.02] cursor-pointer"
            >
              {/* Battle Header */}
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-white">
                  {battle.token1.symbol} vs {battle.token2.symbol}
                </h2>
                <div className="flex items-center gap-3">
                  <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-semibold animate-pulse">
                    {battle.status}
                  </span>
                </div>
              </div>

              {/* VS Section */}
              <div className="flex items-center justify-between mb-8">
                <div className="text-center flex-1">
                  <div className="w-20 h-20 bg-background/50 rounded-full flex items-center justify-center mb-3 mx-auto group-hover:animate-float">
                    <span className="text-2xl font-bold text-primary">{battle.token1.symbol}</span>
                  </div>
                  <p className="text-white font-semibold mb-1">{battle.token1.amount} {battle.token1.symbol}</p>
                  <p className="text-gray-400 text-sm">${battle.token1.usdValue}</p>
                  {priceData[battle.token1.symbol] && priceData[battle.token1.symbol].length > 0 && (
                    <div className="mt-2">
                      <PriceChart data={priceData[battle.token1.symbol]} symbol={battle.token1.symbol} />
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-center px-4">
                  <div className="text-primary text-3xl font-bold mb-2">VS</div>
                  <div className="px-4 py-2 bg-background/30 rounded-lg">
                    <p className="text-white text-sm font-medium">{battle.timeLeft}</p>
                    <p className="text-gray-400 text-xs">Time Left</p>
                  </div>
                </div>
                <div className="text-center flex-1">
                  <div className="w-20 h-20 bg-background/50 rounded-full flex items-center justify-center mb-3 mx-auto group-hover:animate-float">
                    <span className="text-2xl font-bold text-primary">{battle.token2.symbol}</span>
                  </div>
                  <p className="text-white font-semibold mb-1">{battle.token2.amount} {battle.token2.symbol}</p>
                  <p className="text-gray-400 text-sm">${battle.token2.usdValue}</p>
                  {priceData[battle.token2.symbol] && priceData[battle.token2.symbol].length > 0 && (
                    <div className="mt-2">
                      <PriceChart data={priceData[battle.token2.symbol]} symbol={battle.token2.symbol} />
                    </div>
                  )}
                </div>
              </div>

              {/* Battle Info */}
              <div className="bg-background/30 rounded-xl p-4 mb-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-gray-400 text-sm mb-1">Total Players</p>
                    <p className="text-white font-bold text-lg">{battle.totalPlayers}</p>
                  </div>
                  <div className="text-center border-l border-gray-700">
                    <p className="text-gray-400 text-sm mb-1">Total Value</p>
                    <p className="text-primary font-bold text-lg">
                      ${(parseFloat(battle.token1.usdValue.replace(',', '')) + 
                         parseFloat(battle.token2.usdValue.replace(',', ''))).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button className="w-full bg-primary/10 text-primary px-6 py-3 rounded-lg hover:bg-primary/20 transition-all flex items-center justify-center gap-2 group">
                Join Battle 🎮
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Enter