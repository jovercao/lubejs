# lubejs

> Lubejs 是一个用于 `node.js` 诣在方便使用SQL数据库连接.
> 取名为lube意为润滑，即作为js与sql间的润滑剂般的存在，尽情使用 js 替代你的 sql 字符串吧.

[English](./README.md)

支持列表:

- mssql - 目前支持microsoft sqlserver 2012 或更高版本, 库基于 `node-mssql`开发.

## Queick Start

### Install

使用 npm 安装:

```shell
# 安装lugejs库
npm install lubejs --save

# 安装MSSQL驱动
npm install lubejs-mssql
```

### 使用方法

```js
const { connect, select, update, insert, $delete, table, SQL } = require('lubejs')

// 数据库内建对象（如函数、系统变量等）请从对应的驱动库导入
const { sum } = require('lubejs-mssql')

// 这是一个范例
async function action() {
  const pool = await connect('mssql://sa:password@127.0.0.1/test-db')
  // for oracle
  // const pool = await lube.connect('oracledb://user:password@127.0.0.1/sid')
  // (Not recommended)query with template sql
  // const id = 1
  // const res = pool.query`select * from person where id = ${id}`

  // affected rows
  let affected = 0
  let t, datas

  //---------------插入数据------------------
  /*
  * INSERT INTO table1 (field1, field2, field3)
  * VALUES ('value1-1', 2, Convert(DateTime, '2019-11-18 00:00:00'))
  * ('value1-2', 1, Convert(DateTime, '2019-11-18 00:00:00'))
  * ('value1-3', 45, Convert(DateTime, '2019-11-18 00:00:00'))
  */
  const insertSql = insert('table1').values([
    { field1: 'value1-1', field2: 2, field3: new Date() },
    { field1: 'value1-2', field2: 1, field3: new Date() },
    { field1: 'value1-3', field2: 45, field3: new Date() }
  ])

  affected = await pool.query(insertSql)

  // 你还以使用以下方式插入，等效于上面的写法
  await pool.insert('table1', [
    { field1: 'value1-1', field2: 2, field3: new Date() },
    { field1: 'value1-2', field2: 1, field3: new Date() },
    { field1: 'value1-3', field2: 45, field3: new Date() }
  ])

  //---------------更新数据------------------
  // UPDATE table1 SET updatedAt = Convert(DateTime, '2019-11-18 00:00:00') WHERE id = 1
  t = table('table1').as('t')
  const updateSql = update(t).set({ updatedAt: new Date(), operator: 'your name' }).where(t.$id.eq(1))
  await pool.query(updateSql)

  // 你还以使用以下方式更新，等效于上面的写法
  affected = await pool.update('table1', { updatedAt: new Date(), operator: 'your name' }, { id: 1 })

  //---------------删除数据-------------------
  // DELETE t FROM table1 WHERE t.id = 1
  // 请使用 $delete或者SQL.delete 而非 delete，因为delete是js关键字，
  t = table('table1').as('t')
  let deleteSql = $delete(t).from(t).where(t.id.eq(1))
  await pool.query(deleteSql)

  // 你还以使用以下方式删除
  // DELETE table1 WHERE id = 1
  affected = await pool.delete('table1', { id: 1 })

  //----------------查询数据--------------------
  // SELECT t.* FROM table1 AS t WHERE t.id = 1 AND t.name = 'name1'
  // use '$name' instead of 'name' because of name is property of Identity
  t = table('table1').as('t')
  selectSql = select(t.any()).from(t).where(and(t.id.eq(1), t.$name.eq('name1')))
  await pool.query(selectSql)

  //  You can also select in this way
  // SELECT * FROM table1 WHERE id = 1 AND name = 'name1'
  datas = await pool.select('table1', {
    where: {
      id: 1,
      name: 'name1'
    }
  })

  //---------------以下是一个复合查询 (mssql)------------
  /*
  * SELECT
  *     pay.year,
  *     pay.month
  *     p.name,
  *     p.age,
  *     sum(pay.amount) as total,
  * FROM pay
  * JOIN persion as p ON pay.persionId = p.id
  * WHERE p.age >= 18
  * GROUP BY
  *     p.name,
  *     p.age,
  *     pay.year,
  *     pay.month
  * HAVING SUM(pay.amount) >= 100000.00
  * ORDER BY
  *     pay.year ASC,
  *     pay.month ASC,
  *     pay.amount ASC,
  *     p.age ASC
  *  OFFSET 20 ROWS
  *  FETCH NEXT 50 ROWS ONLY
  */
  const p = table('person').as('p')
  const pay = table('pay')
  const sql = select(
      pay.year,
      pay.month,
      p.name,
      p.age,
      sum(pay.amount).as('total')
    )
    .from(pay)
    .join(p, pay.persionId.eq(p.id))
    .where(p.age.lte(18))
    .groupBy(
      p.name,
      p.age,
      pay.year,
      pay.month
    )
    .having(
      sum(pay.amount).gte(100000.00)
    )
    .orderBy(
      pay.year.asc(),
      pay.month.asc(),
      pay.amount.asc(),
      p.age.asc()
    )
    .offset(20)
    .limit(50)

  const { rows: datas } = await pool.query(sql)

  // close connection pool
  await pool.close()
}

action()

```

## API

[API DOC](./doc/globals.md)

## Updated Logs

### 1.0.0-beta14

- beta version
