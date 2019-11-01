const _ = require('lodash')
const { SqlSymbolNames, SqlSymbolMapps } = require('./constants')

function assert(except, message) {
  if (!except) {
    throw new Error(message)
  }
}

function checkType(type, excepts, errMsg) {
  assert(excepts.includes(type),
    errMsg ? errMsg.replace(/\{type\}/g, SqlSymbolNames[type])
      : `syntax error: except ${excepts.map(p => SqlSymbolNames[p]).join(',')}, but ${SqlSymbolNames[type]} this`)
}

/**
 * 获取ast类型及值对，如果对象非标准类型，则
 * @param {*} ast
 * @param {*} defaultType
 * @returns [type, ast]
 */
function astEntry(ast, defaultType) {
  if (_.isPlainObject(ast)) {
    const keys = Object.getOwnPropertySymbols(ast)
    if (keys.length === 1) {
      const type = keys[0]
      return [type, ast[type]]
    }
    if (keys.length > 1) {
      throw new Error('involid ast!')
    }
  }
  if (!defaultType) {
    throw new Error('unknow ast type or format error')
  }
  return [defaultType, ast]
}

/**
 * 获取ast类型及值对，如果对象非标准类型，则
 * @param {*} ast
 * @param {*} defaultType
 * @returns [type, ast]
 */
function astEntryByName(ast, defaultType) {
  if (_.isPlainObject(ast)) {
    const keys = Object.keys(ast)
    if (keys.length === 1 && keys[0].startsWith('$')) {
      const type = SqlSymbolMapps[keys[0]]
      assert(type, `involid symbol ${keys[0]}`)
      return [type, ast[keys[0]]]
    }
  }
  if (!defaultType) {
    throw new Error('unknow ast type or format error')
  }
  return [defaultType, ast]
}

function ast(instance) {
  return instance.ast || instance
}

module.exports = {
  checkType,
  assert,
  astEntry,
  astEntryByName,
  ast
}
