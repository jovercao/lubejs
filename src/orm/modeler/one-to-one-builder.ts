import { Entity } from "../entity";
import { OneToOneMetadata, PrimaryOneToOneMetadata, ForeignOneToOneMetadata } from "../metadata";
import { ContextBuilder } from "./context-builder";
import { EntityBuilder } from "./entity-builder";

export abstract class OneToOneBuilder<S extends Entity, D extends Entity> {
  constructor(
    private contextBuilder: ContextBuilder,
    private entityBuilder: EntityBuilder<S>,
    public readonly metadata: Partial<OneToOneMetadata>
  ) {}

  hasComment(comment: string): Omit<this, 'hasComment'> {
    this.metadata.comment = comment;
    return this;
  }
}



export class PrimaryOneToOneBuilder<
  S extends Entity,
  D extends Entity
> extends OneToOneBuilder<S, D> {
  public readonly metadata!: PrimaryOneToOneMetadata;

  /**
   * 声明为明细项
   * 获取或查询时传递withDetail选项，将自动附带
   * 删除时亦将同步删除，默认为联动删除
   */
  isDetail(): Omit<this, 'isDetail'> {
    this.metadata.isDetail = true;
    return this;
  }
}

export class ForeignOneToOneBuilder<
  S extends Entity,
  D extends Entity
> extends OneToOneBuilder<S, D> {
  public readonly metadata!: ForeignOneToOneMetadata;

  hasConstraintName(name: string): Omit<this, 'hasConstraintName'> {
    this.metadata.constraintName = name;
    return this;
  }

  isRequired(): Omit<this, 'isNullable'> {
    this.metadata.isRequired = true;
    return this;
  }

  isCascade(): Omit<this, 'isCascade'> {
    this.metadata.isCascade = true;
    return this;
  }
}
