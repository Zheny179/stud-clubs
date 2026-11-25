import { Footer } from '@/components/widgets/Footer'
import './MainLayout.scss'
import { Header } from '@/components/widgets/Header'
import { Outlet } from 'react-router'

/**
 * Основной каркас страницы с шапкой
 */
function MainLayout() {
  return (
    <div className="layout">
      <a
        className="visually-hidden"
        href="#main-content"
      >
        Перейти к содержимому
      </a>
      <Header />
      <main
        className="layout__content"
        id="main-content"
        tabIndex={-1}
      >
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default MainLayout
