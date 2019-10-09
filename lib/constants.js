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

const LogicJoinOperators = [
  '$and',
  '$or'
]

const LogicNotOperator = '$not'

module.exports = {
  Operators,
  OperatorMaps,
  CompareOperators,
  LogicJoinOperators,
  LogicNotOperator
}
