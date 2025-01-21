import React, { useState } from 'react'

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

  const popularTokens = [
    { symbol: 'ETH', name: 'Ethereum' },
    { symbol: 'BTC', name: 'Bitcoin' },
    { symbol: 'SUPRA', name: 'Supra' },
    { symbol: 'USDT', name: 'Tether' },
  ]

  const checkAndSwitchNetwork = async () => {
    try {
      const chainId = await window.ethereum.request({ method: 'eth_chainId' })
      
      if (chainId !== SUPRA_CHAIN_ID) {
        try {
          // Try switching to Supra network
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: SUPRA_CHAIN_ID }],
          })
        } catch (switchError) {
          // If network doesn't exist, add it
          if (switchError.code === 4902) {
            try {
              await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [SUPRA_NETWORK]
              })
            } catch (addError) {
              console.error('Error adding network:', addError)
              throw new Error('Failed to add Supra network. Please add it manually.')
            }
          } else {
            throw new Error('Please switch to Supra network in your wallet.')
          }
        }
      }
      return true
    } catch (error) {
      console.error('Error switching network:', error)
      throw error
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (typeof window.ethereum === 'undefined') {
      window.open('https://chromewebstore.google.com/detail/starkey-wallet/iljfbbgfaklhbgcbmghmhmnpdfddnhie', '_blank')
      return
    }

    try {
      setIsCreating(true)

      // First ensure we're on Supra network
      const networkSwitched = await checkAndSwitchNetwork()
      if (!networkSwitched) {
        throw new Error('Please switch to Supra network')
      }

      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      })
      
      if (accounts[0]) {
        // Calculate end time in seconds from now
        const endTimeInSeconds = Math.floor(Date.now() / 1000) + (parseInt(formData.endTime) * 3600)

        // Format the function call according to Move contract
        const functionSignature = 'create_campaign'
        const functionArgs = [endTimeInSeconds.toString()]
        
        // Create the transaction payload
        const txPayload = {
          from: accounts[0],
          to: CONTRACT_ADDRESS,
          value: '0x0',
          // Format data according to Move contract call format
          data: '0x' + Buffer.from(
            JSON.stringify({
              function: `${CONTRACT_ADDRESS}::betting_campaign::${functionSignature}`,
              type_args: [],
              args: functionArgs
            })
          ).toString('hex')
        }

        console.log('Transaction Payload:', txPayload) // Debug log

        // Send transaction
        const txHash = await window.ethereum.request({
          method: 'eth_sendTransaction',
          params: [txPayload]
        })

        console.log('Battle Created:', {
          ...formData,
          creator: accounts[0],
          txHash
        })

        // Show success message
        alert('Battle created successfully!')
        onBack()
      }
    } catch (error) {
      console.error('Error creating battle:', error)
      if (error.code === 4001) {
        alert('Transaction rejected by user')
      } else if (error.message.includes('insufficient funds')) {
        alert('Insufficient funds to create battle')
      } else {
        alert(error.message || 'Failed to create battle. Please try again.')
      }
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary overflow-hidden">
      {/* Header */}
      <div className="container mx-auto px-4 pt-20">
        <button 
          onClick={onBack}
          className="text-gray-400 hover:text-primary transition-colors flex items-center gap-2"
        >
          <span>←</span>
          Back to Battles
        </button>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-12 text-center">
            Create New <span className="text-primary">Battle</span>
          </h1>

          <div className="bg-secondary/50 backdrop-blur-sm rounded-2xl p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Token Pair Selection */}
              <div className="grid md:grid-cols-2 gap-8">
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
                disabled={!formData.token1 || !formData.token2 || !formData.endTime || isCreating}
                className="w-full bg-primary text-white px-6 py-4 rounded-lg hover:bg-primary/80 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCreating ? (
                  <span className="animate-pulse">Creating Battle...</span>
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