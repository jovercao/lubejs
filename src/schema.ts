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

import { Document } from "./ast";
import { Compiler } from "./compile";
import { PARAMETER_DIRECTION } from "./constants";
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
} from "./metadata";
import { DataType, DbType, RowObject, Scalar, DataTypeOf, Name } from "./types";
import { map } from "./util";

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
  foreignColumns: string[];

  /**
   * 主键表
   */
  referenceTable: Name<string>;
  /**
   * 引用列（主键列）
   */
  referenceColumns: string[];

  /**
   * 级联删除
   * // WARN 慎用
   */
  isCascade: boolean;
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
  name: Name<string>;

  /**
   * 摘要说明
   */
  comment?: string;

  /**
   * 列
   */
  columns: ColumnSchema[];

  /**
   * 索引
   */
  indexes: IndexSchema[];

  foreignKeys: ForeignKeySchema[];

  /**
   * 检查约束
   */
  constraints: CheckConstraintSchema[];
}

export interface SequenceSchema {
  type: string;
  name: Name<string>;
  startValue: number;
  increment: number;
}

export interface CheckConstraintSchema {
  name: string;
  sql: string;
}

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
  isPrimaryKey: boolean;
  columns: {
    columnName: string;
    isAscending: boolean;
  }[];
  comment?: string;
}

/**
 * 从Metadata生成架构
 * @param compiler
 * @param context
 * @returns
 */
export function generate(
  compiler: Compiler,
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
      comment: context.description,
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
    const columns = entity.columns.map((col) => genColumnSchema(col));
    const indexes = entity.indexes.map((index) =>
      genIndexSchema(index, columns)
    );
    const foreignKeys = entity.relations
      .filter((p) => isForeignRelation(p))
      .map((p) => genForeignKeySchema(entity, p as ForeignRelation));

    const table: TableSchema = {
      name: entity.tableName,
      columns,
      indexes,
      foreignKeys,
      constraints: [], // TODO 实体添加约束代码
      comment: entity.description,
    };
    return table;
  }

  function genColumnSchema(column: ColumnMetadata): ColumnSchema {
    const col: ColumnSchema = {
      type: compiler.compileType(column.dbType),
      name: column.columnName,
      isNullable: column.isNullable,
      isIdentity: column.isIdentity,
      identityStartValue: column.identityStartValue,
      identityIncrement: column.identityIncrement,
      isCalculate: column.isCalculate,
      calculateExpression: compiler.compileExpression(column.calculateExpression, null),
      comment: column.description,
      defaultValue: compiler.compileExpression(column.defaultValue, null),
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
      foreignColumns: [relation.foreignColumn.columnName],
      referenceColumns: [relation.referenceEntity.keyColumn.columnName],
      isCascade: relation.isCascade,
    };
    return fk;
  }

  function genIndexSchema(
    index: IndexMetadata,
    columns: ColumnSchema[]
  ): IndexSchema {
    const idx: IndexSchema = {
      name: index.name,
      isPrimaryKey: index.isPrimaryKey,
      isUnique: index.isUnique,
      columns: index.columns.map((cm) => ({ columnName: cm.columnName, isAscending: true})),
      comment: index.description,
    };
    return idx;
  }

  function genViewSchema(view: ViewEntityMetadata): ViewSchema {
    const v: ViewSchema = {
      name: view.viewName,
      body: compiler.compile(view.body).sql,
      comment: view.description,
    };
    return v;
  }

  return genDbSchema(context);
}
