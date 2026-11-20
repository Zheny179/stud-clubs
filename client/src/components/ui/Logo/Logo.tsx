import styles from './Logo.module.scss'
import LogoIcon from '@/assets/icons/logo.svg?react'
import { clsx } from 'clsx'
import { Link } from 'react-router'

interface LogoProps {
  className?: string
  isText?: boolean
  positionText?: 'right' | 'bottom'
}

/**
 * Логотип с переходом на главную страницу.
 * @param {LogoProps} props - Параметры компонента.
 * @param {string} [props.className] - Дополнительный CSS-класс для стилизации.
 * @param {boolean} [props.isText] - Показывать ли текстовое название рядом с иконкой.
 * @param {'right' | 'bottom'} [props.positionText] - Расположение текста относительно иконки.
 */
function Logo(props: LogoProps) {
  const { className, isText = false, positionText = 'right' } = props

  return (
    <Link
      className={clsx(
        styles.logo,
        isText && styles[`logo--text-${positionText}`],
        className
      )}
      to="/"
      aria-label="StudClubs — на главную"
    >
      <LogoIcon
        className={styles.logo__img}
        width={48}
        height={48}
      />
      {isText && <span className={styles.logo__text}>StudClubs</span>}
    </Link>
  )
}

export default Logo
