import React, { useState, useEffect } from 'react'
import { getProvider } from '../utils/wallet'

const SUPRA_CHAIN_ID = '0x1BC' // 444 in hex
const CONTRACT_ADDRESS = '0xb8a37ea0164f53c244b08d41614ef7fa66b4d3abdc31ff2c1cde5b68aae8456'

// Update the network configuration with correct testnet details
const SUPRA_NETWORK = {
  chainId: SUPRA_CHAIN_ID,
  chainName: 'Supra Testnet',
  nativeCurrency: {
    name: 'SUPRA',
    symbol: 'SUPRA',
    decimals: 18
  },
  rpcUrls: ['https://rpc-testnet.supraoracles.com/rpc/v1'],
  blockExplorerUrls: ['https://explorer.supraoracles.com/testnet']
}

const CreateBattle = ({ onBack }) => {
  const [formData, setFormData] = useState({
    token1: '',
    token2: '',
    endTime: '',
  })
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState(null)
  const [provider, setProvider] = useState(null)

  useEffect(() => {
    const checkProvider = async () => {
      try {
        const p = getProvider()
        setProvider(p)
        if (!p) {
          setError('Please install Starkey wallet')
        } else {
          // Check if connected
          const accounts = await p.account()
          if (!accounts || !accounts.length) {
            setError('Please connect your wallet')
          }
        }
      } catch (err) {
        console.error('Provider check error:', err)
        setError('Error checking wallet connection')
      }
    }
    
    checkProvider()
  }, [])

  const popularTokens = [
    { symbol: 'ETH', name: 'Ethereum' },
    { symbol: 'BTC', name: 'Bitcoin' },
    { symbol: 'SUPRA', name: 'Supra' },
    { symbol: 'USDT', name: 'Tether' },
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setIsCreating(true)

    try {
      if (!provider) {
        throw new Error('Please install Starkey wallet')
      }

      // Get current account
      const accounts = await provider.account()
      if (!accounts || !accounts[0]) {
        throw new Error('Please connect your wallet')
      }

      // Calculate end time in seconds from now
      const endTimeInSeconds = Math.floor(Date.now() / 1000) + (parseInt(formData.endTime) * 3600)

      // Create campaign transaction
      const txPayload = {
        function: `${CONTRACT_ADDRESS}::betting_campaign::create_campaign`,
        type_args: [],
        args: [endTimeInSeconds.toString()]
      }

      console.log('Sending transaction:', txPayload)

      try {
        // Send transaction
        const txHash = await provider.sendTransaction(txPayload)
        console.log('Transaction sent:', txHash)

        // Wait for transaction confirmation
        const receipt = await provider.waitForTransaction(txHash)
        console.log('Transaction confirmed:', receipt)

        alert('Battle created successfully!')
        onBack()
      } catch (txError) {
        console.error('Transaction error:', txError)
        throw new Error(txError.message || 'Transaction failed')
      }
    } catch (error) {
      console.error('Error creating battle:', error)
      setError(error.message || 'Failed to create battle')
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-white">Create Battle</h2>
            <button
              onClick={onBack}
              className="text-gray-400 hover:text-white transition-colors"
            >
              ← Back
            </button>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <div className="bg-secondary/50 rounded-2xl p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Token 1 */}
                <div className="space-y-4">
                  <label className="block text-white font-semibold mb-2">
                    First Token
                  </label>
                  <input
                    type="text"
                    value={formData.token1}
                    onChange={(e) => setFormData({...formData, token1: e.target.value.toUpperCase()})}
                    placeholder="Enter token symbol"
                    className="w-full bg-background/50 text-white p-4 rounded-lg border border-gray-700 focus:border-primary outline-none placeholder-gray-500"
                  />
                </div>

                {/* Token 2 */}
                <div className="space-y-4">
                  <label className="block text-white font-semibold mb-2">
                    Second Token
                  </label>
                  <input
                    type="text"
                    value={formData.token2}
                    onChange={(e) => setFormData({...formData, token2: e.target.value.toUpperCase()})}
                    placeholder="Enter token symbol"
                    className="w-full bg-background/50 text-white p-4 rounded-lg border border-gray-700 focus:border-primary outline-none placeholder-gray-500"
                  />
                </div>
              </div>

              {/* Duration Input */}
              <div className="space-y-4">
                <label className="block text-white font-semibold mb-2">
                  Battle Duration (hours)
                </label>
                <input
                  type="number"
                  value={formData.endTime}
                  onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                  placeholder="Enter duration in hours"
                  min="1"
                  max="168"
                  className="w-full bg-background/50 text-white p-4 rounded-lg border border-gray-700 focus:border-primary outline-none placeholder-gray-500"
                />
              </div>

              {/* Popular Tokens */}
              <div>
                <h3 className="text-white font-semibold mb-4">Popular Tokens</h3>
                <div className="flex flex-wrap gap-3">
                  {popularTokens.map((token) => (
                    <button
                      key={token.symbol}
                      type="button"
                      onClick={() => {
                        if (!formData.token1) {
                          setFormData({...formData, token1: token.symbol})
                        } else if (!formData.token2 && formData.token1 !== token.symbol) {
                          setFormData({...formData, token2: token.symbol})
                        }
                      }}
                      className="bg-background/30 text-white px-4 py-2 rounded-lg hover:bg-primary/20 transition-all"
                    >
                      {token.symbol}
                    </button>
                  ))}
                </div>
              </div>

              {/* Battle Preview */}
              <div className="bg-background/30 p-6 rounded-xl">
                <h3 className="text-white font-semibold mb-4">Battle Preview</h3>
                <div className="flex items-center justify-center gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-background/50 rounded-full flex items-center justify-center mb-2 mx-auto">
                      <span className="text-xl font-bold text-primary">
                        {formData.token1 || '?'}
                      </span>
                    </div>
                  </div>
                  <div className="text-primary text-2xl font-bold">VS</div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-background/50 rounded-full flex items-center justify-center mb-2 mx-auto">
                      <span className="text-xl font-bold text-primary">
                        {formData.token2 || '?'}
                      </span>
                    </div>
                  </div>
                </div>
                {formData.endTime && (
                  <div className="text-center mt-4 text-gray-400">
                    Duration: {formData.endTime} hours
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!formData.token1 || !formData.token2 || !formData.endTime || isCreating || !provider}
                className="w-full bg-primary text-white px-6 py-4 rounded-lg hover:bg-primary/80 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCreating ? (
                  <span className="animate-pulse">Creating Battle...</span>
                ) : !provider ? (
                  'Install Starkey Wallet'
                ) : (
                  'Create Battle'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateBattle 