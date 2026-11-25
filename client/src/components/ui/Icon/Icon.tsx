import styles from './Icon.module.scss'
import clsx from 'clsx'
import type { ReactElement, SVGProps } from 'react'

interface IconProps {
  className?: string | undefined
  children: ReactElement<SVGProps<SVGSVGElement>>
  isAriaHidden?: boolean | undefined
}

/**
 * Универсальная обертка для SVG-иконок.
 * Адаптирует размер вложенной иконки через `font-size` (относительные единицы `1em`).
 * @param {IconProps} props - Свойства компонента.
 * @param {ReactElement} props.children - SVG-элемент иконки.
 * @param {string} [props.className] - Дополнительный CSS-класс.
 * @param {boolean} [props.isAriaHidden] - Скрывает иконку от скринридеров
 * @example
 * <Icon className={styles.themeIcon} isAriaHidden>
 *   <Sun />
 * </Icon>
 */
function Icon(props: IconProps) {
  const { className, children, isAriaHidden = true } = props

  return (
    <span
      className={clsx(styles.icon, className)}
      aria-hidden={isAriaHidden}
    >
      {children}
    </span>
  )
}

export default Icon
