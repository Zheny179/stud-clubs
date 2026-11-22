import { Entity } from './shared/Entity.js'
import { randomUUID } from 'node:crypto'

/** @description Работает | Уволен */
type employmentStatus = 'Employed' | "Terminated"

interface EmployeeProps {
  id: string,
  version: number,

  /** @description Фамилия */
  lastName: string,
  /** @description Имя */
  firstName: string,
  /** @description Отчество */
  patronymic?: string,

  position: string,
  department?: string
  /** @description Признак действующего работника */
  employmentStatus: employmentStatus,

  /** @description Дата прекращения работы */
  terminationDate?: Date,

  email: string,
  phoneNumber: string,
}

interface CreateEmployeeProps {
  lastName: string,
  firstName: string,
  patronymic?: string,

  position: string,
  department?: string
  employmentStatus: employmentStatus,

  terminationDate?: Date,

  email: string,
  phoneNumber: string,
}

/** @description Entity */
export class Employee extends Entity<EmployeeProps> {
  private constructor(employeeProps: EmployeeProps) {
    super(employeeProps)

    this.checkLastName()
    this.checkFirstName()
    this.checkPatronymic()

    this.checkPosition()
    this.checkDepartment()
    this.checkEmploymentStatus()

    this.checkEmail()
    this.checkPhoneNumber()
    this.checkTerminationDate()
  }

  // === Фабрики ===
  /**
   * заглушка
   * @param props заглушка
   */
  public static createEmployeeEntity(props: CreateEmployeeProps): Employee {
    return new Employee({
      ...props,
      id: randomUUID(),
      version: 1,
    })
  }

  /**
   * заглушка
   * @param props заглушка
   */
  public static restore(props: EmployeeProps): Employee {
    return new Employee(props)
  }

  // === Геттеры и сеттеры ===
  private get lastName(): string { return this.props.lastName }
  private get firstName(): string { return this.props.firstName }
  private get patronymic(): string | undefined { return this.props.patronymic }


  private get position(): string { return this.props.position }
  private get department(): string | undefined { return this.props.department }
  private get employmentStatus(): employmentStatus { return this.props.employmentStatus }

  private get terminationDate(): Date | undefined { return this.props.terminationDate }

  private get email(): string { return this.props.email }
  private get phoneNumber(): string { return this.props.phoneNumber }

  // === checkFunctions ===
  private checkLastName = (): void => {
    if (!(
      this.lastName.length >= 1 &&
      this.lastName.length <= 24
    )) {
      throw new Error('incorrect lastName Employee')
    }
  }

  private checkFirstName = (): void => {
    if (!(
      this.firstName.length >= 2 &&
      this.firstName.length <= 24
    )) {
      throw new Error('incorrect firstName Employee')
    }
  }

  private checkPatronymic = (): void => {
    if (this.patronymic === undefined ) { return }
    if (!(
      this.patronymic.length >= 3 &&
      this.patronymic.length <= 24
    )) {
      throw new Error('incorrect patronymic Employee')
    }
  }

  private checkPosition = (): void => {
    if (!(
      this.position.length >= 2 &&
      this.position.length <= 64
    )) {
      throw new Error('incorrect position Employee')
    }
  }

  private checkDepartment = (): void => {
    if (this.department !== undefined && !(
      this.department.length >= 2 &&
      this.department.length <= 64
    )) {
      throw new Error('incorrect department Employee')
    }
  }

  private checkEmploymentStatus = (): void => {
    switch (this.employmentStatus) {
      case 'Employed':
        return;
      case 'Terminated':
        return;
      default: {
        const check: never = this.employmentStatus
        throw new Error(`incorrect field value employmentStatus: ${check} Employee`)
      }
    }
  }

  private checkTerminationDate = (): void => {
    if (
      this.employmentStatus === "Terminated" &&
      this.terminationDate === undefined
    ) {
      throw new Error('incorrect terminationDate Employee')
    }

    if (
      this.employmentStatus === 'Employed' &&
      this.terminationDate !== undefined
    ) {
      throw new Error('incorrect terminationDate Employee')
    }
  }

  private checkEmail = (): void => {
    if (!(
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)
    )) {
      throw new Error('incorrect email Employee')
    }
  }

  private checkPhoneNumber = (): void => {
    if (!(
      /(?<![\d+a-zA-Zа-яА-ЯёЁ])\+[1-9]\d{6,14}(?![\d+a-zA-Zа-яА-ЯёЁ])/.test(this.phoneNumber)
    )) {
      throw new Error('incorrect phoneNumber Employee')
    }
  }
}