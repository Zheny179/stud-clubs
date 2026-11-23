import { Entity } from './shared/Entity.js'
import { randomUUID } from 'node:crypto'

/** @description запланировано | проведено | отменено */
type EventStatus = 'Planned' | 'Held' | 'Cancelled'

interface ClubEventProps {
  id: string,
  version: number,

  clubId: string,

  /** @description Наименование мероприятия */
  name: string,
  description?: string,
  /** @description Место проведения */
  place: string,
  /** @description Момент начала */
  startsAt: Date,
  /** @description Вместимость */
  capacity: number | null,

  status: EventStatus,
}

interface CreateClubEventProps {
  clubId: string,

  name: string,
  description?: string,
  place: string,
  startsAt: Date,
  capacity: number | null,

  status: EventStatus,
}

/** @description Entity */
export class ClubEvent extends Entity<ClubEventProps> {
  private constructor(clubEventProps: ClubEventProps) {
    super(clubEventProps)

    this.checkName()
    this.checkDescription()
    this.checkPlace()
    this.checkStartsAt()
    this.checkCapacity()
    this.checkStatus()
  }

  // === Фабрики ===
  /**
   * заглушка
   * @param props заглушка
   */
  public static createClubEventEntity(props: CreateClubEventProps): ClubEvent {
    return new ClubEvent({
      ...props,
      id: randomUUID(),
      version: 1,
    })
  }

  /**
   * заглушка
   * @param props заглушка
   */
  public static restore(props: ClubEventProps): ClubEvent {
    return new ClubEvent(props)
  }

  // === Геттеры ===
  get id(): string { return this.props.id }
  get version(): number { return this.props.version }
  get clubId(): string { return this.props.clubId }
  get name(): string { return this.props.name }
  get description(): string | undefined { return this.props.description }
  get place(): string { return this.props.place }
  get startsAt(): Date { return this.props.startsAt }
  get capacity(): number | null { return this.props.capacity }
  get status(): EventStatus { return this.props.status }

  // === checkFunctions ===
  private checkName = (): void => {
    if (!(
      this.name.trim().length >= 2 &&
      this.name.trim().length <= 120
    )) {
      throw new Error('incorrect name ClubEvent')
    }
  }

  private checkDescription = (): void => {
    if (this.description === undefined) { return }

    if (!(this.description.trim().length <= 2000)) {
      throw new Error('incorrect description ClubEvent')
    }
  }

  private checkPlace = (): void => {
    if (this.place.trim().length === 0) {
      throw new Error('incorrect place ClubEvent')
    }
  }

  private checkStartsAt = (): void => {
    if (Number.isNaN(this.startsAt.getTime())) {
      throw new Error('incorrect startsAt ClubEvent')
    }
  }

  private checkCapacity = (): void => {
    if (this.capacity === null) { return }

    if (
      !Number.isInteger(this.capacity) ||
      !(this.capacity >= 1)
    ) {
      throw new Error('incorrect capacity ClubEvent')
    }
  }

  private checkStatus = (): void => {
    const statuses: EventStatus[] = ['Planned', 'Held', 'Cancelled']

    if (!statuses.includes(this.status)) {
      throw new Error('incorrect status ClubEvent')
    }
  }
}