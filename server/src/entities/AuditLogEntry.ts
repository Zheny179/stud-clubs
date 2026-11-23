import { Entity } from './shared/Entity.js'
import { randomUUID } from 'node:crypto'

type SubjectType = 'Student' | 'Employee' | 'System'
type AuditAction =
  | 'Create'
  | 'Update'
  | 'StatusChange'
  | 'Delete'
  | 'Import'
  | 'Export'
  | 'Reset'

interface AuditLogEntryProps {
  id: string,

  /** @description Момент совершения действия */
  occurredAt: Date,
  /** @description Кто совершил действие */
  subjectType: SubjectType,
  subjectId?: string,

  action: AuditAction,
  /** @description Тип затронутого объекта */
  objectType: string,
  objectId: string,
  /** @description Клуб для области видимости руководителя */
  clubId?: string,
  /** @description Изменённые поля: было → стало */
  changes?: string,
}

interface CreateAuditLogEntryProps {
  occurredAt: Date,
  subjectType: SubjectType,
  subjectId?: string,

  action: AuditAction,
  objectType: string,
  objectId: string,
  clubId?: string,
  changes?: string,
}

/** @description Entity */
export class AuditLogEntry extends Entity<AuditLogEntryProps> {
  private constructor(auditLogEntryProps: AuditLogEntryProps) {
    super(auditLogEntryProps)

    this.checkOccurredAt()
    this.checkEnums()
    this.checkSubjectId()
    this.checkObject()
  }

  // === Фабрики ===
  /**
   * заглушка
   * @param props заглушка
   */
  public static createAuditLogEntryEntity(
    props: CreateAuditLogEntryProps,
  ): AuditLogEntry {
    return new AuditLogEntry({
      ...props,
      id: randomUUID(),
    })
  }

  /**
   * заглушка
   * @param props заглушка
   */
  public static restore(props: AuditLogEntryProps): AuditLogEntry {
    return new AuditLogEntry(props)
  }

  // === Геттеры ===
  get occurredAt(): Date { return this.props.occurredAt }
  get subjectType(): SubjectType { return this.props.subjectType }
  get subjectId(): string | undefined { return this.props.subjectId }
  get action(): AuditAction { return this.props.action }
  get objectType(): string { return this.props.objectType }
  get objectId(): string { return this.props.objectId }
  get clubId(): string | undefined { return this.props.clubId }
  get changes(): string | undefined { return this.props.changes }

  // === checkFunctions ===
  private checkOccurredAt = (): void => {
    if (Number.isNaN(this.occurredAt.getTime())) {
      throw new Error('incorrect occurredAt AuditLogEntry')
    }
  }

  private checkEnums = (): void => {
    const subjects: SubjectType[] = ['Student', 'Employee', 'System']
    const actions: AuditAction[] = [
      'Create', 'Update', 'StatusChange', 'Delete', 'Import', 'Export', 'Reset',
    ]

    if (!subjects.includes(this.subjectType)) {
      throw new Error('incorrect subjectType AuditLogEntry')
    }

    if (!actions.includes(this.action)) {
      throw new Error('incorrect action AuditLogEntry')
    }
  }

  private checkSubjectId = (): void => {
    const isSystem = this.subjectType === 'System'

    if (this.subjectId === undefined && isSystem) { return }

    if (this.subjectId === undefined) {
      throw new Error('incorrect subjectId AuditLogEntry')
    }

    if (isSystem) {
      throw new Error('incorrect subjectId AuditLogEntry')
    }
  }

  private checkObject = (): void => {
    if (this.objectType.trim().length === 0) {
      throw new Error('incorrect objectType AuditLogEntry')
    }

    if (this.objectId.trim().length === 0) {
      throw new Error('incorrect objectId AuditLogEntry')
    }
  }
}