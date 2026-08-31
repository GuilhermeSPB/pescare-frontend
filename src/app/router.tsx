import { createBrowserRouter, RouterProvider } from 'react-router'

import { HelloPage } from './routes/hello'

const router = createBrowserRouter([
  {
    path: '/',
    element: <HelloPage />,
  },
])

export function AppRouter() {
  return <RouterProvider router={router} />
}
