import React, { useState } from 'react'
import { useWallet } from '../contexts/WalletContext'
import { formatAddress } from '../utils/metamask'
import Verify from './Verify'

const OrganizationDashboard: React.FC = () => {
  const { account, authData, disconnect } = useWallet()
  const [activeTab, setActiveTab] = useState<'dashboard' | 'verify' | 'employees' | 'settings'>('dashboard')
  
  const [employees, setEmployees] = useState([
    { id: 1, name: 'John Doe', email: 'john@company.com', status: 'verified', walletAddress: '0x742d...96af', verifiedAt: '2024-01-15' },
    { id: 2, name: 'Jane Smith', email: 'jane@company.com', status: 'pending', walletAddress: '0x8f3a...2b7c', verifiedAt: null },
    { id: 3, name: 'Mike Johnson', email: 'mike@company.com', status: 'verified', walletAddress: '0x1c4e...89df', verifiedAt: '2024-01-10' },
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
          ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg' 
          : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
      }`}
    >
      {icon}
      <span className="ml-2">{label}</span>
    </button>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-indigo-100">
      {/* Header */}
      <nav className="bg-white shadow-sm border-b border-purple-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h1 className="ml-3 text-xl font-bold text-gray-900">VeriFile</h1>
              <span className="ml-2 px-2 py-1 text-xs font-medium bg-purple-100 text-purple-700 rounded-full">Organization</span>
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
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-purple-100">
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
                  id="employees"
                  icon={
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                  }
                  label="Employees"
                  isActive={activeTab === 'employees'}
                />
                <TabButton
                  id="settings"
                  icon={
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  }
                  label="Settings"
                  isActive={activeTab === 'settings'}
                />
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Dashboard Tab */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-purple-100">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Organization Dashboard</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-green-600">Verified Employees</p>
                          <p className="text-2xl font-bold text-green-900">{employees.filter(e => e.status === 'verified').length}</p>
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
                          <p className="text-2xl font-bold text-yellow-900">{employees.filter(e => e.status === 'pending').length}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-purple-600">Total Employees</p>
                          <p className="text-2xl font-bold text-purple-900">{employees.length}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {authData && (
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-100 rounded-xl p-6 border border-blue-200">
                      <h3 className="text-lg font-semibold text-blue-900 mb-4">Authentication Details</h3>
                      <div className="space-y-2 text-sm">
                        <p><span className="font-medium text-blue-800">Wallet Address:</span> <span className="font-mono text-blue-600">{authData.address}</span></p>
                        <p><span className="font-medium text-blue-800">User Type:</span> <span className="text-blue-600 capitalize">Organization</span></p>
                        <p><span className="font-medium text-blue-800">Authentication Status:</span> <span className="text-green-600">✓ Authenticated</span></p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Verify Tab */}
            {activeTab === 'verify' && (
              <div className="bg-white rounded-2xl shadow-lg border border-purple-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <h2 className="text-2xl font-bold text-gray-900">Identity Verification</h2>
                  <p className="text-gray-600 mt-1">Generate QR codes for employee verification</p>
                </div>
                <div className="p-0">
                  <Verify />
                </div>
              </div>
            )}

            {/* Employees Tab */}
            {activeTab === 'employees' && (
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-purple-100">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Employee Management</h2>
                  <button className="px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-colors">
                    Add Employee
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Name</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Email</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Wallet</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Verified Date</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {employees.map((employee) => (
                        <tr key={employee.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-4 px-4">{employee.name}</td>
                          <td className="py-4 px-4 text-gray-600">{employee.email}</td>
                          <td className="py-4 px-4 font-mono text-sm">{employee.walletAddress}</td>
                          <td className="py-4 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              employee.status === 'verified' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {employee.status}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-gray-600">{employee.verifiedAt || '-'}</td>
                          <td className="py-4 px-4">
                            <button className="text-purple-600 hover:text-purple-800 text-sm font-medium">
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-purple-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Organization Settings</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Organization Name</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                      placeholder="Your Organization Name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Contact Email</label>
                    <input
                      type="email"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                      placeholder="contact@yourorg.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Verification Requirements</label>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded text-purple-600" defaultChecked />
                        <span className="ml-2 text-sm text-gray-700">Require nationality verification</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded text-purple-600" />
                        <span className="ml-2 text-sm text-gray-700">Require age verification (18+)</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded text-purple-600" />
                        <span className="ml-2 text-sm text-gray-700">Require identity document</span>
                      </label>
                    </div>
                  </div>
                  
                  <button className="px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-colors">
                    Save Settings
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

export default OrganizationDashboard