import { IResult, ISqlType, Request } from 'mssql';
import {
  CompileOptions,
  Parameter,
  PARAMETER_DIRECTION,
  QueryResult,
  Scalar,
} from '../..';
import { toMssqlType } from './types';

export type IDriver = {
  request(): Request;
};

export async function doQuery(
  driver: IDriver,
  sql: string,
  params: Parameter<Scalar, string>[] = [],
  options: CompileOptions
) {
  const request = await driver.request();
  params &&
    params.forEach(
      ({ name, value, type, direction = PARAMETER_DIRECTION.INPUT }) => {
        let mssqlType: ISqlType;
        // 优先使用dbType

        mssqlType = toMssqlType(type);

        if (direction === PARAMETER_DIRECTION.INPUT) {
          if (type) {
            request.input(name, mssqlType, value);
          } else {
            request.input(name, value);
          }
        } else if (direction === PARAMETER_DIRECTION.OUTPUT) {
          if (!type) {
            throw new Error('输出参数必须指定参数类型！');
          }
          if (value === undefined) {
            request.output(name, mssqlType);
          } else {
            request.output(name, mssqlType, value);
          }
        }
      }
    );
  let res: IResult<any>;
  try {
    res = await request.query(sql);
  } catch (ex) {
    await request.cancel();
    throw ex;
  }
  const result: QueryResult<any, any, any> = {
    rows: res.recordset,
    rowsAffected: res.rowsAffected[0],
    output: res.output,
  };
  Object.entries(res.output).forEach(([name, value]) => {
    const p = params.find(p => p.name === name);
    // 回写输出参数
    p.value = value as Scalar;
    if (p.name === options.returnParameterName) {
      result.returnValue = value;
    }
  });
  if (res.recordsets) {
    result.rowsets = res.recordsets;
  }
  return result;
}
