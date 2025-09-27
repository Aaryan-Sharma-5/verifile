import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { WalletProvider, useWallet, withAuth } from './contexts/WalletContext'
import Dashboard from './components/Dashboard'
import OrganizationDashboard from './components/OrganizationDashboard'
import EmployeeDashboard from './components/EmployeeDashboard'
import Verify from './components/Verify'

// Protected route components
const ProtectedOrganizationDashboard = withAuth(OrganizationDashboard, 'organization')
const ProtectedEmployeeDashboard = withAuth(EmployeeDashboard, 'employee')

// Route guard component for authenticated users
const AuthenticatedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { status, userType } = useWallet()
  
  if (status !== 'authenticated' || !userType) {
    return <Navigate to="/" replace />
  }
  
  return <>{children}</>
}

// Main App Router
const AppRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Main dashboard/landing page */}
        <Route path="/" element={<Dashboard />} />
        
        {/* Organization routes */}
        <Route 
          path="/organization" 
          element={
            <AuthenticatedRoute>
              <ProtectedOrganizationDashboard />
            </AuthenticatedRoute>
          } 
        />
        
        {/* Employee routes */}
        <Route 
          path="/employee" 
          element={
            <AuthenticatedRoute>
              <ProtectedEmployeeDashboard />
            </AuthenticatedRoute>
          } 
        />
        
        {/* Verification route - accessible to authenticated users */}
        <Route 
          path="/verify" 
          element={
            <AuthenticatedRoute>
              <Verify />
            </AuthenticatedRoute>
          } 
        />
        
        {/* Catch-all route - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

function App() {
  return (
    <WalletProvider>
      <AppRouter />
    </WalletProvider>
  )
}

export default App
