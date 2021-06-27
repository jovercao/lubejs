import {
  ascii,
  avg,
  char,
  charIndex,
  convert,
  format,
  count,
  dateDiff,
  datePart,
  DATE_PART,
  IDENTITY,
  len,
  lower,
  ltrim,
  max,
  min,
  replace,
  rtrim,
  substring,
  sum,
  unicode,
  upper,
  sysDateTimeOffset,
  sysUtcDateTime,
  switchOffset,
  dateAdd,
  isNull,
  abs,
  exp,
  ceiling,
  floor,
  log,
  log10,
  pi,
  power,
  radians,
  degrees,
  rand,
  round,
  sign,
  sqrt,
  cos,
  sin,
  tan,
  acos,
  asin,
  atan,
  atan2,
  cot,
  sp_rename,
} from './build-in';
import {
  Compiler,
  CompileOptions,
  DbType,
  Select,
  Parameter,
  StandardTranslator,
  CompatibleExpression,
  Star,
  Expression,
  Scalar,
  Binary,
  TsTypeOf,
  SqlBuilder as SQL,
  TableVariantDeclare,
  Insert,
  AST,
  SQL_SYMBOLE_TABLE_MEMBER,
} from '../..';

import { dbTypeToRaw, rawToDbType } from './types';
import {
  Block,
  CreateIndex,
  AlterFunction,
  CreateFunction,
  AlterProcedure,
  Statement,
  AlterTable,
  CreateProcedure,
  AlterTableAddMember,
  CreateTableMember,
  CreateTable,
  ProcedureParameter,
  CreateSequence,
  DropSequence,
  Annotation,
  Condition,
} from '../../ast';
import { Name } from '../../types';
import {
  isAlterTableColumn,
  isCheckConstraint,
  isCreateTableColumn,
  isDbType,
  isForeignKey,
  isPrimaryKey,
  isRaw,
  isUniqueKey,
  isVariantDeclare,
} from '../../util';
import { formatSql, sqlifyLiteral } from './util';
import { MssqlProvider } from './provider';

export interface MssqlCompileOptions extends CompileOptions {}

/**
 * 默认编译选项
 */
export const DefaultCompilerOptions: MssqlCompileOptions = {
  strict: true,
  /**
   * 标识符引用，左
   */
  quotedLeft: '[',
  /**
   * 标识符引用，右
   */
  quotedRight: ']',

  /**
   * 参数前缀
   */
  parameterPrefix: '@',

  /**
   * 变量前缀
   */
  variantPrefix: '@',

  /**
   * 集合别名连接字符，默认为 ''
   */
  setsAliasJoinWith: 'AS',

  /**
   * 输出参数尾词
   */
  parameterOutWord: 'OUT',

  /**
   * 字段别名连接字符器，默认为 ''
   */
  fieldAliasJoinWith: 'AS',

  // blockSplitWord: '\nGO\n',
};

// const MssqlFormatStyleIdMap = {
//   'mon dd yyyy hh:miAM ': 100,
//   'mon dd yyyy hh:miPM ': 0,
//   'mm/dd/yy': 101,
//   'yy.mm.dd': 102,
//   'dd/mm/yy': 103,
//   'dd.mm.yy': 104,
//   'dd-mm-yy': 105,
//   'dd mon yy': 106,
//   'Mon dd, yy': 107,
//   'hh:mm:ss': 108,
//   'mon dd yyyy hh:mi:ss:mmmAM': 109,
//   'mon dd yyyy hh:mi:ss:mmmPM': 9,
//   'mm-dd-yy': 110,
//   'yy/mm/dd': 111,
//   'yymmdd': 112,
//   'dd mon yyyy hh:mm:ss:mmm(24h)': 113,
//   'hh:mi:ss:mmm(24h)': 114,
//   'yyyy-mm-dd hh:mi:ss(24h': 120,
//   'yyyy-mm-dd hh:mi:ss.mmm(24h)': 121,
//   'yyyy-mm-ddThh:mm:ss.mmm': 126,
//   'dd mon yyyy hh:mi:ss:mmmAM': 130,
//   'dd/mm/yy hh:mi:ss:mmmAM': 131,
// }

// `(SELECT o.name AS tableName, c.name AS columnName, p.[value] AS Description
//   FROM sysproperties p INNER JOIN
//   sysobjects o ON o.id = p.id INNER JOIN
//   syscolumns c ON p.id = c.id AND p.smallid = c.colid
//   WHERE (p.name = 'MS_Description')
//   ORDER BY o.name)`
// }

export class MssqlStandardTranslator implements StandardTranslator {
  compiler: MssqlCompiler;

  constructor(private provider: MssqlProvider) {}

  abs(value: CompatibleExpression<number>): Expression<number> {
    return abs(value);
  }

  exp(value: CompatibleExpression<number>): Expression<number> {
    return exp(value);
  }

  ceil(value: CompatibleExpression<number>): Expression<number> {
    return ceiling(value);
  }

  floor(value: CompatibleExpression<number>): Expression<number> {
    return floor(value);
  }

  ln(value: CompatibleExpression<number>): Expression<number> {
    return log10(value);
  }

  log(value: CompatibleExpression<number>): Expression<number> {
    return log(value);
  }

  mod(
    value: CompatibleExpression<number>,
    x: CompatibleExpression<number>
  ): Expression<number> {
    return SQL.mod(value, x);
  }

  pi(): Expression<number> {
    return pi();
  }

  power(
    a: CompatibleExpression<number>,
    b: CompatibleExpression<number>
  ): Expression<number> {
    return power(a, b);
  }

  radians(value: CompatibleExpression<number>): Expression<number> {
    return radians(value);
  }

  degrees(value: CompatibleExpression<number>): Expression<number> {
    return degrees(value);
  }

  random(): Expression<number> {
    return rand();
  }

  round(
    value: CompatibleExpression<number>,
    s?: CompatibleExpression<number>
  ): Expression<number> {
    return round(value, s);
  }

  sign(value: CompatibleExpression<number>): Expression<number> {
    return sign(value);
  }

  sqrt(value: CompatibleExpression<number>): Expression<number> {
    return sqrt(value);
  }

  cos(value: CompatibleExpression<number>): Expression<number> {
    return cos(value);
  }

  sin(value: CompatibleExpression<number>): Expression<number> {
    return sin(value);
  }

  tan(value: CompatibleExpression<number>): Expression<number> {
    return tan(value);
  }

  acos(value: CompatibleExpression<number>): Expression<number> {
    return acos(value);
  }

  asin(value: CompatibleExpression<number>): Expression<number> {
    return asin(value);
  }

  atan(value: CompatibleExpression<number>): Expression<number> {
    return atan(value);
  }

  atan2(value: CompatibleExpression<number>): Expression<number> {
    return atan2(value);
  }

  cot(value: CompatibleExpression<number>): Expression<number> {
    return cot(value);
  }

  nvl<T extends Scalar>(
    value: CompatibleExpression<T>,
    defaultValue: CompatibleExpression<T>
  ): Expression<T> {
    return isNull(value, defaultValue);
  }

  count(expr: Star | CompatibleExpression<Scalar>): Expression<number> {
    return count(expr);
  }

  avg(expr: CompatibleExpression<number>): Expression<number> {
    return avg(expr);
  }

  sum(expr: CompatibleExpression<number>): Expression<number> {
    return sum(expr);
  }

  max<T extends Exclude<Scalar, Binary>>(expr: Expression<T>): Expression<T> {
    return max(expr);
  }

  min<T extends Exclude<Scalar, Binary>>(expr: Expression<T>): Expression<T> {
    return min(expr);
  }

  /**
   * 获取标识列的最近插入值
   * @param table
   * @param column
   * @returns
   */
  identityValue(
    table: CompatibleExpression<string>,
    column: CompatibleExpression<string>
  ): Expression<number> {
    return IDENTITY;
    // return StandardOperation.create(identityValue.name, [table, column]);
  }

  /**
   * 转换数据类型
   * @param expr
   * @param toType
   * @returns
   */
  convert<T extends DbType>(
    expr: CompatibleExpression,
    toType: T
  ): Expression<TsTypeOf<T>> {
    return convert(toType, expr);
  }

  /**
   * 获取当前日期及时间
   * @returns
   */
  now(): Expression<Date> {
    return sysDateTimeOffset();
  }

  /**
   * 获取当前UTC时间
   * @returns
   */
  utcNow(): Expression<Date> {
    return sysUtcDateTime();
  }

  /**
   * 切换时区
   */
  switchTimezone(
    date: CompatibleExpression<Date>,
    timeZone: CompatibleExpression<string>
  ): Expression<Date> {
    return switchOffset(date, timeZone);
  }

  /**
   * 格式化日期函数
   * @param date
   * @param format
   * @returns
   */
  formatDate(
    date: CompatibleExpression<Date>,
    fmt: string
  ): Expression<string> {
    return format(date, fmt);
  }

  /**
   * 获取日期中的年份
   * @param date
   * @returns
   */
  yearOf(date: CompatibleExpression<Date>): Expression<number> {
    return datePart(DATE_PART.YEAR, date);
  }

  /**
   * 获取日期中的月份
   * @param date
   * @returns
   */
  monthOf(date: CompatibleExpression<Date>): Expression<number> {
    return datePart(DATE_PART.MONTH, date);
  }

  /**
   * 获取日期中的日
   * @param date
   * @returns
   */
  dayOf(date: CompatibleExpression<Date>): Expression<number> {
    return datePart(DATE_PART.DAY, date);
  }

  /**
   * 计算两个日期之间的天数，小数
   * @param start
   * @param end
   * @returns
   */
  daysBetween(
    start: CompatibleExpression<Date>,
    end: CompatibleExpression<Date>
  ): Expression<number> {
    return dateDiff(DATE_PART.DAY, start, end);
  }

  /**
   * 计算两个日期之间的天数，小数
   * @param start
   * @param end
   * @returns
   */
  monthsBetween(
    start: CompatibleExpression<Date>,
    end: CompatibleExpression<Date>
  ): Expression<number> {
    return dateDiff(DATE_PART.MONTH, start, end);
  }

  /**
   * 计算两个日期之间的天数，小数
   * @param start
   * @param end
   * @returns
   */
  yearsBetween(
    start: CompatibleExpression<Date>,
    end: CompatibleExpression<Date>
  ): Expression<number> {
    return dateDiff(DATE_PART.YEAR, start, end);
  }

  /**
   * 计算两个日期之间的天数，小数
   * @param start
   * @param end
   * @returns
   */
  hoursBetween(
    start: CompatibleExpression<Date>,
    end: CompatibleExpression<Date>
  ): Expression<number> {
    return dateDiff(DATE_PART.HOUR, start, end);
  }

  /**
   * 计算两个日期之间的天数，小数
   * @param start
   * @param end
   * @returns
   */
  minutesBetween(
    start: CompatibleExpression<Date>,
    end: CompatibleExpression<Date>
  ): Expression<number> {
    return dateDiff(DATE_PART.MINUTE, start, end);
  }

  /**
   * 计算两个日期之间的天数，小数
   * @param start
   * @param end
   * @returns
   */
  secondsBetween(
    start: CompatibleExpression<Date>,
    end: CompatibleExpression<Date>
  ): Expression<number> {
    return dateDiff(DATE_PART.SECOND, start, end);
  }

  addDays(
    date: CompatibleExpression<Date>,
    days: CompatibleExpression<number>
  ): Expression<Date> {
    return dateAdd(DATE_PART.DAY, days, date);
  }

  addMonths(
    date: CompatibleExpression<Date>,
    months: CompatibleExpression<number>
  ): Expression<Date> {
    return dateAdd(DATE_PART.MONTH, months, date);
  }

  addYears(
    date: CompatibleExpression<Date>,
    years: CompatibleExpression<number>
  ): Expression<Date> {
    return dateAdd(DATE_PART.YEAR, years, date);
  }

  addHours(
    date: CompatibleExpression<Date>,
    hours: CompatibleExpression<number>
  ): Expression<Date> {
    return dateAdd(DATE_PART.HOUR, hours, date);
  }

  addMinutes(
    date: CompatibleExpression<Date>,
    minutes: CompatibleExpression<number>
  ): Expression<Date> {
    return dateAdd(DATE_PART.MINUTE, minutes, date);
  }

  /**
   *
   * @param date
   * @param seconds
   * @returns
   */
  addSeconds(
    date: CompatibleExpression<Date>,
    seconds: CompatibleExpression<number>
  ): Expression<Date> {
    return dateAdd(DATE_PART.SECOND, seconds, date);
  }

  /**
   * 获取字符串长度
   * @param str
   * @returns
   */
  strlen(str: CompatibleExpression<string>): Expression<number> {
    return len(str);
  }

  /**
   * 截取字符串
   * @param str
   * @param start
   * @param length
   * @returns
   */
  substr(
    str: CompatibleExpression<string>,
    start: CompatibleExpression<number>,
    length: CompatibleExpression<number>
  ): Expression<string> {
    return substring(str, start, length);
  }

  /**
   * 替换字符串
   * @param str 需要被替换的字符串
   * @param search 查找字符串
   * @param to 替换成字符串
   * @param global 是否全局替换，默认为false
   * @returns
   */
  replace(
    str: CompatibleExpression<string>,
    search: CompatibleExpression<string>,
    to: CompatibleExpression<string>
  ): Expression<string> {
    return replace(str, search, to);
  }

  /**
   * 删除字符串两侧空格
   * @param str
   * @returns
   */
  trim(str: CompatibleExpression<string>): Expression<string> {
    return ltrim(rtrim(str));
  }

  /**
   * 删除字符串右侧空格
   * @param str
   * @returns
   */
  trimEnd(str: CompatibleExpression<string>): Expression<string> {
    return rtrim(str);
  }

  /**
   * 转换成大写字母
   * @param str
   * @returns
   */
  upper(str: CompatibleExpression<string>): Expression<string> {
    return upper(str);
  }

  /**
   * 转换成小写字母
   * @param str
   * @returns
   */
  lower(str: CompatibleExpression<string>): Expression<string> {
    return lower(str);
  }

  /**
   * 查找一个
   * @param str
   * @param search
   * @returns
   */
  strpos(
    str: CompatibleExpression<string>,
    search: CompatibleExpression<string>,
    startAt?: CompatibleExpression<number>
  ): Expression<number> {
    return charIndex(search, str, startAt);
  }

  /**
   * 获取一个字符的ascii码
   * @param str 字符编码
   * @returns
   */
  ascii(str: CompatibleExpression<string>): Expression<number> {
    return ascii(str);
  }

  asciiChar(code: CompatibleExpression<number>): Expression<string> {
    return char(code);
  }

  unicode(str: CompatibleExpression<string>): Expression<number> {
    return unicode(str);
  }

  unicodeChar(code: CompatibleExpression<number>): Expression<string> {
    return char(code);
  }
}

export class MssqlCompiler extends Compiler {
  constructor(
    options: MssqlCompileOptions,
    public readonly translator: MssqlStandardTranslator
  ) {
    super(Object.assign({}, DefaultCompilerOptions, options));
  }

  protected compileAnnotation(statement: Annotation): string {
    if (statement.$kind === 'LINE') {
      return statement.$text
        .split(/\n|\r\n/g)
        .map(line => '-- ' + line)
        .join('\n');
    }
    return '/**\n' + statement.$text.split(/\n|\r\n/g).map(line => ' * ' + line.replace(/\*\//g, '* /')).join('\n') + '\n */';
  }

  public compileLiteral(literal: Scalar): string {
    return sqlifyLiteral(literal);
  }

  protected compileDropSequence(statement: DropSequence): string {
    return `DROP SEQUENCE ${this.stringifyName(statement.$name)}`;
  }
  protected compileCreateSequence(statement: CreateSequence): string {
    return `CREATE SEQUENCE ${this.stringifyName(
      statement.$name
    )} START WITH ${this.compileLiteral(
      statement.$startValue.$value
    )} INCREMENT BYH ${this.compileLiteral(statement.$increment.$value)}`;
  }
  protected compileProcedureParameter(param: ProcedureParameter): string {
    let sql = `${this.stringifyVariantName(param.$name)} ${this.compileType(
      param.$dbType
    )}`;
    if (param.$direct) {
      sql += ' ' + param.$direct;
    }
    if (param.$default) {
      sql += ' = ' + this.compileLiteral(param.$default.$value);
    }
    return sql;
  }

  protected compileBlock(
    statement: Block,
    params?: Set<Parameter<Scalar, string>>,
    parent?: AST
  ): string {
    return `BEGIN\n  ${statement.$statements
      .map(statement => this.compileStatement(statement, params, parent))
      .join('\n  ')}\nEND`;
  }

  protected compileDropIndex(table: Name, name: string): string {
    return `DROP INDEX ${this.stringifyName([name, ...table] as Name)}`;
  }

  protected compileCreateIndex(statement: CreateIndex): string {
    return `CREATE INDEX ${this.stringifyName(
      statement.$name
    )} ON ${this.stringifyName(statement.$table)}(${statement.$columns
      .map(col => `${this.quoted(col.name)} ${col.sort}`)
      .join(', ')})`;
  }

  protected compileDropFunction(name: Name): string {
    return `DROP FUNCTION ${name}`;
  }

  protected compileAlterFunction(statement: AlterFunction): string {
    if (statement.$kind === 'SCALAR') {
      return `ALTER FUNCTION ${this.stringifyName(
        statement.$name
      )}(${statement.$params
        .map(param => this.compileVariantDeclare(param))
        .join(', ')}) `;
    }
  }

  protected compileCreateFunction(statement: CreateFunction): string {
    return `CREATE FUNCTION ${this.stringifyName(
      statement.$name
    )}(${statement.$params
      .map(param => this.compileVariantDeclare(param))
      .join(', ')}) RETURNS ${
      isRaw(statement.$returns)
        ? statement.$returns.$sql
        : isDbType(statement.$returns)
        ? this.compileType(statement.$returns)
        : isVariantDeclare(statement.$returns)
        ? this.compileVariantDeclare(statement.$returns)
        : this.compileTableVariantDeclare(statement.$returns)
    } AS ${this.compileStatements(statement.$body)}`;
  }

  protected compileDropProcedure(name: Name): string {
    return `DROP PROCEDURE ${this.stringifyName(name)}`;
  }

  protected compileAlterProcedure(statement: AlterProcedure): string {
    return `ALTER PROCEDURE ${this.stringifyName(
      statement.$name
    )} (${statement.$params
      .map(param => this.compileProcedureParameter(param))
      .join(', ')})`;
  }

  protected compileCreateProcedure(statement: CreateProcedure): string {
    return `CREATE PROCEDURE ${this.stringifyName(
      statement.$name
    )} (${statement.$params
      .map(param => this.compileProcedureParameter(param))
      .join(', ')})`;
  }

  protected compileAlterTable(statement: AlterTable<string>): string {
    let sql = `ALTER TABLE ${this.stringifyName(statement.$name)}`;
    if (statement.$adds) {
      sql += ' ADD ';
      sql += statement.$adds
        .map(member => this.compileTableMember(member))
        .join(',\n  ');
    }
    if (statement.$drops) {
      sql += ' DROP ';
      sql += statement.$drops
        .map(member => {
          if (member.$kind === SQL_SYMBOLE_TABLE_MEMBER.COLUMN) {
            return ` COLUMN ${this.quoted(member.$name)}`
          }
          return ` CONSTRAINT ${this.quoted(member.$name)}`
        })
        .join(',\n  ');
    }
    return sql;
  }

  private compileTableMember(member: AlterTableAddMember | CreateTableMember) {
    if (isCreateTableColumn(member)) {
      let sql = `${this.quoted(member.$name)} ${this.compileType(
        member.$dbType
      )}`;
      if (member.$nullable !== undefined) {
        sql += member.$nullable ? ' NULL' : ' NOT NULL';
      }
      if (member.$identity) {
        sql += ` IDENTITY(${member.$identity.startValue}, ${member.$identity.increment})`;
      }
      if (member.$primaryKey) {
        sql += ' PRIMARY KEY';
        if (member.$primaryKey.nonclustered) {
          sql += ' NONCLUSTERED';
        }
      }
      if (member.$check) {
        sql += ` CHECK(${this.compileCondition(member.$check)})`;
      }
      return sql;
    }

    if (isAlterTableColumn(member)) {
    }

    if (isPrimaryKey(member)) {
      return (
        (member.$name ? `CONSTRAINT ${this.quoted(member.$name)} ` : '') +
        ` PRIMARY KEY(${member.$columns.map(
          col => `${this.quoted(col.name)} ${col.sort}`
        )})`
      );
    }

    if (isUniqueKey(member)) {
      return (
        (member.$name ? `CONSTRAINT ${this.quoted(member.$name)} ` : '') +
        `UNIQUE(${member.$columns.map(
          col => `${this.quoted(col.name)} ${col.sort}`
        )})`
      );
    }

    if (isForeignKey(member)) {
      return (
        (member.$name ? `CONSTRAINT ${this.quoted(member.$name)} ` : '') +
        `FOREIGN KEY(${member.$columns.map(col =>
          this.quoted(col)
        )}) REFERENCES ${this.stringifyName(
          member.$referenceTable
        )}(${member.$referenceColumns.map(col => this.quoted(col)).join(', ')})`
      );
    }

    if (isCheckConstraint(member)) {
      return (
        (member.$name ? `CONSTRAINT ${this.quoted(member.$name)} ` : '') +
        `CHECK (${this.compileCondition(member.$sql)})`
      );
    }
  }

  compileCreateTable(statement: CreateTable): string {
    let sql = `CREATE TABLE ${this.stringifyName(statement.$name)} (`;
    sql += statement.$members
      .map(member => this.compileTableMember(member))
      .join(',\n  ');
    sql += ')';
    return sql;
  }

  protected compileInsert(
    insert: Insert,
    params?: Set<Parameter<Scalar, string>>,
    parent?: AST
  ): string {
    const sql = super.compileInsert(insert, params, parent);
    if (!insert.$identityInsert) return sql;
    return `SET IDENTITY_INSERT ${this.stringifyIdentifier(insert.$table)} ON
${sql}
SET IDENTITY_INSERT ${this.stringifyIdentifier(insert.$table)} OFF
`;
  }

  protected compileTableVariantDeclare(
    declare: TableVariantDeclare<any>
  ): string {
    throw new Error(`待完成!`);
    //     if (declare.$schema.foreignKeys?.length > 0) {
    //       throw new Error(`Table variant is not support foreign key at mssql.`);
    //     }
    //     return `DECLARE @${this.stringifyIdentifier(declare.$name)} TABLE(
    // ${[
    //   ...declare.$schema.columns.map((column) => {
    //     if (column.isCalculate) {
    //       return `${this.quoted(column.name)} AS ${column.calculateExpression}`;
    //     }
    //     let columnDesc = `${this.quoted(column.name)} ${this.compileType(
    //       column.type
    //     )} ${column.isNullable ? "NULL" : "NOT NULL"}`;
    //     if (column.isIdentity) {
    //       columnDesc += ` IDENTITY(${column.identityStartValue}, ${column.identityIncrement})`;
    //     }
    //     return columnDesc;
    //   }),
    //   ...declare.$schema.indexes.map((index) => {
    //     if (index.isPrimaryKey) {
    //       return `PRIMARY KEY (${index.columns
    //         .map((col) => this.quoted(col))
    //         .join(", ")})`;
    //     }
    //     if (index.isUnique) {
    //       throw new Error(`Mssql not support unique index at table variant.`);
    //     }
    //     return "";
    //   }),
    // ].join(",\n")}

    // )`;
  }

  // private _translator: StandardTranslator;

  // get translator(): StandardTranslator {
  //   if (!this._translator) {
  //     this._translator = new MssqlStandardTranslator(this);
  //   }
  //   return this._translator;
  // }

  compileType(type: DbType): string {
    return dbTypeToRaw(type);
  }

  parseRawType(type: string): DbType {
    return rawToDbType(type);
  }

  protected compileOffsetLimit(
    select: Select<any>,
    params: Set<Parameter>
  ): string {
    let sql = '';
    if (select.$offset === undefined && select.$limit === undefined) return sql;
    if (!select.$sorts) {
      select.orderBy(1);
      sql += ' ORDER BY 1';
    }
    sql += ` OFFSET ${select.$offset || 0} ROWS`;
    if (typeof select.$limit === 'number') {
      sql += ` FETCH NEXT ${select.$limit} ROWS ONLY`;
    }
    return sql;
  }
  // compileColumn(col, params) {
  //   return `${this.quoted(col.name)} = ${this.compileExpression(col.$expr, params, col)}`
  // }
}
