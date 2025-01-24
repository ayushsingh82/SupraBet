import React, { useState, useEffect } from 'react'
import PriceChart from './PriceChart'
import WalletConnect from './WalletConnect'
import BetPopup from './BetPopup'
import useCountdown from '../hooks/useCountdown'

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

const Enter = ({ onBack, onCreateBattle, onTransfer }) => {
  console.log('Enter component rendered') // Debug log

  const [priceData, setPriceData] = useState({
    ETH: [],
    BTC: [],
    SUPRA: [],
    USDT: [],
    NEAR: [],
    APT: []
  })

  const [selectedBattle, setSelectedBattle] = useState(null)
  const [showBetPopup, setShowBetPopup] = useState(false)

  useEffect(() => {
    const fetchSupraPrices = async () => {
      try {
        const response = await fetch('https://api.supraoracles.com/oracle/v1/prices', {
          headers: {
            'Accept': 'application/json'
          }
        })
        
        if (!response.ok) throw new Error('Failed to fetch prices')
        
        const data = await response.json()
        
        // Process data for charts
        const processedData = {
          ETH: data.prices
            .filter(p => p.symbol === 'ETH/USD')
            .map(p => ({
              timestamp: p.timestamp,
              price: p.price
            })),
          BTC: data.prices
            .filter(p => p.symbol === 'BTC/USD')
            .map(p => ({
              timestamp: p.timestamp,
              price: p.price
            })),
          NEAR: data.prices
            .filter(p => p.symbol === 'NEAR/USD')
            .map(p => ({
              timestamp: p.timestamp,
              price: p.price
            })),
          APT: data.prices
            .filter(p => p.symbol === 'APT/USD')
            .map(p => ({
              timestamp: p.timestamp,
              price: p.price
            }))
        }
        
        setPriceData(processedData)
      } catch (error) {
        console.error('Error fetching Supra prices:', error)
        // Fallback to mock data with updated base prices
        setPriceData({
          BTC: generateRealisticPriceData(97300, 0.001),
          ETH: generateRealisticPriceData(3289, 0.002),
          NEAR: generateRealisticPriceData(5.02, 0.003),
          APT: generateRealisticPriceData(9.25, 0.003)
        })
      }
    }

    fetchSupraPrices()
    const interval = setInterval(fetchSupraPrices, 30000)
    
    return () => clearInterval(interval)
  }, [])

  const activeBattle = {
    id: 1,
    token1: {
      symbol: "BTC",
      price: "$97,300",
      change: "+2.1%",
      trend: "↗"
    },
    token2: {
      symbol: "ETH",
      price: "$3,289",
      change: "-0.8%",
      trend: "↘"
    },
    timeLeft: "23:58:52",
    status: "LIVE",
    totalPlayers: 0
  }

  // Add NEAR/APT battle
  const battles = [
    activeBattle,
    {
      id: 2,
      token1: {
        symbol: "NEAR",
        price: "$5.02",
        change: "+1.2%",
        trend: "↗"
      },
      token2: {
        symbol: "APT",
        price: "$9.25",
        change: "-0.8%",
        trend: "↘"
      },
      timeLeft: "23:44:11",
      status: "LIVE",
      totalPlayers: 4
    }
  ]

  // Update timers to include both battles
  const timers = {
    [battles[0].id]: useCountdown(battles[0].timeLeft),
    [battles[1].id]: useCountdown(battles[1].timeLeft)
  }

  const handleJoinBattle = (battle) => {
    if (typeof window.ethereum === 'undefined') {
      window.open('https://chromewebstore.google.com/detail/starkey-wallet/iljfbbgfaklhbgcbmghmhmnpdfddnhie', '_blank')
      return
    }
    setSelectedBattle(battle)
    setShowBetPopup(true)
  }

  const handleBetConfirm = async (token, amount) => {
    try {
      console.log('Placing bet:', { token, amount, battleId: selectedBattle.id })
      // Add your bet placement logic here
      
      setShowBetPopup(false)
      setSelectedBattle(null)
    } catch (error) {
      console.error('Error placing bet:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary overflow-hidden">
      {/* Header section */}
      <div className="container mx-auto px-4 py-8"> {/* Reduced padding */}
        <div className="flex items-center justify-between mb-8"> {/* Reduced margin */}
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="text-gray-400 hover:text-white transition-colors"
            >
              ← Back
            </button>
            <h2 className="text-2xl font-bold text-white">Battle Arena</h2> {/* Smaller text */}
          </div>
          <div className="flex gap-4">
            <button
              onClick={onTransfer}
              className="bg-primary/10 text-primary px-4 py-2 rounded-lg hover:bg-primary/20 transition-all flex items-center gap-2 text-sm"
            >
              <span>Transfer</span>
              <span>↗</span>
            </button>
            <button
              onClick={onCreateBattle}
              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/80 transition-all flex items-center gap-2 text-sm"
            >
              <span>Create Battle</span>
              <span>+</span>
            </button>
          </div>
        </div>

        <div className="container mx-auto px-4 max-w-6xl">
          <h1 className="text-4xl font-bold text-white mb-8 text-center">
            Active <span className="text-primary">Battles</span>
          </h1>

          {/* Battle Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {battles.map(battle => (
              <div 
                key={battle.id}
                className="bg-secondary/50 backdrop-blur-sm rounded-xl p-4 hover:shadow-[0_0_30px_rgba(255,51,102,0.2)] transition-all relative overflow-hidden"
              >
                {/* Animated Background */}
                <div className="absolute inset-0">
                  <div className="absolute top-0 left-1/4 w-32 h-32 bg-primary/5 rounded-full filter blur-3xl animate-pulse-slow"></div>
                  <div className="absolute bottom-0 right-1/4 w-32 h-32 bg-secondary/10 rounded-full filter blur-3xl animate-pulse-slow" style={{animationDelay: '1s'}}></div>
                </div>

                {/* Content */}
                <div className="relative">
                  {/* Battle Header */}
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-bold text-white">Current Round</h3>
                    <div className="flex items-center gap-2">
                      <span className="animate-ping absolute h-2 w-2 rounded-full bg-primary opacity-75"></span>
                      <span className="relative rounded-full h-2 w-2 bg-primary"></span>
                      <span className="bg-primary/20 text-primary px-2 py-0.5 rounded-full text-xs font-semibold">
                        LIVE
                      </span>
                    </div>
                  </div>

                  {/* Timer */}
                  <div className="text-center mb-4">
                    <div className="inline-block bg-background/30 backdrop-blur-sm px-4 py-2 rounded-lg">
                      <p className="text-xs text-gray-400">Time Remaining</p>
                      <div className="flex items-center justify-center gap-1">
                        <div className="bg-background/40 px-2 py-1 rounded">
                          <span className="text-xl font-bold text-primary">{timers[battle.id].split(':')[0]}</span>
                          <span className="text-xs text-gray-400">h</span>
                        </div>
                        <span className="text-primary">:</span>
                        <div className="bg-background/40 px-2 py-1 rounded">
                          <span className="text-xl font-bold text-primary">{timers[battle.id].split(':')[1]}</span>
                          <span className="text-xs text-gray-400">m</span>
                        </div>
                        <span className="text-primary">:</span>
                        <div className="bg-background/40 px-2 py-1 rounded">
                          <span className="text-xl font-bold text-primary">{timers[battle.id].split(':')[2]}</span>
                          <span className="text-xs text-gray-400">s</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Token Comparison */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    {[battle.token1, battle.token2].map((token, i) => (
                      <div 
                        key={i}
                        className={`text-center ${i === 0 ? 'border-r border-gray-700' : ''}`}
                      >
                        <div className="w-12 h-12 bg-background/30 backdrop-blur-sm rounded-full flex items-center justify-center mb-2 mx-auto">
                          <span className="text-base font-bold text-primary">{token.symbol}</span>
                        </div>
                        <p className="text-base font-bold text-white mb-1">{token.price}</p>
                        <p className={`text-xs font-medium flex items-center justify-center gap-1 mb-2 ${
                          token.change.startsWith('+') ? 'text-green-500' : 'text-red-500'
                        }`}>
                          <span>{token.trend}</span>
                          <span>{token.change}</span>
                        </p>
                        
                        {/* Price Chart */}
                        <div className="mt-1">
                          <PriceChart 
                            data={priceData[token.symbol]} 
                            height={80}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Players Count */}
                  <div className="text-center mb-4">
                    <div className="inline-flex items-center gap-1 bg-background/30 backdrop-blur-sm px-3 py-1 rounded-lg text-xs">
                      <span className="text-gray-400">Players:</span>
                      <span className="font-bold text-white">{battle.totalPlayers}</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => handleJoinBattle(battle)}
                    className="w-full bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-all flex items-center justify-center gap-2 group font-bold text-sm"
                  >
                    Join Battle
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bet Popup */}
      <BetPopup
        isOpen={showBetPopup}
        onClose={() => {
          setShowBetPopup(false)
          setSelectedBattle(null)
        }}
        battle={selectedBattle}
        onConfirm={handleBetConfirm}
      />
    </div>
  )
}

export default Enter