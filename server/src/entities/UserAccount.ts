import { Entity } from './shared/Entity.js'
import { randomUUID } from 'node:crypto'

type AccountStatus = 'Active' | 'Blocked'
type AccountOwnerType = 'Student' | 'Employee'

interface UserAccountProps {
  id: string
  version: number

  /** @description Логин, уникальный в пределах Системы */
  login: string
  /** @description Необратимое преобразование пароля; сам пароль не хранится */
  passwordHash: string

  /** @description Тип владельца: обучающийся или сотрудник */
  ownerType: AccountOwnerType
  /** @description Ссылка на владельца */
  ownerId: string

  status: AccountStatus
  /** @description Причина блокировки */
  blockReason?: string
  /** @description Дата блокировки */
  blockedAt?: Date

  /** @description Счётчик неудачных попыток входа */
  failedAttempts: number
  /** @description Версия сеанса: увеличение отзывает ранее выпущенные средства доступа */
  sessionVersion: number
}

interface CreateUserAccountProps {
  login: string
  passwordHash: string

  ownerType: AccountOwnerType
  ownerId: string

  status: AccountStatus
  blockReason?: string
  blockedAt?: Date

  failedAttempts: number
  sessionVersion: number
}

/** @description Entity */
export class UserAccount extends Entity<UserAccountProps> {
  private constructor(userAccountProps: UserAccountProps) {
    super(userAccountProps)

    this.checkLogin()
    this.checkPasswordHash()
    this.checkOwner()
    this.checkStatus()
    this.checkBlock()
    this.checkFailedAttempts()
    this.checkSessionVersion()
  }

  // === Фабрики ===
  /**
   * заглушка
   * @param props заглушка
   */
  public static createUserAccountEntity(
    props: CreateUserAccountProps
  ): UserAccount {
    return new UserAccount({
      ...props,
      id: randomUUID(),
      version: 1,
    })
  }

  /**
   * заглушка
   * @param props заглушка
   */
  public static restore(props: UserAccountProps): UserAccount {
    return new UserAccount(props)
  }

  // === Геттеры ===
  private get version(): number {
    return this.props.version
  }
  private get login(): string {
    return this.props.login
  }
  private get ownerType(): AccountOwnerType {
    return this.props.ownerType
  }
  private get ownerId(): string {
    return this.props.ownerId
  }
  private get status(): AccountStatus {
    return this.props.status
  }
  private get blockReason(): string | undefined {
    return this.props.blockReason
  }
  private get blockedAt(): Date | undefined {
    return this.props.blockedAt
  }
  private get failedAttempts(): number {
    return this.props.failedAttempts
  }
  private get sessionVersion(): number {
    return this.props.sessionVersion
  }

  /** Только для сохранения */
  get passwordHash(): string {
    return this.props.passwordHash
  }

  // === checkFunctions ===
  private checkLogin = (): void => {
    if (!(this.login.trim().length >= 3 && this.login.trim().length <= 64)) {
      throw new Error('incorrect login UserAccount')
    }
  }

  private checkPasswordHash = (): void => {
    if (this.passwordHash.trim().length === 0) {
      throw new Error('incorrect passwordHash UserAccount')
    }
  }

  private checkOwner = (): void => {
    const ownerTypes: AccountOwnerType[] = ['Student', 'Employee']

    if (!ownerTypes.includes(this.ownerType)) {
      throw new Error('incorrect ownerType UserAccount')
    }

    if (this.ownerId.trim().length === 0) {
      throw new Error('incorrect ownerId UserAccount')
    }
  }

  private checkStatus = (): void => {
    const statuses: AccountStatus[] = ['Active', 'Blocked']

    if (!statuses.includes(this.status)) {
      throw new Error('incorrect status UserAccount')
    }
  }

  private checkBlock = (): void => {
    const isBlocked = this.status === 'Blocked'

    if (
      this.blockReason === undefined &&
      this.blockedAt === undefined &&
      !isBlocked
    ) {
      return
    }

    if (this.blockReason === undefined || this.blockedAt === undefined) {
      throw new Error('incorrect block UserAccount')
    }

    if (!isBlocked) {
      throw new Error('incorrect block UserAccount')
    }

    if (this.blockReason.trim().length === 0) {
      throw new Error('incorrect blockReason UserAccount')
    }
  }

  private checkFailedAttempts = (): void => {
    if (!Number.isInteger(this.failedAttempts) || !(this.failedAttempts >= 0)) {
      throw new Error('incorrect failedAttempts UserAccount')
    }
  }

  private checkSessionVersion = (): void => {
    if (!Number.isInteger(this.sessionVersion) || !(this.sessionVersion >= 1)) {
      throw new Error('incorrect sessionVersion UserAccount')
    }
  }
}
