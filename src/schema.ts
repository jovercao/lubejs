/* eslint-disable @typescript-eslint/ban-types */

/*********************************
 * [元数据生成顺序]
 * code first:
 * 装饰器(Constructor) => Model => Schema
 * db first:
 * SchemaReader => Schema => Model
 *
 * 推荐使用code first模式，因为db first仅可生成表和列，
 * 关联关系等因缺乏信息完美无法生成，需要手动添加
 **********************************/

import { Document } from './ast';
import { SqlUtil } from './sql-util';
import { PARAMETER_DIRECTION } from './constants';
import {
  ColumnMetadata,
  DbContextMetadata,
  ForeignOneToOneMetadata,
  ForeignRelation,
  IndexMetadata,
  isForeignRelation,
  isManyToOne,
  isTableEntity,
  isViewEntity,
  ManyToOneMetadata,
  TableEntityMetadata,
  ViewEntityMetadata,
} from './metadata';
import { DataType, DbType, RowObject, Scalar, DataTypeOf, Name } from './types';
import { map } from './util';
import { compareObject, EqulsCompartor, isChanged, ObjectDifference } from './util/compare';

/**
 * 外键架构
 */
export interface ForeignKeySchema {
  /**
   * 外键名称
   */
  name: string;

  /**
   * 列对应
   */
  columns: string[];

  /**
   * 主键表
   */
  referenceTable: Name;
  /**
   * 引用列（主键列）
   */
  referenceColumns: string[];

  /**
   * 级联删除
   * // WARN 慎用
   */
  isCascade?: boolean;

  comment?: string;
}

export interface DatabaseSchema {
  /**
   * 数据库名称
   */
  name: string;

  /**
   * 表
   */
  tables: TableSchema[];

  /**
   * 视图
   */
  views: ViewSchema[];

  // /**
  //  * 索引列表
  //  */
  // indexes: IndexSchema[];

  /**
   * 存储过程列表
   */
  procedures: ProcedureSchema[];

  /**
   * 函数列表
   */
  functions: FunctionSchema[];

  /**
   * 序列
   */
  sequences: SequenceSchema[];

  /**
   * 摘要说明
   */
  comment?: string;
}

export interface FunctionSchema {
  params: ParameterSchema[];
  return: DbType;
  name: string;
  body: Document;
}

export interface ParameterSchema {
  name: string;
  type: string;
  defaultValue: Scalar;
  direction: PARAMETER_DIRECTION;
}

export interface ProcedureSchema {
  params: ParameterSchema[];
  name: string;
  body: Document;
}

// export class DatabaseSchemaStore {
//   private tableMap: Record<string, TableSchema> = {};
//   private viewMap: Record<string, ViewSchema> = {};
//   private indexMap: Record<string, IndexSchema> = {};
//   private foreignKeyMap: Record<string, ForeignKeySchema> = {};
//   constructor(data: DataObjectOf<DatabaseSchema>) {
//     Object.assign(this, data);
//     this.tables.forEach((table) => (this.tableMap[table.name] = table));
//     this.views.forEach((view) => (this.viewMap[view.name] = view));
//     this.indexes.forEach((index) => (this.indexMap[index.name] = index));
//     this.foreignKeys.forEach(
//       (foreignKey) => (this.foreignKeyMap[foreignKey.name] = foreignKey)
//     );
//   }

//   /**
//    * 数据库名称
//    */
//   readonly name: string;

//   /**
//    * 表
//    */
//   readonly tables: TableSchema[];
//   /**
//    * 视图
//    */
//   readonly views: ViewSchema[];

//   /**
//    * 索引列表
//    */
//   readonly indexes: IndexSchema[];

//   /**
//    * 外键列表
//    */
//   readonly foreignKeys: ForeignKeySchema[];

//   // readonly functions: FunctionSchema[]
//   // readonly procedures: ProcedureSchema[]
//   // readonly sequence: SequenceSchema[]
//   // readonly indexes

//   /**
//    * 获取一个表
//    */
//   getTable(name: string): TableSchema {
//     return this.tableMap[name];
//   }

//   /**
//    * 获取一个视图
//    */
//   getView(name: string): ViewSchema {
//     return this.viewMap[name];
//   }
// }

/**
 * 实体表架构声明
 */
export interface TableSchema {
  /**
   * 数据库对象名称
   */
  name: Name;

  /**
   * 摘要说明
   */
  comment?: string;

  /**
   * 列
   */
  columns: ColumnSchema[];

  // /**
  //  * 主键
  //  */
  // primaryKey: string[];

  /**
   * 索引，不包含主键约束及uniq约束等
   */
  indexes: IndexSchema[];

  primaryKey: PrimaryKeySchema;

  /**
   * 外键
   */
  foreignKeys: ForeignKeySchema[];

  /**
   * 约束：包含检查约束及唯一约束，不含主键、外键、及索引
   */
  constraints: ConstraintSchema[];
}

export interface SequenceSchema {
  type: string;
  name: Name;
  startValue: number;
  increment: number;
}

export interface CheckConstraintSchema {
  kind: 'CHECK';
  name: string;
  sql: string;
  comment?: string;
}

export interface UniqueConstraintSchema {
  kind: 'UNIQUE';
  name: string;
  columns: KeyColumnSchema[];
  comment?: string;
}

export interface KeyColumnSchema {
  name: string;
  isAscending: boolean;
}

export interface PrimaryKeySchema {
  name: string;
  /**
   * 是否是非聚焦索引
   */
  isNonclustered: boolean;
  comment?: string;
  columns: KeyColumnSchema[];
}

export type ConstraintSchema = CheckConstraintSchema | UniqueConstraintSchema;

/**
 * 视图架构
 */
export interface ViewSchema {
  /**
   * 视图名称
   */
  name: string;
  /**
   * 声明语句
   */
  body: string;
  // /**
  //  * 索引
  //  */
  // indexes: IndexSchema[];
  /**
   * 摘要说明
   */
  comment?: string;
}

/**
 * 列架构
 */
export interface ColumnSchema {
  /**
   * 字段名
   */
  name: string;
  /**
   * 数据类型
   */
  type: string;
  /**
   * 是否可空
   */
  isNullable: boolean;
  /**
   * 默认值
   */
  defaultValue?: string;
  /**
   * 是否标识列
   */
  isIdentity: boolean;

  /**
   * 标识列种子
   */
  identityStartValue?: number;
  /**
   * 标识列步长
   */
  identityIncrement?: number;
  /**
   * 是否计算列
   */
  isCalculate: boolean;
  /**
   * 计算表达式
   */
  calculateExpression?: string;
  /**
   * 摘要说明
   */
  comment?: string;
}

/**
 * 索引
 */
export interface IndexSchema {
  name: string;
  isUnique: boolean;
  /**
   * 是否是聚焦索引
   */
  isClustered: boolean;
  /**
   * 索引列
   */
  columns: KeyColumnSchema[];
  comment?: string;
}

/**
 * 从Metadata生成架构
 * @param sqlUtil
 * @param context
 * @returns
 */
export function generateSchema(
  sqlUtil: SqlUtil,
  context: DbContextMetadata
): DatabaseSchema {
  function genDbSchema(context: DbContextMetadata): DatabaseSchema {
    // const tables = context.entities.filter(p => isTableEntity(p)).map(entity => genTableSchema(entity as TableEntityMetadata));
    const db: DatabaseSchema = {
      name: context.database,
      tables: [],
      views: [],
      procedures: [],
      functions: [],
      sequences: [],
      comment: context.comment,
    };

    for (const entity of context.entities) {
      if (isTableEntity(entity)) {
        db.tables.push(genTableSchema(entity));
      }
    }

    // const tableMap = map(db.tables, table => table.name);

    for (const entity of context.entities) {
      // if (isTableEntity(entity)) {
      //   const foreignKeys = entity.relations
      //     .filter((p) => isForeignRelation(p))
      //     .map((p) =>
      //       genForeignKeySchema(entity, p as ForeignRelation)
      //     );
      //   tableMap[entity.tableName].foreignKeys.push(...foreignKeys);
      // }
      if (isViewEntity(entity)) {
        db.views.push(genViewSchema(entity));
      }
    }

    return db;
  }

  function genTableSchema(entity: TableEntityMetadata): TableSchema {
    const columns = entity.columns.map(col => genColumnSchema(col));
    const indexes = entity.indexes.map(index => genIndexSchema(index));
    const foreignKeys = entity.relations
      .filter(p => isForeignRelation(p))
      .map(p => genForeignKeySchema(entity, p as ForeignRelation));
    const table: TableSchema = {
      name: entity.tableName,
      primaryKey: {
        name: entity.keyConstraintName,
        isNonclustered: entity.isNonclustered,
        comment: entity.keyComment,
        columns: [
          {
            name: entity.keyColumn.columnName,
            isAscending: true,
          },
        ],
      },
      columns,
      indexes,
      foreignKeys,
      constraints: [], // TODO 实体添加约束代码
      comment: entity.comment,
    };
    return table;
  }

  function genColumnSchema(column: ColumnMetadata): ColumnSchema {
    const col: ColumnSchema = {
      type: sqlUtil.sqlifyType(column.dbType).replace(/ /g, ''),
      name: column.columnName,
      isNullable: column.isNullable,
      isIdentity: column.isIdentity,
      identityStartValue: column.identityStartValue,
      identityIncrement: column.identityIncrement,
      isCalculate: column.isCalculate,
      calculateExpression:
        column.calculateExpression &&
        sqlUtil.sqlifyExpression(column.calculateExpression),
      comment: column.comment,
      defaultValue:
        column.defaultValue &&
        sqlUtil.sqlifyExpression(column.defaultValue),
    };
    return col;
  }

  function genForeignKeySchema(
    entity: TableEntityMetadata,
    relation: ForeignRelation
  ): ForeignKeySchema {
    const fk: ForeignKeySchema = {
      name: relation.constraintName,
      referenceTable: relation.referenceEntity.tableName,
      columns: [relation.foreignColumn.columnName],
      referenceColumns: [relation.referenceEntity.keyColumn.columnName],
      isCascade: relation.isCascade,
    };
    return fk;
  }

  function genIndexSchema(index: IndexMetadata): IndexSchema {
    const idx: IndexSchema = {
      name: index.name,
      isUnique: index.isUnique,
      isClustered: index.isClustered,
      columns: index.columns.map(cm => ({
        name: cm.column.columnName,
        isAscending: cm.sort === 'ASC',
      })),
      comment: index.comment,
    };
    return idx;
  }

  function genViewSchema(view: ViewEntityMetadata): ViewSchema {
    const v: ViewSchema = {
      name: view.viewName,
      body: sqlUtil.sqlify(view.body).sql,
      comment: view.comment,
    };
    return v;
  }

  return genDbSchema(context);
}

/**
 * 架构对象类型
 */
export type SchemaObject =
  | TableSchema
  | ViewSchema
  | ColumnSchema
  | ConstraintSchema
  | PrimaryKeySchema
  | IndexSchema
  | ProcedureSchema
  | FunctionSchema
  | SequenceSchema
  | DatabaseSchema
  | ParameterSchema;

/**
 * 数据库对象
 */
export type ObjectSchema = TableSchema | ViewSchema | ProcedureSchema | FunctionSchema;


export type SchemaDifference = ObjectDifference<DatabaseSchema>;

export const isSameSchemaObject: EqulsCompartor = (left: SchemaObject, right: SchemaObject, path: string): boolean => {
  return !isChanged(left.name, right.name)
};

export function compareSchema(
  source: DatabaseSchema,
  target: DatabaseSchema
): SchemaDifference | null {
  return compareObject(source, target, isSameSchemaObject);
}
