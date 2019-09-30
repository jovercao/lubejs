const { NULL } = require('./connection')
const _ = require('lodash')
const assert = require('assert')

const staticOperators = [
  '$eq',
  '$uneq',
  '$lt',
  '$gt',
  '$lte',
  '$gte',
  '$like',
  '$in',
  '$is',
  '$isnull',
  '$notnull',
  '$not',
  '$notin',
  '$and',
  '$or'
]

class Condition {
  constructor(obj) {
    this._value = obj
    this._pos = obj
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
    return Condition.is(field, NULL)
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
staticOperators.forEach(operator => {
  const shortName = operator.substring(1)
  Condition[operator] = Condition[shortName]
})

module.exports = {
  Condition
}
