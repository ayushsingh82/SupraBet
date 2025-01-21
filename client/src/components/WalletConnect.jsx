import React, { useState, useEffect } from 'react'
import { connectWallet, disconnectWallet, isSupraNetwork, getBalance } from '../utils/wallet'

const WalletConnect = () => {
  const [account, setAccount] = useState(null)
  const [balance, setBalance] = useState(0)
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState(null)

  const handleConnect = async () => {
    try {
      setIsConnecting(true)
      setError(null)
      
      const account = await connectWallet()
      setAccount(account)
      
      // Get initial balance
      const balance = await getBalance()
      setBalance(balance)
    } catch (error) {
      console.error('Connection error:', error)
      setError(error.message)
      setAccount(null)
    } finally {
      setIsConnecting(false)
    }
  }

  const handleDisconnect = async () => {
    try {
      await disconnectWallet()
      setAccount(null)
      setBalance(0)
    } catch (error) {
      console.error('Disconnect error:', error)
    }
  }

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const isConnected = await isSupraNetwork()
        if (isConnected) {
          const provider = window.starkey?.supra
          if (provider) {
            const accounts = await provider.account()
            if (accounts && accounts[0]) {
              setAccount(accounts[0])
              const balance = await getBalance()
              setBalance(balance)
            }
          }
        }
      } catch (error) {
        console.error('Error checking connection:', error)
      }
    }

    checkConnection()
  }, [])

  return (
    <div className="relative">
      {error && (
        <div className="absolute bottom-full mb-2 w-full text-red-500 text-sm">
          {error}
        </div>
      )}
      {account ? (
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-400">{balance.toFixed(4)} SUPRA</span>
          <button
            onClick={handleDisconnect}
            className="bg-primary/10 text-primary px-4 py-2 rounded-lg hover:bg-primary/20 transition-all flex items-center gap-2"
          >
            <span>{`${account.slice(0, 6)}...${account.slice(-4)}`}</span>
            <span className="text-xs">↓</span>
          </button>
        </div>
      ) : (
        <button
          onClick={handleConnect}
          disabled={isConnecting}
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/80 transition-all flex items-center gap-2 disabled:opacity-50"
        >
          {isConnecting ? (
            <span className="animate-pulse">Connecting...</span>
          ) : (
            <>
              <span>Connect Wallet</span>
              <span className="text-xl">→</span>
            </>
          )}
        </button>
      )}
    </div>
  )
}

export default WalletConnect 