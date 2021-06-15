/* eslint-disable @typescript-eslint/no-explicit-any */
import assert from "assert";

import {
  AST,
  Parameter,
  Identifier,
  Literal,
  When,
  SelectColumn,
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
  ParenthesesCondition,
  With,
  NamedSelect,
  Expression,
  BuiltIn,
  Field,
  Condition,
  Operation,
  Rowset,
  Star,
  Statement,
  // ConvertOperation,
  ParenthesesExpression,
  ValuedSelect,
  TableVariant,
  // IdentityValue,
  StandardExpression,
  TableVariantDeclare,
} from "./ast";
import { PARAMETER_DIRECTION } from "./constants";
import { Command } from "./execute";
import { Standard } from "./std";

import { DbType, Name, Scalar } from "./types";

import {
  dateToString,
  invalidAST,
  isAssignment,
  isBinary,
  isBinaryCompareCondition,
  isBinaryLogicCondition,
  isBinaryOperation,
  isBracket,
  isBuiltIn,
  isCase,
  isColumn,
  isCondition,
  isLiteral,
  isDeclare,
  isDelete,
  isDocument,
  isExecute,
  isExistsCondition,
  isField,
  isGroupCondition,
  isIdentifier,
  isInsert,
  isNamedSelect,
  isOperation,
  isParameter,
  isRaw,
  isScalarFuncInvoke,
  isSelect,
  isStar,
  isTable,
  isTableFuncInvoke,
  isTableVariant,
  isUnaryCompareCondition,
  isUnaryLogicCondition,
  isUnaryOperation,
  isUpdate,
  isValuedSelect,
  isVariant,
  isStandardExpression,
  isStatement,
  isTableVariantDeclare,
} from "./util";

/**
 * 标准操作转换器
 */
export type StandardTranslator = Standard;

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
  returnParameterName: "__RETURN_VALUE__",
};

/**
 * AST到SQL的编译器基类，包含大部分标准实现
 */
export abstract class Compiler {
  options: CompileOptions;

  /**
   * 必须实现标准转译器
   */
  abstract get translator(): StandardTranslator;

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

  protected abstract compileType(type: DbType): string;

  /**
   *
   * @param operation 将标准操作编译成AST
   */
  protected translationStandardExpression<T extends Scalar>(
    operation: StandardExpression<T>
  ): Expression<T> {
    const transFn = Reflect.get(this.translator, operation.$kind);
    return transFn.call(this.translator, ...operation.$datas);
  }

  /**
   * 编译Insert语句中的字段，取掉表别名
   * @param field 字段
   */
  protected compileInsertField(field: Field<Scalar, string>): string {
    if (typeof field.$name === "string") return this.quoted(field.$name);
    return this.quoted(field.$name[field.$name.length - 1]);
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
    param: Parameter<Scalar, string>,
    params: Set<Parameter<Scalar, string>>
  ): string {
    params.add(param);
    return this.stringifyParameterName(param);
  }

  protected stringifyParameterName(p: Parameter<Scalar, string>): string {
    return this.options.parameterPrefix + (p.$name || "");
  }

  protected stringifyVariantName(variant: Variant | TableVariant): string {
    return this.options.variantPrefix + variant.$name;
  }

  protected stringifyIdentifier(identifier: Identifier<string>): string {
    return this.compileName(identifier.$name, identifier.$builtin);
  }

  /**
   * 通过模板参数创建一个SQL命令
   */
  makeCommand(arr: TemplateStringsArray, ...paramValues: any[]): Command {
    const params: Parameter[] = [];
    let sql: string = arr[0];
    for (let i = 0; i < arr.length - 1; i++) {
      const name = "__p__" + i;
      const param = Parameter.input(name, paramValues[i]);
      sql += this.stringifyParameterName(param);
      sql += arr[i + 1];
      params.push(param);
    }
    return {
      sql,
      params,
    };
  }

  protected compileVariant(variant: Variant): string {
    return this.stringifyVariantName(variant);
  }

  /**
   * 编译日期常量
   */
  protected compileDate(date: Date): string {
    return `'${dateToString(date)}'`;
  }

  /**
   * 编译Boolean常量
   */
  protected compileBoolean(value: boolean): string {
    return value ? "1" : "0";
  }

  /**
   * 编译字符串常量
   */
  protected compileString(value: string): string {
    return `'${value.replace(/'/g, "''")}'`;
  }

  /**
   * 编译常量
   */
  protected compileLiteral(constant: Literal<Scalar>): string {
    const value = constant.$value;
    // 为方便JS，允许undefined进入，留给TS语法检查
    if (value === null || value === undefined) {
      return "NULL";
    }

    const type = typeof value;

    if (type === "string") {
      return this.compileString(value as string);
    }

    if (type === "number" || type === "bigint") {
      return value.toString(10);
    }

    if (type === "boolean") {
      return this.compileBoolean(value as boolean);
    }

    if (value instanceof Date) {
      return this.compileDate(value);
    }
    if (isBinary(value)) {
      return "0x" + Buffer.from(value).toString("hex");
    }
    console.debug("unsupport constant value type:", value);
    throw new Error("unsupport constant value type:" + type);
  }

  /**
   * 将AST编译成一个可供执行的命令
   */
  public compile(ast: Statement | Document | Expression): Command {
    const params = new Set<Parameter<Scalar, string>>();
    let sql: string;
    if (isDocument(ast)) {
      sql = this.compileDocument(ast, params);
    } else if (isStatement(ast)) {
      sql = this.compileStatement(ast, params);
    } else {
      sql = this.compileExpression(ast, params);
    }
    return {
      sql,
      params: Array.from(params),
    };
  }

  protected compileStatement(
    /**
     * AST
     */
    statement: Statement,
    /**
     * 参数容器
     */
    params: Set<Parameter<Scalar, string>>,
    /**
     * 父级AST
     */
    parent?: AST
  ): string {
    if (isSelect(statement)) {
      return this.compileSelect(statement, params, parent);
    }

    if (isUpdate(statement)) {
      return this.compileUpdate(statement, params, parent);
    }

    if (isInsert(statement)) {
      return this.compileInsert(statement, params, parent);
    }

    if (isDelete(statement)) {
      return this.compileDelete(statement, params, parent);
    }

    if (isDeclare(statement)) {
      return this.compileDeclare(statement);
    }

    if (isExecute(statement)) {
      return this.compileExecute(statement, params, parent);
    }

    if (isAssignment(statement)) {
      return this.compileAssignment(statement, params, parent);
    }

    if (isRaw(statement)) {
      return statement.$sql;
    }

    invalidAST("statement", statement);
  }

  protected compileParenthesesExpression(
    expr: ParenthesesExpression<Scalar>,
    params: Set<Parameter<Scalar, string>>
  ): string {
    return `(${this.compileExpression(expr.$inner, params, expr)})`;
  }

  /**
   * SELECT 语句 当值使用
   */
  protected compileValuedSelect(
    expr: ValuedSelect<Scalar>,
    params: Set<Parameter<Scalar, string>>,
    parent: AST
  ): string {
    return `(${this.compileSelect(expr.$select, params, parent)})`;
  }

  protected compileStar(star: Star): string {
    if (star.$parent) {
      return this.compileName(star.$parent) + ".*";
    }
    return "*";
  }

  protected compileOperation(
    operation: Operation,
    params: Set<Parameter<Scalar, string>>,
    parent: AST
  ): string {
    if (isUnaryOperation(operation)) {
      return this.compileUnaryOperation(operation, params, parent);
    }

    if (isBinaryOperation(operation)) {
      return this.compileBinaryOperation(operation, params);
    }

    // if (isConvertOperation(operation)) {
    //   return this.compileConvert(
    //     operation as ConvertOperation<Scalar>,
    //     params,
    //     parent
    //   )
    // }
    invalidAST("operation", operation);
  }

  // abstract compileConvert (
  //   ast: ConvertOperation<Scalar>,
  //   params: Set<Parameter<Scalar, string>>,
  //   parent: AST
  // ): string

  protected compileUnaryOperation(
    opt: UnaryOperation<Scalar>,
    params: Set<Parameter<Scalar, string>>,
    parent: AST
  ): string {
    return opt.$operator + this.compileExpression(opt.$value, params, parent);
  }

  protected compileRowsetName(rowset: Rowset | Raw): string {
    if (isRaw(rowset)) return rowset.$sql;
    if (rowset.$alias) {
      return this.stringifyIdentifier(rowset.$alias);
    }
    if (isIdentifier(rowset)) {
      return this.stringifyIdentifier(rowset);
    }
    throw new Error("Rowset must have alias or name.");
  }

  protected compileNamedSelect(
    rowset: NamedSelect,
    params: Set<Parameter<Scalar, string>>
  ): string {
    return (
      "(" +
      this.compileSelect(rowset.$select, params, rowset) +
      ") AS " +
      this.compileRowsetName(rowset)
    );
  }

  protected compileTableInvoke(): string {
    throw new Error("Method not implemented.");
  }
  // compileNamedArgument(arg0: NamedArgument<JsConstant, string>, params: Set<Parameter<JsConstant, string>>, parent: AST): string {
  //   throw new Error("Method not implemented.");
  // }
  protected compileBuildIn(buildIn: BuiltIn<string>): string {
    return buildIn.$name;
  }

  protected compileColumn(
    column: SelectColumn<Scalar, string> | Star | Expression<Scalar>,
    params: Set<Parameter<Scalar, string>>,
    parent: AST
  ): string {
    if (isColumn(column)) {
      return `${this.compileExpression(
        column.$expr,
        params,
        column
      )} AS ${this.quoted(column.$name)}`;
    }
    if (isStar(column)) {
      return this.compileStar(column);
    }
    return this.compileExpression(column, params, parent);
  }

  protected compileWithSelect(
    item: NamedSelect<any, string> | Raw,
    params: Set<Parameter<Scalar, string>>,
    parent: AST
  ): string {
    if (isRaw(item)) return item.$sql;
    return `${this.quoted(item.$alias.$name)} AS (${this.compileSelect(
      item.$select,
      params,
      parent
    )})`;
  }

  protected compileWith(
    withs: With | Raw,
    params: Set<Parameter<Scalar, string>>
  ): string {
    if (isRaw(withs)) return withs.$sql;
    return (
      "WITH " +
      withs.$rowsets
        .map((item) => this.compileWithSelect(item, params, withs))
        .join(", ")
    );
  }

  // protected abstract compileIdentityValue(ast: IdentityValue, params: Set<Parameter>): string;

  protected compileDocument(
    doc: Document,
    params: Set<Parameter<Scalar, string>>
  ): string {
    return doc.statements
      .map((statement) => this.compileStatement(statement, params, doc))
      .join("\n");
  }

  protected compileExecute(
    exec: Execute,
    params: Set<Parameter<Scalar, string>>,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    parent?: AST
  ): string {
    const returnParam = Parameter.output(
      this.options.returnParameterName,
      DbType.int32
    );
    return (
      "EXECUTE " +
      this.compileParameter(returnParam, params) +
      " = " +
      this.stringifyIdentifier(exec.$proc) +
      " " +
      this.compileExecuteArgumentList(exec.$args, params, exec)
    );
  }

  protected compileInvokeArgumentList(
    args: Expression<Scalar>[],
    params: Set<Parameter<Scalar, string>>,
    parent?: AST
  ): string {
    return args
      .map((expr) => this.compileExpression(expr, params, parent))
      .join(", ");
  }

  protected compileExecuteArgumentList(
    args: Expression<Scalar>[],
    params: Set<Parameter<Scalar, string>>,
    parent?: AST
  ): string {
    return args
      .map((ast) => {
        let sql = this.compileExpression(ast, params, parent);
        if (
          isParameter(ast) &&
          (ast as Parameter<Scalar, string>).direction ===
            PARAMETER_DIRECTION.OUTPUT
        ) {
          sql += " OUTPUT";
        }
        return sql;
      })
      .join(", ");
  }

  protected compileUnion(
    union: Union,
    params: Set<Parameter<Scalar, string>>
  ): string {
    return (
      "UNION " +
      (union.$all ? "ALL " : "") +
      (isSelect(union.$select)
        ? this.compileSelect(union.$select, params, union)
        : this.compileRowsetName(union.$select))
    );
  }

  protected compileCase(
    caseExpr: Case<any>,
    params: Set<Parameter<Scalar, string>>,
    parent?: AST
  ): string {
    let fragment = "CASE";
    if (caseExpr.$expr)
      fragment += " " + this.compileExpression(caseExpr.$expr, params, parent);
    fragment +=
      " " +
      caseExpr.$whens.map((when) => this.compileWhen(when, params)).join(" ");
    if (caseExpr.$default)
      fragment +=
        " ELSE " + this.compileExpression(caseExpr.$default, params, caseExpr);
    fragment += " END";
    return fragment;
  }

  protected compileWhen(
    when: When<any> | Raw,
    params: Set<Parameter<Scalar, string>>
  ): string {
    if (isRaw(when)) return when.$sql;
    return (
      "WHEN " +
      (isCondition(when.$expr)
        ? this.compileCondition(when.$expr, params, when)
        : this.compileExpression(when.$expr, params, when)) +
      " THEN " +
      this.compileExpression(when.$value, params, when)
    );
  }

  protected compileParenthesesCondition(
    expr: ParenthesesCondition,
    params: Set<Parameter<Scalar, string>>
  ): string {
    return "(" + this.compileCondition(expr.$inner, params, expr) + ")";
  }

  protected compileBinaryLogicCondition(
    expr: BinaryLogicCondition,
    params: Set<Parameter<Scalar, string>>
  ): string {
    return (
      this.compileCondition(expr.$left, params, expr) +
      " " +
      expr.$operator +
      " " +
      this.compileCondition(expr.$right, params, expr)
    );
  }

  protected compileBinaryCompareCondition(
    expr: BinaryCompareCondition,
    params: Set<Parameter<Scalar, string>>
  ): string {
    return (
      this.compileExpression(expr.$left, params, expr) +
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
    expr: BinaryOperation<Scalar>,
    params: Set<Parameter<Scalar, string>>
  ): string {
    return (
      this.compileExpression(expr.$left, params, expr) +
      " " +
      expr.$operator +
      " " +
      this.compileExpression(expr.$right, params, expr)
    );
  }

  protected compileUnaryCompareCondition(
    expr: UnaryCompareCondition,
    params: Set<Parameter<Scalar, string>>
  ): string {
    return (
      this.compileExpression(expr.$expr, params, expr) + " " + expr.$operator
    );
  }

  protected compileExistsCondition(
    expr: ExistsCondition,
    params: Set<Parameter<Scalar, string>>
  ): string {
    return "EXISTS(" + this.compileSelect(expr.$statement, params, expr) + ")";
  }

  protected compileUnaryLogicCondition(
    expr: UnaryLogicCondition,
    params: Set<Parameter<Scalar, string>>
  ): string {
    return (
      expr.$operator +
      " " +
      this.compileCondition(expr.$condition, params, expr)
    );
  }

  protected compileExpression(
    expr: Expression<Scalar> | Raw,
    params: Set<Parameter<Scalar, string>>,
    parent?: AST
  ): string {
    if (isRaw(expr)) {
      return expr.$sql;
    }
    // 编译标准操作
    if (isStandardExpression(expr)) {
      return this.compileExpression(
        this.translationStandardExpression(expr),
        params,
        parent
      );
    }
    if (isLiteral(expr)) {
      return this.compileLiteral(expr);
    }

    if (isOperation(expr)) {
      return this.compileOperation(expr, params, parent);
    }

    if (isField(expr)) {
      return this.stringifyIdentifier(expr);
    }

    if (isBracket(expr)) {
      return this.compileParenthesesExpression(expr, params);
    }

    if (isValuedSelect(expr)) {
      return this.compileValuedSelect(expr, params, parent);
    }

    if (isVariant(expr)) {
      return this.stringifyVariantName(expr);
    }

    if (isParameter(expr)) {
      return this.compileParameter(expr, params);
    }

    if (isScalarFuncInvoke(expr)) {
      return this.compileScalarInvoke(expr, params);
    }

    if (isCase(expr)) {
      return this.compileCase(expr, params, parent);
    }
    invalidAST("expression", expr);
  }

  protected compileScalarInvokeArgs(
    arg: Expression | Star | BuiltIn,
    params: Set<Parameter>,
    parent: AST
  ): string {
    if (isStar(arg)) return this.compileStar(arg);
    if (isBuiltIn(arg)) return this.compileBuildIn(arg);
    return this.compileExpression(arg, params, parent);
  }
  /**
   * 函数调用
   * @param {*} invoke
   * @param {*} params
   * @returns
   * @memberof Executor
   */
  protected compileScalarInvoke(
    invoke: ScalarFuncInvoke<Scalar>,
    params: Set<Parameter<Scalar, string>>
  ): string {
    return `${this.stringifyIdentifier(invoke.$func)}(${(invoke.$args || [])
      .map((v) => this.compileScalarInvokeArgs(v, params, invoke))
      .join(", ")})`;
  }

  protected compileJoin(
    join: Join | Raw,
    params: Set<Parameter<Scalar, string>>
  ): string {
    if (isRaw(join)) return join.$sql;
    return (
      (join.$left ? "LEFT " : "") +
      "JOIN " +
      this.compileFrom(join.$table, params, join) +
      " ON " +
      this.compileCondition(join.$on, params, join)
    );
  }

  protected compileSort(
    sort: SortInfo | Raw,
    params: Set<Parameter<Scalar, string>>
  ): string {
    if (isRaw(sort)) return sort.$sql;
    let sql = this.compileExpression(sort.$expr, params, sort);
    if (sort.$direction) sql += " " + sort.$direction;
    return sql;
  }

  protected compileSelect(
    select: Select,
    params: Set<Parameter<Scalar, string>>,
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
      sql += this.compileWith($with, params);
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
        " " + $joins.map((join) => this.compileJoin(join, params)).join(" ");
    }
    if ($where) {
      sql += " WHERE " + this.compileCondition($where, params, parent);
    }
    if ($groups && $groups.length) {
      sql +=
        " GROUP BY " +
        $groups
          .map((p) => this.compileExpression(p, params, parent))
          .join(", ");
    }
    if ($having) {
      sql += " HAVING " + this.compileCondition($having, params, parent);
    }
    if ($sorts && $sorts.length > 0) {
      sql +=
        " ORDER BY " +
        $sorts.map((sort) => this.compileSort(sort, params)).join(", ");
    }
    sql += this.compileOffsetLimit(select, params);
    if ($union) {
      sql += " " + this.compileUnion($union, params);
    }
    return sql;
  }

  protected compileOffsetLimit(
    select: Select<any>,
    params: Set<Parameter<Scalar, string>>
  ): string {
    let sql = "";
    if (typeof select.$offset === "number") {
      sql += ` OFFSET ${select.$offset || 0}`;
    }
    if (typeof select.$limit === "number") {
      sql += ` LIMIT ${select.$limit}`;
    }
    return sql;
  }

  protected compileFrom(
    table: Rowset<any> | Raw,
    params: Set<Parameter<Scalar, string>>,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    parent: AST
  ): string {
    if (isRaw(table)) {
      return table.$sql;
    }
    if (isTable(table)) {
      let sql = "";
      sql += this.stringifyIdentifier(table);
      if (table.$alias) sql += " AS " + this.stringifyIdentifier(table.$alias);
      return sql;
    }
    if (isTableVariant(table)) {
      let sql = "";
      sql += this.stringifyVariantName(table);
      if (table.$alias) sql += " AS " + this.stringifyIdentifier(table.$alias);
      return sql;
    }
    // 如果是命名行集
    if (isNamedSelect(table)) {
      if (table.$inWith) {
        return this.stringifyIdentifier(table.$alias);
      } else {
        return this.compileNamedSelect(table, params);
      }
    }
    if (isTableFuncInvoke(table)) {
      return (
        this.compileTableInvoke() +
        " AS " +
        this.stringifyIdentifier(table.$alias)
      );
    }
    return this.compileRowsetName(table);
  }

  protected compileCondition(
    condition: Condition | Raw,
    params: Set<Parameter<Scalar, string>>,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    parent: AST
  ): string {
    if (isRaw(condition)) return condition.$sql;
    if (isExistsCondition(condition)) {
      return this.compileExistsCondition(condition as ExistsCondition, params);
    }
    if (isGroupCondition(condition)) {
      return this.compileParenthesesCondition(
        condition as ParenthesesCondition,
        params
      );
    }
    if (isBinaryCompareCondition(condition)) {
      return this.compileBinaryCompareCondition(
        condition as BinaryCompareCondition,
        params
      );
    }
    if (isUnaryCompareCondition(condition)) {
      return this.compileUnaryCompareCondition(
        condition as UnaryCompareCondition,
        params
      );
    }
    if (isBinaryLogicCondition(condition)) {
      return this.compileBinaryLogicCondition(
        condition as BinaryLogicCondition,
        params
      );
    }
    if (isUnaryLogicCondition(condition)) {
      return this.compileUnaryLogicCondition(
        condition as UnaryLogicCondition,
        params
      );
    }
    invalidAST("condition", condition);
  }

  protected compileInsert(
    insert: Insert,
    params: Set<Parameter<Scalar, string>>,
    parent?: AST
  ): string {
    const { $table, $values, $fields, $with } = insert;
    let sql = "";
    if ($with) {
      sql += this.compileWith($with, params);
    }
    sql += "INSERT INTO ";
    if ($table.$alias) {
      throw new Error("Insert statements do not allow aliases on table.");
    }
    sql += this.compileRowsetName($table);

    if ($fields) {
      sql +=
        "(" +
        $fields.map((field) => this.compileInsertField(field)).join(", ") +
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
              .join(", ") +
            ")"
        )
        .join(", ");
    } else {
      sql += " " + this.compileSelect($values, params, parent);
    }

    return sql;
  }

  protected compileAssignment(
    assign: Assignment<Scalar>,
    params: Set<Parameter<Scalar, string>>,
    parent?: AST
  ): string {
    const { left, right } = assign;
    return (
      this.compileExpression(left, params, parent) +
      " = " +
      this.compileExpression(right, params, parent)
    );
  }

  protected abstract compileTableVariantDeclare(
    declare: TableVariantDeclare
  ): string;

  protected compileDeclare(declare: Declare): string {
    return (
      "DECLARE " +
      declare.$declares
        .map((varDec) =>
          isTableVariantDeclare(varDec)
            ? this.compileTableVariantDeclare(varDec)
            : this.stringifyVariantName(varDec.$name) +
              " " +
              this.compileType(varDec.$dataType)
        )
        .join(", ") +
      ";"
    );
  }

  protected compileUpdate(
    update: Update,
    params: Set<Parameter<Scalar, string>>,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    parent?: AST
  ): string {
    const { $table, $sets, $with, $where, $froms, $joins } = update;
    assert($table, "table is required by update statement");
    assert($sets, "set statement un declared");

    let sql = "";
    if ($with) {
      sql += this.compileWith($with, params);
    }
    sql += "UPDATE ";
    sql += this.compileRowsetName($table);

    sql +=
      " SET " +
      $sets
        .map((assign) => this.compileAssignment(assign, params, update))
        .join(", ");

    if ($froms && $froms.length > 0) {
      sql +=
        " FROM " +
        $froms
          .map((table) => this.compileFrom(table, params, update))
          .join(", ");
    }

    if ($joins && $joins.length > 0) {
      sql +=
        " " + $joins.map((join) => this.compileJoin(join, params)).join(" ");
    }
    if ($where) {
      sql += " WHERE " + this.compileCondition($where, params, update);
    }
    return sql;
  }

  protected compileDelete(
    del: Delete,
    params: Set<Parameter<Scalar, string>>,
    parent?: AST
  ): string {
    const { $table, $froms, $joins, $where, $with } = del;
    let sql = "";
    if ($with) {
      sql += this.compileWith($with, params);
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
      sql += $joins.map((join) => this.compileJoin(join, params)).join(" ");
    }
    if ($where) {
      sql += " WHERE " + this.compileCondition($where, params, parent);
    }
    return sql;
  }
}

// TODO 待实现 std, StandardOperation 编译
