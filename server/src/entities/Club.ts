import { Entity } from './shared/Entity.js'
import { randomUUID } from 'node:crypto'

// TODO: Пока что не реализованы типизированные ошибки, они будут потом
// TODO: Сделать документацию JSDoc

// TODO: Реализовать сущности
interface Contact {
  readonly id: number
}
interface ScheduleSlot {
  readonly id: number
}
interface MediaSlot {
  readonly id: number
}

// TODO: Выделить эти типы в общую папочку shared, когда она появится
type ActivityForm = 'Regular classes' | 'Project work' | 'One time events'
type State = 'Active' | 'Recruitment close' | 'Suspended' | 'Disbanded'

interface ClubProps {
  id: string
  slug: string
  version: number

  categoryId: string
  tagsId?: string[]

  name: string
  shortDescription: string
  fullDescription: string

  /** @description Действующий руководитель */
  clubHeadID: string

  /** @description Форма деятельности */
  activityForms: ActivityForm[]
  /** @description место проведения */
  place?: string
  /** @description Расписание */
  schedule?: ScheduleSlot[]
  state: State

  /** @description Дата основания */
  foundedAt: Date
  createdAt: Date
  lastVerified: Date

  /** @description Предельная численность */
  memberLimit: number | null
  minCourse?: number
  maxCourse?: number

  /** @description Наличие собеседования */
  interviewRequired: boolean
  /** @description Требования к опыту */
  experienceRequirement?: string

  contacts: Contact[]
  media?: MediaSlot[]
}

/** */
interface CreateClubProps {
  categoryId: string
  tagsId?: string[]

  name: string
  shortDescription: string
  fullDescription: string

  clubHeadID: string

  activityForms: ActivityForm[]
  place?: string
  schedule?: ScheduleSlot[]
  state: State

  foundedAt: Date

  memberLimit: number | null
  minCourse?: number
  maxCourse?: number

  interviewRequired: boolean

  experienceRequirement?: string

  contacts: Contact[]
  media?: MediaSlot[]
}

/** @description Entity club */
export class Club extends Entity<ClubProps> {
  private constructor(clubProps: ClubProps) {
    super(clubProps)

    this.checkVersion()

    this.checkName()
    this.checkShortDescription()
    this.checkFullDescription()

    this.checkActivityForms()
    this.checkSchedule()

    this.checkFoundedAt()
    this.checkDate()

    this.checkMemberLimit()
    this.checkMinCourse()
    this.checkCourseRequirement()

    this.checkExperienceRequirement()
    this.checkContacts()
  }
  // === Фабрики ===
  /**
   * заглушка
   * @param props заглушка
   */
  public static createNewClub(props: CreateClubProps): Club {
    const now = new Date()
    return new Club({
      ...props,
      id: randomUUID(),
      // TODO: Сделать полноченную логику работы и заменить заглушки
      slug: 'заглушка',
      version: 1,
      createdAt: now,
      lastVerified: now,
    })
  }

  /**
   * заглушка
   * @param props заглушка
   */
  public static restore(props: ClubProps): Club {
    return new Club(props)
  }
  // === Геттеры и сеттеры ===
  // TODO: Сделать проверки на все свойства
  private get slug(): string {
    return this.props.slug
  }
  private get version(): number {
    return this.props.version
  }

  private get categoryId(): string {
    return this.props.categoryId
  }
  private get tagsId(): string[] | undefined {
    return this.props.tagsId
  }

  private get name(): string {
    return this.props.name
  }
  private get shortDescription(): string {
    return this.props.shortDescription
  }
  private get fullDescription(): string {
    return this.props.fullDescription
  }

  private get clubHeadID(): string {
    return this.props.clubHeadID
  }

  private get activityForms(): ActivityForm[] {
    return this.props.activityForms
  }
  private get place(): string | undefined {
    return this.props.place
  }
  private get schedule(): ScheduleSlot[] | undefined {
    return this.props.schedule
  }
  private get state(): State {
    return this.props.state
  }

  private get foundedAt(): Date {
    return this.props.foundedAt
  }
  private get createdAt(): Date {
    return this.props.createdAt
  }
  private get lastVerified(): Date {
    return this.props.lastVerified
  }

  private get memberLimit(): number | null {
    return this.props.memberLimit
  }
  private get minCourse(): number | undefined {
    return this.props.minCourse
  }
  private get maxCourse(): number | undefined {
    return this.props.maxCourse
  }

  private get interviewRequired(): boolean {
    return this.props.interviewRequired
  }
  private get experienceRequirement(): string | undefined {
    return this.props.experienceRequirement
  }

  private get contacts(): Contact[] {
    return this.props.contacts
  }
  private get media(): MediaSlot[] | undefined {
    return this.props.media
  }

  // === checkFunctions ===
  private checkVersion = (): void => {
    if (!(this.version >= 1)) {
      throw new Error('incorrect version club')
    }
  }

  private checkName = (): void => {
    if (!(this.name.length >= 2 && this.name.length <= 100)) {
      throw new Error('incorrect name club')
    }
  }

  private checkShortDescription = (): void => {
    if (
      !(
        this.shortDescription.length >= 50 &&
        this.shortDescription.length <= 200
      )
    ) {
      throw new Error('incorrect shortDescription club')
    }
  }

  private checkFullDescription = (): void => {
    if (
      !(this.fullDescription.length > 0 && this.fullDescription.length <= 2500)
    ) {
      throw new Error('incorrect fullDescription club')
    }
  }

  private checkActivityForms = (): void => {
    if (this.activityForms.length === 0) {
      throw new Error('incorrect activityForms club')
    }
  }

  private checkSchedule = (): void => {
    if (this.schedule !== undefined) {
      if (!(this.schedule.length >= 1)) {
        throw new Error('incorrect schedule club')
      }
    }
    this.activityForms.forEach((el: ActivityForm): void => {
      if (el === 'Regular classes' && typeof this.schedule === 'undefined') {
        throw new Error('incorrect schedule club')
      }
    })
  }

  private checkFoundedAt = (): void => {
    const diff: number = this.createdAt.getTime() - this.foundedAt.getTime()
    if (!(diff >= 0)) {
      throw new Error('incorrect createdAt or foundedAt club')
    }
  }

  private checkDate = (): void => {
    const diff: number = this.lastVerified.getTime() - this.createdAt.getTime()
    if (!(diff >= 0)) {
      throw new Error('incorrect lastVerified or createdAt club')
    }
  }

  private checkMemberLimit = (): void => {
    if (this.memberLimit === null) {
      return
    }

    if (!Number.isInteger(this.memberLimit) || !(this.memberLimit >= 5)) {
      throw new Error('incorrect memberLimit club')
    }
  }

  private checkMinCourse = (): void => {
    if (typeof this.minCourse === 'number' && !(this.minCourse >= 1)) {
      throw new Error('incorrect minCourse club')
    }
  }

  private checkCourseRequirement = (): void => {
    if (
      typeof this.minCourse === 'number' &&
      typeof this.maxCourse === 'number' &&
      this.minCourse > this.maxCourse
    ) {
      throw new Error('incorrect course requirement club')
    }
  }

  private checkExperienceRequirement = (): void => {
    if (
      typeof this.experienceRequirement === 'string' &&
      !(this.experienceRequirement.length <= 2500)
    ) {
      throw new Error('incorrect experienceRequirement club')
    }
  }

  private checkContacts = (): void => {
    if (this.contacts.length === 0) {
      throw new Error('incorrect contacts club')
    }
  }
}
