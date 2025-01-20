export const checkWalletConnection = async () => {
  if (typeof window.ethereum === 'undefined') {
    return null
  }

  try {
    const accounts = await window.ethereum.request({
      method: 'eth_accounts'
    })
    return accounts[0] || null
  } catch (error) {
    console.error('Error checking wallet connection:', error)
    return null
  }
}

export const connectWallet = async () => {
  if (typeof window.ethereum === 'undefined') {
    window.open('https://chromewebstore.google.com/detail/starkey-wallet/iljfbbgfaklhbgcbmghmhmnpdfddnhie', '_blank')
    return null
  }

  try {
    // Try legacy enable method first
    try {
      await window.ethereum.enable()
      const accounts = await window.ethereum.request({
        method: 'eth_accounts'
      })
      return accounts[0] || null
    } catch (enableError) {
      // Fallback to standard method
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      })
      return accounts[0] || null
    }
  } catch (error) {
    console.error('Error connecting wallet:', error)
    return null
  }
}

export const disconnectWallet = async () => {
  // Most wallets don't support programmatic disconnect
  return true
} 