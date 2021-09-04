import { UuidConstructor } from "../../core";
import { ConnectOptions } from "../../core/base/connection";
import { DbContext } from "../db-context";
import { Entity, EntityConstructor } from "../entity";
import { DbContextMetadata, EntityMetadata } from "../metadata";
import { metadataStore } from "../metadata-store";
import { isTableEntity } from "../metadata/util";
import { EntityType } from "../types";
import { EntityBuilder } from "./entity-builder";
import { fixEntity, fixEntityIndexes, fixEntityRelations } from "./util";

export class ContextBuilder<T extends DbContext = DbContext> {
  public readonly metadata: DbContextMetadata;
  constructor(ctr: new (...args: any) => T) {
    this.metadata = new DbContextMetadata(ctr);
    this.metadata.className = ctr.name;
  }

  /**
   * 实体映射
   */
  private _entityMap: Map<EntityType, EntityBuilder<any>> = new Map();

  /**
   * 是否已经完成
   */
  private _isReady: boolean = false;

  get isReady() {
    return this._isReady;
  }

  /**
   * 指定数据连接
   */
  connectWith(connectionOptions: ConnectOptions) {
    this.metadata.connection = connectionOptions;
  }
  hasComment(comment: string) {
    this.metadata.comment = comment;
  }

  /**
   * 声明实体
   */
  entity<T extends Entity>(ctr: EntityConstructor<T>): EntityBuilder<T>;
  entity<T extends Entity>(
    ctr: EntityConstructor<T>,
    build: (builder: EntityBuilder<T>) => void
  ): this;
  entity<T extends Entity>(
    ctr: EntityConstructor<T>,
    build?: (builder: EntityBuilder<T>) => void
  ): EntityBuilder<T> | this {
    if (this._isReady)
      throw new Error(`Context is completed, not allow this operation.`);
    if (!this._entityMap.has(ctr)) {
      const metadata: EntityMetadata = new EntityMetadata();
      Object.assign(metadata, {
        kind: 'TABLE',
        dbName: ctr.name,
        className: ctr.name,
        class: ctr,
        contextClass: this.metadata.class,
      });
      const eb = new EntityBuilder<T>(this, metadata);
      this._entityMap.set(ctr, eb);
      this.metadata.addEntity(metadata);
    }
    const builder = this._entityMap.get(ctr)!;
    if (build) {
      build(builder);
      return this;
    }
    return builder;
  }

  // /**
  //  * 将实体绑定到表中
  //  * @param ctr
  //  */
  // table<T extends Entity>(ctr: Constructor<T>): EntityBuilder<T>;
  // table<T extends Entity>(
  //   ctr: Constructor<T>,
  //   build: (builder: EntityBuilder<T>) => void
  // ): this;
  // table<T extends Entity>(
  //   ctr: Constructor<T>,
  //   build?: (builder: EntityBuilder<T>) => void
  // ): EntityBuilder<T> | this {
  //   const builder = this.entity(ctr).asTable();
  //   if (build) {
  //     build(builder);
  //     return this;
  //   }
  //   return builder;
  // }

  // /**
  //  * 将实体绑定到视图当中
  //  * @param ctr
  //  */
  // view<T extends Entity>(ctr: Constructor<T>): ViewEntityBuilder<T>;
  // view<T extends Entity>(
  //   ctr: Constructor<T>,
  //   build: (builder: ViewEntityBuilder<T>) => void
  // ): this;
  // view<T extends Entity>(
  //   ctr: Constructor<T>,
  //   build?: (builder: ViewEntityBuilder<T>) => void
  // ): ViewEntityBuilder<T> | this {
  //   const builder = this.entity(ctr).asView();
  //   if (build) {
  //     build(builder);
  //     return this;
  //   }
  //   return builder;
  // }

  // /**
  //  * 将实体绑定到查询当中
  //  * @param ctr
  //  */
  // query<T extends Entity>(ctr: Constructor<T>): QueryEntityBuilder<T>;
  // query<T extends Entity>(
  //   ctr: Constructor<T>,
  //   build: (builder: QueryEntityBuilder<T>) => void
  // ): this;
  // query<T extends Entity>(
  //   ctr: Constructor<T>,
  //   build?: (builder: QueryEntityBuilder<T>) => void
  // ): QueryEntityBuilder<T> | this {
  //   const builder = this.entity(ctr).asQuery();
  //   if (build) {
  //     build(builder);
  //     return this;
  //   }
  //   return builder;
  // }

  /**
   * 结束建模过程并完善数据并校验完整性
   */
  ready() {
    if (this._isReady)
      throw new Error(
        `Context is completed, use 'context(Context, build)' will auto call the complete.`
      );
    if (!this.metadata.database) {
      this.metadata.database = this.metadata.className;
    }

    if (!this.metadata.globalKeyName) {
      this.metadata.globalKeyName = 'id';
      this.metadata.globalKeyType = BigInt;
    }

    for (const entity of this.metadata.entities) {
      fixEntity(this, entity);
    }

    // 处理关联关系
    for (const entity of this.metadata.entities) {
      if (!isTableEntity(entity)) continue;
      fixEntityIndexes(entity);
      fixEntityRelations(this, entity);
    }

    this._isReady = true;
    // 注册进 metadataStore中
    metadataStore.registerContext(this.metadata);
  }

  /**
   * 指定全局主键字段名称
   */
  hasGlobalKey(
    name: string,
    type:
      | NumberConstructor
      | StringConstructor
      | BigIntConstructor
      | UuidConstructor
  ): this {
    this.metadata.globalKeyName = name;
    this.metadata.globalKeyType = type;
    return this;
  }
}
