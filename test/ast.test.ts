import { table, select, update, insert, del, $case, } from '../src/lube'
const assert = require('assert')

const ployfill = {
  /**
   * 标识符引用，左
   */
  quotedLeft: '[',
  /**
   * 标识符引用，右
   */
  quotedRight: ']',

  /**
   * 参数前缀
   */
  parameterPrefix: '@',

  /**
   * 变量前缀
   */
  variantPrefix: '@',

  /**
   * 集合别名连接字符，默认为 ''
   */
  setsAliasJoinWith: 'AS',

  /**
   * 输出参数尾词
   */
  parameterOutWord: 'OUT',

  /**
   * 字段别名连接字符器，默认为 ''
   */
  fieldAliasJoinWith: 'AS',
  /**
   * 存储过程返回值参数
   */
  returnValueParameter: '__return_value__',

  executeKeyword: 'EXECUTE'
}

class Table1 {
  id: number;
  name: string;
  date: Date;
}

describe('AST test', function () {
  it('select', () => {
    const t = table(Table1).as('t')

    const nameField = t.$('name')

    const sql = select({
      id: 'abc',
      name: t.$('name'),
      date: t.date
    })
    .from(t)
    .where(t.id.eq(1))

    const sql2 = select(t.$('name'), t.date).from(t).where(t.id.eq(1))

    assert.deepEqual(sql, {
      "type": "SELECT",
      "columns": [
        {
          "type": "IDENTIFIER",
          "name": "name",
          "parent": {
            "type": "ALIAS",
            "name": "t",
            "expr": {
              "type": "IDENTIFIER",
              "name": "table1"
            }
          }
        },
        {
          "type": "IDENTIFIER",
          "name": "abc",
          "parent": {
            "type": "ALIAS",
            "name": "t",
            "expr": {
              "type": "IDENTIFIER",
              "name": "table1"
            }
          }
        }
      ],
      "tables": [
        {
          "type": "ALIAS",
          "name": "t",
          "expr": {
            "type": "IDENTIFIER",
            "name": "table1"
          }
        }
      ],
      "filters": {
        "type": "BINARY",
        "operator": "=",
        "left": {
          "type": "IDENTIFIER",
          "name": "id",
          "parent": {
            "type": "ALIAS",
            "name": "t",
            "expr": {
              "type": "IDENTIFIER",
              "name": "table1"
            }
          }
        },
        "right": {
          "type": "CONSTANT",
          "value": 1
        }
      }
    })
  })

  it('update', () => {

  })

  it('insert', () => {

  })

  it('delete', () => {

  })

})
