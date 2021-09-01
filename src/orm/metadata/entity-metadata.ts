import { Entity, EntityConstructor } from '../entity';
import { Select, Scalar } from '../../core';
import { ColumnMetadata } from './column-metadata';
import { IndexMetadata } from './index-metdata';
import { KeyMetadata } from './key-metadata';
import {
  RelationMetadata,
  SubordinateRelation,
  SuperiorRelation,
  OneToOneMetadata,
  OneToManyMetadata,
  ManyToOneMetadata,
  ManyToManyMetadata,
} from './relation-metadata';
import {
  isPrimaryOneToOne,
  isOneToMany,
  isManyToMany,
  isForeignOneToOne,
  isManyToOne,
} from './util';
import { DbContextConstructor } from '../db-context';
import { FetchRelations } from '../types';

export interface CommonEntityMetadata {
  /**
   * 是否隐式生成的
   */
  isImplicit: boolean;
  /**
   * 类型
   */
  kind: 'TABLE' | 'VIEW' | 'QUERY';
  /**
   * 表/视图名
   */
  dbName?: string;
  /**
   * 视图的SELECT语句
   */
  body?: Select;

  /**
   * 查询语句
   */
  sql?: Select;

  /**
   * 构造函数
   */
  class: EntityConstructor<Entity>;

  /**
   * 数据库上下文类
   */
  contextClass: DbContextConstructor;

  /**
   * 模型名称
   */
  className: string;

  /**
   * 主键元数据
   */
  key?: KeyMetadata;

  /**
   * 是否只读
   */
  readonly: boolean;

  /**
   * 标识列
   */
  identityColumn?: ColumnMetadata;

  /**
   * 行标记列
   */
  rowflagColumn?: ColumnMetadata;

  /**
   * 摘要描述
   */
  comment?: string;

  /**
   * 数据
   */
  data?: any[];

  readonly indexes: ReadonlyArray<IndexMetadata>;
  readonly relations: ReadonlyArray<RelationMetadata>;
  readonly columns: ReadonlyArray<ColumnMetadata>;
}

/**
 * 表格实体元数据
 */
export class EntityMetadata implements CommonEntityMetadata {
  schema?: string;
  /**
   * 是否隐式生成的
   */
  isImplicit!: boolean;
  /**
   * 类型
   */
  kind!: 'TABLE' | 'VIEW' | 'QUERY';
  /**
   * 类构造函数
   */
  class!: EntityConstructor;
  /**
   * 所绑定的实体类构造函数
   */
  contextClass!: DbContextConstructor;

  /**
   * 主键
   */
  key?: KeyMetadata;

  /**
   * 表/视图 名称
   */
  dbName?: string;
  /**
   * 视图主体语句
   */
  body?: Select;
  /**
   * 查询的SQL语句
   */
  sql?: Select;

  /**
   * 实体类名
   */
  className!: string;

  /**
   * 是否只读
   */
  readonly!: boolean;
  /**
   * 标识列
   */
  identityColumn?: ColumnMetadata<Scalar> | undefined;
  /**
   * 版本标记列
   */
  rowflagColumn?: ColumnMetadata<Scalar> | undefined;
  /**
   * 批注
   */
  comment?: string | undefined;
  /**
   * 种子数据
   */
  data?: object[] | undefined;

  private _columnMap: Record<string, ColumnMetadata> = {};
  private _columns: ColumnMetadata[] = [];
  private _relationMap: Record<string, RelationMetadata> = {};
  private _indexMap: Record<string, IndexMetadata> = {};
  private _reations: RelationMetadata[] = [];
  private _indexes: IndexMetadata[] = [];

  get indexes(): ReadonlyArray<IndexMetadata> {
    return this._indexes;
  }

  addIndex(index: IndexMetadata): this {
    if (this._indexMap[index.name]) {
      throw new Error(`Index ${index.name} is exists in Entity.`);
    }
    this._indexes.push(index);
    this._indexMap[index.name] = index;
    return this;
  }

  addColumn(item: ColumnMetadata): this {
    if (this._columnMap[item.property])
      throw new Error(`Column ${item.property} is exists in Entity.`);
    this._columnMap[item.property] = item;
    this._columns.push(item);
    return this;
  }

  addRelation(item: RelationMetadata): this {
    if (this._relationMap[item.property])
      throw new Error(`Relation ${item.property} is exists in Entity.`);
    this._relationMap[item.property] = item;
    this._reations.push(item);
    return this;
  }

  get columns(): ReadonlyArray<ColumnMetadata> {
    return this._columns;
  }

  getColumn(name: string): ColumnMetadata | undefined {
    return this._columnMap[name];
  }

  get relations(): ReadonlyArray<RelationMetadata> {
    return this._reations;
  }

  getRelation(name: string): RelationMetadata | undefined {
    return this._relationMap[name];
  }

  getIndex(name: string): IndexMetadata | undefined {
    return this._indexMap[name];
  }

  private _detailIncludes?: FetchRelations<any>;

  getDetailIncludes(): FetchRelations<any> | undefined {
    if (this._detailIncludes === undefined) {
      const detailRelations = this.relations.filter(
        r =>
          (isPrimaryOneToOne(r) || isOneToMany(r) || isManyToMany(r)) &&
          r.isDetail
      );
      if (detailRelations.length === 0) {
        this._detailIncludes = undefined;
      } else {
        const detailIncludes: FetchRelations<any> = {};
        detailRelations.forEach(relation => {
          detailIncludes[relation.property] =
            relation.referenceEntity.getDetailIncludes() || true;
        });
        this._detailIncludes = detailIncludes;
      }
    }
    return this._detailIncludes;
  }

  getDetailRelations(): SubordinateRelation[] {
    const detailRelations = this.relations.filter(
      relation =>
        (isPrimaryOneToOne(relation) ||
          isOneToMany(relation) ||
          isManyToMany(relation)) &&
        relation.isDetail
    );
    return detailRelations as SubordinateRelation[];
  }

  getSubordinateRelations(): SubordinateRelation[] {
    return this.relations.filter(
      relation =>
        isPrimaryOneToOne(relation) ||
        isOneToMany(relation) ||
        isManyToMany(relation)
    ) as SubordinateRelation[];
  }

  getSuperiorRelations(): SuperiorRelation[] {
    return this.relations.filter(
      relation => isForeignOneToOne(relation) || isManyToOne(relation)
    ) as SuperiorRelation[];
  }
}

export interface TableEntityMetadata extends EntityMetadata {
  kind: 'TABLE';
  /**
   * 表名
   */
  dbName: string;

  key: KeyMetadata;

  /**
   * 架构
   */
  schema?: string;
}

/**
 * 视图实体元数据
 */
export interface ViewEntityMetadata extends EntityMetadata {
  /**
   * 类型
   */
  kind: 'VIEW';
  /**
   * 表名
   */
  dbName: string;
  /**
   * 架构名称
   */
  schema?: string;
  /**
   * 查询,视图或者查询的SELECT语句
   */
  body: Select;

  /**
   * 是否只读
   */
  readonly: true;

  relations: never;

  getRelation: never;
}

/**
 * 查询实体元数据
 */
export interface QueryEntityMetadata extends EntityMetadata {
  /**
   * 是否隐式生成的
   */
  isImplicit: true;
  /**
   * 类型
   */
  kind: 'QUERY'; //| 'function'

  /**
   * 查询,视图或者查询的SELECT语句
   */
  sql: Select;

  schema: never;
  name: never;

  /**
   * 是否只读
   */
  readonly: true;

  relations: never;

  getRelation: never;
}

/**
 * 实体成员元数据
 */
export type EntityMemberMetadata =
  | ColumnMetadata
  | IndexMetadata
  | OneToOneMetadata
  | OneToManyMetadata
  | ManyToOneMetadata
  | ManyToManyMetadata;
