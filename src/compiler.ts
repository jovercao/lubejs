import * as assert from "assert";

import {
  AST,
  Parameter,
  Identifier,
  Constant,
  When,
  Column,
  Declare,
  Delete,
  Insert,
  Assignment,
  Update,
  Select,
  ScalarFuncInvoke,
  Case,
  Variant,
  Join,
  Alias,
  Execute,
  Document,
  Union,
  SortInfo,
  UnaryLogicCondition,
  UnaryCompareCondition,
  UnaryOperation,
  BinaryLogicCondition,
  BinaryCompareCondition,
  BinaryOperation,
  ExistsCondition,
  Raw,
  GroupCondition,
  With,
  NamedSelect,
  Func,
  TableFuncInvoke,
  Expression,
  BuiltIn,
  Field,
  JsConstant,
  Name,
  Condition,
  Operation,
  Rowset,
  Star,
  Statement,
  Table,
  WithSelect,
} from "./ast";
import {
  SQL_SYMBOLE,
  PARAMETER_DIRECTION,
  IDENTOFIER_KIND,
  CONDITION_KIND,
  OPERATION_KIND,
} from "./constants";
import { Bracket, ValuedSelect } from './lube'
import { dateToString } from './util'

export interface Command {
  sql: string;
  params: Parameter[];
}

// TODO: 使用命令生成器优化SQL字符串拼接

/**
 * 编译选项
 */
export interface CompileOptions {
  /**
   * 是否启用严格模式，默认启用
   * 如果为false，则生成的SQL标识不会被[]或""包括
   */
  strict?: boolean;
  /**
   * 标识符引用，左
   */
  quotedLeft?: string;
  /**
   * 标识符引用，右
   */
  quotedRight?: string;

  /**
   * 参数前缀
   */
  parameterPrefix?: string;

  /**
   * 变量前缀
   */
  variantPrefix?: string;

  /**
   * 返回参数名称
   */
  returnParameterName?: string;
}

const DEFAULT_COMPILE_OPTIONS: CompileOptions = {
  strict: true,

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
  parameterPrefix: "@",

  /**
   * 变量前缀
   */
  variantPrefix: "@",
  /**
   * 返回参数名称
   */
  returnParameterName: '__RETURN_VALUE__'
};

/**
 * AST到SQL的编译器
 */
export class Compiler {
  options: CompileOptions;

  constructor(options?: CompileOptions) {
    this.options = Object.assign({}, DEFAULT_COMPILE_OPTIONS, options);
  }

  protected compileName(name: Name<string>, buildIn = false): string {
    if (Array.isArray(name)) {
      return name
        .map((n, index) => {
          if (index < name.length - 1) {
            return this.quoted(n);
          }
          return buildIn ? n : this.quoted(n);
        })
        .join(".");
    }
    return buildIn ? name : this.quoted(name);
  }

  /**
   * 编译Insert语句中的字段，取掉表别名
   * @param field 字段
   */
  protected compileInsertField(field: Field<JsConstant, string>) {
    if (typeof field.$name === 'string') return this.quoted(field.$name)
    return this.quoted(field.$name[field.$name.length - 1])
  }

  protected stringifyIdentifier(identifier: Identifier<string>): string {
    return this.compileName(identifier.$name, identifier.$builtin);
  }

  /**
   * 标识符转换，避免关键字被冲突问题
   * @param {string} name 标识符
   */
  protected quoted(name: string): string {
    if (this.options.strict) {
      return this.options.quotedLeft + name + this.options.quotedRight;
    }
    return name;
  }

  /**
   * 向参数列表中添加参数并返回当前参数的参数名
   * @param {array} values 参数列表
   * @param {any} value 参数值
   */
  protected compileParameter(
    param: Parameter<JsConstant, string>,
    params: Set<Parameter<JsConstant, string>>,
    parent: AST = null
  ): string {
    params.add(param);
    return this.pretreatmentParameterName(param);
  }

  public pretreatmentParameterName(p: Parameter<JsConstant, string>) {
    return this.options.parameterPrefix + (p.$name || "");
  }

  protected pretreatmentVariantName(name: string) {
    return this.options.variantPrefix + name;
  }

  protected compileVariant(
    variant: Variant<JsConstant, string>,
    params: Set<Parameter<JsConstant, string>>,
    parent?: AST
  ): string {
    return this.pretreatmentVariantName(variant.$name);
  }

  /**
   * 编译日期常量
   */
  protected compileDate(date: Date) {
    return `'${dateToString(date)}'`
  }

  /**
   * 编译Boolean常量
   */
  protected compileBoolean(value: boolean) {
    return value ? "1" : "0";
  }

  /**
   * 编译字符串常量
   */
  protected compileString(value: string) {
    return `'${value.replace(/'/g, "''")}'`;
  }

  /**
   * 编译常量
   */
  protected compileConstant(
    constant: Constant<JsConstant>,
    params?: Set<Parameter<JsConstant, string>>,
    parent?: AST
  ) {
    const value = constant.$value;
    // 为方便JS，允许undefined进入，留给TS语法检查
    if (value === null || value === undefined) {
      return "NULL";
    }

    if (typeof value === "string") {
      return this.compileString(value);
    }

    if (typeof value === "number" || typeof value === "bigint") {
      return value.toString(10);
    }

    if (typeof value === "boolean") {
      return this.compileBoolean(value);
    }

    if (value instanceof Date) {
      return this.compileDate(value);
    }
    if (value instanceof ArrayBuffer
      || value instanceof Uint8Array
      || value instanceof Uint16Array
      || value instanceof Uint32Array
      || value instanceof BigUint64Array
      || value instanceof Int8Array
      || value instanceof Int16Array
      || value instanceof Int32Array
      || value instanceof BigInt64Array
      || value instanceof Float32Array
      || value instanceof Float64Array
      || value instanceof Uint8ClampedArray
      || value instanceof SharedArrayBuffer) {
      return "0x" + Buffer.from(value).toString("hex");
    }
    console.debug(value);
    // @ts-ignore
    throw new Error("unsupport constant value type:" + typeof value);
  }

  public compile(ast: Statement | Document): Command {
    const params = new Set<Parameter<JsConstant, string>>();
    return {
      sql: this.compileAST(ast, params),
      params: Array.from(params),
    };
  }

  // TODO: 针对JS代码，确定是不需要建立验证规则
  // /**
  //  * 类型检查选项
  //  */
  // expect?: {
  //   /**
  //    * 错误时的警告消息
  //    */
  //   errMsg: string,
  //   /**
  //    * AST验证规则
  //    */
  //   rule: {
  //     $type: SQL_SYMBOLE,
  //     $kind?: IDENTOFIER_KIND
  //   }
  // }
  // if (expect && expect.$type !== ast.$type) {
  //   throw new Error(`Expect AST type ${expect.$type}, but ${ast.$type} found.`)
  // }
  // if (expect && expect.$kind !== identifier.$kind) {
  //   throw new Error(`expect identifier kind: ${expect.$kind}, but ${identifier.$kind} found.`)
  // }

  protected compileAST(
    /**
     * AST
     */
    ast: AST,
    /**
     * 参数容器
     */
    params: Set<Parameter<JsConstant, string>>,
    /**
     * 父级AST
     */
    parent?: AST
  ): string {
    switch (ast.$type) {
      case SQL_SYMBOLE.SELECT:
        return this.compileSelect(ast as Select<any>, params, parent);
      case SQL_SYMBOLE.UPDATE:
        return this.compileUpdate(ast as Update<any>, params, parent);
      case SQL_SYMBOLE.ASSIGNMENT:
        return this.compileAssignment(
          ast as Assignment<JsConstant>,
          params,
          parent
        );
      case SQL_SYMBOLE.INSERT:
        return this.compileInsert(ast as Insert<any>, params, parent);
      case SQL_SYMBOLE.DELETE:
        return this.compileDelete(ast as Delete<any>, params, parent);
      case SQL_SYMBOLE.DECLARE:
        return this.compileDeclare(ast as Declare, params, parent);
      case SQL_SYMBOLE.CONSTANT:
        return this.compileConstant(
          ast as Constant<JsConstant>,
          params,
          parent
        );
      case SQL_SYMBOLE.IDENTIFIER:
        return this.compileIdentifier(ast, params, parent);
      case SQL_SYMBOLE.EXECUTE:
        return this.compileExecute(ast as Execute<object>, params, parent);
      case SQL_SYMBOLE.TABLE_FUNCTION_INVOKE:
        return this.compileTableInvoke(
          ast as TableFuncInvoke<object>,
          params,
          parent
        );

      case SQL_SYMBOLE.SCALAR_FUNCTION_INVOKE:
        return this.compileScalarInvoke(
          ast as ScalarFuncInvoke<JsConstant>,
          params,
          parent
        );
      case SQL_SYMBOLE.CASE:
        return this.compileCase(ast as Case<any>, params, parent);
      case SQL_SYMBOLE.OPERATION:
        return this.compileOperation(
          ast as Operation<JsConstant>,
          params,
          parent
        );
      case SQL_SYMBOLE.BRACKET:
        return this.compileBracket(ast as Bracket<JsConstant>, params, parent)
      case SQL_SYMBOLE.VALUED_SELECT:
        return this.compileValuedSelect(ast as ValuedSelect<JsConstant>, params, parent);

      case SQL_SYMBOLE.CONDITION:
        this.compileCondtion(ast as Condition, params, parent);
      case SQL_SYMBOLE.JOIN:
        return this.compileJoin(ast as Join, params, parent);
      case SQL_SYMBOLE.UNION:
        return this.compileUnion(ast as Union<object>, params, parent);
      case SQL_SYMBOLE.SORT:
        return this.compileSort(ast as SortInfo, params, parent);
      case SQL_SYMBOLE.DOCUMENT:
        return this.compileDocument(ast as Document, params);
      case SQL_SYMBOLE.RAW:
        return (ast as Raw).$sql;
      case SQL_SYMBOLE.WITH:
        return this.compileWith(ast as With, params, parent);
      case SQL_SYMBOLE.STAR:
        return this.compileStar(ast as Star<object>, params, parent);
      default:
        throw new Error(`Error AST type: ${ast.$type} in ${parent?.$type}`);
    }
  }

  protected compileBracket(expr: Bracket<JsConstant>, params: Set<Parameter<JsConstant, string>>, parent: AST): string {
    return `(${this.compileExpression(expr.$inner, params, parent)})`;
  }

  /**
   * SELECT 语句 当值使用
   */
  protected compileValuedSelect(expr: ValuedSelect<JsConstant>, params: Set<Parameter<JsConstant, string>>, parent: AST): string {
    return `(${this.compileSelect(expr.$select, params, parent)})`
  }

  protected compileStar(
    star: Star<object>,
    params: Set<Parameter<JsConstant, string>>,
    parent: AST
  ): string {
    if (star.$parent) {
      return this.compileName(star.$parent) + ".*";
    }
    return "*";
  }

  protected compileOperation(
    ast: Operation<JsConstant>,
    params: Set<Parameter<JsConstant, string>>,
    parent: AST
  ) {
    switch ((ast as Operation<JsConstant>).$kind) {
      case OPERATION_KIND.BINARY:
        return this.compileBinaryOperation(
          ast as BinaryOperation<JsConstant>,
          params,
          parent
        );
      case OPERATION_KIND.UNARY:
        return this.compileUnaryOperation(
          ast as UnaryOperation<JsConstant>,
          params,
          parent
        );
    }
  }

  protected compileUnaryOperation(
    opt: UnaryOperation<JsConstant>,
    params: Set<Parameter<JsConstant, string>>,
    parent: AST
  ): string {
    return opt.$operator + this.compileExpression(opt.$value, params, parent);
  }

  /**
   * 编译
   * @param ast
   * @param params
   * @param parent
   */
  protected compileIdentifier(
    ast: AST,
    params: Set<Parameter<JsConstant, string>>,
    parent: AST
  ) {
    const identifier = ast as Identifier<string>;
    switch (identifier.$kind) {
      case IDENTOFIER_KIND.BUILD_IN:
        return this.compileBuildIn(identifier as BuiltIn<string>);
      case IDENTOFIER_KIND.COLUMN:
        return this.compileColumn(
          identifier as Column<JsConstant, string>,
          params,
          parent
        );
      case IDENTOFIER_KIND.TABLE:
        throw new Error('The Table AST is special and must be compiled independently.')
        // return this.compileRowsetName(ast as Table<object, string>);
      case IDENTOFIER_KIND.ALIAS:
      case IDENTOFIER_KIND.FIELD:
      case IDENTOFIER_KIND.FUNCTION:
      case IDENTOFIER_KIND.PROCEDURE:
        return this.stringifyIdentifier(identifier);
      case IDENTOFIER_KIND.VARIANT:
        return this.compileVariant(
          identifier as Variant<JsConstant, string>,
          params,
          parent
        );
      case IDENTOFIER_KIND.PARAMETER:
        return this.compileParameter(
          identifier as Parameter<JsConstant, string>,
          params,
          parent
        );
      // case IDENTOFIER_KIND.NAMED_ARGUMENT:
      //   return this.compileNamedArgument(identifier as NamedArgument<JsConstant, string>, params, parent)
    }
  }
  protected compileRowsetName(rowset: Rowset<object> | Raw) {
    if (rowset instanceof Raw) return rowset.$sql;
    // TODO: 兼容TableVariant
    if (rowset.$alias) {
      return this.stringifyIdentifier(rowset.$alias);
    }
    if (rowset instanceof Table) {
      return this.stringifyIdentifier(rowset);
    }
    throw new Error("行集必须要有名称，否则无法使用！");
  }

  protected compileNamedSelect(
    rowset: NamedSelect<object, string>,
    params: Set<Parameter<JsConstant, string>>,
    parent: AST
  ) {
    return (
      "(" +
      this.compileSelect(rowset.$statement, params, rowset) +
      `) AS ` +
      this.compileRowsetName(rowset)
    );
  }

  protected compileTableInvoke(
    arg0: TableFuncInvoke<object>,
    params: Set<Parameter<JsConstant, string>>,
    parent: AST
  ): string {
    throw new Error("Method not implemented.");
  }
  // compileNamedArgument(arg0: NamedArgument<JsConstant, string>, params: Set<Parameter<JsConstant, string>>, parent: AST): string {
  //   throw new Error("Method not implemented.");
  // }
  protected compileBuildIn(buildIn: BuiltIn<string>): string {
    return buildIn.$name;
  }

  protected compileColumn(
    column: Column<JsConstant, string> | Expression<JsConstant>,
    params: Set<Parameter<JsConstant, string>>,
    parent: AST
  ): string {
    if (column instanceof Column) {
      return `${this.compileExpression(column.$expr, params, column)} AS ${this.quoted(
        column.$name
      )}`;
    }
    return this.compileExpression(column, params, parent)
  }

  protected compileWithSelect(
    item: WithSelect<any, string> | Raw,
    params: Set<Parameter<JsConstant, string>>,
    parent: AST
  ) {
    if (item instanceof Raw) return item.$sql;
    return `${this.quoted(item.$alias.$name)} AS (${this.compileAST(
      item.$statement,
      params,
      parent
    )})`;
  }

  protected compileWith(
    withs: With | Raw,
    params: Set<Parameter<JsConstant, string>>,
    parent: AST
  ): string {
    if (withs instanceof Raw) return withs.$sql;
    return (
      "WITH " +
      withs.$items
        .map((item) => this.compileWithSelect(item, params, withs))
        .join(", ")
    );
  }

  protected compileDocument(
    doc: Document,
    params: Set<Parameter<JsConstant, string>>
  ) {
    return doc.statements
      .map((statement) => this.compileAST(statement, params, doc))
      .join("\n");
  }

  protected compileExecute<T extends AST>(
    exec: Execute<object>,
    params: Set<Parameter<JsConstant, string>>,
    parent?: AST
  ): string {
    const returnParam = Parameter.output(this.options.returnParameterName, Number);
    return (
      "EXECUTE " +
      this.compileParameter(returnParam, params, parent) +
      " = " +
      this.compileIdentifier(exec.$proc, params, exec) +
      " " +
      this.compileExecuteArgumentList(exec.$args, params, exec)
    );
  }

  protected compileInvokeArgumentList(
    args: Expression<JsConstant>[],
    params: Set<Parameter<JsConstant, string>>,
    parent?: AST
  ): string {
    return args
      .map((expr) => this.compileExpression(expr, params, parent))
      .join(", ");
  }

  protected compileExecuteArgumentList(
    args: Expression<JsConstant>[],
    params: Set<Parameter<JsConstant, string>>,
    parent?: AST
  ): string {
    return args
      .map((ast) => {
        let sql = this.compileExpression(ast, params, parent);
        if (
          ast instanceof Parameter &&
          (ast as Parameter<JsConstant, string>).direction ===
            PARAMETER_DIRECTION.OUTPUT
        ) {
          sql += " OUTPUT";
        }
        return sql;
      })
      .join(", ");
  }

  protected compileUnion(
    union: Union<object>,
    params: Set<Parameter<JsConstant, string>>,
    parent?: AST
  ): string {
    return (
      "UNION " +
      (union.$all ? "ALL " : "") +
      this.compileAST(union.$select, params, union)
    );
  }

  protected compileCase(
    caseExpr: Case<any>,
    params: Set<Parameter<JsConstant, string>>,
    parent?: AST
  ): string {
    let fragment = "CASE";
    if (caseExpr.$expr)
      fragment += " " + this.compileAST(caseExpr.$expr, params, parent);
    fragment +=
      " " +
      caseExpr.$whens
        .map((when) => this.compileWhen(when, params, caseExpr))
        .join(" ");
    if (caseExpr.$default)
      fragment +=
        " ELSE " + this.compileAST(caseExpr.$default, params, caseExpr);
    fragment += " END";
    return fragment;
  }

  protected compileWhen(
    when: When<any> | Raw,
    params: Set<Parameter<JsConstant, string>>,
    parent?: AST
  ): string {
    if (when instanceof Raw) return when.$sql;
    return (
      "WHEN " +
      this.compileAST(when.$expr, params, when) +
      " THEN " +
      this.compileAST(when.$value, params, when)
    );
  }

  protected compileGroupCondition(
    expr: GroupCondition,
    params: Set<Parameter<JsConstant, string>>,
    parent?: AST
  ): string {
    return "(" + this.compileCondtion(expr.context, params, expr) + ")";
  }

  protected compileBinaryLogicCondition(
    expr: BinaryLogicCondition,
    params: Set<Parameter<JsConstant, string>>,
    parent?: AST
  ): string {
    return (
      this.compileCondtion(expr.$left, params, expr) +
      " " +
      expr.$operator +
      " " +
      this.compileCondtion(expr.$right, params, expr)
    );
  }

  protected compileBinaryCompareCondition(
    expr: BinaryCompareCondition,
    params: Set<Parameter<JsConstant, string>>,
    parent?: AST
  ): string {
    return (
      this.compileAST(expr.$left, params, expr) +
      " " +
      expr.$operator +
      " " +
      (Array.isArray(expr.$right)
        ? "(" +
          expr.$right.map((p) => this.compileExpression(p, params, expr)) +
          ")"
        : this.compileExpression(expr.$right, params, expr))
    );
  }

  protected compileBinaryOperation(
    expr: BinaryOperation<JsConstant>,
    params: Set<Parameter<JsConstant, string>>,
    parent?: AST
  ): string {
    return (
      this.compileAST(expr.$left, params, expr) +
      " " +
      expr.$operator +
      " " +
      this.compileAST(expr.$right, params, expr)
    );
  }

  protected compileUnaryCompareCondition(
    expr: UnaryCompareCondition,
    params: Set<Parameter<JsConstant, string>>,
    parent?: AST
  ): string {
    return this.compileAST(expr.$expr, params, expr) + " " + expr.$operator;
  }

  protected compileExistsCondition(
    expr: ExistsCondition,
    params: Set<Parameter<JsConstant, string>>,
    parent?: AST
  ): string {
    return "EXISTS(" + this.compileSelect(expr.$statement, params, expr) + ")";
  }

  protected compileUnaryLogicCondition(
    expr: UnaryLogicCondition,
    params: Set<Parameter<JsConstant, string>>,
    parent?: AST
  ): string {
    return (
      expr.$operator + " " + this.compileAST(expr.$condition, params, expr)
    );
  }

  // TODO: 是否需要类型判断以优化性能
  protected compileExpression(
    expr: Expression<JsConstant> | Raw,
    params: Set<Parameter<JsConstant, string>>,
    parent?: AST
  ) {
    if (expr instanceof Raw) {
      return expr.$sql;
    }
    return this.compileAST(expr, params, parent);
  }

  protected compileUnaryCalculate(
    expr: UnaryOperation<JsConstant>,
    params: Set<Parameter<JsConstant, string>>,
    parent?: AST
  ): string {
    return expr.$operator + " " + this.compileAST(expr.$value, params, expr);
  }

  /**
   * 函数调用
   * @param {*} invoke
   * @param {*} params
   * @returns
   * @memberof Executor
   */
  protected compileScalarInvoke(
    invoke: ScalarFuncInvoke<JsConstant>,
    params: Set<Parameter<JsConstant, string>>,
    parent?: AST
  ): string {
    return `${this.stringifyIdentifier(invoke.$func)}(${(invoke.$args || [])
      .map((v) => this.compileExpression(v, params, invoke))
      .join(", ")})`;
  }

  protected compileJoin(
    join: Join | Raw,
    params: Set<Parameter<JsConstant, string>>,
    parent?: AST
  ): string {
    if (join instanceof Raw) return join.$sql;
    return (
      (join.$left ? "LEFT " : "") +
      "JOIN " +
      this.compileFrom(join.$table, params, join) +
      " ON " +
      this.compileCondtion(join.$on, params, join)
    );
  }

  protected compileSort(
    sort: SortInfo | Raw,
    params: Set<Parameter<JsConstant, string>>,
    parent?: AST
  ): string {
    if (sort instanceof Raw) return sort.$sql;
    let sql = this.compileAST(sort.$expr, params, sort);
    if (sort.$direction) sql += " " + sort.$direction;
    return sql;
  }

  protected compileSelect(
    select: Select<object>,
    params: Set<Parameter<JsConstant, string>>,
    parent?: AST
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
    let sql = "";
    if ($with) {
      sql += this.compileWith($with, params, parent);
    }
    sql += "SELECT ";
    if ($distinct) {
      sql += "DISTINCT ";
    }
    if (typeof $top === "number") {
      sql += `TOP ${$top} `;
    }
    sql += $columns
      .map((col) => this.compileColumn(col, params, select))
      .join(", ");
    if ($froms) {
      sql +=
        " FROM " +
        $froms
          .map((table) => this.compileFrom(table, params, select))
          .join(", ");
    }
    if ($joins && $joins.length > 0) {
      sql +=
        " " +
        $joins.map((join) => this.compileJoin(join, params, parent)).join(" ");
    }
    if ($where) {
      sql += " WHERE " + this.compileCondtion($where, params, parent);
    }
    if ($groups && $groups.length) {
      sql +=
        " GROUP BY " +
        $groups.map((p) => this.compileExpression(p, params, parent)).join(", ");
    }
    if ($having) {
      sql += " HAVING " + this.compileCondtion($having, params, parent);
    }
    if ($sorts && $sorts.length > 0) {
      sql +=
        " ORDER BY " +
        $sorts.map((sort) => this.compileSort(sort, params, parent)).join(", ");
    }

    if (typeof $offset === "number") {
      sql += ` OFFSET ${$offset || 0} ROWS`;
    }
    if (typeof $limit === "number") {
      sql += ` FETCH NEXT ${$limit} ROWS ONLY`;
    }

    if ($union) {
      sql += " " + this.compileUnion($union, params, select);
    }

    return sql;
  }

  protected compileFrom(
    table: Rowset<any> | Raw,
    params: Set<Parameter<JsConstant, string>>,
    parent: AST
  ): string {
    if (table instanceof Raw) {
      return table.$sql;
    }
    if (table instanceof Table) {
      let sql = ''
      sql += this.stringifyIdentifier(table)
      if (table.$alias) sql += ' AS ' + this.stringifyIdentifier(table.$alias)
      return sql
    }
    // 如果是命名行集
    if (table instanceof NamedSelect) {
      return this.compileNamedSelect(table, params, parent);
    }
    if (table instanceof TableFuncInvoke) {
      return this.compileTableInvoke(table, params, parent) + ' AS ' + this.stringifyIdentifier(table.$alias)
    }
    return this.compileRowsetName(table);
  }

  protected compileCondtion(
    where: Condition | Raw,
    params: Set<Parameter<JsConstant, string>>,
    parent: AST
  ) {
    if (where instanceof Raw) return where.$sql;
    switch (where.$kind) {
      case CONDITION_KIND.EXISTS:
        return this.compileExistsCondition(
          where as ExistsCondition,
          params,
          parent
        );
      case CONDITION_KIND.GROUP:
        return this.compileGroupCondition(
          where as GroupCondition,
          params,
          parent
        );
      case CONDITION_KIND.BINARY_COMPARE:
        return this.compileBinaryCompareCondition(
          where as BinaryCompareCondition,
          params,
          parent
        );
      case CONDITION_KIND.UNARY_COMPARE:
        return this.compileUnaryCompareCondition(
          where as UnaryCompareCondition,
          params,
          parent
        );
      case CONDITION_KIND.BINARY_LOGIC:
        return this.compileBinaryLogicCondition(
          where as BinaryLogicCondition,
          params,
          parent
        );
      case CONDITION_KIND.UNARY_LOGIC:
        return this.compileUnaryLogicCondition(
          where as UnaryLogicCondition,
          params,
          parent
        );
    }
  }

  protected compileInsert(
    insert: Insert<object>,
    params: Set<Parameter<JsConstant, string>>,
    parent?: AST
  ): string {
    const { $table, $values, $fields, $with } = insert;
    let sql = "";
    if ($with) {
      sql += this.compileWith($with, params, parent);
    }
    sql += "INSERT INTO ";
    if ($table.$alias) {
      throw new Error('Insert statements do not allow aliases on table.')
    }
    sql += this.compileRowsetName($table);

    if ($fields) {
      sql +=
        "(" +
        $fields
          .map((field) => this.compileInsertField(field))
          .join(", ") +
        ")";
    }

    if (Array.isArray($values)) {
      sql += " VALUES";
      sql += $values
        .map(
          (row) =>
            "(" +
            row
              .map((expr) => this.compileExpression(expr, params, parent))
              .join(", ")
            + ")"
        )
        .join(", ");
    } else {
      sql += " " + this.compileSelect($values, params, parent);
    }

    return sql;
  }

  protected compileAssignment(
    assign: Assignment<JsConstant>,
    params: Set<Parameter<JsConstant, string>>,
    parent?: AST
  ): string {
    const { left, right } = assign;
    return (
      this.compileExpression(left, params, parent) +
      " = " +
      this.compileExpression(right, params, parent)
    );
  }

  protected compileDeclare(
    declare: Declare,
    params: Set<Parameter<JsConstant, string>>,
    parent?: AST
  ): string {
    return (
      "DECLARE " +
      declare.$declares
        .map(
          (varDec) =>
            this.pretreatmentVariantName(varDec.$name) + " " + varDec.$dataType
        )
        .join(", ")
    );
  }

  protected compileUpdate(
    update: Update<object>,
    params: Set<Parameter<JsConstant, string>>,
    parent?: AST
  ): string {
    const { $table, $sets, $with, $where, $froms, $joins } = update;
    assert($table, "table is required by update statement");
    assert($sets, "set statement un declared");

    let sql = "";
    if ($with) {
      sql += this.compileWith($with, params, parent);
    }
    sql += "UPDATE ";
    sql += this.compileRowsetName($table);

    sql +=
      " SET " +
      $sets
        .map(
          (assign) => this.compileAssignment(assign, params, update)
        ).join(", ");

    if ($froms && $froms.length > 0) {
      sql +=
        " FROM " +
        $froms
          .map((table) => this.compileFrom(table, params, update))
          .join(", ");
    }

    if ($joins && $joins.length > 0) {
      sql +=
        " " +
        $joins.map((join) => this.compileJoin(join, params, update)).join(" ");
    }
    if ($where) {
      sql += " WHERE " + this.compileCondtion($where, params, update);
    }
    return sql;
  }

  protected compileDelete(
    del: Delete<object>,
    params: Set<Parameter<JsConstant, string>>,
    parent?: AST
  ): string {
    const { $table, $froms, $joins, $where, $with } = del;
    let sql = "";
    if ($with) {
      sql += this.compileWith($with, params, parent);
    }
    sql += "DELETE ";
    if ($table) sql += this.compileRowsetName($table);
    if ($froms && $froms.length > 0) {
      sql +=
        " FROM " +
        $froms
          .map((table) => this.compileFrom(table, params, parent))
          .join(", ");
    }

    if ($joins) {
      sql += $joins
        .map((join) => this.compileJoin(join, params, parent))
        .join(" ");
    }
    if ($where) {
      sql += " WHERE " + this.compileAST($where, params, parent);
    }
    return sql;
  }
}
