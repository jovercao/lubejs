
/**
 * 通过一个对象创建一个对查询条件
 * 亦可理解为：转换managodb的查询条件到 ast
 * @param {*} obj
 */
function mormalizeWhere(obj) {
  if (obj instanceof Condition) return obj
  assert(_.isPlainObject(obj), 'condition must typeof `Condition` or `plain object`')
  const entries = Object.entries(obj)
  const parser = function ([key, value]) {
    if (key.startsWith('$')) {
      const symbol = SqlSymbolMapps[key]
      assert(symbol, `involid symbol ${key} on conditions.`)
      if (symbol === $and || symbol === $or) {
        assert(_.isArray(value), 'Condition $and/$or must typeof Array')
        return {
          [symbol]: value.map(p => mormalizeWhere(p))
        }
      }
      if (symbol === $not) {
        return {
          [symbol]: mormalizeWhere(value)
        }
      }
    }
    let [op, exp] = astEntryByName(value, $eq)
    // 如果值是数组，自动设置为 $in查询
    if (_.isArray(value) && op === $eq) {
      op = $in
    }
    // 比较运算
    return {
      [op]: [
        new Field(key).ast,
        ast(exp)
      ]
    }
  }

  if (entries.length > 1) {
    return new Condition({
      [$and]: entries.map(p => parser(p))
    })
  } else if (entries.length === 1) {
    return new Condition(parser(entries[0]))
  }
  throw new Error('involid object condition')
}


/**
 * 抽象类检查
 * @param {*} instance
 */
function abstract(instance, cls) {
  if (instance.constructor === cls) {
    throw new Error(`不允许直接创建抽象类${cls}实例`)
  }
}

module.exports = {
  abstract,
  mormalizeWhere
}
