import { Entity } from './shared/Entity.js'
import { randomUUID } from 'node:crypto'

interface AdminAssignmentProps {
  id: string,
  version: number,

  employeeId: string,

  /** @description Дата назначения */
  appointedAt: Date,
  /** @description Дата прекращения полномочий */
  revokedAt?: Date,
  /** @description Основание прекращения */
  revokeReason?: string,
}

interface CreateAdminAssignmentProps {
  employeeId: string,

  appointedAt: Date,
  revokedAt?: Date,
  revokeReason?: string,
}

/** @description Entity */
export class AdminAssignment extends Entity<AdminAssignmentProps> {
  private constructor(adminAssignmentProps: AdminAssignmentProps) {
    super(adminAssignmentProps)

    this.checkAppointedAt()
    this.checkRevokedAt()
    this.checkRevokeReason()
  }

  // === Фабрики ===
  /**
   * заглушка
   * @param props заглушка
   */
  public static createAdminAssignmentEntity(
    props: CreateAdminAssignmentProps,
  ): AdminAssignment {
    return new AdminAssignment({
      ...props,
      id: randomUUID(),
      version: 1,
    })
  }

  /**
   * заглушка
   * @param props заглушка
   */
  public static restore(props: AdminAssignmentProps): AdminAssignment {
    return new AdminAssignment(props)
  }

  // === Геттеры ===
  get version(): number { return this.props.version }
  get employeeId(): string { return this.props.employeeId }
  get appointedAt(): Date { return this.props.appointedAt }
  get revokedAt(): Date | undefined { return this.props.revokedAt }
  get revokeReason(): string | undefined { return this.props.revokeReason }

  /** @description Признак действующего назначения */
  get isActive(): boolean { return this.props.revokedAt === undefined }

  // === checkFunctions ===

  private checkAppointedAt = (): void => {
    if (Number.isNaN(this.appointedAt.getTime())) {
      throw new Error('incorrect appointedAt AdminAssignment')
    }
  }

  private checkRevokedAt = (): void => {
    if (this.revokedAt === undefined) { return }

    if (!(this.revokedAt >= this.appointedAt)) {
      throw new Error('incorrect revokedAt AdminAssignment')
    }
  }

  private checkRevokeReason = (): void => {
    if (this.revokeReason === undefined && this.revokedAt === undefined) { return }

    if (this.revokeReason === undefined) {
      throw new Error('incorrect revokeReason AdminAssignment')
    }

    if (this.revokedAt === undefined) {
      throw new Error('incorrect revokeReason AdminAssignment')
    }

    if (this.revokeReason.trim().length === 0) {
      throw new Error('incorrect revokeReason AdminAssignment')
    }
  }
}