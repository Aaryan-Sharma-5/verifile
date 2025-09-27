import React, { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import type { AuthData } from '../utils/metamask'
import {
  getCurrentAccount,
  onAccountsChanged,
  onChainChanged,
  removeAllListeners,
  isMetaMaskInstalled,
  authenticateWithMetaMask
} from '../utils/metamask'

// Types
export type UserType = 'organization' | 'employee' | null
export type AuthStatus = 'disconnected' | 'connecting' | 'connected' | 'authenticating' | 'authenticated'

interface WalletContextType {
  // Connection state
  isMetaMaskAvailable: boolean
  account: string | null
  status: AuthStatus
  userType: UserType
  
  // Authentication data
  authData: AuthData | null
  
  // Actions
  connect: () => Promise<void>
  authenticate: (userType: 'organization' | 'employee') => Promise<void>
  disconnect: () => void
  
  // Loading states
  isConnecting: boolean
  isAuthenticating: boolean
  
  // Errors
  error: string | null
  clearError: () => void
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

interface WalletProviderProps {
  children: ReactNode
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  // State
  const [account, setAccount] = useState<string | null>(null)
  const [status, setStatus] = useState<AuthStatus>('disconnected')
  const [userType, setUserType] = useState<UserType>(null)
  const [authData, setAuthData] = useState<AuthData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isMetaMaskAvailable, setIsMetaMaskAvailable] = useState(false)

  // Derived state
  const isConnecting = status === 'connecting'
  const isAuthenticating = status === 'authenticating'

  // Clear error
  const clearError = () => setError(null)

  // Initialize MetaMask availability and check for existing connection
  useEffect(() => {
    const checkMetaMask = () => {
      const available = isMetaMaskInstalled()
      setIsMetaMaskAvailable(available)
      
      if (available) {
        // Check if already connected
        getCurrentAccount().then((account) => {
          if (account) {
            setAccount(account)
            setStatus('connected')
          }
        }).catch((error) => {
          console.error('Error checking existing connection:', error)
        })
      }
    }

    // Check immediately
    checkMetaMask()

    // Also check when the page loads completely
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', checkMetaMask)
      return () => document.removeEventListener('DOMContentLoaded', checkMetaMask)
    }
  }, [])

  // Set up event listeners for MetaMask
  useEffect(() => {
    if (!isMetaMaskAvailable) return

    // Handle account changes
    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        // User disconnected
        disconnect()
      } else if (accounts[0] !== account) {
        // User switched accounts
        setAccount(accounts[0])
        // Reset authentication when account changes
        setStatus('connected')
        setUserType(null)
        setAuthData(null)
        setError(null)
      }
    }

    // Handle chain changes
    const handleChainChanged = () => {
      // Reload the page on chain change as recommended by MetaMask
      window.location.reload()
    }

    // Set up listeners
    onAccountsChanged(handleAccountsChanged)
    onChainChanged(handleChainChanged)

    // Cleanup
    return () => {
      removeAllListeners()
    }
  }, [isMetaMaskAvailable, account])

  // Connect to MetaMask
  const connect = async (): Promise<void> => {
    if (!isMetaMaskAvailable) {
      setError('MetaMask is not installed. Please install MetaMask to continue.')
      return
    }

    try {
      setStatus('connecting')
      setError(null)
      
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      })
      
      if (accounts && accounts.length > 0) {
        setAccount(accounts[0])
        setStatus('connected')
      } else {
        throw new Error('No accounts found')
      }
    } catch (error: any) {
      setError(error.message || 'Failed to connect to MetaMask')
      setStatus('disconnected')
    }
  }

  // Authenticate with MetaMask
  const authenticate = async (selectedUserType: 'organization' | 'employee'): Promise<void> => {
    if (!account) {
      setError('Please connect your wallet first')
      return
    }

    try {
      setStatus('authenticating')
      setError(null)
      
      const data = await authenticateWithMetaMask(selectedUserType)
      
      setAuthData(data)
      setUserType(selectedUserType)
      setStatus('authenticated')
      
      // Store authentication data in sessionStorage for persistence
      sessionStorage.setItem('verifile_auth', JSON.stringify({
        authData: data,
        userType: selectedUserType,
        timestamp: Date.now()
      }))
      
    } catch (error: any) {
      setError(error.message || 'Authentication failed')
      setStatus('connected')
    }
  }

  // Disconnect wallet
  const disconnect = (): void => {
    setAccount(null)
    setStatus('disconnected')
    setUserType(null)
    setAuthData(null)
    setError(null)
    
    // Clear stored authentication data
    sessionStorage.removeItem('verifile_auth')
  }

  // Restore authentication from sessionStorage on page load
  useEffect(() => {
    const storedAuth = sessionStorage.getItem('verifile_auth')
    if (storedAuth && account) {
      try {
        const { authData: storedAuthData, userType: storedUserType, timestamp } = JSON.parse(storedAuth)
        
        // Check if authentication is not too old (24 hours)
        const isExpired = Date.now() - timestamp > 24 * 60 * 60 * 1000
        
        if (!isExpired && storedAuthData && storedUserType) {
          setAuthData(storedAuthData)
          setUserType(storedUserType)
          setStatus('authenticated')
        } else {
          // Clear expired data
          sessionStorage.removeItem('verifile_auth')
        }
      } catch (error) {
        console.error('Error restoring authentication:', error)
        sessionStorage.removeItem('verifile_auth')
      }
    }
  }, [account])

  const contextValue: WalletContextType = {
    // State
    isMetaMaskAvailable,
    account,
    status,
    userType,
    authData,
    
    // Actions
    connect,
    authenticate,
    disconnect,
    
    // Loading states
    isConnecting,
    isAuthenticating,
    
    // Errors
    error,
    clearError
  }

  return (
    <WalletContext.Provider value={contextValue}>
      {children}
    </WalletContext.Provider>
  )
}

// Custom hook to use wallet context
export const useWallet = (): WalletContextType => {
  const context = useContext(WalletContext)
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider')
  }
  return context
}

// Higher-order component for protected routes
export const withAuth = <P extends object>(
  Component: React.ComponentType<P>,
  requiredUserType?: 'organization' | 'employee'
) => {
  return (props: P) => {
    const { status, userType } = useWallet()
    
    if (status !== 'authenticated') {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Required</h2>
            <p className="text-gray-600">Please connect your wallet and authenticate to access this page.</p>
          </div>
        </div>
      )
    }
    
    if (requiredUserType && userType !== requiredUserType) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-100">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600">
              This page is only accessible to {requiredUserType} users.
            </p>
          </div>
        </div>
      )
    }
    
    return <Component {...props} />
  }
}