import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import WorkHistoryWelcome from './page/Home'
import Auth from './page/Auth'
import Organization from './page/Organization'
import Employee from './page/Employee'
import path from 'path'
import VerifyDocuments from './page/VerifyDocuments'
import ProtectedRoute from './utils/ProtectedRoute'


const App = () => {

  const router = createBrowserRouter([
    {
      "path": "/",
      "element": <WorkHistoryWelcome />
    },
    {
      "path": "/self",
      "element": <Auth />
    },
    {
      "path": "/organization",
      "element": <ProtectedRoute element={<Organization />} actor='org' />,
    },
    {
      "path": "/employee",
      "element": <ProtectedRoute element={<Employee />} actor='employee' />,
    },
    {
      "path": "/verify-documents",
      "element": <ProtectedRoute element={<VerifyDocuments />} actor='employee' />,
    }
  ])

  return (
    <RouterProvider router={router} />
  )
}

export default App