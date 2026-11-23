import {Entity} from './shared/Entity.js'
import {randomUUID} from 'node:crypto'

// TODO: Реализовать типизированные ошибки
// TODO: Сделать документацию JSDoc

// TODO: Выделить этот тип в общую папочку shared, когда она появится
/** @description Обучается | Выпущен | Отчислен */
type enrollmentStatus = 'Enrolled' | 'Graduated' | 'Expelled'

interface StudentProps {
  id: string,
  version: number,

  /** @description Фамилия */
  lastName: string,
  /** @description Имя */
  firstName: string,
  /** @description Отчество */
  patronymic?: string,

  /** @description Учебная группа */
  studyGroup: string,
  course: number,
  speciality: string,

  email?: string,
  phoneNumber: string,
  photo?: string,

  interests?: string[],

  /** @description Дата зачисления */
  enrollmentDate: Date,
  /** @description Статус обучения */
  enrollmentStatus: enrollmentStatus,
  /** @description Дата прекращения обучения */
  enrollmentEndDate?: Date,
  /** @description Год выпуска */
  graduationYear?: Date,
}

interface CreateStudentProps {
  lastName: string,
  firstName: string,
  patronymic?: string,

  studyGroup: string,
  course: number,
  speciality: string,

  email?: string,
  phoneNumber: string
  photo?: string,

  interests?: string[],

  enrollmentDate: Date,
  enrollmentStatus: enrollmentStatus,
  enrollmentEndDate?: Date,
  graduationYear?: Date,
}

/** @description Entity */
export class Student extends Entity<StudentProps> {
  private constructor(studentProps: StudentProps) {
    super(studentProps)

    this.checkLastName()
    this.checkFirstName()
    this.checkPatronymic()

    this.checkStudyGroup()
    this.checkCourse()
    this.checkSpeciality()

    this.checkEmail()
    this.checkPhoneNumber()
    this.checkEnrollmentEndDate()
    this.checkGraduationYear()
  }

  // === Фабрики ===
  /**
   * заглушка
   * @param props заглушка
   */
  public static createNewStudent(props: CreateStudentProps): Student {
    return new Student({
      ...props,
      id: randomUUID(),
      version: 1,
    })
  }

  /**
   * заглушка
   * @param props заглушка
   */
  public static restore(props: StudentProps): Student {
    return new Student(props)
  }

  // === Геттеры и сеттеры ===
  // TODO: Сделать проверки на все свойства
  private get lastName(): string { return this.props.lastName }
  private get firstName(): string { return this.props.firstName }
  private get patronymic(): string | undefined { return this.props.patronymic }

  private get studyGroup(): string { return this.props.studyGroup }
  private get course(): number { return this.props.course }
  private get speciality(): string { return this.props.speciality }

  private get email(): string | undefined { return this.props.email }
  private get phoneNumber(): string { return this.props.phoneNumber }
  private get photo(): string | undefined { return this.props.photo }

  private get interests(): string[] | undefined { return this.props.interests }

  private get enrollmentDate(): Date { return this.props.enrollmentDate }
  private get enrollmentStatus(): enrollmentStatus { return this.props.enrollmentStatus }
  private get enrollmentEndDate(): Date | undefined { return this.props.enrollmentEndDate }
  private get graduationYear(): Date | undefined { return this.props.graduationYear }

  // === checkFunctions ===
  private checkLastName = (): void => {
    if (!(
      this.lastName.length >= 1 &&
      this.lastName.length <= 24
    )) {
      throw new Error('incorrect lastName Student')
    }
  }

  private checkFirstName = (): void => {
    if (!(
      this.firstName.length >= 2 &&
      this.firstName.length <= 24
    )) {
      throw new Error('incorrect firstName Student')
    }
  }

  private checkPatronymic = (): void => {
    if (this.patronymic === undefined ) { return }
    if (!(
      this.patronymic.length >= 3 &&
      this.patronymic.length <= 24
    )) {
      throw new Error('incorrect patronymic Student')
    }
  }

  private checkStudyGroup = (): void => {
    if (!(
      this.studyGroup.trim().length >= 2 &&
      this.studyGroup.trim().length <= 16
    )) {
      throw new Error('incorrect studyGroup Student')
    }
  }

  private checkCourse = (): void => {
    if (!(
      Number.isInteger(this.course) &&
      this.course >= 1 &&
      // TODO: 6 заменить на значение из общего модуля shared
      this.course <= 6
    )) {
      throw new Error('incorrect course Student')
    }
  }

  private checkSpeciality = (): void => {
    if (!(
      this.speciality.trim().length >= 3 &&
      this.speciality.trim().length <= 100
    )) {
      throw new Error('incorrect speciality Student')
    }
  }


  private checkEmail = (): void => {
    if (this.email === undefined) { return }
    if (!(
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)
    )) {
      throw new Error('incorrect email Student')
    }
  }

  private checkPhoneNumber = (): void => {
    if (!(
      /(?<![\d+a-zA-Zа-яА-ЯёЁ])\+[1-9]\d{6,14}(?![\d+a-zA-Zа-яА-ЯёЁ])/.test(this.phoneNumber)
    )) {
      throw new Error('incorrect phoneNumber Student')
    }
  }

  private checkEnrollmentEndDate = (): void => {
    if (
      this.enrollmentEndDate === undefined &&
      this.enrollmentStatus !== 'Enrolled'
    ) {
      throw new Error('incorrect enrollmentEndDate Student')
    }

    if (
      this.enrollmentEndDate !== undefined &&
      this.enrollmentStatus === 'Enrolled'
    ) {
      throw new Error('incorrect enrollmentEndDate Student')
    }

    if (this.enrollmentEndDate === undefined) {
      return
    }

    if (!(
      this.enrollmentEndDate >= this.enrollmentDate
    )) {
      throw new Error('incorrect enrollmentEndDate Student')
    }
  }

  private checkGraduationYear = (): void => {
    if (
      this.graduationYear === undefined &&
      this.enrollmentStatus !== 'Graduated'
    ) { return }

    if (
      this.graduationYear === undefined &&
      this.enrollmentStatus === 'Graduated'
    ) {
      throw new Error('incorrect graduationYear Student')
    }

    if (
      this.graduationYear !== undefined &&
      this.enrollmentStatus !== 'Graduated'

    ) {
      throw new Error('incorrect graduationYear Student')
    }

    if (
      this.graduationYear !== undefined &&
      (this.graduationYear.getTime() - this.enrollmentDate.getTime()) < 0
    ) {
      throw new Error('incorrect graduationYear Student')
    }
  }
}