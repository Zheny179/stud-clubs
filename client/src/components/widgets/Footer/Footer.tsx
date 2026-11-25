import styles from './Footer.module.scss'
import { Logo } from '@/components/ui/Logo'
import { Link } from 'react-router'

const COPYRIGHT = 'ГАПОУ «Кузбасский педагогический колледж» · Кемерово, 2026'
const VERSION = __APP_VERSION__

export interface FooterNavItem {
  title: string
  link: string
}

export interface FooterNavSection {
  title: string
  list: FooterNavItem[]
}

const NAV_LISTS: FooterNavSection[] = [
  {
    title: 'РАЗДЕЛЫ',
    list: [
      {
        title: 'Каталог объединений',
        link: '/catalog',
      },
      {
        title: 'О системе',
        link: '/about',
      },
    ],
  },
  {
    title: 'ДОКУМЕНТЫ',
    list: [
      {
        title: 'Согласие на обработку ПДн',
        link: '/privacy',
      },
      {
        title: 'Настройки интерфейса',
        link: '/settings',
      },
    ],
  },
  {
    title: 'КОНТАКТЫ',
    list: [
      {
        title: 'ovk@kuzpk.ru',
        link: 'mailto:ovk@kuzpk.ru',
      },
      {
        title: '+7 3842 55-01-01',
        link: 'tel:+73842550101',
      },
      {
        title: 'Отдел воспитательной работы',
        link: '/contacts',
      },
    ],
  },
]

/**
 * Компонент Footer
 */
function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.footer__main}>
          <div className={styles.footer__brand}>
            <Logo
              isText
              positionText="bottom"
            />
            <p className={styles.footer__desc}>
              Информационная система электронного каталога и администрирования
              студенческих объединений по интересам.
            </p>
          </div>
          <nav className={styles.footer__nav}>
            {NAV_LISTS.map((section) => (
              <div
                key={section.title}
                className={styles.footer__column}
              >
                <h2 className={styles.footer__title}>{section.title}</h2>
                <ul className={styles.footer__list}>
                  {section.list.map((item) => {
                    const isExternal =
                      item.link.startsWith('mailto:') ||
                      item.link.startsWith('tel:') ||
                      item.link.startsWith('http')

                    return (
                      <li
                        key={item.title}
                        className={styles.footer__item}
                      >
                        {isExternal ? (
                          <a
                            className={styles.footer__link}
                            href={item.link}
                          >
                            {item.title}
                          </a>
                        ) : (
                          <Link
                            className={styles.footer__link}
                            to={item.link}
                          >
                            {item.title}
                          </Link>
                        )}
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}
          </nav>
        </div>
        <div className={styles.footer__bottom}>
          <p className={styles.footer__copyright}>{COPYRIGHT}</p>
          <p className={styles.footer__version}>Сборка {VERSION}</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
