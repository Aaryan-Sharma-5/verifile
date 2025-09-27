import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import WorkHistoryWelcome from './page/Home'
import Auth from './page/RegisterChoice'
import Organization from './page/Organization'
import Employee from './page/Employee'
import VerifyDocuments from './page/VerifyDocuments'
import ProtectedRoute from './utils/ProtectedRoute'
import RegisterChoice from './page/RegisterChoice'


const App = () => {

  const router = createBrowserRouter([
    {
      "path": "/",
      "element": <WorkHistoryWelcome />
    },
    {
      "path": "/register-choice",
      "element": <RegisterChoice />
    },
    {
      "path": "/",
      "element": <ProtectedRoute />,
      "children": [
        {
          "path": "organization",
          "element": <Organization />,
        },
        {
          "path": "employee",
          "element": <Employee />,
        },
        {
          "path": "verify-documents",
          "element": <VerifyDocuments />,
        }
      ]
    }
  ])

  return (
    <RouterProvider router={router} />
  )
}

export default App