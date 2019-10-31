/**
 * 语法兼容模块
 */

const quoted = function(str) {
  return `[${str}]`
}

const properVeriant = function(name) {
  return '@' + name
}

const properParameter = function(name) {
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

const typeMapps = {
  string: 'nvarchar(2000)',
  number: 'float',
  date: 'datetime',
  boolean: 'bit'
}

module.exports = {
  quoted,
  properVeriant,
  properParameter,
  typeMapps,
  sysfnMapps
}
