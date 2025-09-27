import React from 'react'

const AuthInfoModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">MetaMask Authentication</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="p-6 space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">How Authentication Works</h3>
            <div className="space-y-4 text-gray-700">
              <p>
                When you click "Continue as Organization" or "Continue as Employee", VeriFile will prompt 
                you to sign a message with MetaMask to securely authenticate your account.
              </p>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">What happens during authentication:</h4>
                <ol className="list-decimal list-inside space-y-1 text-blue-800">
                  <li>MetaMask opens with a message for you to sign</li>
                  <li>You click "Sign" to prove you own the wallet</li>
                  <li>Your wallet address becomes your User ID</li>
                  <li>The signature verifies your identity</li>
                </ol>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">The 3 Essential Pieces of Data</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center mb-3">
                  <span className="text-white font-bold text-sm">1</span>
                </div>
                <h4 className="font-medium text-green-900 mb-2">Wallet Address</h4>
                <p className="text-sm text-green-700">
                  Your public 0x... address that identifies your wallet
                </p>
              </div>
              
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center mb-3">
                  <span className="text-white font-bold text-sm">2</span>
                </div>
                <h4 className="font-medium text-purple-900 mb-2">Original Message</h4>
                <p className="text-sm text-purple-700">
                  The exact text you were asked to sign with timestamp and nonce
                </p>
              </div>
              
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center mb-3">
                  <span className="text-white font-bold text-sm">3</span>
                </div>
                <h4 className="font-medium text-orange-900 mb-2">Signature</h4>
                <p className="text-sm text-orange-700">
                  The unique cryptographic signature created by your private key
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Security & Privacy</h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700">This is a signature for login purposes only</span>
              </div>
              <div className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700">No transactions are authorized or funds accessed</span>
              </div>
              <div className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700">Your private key never leaves your device</span>
              </div>
              <div className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700">All data is encrypted and stored securely</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-colors"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  )
}

export default AuthInfoModal