const { NULL } = require('./connection')
const _ = require('lodash')
const assert = require('assert')

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

  static isnull(field) {
    return new Condition({
      [field]: {
        $is: NULL
      }
    })
  }

  static in(field, items) {
    assert(_.isArrray(items), 'in 语句只允许存放数组项目')
    return new Condition({
      [field]: {
        $is: items
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

  get value() {
    return this._value
  }

  and(condition) {
    this._value.$and = condition.value
    this._pos = condition._pos
    return this
  }

  or(condition) {
    this._value.$or = condition.value
    this._pos = condition._pos
  }

  andGroup(...conditions) {
    this._value.$and = conditions.map(p => p.value)
  }

  orGroup(...conditions) {
    this._value.$or = conditions.map(p => p.value)
  }
}

module.exports = {
  Condition
}
