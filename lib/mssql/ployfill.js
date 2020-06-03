/**
 * 语法兼容模块
 */

const quoted = function (str) {
  return `[${str.replace(/]/g, ']]')}]`
}

const properVeriant = function (name) {
  return '@' + name
}

const properParameter = function (name) {
  return properVeriant(name)
}

const sysfnMapps = {
  now: 'GetDate()',
  guid: 'NewId()',
  indexof: 'CharIndex($1)',
  substr: 'Substring($1)',
  len: 'Len($1)',
  code: 'Ascii($1)',
  convert: 'Convert($2, $1)'
}

module.exports = {
  quoted,
  properVeriant,
  properParameter,
  sysfnMapps
}
