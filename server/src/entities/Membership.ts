import { Entity } from './shared/Entity.js'
import { randomUUID } from 'node:crypto'

type MembershipStatus =
  | 'Active'
  | 'Probation'
  | 'Inactive'
  | 'Excluded'
  | 'LeftVoluntarily'
  | 'Graduated'
  | 'Expelled'

type ClubRole = 'Head' | 'Deputy' | 'Core' | 'Member' | 'Candidate'
type MembershipSource = 'ApprovedApplication' | 'Manual'

interface MembershipProps {
  id: string,
  version: number,

  studentId: string,
  clubId: string,

  clubRole: ClubRole,
  status: MembershipStatus,
  /** @description Откуда появилось участие */
  source: MembershipSource,
  /** @description Заявка, одобрением которой создано участие */
  applicationId?: string,

  /** @description Дата вступления */
  joinedAt: Date,
  /** @description Дата выбытия */
  leftAt?: Date,
  /** @description Причина принудительного выбытия */
  leaveReason?: string,
}

interface CreateMembershipProps {
  studentId: string,
  clubId: string,

  clubRole: ClubRole,
  status: MembershipStatus,
  source: MembershipSource,
  applicationId?: string,

  joinedAt: Date,
  leftAt?: Date,
  leaveReason?: string,
}

/** @description Entity */
export class Membership extends Entity<MembershipProps> {
  private constructor(membershipProps: MembershipProps) {
    super(membershipProps)

    this.checkEnums()
    this.checkApplicationId()
    this.checkLeftAt()
    this.checkLeaveReason()
  }

  // === Фабрики ===
  /**
   * заглушка
   * @param props заглушка
   */
  public static createMembershipEntity(props: CreateMembershipProps): Membership {
    return new Membership({
      ...props,
      id: randomUUID(),
      version: 1,
    })
  }

  /**
   * заглушка
   * @param props заглушка
   */
  public static restore(props: MembershipProps): Membership {
    return new Membership(props)
  }

  // === Геттеры ===
  get version(): number { return this.props.version }
  get studentId(): string { return this.props.studentId }
  get clubId(): string { return this.props.clubId }
  get clubRole(): ClubRole { return this.props.clubRole }
  get status(): MembershipStatus { return this.props.status }
  get source(): MembershipSource { return this.props.source }
  get applicationId(): string | undefined { return this.props.applicationId }
  get joinedAt(): Date { return this.props.joinedAt }
  get leftAt(): Date | undefined { return this.props.leftAt }
  get leaveReason(): string | undefined { return this.props.leaveReason }

  // === checkFunctions ===
  private checkEnums = (): void => {
    const statuses: MembershipStatus[] = [
      'Active', 'Probation', 'Inactive',
      'Excluded', 'LeftVoluntarily', 'Graduated', 'Expelled',
    ]
    const roles: ClubRole[] = ['Head', 'Deputy', 'Core', 'Member', 'Candidate']
    const sources: MembershipSource[] = ['ApprovedApplication', 'Manual']

    if (!statuses.includes(this.status)) {
      throw new Error('incorrect status Membership')
    }

    if (!roles.includes(this.clubRole)) {
      throw new Error('incorrect clubRole Membership')
    }

    if (!sources.includes(this.source)) {
      throw new Error('incorrect source Membership')
    }
  }

  private checkApplicationId = (): void => {
    const fromApplication = this.source === 'ApprovedApplication'

    if (this.applicationId === undefined && !fromApplication) { return }

    if (this.applicationId === undefined) {
      throw new Error('incorrect applicationId Membership')
    }

    if (!fromApplication) {
      throw new Error('incorrect applicationId Membership')
    }
  }

  private checkLeftAt = (): void => {
    const isLeft =
      this.status === 'Excluded' ||
      this.status === 'LeftVoluntarily' ||
      this.status === 'Graduated' ||
      this.status === 'Expelled'

    if (this.leftAt === undefined && !isLeft) { return }

    if (this.leftAt === undefined) {
      throw new Error('incorrect leftAt Membership')
    }

    if (!isLeft) {
      throw new Error('incorrect leftAt Membership')
    }

    if (!(this.leftAt >= this.joinedAt)) {
      throw new Error('incorrect leftAt Membership')
    }
  }

  private checkLeaveReason = (): void => {
    const isForced =
      this.status === 'Excluded' || this.status === 'Expelled'

    if (isForced && this.leaveReason === undefined) {
      throw new Error('incorrect leaveReason Membership')
    }

    if (
      this.leaveReason !== undefined &&
      this.leaveReason.trim().length === 0
    ) {
      throw new Error('incorrect leaveReason Membership')
    }
  }
}