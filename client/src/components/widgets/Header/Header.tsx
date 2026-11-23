import styles from './Header.module.scss'
import { Button } from '@/components/ui/Button'
import { Logo } from '@/components/ui/Logo'
import { Navigation } from '@/components/ui/Navigation'
import { MOBILE_NAV_ITEMS } from '@/constants/navigation'
import clsx from 'clsx'
import { Search, Sun, Menu, X } from 'lucide-react'
import {
  useEffect,
  useRef,
  useState,
  type SyntheticEvent,
  type TransitionEvent,
} from 'react'
import { useLocation } from 'react-router'

/**
 * Шапка сайта: логотип, навигация, поиск, переключатель темы
 */
function Header() {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [isOpen, setIsOpen] = useState(false)
  const { pathname } = useLocation()
  const openRafRef = useRef<number | null>(null)

  const openMenu = () => {
    const dialogElement = dialogRef.current
    if (!dialogElement || dialogElement.open) {
      return
    }

    dialogElement.showModal()
    document.documentElement.classList.add('is-lock')
    dialogElement.focus()

    openRafRef.current = requestAnimationFrame(() => {
      setIsOpen(true)
    })
  }

  const closeMenu = () => {
    if (openRafRef.current !== null) {
      cancelAnimationFrame(openRafRef.current)
      openRafRef.current = null
    }

    setIsOpen(false)
    document.documentElement.classList.remove('is-lock')
  }

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 768px)')

    const handleViewportChange = (e: MediaQueryListEvent) => {
      if (e.matches && isOpen) {
        closeMenu()
        dialogRef.current?.close()
      }
    }

    mediaQuery.addEventListener('change', handleViewportChange)
    return () => mediaQuery.removeEventListener('change', handleViewportChange)
  }, [isOpen])

  useEffect(() => {
    if (isOpen) {
      return
    }

    const el = dialogRef.current

    if (!el?.open) {
      return
    }

    const id = window.setTimeout(() => el.close(), 600) // чуть больше, чем duration
    return () => {
      window.clearTimeout(id)
    }
  }, [isOpen])

  const handleTransitionEnd = (e: TransitionEvent<HTMLDialogElement>) => {
    if (
      e.target === dialogRef.current &&
      e.propertyName === 'translate' &&
      !isOpen
    ) {
      dialogRef.current?.close()
    }
  }

  const handleCancel = (e: SyntheticEvent<HTMLDialogElement>) => {
    e.preventDefault()
    closeMenu()
  }

  useEffect(() => {
    closeMenu()
  }, [pathname])

  useEffect(() => {
    return () => {
      if (openRafRef.current !== null) {
        cancelAnimationFrame(openRafRef.current)
      }

      document.documentElement.classList.remove('is-lock')
    }
  }, [])

  return (
    <header className={styles.header}>
      <div className={styles.header__left}>
        <Logo />
        <Navigation className="hidden-mobile" />
      </div>
      <form
        role="search"
        className={styles.header__search}
      >
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
      </form>
      <div className={styles.header__actions}>
        <Button
          mode="icon"
          icon={<Sun size={24} />}
          label="Переключить тему"
          isLabelHidden
        />

        <Button
          to="/login"
          className={clsx(styles['header__actions-login'], 'hidden-mobile')}
          label="Войти"
        />

        <Button
          mode="burger-menu"
          className="visible-mobile"
          icon={<Menu size={24} />}
          label="Открыть меню"
          aria-controls="overlay-menu"
          aria-haspopup="dialog"
          isLabelHidden
          onClick={openMenu}
        />
      </div>

      <dialog
        id="overlay-menu"
        className={`${styles['overlay-menu']} ${isOpen ? styles['is-open'] : ''}`}
        ref={dialogRef}
        onCancel={handleCancel}
        onTransitionEnd={handleTransitionEnd}
        aria-label="Основное меню"
      >
        <div className={styles['overlay-menu__inner']}>
          <div className={styles['overlay-menu__top']}>
            <Logo
              isText
              onClick={closeMenu}
            />
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
