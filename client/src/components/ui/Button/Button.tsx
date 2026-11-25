import styles from './Button.module.scss'
import clsx from 'clsx'
import type { MouseEvent, ReactElement, SVGProps } from 'react'
import { Link } from 'react-router'
import { Icon } from '../Icon'

interface ButtonProps {
  className?: string | undefined
  type?: 'button' | 'submit' | 'reset' | undefined
  href?: string | undefined
  label?: string | undefined
  isDisabled?: boolean | undefined
  mode?: '' | 'icon' | 'icon-filled' | 'primary' | 'burger-menu' | undefined
  icon?: ReactElement<SVGProps<SVGSVGElement>> | undefined
  iconPosition?: 'before' | 'after' | undefined
  target?: string | undefined
  isLabelHidden?: boolean | undefined
  onClick?: (event: MouseEvent<HTMLElement>) => void | undefined
  to?: string | undefined
}

/**
 * Универсальный компонент кнопки.
 * В зависимости от переданных пропсов рендерит стандартный `<button>`,
 * внешнюю ссылку `<a>` (при наличии `href`) или роутер-ссылку `<Link>` (при наличии `to`).
 * @param {ButtonProps} props - Параметры компонента.
 * @param {string} [props.className] - Дополнительный CSS-класс для стилизации.
 * @param {'button' | 'submit' | 'reset'} [props.type] - HTML-атрибут type (актуально только для `<button>`).
 * @param {string} [props.href] - URL для внешней ссылки (превращает кнопку в тег `<a>`).
 * @param {string} [props.to] - Маршрут для внутренней навигации (превращает кнопку в `<Link>` из react-router).
 * @param {string} [props.label] - Текст кнопки (также используется для `aria-label` и `title`, если текст скрыт).
 * @param {boolean} [props.isDisabled] - Блокирует кнопку или ссылку.
 * @param {'' | 'icon' | 'icon-filled' | 'primary' | 'burger-menu'} [props.mode] - Вариант визуального оформления.
 * @param {ReactNode} [props.icon] - Элемент иконки.
 * @param {'before' | 'after'} [props.iconPosition] - Расположение иконки относительно текста.
 * @param {string} [props.target] - HTML-атрибут target для ссылки (например, `'_blank'`).
 * @param {boolean} [props.isLabelHidden] - Визуально скрывает текст, оставляя его доступным для скринридеров.
 * @param {(event: MouseEvent<HTMLElement>) => void} [props.onClick] - Обработчик события клика.
 * @example
 * <Button label="Отправить" mode="primary" onClick={handleSubmit} />
 * <Button to="/profile" label="Профиль" icon={<UserIcon />} />
 */
function Button(props: ButtonProps) {
  const {
    className,
    type = 'button',
    href,
    label,
    isDisabled = false,
    mode = 'primary',
    icon,
    iconPosition = 'before',
    target,
    isLabelHidden = false,
    onClick,
    to,
  } = props

  const title = isLabelHidden ? label : undefined

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    if (isDisabled) {
      event.preventDefault()
      return
    }
    onClick?.(event)
  }

  const commonProps = {
    className: clsx(
      styles.button,
      className,
      mode && styles[`button--${mode}`],
      isDisabled && styles['is-disabled']
    ),
    title,
    'aria-label': isLabelHidden ? label : undefined,
    onClick: handleClick,
  }

  const iconElement = icon && (
    <Icon className={styles.button__icon}>{icon}</Icon>
  )

  const content = (
    <>
      {iconPosition === 'before' && iconElement}
      {!isLabelHidden && label && (
        <span className={styles.button__label}>{label}</span>
      )}
      {iconPosition === 'after' && iconElement}
    </>
  )

  if (to !== undefined) {
    return (
      <Link
        {...commonProps}
        to={isDisabled ? '#' : to}
        aria-disabled={isDisabled || undefined}
        tabIndex={isDisabled ? -1 : undefined}
      >
        {content}
      </Link>
    )
  }

  if (href !== undefined) {
    return (
      <a
        {...commonProps}
        href={isDisabled ? undefined : href}
        target={target}
        rel={target === '_blank' ? 'noopener noreferrer' : undefined}
        aria-disabled={isDisabled || undefined}
        tabIndex={isDisabled ? -1 : undefined}
      >
        {content}
      </a>
    )
  }

  return (
    <button
      {...commonProps}
      type={type}
      disabled={isDisabled}
    >
      {content}
    </button>
  )
}

export default Button
