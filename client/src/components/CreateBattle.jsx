import React, { useState } from 'react'
import { getProvider } from '../utils/wallet'

const CONTRACT_ADDRESS = '0xb8a37ea0164f53c244b08d41614ef7fa66b4d3abdc31ff2c1cde5b68aae8456'

const CreateBattle = ({ onBack, onBattleCreated }) => {
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState(null)
  const [showSuccess, setShowSuccess] = useState(false)
  const [customTokens, setCustomTokens] = useState({
    token1: '',
    token2: ''
  })
  const [isConfirming, setIsConfirming] = useState(false)

  const presetPairs = [
    { pair: 'NEAR/APT', token1: 'NEAR', token2: 'APT' },
    { pair: 'BTC/ETH', token1: 'BTC', token2: 'ETH' },
    { pair: 'SOL/AVAX', token1: 'SOL', token2: 'AVAX' }
  ]

  const handleCustomTokenChange = (e) => {
    const { name, value } = e.target
    setCustomTokens(prev => ({
      ...prev,
      [name]: value.toUpperCase()
    }))
  }

  const handleCreateBattle = async (tokens) => {
    if (!tokens.token1 || !tokens.token2) {
      setError('Please select or enter both tokens')
      return
    }

    setError(null)
    setIsCreating(true)
    setIsConfirming(true)

    try {
      const provider = getProvider()
      if (!provider) {
        throw new Error('Please install Starkey wallet')
      }

      const accounts = await provider.account()
      if (!accounts || !accounts[0]) {
        throw new Error('Please connect your wallet')
      }

      const functionPath = `${CONTRACT_ADDRESS}::betting_campaign::create_campaign`
      
      const payload = {
        type: 'entry_function_payload',
        function: functionPath,
        type_arguments: [],
        arguments: [tokens.token1, tokens.token2],
        module_address: CONTRACT_ADDRESS
      }

      await provider.sendTransaction({
        from: accounts[0],
        to: CONTRACT_ADDRESS,
        data: payload,
        chainId: '0x1BC'
      })

      // Show small confirmation toast for 2 seconds
      await new Promise(resolve => setTimeout(resolve, 2000))
      setIsConfirming(false)
      
      // Show centered success popup
      setShowSuccess(true)

      // Redirect after 2 seconds
      setTimeout(() => {
        setShowSuccess(false)
        onBattleCreated({
          id: Date.now(),
          token1: {
            symbol: tokens.token1,
            price: "$0",
            change: "+0%",
            trend: "↗"
          },
          token2: {
            symbol: tokens.token2,
            price: "$0",
            change: "0%",
            trend: "→"
          },
          timeLeft: "23:59:59",
          status: "LIVE",
          totalPlayers: 0
        })
      }, 2000)

    } catch (error) {
      console.error('Battle creation error:', error)
      setError(error.message || 'Failed to create battle')
      setIsCreating(false)
      setIsConfirming(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-white">Create Battle</h2>
            <button onClick={onBack} className="text-gray-400 hover:text-white transition-colors">
              ← Back
            </button>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <div className="bg-secondary/50 rounded-2xl p-8">
            {/* Custom Token Input */}
            <div className="mb-8">
              <h3 className="text-white font-semibold mb-4">Custom Token Pair</h3>
              <div className="flex items-center gap-4">
                <input
                  type="text"
                  name="token1"
                  value={customTokens.token1}
                  onChange={handleCustomTokenChange}
                  placeholder="First Token (e.g. BTC)"
                  className="flex-1 bg-background/30 text-white p-4 rounded-xl border border-gray-700 focus:border-primary outline-none"
                />
                <span className="text-primary font-bold">VS</span>
                <input
                  type="text"
                  name="token2"
                  value={customTokens.token2}
                  onChange={handleCustomTokenChange}
                  placeholder="Second Token (e.g. ETH)"
                  className="flex-1 bg-background/30 text-white p-4 rounded-xl border border-gray-700 focus:border-primary outline-none"
                />
              </div>
              <button
                onClick={() => handleCreateBattle(customTokens)}
                disabled={isCreating || !customTokens.token1 || !customTokens.token2}
                className="w-full mt-4 bg-primary/10 text-primary px-6 py-4 rounded-lg hover:bg-primary/20 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Custom Battle
              </button>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-4 mb-8">
              <div className="flex-1 h-px bg-gray-700"></div>
              <span className="text-gray-400">or choose preset pair</span>
              <div className="flex-1 h-px bg-gray-700"></div>
            </div>

            {/* Preset Pairs */}
            <div className="grid gap-4">
              {presetPairs.map((pair, index) => (
                <div
                  key={index}
                  className="w-full p-4 bg-background/30 rounded-xl group"
                >
                  <div className="flex items-center justify-center mb-3">
                    <div className="flex items-center gap-8">
                      <span className="text-xl font-bold text-primary">{pair.token1}</span>
                      <span className="text-gray-400">vs</span>
                      <span className="text-xl font-bold text-primary">{pair.token2}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleCreateBattle(pair)}
                    disabled={isCreating}
                    className="w-full bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/80 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Create Battle
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom-right corner notification */}
      <div className="fixed bottom-4 right-4">
        {isConfirming && (
          <div className="bg-secondary/90 backdrop-blur-sm p-4 rounded-xl shadow-lg animate-slide-up flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            <div>
              <p className="text-white text-sm font-medium">Confirm in Wallet</p>
              <p className="text-gray-400 text-xs">Creating battle...</p>
            </div>
          </div>
        )}
      </div>

      {/* Centered Success Popup */}
      {showSuccess && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-secondary/50 p-8 rounded-2xl text-center animate-slide-up">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">✓</span>
            </div>
            <p className="text-white text-xl font-bold">Battle Created!</p>
            <p className="text-gray-400 mt-2">Your battle has been created successfully</p>
            <p className="text-primary text-sm mt-4">Redirecting to battles page...</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default CreateBattle 