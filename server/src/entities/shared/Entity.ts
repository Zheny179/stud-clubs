// TODO: Сделать документацию JSDoc
// TODO: Сделать документацию на этот класс в DOCS
/**
 *
 */
export abstract class Entity<TProps extends { id: string }> {
  protected constructor(protected readonly props: TProps) {}

  protected get id(): string {
    return this.props.id;
  }

  /** заглушка @description заглушка */
  public toProps(): Readonly<TProps> {
    return { ...this.props };
  }
}