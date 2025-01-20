import React, { useState, useEffect } from 'react'
import PriceChart from './PriceChart'
import WalletConnect from './WalletConnect'

const SUPRA_API_KEY = 'YOUR_SUPRA_API_KEY'
const SUPRA_API_ENDPOINT = 'https://api.supraoracles.com/oracle/v1'

const generateRealisticPriceData = (basePrice, volatility, hoursOfData = 24) => {
  const now = Date.now()
  let currentPrice = basePrice
  
  return Array.from({ length: hoursOfData }, (_, i) => {
    // More realistic price movement using small random changes
    const changePercent = (Math.random() - 0.5) * volatility
    currentPrice = currentPrice * (1 + changePercent)
    
    return {
      timestamp: now - (hoursOfData - 1 - i) * 3600000, // Start from 24 hours ago
      price: currentPrice
    }
  })
}

const Enter = ({ onBack, onCreateBattle }) => {
  console.log('Enter component rendered') // Debug log

  const [priceData, setPriceData] = useState({
    ETH: [],
    BTC: [],
    SUPRA: [],
    USDT: []
  })

  useEffect(() => {
    const fetchPriceData = async () => {
      try {
        // Fetch price data for all token pairs
        const response = await fetch(`${SUPRA_API_ENDPOINT}/prices`, {
          headers: {
            'Authorization': `Bearer ${SUPRA_API_KEY}`,
            'Content-Type': 'application/json'
          }
        })

        if (!response.ok) {
          throw new Error('Failed to fetch price data')
        }

        const data = await response.json()
        
        // Transform the API response to match our format for all tokens
        const formattedData = {
          ETH: data.prices
            .filter(p => p.pair === 'ETH/USD')
            .map(p => ({
              timestamp: p.timestamp,
              price: parseFloat(p.price)
            })),
          BTC: data.prices
            .filter(p => p.pair === 'BTC/USD')
            .map(p => ({
              timestamp: p.timestamp,
              price: parseFloat(p.price)
            })),
          SUPRA: data.prices
            .filter(p => p.pair === 'SUPRA/USD')
            .map(p => ({
              timestamp: p.timestamp,
              price: parseFloat(p.price)
            })),
          USDT: data.prices
            .filter(p => p.pair === 'USDT/USD')
            .map(p => ({
              timestamp: p.timestamp,
              price: parseFloat(p.price)
            }))
        }

        setPriceData(formattedData)
      } catch (error) {
        console.error('Error fetching price data:', error)
        // Updated mock data with more realistic price movements
        const mockData = {
          ETH: generateRealisticPriceData(2250, 0.002), // ETH base price $2250, 0.2% volatility
          BTC: generateRealisticPriceData(42000, 0.001), // BTC base price $42000, 0.1% volatility
          SUPRA: generateRealisticPriceData(0.15, 0.004), // SUPRA base price $0.15, 0.4% volatility
          USDT: generateRealisticPriceData(1, 0.0001)  // USDT base price $1, 0.01% volatility
        }
        setPriceData(mockData)
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

  const handleJoinBattle = () => {
    if (typeof window.starkey === 'undefined') {
      window.open('https://chromewebstore.google.com/detail/starkey-wallet/iljfbbgfaklhbgcbmghmhmnpdfddnhie', '_blank')
      return
    }
    // Handle join battle logic
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary overflow-hidden">
      {/* Header */}
      <div className="container mx-auto px-4 pt-20">
        <div className="flex items-center relative">
          <button 
            onClick={onBack}
            className="text-gray-400 hover:text-primary transition-colors flex items-center gap-2"
          >
            <span>←</span>
            Back to Home
          </button>
          {/* Centered Create Battle button */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
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
              <button 
                onClick={handleJoinBattle}
                className="w-full bg-primary/10 text-primary px-6 py-3 rounded-lg hover:bg-primary/20 transition-all flex items-center justify-center gap-2 group"
              >
                {typeof window.starkey === 'undefined' ? 'Install Starkey' : 'Join Battle 🎮'}
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