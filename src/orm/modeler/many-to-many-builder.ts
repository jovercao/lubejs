import { Entity, EntityConstructor } from "../entity";
import { ManyToManyMetadata, TableEntityMetadata } from "../metadata";
import { selectProperty } from "../util";
import { ContextBuilder } from "./context-builder";
import { EntityBuilder } from "./entity-builder";

export class ManyToManyBuilder<S extends Entity, D extends Entity> {
  constructor(
    private readonly contextBuilder: ContextBuilder,
    private readonly entityBuilder: EntityBuilder<S>,
    public readonly metadata: ManyToManyMetadata
  ) {}
  /**
   * 显式声明关系中间表
   * 仅要一方声明中间表即可，无须双方声明
   */
  hasRelationTable<T extends Entity>(
    ctr: EntityConstructor<T>,
    /**
     * 中间表导航属性
     */
    relationPropertySelector?: (p: Required<S>) => T[],
    build?: (builder: EntityBuilder<T>) => void
  ): EntityBuilder<T> {
    if (relationPropertySelector) {
      this.metadata.relationProperty = selectProperty(relationPropertySelector);
    }
    const builder: EntityBuilder<T> = this.contextBuilder.entity(ctr);
    if (build) {
      build(builder);
    }
    this.metadata.relationClass = ctr;
    this.metadata.relationEntity = builder.metadata as TableEntityMetadata;
    if (this.metadata.referenceProperty) {
      const referenceRelation = this.metadata.referenceEntity.getRelation(
        this.metadata.referenceProperty
      ) as ManyToManyMetadata;
      if (referenceRelation) {
        if (referenceRelation.relationClass) {
          throw new Error(`Duplicate relation entity declare.`);
        }
        referenceRelation.relationClass = ctr;
        referenceRelation.relationEntity = this.metadata.relationEntity;
      }
    }
    return builder;
  }

  isDetail(): this {
    this.metadata.isDetail = true;
    return this;
  }

  /**
   * 指定约束名称
   */
  hasConstraintName(name: string): this {
    this.metadata.relationConstraintName = name;
    return this;
  }
}
