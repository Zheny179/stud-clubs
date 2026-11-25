import { Entity } from './shared/Entity.js'
import { randomUUID } from 'node:crypto'

interface TagProps {
  id: string,
  version: number,

  /** @description Наименование тега */
  name: string,
  /** @description Нормализованный идентификатор для поиска дублей */
  slug: string,
}

interface CreateTagProps {
  name: string,
  slug: string,
}

/** @description Entity */
export class Tag extends Entity<TagProps> {
  private constructor(tagProps: TagProps) {
    super(tagProps)

    this.checkName()
    this.checkSlug()
  }

  // === Фабрики ===
  /**
   * заглушка
   * @param props заглушка
   */
  public static createTagEntity(props: CreateTagProps): Tag {
    return new Tag({
      ...props,
      id: randomUUID(),
      version: 1,
    })
  }

  /**
   * заглушка
   * @param props заглушка
   */
  public static restore(props: TagProps): Tag {
    return new Tag(props)
  }

  // === Геттеры ===
  private get version(): number { return this.props.version }
  private get name(): string { return this.props.name }
  private get slug(): string { return this.props.slug }

  // === checkFunctions ===
  // уникальность name и slug проверяет сценарий через репозиторий
  private checkName = (): void => {
    if (!(
      this.name.trim().length >= 1 &&
      this.name.trim().length <= 50
    )) {
      throw new Error('incorrect name Tag')
    }
  }

  private checkSlug = (): void => {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(this.slug)) {
      throw new Error('incorrect slug Tag')
    }
  }
}