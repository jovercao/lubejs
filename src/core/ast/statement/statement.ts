import { ColumnsOf, RowObject } from '../types';
import { AST, SQL_SYMBOLE } from '../ast';
import {
  Assignable,
  Case,
  CompatibleExpression,
  Field,
  When,
} from '../expression';
import { isPlainObject } from '../util';
import {
  Declare,
  DeclareBuilder,
  TableVariantDeclare,
  VariantDeclare,
} from './declare';
import { Assignment, Execute } from './programmer';
import { Scalar } from '../scalar';
import { CompatiableObjectName, Procedure } from '../object';
import { CompatibleTable, WithSelect } from '../rowset';
import { Block } from './control/block';
import { Raw } from '../raw';
import { Delete, Insert, Select, SelectAction, SelectAliasObject, Update, With } from './crud';
import { DropFunction } from './migrate/drop-function';
import {
  AlterFunction,
  AlterProcedure,
  AlterTable,
  AlterView,
  CreateFunction,
  CreateIndex,
  CreateProcedure,
  CreateTable,
  CreateTableHandler,
  CreateTableMemberBuilder,
  CreateView,
  DropIndex,
  DropProcedure,
  DropTable,
  DropView,
} from './migrate';
import { Annotation } from './other';

export enum STATEMENT_KIND {
  // RAW = 'RAW',
  SELECT = 'SELECT',
  UPDATE = 'UPDATE',
  INSERT = 'INSERT',
  EXECUTE = 'EXECUTE',
  DELETE = 'DELETE',
  DECLARE = 'DECLARE',
  ASSIGNMENT = 'ASSIGNMENT',
  CREATE_TABLE = 'CREATE_TABLE',
  CREATE_PROCEDURE = 'CREATE_PROCEDURE',
  CREATE_FUNCTION = 'CREATE_FUNCTION',
  CREATE_INDEX = 'CREATE_INDEX',
  CREATE_VIEW = 'CREATE_VIEW',
  ALTER_PROCEDURE = 'ALTER_PROCEDURE',
  ALTER_VIEW = 'ALTER_VIEW',
  ALTER_FUNCTION = 'ALTER_FUNCTION',
  ALTER_TABLE = 'ALTER_TABLE',
  DROP_VIEW = 'DROP_VIEW',
  DROP_FUNCTION = 'DROP_FUNCETION',
  DROP_PROCEDURE = 'DROP_PROCEDURE',
  DROP_TABLE = 'DROP_TABLE',
  DROP_INDEX = 'DROP_INDEX',
  BLOCK = 'BLOCK',
  STANDARD_STATEMENT = 'STANDARD_STATEMENT',
  CREATE_SEQUENCE = 'CREATE_SEQUENCE',
  DROP_SEQUENCE = 'DROP_SEQUENCE',
  ANNOTATION = 'ANNOTATION',
  IF = 'IF',
  WHILE = 'WHILE',
  BREAK = 'BREAK',
  CONTINUE = 'CONTINUE',
  DROP_DATABASE = 'DROP_DATABASE',
  CREATE_DATABASE = 'CREATE_DATABASE',
  ALTER_DATABASE = 'ALTER_DATABASE',
  USE = 'USE',
  RETURN = 'RETURN',
}

/**
 * SQL 语句
 */
export abstract class Statement extends AST {
  readonly $type: SQL_SYMBOLE.STATEMENT = SQL_SYMBOLE.STATEMENT;
  abstract readonly $kind: STATEMENT_KIND;

  static isStatement(object: any): object is Statement {
    return object?.$type === SQL_SYMBOLE.STATEMENT;
  }

  /**
   * 赋值语句
   * @param left 左值
   * @param right 右值
   */
  static assign<T extends Scalar = any>(
    left: Assignable<T>,
    right: CompatibleExpression<T>
  ): Assignment<T> {
    return new Assignment(left, right);
  }
  /**
   * 变量声明
   * @param declares 变量列表
   */
  static declare(
    build: (builder: DeclareBuilder) => (VariantDeclare | TableVariantDeclare)[]
  ): Declare {
    return new Declare(build);
  }
  /**
   * WHEN 语句块
   * @param expr
   * @param value
   */
  static when<T extends Scalar>(
    expr: CompatibleExpression<Scalar>,
    value: CompatibleExpression<T>
  ): When<T> {
    return new When(expr, value);
  }

  static case<T extends Scalar>(expr?: CompatibleExpression): Case<T> {
    return new Case<T>(expr);
  }
  /**
   * With语句
   */
  static with(...rowsets: WithSelect[] | [WithSelect[]] | [SelectAliasObject]): With {
    return new With(...rowsets);
  }

  static union<T extends RowObject = any>(...selects: Select<T>[]): Select<T> {
    selects.forEach((sel, index) => {
      if (index < selects.length - 1) sel.union(selects[index + 1]);
    });
    return selects[0];
  }
  static unionAll<T extends RowObject = any>(
    ...selects: Select<T>[]
  ): Select<T> {
    selects.forEach((sel, index) => {
      if (index < selects.length - 1) sel.unionAll(selects[index + 1]);
    });
    return selects[0];
  }

  static createTable<N extends string>(name: CompatiableObjectName<N>): CreateTable<N> {
    return new CreateTable(name);
  }

  static alterTable<N extends string>(
    name: CompatiableObjectName<N>
  ): AlterTable<N> {
    return new AlterTable(name);
  }

  static createView<T extends RowObject = any, N extends string = string>(
    name: CompatiableObjectName<N>
  ): CreateView<T, N> {
    return new CreateView(name);
  }

  static alterView<T extends RowObject = any, N extends string = string>(
    name: CompatiableObjectName<N>
  ): AlterView<T, N> {
    return new AlterView(name);
  }

  static createIndex(name: string): CreateIndex {
    return new CreateIndex(name);
  }

  static createProcedure(name: CompatiableObjectName): CreateProcedure {
    return new CreateProcedure(name);
  }

  static alterProcedure(name: CompatiableObjectName): AlterProcedure {
    return new AlterProcedure(name);
  }

  static createFunction(name: CompatiableObjectName): CreateFunction {
    return new CreateFunction(name);
  }

  static alterFunction(name: CompatiableObjectName): AlterFunction {
    return new AlterFunction(name);
  }

  static dropTable<N extends string>(
    name: CompatiableObjectName<N>
  ): DropTable<N> {
    return new DropTable(name);
  }

  static dropView<N extends string>(
    name: CompatiableObjectName<N>
  ): DropView<N> {
    return new DropView(name);
  }

  static dropProcedure<N extends string>(
    name: CompatiableObjectName<N>
  ): DropProcedure<N> {
    return new DropProcedure(name);
  }

  static dropFunction<N extends string>(
    name: CompatiableObjectName<N>
  ): DropFunction<N> {
    return new DropFunction(name);
  }

  static dropIndex<N extends string>(
    table: CompatiableObjectName,
    name: N
  ): DropIndex<N> {
    return new DropIndex(table, name);
  }

  static annotation(...text: string[]): Annotation {
    return new Annotation('BLOCK', text.join('\n'));
  }

  static note(text: string): Annotation {
    return new Annotation('LINE', text);
  }

  /**
   * 插入至表,into的别名
   * @param table
   * @param fields
   */
  static insert<T extends RowObject = any>(
    table: CompatibleTable<T, string>,
    fields?: ColumnsOf<T>[] | Field<Scalar, ColumnsOf<T>>[]
  ): Insert<T> {
    return new Insert(table, fields);
  }
  /**
   * 更新一个表格
   * @param table
   */
  static update<T extends RowObject = any>(
    table: CompatibleTable<T, string>
  ): Update<T> {
    return new Update(table);
  }
  /**
   * 删除一个表格
   * @param table 表格
   */
  static delete<T extends RowObject = any>(
    table: CompatibleTable<T, string>
  ): Delete<T> {
    return new Delete(table);
  }

  static readonly select: SelectAction = (...args: any[]): any => {
    return new Select(...args);
  };

  static raw(sql: string): any {
    return new Raw(sql);
  }

  static block(...statements: Statement[]): Block;
  static block(statements: Statement[]): Block;
  static block(...statements: Statement[] | [Statement[]]): Block {
    if (statements.length === 1 && Array.isArray(statements[0])) {
      statements = statements[0];
    }
    return new Block(statements as Statement[]);
  }

  static execute<R extends Scalar = any, O extends RowObject[] = []>(
    proc: CompatiableObjectName | Procedure<R, O, string>,
    params?: CompatibleExpression<Scalar>[]
    // | Parameter<JsConstant, string>[] | InputObject
  ): Execute<R, O> {
    return new Execute(proc, params);
  }
}
