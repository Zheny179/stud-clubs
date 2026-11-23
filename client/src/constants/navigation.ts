export interface NavItem {
  label: string
  to: string
}

export const MAIN_NAV_ITEMS: NavItem[] = [
  { label: 'Каталог', to: '/catalog' },
  { label: 'О системе', to: '/about' },
]

export const MOBILE_NAV_ITEMS: NavItem[] = [
  { label: 'Главная', to: '/' },
  ...MAIN_NAV_ITEMS,
  { label: 'Войти', to: '/sign' },
]
