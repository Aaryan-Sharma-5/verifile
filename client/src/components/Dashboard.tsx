import React, { useState } from 'react'
import { useWallet } from '../contexts/WalletContext'
import { formatAddress } from '../utils/metamask'
import AuthInfoModal from './AuthInfoModal'

const Dashboard: React.FC = () => {
  const {
    isMetaMaskAvailable,
    account,
    status,
    userType,
    connect,
    authenticate,
    disconnect,
    isConnecting,
    isAuthenticating,
    error,
    clearError
  } = useWallet()

  const [selectedUserType, setSelectedUserType] = useState<'organization' | 'employee' | null>(null)
  const [showAuthInfo, setShowAuthInfo] = useState(false)

  const handleConnect = async () => {
    clearError()
    await connect()
  }

  const handleAuthenticate = async (type: 'organization' | 'employee') => {
    clearError()
    setSelectedUserType(type)
    await authenticate(type)
  }

  const handleDisconnect = () => {
    disconnect()
    setSelectedUserType(null)
  }

  // MetaMask not available
  if (!isMetaMaskAvailable) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-3xl shadow-2xl p-8 border border-blue-100">
            <div className="w-20 h-20 bg-gradient-to-r from-red-400 to-red-600 rounded-full mx-auto mb-6 flex items-center justify-center">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">MetaMask Required</h1>
            <p className="text-gray-600 mb-6">
              To use VeriFile, you need to install MetaMask browser extension to connect your wallet.
            </p>
            <a
              href="https://metamask.io/download/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-orange-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
            >
              Install MetaMask
              <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <nav className="bg-white shadow-sm border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h1 className="ml-3 text-xl font-bold text-gray-900">VeriFile</h1>
            </div>
            
            {account && (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-sm text-gray-600">{formatAddress(account)}</span>
                </div>
                <button
                  onClick={handleDisconnect}
                  className="px-4 py-2 text-sm text-red-600 hover:text-red-700 font-medium"
                >
                  Disconnect
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Error Message */}
      {error && (
        <div className="max-w-4xl mx-auto mt-6 px-4">
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-700">{error}</p>
              <button
                onClick={clearError}
                className="ml-auto text-red-400 hover:text-red-600"
              >
                ×
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-4xl mx-auto pt-12 px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Secure Identity Verification
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Connect your wallet and authenticate to access verification services tailored for organizations and employees.
          </p>
        </div>

        {/* Connection Status */}
        {status === 'disconnected' && (
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-blue-100">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Connect Your Wallet</h3>
                <p className="text-gray-600 mb-6">
                  To get started, please connect your MetaMask wallet to securely authenticate your identity.
                </p>
                <button
                  onClick={handleConnect}
                  disabled={isConnecting}
                  className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isConnecting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Connecting...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M3.9 5.1v3.8h3.8c-.5-1.6-1.7-2.8-3.8-3.8zm4.9 0c1.5.9 2.4 2.4 2.9 4.2h3.8c-.5-2.1-1.8-3.8-3.8-4.7v-.5c0-.8-.3-1.5-.9-2z" />
                      </svg>
                      Connect with MetaMask
                    </div>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* User Type Selection */}
        {status === 'connected' && !userType && (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Account Type</h3>
              <p className="text-gray-600">Select the type of account that best describes you to continue with authentication.</p>
              <button
                onClick={() => setShowAuthInfo(true)}
                className="mt-3 text-blue-600 hover:text-blue-800 text-sm font-medium underline"
              >
                How does MetaMask authentication work?
              </button>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Organization Card */}
              <div className="bg-white rounded-3xl shadow-xl p-8 border border-blue-100 hover:border-blue-200 transition-all duration-200 hover:shadow-2xl">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full mx-auto mb-6 flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-3">Organization</h4>
                  <p className="text-gray-600 mb-6">
                    For companies and organizations that need to verify employee identities and manage verification processes.
                  </p>
                  <ul className="text-sm text-gray-500 mb-6 space-y-2">
                    <li className="flex items-center">
                      <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Manage employee verifications
                    </li>
                    <li className="flex items-center">
                      <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Access verification dashboard
                    </li>
                    <li className="flex items-center">
                      <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Generate QR codes
                    </li>
                  </ul>
                  <button
                    onClick={() => handleAuthenticate('organization')}
                    disabled={isAuthenticating}
                    className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isAuthenticating && selectedUserType === 'organization' ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Authenticating...
                      </div>
                    ) : (
                      'Continue as Organization'
                    )}
                  </button>
                </div>
              </div>

              {/* Employee Card */}
              <div className="bg-white rounded-3xl shadow-xl p-8 border border-blue-100 hover:border-blue-200 transition-all duration-200 hover:shadow-2xl">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full mx-auto mb-6 flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-3">Employee</h4>
                  <p className="text-gray-600 mb-6">
                    For individuals who need to complete identity verification for employment or access purposes.
                  </p>
                  <ul className="text-sm text-gray-500 mb-6 space-y-2">
                    <li className="flex items-center">
                      <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Complete identity verification
                    </li>
                    <li className="flex items-center">
                      <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Secure document uploads
                    </li>
                    <li className="flex items-center">
                      <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Track verification status
                    </li>
                  </ul>
                  <button
                    onClick={() => handleAuthenticate('employee')}
                    disabled={isAuthenticating}
                    className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-xl hover:from-green-600 hover:to-green-700 transform hover:scale-105 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isAuthenticating && selectedUserType === 'employee' ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Authenticating...
                      </div>
                    ) : (
                      'Continue as Employee'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Authenticated Success */}
        {status === 'authenticated' && userType && (
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-green-200">
              <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-green-600 rounded-full mx-auto mb-6 flex items-center justify-center">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Authentication Successful!</h3>
              <p className="text-gray-600 mb-6">
                Welcome! You are now authenticated as an <span className="font-semibold capitalize">{userType}</span>.
                You can now access all the features available for your account type.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => window.location.href = userType === 'organization' ? '/organization' : '/employee'}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
                >
                  Go to Dashboard
                </button>
                <button
                  onClick={() => window.location.href = '/verify'}
                  className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-orange-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
                >
                  Start Verification
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-16 py-8 border-t border-blue-100 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-sm text-gray-500">
            Powered by <span className="font-semibold text-blue-600">VeriFile</span> • 
            Secure • Private • Decentralized
          </p>
        </div>
      </footer>

      {/* Authentication Info Modal */}
      <AuthInfoModal isOpen={showAuthInfo} onClose={() => setShowAuthInfo(false)} />
    </div>
  )
}

export default Dashboard