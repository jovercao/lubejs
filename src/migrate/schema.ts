/* eslint-disable @typescript-eslint/ban-types */

import { SQL } from '../core';
import { DbContext } from '../orm/db-context';
import {
  ColumnMetadata,
  ForeignRelationMetadata,
  IndexMetadata,
  TableEntityMetadata,
  ViewEntityMetadata,
} from '../orm/metadata';
import {
  compareObject,
  EqulsCompartor,
  ObjectDifference,
  ObjectKeyCompartor,
} from './compare';
import {
  isTableEntity,
  isViewEntity,
  isForeignRelation,
} from '../orm/metadata/util';

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
  referenceTable: string;
  /**
   * 主键表所在架构
   */
  referenceSchema?: string;
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

// export interface SchemaSchema {
//   name: string;
//   comment?: string;
// }

export interface DatabaseSchema {
  /**
   * 数据库名称
   */
  name: string;

  /**
   * 排序规则
   */
  collate?: string;

  /**
   * 表
   */
  tables: TableSchema[];

  /**
   * 架构
   */
  schemas: string[];

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
  comment?: string;
  name: string;
  schema?: string;
  scripts: string;
}

// export interface ParameterSchema {
//   name: string;
//   type: string;
//   defaultValue: Scalar;
//   direction: PARAMETER_DIRECTION;
// }

export interface ProcedureSchema {
  name: string;
  schema?: string;
  scripts: string;
  comment?: string;
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
  name: string;

  /**
   * 所在架构
   */
  schema?: string;

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

  primaryKey?: PrimaryKeySchema;

  /**
   * 外键
   */
  foreignKeys: ForeignKeySchema[];

  /**
   * 约束：包含检查约束及唯一约束，不含主键、外键、及索引
   */
  constraints: ConstraintSchema[];

  /**
   * 初始数据
   */
  seedData?: object[];
}

export interface SequenceSchema {
  comment?: string;
  type: string;
  name: string;
  schema?: string;
  startValue: number;
  increment: number;
}

export interface CheckConstraintSchema {
  kind: 'CHECK';
  name: string;
  sql: string;
  comment?: string;
}

// export interface UniqueConstraintSchema {
//   kind: 'UNIQUE';
//   name: string;
//   columns: KeyColumnSchema[];
//   comment?: string;
// }

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

export type ConstraintSchema = CheckConstraintSchema; // | UniqueConstraintSchema;

/**
 * 视图架构
 */
export interface ViewSchema {
  /**
   * 视图名称
   */
  name: string;
  /**
   * 所在架构
   */
  schema?: string;
  /**
   * 声明语句
   */
  scripts: string;
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
   * 是否行标识列
   */
  isRowflag: boolean;
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
export function generateSchema(context: DbContext): DatabaseSchema {
  const sqlUtil = context.connection.sqlUtil;
  // const databaseName  = await context.lube.provider.getCurrentDatabase();
  // const defaultSchema = await context.lube.provider.getDefaultSchema();
  function genDbSchema(context: DbContext): DatabaseSchema {
    // const tables = context.entities.filter(p => isTableEntity(p)).map(entity => genTableSchema(entity as TableEntityMetadata));
    const db: DatabaseSchema = {
      name: context.metadata.database,
      tables: [],
      views: [],
      procedures: [],
      functions: [],
      sequences: [],
      schemas: [],
      comment: context.metadata.comment,
    };

    for (const entity of context.metadata.entities) {
      if (isTableEntity(entity)) {
        db.tables.push(genTableSchema(entity));
      }
    }

    // const tableMap = map(db.tables, table => table.name);

    for (const entity of context.metadata.entities) {
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
      .map(p => genForeignKeySchema(entity, p as ForeignRelationMetadata));
    const table: TableSchema = {
      name: entity.dbName,
      schema: entity.schema, //?? defaultSchema,
      primaryKey: {
        name: entity.key.constraintName,
        isNonclustered: entity.key.isNonclustered,
        comment: entity.key.comment,
        columns: [
          {
            name: entity.key.column.columnName,
            isAscending: true,
          },
        ],
      },
      columns,
      indexes,
      foreignKeys,
      constraints: [], // TODO 实体添加约束代码
      comment: entity.comment,
      seedData: entity.data,
    };
    return table;
  }

  function genColumnSchema(column: ColumnMetadata): ColumnSchema {
    const col: ColumnSchema = {
      type: sqlUtil.sqlifyType(column.dbType),
      name: column.columnName,
      isNullable: column.isNullable,
      isIdentity: column.isIdentity,
      identityStartValue: column.identityStartValue,
      identityIncrement: column.identityIncrement,
      isCalculate: column.isCalculate,
      isRowflag: column.isRowflag,
      calculateExpression:
        column.calculateExpression &&
        sqlUtil.sqlifyExpression(column.calculateExpression),
      comment: column.comment,
      defaultValue:
        column.defaultValue && sqlUtil.sqlifyExpression(column.defaultValue),
    };
    return col;
  }

  function genForeignKeySchema(
    entity: TableEntityMetadata,
    relation: ForeignRelationMetadata
  ): ForeignKeySchema {
    const fk: ForeignKeySchema = {
      name: relation.constraintName,
      referenceSchema: relation.referenceEntity.schema, // ?? defaultSchema,
      referenceTable: relation.referenceEntity.dbName,
      columns: [relation.foreignColumn.columnName],
      referenceColumns: [relation.referenceEntity.key.column.columnName],
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
      name: view.dbName,
      schema: view.schema ?? sqlUtil.options.defaultSchema,
      scripts: sqlUtil.sqlify(SQL.createView(view.dbName).as(view.body)).sql,
      comment: view.comment,
    };
    return v;
  }

  return genDbSchema(context);
}
