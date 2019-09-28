const Operators = {
  $and: 'AND',
  $or: 'OR',
  $is: 'IS',
  $in: 'IN',
  $notin: 'NOT IN',
  $eq: '=',
  $uneq: '<>',
  $gt: '>',
  $gte: '>=',
  $lt: '<',
  $lte: '<=',
  $like: 'LIKE'
}

const NULL = Symbol('oracledb#NULL')

module.exports = {
  Operators,
  NULL
}
