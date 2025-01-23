import React, { useState } from 'react'
import { getProvider } from '../utils/wallet'

const Transfer = ({ onBack }) => {
  const [formData, setFormData] = useState({
    address: '',
    amount: ''
  })
  const [isTransferring, setIsTransferring] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setIsTransferring(true)

    try {
      const provider = getProvider()
      if (!provider) {
        throw new Error('Please install Starkey wallet')
      }

      const accounts = await provider.account()
      if (!accounts || !accounts[0]) {
        throw new Error('Please connect your wallet')
      }

      // Create transfer transaction payload
      const payload = {
        type: 'entry_function_payload',
        function: '0x1::coin::transfer',
        type_arguments: ['0x1::supra_coin::SupraCoin'],
        arguments: [formData.address, formData.amount]
      }

      // Send transaction
      const txHash = await provider.sendTransaction(payload)
      console.log('Transfer sent:', txHash)

      alert('Transfer successful!')
      onBack()
    } catch (error) {
      console.error('Transfer error:', error)
      setError(error.message || 'Failed to transfer tokens')
    } finally {
      setIsTransferring(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-white">Transfer SUPRA</h2>
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
              {/* Recipient Address */}
              <div>
                <label className="block text-white font-semibold mb-2">
                  Recipient Address
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  placeholder="Enter recipient's address"
                  className="w-full bg-background/50 text-white p-4 rounded-lg border border-gray-700 focus:border-primary outline-none placeholder-gray-500"
                  required
                />
              </div>

              {/* Amount */}
              <div>
                <label className="block text-white font-semibold mb-2">
                  Amount (SUPRA)
                </label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                  placeholder="Enter amount to transfer"
                  min="0"
                  step="0.000001"
                  className="w-full bg-background/50 text-white p-4 rounded-lg border border-gray-700 focus:border-primary outline-none placeholder-gray-500"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={!formData.address || !formData.amount || isTransferring}
                className="w-full bg-primary text-white px-6 py-4 rounded-lg hover:bg-primary/80 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isTransferring ? (
                  <span className="animate-pulse">Transferring...</span>
                ) : (
                  'Transfer Tokens'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Transfer 