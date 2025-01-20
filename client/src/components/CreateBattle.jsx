import React, { useState } from 'react'

const CreateBattle = ({ onBack }) => {
  const [formData, setFormData] = useState({
    token1: '',
    token2: '',
  })

  const popularTokens = [
    { symbol: 'ETH', name: 'Ethereum' },
    { symbol: 'BTC', name: 'Bitcoin' },
    { symbol: 'SUPRA', name: 'Supra' },
    { symbol: 'USDT', name: 'Tether' },
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (typeof window.starkey === 'undefined') {
      window.open('https://chromewebstore.google.com/detail/starkey-wallet/iljfbbgfaklhbgcbmghmhmnpdfddnhie', '_blank')
      return
    }

    try {
      const accounts = await window.starkey.request({ 
        method: 'eth_requestAccounts' 
      })
      
      if (accounts[0]) {
        console.log('Battle Creation Data:', {
          ...formData,
          creator: accounts[0]
        })
        // Handle battle creation logic
      }
    } catch (error) {
      console.error('Error creating battle:', error)
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
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!formData.token1 || !formData.token2}
                className="w-full bg-primary text-white px-6 py-4 rounded-lg hover:bg-primary/80 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Battle
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateBattle 