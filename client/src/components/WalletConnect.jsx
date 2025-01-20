import React, { useState, useEffect } from 'react'

const WalletConnect = () => {
  const [account, setAccount] = useState(null)
  const [isConnecting, setIsConnecting] = useState(false)

  const connectWallet = async () => {
    try {
      setIsConnecting(true)
      
      if (typeof window.ethereum !== 'undefined') {
        // Force wallet confirmation using legacy method
        try {
          // First try to enable ethereum
          await window.ethereum.enable()
          
          // Then get the accounts
          const accounts = await window.ethereum.request({
            method: 'eth_accounts'
          })
          
          if (accounts && accounts[0]) {
            setAccount(accounts[0])
          }
        } catch (enableError) {
          // Fallback to request method if enable fails
          const accounts = await window.ethereum.request({
            method: 'eth_requestAccounts'
          })
          if (accounts && accounts[0]) {
            setAccount(accounts[0])
          }
        }
      } else {
        window.open('https://chromewebstore.google.com/detail/starkey-wallet/iljfbbgfaklhbgcbmghmhmnpdfddnhie', '_blank')
      }
    } catch (error) {
      console.error('Error connecting wallet:', error)
    } finally {
      setIsConnecting(false)
    }
  }

  useEffect(() => {
    const checkConnection = async () => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          const accounts = await window.ethereum.request({
            method: 'eth_accounts'
          })
          if (accounts && accounts[0]) {
            setAccount(accounts[0])
          }
        } catch (error) {
          console.error('Error checking wallet connection:', error)
        }
      }
    }

    checkConnection()

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0])
        } else {
          setAccount(null)
        }
      })
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', () => {})
      }
    }
  }, [])

  const disconnectWallet = () => {
    setAccount(null)
  }

  return (
    <div className="relative">
      {account ? (
        <button
          onClick={disconnectWallet}
          className="bg-primary/10 text-primary px-4 py-2 rounded-lg hover:bg-primary/20 transition-all flex items-center gap-2"
        >
          <span>{`${account.slice(0, 6)}...${account.slice(-4)}`}</span>
          <span className="text-xs">↓</span>
        </button>
      ) : (
        <button
          onClick={connectWallet}
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