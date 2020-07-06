const { connect, select, update, insert, $delete, table, SQL } = require('lubejs')
/**
 * build-in objects import from driver package
 */
const { sum } = require('lubejs-mssql')

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

  //---------------Insert Datas------------------
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

  //  You can also insert in this way
  await pool.insert('table1', [
    { field1: 'value1-1', field2: 2, field3: new Date() },
    { field1: 'value1-2', field2: 1, field3: new Date() },
    { field1: 'value1-3', field2: 45, field3: new Date() }
  ])

  //---------------Update Datas------------------
  // UPDATE table1 SET updatedAt = Convert(DateTime, '2019-11-18 00:00:00') WHERE id = 1
  t = table('table1').as('t')
  const updateSql = update(t).set({ updatedAt: new Date(), operator: 'your name' }).where(t.$id.eq(1))
  await pool.query(updateSql)

  //  You can also update in this way
  affected = await pool.update('table1', { updatedAt: new Date(), operator: 'your name' }, { id: 1 })

  //---------------Delete Datas-------------------
  // DELETE t FROM table1 WHERE t.id = 1
  // Use $delete instead of delete because of keywords. Or use SQL.delete
  t = table('table1').as('t')
  let deleteSql = $delete(t).from(t).where(t.id.eq(1))
  await pool.query(deleteSql)

  //  You can also delete in this way
  // DELETE table1 WHERE id = 1
  affected = await pool.delete('table1', { id: 1 })

  //----------------Select Datas--------------------
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

  //---------------A Complex queries (mssql)------------
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
