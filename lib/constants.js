const OperatorMaps = {
  $and: 'AND',
  $or: 'OR',
  $not: 'NOT',
  $is: 'IS',
  $in: 'IN',
  $eq: '=',
  $uneq: '<>',
  $gt: '>',
  $gte: '>=',
  $lt: '<',
  $lte: '<=',
  $like: 'LIKE'
}

const Operators = Object.keys(OperatorMaps)

const CompareOperators = ['$eq', '$uneq', '$gt', '$lt', '$gte', '$lte', '$not', '$like', '$is', '$in']

/**
 * 操作语句
 */
const Opertions = {
  $insert: 'INSERT',
  $select: 'SELECT',
  $update: 'UPDATE',
  $delete: 'DELETE',
  $execute: 'EXECUTE'
  // 暂时只支持增删改查
  // $drop: 'DROP',
  // $create: 'CREATE',
  // $alter: 'ALTER'
}

/**
 * 参数方向
 */
const ParameterDirection = {
  in: 'INPUT',
  out: 'OUTPUT'
}

/**
 * 逻辑运算符
 */
const LogicJoinOperators = [
  '$and',
  '$or'
]

/**
 *  标识符类型
 */
const IdentifierType = {
  $table: 0,
  $field: 1,
  $fn: 2,
  $proc: 3
}

/**
 * not运算符
 */
const LogicNotOperator = '$not'

/**
 *  事务隔离级别
 */
const IsolationLevel = {
  readCommitted: 0,
  readUncommitted: 1,
  repeatableRead: 2,
  serializable: 3,
  snapshot: 4
}

module.exports = {
  Operators,
  OperatorMaps,
  CompareOperators,
  LogicJoinOperators,
  LogicNotOperator,
  IsolationLevel,
  IdentifierType,
  Opertions,
  ParameterDirection
}
