import mssql, { ISqlType, TYPES } from 'mssql';
import { ConnectOptions, DbType, ISOLATION_LEVEL, isRaw, Raw } from 'lubejs';
import { MssqlSqlOptions } from './sql-util'

const strTypeMapps: Record<string, any> = {};
Object.entries(mssql.TYPES).forEach(([name, dbType]) => {
  strTypeMapps[name.toUpperCase()] = dbType;
});

const typeReg =
  /^\s*(?<type>\w+)\s*(?:\(\s*((?<max>max)|((?<p1>\d+)(\s*,\s*(?<p2>\d+))?))\s*\))?\s*$/i;

export function parseRawTypeToMssqlType(type: string): ISqlType {
  const matched = typeReg.exec(type);
  if (!matched) {
    throw new Error('Error mssql datat type: ' + type);
  }
  const sqlType = strTypeMapps[matched.groups!.type.toUpperCase()];
  if (!sqlType) {
    throw new Error('Unspport mssql data type:' + type);
  }

  if (matched.groups!.max) {
    return sqlType(mssql.MAX);
  }
  if (matched.groups!.p2 !== undefined) {
    return sqlType(
      Number.parseInt(matched.groups!.p1),
      Number.parseInt(matched.groups!.p2)
    );
  }
  return sqlType(Number.parseInt(matched.groups!.p1));
}

export function fullType(
  typeName: string,
  length: number,
  precision: number,
  scale: number
): string {
  typeName = typeName.toUpperCase();
  if (
    ['NVARCHAR', 'VARCHAR', 'NCHAR', 'CHAR', 'VARBINARY', 'BINARY'].includes(
      typeName
    )
  ) {
    return `${typeName}(${length === -1 ? 'MAX' : length})`;
  }

  if (typeName === 'DATETIMEOFFSET') {
    return `${typeName}(${scale})`;
  }

  if (['DECIMAL', 'NUMERIC'].includes(typeName)) {
    return `${typeName}(${precision},${scale})`;
  }
  return typeName;
}

export function toMssqlType(type: DbType): mssql.ISqlType {
  if (isRaw(type)) {
    return parseRawTypeToMssqlType(type.$sql);
  }
  switch (type.name) {
    case 'BINARY':
      return mssql.Binary();
    case 'BOOLEAN':
      return mssql.Bit();
    case 'DATE':
      return mssql.Date();
    case 'DATETIME':
      return mssql.DateTimeOffset();
    case 'FLOAT':
      return mssql.Real();
    case 'DOUBLE':
      return mssql.Float();
    case 'INT8':
      return mssql.TinyInt();
    case 'INT16':
      return mssql.SmallInt();
    case 'INT32':
      return mssql.Int();
    case 'INT64':
      return mssql.BigInt();
    case 'DECIMAL':
      return mssql.Decimal(type.precision, type.digit);
    case 'STRING':
      return mssql.VarChar(type.length);
    case 'UUID':
      return mssql.UniqueIdentifier();
    case 'ROWFLAG':
      return mssql.BigInt();
    case 'ARRAY':
    case 'OBJECT':
      return mssql.NVarChar(mssql.MAX);
    default:
      throw new Error(`Unsupport data type ${type['name']}`);
  }
}

const IsolationLevelMapps = {
  READ_COMMIT: mssql.ISOLATION_LEVEL.READ_COMMITTED,
  READ_UNCOMMIT: mssql.ISOLATION_LEVEL.READ_UNCOMMITTED,
  SERIALIZABLE: mssql.ISOLATION_LEVEL.SERIALIZABLE,
  REPEATABLE_READ: mssql.ISOLATION_LEVEL.REPEATABLE_READ,
  SNAPSHOT: mssql.ISOLATION_LEVEL.SNAPSHOT,
};

export function toMssqlIsolationLevel(level: ISOLATION_LEVEL): number {
  const result = IsolationLevelMapps[level];
  if (result === undefined) {
    throw new Error('不受支持的事务隔离级别：' + level);
  }
  return result;
}

export function dbTypeToRaw(type: DbType | Raw): string {
  if (isRaw(type)) return type.$sql;
  switch (type.name) {
    case 'STRING':
      return `VARCHAR(${type.length === DbType.MAX ? 'MAX' : type.length})`;
    case 'INT8':
      return 'TINYINT';
    case 'INT16':
      return 'SMALLINT';
    case 'INT32':
      return 'INT';
    case 'INT64':
      return 'BIGINT';
    case 'BINARY':
      return `VARBINARY(${type.length === 0 ? 'MAX' : type.length})`;
    case 'BOOLEAN':
      return 'BIT';
    case 'DATE':
      return 'DATE';
    case 'DATETIME':
      return 'DATETIME';
    case 'FLOAT':
      return 'REAL';
    case 'DOUBLE':
      return 'FLOAT(53)';
    case 'DECIMAL':
      return `DECIMAL(${type.precision}, ${type.digit})`;
    case 'UUID':
      return 'UNIQUEIDENTIFIER';
    case 'OBJECT':
    case 'ARRAY':
      return 'NVARCHAR(MAX)';
    case 'ROWFLAG':
      return 'BINARY(8)';
    case 'DATETIMEOFFSET':
      return 'DATETIMEOFFSET(7)';
    default:
      throw new Error(`Unsupport data type ${type['name']}`);
  }
}

/**
 * 原始类型到DbType类型的映射
 */
const raw2DbTypeMap: Record<string, keyof typeof DbType> = {
  NCHAR: 'string',
  NVARCHAR: 'string',
  VARCHAR: 'string',
  CHAR: 'string',
  TEXT: 'string',
  NTEXT: 'string',
  INT: 'int32',
  BIGINT: 'int64',
  SMALLINT: 'int16',
  TINYINT: 'int8',
  DECIMAL: 'decimal',
  NUMERIC: 'decimal',
  FLOAT: 'float',
  REAL: 'double',
  DATE: 'date',
  DATETIME: 'datetime',
  DATETIME2: 'datetime',
  DATETIMEOFFSET: 'datetimeoffset',
  BIT: 'boolean',
  UNIQUEIDENTIFIER: 'uuid',
  BINARY: 'binary',
  VARBINARY: 'binary',
  IMAGE: 'binary',
  TIMESTAMP: 'rowflag',
  ROWVERSION: 'rowflag'
};

export function rawToDbType(type: string): DbType {
  const matched = typeReg.exec(type);
  if (!matched) {
    throw new Error('Error mssql datat type: ' + type);
  }
  const dbTypeKey = raw2DbTypeMap[matched.groups!.type.toUpperCase()];
  if (!dbTypeKey) {
    throw new Error('Unknown or unspport mssql data type:' + type);
  }

  const dbTypeFactory = DbType[dbTypeKey];
  if (typeof dbTypeFactory === 'object') {
    return dbTypeFactory as DbType;
  }
  if (matched.groups!.max) {
    return Reflect.apply(dbTypeFactory as Function, DbType, [DbType.MAX]);
  }
  if (matched.groups!.p2 !== undefined) {
    return Reflect.apply(dbTypeFactory as Function, DbType, [
      Number.parseInt(matched.groups!.p1),
      Number.parseInt(matched.groups!.p2),
    ]);
  }
  return Reflect.apply(dbTypeFactory as Function, DbType, [
    Number.parseInt(matched.groups!.p1),
  ]);
}


export interface MssqlConnectOptions extends ConnectOptions {
  /**
   * 实例名
   */
  instance?: string;
  /**
   * 是否启用加密
   */
  encrypt?: boolean;

  /**
   * 是否使用UTC时间，默认为true
   */
  useUTC?: boolean;

  sqlOptions?: MssqlSqlOptions;
}
