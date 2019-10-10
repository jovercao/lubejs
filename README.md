# lubejs

> 本库诣在Node.js环境中轻松使用数据库操作

目前仅支持`Oracle DB`

本库基于 [`node-oracledb`](https://github.com/oracle/node-oracledb) 实现，某些使用方法请参考

## 安装

使用npm中安装

```shell
$ npm install lubejs --save
```

## 使用

```js
// 引入
const lube = require('lubejs')

async function aQuery() {

  // 创建连接, 连接配置请参考 https://oracle.github.io/node-oracledb/doc/api.html#getconnectiondb
  const conn = await lube.connect({
    user: 'sys',
    password: 'oracle',
    connectString: 'rancher-vm/orcl',
    // 使用
    privilege: oracledb.Provider.SYSDBA
  })

  // 无参数查询
  let res
  res = await conn.query('select 1 result from dual')
  console.log(res)
  // [ { RESULT: 1 }]

  // 带对象参数查询
  res = await conn.query('select 1 result from dual where 1 = :arg1', { arg1: 1 })

  // 带对数组参数查询,等效上一条语句
  res = await conn.query('select 1 result from dual where 1 = :arg1', [ 1 ])

  // 模板参数查询，等效上一条语句
  res = await conn.query`select 1 result from dual where 1 = ${1}`

  // 插入行
  res = await conn.insert('table1', { id: 1, name: 'jover', createDate: Date.now(), description: 'remark' })
  // 等效于语句： INSERT INTO table1(id, name, createDate, description) values(1, 'jover', get_date(''), 'remark')
  // 返回： 1 ---受影响行数

  // 查找行
  res = await conn.find('table1', { id: 1 })
  // 等效SQL: SELECT * FROM table1 WHERE id = 1
  // 返回首行对象（非数组）
  // 返回： { ID: 1, .... }

  // 更新行
  res = await conn.update('table1', { name: 'bill' }, { id: 1 })
  // 等效SQL： UPDATE table1 SET name = 'bill' WHERE id = 1
  // 返回： 1 ---受影响行数

  // 删除行
  res = await conn.delete('table1', { id: 1 })
  // 等效SQL: DELETE table1 WHERE id = 1
  // 返回： 1 ---受影响行数

  // 选择行

  // mongodb 风格查询
  res = await conn.select('table1', {
    fields: [
      'id', 'name'
    ],
    where: {
      sex: '男',
      age: {
        $lt: 20
      },
      $or: [
        {
          id: {
            $lte: 100
          }
        },
        {
          id: {
            $gt: 200
          }
        }
      ]
    }
  })
  // SELECT id, name FROM table1 WHERE sex = '男' AND age < 20 AND (id <= 100 OR id > 200)
  // 返回： [ { ID: 1, NAME: 'jover' }, ..., { ID: 201, NAME: 'bill'}, ... ]

  const $ = lube.field

  // 函数风格查询
  res = await conn.select('table1', {
    fields: [
      'id', 'name'
    ],
    where: $('sex').eq('男')
      .and($('age').lt(20))
      .and(
        $('id').lte(100)
          .or($('id').gt(200))
      )
  })
  // 等效上一个查询

  // 偏移
  res = await conn.select('table1', {
    offset: 100,
    limit: 100
  })

  // 排序
  res = await conn.select('table1', {
    orders: {
      id: 'asc',
      name: 'desc'
    }
  })

  // 查询第101行至第200行
  // selete * from table1 limit 100 offset 100;
  // 在oracle 旧版中，将会使用 rownum 替代

  // # 事务

  await conn.beginTrans()

  try {
    // 执行SQL
    conn.commit()
  } catch(e) {
    await conn.rollback()
  }


  // # 输出SQL日志

  conn.on('execute', ({ sql, params }) => {
    console.log(`执行SQL语句：${sql} 参数是 ${params}`)
  })

  // # 当出现错误
  conn.on('error', ex => {
    console.error('数据库执行发生异常：' + ex.message)
  })


  // 关闭连接
  await conn.close()

  /*******************使用连接池********************/
  // 创建连接, 连接配置请参考 https://oracle.github.io/node-oracledb/doc/api.html#createpool
  const pool = await lube.createPool({
    // 连接增量
    poolIncrement: 5,
    // 最大连接数
    poolMax: 120,
    // 最小连接数
    poolMin: 5,
    // 用户名
    user: 'sys',
    // 密码
    password: 'oracle',
    // 连接串
    connectString: 'rancher-vm/orcl',
    // 登录身份(非必须)
    privilege: oracledb.Provider.SYSDBA
  })

  // 获取连接
  const conn2 = await pool.getConnection()

  // 使用连接执行SQL

  // 关闭连接池
  await pool.close()
}
```

## api

### lube

easyOracleDb库入口，使用`require('lubejs')`导入

#### async lube.connect(config)

打开一个数据库连接，并返回一个`connection`

**【参数】：**

- `config` - 请参考 [node-oracledb](https://oracle.github.io/node-oracledb/doc/api.html#-33212-getconnection-attributes)

**【返回】：**

返回连接对象`connection`

#### async lube.createPool(config)

创建一个数据库连接池对象`pool`并返回

**【参数】：**

- `config` - 请参考 [node-oracledb](https://oracle.github.io/node-oracledb/doc/api.html#-3311-createpool-parameters-and-attributes)

**【返回】：**

返回连接对象`pool`

### connection

数据库连接，可以使用`lube.connect(config)` 或者 `pool.getConnection()` 创建

#### async connection.query(sql, params)

执行一条SQL语句,并返回执行结果

**【参数】：**

- `sql` - 要执行的SQL语句
- `params` - 要传递的参数, 可以是 Object 也可以是 Array，当为Object时，需要与参数名对应，当为Array时，需要与参数索引位置对应，请参考[使用](#使用)

**【返回】：**

Object类型，结构如下：

```json
{
  // 受影响行数
  rowsAffected: Number,
  // 返回结果集
  rows: Array,
}
```

#### async connection.insert(table, row)

插入行到指定的表中，并返回受影响行数

**【参数】：**

- `table` - 要插入的表名
- `row` - 要插入表字段名/值对象, 当row参数为数组时，表示插入多行，会分次执行并返回受影响行数的总数，当插入的行数超过2000行时，会自动使用批量插入功能，以提高效率

**【返回】：**

Number类型, 受影响行数

#### async connection.update(table, sets, where)

更新指定查询条件的行，并返回受影响行数

**【参数】：**

- `table` - 要更新的表名
- `row` - 要插更新的字段名/值对象
- `where` - 查询条件，请参考[condition](#condition)

**【返回】：**

Number类型, 受影响行数

#### async connection.find(table, where)

查找指定查询条件的记录，并返回符合条件的第一行记录

**【参数】：**

- `table` - 要查询的表名
- `row` - 要插更新的字段名/值对象
- `where` - 查询条件，请参考[condition](#condition)

**【返回】：**

Object类型，符合条件的第一行数据对象，
当未查找到数据时返回 null

#### async connection.select(table, { fields, where, offset, limit })

执行 `select` 语句

**【参数】：**

- `table` - 要查询的表名
- `options` - 选项
  - `where` - 查询条件，请参考[condition](#condition)
  - `fields` - 字符串数组类型，要查询的字段列表
  - `offset` - 获取结果的偏移行数
  - `limit` - 获取结果的行数
  - `orders` - 排序选项数组, 排序方向, `asc` 或者 `desc`， 请参考[使用](#使用)中的排序范例

**【返回】：**

Array类型，返回符合条件的行组成的数组，每一行是一个Object
当未查找到数据时返回空数组 `[]`

#### async connection.delete(table, where)

删除符合指定条件的记录，并返回受影响的行数

**【参数】：**

- `table` - 要删除的表名
- `where` - 查询条件，请参考[condition](#condition)

**【返回】：**

Number类型, 受影响行数

### pool

连接池对象，通过`lube.createPool(config)`创建

#### async pool.getConnection()

从连接池中获取一个连接`connection`

**【返回】：**

返回连接对象`connection`

注意：pool.getConnection()获取到的connection，调用close()时并不会关闭数据库连接，而是释放到`pool`中托管

#### async pool.close(drainTime)

关闭连接池，关闭时会等待正在使用的连接释放,

**【参数】：**

- drainTime - 可选，如果不填写，则必须保证所有连接都已经关闭，否则将关闭失败，如果drainTime指定为0，则会立刻释放所有连接

### field

字段操作工具类，用于函数式编程编写查询条件表达式，可以通过 `lube.field()` 创建

请参考[使用](#使用)中的`函数风格查询`

#### field.eq(value)

生成等于表达式并返回查询条件`condition`

#### field.uneq(value)

生成不等于表达式并返回查询条件`condition`

#### field.is(value)

生成is表达式并返回查询条件`condition`

#### field.like(value)

生成like表达式并返回查询条件`condition`

#### field.lt(value)

生成小于表达式并返回查询条件`condition`

#### field.lte(value)

生成小于等于表达式并返回查询条件`condition`

#### field.gt(value)

生成大于表达式并返回查询条件`condition`

#### field.gte(value)

生成大于等于表达式并返回查询条件`condition`

#### field.in(value)

生成in表达式并返回查询条件`condition`

#### field.notin(value)

生成not in表达式并返回查询条件`condition`

#### field.isnull()

生成is null表达式并返回查询条件`condition`

#### field.notnull()

生成is not null表达式并返回查询条件`condition`

### condition

查询条件表达式对象，通过 `lube.field(name).xxx`或 `lube.not(condition)`创建

#### condition.and(condition)

and连接运算

#### condition.or(condition)

or 连接运算
