import React, { useState } from 'react'

const BetPopup = ({ isOpen, onClose, battle, onConfirm }) => {
  const [amount, setAmount] = useState('')
  const [selectedToken, setSelectedToken] = useState(battle?.token1.symbol)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-secondary/95 rounded-2xl p-8 max-w-md w-full mx-4 animate-slide-up">
        <h3 className="text-2xl font-bold text-white mb-6">
          Place Your Bet
        </h3>

        {/* Token Selection */}
        <div className="mb-6">
          <label className="block text-gray-400 mb-2">Select Token</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setSelectedToken(battle.token1.symbol)}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedToken === battle.token1.symbol
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-gray-700 hover:border-primary/50 text-white'
              }`}
            >
              {battle.token1.symbol}
            </button>
            <button
              onClick={() => setSelectedToken(battle.token2.symbol)}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedToken === battle.token2.symbol
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-gray-700 hover:border-primary/50 text-white'
              }`}
            >
              {battle.token2.symbol}
            </button>
          </div>
        </div>

        {/* Amount Input */}
        <div className="mb-8">
          <label className="block text-gray-400 mb-2">Amount</label>
          <div className="relative">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="w-full bg-background/50 text-white p-4 rounded-lg border border-gray-700 focus:border-primary outline-none placeholder-gray-500"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
              {selectedToken}
            </span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <button
            onClick={() => onConfirm(selectedToken, amount)}
            disabled={!amount || amount <= 0}
            className="flex-1 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/80 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Confirm Bet
          </button>
          <button
            onClick={onClose}
            className="flex-1 border border-gray-700 text-white px-6 py-3 rounded-lg hover:bg-white/5 transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

export default BetPopup 