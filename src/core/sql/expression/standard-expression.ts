import { SQL_SYMBOLE } from "../sql";
import { Scalar } from "../scalar";
import { Expression } from "./expression";

/**
 * 标准操作，用于存放标准操作未转换前的标准操作
 * 用于定义一套多数据库兼容的标准
 * 如，类型转换、获取日期 等操作
 */
 export class StandardExpression<
 T extends Scalar = Scalar
> extends Expression<T> {
 static isStandardExpression(object: any): object is StandardExpression {
  return object?.$type === SQL_SYMBOLE.STANDARD_EXPRESSION;
 }
 constructor(name: string, datas: any[]) {
   super();
   this.$name = name;
   this.$datas = datas;
 }

 readonly $type: SQL_SYMBOLE.STANDARD_EXPRESSION =
   SQL_SYMBOLE.STANDARD_EXPRESSION;

 readonly $name: string;

 readonly $datas: any[];

 static create<T extends Scalar>(
   name: string,
   datas: any[]
 ): StandardExpression<T> {
   return new StandardExpression(name, datas);
 }
}
