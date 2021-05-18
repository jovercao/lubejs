import { table, select, update, insert, del, $case, } from '../src'
const assert = require('assert')
class Table1 {
  id: number;
  name: string;
  date: Date;
}

describe('AST test', function () {
  it('select', () => {
    const t = table<Table1>('Table1').as('t')

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
