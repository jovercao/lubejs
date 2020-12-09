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
  ConvertOperation,
  Bracket,
  ValuedSelect,
  TableVariant,
} from "./ast";
import {
  PARAMETER_DIRECTION,
  CONDITION_KIND,
  OPERATION_KIND,
} from "./constants";

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
  isConstant,
  isConvertOperation,
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
} from "./util";

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
  returnParameterName: "__RETURN_VALUE__",
};

/**
 * AST到SQL的编译器
 */
export abstract class Compiler {
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
    if (typeof field.$name === "string") return this.quoted(field.$name);
    return this.quoted(field.$name[field.$name.length - 1]);
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
    return this.stringifyParameterName(param);
  }

  public stringifyParameterName(p: Parameter<JsConstant, string>) {
    return this.options.parameterPrefix + (p.$name || "");
  }

  protected stringifyVariantName(variant: Variant | TableVariant): string {
    return this.options.variantPrefix + variant.$name;
  }

  protected compileVariant(
    variant: Variant,
    params: Set<Parameter>,
    parent: AST = null
  ) {
    return this.stringifyVariantName(variant);
  }

  /**
   * 编译日期常量
   */
  protected compileDate(date: Date) {
    return `'${dateToString(date)}'`;
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
    if (isBinary(value)) {
      return "0x" + Buffer.from(value).toString("hex");
    }
    console.debug(value);
    // @ts-ignore
    throw new Error("unsupport constant value type:" + typeof value);
  }

  public compile(ast: Statement | Document): Command {
    const params = new Set<Parameter<JsConstant, string>>();
    let sql: string;
    if (isDocument(ast)) {
      sql = this.compileDocument(ast, params);
    } else {
      sql;
    }
    return {
      sql: this.compileStatement(ast, params),
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
    params: Set<Parameter<JsConstant, string>>,
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
      return this.compileDeclare(statement, params, parent);
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

  protected compileBracket(
    expr: Bracket<JsConstant>,
    params: Set<Parameter<JsConstant, string>>,
    parent: AST
  ): string {
    return `(${this.compileExpression(expr.$inner, params, parent)})`;
  }

  /**
   * SELECT 语句 当值使用
   */
  protected compileValuedSelect(
    expr: ValuedSelect<JsConstant>,
    params: Set<Parameter<JsConstant, string>>,
    parent: AST
  ): string {
    return `(${this.compileSelect(expr.$select, params, parent)})`;
  }

  protected compileStar(
    star: Star,
    params: Set<Parameter<JsConstant, string>>,
    parent: AST
  ): string {
    if (star.$parent) {
      return this.compileName(star.$parent) + ".*";
    }
    return "*";
  }

  protected compileOperation(
    operation: Operation,
    params: Set<Parameter<JsConstant, string>>,
    parent: AST
  ) {
    if (isUnaryOperation(operation)) {
      return this.compileUnaryOperation(operation, params, parent);
    }

    if (isBinaryOperation(operation)) {
      return this.compileBinaryOperation(operation, params, parent);
    }

    if (isConvertOperation(operation)) {
      return this.compileConvert(
        operation as ConvertOperation<JsConstant>,
        params,
        parent
      );
    }
    invalidAST("operation", operation);
  }

  abstract compileConvert(
    ast: ConvertOperation<JsConstant>,
    params: Set<Parameter<JsConstant, string>>,
    parent: AST
  ): string;

  protected compileUnaryOperation(
    opt: UnaryOperation<JsConstant>,
    params: Set<Parameter<JsConstant, string>>,
    parent: AST
  ): string {
    return opt.$operator + this.compileExpression(opt.$value, params, parent);
  }

  protected compileRowsetName(rowset: Rowset | Raw) {
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
    rowset: NamedSelect<object, string>,
    params: Set<Parameter<JsConstant, string>>,
    parent: AST
  ) {
    return (
      "(" +
      this.compileSelect(rowset.$select, params, rowset) +
      ") AS " +
      this.compileRowsetName(rowset)
    );
  }

  protected compileTableInvoke(
    arg0: TableFuncInvoke,
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
    column: Column<JsConstant, string> | Star | Expression<JsConstant>,
    params: Set<Parameter<JsConstant, string>>,
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
      return this.compileStar(column, params, parent);
    }
    return this.compileExpression(column, params, parent);
  }

  protected compileWithSelect(
    item: NamedSelect<any, string> | Raw,
    params: Set<Parameter<JsConstant, string>>,
    parent: AST
  ) {
    if (isRaw(item)) return item.$sql;
    return `${this.quoted(item.$alias.$name)} AS (${this.compileSelect(
      item.$select,
      params,
      parent
    )})`;
  }

  protected compileWith(
    withs: With | Raw,
    params: Set<Parameter<JsConstant, string>>,
    parent: AST
  ): string {
    if (isRaw(withs)) return withs.$sql;
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
      .map((statement) => this.compileStatement(statement, params, doc))
      .join("\n");
  }

  protected compileExecute<T extends AST>(
    exec: Execute,
    params: Set<Parameter<JsConstant, string>>,
    parent?: AST
  ): string {
    const returnParam = Parameter.output(
      this.options.returnParameterName,
      "number"
    );
    return (
      "EXECUTE " +
      this.compileParameter(returnParam, params, parent) +
      " = " +
      this.stringifyIdentifier(exec.$proc) +
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
          isParameter(ast) &&
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
    union: Union,
    params: Set<Parameter<JsConstant, string>>,
    parent?: AST
  ): string {
    return (
      "UNION " +
      (union.$all ? "ALL " : "") +
      this.compileSelect(union.$select, params, union)
    );
  }

  protected compileCase(
    caseExpr: Case<any>,
    params: Set<Parameter<JsConstant, string>>,
    parent?: AST
  ): string {
    let fragment = "CASE";
    if (caseExpr.$expr)
      fragment += " " + this.compileExpression(caseExpr.$expr, params, parent);
    fragment +=
      " " +
      caseExpr.$whens
        .map((when) => this.compileWhen(when, params, caseExpr))
        .join(" ");
    if (caseExpr.$default)
      fragment +=
        " ELSE " + this.compileExpression(caseExpr.$default, params, caseExpr);
    fragment += " END";
    return fragment;
  }

  protected compileWhen(
    when: When<any> | Raw,
    params: Set<Parameter<JsConstant, string>>,
    parent?: AST
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

  protected compileGroupCondition(
    expr: GroupCondition,
    params: Set<Parameter<JsConstant, string>>,
    parent?: AST
  ): string {
    return "(" + this.compileCondition(expr.context, params, expr) + ")";
  }

  protected compileBinaryLogicCondition(
    expr: BinaryLogicCondition,
    params: Set<Parameter<JsConstant, string>>,
    parent?: AST
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
    params: Set<Parameter<JsConstant, string>>,
    parent?: AST
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
    expr: BinaryOperation<JsConstant>,
    params: Set<Parameter<JsConstant, string>>,
    parent?: AST
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
    params: Set<Parameter<JsConstant, string>>,
    parent?: AST
  ): string {
    return (
      this.compileExpression(expr.$expr, params, expr) + " " + expr.$operator
    );
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
      expr.$operator +
      " " +
      this.compileCondition(expr.$condition, params, expr)
    );
  }

  protected compileExpression(
    expr: Expression<JsConstant> | Raw,
    params: Set<Parameter<JsConstant, string>>,
    parent?: AST
  ) {
    if (isRaw(expr)) {
      return expr.$sql;
    }
    if (isConstant(expr)) {
      return this.compileConstant(expr, params, parent);
    }

    if (isOperation(expr)) {
      return this.compileOperation(expr, params, parent);
    }

    if (isField(expr)) {
      return this.stringifyIdentifier(expr);
    }

    if (isBracket(expr)) {
      return this.compileBracket(expr, params, parent);
    }

    if (isValuedSelect(expr)) {
      return this.compileValuedSelect(expr, params, parent);
    }

    if (isVariant(expr)) {
      return this.stringifyVariantName(expr);
    }

    if (isParameter(expr)) {
      return this.compileParameter(expr, params, parent);
    }

    if (isScalarFuncInvoke(expr)) {
      return this.compileScalarInvoke(expr, params, parent);
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
  ) {
    if (isStar(arg)) return this.compileStar(arg, params, parent);
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
    invoke: ScalarFuncInvoke<JsConstant>,
    params: Set<Parameter<JsConstant, string>>,
    parent?: AST
  ): string {
    return `${this.stringifyIdentifier(invoke.$func)}(${(invoke.$args || [])
      .map((v) => this.compileScalarInvokeArgs(v, params, invoke))
      .join(", ")})`;
  }

  protected compileJoin(
    join: Join | Raw,
    params: Set<Parameter<JsConstant, string>>,
    parent?: AST
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
    params: Set<Parameter<JsConstant, string>>,
    parent?: AST
  ): string {
    if (isRaw(sort)) return sort.$sql;
    let sql = this.compileExpression(sort.$expr, params, sort);
    if (sort.$direction) sql += " " + sort.$direction;
    return sql;
  }

  protected compileSelect(
    select: Select,
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
      return this.compileNamedSelect(table, params, parent);
    }
    if (isTableFuncInvoke(table)) {
      return (
        this.compileTableInvoke(table, params, parent) +
        " AS " +
        this.stringifyIdentifier(table.$alias)
      );
    }
    return this.compileRowsetName(table);
  }

  protected compileCondition(
    condition: Condition | Raw,
    params: Set<Parameter<JsConstant, string>>,
    parent: AST
  ) {
    if (isRaw(condition)) return condition.$sql;
    if (isExistsCondition(condition)) {
      return this.compileExistsCondition(
        condition as ExistsCondition,
        params,
        parent
      );
    }
    if (isGroupCondition(condition)) {
      return this.compileGroupCondition(
        condition as GroupCondition,
        params,
        parent
      );
    }
    if (isBinaryCompareCondition(condition)) {
      return this.compileBinaryCompareCondition(
        condition as BinaryCompareCondition,
        params,
        parent
      );
    }
    if (isUnaryCompareCondition(condition)) {
      return this.compileUnaryCompareCondition(
        condition as UnaryCompareCondition,
        params,
        parent
      );
    }
    if (isBinaryLogicCondition(condition)) {
      return this.compileBinaryLogicCondition(
        condition as BinaryLogicCondition,
        params,
        parent
      );
    }
    if (isUnaryLogicCondition(condition)) {
      return this.compileUnaryLogicCondition(
        condition as UnaryLogicCondition,
        params,
        parent
      );
    }
    invalidAST("condition", condition);
  }

  protected compileInsert(
    insert: Insert,
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
            this.stringifyVariantName(varDec.$name) + " " + varDec.$dataType
        )
        .join(", ")
    );
  }

  protected compileUpdate(
    update: Update,
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
        " " +
        $joins.map((join) => this.compileJoin(join, params, update)).join(" ");
    }
    if ($where) {
      sql += " WHERE " + this.compileCondition($where, params, update);
    }
    return sql;
  }

  protected compileDelete(
    del: Delete,
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
      sql += " WHERE " + this.compileCondition($where, params, parent);
    }
    return sql;
  }
}
