import { Entity } from './shared/Entity.js'
import { randomUUID } from 'node:crypto'

interface CategoryProps {
  id: string,
  version: number,

  /** @description Наименование направленности */
  name: string,
  /** @description Символьный адрес страницы категории */
  slug: string,
  description?: string,

  /** @description Дизайн-токен цвета для светлой темы */
  colorLight: string,
  /** @description Дизайн-токен цвета для тёмной темы */
  colorDark: string,

  /** @description Порядок отображения в навигации */
  sortOrder: number,
  /** @description Архивная направленность не предлагается при создании клуба */
  isArchived: boolean,
}

interface CreateCategoryProps {
  name: string,
  slug: string,
  description?: string,

  colorLight: string,
  colorDark: string,

  sortOrder: number,
  isArchived: boolean,
}

/** @description Entity */
export class Category extends Entity<CategoryProps> {
  private constructor(categoryProps: CategoryProps) {
    super(categoryProps)

    this.checkName()
    this.checkSlug()
    this.checkDescription()
    this.checkColors()
    this.checkSortOrder()
  }

  // === Фабрики ===
  /**
   * заглушка
   * @param props заглушка
   */
  public static createCategoryEntity(props: CreateCategoryProps): Category {
    return new Category({
      ...props,
      id: randomUUID(),
      version: 1,
    })
  }

  /**
   * заглушка
   * @param props заглушка
   */
  public static restore(props: CategoryProps): Category {
    return new Category(props)
  }

  // === Геттеры ===
  get version(): number { return this.props.version }
  get name(): string { return this.props.name }
  get slug(): string { return this.props.slug }
  get description(): string | undefined { return this.props.description }
  get colorLight(): string { return this.props.colorLight }
  get colorDark(): string { return this.props.colorDark }
  get sortOrder(): number { return this.props.sortOrder }
  get isArchived(): boolean { return this.props.isArchived }

  // === checkFunctions ===
  private checkName = (): void => {
    if (!(
      this.name.trim().length >= 2 &&
      this.name.trim().length <= 80
    )) {
      throw new Error('incorrect name Category')
    }
  }

  private checkSlug = (): void => {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(this.slug)) {
      throw new Error('incorrect slug Category')
    }
  }

  private checkDescription = (): void => {
    if (this.description === undefined) { return }

    if (!(this.description.trim().length <= 500)) {
      throw new Error('incorrect description Category')
    }
  }

  private checkColors = (): void => {
    const token = /^--[a-z0-9]+(?:-[a-z0-9]+)*$/

    if (!token.test(this.colorLight)) {
      throw new Error('incorrect colorLight Category')
    }

    if (!token.test(this.colorDark)) {
      throw new Error('incorrect colorDark Category')
    }
  }

  private checkSortOrder = (): void => {
    if (
      !Number.isInteger(this.sortOrder) ||
      !(this.sortOrder >= 0)
    ) {
      throw new Error('incorrect sortOrder Category')
    }
  }
}