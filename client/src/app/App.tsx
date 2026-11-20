import { MainLayout } from '@/components/layouts/MainLayout'
import { HomePage } from '@/components/pages/HomePage'
import { createBrowserRouter, RouterProvider } from 'react-router'

const router = createBrowserRouter(
  [
    {
      element: <MainLayout />,
      children: [
        {
          index: true,
          element: <HomePage />,
        },
        {
          path: '*',
          element: <h1>Страница не найдена (404)</h1>,
        },
      ],
    },
  ],
  {
    basename: import.meta.env.BASE_URL,
  }
)

/**
 * Корневой компонент приложения с провайдером маршрутизации
 */
function App() {
  return <RouterProvider router={router} />
}

export default App
