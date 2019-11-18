# lubejs

> Lubejs is a library who base on `node.js` to easlly use database with js.
> use js instead sql.

Supports list:

- mssql - microsoft sqlserver 2012 or highter version, base on `node-mssql`.
- oracle db - 11g or highter - base on `node-oracledb`.

## queick start

```js
const lube = require('lubejs')

async function action() {
  const pool = await lube.connect('mssql://sa:password@127.0.0.1/test-db')
  // (Not recommended)query with template sql
  // const id = 1
  // const res = pool.query`select * from person where id = ${id}`

  //---------------Insert Datas------------------
  /*
  * INSERT INTO table1 (field1, field2, field3)
  * VALUES ('value1-1', 2, Convert(DateTime, '2019-11-18 00:00:00'))
  * ('value1-2', 1, Convert(DateTime, '2019-11-18 00:00:00'))
  * ('value1-3', 45, Convert(DateTime, '2019-11-18 00:00:00'))
  */
  const insertedCount = await pool.insert('table1', [
    { field1: 'value1-1', field2: 2, field3: new Date() },
    { field1: 'value1-2', field2: 1, field3: new Date() },
    { field1: 'value1-3', field2: 45, field3: new Date() }
  ])

  //---------------Update Data------------------
  // UPDATE table1 SET updatedAt = Convert(DateTime, '2019-11-18 00:00:00') WHERE id = 1
  const updatedCount = await pool.update('table1', { updatedAt: new Date(), operator: 'your name' }, { id: 1 })

  //---------------Delete All Data-------------------
  // DELETE table1
  const deletedCount1 = await pool.delete('table1')
  //---------------Delete By Id-----------------------
  // DELETE table1 WHERE id = 1
  const deletedCount2 = await pool.delete('table1', { id: 1 })

  //----------------Select All Rows--------------------
  // SELECT * FROM table1
  const allRows = await pool.select('table1')

  //---------------A Complex queries (mssql)------------
  /*
  * SELECT
  *     p.name,
  *     p.age,
  *     pay.year,
  *     pay,
  *     month
  * FROM pay
  * JOIN persion as p ON pay.persionId = p.id
  * WHERE p.age >= 18
  * GROUP BY
  *     p.name,
  *     p.age,
  *     pay.year,
  *     pay.month
  * HAVING SUM(pay.amount) >= 100000
  * ORDER BY
  *     pay.year ASC,
  *     pay.month ASC,
  *     pay.amount ASC,
  *     p.age ASC
  *  OFFSET 20 ROWS
  *  FETCH NEXT 50 ROWS ONLY
  */
  const p = lube.table('person').as('p')
  const pay = lube.table('pay')
  const sql = lube.select(
      pay.year,
      pay.month,
      p.name,
      p.age,
      lube.sum(pay.amount).as('total')
    )
    .from(pay)
    .join(p, pay.persionId.eq(p.id))
    .where(p.age.lte(18))
    .groupby(
      pay.year,
      pay.month,
      p.name,
      p.age
    )
    .having(
      lube.sum(pay.amount).gte(100000.00)
    )
    .orderby(
      pay.year.asc(),
      pay.month.asc(),
      pay.amount.asc(),
      p.age.asc()
    )
    .offset(20)
    .limit(50)

  const { rows } = await pool.query(sql)
  console.log(rows)

  // close connection pool
  pool.close()
})

```

## Install

install with npm

```shell
$ npm install lubejs --save
```

## Usage

@import "./test/index.test.js"

## API

Pls waite for update.

## Updated Logs

### 0.9.7

- add having clause support
