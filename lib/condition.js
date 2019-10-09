const _ = require('lodash')
const assert = require('assert')
const { Operators, CompareOperators } = require('./constants')

// const staticOperators = [
//   '$eq',
//   '$uneq',
//   '$lt',
//   '$gt',
//   '$lte',
//   '$gte',
//   '$like',
//   '$in',
//   '$is',
//   '$isnull',
//   '$notnull',
//   '$not',
//   '$notin',
//   '$and',
//   '$or'
// ]

// const compareOperators = [

// ]

class Condition {
  constructor(obj) {
    this._value = obj
    this._pos = obj
  }

  // 属性名
  static $field(name) {
    return new Field(name)
  }

  static parser(obj) {
    return new Condition(obj)
  }

  static eq(field, value) {
    return new Condition({
      [field]: {
        $eq: value
      }
    })
  }

  static uneq(field, value) {
    return new Condition({
      $uneq: value
    })
  }

  static gt(field, value) {
    return new Condition({
      [field]: {
        $gt: value
      }
    })
  }

  static lt(field, value) {
    return new Condition({
      [field]: {
        $lt: value
      }
    })
  }

  static gte(field, value) {
    return new Condition({
      [field]: {
        $gte: value
      }
    })
  }

  static lte(field, value) {
    return new Condition({
      [field]: {
        $lte: value
      }
    })
  }

  static like(field, value) {
    return new Condition({
      [field]: {
        $like: value
      }
    })
  }

  static is(field, value) {
    return new Condition({
      [field]: {
        $is: value
      }
    })
  }

  static isnull(field) {
    return Condition.is(field, null)
  }

  static notnull(field) {
    return Condition.not(Condition.isnull(field))
  }

  static in(field, items) {
    assert(_.isArray(items), 'in 语句只允许存放数组项目')
    return new Condition({
      [field]: {
        $in: items
      }
    })
  }

  static notin(field, items) {
    return Condition.not(Condition.in(field, items))
  }

  static not(condition) {
    return new Condition({
      $not: condition.value
    })
  }

  static or(...conditions) {
    assert(conditions.length > 1, 'or运算必须作用两个或以上的条件')

    return new Condition({
      $or: [
        ...conditions.map(p => p.value)
      ]
    })
  }

  static and(...conditions) {
    assert(conditions.length > 1, 'and运算必须作用两个或以上的条件')
    return new Condition({
      $and: [
        ...conditions.map(p => p.value)
      ]
    })
  }

  get value() {
    return this._value
  }

  and(condition) {
    const value = this._value
    const keys = Object.keys(value)
    if (keys.length === 1 && keys[0] === '$and') {
      this._value.$and.push(condition.value)
      return this
    }

    this._value = {
      $and: [
        value,
        condition.value
      ]
    }
    return this
  }

  or(condition) {
    const value = this._value
    const keys = Object.keys(value)
    if (keys.length === 1 && keys[0] === '$or') {
      this._value.$or.push(condition.value)
      return this
    }
    this._value = {
      $or: [
        value,
        condition.value
      ]
    }
    return this
  }
}

// 复制静态函数别名
Operators.forEach(operator => {
  const shortName = operator.substring(1)
  Condition[operator] = Condition[shortName]
})

/**
 * 字段类
 */
class Field {
  constructor(name) {
    assert(_.isString(name), '字段名表达式')
    this._fieldName = name
  }

  notin(values) {
    return Condition.not(this.in(values))
  }

  isnull() {
    return this.is(null)
  }

  notnull() {
    return Condition.not(this.is(null))
  }
}

// 运算符方法
CompareOperators.forEach(operator => {
  const shortName = operator.substring(1)
  Field.prototype[shortName] = Field.prototype[operator] = function(value) {
    if (operator === '$in' && !_.isArray(value)) {
      value = [...arguments]
    }

    const field = this._fieldName
    return new Condition({
      [field]: {
        [operator]: value
      }
    })
  }
})

module.exports = {
  Condition
}
