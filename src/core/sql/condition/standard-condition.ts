import { Condition, CONDITION_KIND } from "./condition";

/**
 * 标准操作，用于存放标准操作未转换前的标准操作
 * 用于定义一套多数据库兼容的标准
 * 如，类型转换、获取日期 等操作
 */
 export class StandardCondition extends Condition {
  static isStandardCondition(object: any): object is StandardCondition {
    return Condition.isCondition(object) && object.$kind === CONDITION_KIND.STANDARD;
  }
  constructor(name: string, datas: any[]) {
    super();
    this.$name = name;
    this.$datas = datas;
  }

  readonly $kind: CONDITION_KIND.STANDARD = CONDITION_KIND.STANDARD;

  readonly $name: string;

  readonly $datas: any[];

  static create(name: string, datas: any[]): StandardCondition {
    return new StandardCondition(name, datas);
  }
}
