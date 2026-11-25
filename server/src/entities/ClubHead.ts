import { Entity } from './shared/Entity.js'
import { randomUUID } from 'crypto'

/** @description Тип назначаемого лица: Обучающийся | Сотрудник */
type AssigneeType = 'Student' | 'Employee'

interface ClubHeadProps {
  id: string
  version: number

  /** @description Ссылка на объединение (клуб) */
  clubId: string

  /** @description Тип назначаемого лица */
  assigneeType: AssigneeType
  /** @description Ссылка на запись обучающегося или сотрудника согласно типу */
  assigneeId: string

  /** @description Момент наделения полномочиями */
  assignedAt: Date
  /** @description Ссылка на администратора, принявшего решение */
  assignedById: string

  /** @description Момент прекращения полномочий (заполняется при прекращении или заранее на срок) */
  terminationDate?: Date
  /** @description Основание прекращения: смена руководителя, увольнение, расформирование клуба, иное */
  terminationReason?: string
}

interface CreateClubHeadProps {
  clubId: string

  assigneeType: AssigneeType
  assigneeId: string

  assignedAt?: Date
  assignedById: string

  terminationDate?: Date
  terminationReason?: string
}

/** @description Entity ClubHeadAssignment (Назначение руководителя клуба) */
export class ClubHead extends Entity<ClubHeadProps> {
  private constructor(clubHeadProps: ClubHeadProps) {
    super(clubHeadProps)

    this.checkVersion()

    this.checkClubId()
    this.checkAssigneeType()
    this.checkAssigneeId()
    this.checkAssignedById()

    this.checkAssignedAt()
    this.checkTermination()
    this.checkTerminationReason()
  }

  // === Фабрики ===
  /**
   * Создание нового назначения руководителя клуба
   * @param props Данные для создания назначения
   */
  public static createNewAssignment(props: CreateClubHeadProps): ClubHead {
    return new ClubHead({
      ...props,
      id: randomUUID(),
      version: 1,
      assignedAt: props.assignedAt ?? new Date(),
    })
  }

  /**
   * Восстановление сущности назначения из хранилища
   * @param props Полный набор свойств сущности
   */
  public static restore(props: ClubHeadProps): ClubHead {
    return new ClubHead(props)
  }

  // === Геттеры и сеттеры ===
  private get version(): number {
    return this.props.version
  }

  private get clubId(): string {
    return this.props.clubId
  }

  private get assigneeType(): AssigneeType {
    return this.props.assigneeType
  }
  private get assigneeId(): string {
    return this.props.assigneeId
  }

  private get assignedAt(): Date {
    return this.props.assignedAt
  }
  private get assignedById(): string {
    return this.props.assignedById
  }

  private get terminationDate(): Date | undefined {
    return this.props.terminationDate
  }
  private get terminationReason(): string | undefined {
    return this.props.terminationReason
  }

  // === checkFunctions ===
  private checkVersion = (): void => {
    if (!(Number.isInteger(this.version) && this.version >= 1)) {
      throw new Error('incorrect version ClubHead')
    }
  }

  private checkClubId = (): void => {
    if (!(this.clubId.trim().length > 0)) {
      throw new Error('incorrect clubId ClubHead')
    }
  }

  private checkAssigneeType = (): void => {
    switch (this.assigneeType) {
      case 'Student':
      case 'Employee':
        return
      default: {
        const check: never = this.assigneeType
        throw new Error(`incorrect field value assigneeType: ${check} ClubHead`)
      }
    }
  }

  private checkAssigneeId = (): void => {
    if (!(this.assigneeId.trim().length > 0)) {
      throw new Error('incorrect assigneeId ClubHead')
    }
  }

  private checkAssignedById = (): void => {
    if (!(this.assignedById.trim().length > 0)) {
      throw new Error('incorrect assignedById ClubHead')
    }
  }

  private checkAssignedAt = (): void => {
    if (Number.isNaN(this.assignedAt.getTime())) {
      throw new Error('incorrect assignedAt ClubHead')
    }
  }

  private checkTermination = (): void => {
    const hasDate = this.terminationDate !== undefined
    const hasReason = this.terminationReason !== undefined

    if (hasDate !== hasReason) {
      throw new Error('incorrect terminationDate or terminationReason ClubHead')
    }

    if (this.terminationDate !== undefined) {
      if (Number.isNaN(this.terminationDate.getTime())) {
        throw new Error('incorrect terminationDate ClubHead')
      }

      const diff: number =
        this.terminationDate.getTime() - this.assignedAt.getTime()
      if (!(diff >= 0)) {
        throw new Error('incorrect terminationDate or assignedAt ClubHead')
      }
    }
  }

  private checkTerminationReason = (): void => {
    if (this.terminationReason === undefined) {
      return
    }

    if (
      !(
        this.terminationReason.trim().length >= 3 &&
        this.terminationReason.length <= 500
      )
    ) {
      throw new Error('incorrect terminationReason ClubHead')
    }
  }
}
