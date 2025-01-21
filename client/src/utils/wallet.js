import { SupraClient } from 'supra-l1-sdk'

// Supra Testnet Configuration
export const SUPRA_CHAIN_ID = '0x1BC' // 444 in hex
export const SUPRA_NETWORK = {
  chainId: SUPRA_CHAIN_ID,
  chainName: 'Supra Testnet',
  nativeCurrency: {
    name: 'SUPRA',
    symbol: 'SUPRA',
    decimals: 18
  },
  rpcUrls: ['https://rpc-testnet.supra.com/'],
  blockExplorerUrls: ['https://explorer.supraoracles.com/testnet/']
}

// Supra Contract Address
export const SUPRA_CONTRACT_ADDRESS = '0xb8a37ea0164f53c244b08d41614ef7fa66b4d3abdc31ff2c1cde5b68aae8456'

let supraClient = null

// Export the getProvider function
export const getProvider = () => {
  if ("starkey" in window) {
    const provider = window.starkey?.supra;
    if (provider) {
      return provider;
    }
  }
  return null;
}

const initSupraClient = async () => {
  if (!supraClient) {
    try {
      // Update initialization to use object parameter
      supraClient = await SupraClient.init({
        rpcUrl: 'https://rpc-testnet.supra.com/',
        chainId: SUPRA_CHAIN_ID
      });
      console.log('Supra client initialized')
    } catch (error) {
      console.error('Failed to initialize Supra client:', error)
    }
  }
  return supraClient
}

export const connectWallet = async () => {
  const provider = getProvider()
  if (!provider) {
    throw new Error('Please install Starkey wallet')
  }

  try {
    // Connect using Starkey provider
    const accounts = await provider.connect()
    if (!accounts || !accounts[0]) {
      throw new Error('No accounts found')
    }

    // Initialize Supra client
    await initSupraClient()

    // Get balance
    const balance = await provider.balance()
    const formattedBalance = balance?.balance == 0 ? 0 : balance?.balance / 100000000
    console.log('Connected to Supra network with address:', accounts[0], 'Balance:', formattedBalance)

    return accounts[0]
  } catch (error) {
    console.error('Error connecting wallet:', error)
    throw error
  }
}

export const getBalance = async () => {
  const provider = getProvider()
  if (!provider) return 0

  try {
    const balance = await provider.balance()
    return balance?.balance == 0 ? 0 : balance?.balance / 100000000
  } catch (error) {
    console.error('Error getting balance:', error)
    return 0
  }
}

export const disconnectWallet = async () => {
  const provider = getProvider()
  if (!provider) return

  try {
    await provider.disconnect()
    console.log('Disconnected from wallet')
    return true
  } catch (error) {
    console.error('Error disconnecting:', error)
    return false
  }
}

export const isSupraNetwork = async () => {
  const provider = getProvider()
  if (!provider) return false
  
  try {
    const accounts = await provider.account()
    return accounts && accounts.length > 0
  } catch (error) {
    console.error('Error checking network:', error)
    return false
  }
}

export const getSupraClient = () => supraClient 