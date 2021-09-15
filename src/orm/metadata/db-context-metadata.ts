import { Entity, EntityConstructor } from "../entity";
import { DbContextConstructor } from "../db-context";
import { ConnectOptions, UuidConstructor } from "../../core";
import { EntityMetadata } from "./entity-metadata";
import { isTableEntity } from "./util";
import { KeyMetadata } from "./key-metadata";

export class DbContextMetadata {
  constructor(ctr: DbContextConstructor) {
    this.class = ctr;
  }

  class: DbContextConstructor;
  database!: string;
  className!: string;
  globalKey?: KeyMetadata;
  // /**
  //  * 全局主键字段名称
  //  */
  // globalKeyName!: string;
  // globalKeyType!:
  //   | NumberConstructor
  //   | StringConstructor
  //   | BigIntConstructor
  //   | UuidConstructor;
  /**
   * 连接
   */
  connection?: ConnectOptions;
  private _entitiyMap: Map<EntityConstructor<Entity>, EntityMetadata> = new Map();
  private _entities: EntityMetadata[] = [];
  get entities(): ReadonlyArray<EntityMetadata> {
    return this._entities;
  }
  /**
   * 摘要说明
   */
  comment?: string;

  /**
   * 获取实体元数据
   * @param ctr 实体构造函数
   */
  getEntity(ctr: EntityConstructor<Entity>): EntityMetadata | undefined {
    return this._entitiyMap.get(ctr);
  }

  /**
   *
   */
  findTableEntityByName(tableName: string): EntityMetadata | undefined {
    return this.entities.find(
      entity => isTableEntity(entity) && entity.dbName === tableName
    );
  }

  addEntity(entity: EntityMetadata): this {
    if (this._entitiyMap.has(entity.class)) {
      throw new Error(`Entity ${entity.className} is exists in DbContext.`);
    }
    this._entitiyMap.set(entity.class, entity);
    this._entities.push(entity);
    return this;
  }
}
