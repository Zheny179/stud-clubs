import styles from './Navigation.module.scss'
import clsx from 'clsx'
import { NavLink } from 'react-router'
import { MAIN_NAV_ITEMS, type NavItem } from '@/constants/navigation'

export type { NavItem }

interface NavigationProps {
  className?: string
  items?: NavItem[]
  ariaLabel?: string
  onLinkClick?: () => void
}

/**
 * Компонент навигации сайта.
 * @param {NavigationProps} props - Параметры компонента.
 * @param {string} [props.className] - Дополнительный CSS-класс для контейнера `<nav>`.
 * @param {NavItem[]} [props.items] - Список пунктов меню.
 * @param {string} [props.ariaLabel] - Метка доступности для тега `<nav>`.
 * @param {() => void} [props.onLinkClick] - Коллбэк при клике на любую из ссылок (например, для закрытия мобильного меню).
 */
function Navigation(props: NavigationProps) {
  const {
    className,
    items = MAIN_NAV_ITEMS,
    ariaLabel = 'Основная навигация',
    onLinkClick,
  } = props

  return (
    <nav
      className={clsx(styles.nav, className)}
      aria-label={ariaLabel}
    >
      <ul className={styles.nav__list}>
        {items.map((item) => (
          <li
            key={item.to}
            className={styles.nav__item}
          >
            <NavLink
              to={item.to}
              onClick={onLinkClick}
              className={({ isActive }) =>
                clsx(
                  styles.nav__link,
                  isActive && styles['nav__link--is-active']
                )
              }
            >
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default Navigation
