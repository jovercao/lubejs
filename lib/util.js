const _ = require('lodash')

function assert(except, message) {
  if (!except) {
    throw new Error(message)
  }
}

function astType(ast, defaultType) {
  assert(_.isPlainObject(ast), 'ast必须为object类型')
  const keys = Object.keys(ast)
  if (keys.length === 1) {
    return keys[0]
  }
  return defaultType
  // throw new Error('不是合法的ast对象')
}

function checkType(type, excepts, errMsg) {
  assert(excepts.includes(type), errMsg ? errMsg.replace(/\{type\}/g, type) : `syntax error: except ${excepts.join(',')}, but ${type} this`)
}

/**
 * 获取ast类型及值对，如果对象非标准类型，则
 * @param {*} ast
 * @param {*} defaultType
 * @returns [type, ast]
 */
function astEntry(ast, defaultType) {
  if (_.isPlainObject(ast)) {
    const entries = Object.entries(ast)
    if (entries.length === 1 && entries[0][0].startsWith('$')) {
      return entries[0]
    }
  }
  if (!defaultType) {
    throw new Error('unknow ast type, format error')
  }
  return [defaultType, ast]
}

module.exports = {
  astType,
  checkType,
  assert,
  astEntry
}
