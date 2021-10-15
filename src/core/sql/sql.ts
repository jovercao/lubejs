import type { RowObject, ColumnsOf, ExpandScalar, CompatiblifyTuple } from './types';

/**
 * 所有AST类的基类
 */
abstract class SQLClass {
  abstract readonly $type: SQL_SYMBOLE;
  /**
   * 克隆自身
   */
  clone(): this {
    return clone(this);
  }

  static get std(): Standard {
    return Standard.std;
  }

  static get type(): typeof DbType {
    return DbType;
  }

  static use(database: string): Use {
    return new Use(database);
  }

  static if(condition: Condition): If {
    return new If(condition);
  }

  static while(condition: Condition): While {
    return new While(condition);
  }

  static break(): Break {
    return new Break();
  }

  static get continue(): Continue {
    return new Continue();
  }

  static return(value?: XExpression): Return {
    return new Return(value);
  }

  /**
   * 创建一个SQL文档
   * @param statements 文档代码
   */
  static doc(statements: Statement[]): Document;
  static doc(...statements: Statement[]): Document;
  static doc(...statements: Statement[] | [Statement[]]): Document {
    const lines = Array.isArray(statements[0])
      ? statements[0]
      : (statements as Statement[]);
    return new Document(lines);
  }

  static group(condition: Condition): Condition;
  static group<T extends Scalar>(expr: XExpression<T>): Expression<T>;
  static group(value: Condition | XExpression): any {
    if (Condition.isCondition(value)) {
      return new GroupCondition(value);
    }
    return new GroupExpression(value as XExpression);
  }

  /**
   * 负号运算符 -
   */
  static neg(expr: XExpression<number>): Expression<number> {
    return new UnaryOperation(UNARY_OPERATION_OPERATOR.NEG, expr);
  }

  /**
   * 字符串连接运算
   */
  static concat(
    ...strs: [
      XExpression<string>,
      XExpression<string>,
      ...XExpression<string>[]
    ]
  ): Expression<string> {
    let exp = strs[0];
    for (let i = 1; i < strs.length; i++) {
      exp = new BinaryOperation(BINARY_OPERATION_OPERATOR.CONCAT, exp, strs[i]);
    }
    return exp as Expression<string>;
  }

  /**
   * 算术运算 +
   * @param left 左值
   * @param right 右值
   * @returns 返回算术运算表达式
   */
  static add<T extends Numeric>(
    left: XExpression<T>,
    right: XExpression<T>
  ): Expression<T> {
    return new BinaryOperation(BINARY_OPERATION_OPERATOR.ADD, left, right);
  }

  /**
   * 算术运算 -
   * @param left 左值
   * @param right 右值
   * @returns 返回算术运算表达式
   */
  static sub<T extends Numeric>(
    left: XExpression<T>,
    right: XExpression<T>
  ): Expression<T> {
    return new BinaryOperation(BINARY_OPERATION_OPERATOR.SUB, left, right);
  }

  /**
   * 算术运算 *
   * @param left 左值
   * @param right 右值
   * @returns 返回算术运算表达式
   */
  static mul<T extends Numeric>(
    left: XExpression<T>,
    right: XExpression<T>
  ): Expression<T> {
    return new BinaryOperation(BINARY_OPERATION_OPERATOR.MUL, left, right);
  }

  /**
   * 算术运算 /
   * @param left 左值
   * @param right 右值
   * @returns 返回算术运算表达式
   */
  static div<T extends Numeric>(
    left: XExpression<T>,
    right: XExpression<T>
  ): Expression<T> {
    return new BinaryOperation(BINARY_OPERATION_OPERATOR.DIV, left, right);
  }

  /**
   * 算术运算 %
   * @param left 左值
   * @param right 右值
   * @returns 返回算术运算表达式
   */
  static mod<T extends Numeric>(
    left: XExpression<T>,
    right: XExpression<T>
  ): Expression<T> {
    return new BinaryOperation(BINARY_OPERATION_OPERATOR.MOD, left, right);
  }
  /*
   * 位算术运算 ^
   * @param left 左值
   * @param right 右值
   * @returns 返回算术运算表达式
   */
  static xor<T extends Interger>(
    left: XExpression<T>,
    right: XExpression<T>
  ): Expression<T> {
    return new BinaryOperation(BINARY_OPERATION_OPERATOR.XOR, left, right);
  }

  /**
   * 位算术运算 << 仅支持整型
   * @param left 左值
   * @param right 右值
   * @returns 返回算术运算表达式
   */
  static shl<T extends Interger>(
    left: XExpression<T>,
    right: XExpression<T>
  ): Expression<T> {
    return new BinaryOperation(BINARY_OPERATION_OPERATOR.SHL, left, right);
  }

  /**
   * 位算术运算 >>
   * @param left 左值
   * @param right 右值
   * @returns 返回算术运算表达式
   */
  static shr<T extends Interger>(
    left: XExpression<T>,
    right: XExpression<T>
  ): Expression<T> {
    return new BinaryOperation(BINARY_OPERATION_OPERATOR.SHR, left, right);
  }

  static literal<T extends Scalar>(
    value: T,
    dbType?: DbTypeFromScalar<T>
  ): Literal<T> {
    return new Literal(value, dbType);
  }

  static var<T extends Scalar, N extends string = string>(
    name: N,
    type: DbTypeFromScalar<T>
  ): Variant<T, N> {
    return new Variant(name, type);
  }
  /**
   * 创建一个字段
   */
  static field<T extends Scalar, N extends string>(
    name: N,
    rowset?: XRowsets
  ): Field<T, N> {
    return new Field(name, rowset);
  }

  /**
   * 将多个查询条件通过 AND 合并成一个大查询条件
   * @param conditions 查询条件列表
   * @returns 返回逻辑表达式
   */
  static and(conditions: Condition[]): Condition;
  static and(...conditions: [Condition, Condition, ...Condition[]]): Condition;
  /**
   * 位算术运算 &
   * @param left 左值
   * @param right 右值
   * @returns 返回算术运算表达式
   */
  static and<T extends Interger>(
    left: XExpression<T>,
    right: XExpression<T>
  ): Expression<T>;
  static and(
    ...args:
      | Condition[]
      | [Condition[]]
      | [XExpression<Interger>, XExpression<Interger>]
  ): any {
    if (Array.isArray(args[0])) {
      args = args[0];
    }

    if (Expression.isExpression(args[0]) || isBaseScalar(args[0])) {
      return new BinaryOperation(
        BINARY_OPERATION_OPERATOR.AND,
        args[0],
        args[1] as XExpression<Interger>
      );
    }

    return SQL.join(LOGIC_OPERATOR.AND, args as Condition[]);
  }

  /**
   * 将多个查询条件通过 OR 合并成一个
   * @param conditions 查询条件列表
   * @returns 返回逻辑表达式
   */
  static or(conditions: Condition[]): Condition;
  static or(...conditions: [Condition, Condition, ...Condition[]]): Condition;
  /**
   * 位算术运算 |
   * @param left 左值
   * @param right 右值
   * @returns 返回算术运算表达式
   */
  static or<T extends Interger>(
    left: XExpression<T>,
    right: XExpression<T>
  ): Expression<T>;
  static or(
    ...args:
      | Condition[]
      | [Condition[]]
      | [XExpression<Interger>, XExpression<Interger>]
  ): any {
    if (Array.isArray(args[0])) {
      args = args[0];
    }
    if (Expression.isExpression(args[0]) || isBaseScalar(args[0])) {
      return new BinaryOperation(
        BINARY_OPERATION_OPERATOR.OR,
        args[0],
        args[1] as XExpression<Interger>
      );
    }
    return BinaryLogicCondition.join(LOGIC_OPERATOR.OR, args as Condition[]);
  }

  /**
   * Not 逻辑运算
   * @param condition
   */
  static not(condition: Condition): Condition;
  /**
   * 位算术运算 ~
   * @param value 左值
   * @param right 右值
   * @returns 返回算术运算表达式
   */
  static not<T extends Interger>(value: XExpression<T>): Expression<T>;
  static not(arg: Condition | XExpression<Interger>): any {
    if (Expression.isExpression(arg) || isBaseScalar(arg)) {
      return new UnaryOperation(UNARY_OPERATION_OPERATOR.NOT, arg);
    }
    return new UnaryLogicCondition(LOGIC_OPERATOR.NOT, arg);
  }

  /**
   * 使用逻辑表达式联接多个条件
   */
  private static join(
    logic: LOGIC_OPERATOR.AND | LOGIC_OPERATOR.OR,
    conditions: Condition[]
  ): Condition {
    if (conditions.length < 2) {
      throw new Error(`conditions must more than or equals 2 element.`);
    }
    const cond: Condition = conditions.reduce((previous, current) => {
      let condition = current;
      // 如果是二元逻辑条件运算，则将其用括号括起来，避免逻辑运算出现优先级的问题
      if (BinaryLogicCondition.isBinaryLogicCondition(condition)) {
        condition = SQL.group(condition);
      }
      if (!previous) return condition;
      return new BinaryLogicCondition(logic, previous, condition);
    }) as Condition;
    return SQL.group(cond);
  }

  /**
   * 比较运算 IS NULL
   * @returns 返回比较运算符
   * @param expr 表达式
   */
  static isNull(expr: XExpression<Scalar>): Condition {
    return new UnaryCompareCondition(UNARY_COMPARE_OPERATOR.IS_NULL, expr);
  }
  /**
   * 比较运算 IS NOT NULL
   * @param expr 表达式
   * @returns 返回比较运算符
   */
  static isNotNull(expr: XExpression<Scalar>): Condition {
    return new UnaryCompareCondition(UNARY_COMPARE_OPERATOR.IS_NOT_NULL, expr);
  }

  static eq<T extends Scalar>(
    left: XExpression<ExpandScalar<T>>,
    right: XExpression<ExpandScalar<T>>
  ): Condition {
    return new BinaryCompareCondition(BINARY_COMPARE_OPERATOR.EQ, left, right);
  }

  /**
   * 比较运算 <>
   * @param left 左值
   * @param right 右值
   * @returns 返回比较运算对比条件
   */
  static neq<T extends Scalar>(
    left: XExpression<T>,
    right: XExpression<T>
  ): Condition {
    return new BinaryCompareCondition(BINARY_COMPARE_OPERATOR.NEQ, left, right);
  }

  static lt<T extends Scalar>(
    left: XExpression<T>,
    right: XExpression<T>
  ): Condition {
    return new BinaryCompareCondition(BINARY_COMPARE_OPERATOR.LT, left, right);
  }
  /**
   * 比较运算 <=
   * @param left 左值
   * @param right 右值
   * @returns 返回比较运算对比条件
   */
  static lte<T extends Scalar>(
    left: XExpression<T>,
    right: XExpression<T>
  ): Condition {
    return new BinaryCompareCondition(BINARY_COMPARE_OPERATOR.LTE, left, right);
  }
  /**
   * 比较运算 >
   * @param left 左值
   * @param right 右值
   * @returns 返回比较运算对比条件
   */
  static gt<T extends Scalar>(
    left: XExpression<T>,
    right: XExpression<T>
  ): Condition {
    return new BinaryCompareCondition(BINARY_COMPARE_OPERATOR.GT, left, right);
  }
  /**
   * 比较运算 >=
   * @param left 左值
   * @param right 右值
   * @returns 返回比较运算对比条件
   */
  static gte<T extends Scalar>(
    left: XExpression<T>,
    right: XExpression<T>
  ): Condition {
    return new BinaryCompareCondition(BINARY_COMPARE_OPERATOR.GTE, left, right);
  }
  /**
   * 比较运算 LIKE
   * @param left 左值
   * @param right 右值
   * @returns 返回比较运算对比条件
   */
  static like(
    left: XExpression<string>,
    right: XExpression<string>
  ): Condition {
    return new BinaryCompareCondition(
      BINARY_COMPARE_OPERATOR.LIKE,
      left,
      right
    );
  }
  /**
   * 比较运算 NOT LIKE
   * @param left 左值
   * @param right 右值
   * @returns 返回比较运算对比条件
   */
  static notLike(
    left: XExpression<string>,
    right: XExpression<string>
  ): Condition {
    return new BinaryCompareCondition(
      BINARY_COMPARE_OPERATOR.NOT_LIKE,
      left,
      right
    );
  }
  /**
   * 比较运算 IN
   * @param left 左值
   * @param values 要比较的值列表
   * @returns 返回比较运算对比条件
   */
  static in<T extends Scalar>(
    left: XExpression<T>,
    select: Select<any>
  ): Condition;
  static in<T extends Scalar>(
    left: XExpression<T>,
    values: XExpression<T>[]
  ): Condition;
  static in<T extends Scalar>(
    left: XExpression<T>,
    values: XExpression<T>[] | Select<any>
  ): Condition;
  static in<T extends Scalar>(
    left: XExpression<T>,
    values: XExpression<T>[] | Select<any>
  ): Condition {
    return new BinaryCompareCondition(
      BINARY_COMPARE_OPERATOR.IN,
      left,
      Select.isSelect(values)
        ? values.asValue()
        : values.map(v => (Expression.isExpression(v) ? v : SQL.literal(v)))
    );
  }

  /**
   * 比较运算 NOT IN
   * @param left 左值
   * @param values 要比较的值列表
   * @returns 返回比较运算对比条件
   */
  static notIn<T extends Scalar>(
    left: XExpression<T>,
    values: XExpression<T>[]
  ): Condition {
    return new BinaryCompareCondition(
      BINARY_COMPARE_OPERATOR.NOT_IN,
      left,
      values.map(v => (Expression.isExpression(v) ? v : SQL.literal(v)))
    );
  }
  /**
   * 判断是否存在
   * @param select 查询语句
   */
  static exists(select: Select<any>): Condition {
    return new ExistsCondition(select);
  }

  static table<T extends RowObject = any>(
    name: string,
    members:
      | ((builder: TableVariantBuilder) => TableVariantMember[])
      | TableVariantMember[]
  ): XTableVariant<T>;
  static table<T extends RowObject = any>(
    name: XObjectName,
    builtIn?: boolean
  ): XTable<T>;
  static table<T extends RowObject = any>(
    name: XObjectName,
    builtInOrMembers:
      | boolean
      | TableVariantMember[]
      | ((builder: TableVariantBuilder) => TableVariantMember[]) = false
  ): XTable<T> | TableVariant<T> {
    if (
      typeof builtInOrMembers === 'function' ||
      Array.isArray(builtInOrMembers)
    ) {
      return createTableVariant(
        name as string,
        builtInOrMembers as
          | ((builder: TableVariantBuilder) => TableVariantMember[])
          | TableVariantMember[]
      );
    }
    return Table.create(name, builtInOrMembers as boolean);
  }
  /**
   * 声明一个函数
   */
  static func(name: XObjectName, builtIn = false): Func {
    return new Func(name, builtIn);
  }
  /**
   * 创建一个可供调用的存储过程函数
   */
  static proc<
    R extends Scalar = number,
    O extends RowObject[] = never,
    N extends string = string
  >(name: XObjectName<N>, builtIn = false): Procedure<R, O, N> {
    return new Procedure(name, builtIn);
  }

  static builtIn<N extends string>(name: N): BuiltIn<N> {
    return new BuiltIn(name);
  }

  static get star(): Star<any> {
    return new Star<any>();
  }

  static invokeAsTable<T extends RowObject = any>(
    func: XObjectName | Func<string>,
    args: XExpression<Scalar>[]
  ): XRowset<T> {
    return Func.ensure(func).invokeAsTable<T>(...args);
  }

  static invokeAsScalar<T extends Scalar = any>(
    func: XObjectName | Func<string>,
    args: XExpression<Scalar>[]
  ): Expression<T> {
    return Func.ensure(func).invokeAsScalar<T>(...args);
  }

  static makeInvoke(
    type: 'table',
    name: XObjectName,
    builtIn?: boolean
  ): (...args: any) => XRowset<any>;
  static makeInvoke<R extends RowObject, A extends Scalar[] = []>(
    type: 'table',
    name: XObjectName,
    builtIn?: boolean
  ): (...args: CompatiblifyTuple<A>) => XRowset<R>;
  static makeInvoke(
    type: 'scalar',
    name: XObjectName,
    builtIn?: boolean
  ): (...args: any) => Expression<any>;
  static makeInvoke<R extends Scalar, A extends Scalar[] = []>(
    type: 'scalar',
    name: XObjectName,
    builtIn?: boolean
  ): (...args: CompatiblifyTuple<A>) => Expression<R>;
  static makeInvoke(
    type: 'table' | 'scalar',
    name: XObjectName,
    builtIn = false
  ): any {
    if (type === 'table') {
      return function (...args: XExpression[]): XRowset<RowObject> {
        return SQL.invokeAsTable(SQL.func(name, builtIn), args);
      };
    }
    if (type === 'scalar') {
      return function (...args: XExpression<Scalar>[]): Expression {
        return SQL.invokeAsScalar<Scalar>(SQL.func(name, builtIn), args);
      };
    }
    throw new Error('invalid arg value of `type`');
  }

  /**
   * 创建一个可供JS调用的存储过程
   */
  static makeExec(
    name: XObjectName,
    builtIn?: boolean
  ): (...args: any[]) => Execute<any, any>;
  static makeExec<
    R extends Scalar = number,
    A extends Scalar[] = [],
    O extends RowObject[] = []
  >(
    name: XObjectName,
    builtIn?: boolean
  ): (...args: CompatiblifyTuple<A>) => Execute<R, O>;
  static makeExec(name: XObjectName, builtIn = false): any {
    return function (...args: XExpression<Scalar>[]): Execute<any, any> {
      return SQL.execute(SQL.proc<Scalar, any, string>(name, builtIn), args);
    };
  }

  //********************** statement **************************//

  /**
   * 赋值语句
   * @param left 左值
   * @param right 右值
   */
  static set<T extends Scalar = any>(
    left: Assignable<T>,
    right: XExpression<T>
  ): Assignment<T> {
    return new Assignment(left, right);
  }
  /**
   * 变量声明
   * @param declares 变量列表
   */
  static declare(
    ...members:
      | (Variant<any> | TableVariant<any>)[]
      | [(Variant<any> | TableVariant<any>)[]]
  ): Declare {
    if (members.length == 1 && Array.isArray(members[0])) {
      members = members[0];
    }
    return new Declare(members as (Variant<any> | TableVariant<any>)[]);
  }
  /**
   * WHEN 语句块
   * @param expr
   * @param value
   */
  static when<T extends Scalar>(
    expr: XExpression<Scalar>,
    value: XExpression<T>
  ): When<T> {
    return new When(expr, value);
  }

  static case<T extends Scalar>(expr?: XExpression): Case<T> {
    return new Case<T>(expr);
  }
  /**
   * With语句
   */
  static with(
    ...rowsets:
      | WithSelect[]
      | [WithSelect[]]
      | XWithSelect[]
      | [XWithSelect[]]
      | [SelectAliasObject]
  ): With {
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

  static get createTable(): CreateTableBuilder {
    return createTable;
  }

  static get alterTable(): AlterTableBuilder {
    return alterTable;
  }

  static createView<T extends RowObject = any, N extends string = string>(
    name: XObjectName<N>
  ): CreateView<T, N> {
    return new CreateView(name);
  }

  static alterView<T extends RowObject = any, N extends string = string>(
    name: XObjectName<N>
  ): AlterView<T, N> {
    return new AlterView(name);
  }

  static createIndex(name: string): CreateIndex {
    return new CreateIndex(name);
  }

  static get createProcedure(): CreateProcedureBuilder {
    return createProcedure;
  }

  static get alterProcedure(): AlterProcedureBuilder {
    return alterProcedure;
  }

  static get createFunction(): CreateFunctionBuilder {
    return createFunction;
  }

  static get alterFunction(): AlterFunctionBuilder {
    return alterFunction;
  }

  static dropProcedure<N extends string>(
    name: XObjectName<N>
  ): DropProcedure<N> {
    return new DropProcedure(name);
  }

  static dropTable<N extends string>(name: XObjectName<N>): DropTable<N> {
    return new DropTable(name);
  }

  static dropView<N extends string>(name: XObjectName<N>): DropView<N> {
    return new DropView(name);
  }

  static dropFunction<N extends string>(name: XObjectName<N>): DropFunction<N> {
    return new DropFunction(name);
  }

  static dropIndex<N extends string>(
    table: XObjectName,
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
    table: XTables<T>,
    fields?: ColumnsOf<T>[] | Field<Scalar, ColumnsOf<T>>[]
  ): Insert<T> {
    return new Insert(table, fields);
  }
  /**
   * 更新一个表格
   * @param table
   */
  static update<T extends RowObject = any>(table: XTables<T>): Update<T> {
    return new Update(table);
  }
  /**
   * 删除一个表格
   * @param table 表格
   */
  static delete<T extends RowObject = any>(table: XTables<T>): Delete<T> {
    return new Delete(table);
  }

  static readonly select: SelectAction = (...args: any[]): any => {
    return new Select(...args);
  };

  static raw(sql: string): any {
    return new Raw(sql);
  }

  static block(...args: Statement[] | [Statement[]]): Block {
    if (args.length === 1 && Array.isArray(args[0])) {
      args = args[0];
    }
    return new Block(args as Statement[]);
  }

  static execute<R extends Scalar = any, O extends RowObject[] = []>(
    proc: XObjectName | Procedure<R, O, string>,
    params?: XExpression<Scalar>[]
    // | Parameter<JsConstant, string>[] | InputObject
  ): Execute<R, O> {
    return new Execute(proc, params);
  }

  static createDatabase(name: string): CreateDatabase {
    return new CreateDatabase(name);
  }
  static alterDatabase(name: string): AlterDatabase {
    return new AlterDatabase(name);
  }
  static dropDatabase(name: string): DropDatabase {
    return new DropDatabase(name);
  }
  static createSequence(name: XObjectName): CreateSequence {
    return new CreateSequence(name);
  }
  static dropSequence(name: XObjectName): DropSequence {
    return new DropSequence(name);
  }

  //******************end statement*******************//

  //*************************** 参数声明 ***************************//
  /**
   * input 参数
   */
  static input<T extends Scalar, N extends string>(
    name: N,
    value: T
  ): Parameter<ExpandScalar<T>, N>;
  static input<T extends DbType, N extends string>(
    name: N,
    type: T,
    value?: ScalarFromDbType<T>
  ): Parameter<ExpandScalar<ScalarFromDbType<T>>, N>;
  static input(
    name: string,
    typeOrValue: DbType | Scalar,
    value?: Scalar
  ): Parameter {
    let type: DbType | undefined;
    if (isDbType(typeOrValue)) {
      type = typeOrValue;
    } else {
      value = typeOrValue;
    }
    return new Parameter(name, type, value, 'IN');
  }

  /**
   * output参数
   */
  static output<T extends DbType, N extends string>(
    name: N,
    type: T,
    value?: ScalarFromDbType<T>
  ): Parameter<ExpandScalar<ScalarFromDbType<T>>, N> {
    return new Parameter(name, type, value, 'OUT');
  }

  /**
   * 创建一个输入输出参数
   */
  static inoutput<T extends DbType, N extends string>(
    name: N,
    type: T,
    value?: ScalarFromDbType<T>
  ): Parameter<ExpandScalar<ScalarFromDbType<T>>, N> {
    return new Parameter(name, type, value, 'INOUT');
  }

  //***************************End 参数声明 ***************************//

  static sequence<T extends Numeric>(name: XObjectName): Sequence<T> {
    return new Sequence(name);
  }
}

export enum SQL_SYMBOLE {
  DECLARE = 'DECLARE',
  EXPRESSION = 'EXPRESSION',
  CREATE_TABLE_COLUMN = 'CREATE_TABLE_COLUMN',
  STAR = 'STAR',
  RAW = 'RAW',
  STATEMENT = 'STATEMENT',
  // ANY = '*',
  INVOKE_ARGUMENT_LIST = 'INVOKE_ARGUMENT_LIST',
  EXECUTE_ARGUMENT_LIST = 'EXECUTE_ARGUMENT_LIST',
  VARAINT_DECLARE = 'VARAINT_DECLARE',
  TABLE_VARIANT_DECLARE = 'TABLE_VARIANT_DECLARE',
  IDENTIFIER = 'IDENTIFIER',
  IDENTITY_VALUE = 'IDENTITY_VALUE',
  STANDARD_EXPRESSION = 'STANDARD_EXPRESSION',
  SCALAR_FUNCTION_INVOKE = 'SCALAR_FUNCTION_INVOKE',
  TABLE_FUNCTION_INVOKE = 'TABLE_FUNCTION_INVOKE',
  LITERAL = 'LITERAL',
  SORT = 'SORT',
  JOIN = 'JOIN',
  UNION = 'UNION',
  WHEN = 'WHEN',
  CASE = 'CASE',
  DOCUMENT = 'DOCUMENT',
  WITH = 'WITH',
  GROUP_EXPRESSION = 'GROUP_EXPRESSION',
  NAMED_SELECT = 'NAMED_SELECT',
  WITH_SELECT = 'WITH_SELECT',
  OPERATION = 'OPERATION',
  VALUED_SELECT = 'VALUED_SELECT',
  PRIMARY_KEY = 'CREATE_TABLE_PRIMARY_KEY',
  FOREIGN_KEY = 'FOREIGN_KEY',
  ALTER_TABLE_DROP_MEMBER = 'ALTER_TABLE_DROP_COLUMN',
  ALTER_TABLE_DROP_CONSTRAINT = 'ALTER_TABLE_DROP_CONSTRAINT',
  CHECK_CONSTRAINT = 'CHECK_CONSTRAINT',
  UNIQUE_KEY = 'UNIQUE_KEY',
  PROCEDURE_PARAMETER = 'PROCEDURE_PARAMETER',
  FUNCTION_PARAMETER = 'FUNCTION_PARAMETER',
  ALTER_TABLE_COLUMN = 'ALTER_TABLE_COLUMN',
  CONDITION = 'CONDITION',
  PARAMETER = 'PARAMETER',
  /**
   * 表
   */
  TABLE = 'TABLE',
  /**
   * 字段
   */
  FIELD = 'FIELD',
  /**
   * 函数
   */
  FUNCTION = 'FUNCITON',

  /**
   * 序列
   */
  SEQUENCE = 'SEQUENCE',
  // /**
  //  * 标量函数
  //  */
  // SCALAR_FUNCTION ='SCALAR_FUNCTION',
  // /**
  //  * 表值函数
  //  */
  // TABLE_FUNCTION = 'TABLE_FUNCTION',
  /**
   * 存储过程
   */
  PROCEDURE = 'PROCEDURE',
  /**
   * 内建标识
   */
  BUILT_IN = 'BUILT_IN',
  /**
   * 别名
   */
  ALIAS = 'ALIAS',
  /**
   * 列
   */
  SELECT_COLUMN = 'SELECT_COLUMN',
  /**
   * 变量
   */
  VARIANT = 'VARIANT',
  /**
   * 表变量
   */
  TABLE_VARIANT = 'TABLE_VARIANT',
  /**
   * 对象
   */
  OBJECT = 'OBJECT',
  ROWSET = 'ROWSET',
}

export type SQLConstructor = typeof SQLClass;
export type SQL = SQLClass;
export const SQL: SQLConstructor = SQLClass;

// ********************因为循环引用的原因，必须将import放置在后面********************** //
import {
  DbType,
  DbTypeFromScalar,
  isDbType,
  ScalarFromDbType,
} from './db-type';
import { Document } from './document';
import {
  XObjectName,
  Func,
  Procedure,
  BuiltIn,
  Sequence,
  Star,
} from './object';
import {
  Table,
  WithSelect,
  XTable,
  XRowsets,
  XRowset,
  XTables,
  XWithSelect,
  TableVariant,
  XTableVariant,
  TableVariantMember,
  TableVariantBuilder,
  createTableVariant,
} from './rowset';
import {
  GroupCondition,
  BinaryLogicCondition,
  LOGIC_OPERATOR,
  BinaryCompareCondition,
  BINARY_COMPARE_OPERATOR,
  ExistsCondition,
  Condition,
  UnaryLogicCondition,
  UnaryCompareCondition,
  UNARY_COMPARE_OPERATOR,
} from './condition';
import { Standard } from '../standard';
import {
  Assignable,
  BinaryOperation,
  Case,
  XExpression,
  Expression,
  Field,
  GroupExpression,
  Literal,
  Parameter,
  UnaryOperation,
  Variant,
  When,
} from './expression';
import {
  BINARY_OPERATION_OPERATOR,
  UNARY_OPERATION_OPERATOR,
} from './expression/common/operation';
import { Raw } from './raw';
import { Scalar, Interger, isBaseScalar, Numeric } from './scalar';
import {
  AlterDatabase,
  alterFunction,
  AlterFunctionBuilder,
  alterProcedure,
  AlterProcedureBuilder,
  alterTable,
  AlterTableBuilder,
  AlterView,
  Annotation,
  Assignment,
  Block,
  Break,
  Continue,
  CreateDatabase,
  createFunction,
  CreateFunctionBuilder,
  CreateIndex,
  createProcedure,
  CreateProcedureBuilder,
  CreateSequence,
  createTable,
  CreateTableBuilder,
  CreateView,
  Declare,
  Delete,
  DropDatabase,
  DropFunction,
  DropIndex,
  DropProcedure,
  DropSequence,
  DropTable,
  DropView,
  Execute,
  If,
  Insert,
  Return,
  Select,
  SelectAction,
  SelectAliasObject,
  Statement,
  Update,
  Use,
  While,
  With,
} from './statement';
import { clone } from './util';
