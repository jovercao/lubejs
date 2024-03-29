/* eslint-disable @typescript-eslint/no-explicit-any */
import assert from 'assert';
import {
  XObjectName,
  Raw,
  Field,
  DbType,
  Scalar,
  StandardExpression,
  Expression,
  StandardStatement,
  Statement,
  StandardCondition,
  Condition,
  Parameter,
  DBObject,
  Variant,
  Document,
  ObjectName,
  SQL,
  Annotation,
  Select,
  Update,
  Insert,
  Delete,
  Declare,
  Execute,
  Assignment,
  CreateTable,
  AlterTable,
  DropTable,
  CreateView,
  AlterView,
  DropView,
  CreateProcedure,
  AlterProcedure,
  DropProcedure,
  CreateFunction,
  AlterFunction,
  DropFunction,
  CreateIndex,
  DropIndex,
  CreateSequence,
  DropSequence,
  Block,
  If,
  While,
  Break,
  Continue,
  CreateDatabase,
  AlterDatabase,
  DropDatabase,
  Use,
  GroupExpression,
  ValuedSelect,
  UnaryOperation,
  BinaryOperation,
  Rowset,
  NamedSelect,
  BuiltIn,
  SelectColumn,
  Star,
  WithSelect,
  With,
  Union,
  Case,
  When,
  GroupCondition,
  BinaryLogicCondition,
  BinaryCompareCondition,
  UnaryCompareCondition,
  ExistsCondition,
  UnaryLogicCondition,
  Literal,
  ScalarFuncInvoke,
  TableFuncInvoke,
  Join,
  Sort,
  Table,
  TableVariant,
  ProcedureParameter,
  Operation,
  FunctionParameter,
  Return,
  PARAMETER_DIRECTION,
} from '../sql';
import { Standard } from '../standard';
import { DbProvider } from './db-provider';
import { Command } from './types';

/**
 * 标准操作转换器
 */
export type StandardTranslator = Standard;

/**
 * 编译选项
 */
export interface SqlOptions {
  /**
   * 是否启用严格模式，默认启用
   * 如果为false，则生成的SQL标识不会被[]或""包括
   */
  strict?: boolean;
  /**
   * 标识符引用，左
   */
  quotedLeft: string;
  /**
   * 标识符引用，右
   */
  quotedRight: string;

  /**
   * 默认架构名称
   * 当对表结构进行操作时，如果未指定架构，则自动使用该架构操作
   */
  defaultSchema: string;

  /**
   * 参数前缀
   */
  parameterPrefix?: string;

  /**
   * 变量前缀
   */
  variantPrefix: string;

  /**
   * 返回参数名称
   */
  returnParameterName?: string;

  /**
   * 集合别名连接词，默认为 'AS'
   */
  setsAliasJoinWith?: string;

  /**
   * 输出参数尾词，默认为 'OUT'
   */
  parameterOutWord?: string;

  /**
   * 字段别名连接字符器，默认为 'AS'
   */
  fieldAliasJoinWith?: string;

  /**
   * 语句结尾
   */
  statementEnd?: string;
}

const DEFAULT_COMPILE_OPTIONS: SqlOptions = {
  strict: true,

  defaultSchema: 'dbo',

  /**
   * 标识符引用，左
   */
  quotedLeft: '"',
  /**
   * 标识符引用，右
   */
  quotedRight: '"',

  /**
   * 参数前缀
   */
  parameterPrefix: '@',

  statementEnd: ';',

  /**
   * 变量前缀
   */
  variantPrefix: '',
  /**
   * 返回参数名称
   */
  returnParameterName: '__RETURN_VALUE__',
};

/**
 * AST到SQL的编译器基类，包含大部分标准实现
 */
export abstract class SqlUtil {
  constructor(public provider: DbProvider, options?: SqlOptions) {
    this.options = Object.assign({}, DEFAULT_COMPILE_OPTIONS, options);
  }

  readonly options: SqlOptions;

  /**
   * 转译器
   */
  get translator(): StandardTranslator {
    return this.provider.stdTranslator;
  }

  sqlifyObjectName(name: XObjectName, builtIn = false): string {
    // TIPS: buildIn 使用小写原因是数据库默认值会被自动转换为小写从而产生结果差异，造成不必要的数据架构变化。
    if (Raw.isRaw(name)) {
      return name.$sql;
    }
    if (typeof name === 'string') {
      name = this.parseObjectName(name);
    }
    let str = builtIn ? name.name : this.quoted(name.name);
    if (name.schema) {
      str = this.quoted(name.schema) + '.' + str;
    }
    if (name.database) {
      str = this.quoted(name.database) + '.' + str;
    }
    return str;
  }

  protected sqlifyField(field: Field | Raw): string {
    if (Raw.isRaw(field)) {
      return field.$sql;
    }
    let sql: string = '';
    if (field.$table) {
      sql = this.sqlifyRowsetName(field.$table, true);
      sql += '.' + this.quoted(field.$name);
      return sql;
    }
    return this.quoted(field.$name);
  }

  /**
   * 通过模板参数创建一个SQL命令
   */
  public sql(arr: TemplateStringsArray, ...paramValues: any[]): string {
    // const params: Parameter[] = [];
    let sql: string = arr[0];
    for (let i = 0; i < arr.length - 1; i++) {
      sql += this.sqlifyLiteral(paramValues[i]);
      sql += arr[i + 1];
    }
    return sql;
  }

  abstract sqlifyType(type: DbType | Raw): string;

  /**
   * 将原始SQL类型转换为DbType
   * @param type
   */
  abstract parseRawType(type: string): DbType;

  /**
   *
   * @param operation 将标准操作编译成AST
   */
  protected translationStandardOperation<T extends Scalar>(
    operation: StandardExpression<T>
  ): Expression<T>;
  protected translationStandardOperation<T extends Scalar>(
    operation: StandardStatement
  ): Statement;
  protected translationStandardOperation<T extends Scalar>(
    operation: StandardCondition
  ): Condition;
  protected translationStandardOperation<T extends Scalar>(
    operation: StandardExpression<T> | StandardStatement | StandardCondition
  ): Expression<T> | Statement | Condition {
    const transFn = Reflect.get(this.translator, operation.$name);
    return transFn.call(this.translator, ...operation.$datas);
  }

  /**
   * 编译Insert语句中的字段，取掉表别名
   * @param field 字段
   */
  protected sqlifyInsertField(field: Field<Scalar, string>): string {
    if (typeof field.$name === 'string') return this.quoted(field.$name);
    return this.quoted(field.$name[0]);
  }

  /**
   * 标识符转换，避免关键字被冲突问题
   * @param {string} name 标识符
   */
  quoted(name: string): string {
    if (this.options.strict) {
      return (
        this.options.quotedLeft +
        name.replace(
          this.options.quotedRight,
          this.options.quotedRight + this.options.quotedRight
        ) +
        this.options.quotedRight
      );
    }
    return name;
  }

  /**
   * 向参数列表中添加参数并返回当前参数的参数名
   * @param {array} values 参数列表
   * @param {any} value 参数值
   */
  protected sqlifyParameter(
    param: Parameter<Scalar, string>,
    params: Set<Parameter<Scalar, string>>
  ): string {
    if (!params) {
      throw new Error(`Params must provide when use parameter`);
    }
    params.add(param);
    return this.sqlifyParameterName(param);
  }

  protected sqlifyParameterName(p: Parameter<Scalar, string>): string {
    return this.options.parameterPrefix + (p.$name || '');
  }

  protected sqlifyVariantName(name: string): string {
    return this.options.variantPrefix + name;
  }

  protected sqlifyTableVariantName(name: string): string {
    return this.options.variantPrefix + name;
  }

  protected sqlifyIdentifier(identifier: DBObject<string>): string {
    return this.sqlifyObjectName(identifier.$name, identifier.$builtin);
  }

  // /**
  //  * 通过模板参数创建一个SQL命令
  //  */
  // makeCommand(arr: TemplateStringsArray, ...paramValues: any[]): Command {
  //   const params: Parameter[] = [];
  //   let sql: string = arr[0];
  //   for (let i = 0; i < arr.length - 1; i++) {
  //     const name = "__p__" + i;
  //     const param = SQL.input(name, paramValues[i]);
  //     sql += this.stringifyParameterName(param);
  //     sql += arr[i + 1];
  //     params.push(param);
  //   }
  //   return {
  //     sql,
  //     params,
  //   };
  // }

  protected sqlifyVariant(variant: Variant): string {
    return this.sqlifyVariantName(variant.$name);
  }

  /**
   * 编译字面量
   */
  public abstract sqlifyLiteral(literal: Scalar | Raw, type?: DbType): string;

  /**
   * 将AST编译成一个可供执行的命令
   */
  public sqlify(ast: Statement | Document | Raw): Command {
    const params = new Set<Parameter<Scalar, string>>();
    let sql: string;
    if (Raw.isRaw(ast)) {
      return {
        sql: ast.$sql,
      };
    }

    if (Document.isDocument(ast)) {
      sql = this.sqlifyDocument(ast, params);
    } else {
      sql = this.sqlifyStatement(ast, params);
    }
    return {
      sql,
      params: Array.from(params),
    };
  }

  abstract parseObjectName(name: XObjectName): ObjectName;

  protected sqlifyStatement(
    /**
     * AST
     */
    statement: Statement | Raw,
    /**
     * 参数容器
     */
    params?: Set<Parameter<Scalar, string>>,
    /**
     * 父级AST
     */
    parent?: SQL
  ): string {
    if (Raw.isRaw(statement)) {
      return statement.$sql;
    }
    if (Annotation.isAnnotation(statement)) {
      return this.sqlifyAnnotation(statement);
    }

    if (Select.isSelect(statement)) {
      return this.sqlifySelect(statement, params, parent);
    } else if (Update.isUpdate(statement)) {
      return this.sqlifyUpdate(statement, params, parent);
    } else if (Insert.isInsert(statement)) {
      return this.sqlifyInsert(statement, params, parent);
    } else if (Delete.isDelete(statement)) {
      return this.sqlifyDelete(statement, params, parent);
    } else if (Declare.isDeclare(statement)) {
      return this.sqlifyDeclare(statement);
    } else if (Execute.isExecute(statement)) {
      return this.sqlifyExecute(statement, params!, parent);
    } else if (Assignment.isAssignment(statement)) {
      return this.sqlifyAssignment(statement, params, parent);
    } else if (CreateTable.isCreateTable(statement)) {
      return this.sqlifyCreateTable(statement);
    } else if (AlterTable.isAlterTable(statement)) {
      return this.sqlifyAlterTable(statement);
    } else if (DropTable.isDropTable(statement)) {
      return this.sqlifyDropTable(statement);
    } else if (CreateView.isCreateView(statement)) {
      return this.sqlifyCreateView(statement);
    } else if (AlterView.isAlterView(statement)) {
      return this.sqlifyAlterView(statement);
    } else if (DropView.isDropView(statement)) {
      return this.sqlifyDropView(statement);
    } else if (CreateProcedure.isCreateProcedure(statement)) {
      return this.sqlifyCreateProcedure(statement);
    } else if (AlterProcedure.isAlterProcedure(statement)) {
      return this.sqlifyAlterProcedure(statement);
    } else if (DropProcedure.isDropProcedure(statement)) {
      return this.sqlifyDropProcedure(statement);
    } else if (CreateFunction.isCreateFunction(statement)) {
      return this.sqlifyCreateFunction(statement);
    } else if (AlterFunction.isAlterFunction(statement)) {
      return this.sqlifyAlterFunction(statement);
    } else if (DropFunction.isDropFunction(statement)) {
      return this.sqlifyDropFunction(statement);
    } else if (CreateIndex.isCreateIndex(statement)) {
      return this.sqlifyCreateIndex(statement);
    } else if (DropIndex.isDropIndex(statement)) {
      return this.sqlifyDropIndex(statement);
    } else if (CreateSequence.isCreateSequence(statement)) {
      return this.sqlifyCreateSequence(statement);
    } else if (DropSequence.isDropSequence(statement)) {
      return this.sqlifyDropSequence(statement);
    } else if (Block.isBlock(statement)) {
      return this.sqlifyBlock(statement, params);
    } else if (StandardStatement.isStandardStatement(statement)) {
      return this.sqlifyStatement(
        this.translationStandardOperation(statement),
        params
      );
    } else if (Return.isReturn(statement)) {
      return this.sqlifyReturn(statement, params);
    } else if (If.isIf(statement)) {
      return this.sqlifyIf(statement, params);
    } else if (While.isWhile(statement)) {
      return this.sqlifyWhile(statement, params);
    } else if (Break.isBreak(statement)) {
      return this.sqlifyBreak(statement);
    } else if (Continue.isContinue(statement)) {
      return this.sqlifyContinue(statement);
    } else if (CreateDatabase.isCreateDatabase(statement)) {
      return this.sqlifyCreateDatabase(statement);
    } else if (AlterDatabase.isAlterDatabase(statement)) {
      return this.sqlifyAlterDatabase(statement);
    } else if (DropDatabase.isDropDatabase(statement)) {
      return this.sqlifyDropDatabase(statement);
    } else if (Use.isUse(statement)) {
      return this.sqlifyUse(statement);
    }
    throw this._invalidAST('statement', statement);
  }
  sqlifyReturn(
    statement: Return,
    params: Set<Parameter<Scalar, string>> | undefined
  ): string {
    let sql = 'RETURN';
    if (statement.$value) {
      sql += ' ' + this.sqlifyExpression(statement.$value);
    }
    return sql;
  }
  sqlifyUse(statement: Use): string {
    return `USE ${this.sqlifyObjectName(statement.$database)}`;
  }

  private _invalidAST(type: string, value: any): Error {
    console.debug(`Invalid ${type} AST：`, value);
    return new Error(`Invalid ${type} AST.`);
  }

  abstract sqlifyContinue(statement: Continue): string;
  abstract sqlifyBreak(statement: Break): string;
  abstract sqlifyWhile(
    statement: While,
    params?: Set<Parameter<Scalar, string>>
  ): string;
  abstract sqlifyIf(
    statement: If,
    params?: Set<Parameter<Scalar, string>>
  ): string;

  protected sqlifyStatements(
    statements: Statement[],
    /**
     * 参数容器
     */
    params?: Set<Parameter<Scalar, string>>
  ): string {
    return statements
      .map(statement => this.sqlifyStatement(statement, params))
      .join('\n');
  }

  protected abstract sqlifyAnnotation(statement: Annotation): string;

  protected abstract sqlifyDropSequence(statement: DropSequence): string;

  protected abstract sqlifyCreateSequence(statement: CreateSequence): string;

  protected abstract sqlifyBlock(
    statement: Block,
    /**
     * 参数容器
     */ params?: Set<Parameter<Scalar, string>>
  ): string;

  protected abstract sqlifyDropIndex(statement: DropIndex): string;

  protected abstract sqlifyCreateIndex(statement: CreateIndex): string;

  protected abstract sqlifyDropFunction(statement: DropFunction): string;

  protected abstract sqlifyAlterFunction(statement: AlterFunction): string;

  protected abstract sqlifyCreateFunction(statement: CreateFunction): string;

  protected abstract sqlifyDropProcedure(statement: DropProcedure): string;

  protected abstract sqlifyAlterProcedure(statement: AlterProcedure): string;

  protected abstract sqlifyCreateProcedure(statement: CreateProcedure): string;

  protected sqlifyAlterView(statement: AlterView<any, string>): string {
    this.assertAst(statement.$body, 'AlterView has no body statement.');
    return `ALTER VIEW ${this.sqlifyObjectName(
      statement.$name
    )} AS ${this.sqlifySelect(statement.$body)}`;
  }

  protected sqlifyDropView(statement: DropView): string {
    return `DROP VIEW ${this.sqlifyObjectName(statement.$name)}`;
  }

  protected sqlifyCreateView(statement: CreateView<any, string>): string {
    this.assertAst(
      statement.$body,
      'CreateView statement has no statements body.'
    );
    return `CREATE VIEW ${this.sqlifyObjectName(
      statement.$name
    )} AS ${this.sqlifySelect(statement.$body)}`;
  }

  protected sqlifyDropTable(statement: DropTable): string {
    return `DROP TABLE ${this.sqlifyObjectName(statement.$name)}`;
  }

  protected abstract sqlifyAlterTable(statement: AlterTable): string;

  protected abstract sqlifyCreateTable(statement: CreateTable): string;

  protected abstract sqlifyCreateDatabase(statement: CreateDatabase): string;

  protected abstract sqlifyAlterDatabase(statement: AlterDatabase): string;

  protected abstract sqlifyDropDatabase(statement: DropDatabase): string;

  protected sqlifyGroupExpression(
    expr: GroupExpression<Scalar>,
    params?: Set<Parameter<Scalar, string>>
  ): string {
    return `(${this.sqlifyExpression(expr.$inner, params, expr)})`;
  }

  /**
   * SELECT 语句 当值使用
   */
  protected sqlifyValuedSelect(
    expr: ValuedSelect<Scalar>,
    params?: Set<Parameter<Scalar, string>>,
    parent?: SQL
  ): string {
    return `(${this.sqlifySelect(expr.$select, params, parent)})`;
  }

  protected sqlifyOperation(
    operation: Operation,
    params?: Set<Parameter<Scalar, string>>,
    parent?: SQL
  ): string {
    if (UnaryOperation.isUnaryOperation(operation)) {
      return this.sqlifyUnaryOperation(operation, params, parent);
    }

    if (BinaryOperation.isBinaryOperation(operation)) {
      return this.sqlifyBinaryOperation(operation, params);
    }

    throw this._invalidAST('operation', operation);
  }

  protected sqlifyUnaryOperation(
    opt: UnaryOperation<Scalar>,
    params?: Set<Parameter<Scalar, string>>,
    parent?: SQL
  ): string {
    return opt.$operator + this.sqlifyExpression(opt.$value, params, parent);
  }

  protected sqlifyRowsetName(rowset: Rowset | Raw, forField = false): string {
    if (Raw.isRaw(rowset)) return rowset.$sql;
    if (rowset.$alias) {
      return this.quoted(rowset.$alias);
    }
    // 如果是表变量
    if (TableVariant.isTableVariant(rowset)) {
      const result = this.sqlifyTableVariantName(rowset.$name);
      if (forField) {
        return this.quoted(result);
      }
      return result;
    }
    if (rowset.$name) {
      return this.sqlifyObjectName(rowset.$name);
    }
    throw new Error('Rowset must have alias or name.');
  }

  protected sqlifyNamedSelect(
    rowset: NamedSelect,
    params?: Set<Parameter<Scalar, string>>
  ): string {
    return (
      '(' +
      this.sqlifySelect(rowset.$select, params, rowset) +
      ') AS ' +
      this.sqlifyRowsetName(rowset)
    );
  }

  // protected sqlifyTableInvoke(): string {
  //   throw new Error('Method not implemented.');
  // }

  protected sqlifyBuildIn(buildIn: BuiltIn<string>): string {
    return buildIn.$name;
  }

  protected sqlifyColumn(
    column: SelectColumn<Scalar, string> | Star | Expression<Scalar> | Raw,
    params?: Set<Parameter<Scalar, string>>,
    parent?: SQL
  ): string {
    if (SelectColumn.isSelectColumn(column)) {
      return `${this.sqlifyExpression(
        column.$expr,
        params,
        column
      )} AS ${this.quoted(column.$name)}`;
    }
    if (Raw.isRaw(column)) {
      return column.$sql;
    }
    if (BuiltIn.isBuiltIn(column)) {
      return this.sqlifyBuildIn(column);
    }
    if (Star.isStar(column)) {
      return this.sqlifyStar(column);
    }
    if (Literal.isLiteral(column)) {
      // 自动附带常量返回类型
      return this.sqlifyLiteral(column.$value, column.$dbType || Literal.parseValueType(column.$value))
    }
    return this.sqlifyExpression(column, params, parent);
  }

  protected sqlifyWithSelect(
    item: WithSelect<any> | Raw,
    params?: Set<Parameter<Scalar, string>>,
    parent?: SQL
  ): string {
    if (Raw.isRaw(item)) return item.$sql;
    return `${this.quoted(item.$name)} AS (${this.sqlifySelect(
      item.$select,
      params,
      parent
    )})`;
  }

  protected sqlifyWith(
    withs: With | Raw,
    params?: Set<Parameter<Scalar, string>>
  ): string {
    if (Raw.isRaw(withs)) return withs.$sql;
    return (
      'WITH ' +
      withs.$rowsets
        .map(item => this.sqlifyWithSelect(item, params, withs))
        .join(', ')
    );
  }

  /**
   * 将多段SQL合成一个字符串
   * @param sqls
   */
  public abstract joinBatchSql(...sqls: string[]): string;

  protected sqlifyDocument(
    doc: Document,
    params?: Set<Parameter<Scalar, string>>
  ): string {
    return doc.statements
      .map(statement => this.sqlifyStatement(statement, params, doc))
      .join('\n');
  }

  protected abstract sqlifyExecute(
    exec: Execute,
    params: Set<Parameter<Scalar, string>>,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    parent?: SQL
  ): string;

  protected sqlifyInvokeArgumentList(
    args: Expression<Scalar>[],
    params?: Set<Parameter<Scalar, string>>,
    parent?: SQL
  ): string {
    return args
      .map(expr => this.sqlifyExpression(expr, params, parent))
      .join(', ');
  }

  protected abstract sqlifyDirection(direction: PARAMETER_DIRECTION): string;

  protected sqlifyExecuteArgumentList(
    args: Expression<Scalar>[],
    params?: Set<Parameter<Scalar, string>>,
    parent?: SQL
  ): string {
    return args
      .map(ast => {
        let sql = this.sqlifyExpression(ast, params, parent);
        if (Parameter.isParameter(ast)) {
          sql += ' ' + this.sqlifyDirection(ast.direction);
        }
        return sql;
      })
      .join(', ');
  }

  protected sqlifyUnion(
    union: Union,
    params?: Set<Parameter<Scalar, string>>
  ): string {
    return (
      'UNION ' +
      (union.$all ? 'ALL ' : '') +
      (Select.isSelect(union.$select)
        ? this.sqlifySelect(union.$select, params, union)
        : this.sqlifyRowsetName(union.$select))
    );
  }

  protected sqlifyCase(
    caseExpr: Case<any>,
    params?: Set<Parameter<Scalar, string>>,
    parent?: SQL
  ): string {
    let fragment = 'CASE';
    if (caseExpr.$expr)
      fragment += ' ' + this.sqlifyExpression(caseExpr.$expr, params, parent);
    fragment +=
      ' ' +
      caseExpr.$whens.map(when => this.sqlifyWhen(when, params)).join(' ');
    if (caseExpr.$default)
      fragment +=
        ' ELSE ' + this.sqlifyExpression(caseExpr.$default, params, caseExpr);
    fragment += ' END';
    return fragment;
  }

  protected sqlifyWhen(
    when: When<any> | Raw,
    params?: Set<Parameter<Scalar, string>>
  ): string {
    if (Raw.isRaw(when)) return when.$sql;
    return (
      'WHEN ' +
      (Condition.isCondition(when.$expr)
        ? this.sqlifyCondition(when.$expr, params, when)
        : this.sqlifyExpression(when.$expr, params, when)) +
      ' THEN ' +
      this.sqlifyExpression(when.$value, params, when)
    );
  }

  protected sqlifyGroupCondition(
    expr: GroupCondition,
    params?: Set<Parameter<Scalar, string>>
  ): string {
    return '(' + this.sqlifyCondition(expr.$inner, params, expr) + ')';
  }

  protected sqlifyBinaryLogicCondition(
    expr: BinaryLogicCondition,
    params?: Set<Parameter<Scalar, string>>
  ): string {
    return (
      this.sqlifyCondition(expr.$left, params, expr) +
      ' ' +
      expr.$operator +
      ' ' +
      this.sqlifyCondition(expr.$right, params, expr)
    );
  }

  protected sqlifyBinaryCompareCondition(
    expr: BinaryCompareCondition,
    params?: Set<Parameter<Scalar, string>>
  ): string {
    return (
      this.sqlifyExpression(expr.$left, params, expr) +
      ' ' +
      expr.$operator +
      ' ' +
      (Array.isArray(expr.$right)
        ? '(' +
          expr.$right.map(p => this.sqlifyExpression(p, params, expr)) +
          ')'
        : this.sqlifyExpression(expr.$right, params, expr))
    );
  }

  protected sqlifyBinaryOperation(
    expr: BinaryOperation<Scalar>,
    params?: Set<Parameter<Scalar, string>>
  ): string {
    return (
      this.sqlifyExpression(expr.$left, params, expr) +
      ' ' +
      expr.$operator +
      ' ' +
      this.sqlifyExpression(expr.$right, params, expr)
    );
  }

  protected sqlifyUnaryCompareCondition(
    expr: UnaryCompareCondition,
    params?: Set<Parameter<Scalar, string>>
  ): string {
    return (
      this.sqlifyExpression(expr.$expr, params, expr) + ' ' + expr.$operator
    );
  }

  protected sqlifyExistsCondition(
    expr: ExistsCondition,
    params?: Set<Parameter<Scalar, string>>
  ): string {
    return 'EXISTS(' + this.sqlifySelect(expr.$statement, params, expr) + ')';
  }

  protected sqlifyUnaryLogicCondition(
    expr: UnaryLogicCondition,
    params?: Set<Parameter<Scalar, string>>
  ): string {
    return (
      expr.$operator + ' ' + this.sqlifyCondition(expr.$condition, params, expr)
    );
  }

  public sqlifyExpression(
    expr: Expression<Scalar> | Raw,
    params?: Set<Parameter<Scalar, string>>,
    parent?: SQL
  ): string {
    if (Raw.isRaw(expr)) {
      return expr.$sql;
    }
    // 编译标准操作
    if (StandardExpression.isStandardExpression(expr)) {
      return this.sqlifyExpression(
        this.translationStandardOperation(expr),
        params,
        parent
      );
    }

    if (Literal.isLiteral(expr)) {
      return this.sqlifyLiteral(expr.$value, expr.$dbType);
    }

    if (Operation.isOperation(expr)) {
      return this.sqlifyOperation(expr, params, parent);
    }

    if (Field.isField(expr)) {
      return this.sqlifyField(expr);
    }

    if (GroupExpression.isGroupExpression(expr)) {
      return this.sqlifyGroupExpression(expr, params);
    }

    if (ValuedSelect.isValuedSelect(expr)) {
      return this.sqlifyValuedSelect(expr, params, parent);
    }

    if (Variant.isVariant(expr)) {
      return this.sqlifyVariantName(expr.$name);
    }

    if (Parameter.isParameter(expr)) {
      return this.sqlifyParameter(expr, params!);
    }

    if (ScalarFuncInvoke.isScalarFuncInvoke(expr)) {
      return this.sqlifyFuncInvoke(expr, params);
    }

    if (Case.isCase(expr)) {
      return this.sqlifyCase(expr, params, parent);
    }
    throw this._invalidAST('expression', expr);
  }

  protected sqlifyScalarInvokeArgs(
    arg: Expression | Star | BuiltIn,
    params?: Set<Parameter>,
    parent?: SQL
  ): string {
    if (Star.isStar(arg)) return this.sqlifyStar(arg);
    if (BuiltIn.isBuiltIn(arg)) return this.sqlifyBuildIn(arg);
    return this.sqlifyExpression(arg, params, parent);
  }
  protected sqlifyStar(arg: Star<any>): string {
    const sql = '';
    if (arg.$table) {
      return `${this.sqlifyRowsetName(arg.$table, true)}.*`;
    }
    return '*';
  }
  /**
   * 函数调用
   * @param {*} invoke
   * @param {*} params
   * @returns
   * @memberof Executor
   */
  protected sqlifyFuncInvoke(
    invoke: ScalarFuncInvoke | TableFuncInvoke,
    params?: Set<Parameter<Scalar, string>>
  ): string {
    return `${this.sqlifyIdentifier(invoke.$func)}(${(invoke.$args || [])
      .map(v => this.sqlifyScalarInvokeArgs(v, params, invoke))
      .join(', ')})`;
  }

  protected sqlifyJoin(
    join: Join | Raw,
    params?: Set<Parameter<Scalar, string>>
  ): string {
    if (Raw.isRaw(join)) return join.$sql;
    return (
      (join.$left ? 'LEFT ' : '') +
      'JOIN ' +
      this.sqlifyFrom(join.$table, params, join) +
      ' ON ' +
      this.sqlifyCondition(join.$on, params, join)
    );
  }

  protected sqlifySort(
    sort: Sort | Raw,
    params?: Set<Parameter<Scalar, string>>
  ): string {
    if (Raw.isRaw(sort)) return sort.$sql;
    let sql: string;
    if (SelectColumn.isSelectColumn(sort.$expr)) {
      sql = this.quoted(sort.$expr.$name);
    } else {
      sql = this.sqlifyExpression(sort.$expr, params, sort);
    }
    if (sort.$direction) sql += ' ' + sort.$direction;
    return sql;
  }

  protected sqlifySelect(
    select: Select,
    params?: Set<Parameter<Scalar, string>>,
    parent?: SQL
  ): string {
    const {
      $with,
      $froms,
      $top,
      $joins,
      $union,
      $columns,
      $where,
      $sorts,
      $groups,
      $having,
      $offset,
      $limit,
      $distinct,
    } = select;
    let sql = '';
    if ($with) {
      sql += this.sqlifyWith($with, params);
    }
    sql += 'SELECT ';
    if ($distinct) {
      sql += 'DISTINCT ';
    }
    if (typeof $top === 'number') {
      sql += `TOP ${$top} `;
    }
    sql += $columns
      .map(col => this.sqlifyColumn(col, params, select))
      .join(', ');
    if ($froms) {
      sql +=
        ' FROM ' +
        $froms.map(table => this.sqlifyFrom(table, params, select)).join(', ');
    }
    if ($joins && $joins.length > 0) {
      sql += ' ' + $joins.map(join => this.sqlifyJoin(join, params)).join(' ');
    }
    if ($where) {
      sql += ' WHERE ' + this.sqlifyCondition($where, params, parent);
    }
    if ($groups && $groups.length) {
      sql +=
        ' GROUP BY ' +
        $groups.map(p => this.sqlifyExpression(p, params, parent)).join(', ');
    }
    if ($having) {
      sql += ' HAVING ' + this.sqlifyCondition($having, params, parent);
    }
    if ($sorts && $sorts.length > 0) {
      sql +=
        ' ORDER BY ' +
        $sorts.map(sort => this.sqlifySort(sort, params)).join(', ');
    }
    sql += this.sqlifyOffsetLimit(select, params);
    if ($union) {
      sql += ' ' + this.sqlifyUnion($union, params);
    }
    return sql;
  }

  protected sqlifyOffsetLimit(
    select: Select<any>,
    params?: Set<Parameter<Scalar, string>>
  ): string {
    let sql = '';
    if (typeof select.$offset === 'number') {
      sql += ` OFFSET ${select.$offset || 0}`;
    }
    if (typeof select.$limit === 'number') {
      sql += ` LIMIT ${select.$limit}`;
    }
    return sql;
  }

  protected sqlifyFrom(
    table: Rowset | Raw,
    params?: Set<Parameter<Scalar, string>>,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    parent?: SQL
  ): string {
    if (Raw.isRaw(table)) {
      return table.$sql;
    }
    if (Table.isTable(table) || WithSelect.isWithSelect(table)) {
      let sql = '';
      sql += this.sqlifyObjectName(table.$name);
      if (table.$alias) sql += ' AS ' + this.quoted(table.$alias);
      return sql;
    }
    if (TableVariant.isTableVariant(table)) {
      let sql = '';
      sql += this.sqlifyVariantName(table.$name);
      if (table.$alias) sql += ' AS ' + this.quoted(table.$alias);
      return sql;
    }
    // 如果是命名行集
    if (NamedSelect.isNamedSelect(table)) {
      return this.sqlifyNamedSelect(table, params);
    }
    if (TableFuncInvoke.isTableFuncInvoke(table)) {
      let sql = this.sqlifyFuncInvoke(table);
      if (table.$name) {
        sql += ' AS ' + this.quoted(table.$name);
      }
      return sql;
    }
    return this.sqlifyRowsetName(table);
  }

  public sqlifyCondition(
    condition: Condition | Raw,
    params?: Set<Parameter<Scalar, string>>,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    parent?: SQL
  ): string {
    if (Raw.isRaw(condition)) return condition.$sql;
    if (ExistsCondition.isExistsCondition(condition)) {
      return this.sqlifyExistsCondition(condition as ExistsCondition, params);
    }
    if (GroupCondition.isGroupCondition(condition)) {
      return this.sqlifyGroupCondition(condition as GroupCondition, params);
    }
    if (BinaryCompareCondition.isBinaryCompareCondition(condition)) {
      return this.sqlifyBinaryCompareCondition(
        condition as BinaryCompareCondition,
        params
      );
    }
    if (UnaryCompareCondition.isUnaryCompareCondition(condition)) {
      return this.sqlifyUnaryCompareCondition(
        condition as UnaryCompareCondition,
        params
      );
    }
    if (BinaryLogicCondition.isBinaryLogicCondition(condition)) {
      return this.sqlifyBinaryLogicCondition(
        condition as BinaryLogicCondition,
        params
      );
    }
    if (UnaryLogicCondition.isUnaryLogicCondition(condition)) {
      return this.sqlifyUnaryLogicCondition(
        condition as UnaryLogicCondition,
        params
      );
    }
    if (StandardCondition.isStandardCondition(condition)) {
      return this.sqlifyCondition(
        this.translationStandardOperation(condition),
        params,
        parent
      );
    }
    throw this._invalidAST('condition', condition);
  }

  protected assertAst(
    value: any,
    message: string = 'AST syntax error.'
  ): asserts value {
    if (!value) {
      throw new Error('AST syntax error:' + message);
    }
  }

  protected sqlifyInsert(
    insert: Insert,
    params?: Set<Parameter<Scalar, string>>,
    parent?: SQL
  ): string {
    const { $table, $values, $fields, $with } = insert;
    let sql = '';
    if ($with) {
      sql += this.sqlifyWith($with, params);
    }
    sql += 'INSERT INTO ';
    if ($table.$alias) {
      throw new Error('Insert statements do not allow aliases on table.');
    }
    sql += this.sqlifyRowsetName($table);

    if ($fields) {
      sql +=
        '(' +
        $fields.map(field => this.sqlifyInsertField(field)).join(', ') +
        ')';
    }

    this.assertAst($values);
    if (Array.isArray($values)) {
      sql += ' VALUES';
      sql += $values
        .map(
          row =>
            '(' +
            row
              .map(expr => this.sqlifyExpression(expr, params, parent))
              .join(', ') +
            ')'
        )
        .join(', ');
    } else {
      sql += ' ' + this.sqlifySelect($values, params, parent);
    }

    return sql;
  }

  protected sqlifyAssignment(
    assign: Assignment<Scalar>,
    params?: Set<Parameter<Scalar, string>>,
    parent?: SQL
  ): string {
    const { left, right } = assign;
    return (
      this.sqlifyExpression(left, params, parent) +
      ' = ' +
      this.sqlifyExpression(right, params, parent)
    );
  }

  protected abstract sqlifyTableVariantDeclare(declare: TableVariant): string;

  protected sqlifyVariantDeclare(varDec: Variant): string {
    return (
      this.sqlifyVariantName(varDec.$name) +
      ' ' +
      this.sqlifyType(varDec.$dbType)
    );
  }

  protected abstract sqlifyProcedureParameter(
    varDec: ProcedureParameter
  ): string;

  protected abstract sqlifyFunctionParameter(varDec: FunctionParameter): string;

  protected abstract sqlifyDeclare(declare: Declare): string;

  protected sqlifyUpdate(
    update: Update,
    params?: Set<Parameter<Scalar, string>>,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    parent?: SQL
  ): string {
    const { $table, $sets, $with, $where, $froms, $joins } = update;
    assert($table, 'table is required by update statement');
    assert($sets, 'set statement un declared');

    let sql = '';
    if ($with) {
      sql += this.sqlifyWith($with, params);
    }
    sql += 'UPDATE ';
    sql += this.sqlifyRowsetName($table);

    sql +=
      ' SET ' +
      $sets
        .map(
          assign =>
            this.sqlifyExpression(assign.left, params, parent) +
            ' = ' +
            this.sqlifyExpression(assign.right, params, parent)
        )
        .join(', ');

    if ($froms && $froms.length > 0) {
      sql +=
        ' FROM ' +
        $froms.map(table => this.sqlifyFrom(table, params, update)).join(', ');
    }

    if ($joins && $joins.length > 0) {
      sql += ' ' + $joins.map(join => this.sqlifyJoin(join, params)).join(' ');
    }
    if ($where) {
      sql += ' WHERE ' + this.sqlifyCondition($where, params, update);
    }
    return sql;
  }

  protected sqlifyDelete(
    del: Delete,
    params?: Set<Parameter<Scalar, string>>,
    parent?: SQL
  ): string {
    const { $table, $froms, $joins, $where, $with } = del;
    let sql = '';
    if ($with) {
      sql += this.sqlifyWith($with, params);
    }
    sql += 'DELETE ';
    if ($table) sql += this.sqlifyRowsetName($table);
    if ($froms && $froms.length > 0) {
      sql +=
        ' FROM ' +
        $froms.map(table => this.sqlifyFrom(table, params, parent)).join(', ');
    }

    if ($joins) {
      sql += $joins.map(join => this.sqlifyJoin(join, params)).join(' ');
    }
    if ($where) {
      sql += ' WHERE ' + this.sqlifyCondition($where, params, parent);
    }
    return sql;
  }
}
