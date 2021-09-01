import { KeyMetadata } from "../metadata";
import { EntityBuilder } from "./entity-builder";

export class TableKeyBuilder {
  constructor(
    private entityBuilder: EntityBuilder<any>,
    public readonly metadata: KeyMetadata
  ) {}

  hasComment(comment: string): this {
    this.entityBuilder.metadata.key!.comment = comment;
    return this;
  }

  /**
   * 指定约束名称
   * @param constraintName
   * @returns
   */
  hasConstraintName(constraintName: string): this {
    this.metadata.constraintName = constraintName;
    return this;
  }

  /**
   * 将主键声明为非聚焦
   * @returns
   */
  isNonclustered() {
    this.metadata.isNonclustered = true;
    return this;
  }
}
