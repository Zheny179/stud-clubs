import styles from './Header.module.scss'
import { Button } from '@/components/ui/Button'
import { Logo } from '@/components/ui/Logo'
import { Navigation } from '@/components/ui/Navigation'
import { MOBILE_NAV_ITEMS } from '@/constants/navigation'
import { Search, Sun, Menu, X } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router'

/**
 * Шапка сайта: логотип, навигация, поиск, переключатель темы
 */
function Header() {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const { pathname } = useLocation()

  const openMenu = () => {
    dialogRef.current?.showModal()
    document.documentElement.classList.add('is-lock')
  }
  const closeMenu = () => {
    dialogRef.current?.close()
    document.documentElement.classList.remove('is-lock')
  }

  useEffect(() => {
    closeMenu()
  }, [pathname])

  useEffect(() => {
    return () => {
      document.documentElement.classList.remove('is-lock')
    }
  }, [])

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) {
      closeMenu()
    }
  }

  return (
    <header className={styles.header}>
      <div className={styles.header__left}>
        <Logo />
        <Navigation className="hidden-mobile" />
      </div>
      <div className={styles.header__search}>
        <Search
          className={styles['header__search-icon']}
          size={18}
          aria-hidden="true"
        />
        <input
          className={styles['header__search-input']}
          type="search"
          name="search"
          aria-label="Поиск по клубам и событиям"
          placeholder="Поиск по клубам и событиям…"
        />
      </div>

      <div className={styles.header__actions}>
        <Button
          mode="icon"
          icon={<Sun size={24} />}
          label="Переключить тему"
          isLabelHidden
        />

        <Button
          to="/sign"
          className="hidden-mobile"
          label="Войти"
        />

        <Button
          mode="burger-menu"
          className="visible-mobile"
          icon={<Menu size={24} />}
          label="Открыть меню"
          isLabelHidden
          onClick={openMenu}
        />
      </div>

      <dialog
        id="overlay-menu"
        className={styles['overlay-menu']}
        ref={dialogRef}
        onClick={handleBackdropClick}
        onClose={closeMenu}
        aria-label="Основное меню"
      >
        <div className={styles['overlay-menu__inner']}>
          <div className={styles['overlay-menu__top']}>
            <Logo isText />
            <Button
              mode="burger-menu"
              type="button"
              icon={<X size={24} />}
              label="Закрыть меню"
              isLabelHidden
              onClick={closeMenu}
            />
          </div>
          <Navigation
            items={MOBILE_NAV_ITEMS}
            className={styles['overlay-menu__nav']}
            ariaLabel="Мобильная навигация"
            onLinkClick={closeMenu}
          />
        </div>
      </dialog>
    </header>
  )
}

export default Header
