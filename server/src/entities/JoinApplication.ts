import { Entity } from './shared/Entity.js'
import { randomUUID } from 'node:crypto'

type ApplicationStatus =
  | 'Draft'
  | 'Pending'
  | 'Invited'
  | 'Approved'
  | 'Rejected'
  | 'Withdrawn'
  | 'Expired'

interface JoinApplicationProps {
  id: string
  version: number

  studentId: string
  clubId: string

  /** @description Мотивационное письмо */
  motivationText: string
  /** @description Предпочтительный слот расписания */
  preferredSlotId?: string
  /** @description Слот, на который пригласили заявителя */
  invitedSlotId?: string

  status: ApplicationStatus

  /** @description Отметка о согласии на обработку персональных данных */
  consentGiven: boolean
  /** @description Версия текста согласия */
  consentVersion: string

  /** @description Дата подачи */
  submittedAt?: Date
  /** @description Дата решения */
  decidedAt?: Date
  /** @description Инициатор решения */
  decidedBy?: string
  /** @description Причина отказа, не короче */
  rejectionReason?: string
}

interface CreateJoinApplicationProps {
  studentId: string
  clubId: string

  motivationText: string
  preferredSlotId?: string
  invitedSlotId?: string

  status: ApplicationStatus

  consentGiven: boolean
  consentVersion: string

  submittedAt?: Date
  decidedAt?: Date
  decidedBy?: string
  rejectionReason?: string
}

/** @description Entity */
export class JoinApplication extends Entity<JoinApplicationProps> {
  private constructor(joinApplicationProps: JoinApplicationProps) {
    super(joinApplicationProps)

    this.checkMotivationText()
    this.checkConsent()
    this.checkStatus()

    this.checkSubmittedAt()
    this.checkDecision()
    this.checkRejectionReason()
    this.checkInvitedSlot()
  }

  // === Фабрики ===
  /**
   * заглушка
   * @param props заглушка
   */
  public static createJoinApplicationEntity(
    props: CreateJoinApplicationProps
  ): JoinApplication {
    return new JoinApplication({
      ...props,
      id: randomUUID(),
      version: 1,
    })
  }

  /**
   * заглушка
   * @param props заглушка
   */
  public static restore(props: JoinApplicationProps): JoinApplication {
    return new JoinApplication(props)
  }

  // === Геттеры ===
  private get version(): number {
    return this.props.version
  }
  private get studentId(): string {
    return this.props.studentId
  }
  private get clubId(): string {
    return this.props.clubId
  }
  private get motivationText(): string {
    return this.props.motivationText
  }
  private get preferredSlotId(): string | undefined {
    return this.props.preferredSlotId
  }
  private get invitedSlotId(): string | undefined {
    return this.props.invitedSlotId
  }
  private get status(): ApplicationStatus {
    return this.props.status
  }
  private get consentGiven(): boolean {
    return this.props.consentGiven
  }
  private get consentVersion(): string {
    return this.props.consentVersion
  }
  private get submittedAt(): Date | undefined {
    return this.props.submittedAt
  }
  private get decidedAt(): Date | undefined {
    return this.props.decidedAt
  }
  private get decidedBy(): string | undefined {
    return this.props.decidedBy
  }
  private get rejectionReason(): string | undefined {
    return this.props.rejectionReason
  }

  // === checkFunctions ===
  private checkMotivationText = (): void => {
    if (
      !(
        this.motivationText.trim().length >= 50 &&
        this.motivationText.trim().length <= 1000
      )
    ) {
      throw new Error('incorrect motivationText JoinApplication')
    }
  }

  private checkConsent = (): void => {
    if (!this.consentGiven) {
      throw new Error('incorrect consentGiven JoinApplication')
    }

    if (this.consentVersion.trim().length === 0) {
      throw new Error('incorrect consentVersion JoinApplication')
    }
  }

  private checkStatus = (): void => {
    const statuses: ApplicationStatus[] = [
      'Draft',
      'Pending',
      'Invited',
      'Approved',
      'Rejected',
      'Withdrawn',
      'Expired',
    ]

    if (!statuses.includes(this.status)) {
      throw new Error('incorrect status JoinApplication')
    }
  }

  private checkSubmittedAt = (): void => {
    if (this.submittedAt === undefined && this.status === 'Draft') {
      return
    }

    if (this.submittedAt === undefined) {
      throw new Error('incorrect submittedAt JoinApplication')
    }

    if (this.status === 'Draft') {
      throw new Error('incorrect submittedAt JoinApplication')
    }
  }

  private checkDecision = (): void => {
    const isDecided =
      this.status === 'Approved' ||
      this.status === 'Rejected' ||
      this.status === 'Withdrawn' ||
      this.status === 'Expired'

    if (this.decidedAt === undefined && !isDecided) {
      return
    }

    if (this.decidedAt === undefined) {
      throw new Error('incorrect decidedAt JoinApplication')
    }

    if (!isDecided) {
      throw new Error('incorrect decidedAt JoinApplication')
    }

    if (this.decidedBy === undefined) {
      throw new Error('incorrect decidedBy JoinApplication')
    }
  }

  private checkRejectionReason = (): void => {
    if (this.rejectionReason === undefined && this.status !== 'Rejected') {
      return
    }

    if (this.rejectionReason === undefined) {
      throw new Error('incorrect rejectionReason JoinApplication')
    }

    if (this.status !== 'Rejected') {
      throw new Error('incorrect rejectionReason JoinApplication')
    }

    if (!(this.rejectionReason.trim().length >= 10)) {
      throw new Error('incorrect rejectionReason JoinApplication')
    }
  }

  private checkInvitedSlot = (): void => {
    if (this.status === 'Invited' && this.invitedSlotId === undefined) {
      throw new Error('incorrect invitedSlotId JoinApplication')
    }
  }
}
