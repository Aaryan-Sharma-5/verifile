import { useState, useEffect } from 'react'
import { Shield, Building, User, AlertCircle, CheckCircle, Download } from 'lucide-react'
import { isMetaMaskInstalled, connectWallet, getCurrentAccount, authenticateWithMetaMask } from '../utils/metamask'
import type { AuthData } from '../utils/metamask'
import SelfComponent from '../components/auth/SelfComponent'

type UserType = 'organization' | 'employee'

function RegisterChoice() {
  const [selectedType, setSelectedType] = useState<UserType>('employee')
  const [isMetaMaskAvailable, setIsMetaMaskAvailable] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [account, setAccount] = useState<string>('')
  const [authData, setAuthData] = useState<AuthData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>('')
  const [orgWantsToJoin, setOrgWantsToJoin] = useState<boolean | null>(null)

  useEffect(() => {
    checkMetaMaskStatus()
  }, [])

  const checkMetaMaskStatus = async () => {
    const installed = isMetaMaskInstalled()
    setIsMetaMaskAvailable(installed)

    if (installed) {
      const currentAccount = await getCurrentAccount()
      if (currentAccount) {
        setAccount(currentAccount)
        setIsConnected(true)
      }
    }
  }

  const handleConnectWallet = async () => {
    if (!isMetaMaskAvailable) {
      setError('Please install MetaMask first')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const connectedAccount = await connectWallet()
      setAccount(connectedAccount)
      setIsConnected(true)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to connect wallet')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAuthenticate = async () => {
    if (!isConnected) {
      setError('Please connect your wallet first')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const auth = await authenticateWithMetaMask(selectedType)
      setAuthData(auth)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Authentication failed')
    } finally {
      setIsLoading(false)
    }
  }

  const renderRegistrationContent = () => {
    if (selectedType === 'employee') {
      if (!authData) {
        return (
          <div className="text-center py-8">
            <User className="w-16 h-16 text-orange-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-4">Employee Verification</h3>
            <p className="text-gray-600 mb-6">
              Complete your identity verification using Self.xyz to securely register as an employee.
            </p>
            <button
              onClick={handleAuthenticate}
              disabled={isLoading || !isConnected}
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-6 py-3 rounded-lg font-semibold transition-all"
            >
              {isLoading ? 'Authenticating...' : 'Start Verification'}
            </button>
          </div>
        )
      }

      return (
        <div>
          <SelfComponent 
            account={authData.address} 
            authData={JSON.stringify(authData)} 
            userType="employee" 
          />
        </div>
      )
    } else {
      // Organization registration
      if (orgWantsToJoin === null) {
        return (
          <div className="text-center py-8">
            <Building className="w-16 h-16 text-orange-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-4">Organization Registration</h3>
            <p className="text-gray-600 mb-8">
              Would you like to add your organization to our trusted partner list?
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setOrgWantsToJoin(true)}
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-3 rounded-lg font-semibold transition-all"
              >
                Yes, Add Organization
              </button>
              <button
                onClick={() => setOrgWantsToJoin(false)}
                className="border-2 border-orange-500 text-orange-500 hover:bg-orange-50 px-6 py-3 rounded-lg font-semibold transition-all"
              >
                Not Now
              </button>
            </div>
          </div>
        )
      }

      if (orgWantsToJoin) {
        return (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gradient-to-r from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Application Submitted</h3>
            <p className="text-gray-600 mb-6">
              Thank you for your interest! Your organization application has been submitted for review. 
              Our team will contact you within 2-3 business days to proceed with the verification process.
            </p>
            <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
              <p className="text-sm text-orange-700">
                <strong>Connected Wallet:</strong> {account}
              </p>
            </div>
          </div>
        )
      } else {
        return (
          <div className="text-center py-8">
            <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-4">Registration Skipped</h3>
            <p className="text-gray-600 mb-6">
              You can always apply to add your organization later from your dashboard.
            </p>
            <button
              onClick={() => setOrgWantsToJoin(null)}
              className="text-orange-600 hover:text-orange-700 font-semibold transition-colors"
            >
              ← Go Back
            </button>
          </div>
        )
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100">
      {/* Header */}
      <header className="px-6 py-6">
        <nav className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              VeriFile
            </span>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 pt-8 pb-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Choose Your
            <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent"> Registration Type</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Register as an employee to verify your work history or as an organization to issue verified credentials.
          </p>
        </div>

        {/* MetaMask Connection Status */}
        {!isMetaMaskAvailable && (
          <div className="mb-8 bg-red-50 border border-red-200 rounded-xl p-6">
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-red-800">MetaMask Required</h3>
                <p className="text-red-700 mt-1">
                  Please install MetaMask to continue with registration.
                </p>
                <a
                  href="https://metamask.io/download/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 mt-3 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Install MetaMask</span>
                </a>
              </div>
            </div>
          </div>
        )}

        {!isConnected && isMetaMaskAvailable && (
          <div className="mb-8 bg-orange-50 border border-orange-200 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <AlertCircle className="w-6 h-6 text-orange-500" />
                <div>
                  <h3 className="font-semibold text-orange-800">Connect Your Wallet</h3>
                  <p className="text-orange-700">Connect your MetaMask wallet to continue.</p>
                </div>
              </div>
              <button
                onClick={handleConnectWallet}
                disabled={isLoading}
                className="bg-orange-500 hover:bg-orange-600 disabled:bg-orange-400 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
              >
                {isLoading ? 'Connecting...' : 'Connect Wallet'}
              </button>
            </div>
          </div>
        )}

        {isConnected && (
          <div className="mb-8 bg-green-50 border border-green-200 rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-6 h-6 text-green-500" />
              <div>
                <h3 className="font-semibold text-green-800">Wallet Connected</h3>
                <p className="text-green-700 text-sm">{account}</p>
              </div>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="mb-8 bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Registration Box */}
        {isConnected && (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            {/* Type Selection Tabs */}
            <div className="flex bg-gray-50 border-b border-gray-200">
              <button
                onClick={() => {
                  setSelectedType('employee')
                  setOrgWantsToJoin(null)
                  setAuthData(null)
                }}
                className={`flex-1 py-4 px-6 text-center font-semibold transition-colors ${
                  selectedType === 'employee'
                    ? 'bg-white text-orange-600 border-b-2 border-orange-600'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <User className="w-5 h-5 inline-block mr-2" />
                Employee
              </button>
              <button
                onClick={() => {
                  setSelectedType('organization')
                  setOrgWantsToJoin(null)
                  setAuthData(null)
                }}
                className={`flex-1 py-4 px-6 text-center font-semibold transition-colors ${
                  selectedType === 'organization'
                    ? 'bg-white text-orange-600 border-b-2 border-orange-600'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <Building className="w-5 h-5 inline-block mr-2" />
                Organization
              </button>
            </div>

            {/* Registration Content */}
            <div className="p-8">
              {renderRegistrationContent()}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default RegisterChoice