import React, { useState } from 'react'
import { useWallet } from '../contexts/WalletContext'
import { formatAddress } from '../utils/metamask'
import Verify from './Verify'

const EmployeeDashboard: React.FC = () => {
  const { account, authData, disconnect } = useWallet()
  const [activeTab, setActiveTab] = useState<'dashboard' | 'verify' | 'documents' | 'profile'>('dashboard')
  
  const [verificationHistory] = useState([
    { id: 1, type: 'Identity Verification', status: 'completed', completedAt: '2024-01-15', organization: 'Tech Corp Inc.' },
    { id: 2, type: 'Background Check', status: 'pending', completedAt: null, organization: 'Consulting LLC' },
    { id: 3, type: 'Age Verification', status: 'completed', completedAt: '2024-01-10', organization: 'Startup XYZ' },
  ])

  const handleDisconnect = () => {
    disconnect()
    window.location.href = '/'
  }

  const TabButton: React.FC<{ id: string; icon: React.ReactNode; label: string; isActive: boolean }> = ({ 
    id, icon, label, isActive 
  }) => (
    <button
      onClick={() => setActiveTab(id as any)}
      className={`flex items-center px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
        isActive 
          ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg' 
          : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
      }`}
    >
      {icon}
      <span className="ml-2">{label}</span>
    </button>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50 to-emerald-100">
      {/* Header */}
      <nav className="bg-white shadow-sm border-b border-green-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h1 className="ml-3 text-xl font-bold text-gray-900">VeriFile</h1>
              <span className="ml-2 px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">Employee</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-sm text-gray-600">{formatAddress(account || '')}</span>
              </div>
              <button
                onClick={handleDisconnect}
                className="px-4 py-2 text-sm text-red-600 hover:text-red-700 font-medium"
              >
                Disconnect
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-green-100">
              <nav className="space-y-2">
                <TabButton
                  id="dashboard"
                  icon={
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v0H8V5z" />
                    </svg>
                  }
                  label="Dashboard"
                  isActive={activeTab === 'dashboard'}
                />
                <TabButton
                  id="verify"
                  icon={
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  }
                  label="Verify Identity"
                  isActive={activeTab === 'verify'}
                />
                <TabButton
                  id="documents"
                  icon={
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  }
                  label="Documents"
                  isActive={activeTab === 'documents'}
                />
                <TabButton
                  id="profile"
                  icon={
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  }
                  label="Profile"
                  isActive={activeTab === 'profile'}
                />
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Dashboard Tab */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-green-100">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Employee Dashboard</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-green-600">Completed Verifications</p>
                          <p className="text-2xl font-bold text-green-900">{verificationHistory.filter(v => v.status === 'completed').length}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-xl p-6 border border-yellow-200">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-yellow-600">Pending Verifications</p>
                          <p className="text-2xl font-bold text-yellow-900">{verificationHistory.filter(v => v.status === 'pending').length}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-blue-600">Total Verifications</p>
                          <p className="text-2xl font-bold text-blue-900">{verificationHistory.length}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Recent Verifications */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Verification History</h3>
                    <div className="space-y-3">
                      {verificationHistory.map((verification) => (
                        <div key={verification.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center">
                            <div className={`w-3 h-3 rounded-full mr-3 ${
                              verification.status === 'completed' ? 'bg-green-500' : 'bg-yellow-500'
                            }`}></div>
                            <div>
                              <p className="font-medium text-gray-900">{verification.type}</p>
                              <p className="text-sm text-gray-600">{verification.organization}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              verification.status === 'completed' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {verification.status}
                            </span>
                            {verification.completedAt && (
                              <p className="text-xs text-gray-500 mt-1">{verification.completedAt}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {authData && (
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-100 rounded-xl p-6 border border-blue-200">
                      <h3 className="text-lg font-semibold text-blue-900 mb-4">Authentication Details</h3>
                      <div className="space-y-2 text-sm">
                        <p><span className="font-medium text-blue-800">Wallet Address:</span> <span className="font-mono text-blue-600">{authData.address}</span></p>
                        <p><span className="font-medium text-blue-800">User Type:</span> <span className="text-blue-600 capitalize">Employee</span></p>
                        <p><span className="font-medium text-blue-800">Authentication Status:</span> <span className="text-green-600">✓ Authenticated</span></p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Verify Tab */}
            {activeTab === 'verify' && (
              <div className="bg-white rounded-2xl shadow-lg border border-green-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <h2 className="text-2xl font-bold text-gray-900">Identity Verification</h2>
                  <p className="text-gray-600 mt-1">Complete your identity verification process</p>
                </div>
                <div className="p-0">
                  <Verify />
                </div>
              </div>
            )}

            {/* Documents Tab */}
            {activeTab === 'documents' && (
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-green-100">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Documents</h2>
                  <button className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-colors">
                    Upload Document
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-400 transition-colors cursor-pointer">
                    <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Identity Document</h3>
                    <p className="text-gray-600 text-sm mb-4">Upload your government-issued ID, passport, or driver's license</p>
                    <span className="text-green-600 font-medium">Click to upload</span>
                  </div>

                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-400 transition-colors cursor-pointer">
                    <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Proof of Address</h3>
                    <p className="text-gray-600 text-sm mb-4">Upload a utility bill, bank statement, or lease agreement</p>
                    <span className="text-green-600 font-medium">Click to upload</span>
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Uploaded Documents</h3>
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <p className="text-gray-500">No documents uploaded yet</p>
                  </div>
                </div>
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-green-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Employee Profile</h2>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                        placeholder="John"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                        placeholder="Doe"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <input
                      type="email"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                      placeholder="john.doe@email.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nationality</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500">
                      <option value="">Select your nationality</option>
                      <option value="us">United States</option>
                      <option value="ca">Canada</option>
                      <option value="uk">United Kingdom</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <button className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-colors">
                    Save Profile
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default EmployeeDashboard