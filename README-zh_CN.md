# Lubejs

> Lubejs 是一个用于 `node.js` 诣在方便使用SQL数据库连接.
> 取名为lube意为润滑，即作为js与sql间的润滑剂般的存在，我们可以尽情使用优雅的 js/ts来 替代拼接 sql 字符串。



本库部分灵感来自于[EF](https://github.com/dotnet/efcore) 与  [TypeORM](https://github.com/typeorm/typeorm)，致谢

[English](./README.md)

## lubejs是什么

lubejs 是一套类型化sql构建、执行工具，亦是一套强大易用的Typescript ORM开发框架。

- 完备的SQL构建工具，使用最贴近SQL的语法编写SQL，极低的学习成本
- 强大的Typescript类型支持，支持反向类型推导，返回明确类型，拥有完整类型安全体系，智能语法提示，提高开发效率以及预排除类型错误，强烈建立在typescript项目中使用lubejs。
- ORM配套工具，Code first、数据迁移
- 匹配多种数据库（目前只支持mssql)
- 跨数据库兼容，为此，lubejs建立了标准行为库，把大多数常用的，而在各个数据库中又不尽相同的操作行为，包括在其中。



## lubejs理念

- 简洁，极简api，极易上手
- 贴近自然，语法与标准sql极为接近，大大降低学习成本
- 渐进式，lubejs分为两个层级的引用，core及完整功能包
- 多数据库方言统一兼容，建立中间标准操作库并不断丰富。
- 完整的typescript类型安全



## 快速开始

### 安装

使用 npm 安装:

```shell
# 安装lubejs库
npm install lubejs --save

# 安装lubejs-mssql驱动
npm install lubejs-mssql
```

### 开始

Hello world!

```ts
// hello-world.ts
import { connect, SQL } from 'lubejs'
// 导入mssql驱动
import 'lubejs-mssql'

(async () => {
  // 创建连接
  const db = await connect('mssql://user:password@localhost:1433/database');
  // SELECT 'hello world'
  console.log(await db.queryScalar(SQL.select('hello world!')));  // => 'hello world'

  await db.close();
})()
```



**完整范例**

```ts
// example.ts
import {
  connect,
  SQL,
  Decimal,
  Uuid,
  Connection,
  DbType,
  outputCommand,
} from "lubejs";
import "lubejs-mssql";

interface Table1 {
  id: number;
  name: string;
  stringField?: string;
  floatField?: number;
  dateField?: Date;
  decimalField?: Decimal;
  uuidField?: Uuid;
  updatedAt: Date;
  binaryField?: ArrayBuffer;
  createdAt: Date;
  operator?: string;
}

interface Pay {
  id?: number;
  year: number;
  month: number;
  amount: Decimal;
  personId: number;
}

interface Person {
  id?: number;
  name: string;
  age: number;
}

/**
 * 初始化数据库
 */
async function initDb(db: Connection) {
  await db.query(
    SQL.if(SQL.std.existsTable('table1')).then(SQL.dropTable("table1"))
  );

  await db.query(
    SQL.createTable("table1").as(({ column }) => [
      column("id", DbType.int32).identity().primaryKey(),
      column("name", DbType.string(100)).notNull(),
      column("stringField", DbType.string(100)).null(),
      column("floatField", DbType.float).null(),
      column("dateField", DbType.datetimeoffset).null(),
      column("decimalField", DbType.decimal(18, 6)),
      column("uuidField", DbType.uuid),
      column("updatedAt", DbType.datetimeoffset).default(SQL.std.now()),
      column("binaryField", DbType.binary(DbType.MAX)),
      column("createdAt", DbType.datetimeoffset).default(SQL.std.now()),
      column("operator", DbType.string(100)).null(),
    ])
  );

  await db.query(
    SQL.if(SQL.std.existsTable('pay')).then(SQL.dropTable("pay"))
  );

  await db.query(
    SQL.createTable("pay").as(({ column }) => [
      column("id", DbType.int32).identity().primaryKey(),
      column("year", DbType.int32),
      column("month", DbType.int32),
      column("amount", DbType.decimal(18, 2)),
      column("personId", DbType.int32),
    ])
  );

  await db.query(
    SQL.if(SQL.std.existsTable('person')).then(SQL.dropTable("person"))
  );

  await db.query(
    SQL.createTable("person").as(({ column }) => [
      column("id", DbType.int32).identity().primaryKey(),
      column("name", DbType.int32).notNull(),
      column("age", DbType.int32),
    ])
  );

}

/**
 * Table1表声明
 */
// 这是一个范例
async function example(db: Connection) {
  //---------------插入数据------------------
  /*
   * INSERT INTO table1 (stringField, floatField, dateField)
   * VALUES ('value1-1', 2, Convert(DATETIMEOFFSET, '2019-11-18 00:00:00'))
   * ('value1-2', 1, Convert(DATETIMEOFFSET, '2019-11-18 00:00:00'))
   * ('value1-3', 45, Convert(DATETIMEOFFSET, '2019-11-18 00:00:00'))
   */
  const insertSql = SQL.insert<Table1>("table1").values([
    {
      name: "item1",
      stringField: "value1-1",
      floatField: 3.14,
      dateField: new Date(),
      decimalField: new Decimal("3.1415"),
      uuidField: Uuid.new(),
      binaryField: Buffer.from('abcdefeg')
    },
    {
      name: "item2",
      stringField: "value1-2",
      floatField: 1.132,
      dateField: new Date(),
      decimalField: new Decimal("3.1415"),
      uuidField: Uuid.new(),
      binaryField: Buffer.from('abcdefeg')
    },
    {
      name: "item3",
      stringField: "value1-3",
      floatField: 45.2656,
      dateField: new Date(),
      decimalField: new Decimal("3.1415"),
      uuidField: Uuid.new(),
      binaryField: Buffer.from('abcdefeg')
    },
  ]);

  await db.query(insertSql);

  // 你还以使用以下方式插入，等效于上面的写法
  await db.insert<Table1>("table1", [
    {
      name: "item1",
      stringField: "value1-1",
      floatField: 3.14,
      dateField: new Date(),
      decimalField: new Decimal("3.1415"),
      uuidField: Uuid.new(),
      binaryField: Buffer.from('abcdefeg')
    },
    {
      name: "item2",
      stringField: "value1-2",
      floatField: 1.132,
      dateField: new Date(),
      decimalField: new Decimal("3.1415"),
      uuidField: Uuid.new(),
      binaryField: Buffer.from('abcdefeg')
    },
    {
      name: "item3",
      stringField: "value1-3",
      floatField: 45.2656,
      dateField: new Date(),
      decimalField: new Decimal("3.1415"),
      uuidField: Uuid.new(),
      binaryField: Buffer.from('abcdefeg')
    },
  ]);

  //---------------更新数据------------------
  // UPDATE t SET updatedAt = Convert(DateTime, '2019-11-18 00:00:00') FROM table1 t WHERE id = 1
  const t = SQL.table<Table1>("table1").as("t");
  const updateSql = SQL.update(t)
    .set({ updatedAt: new Date(), operator: "your name" })
    .where(t.id.eq(1));
  await db.query(updateSql);

  // 你还以使用以下方式更新，等效于上面的写法
  await db.update<Table1>(
    "table1",
    { updatedAt: new Date(), operator: "your name" },
    { id: 1 }
  );

  //---------------删除数据-------------------
  // DELETE t FROM table1 t WHERE t.id = 1
  const deleteSql = SQL.delete(t).from(t).where(t.id.eq(1));
  await db.query(deleteSql);

  // 你还以使用以下方式删除
  // DELETE table1 WHERE id = 1
  await db.delete("table1", { id: 1 });

  //----------------查询数据--------------------
  // SELECT t.* FROM table1 AS t WHERE t.id = 1 AND t.name = 'name1'
  const selectSql = SQL.select(t.star)
    .from(t)
    .where(SQL.and(t.id.eq(1), t.name.eq("name1")));
  console.log((await db.query(selectSql)).rows);

  //  You can also select in this way
  // SELECT * FROM table1 WHERE id = 1 AND name = 'name1'
  console.log(
    await await db.select("table1", {
      where: {
        id: 1,
        name: "item1",
      },
    })
  );

  // //---------------以下是一个复合查询------------
  const p = SQL.table<Person>("person").as("p");
  const pay = SQL.table<Pay>("pay");
  const sql = SQL.select({
        year: pay.year,
        month: pay.month,
        name: p.name,
        age: p.age,
        total: SQL.std.sum(pay.amount),
  })
    .from(pay)
    .join(p, pay.personId.eq(p.id))
    .where(p.age.lte(18))
    .groupBy(p.name, p.age, pay.year, pay.month)
    .having(SQL.std.sum(pay.amount).gte(new Decimal(100000)))
    .orderBy(pay.year.asc(), pay.month.asc(), SQL.std.sum(pay.amount).asc(), p.age.asc())
    .offset(20)
    .limit(50);

  console.log((await db.query(sql)).rows);
}


(async () => {
  // 创建一个Lube连接
  const db = await connect("mssql://sa:!crgd-2021@rancher.vm/Test");
  // 打开连接
  await db.open();
  // 输出日志
  db.on('command', (cmd) => outputCommand(cmd, process.stdout))
  try {
    await initDb(db);
    await example(db);
  } finally {
    await db.close();
  }
})();

```



## 版本说明

***注意： lubejs目前仍为预览版，内部会有部分调整，公共API可能会有小许调整，但不会有大调整。***

### 渐进式分离

- `lubejs/core` 为核心包，包括sql构建以及sql执行工具。
- `lubejs`则为完整包，包括`lubejs/core`的所有内容以及orm功能，数据迁移cli等。

### 数据库支持列表

- [x] mssql - 目前支持microsoft sqlserver 2012 或更高版本, 库基于 `node-mssql`开发.
- [ ] mysql - 当前正在开发中
- [ ] postgresql - 计划于2021年底开发

### NodeJs版本支持

nodejs &gt;=  `12.0`



## 概念

### SQL构造器(SQL对象)

所有的SQL构造，均由 `SQL`对象发起，几乎所有的`SQL`的语句，均可从`SQL`对象创建，例如`SQL.select`，`SQL.update`,`SQL.delete`等。

```ts
// 导入SQL对象
import { SQL } from 'lubejs';
```

为了更贴近sql语法，您还可以使用解构来引入需要的关键字

```ts
const {
    insert,
    delete: $delete // 关键字delete需要使用别名
} = SQL

// 构建插入张三、李四两条记录到table1的语句
const sql = insert('table1').values([{ name: '张三', age: 19, sex: '男' }, { name: '李四', age: 25, sex: '男' }]);

// 构建table1表中删除id为1记录的sql语句
const sql = $delete('table1').where({ id: 1 })
```

更多`SQL`对象用法，请翻阅《api参考》



***注意：`delete`为`js`关键字，需要使用别名代替，其它关键字亦是如此***



### 标准行为（SQL.std）

lubejs为了更大程序的兼容多数据库，专门定义了标准行为，用于统一在跨数据库时的操作，避免在跨方言数据库迁移是的重复劳动。

`SQL.std`中定义了许多常用的函数、操作等行为



**常用函数**

| 说明                 | 函数                                                         | 备注 |
| -------------------- | ------------------------------------------------------------ | ---- |
| 类型转换             | `SQL.std.convert(expr, dbType)`、`Expression.prototype.to(dbType)` |      |
| 当值为空时返回默认值 | `SQL.std.nvl(value, defaultValue)`                           |      |



**聚合函数**

| 说明   | 函数                  | 备注 |
| ------ | --------------------- | ---- |
| 计数   | `SQL.std.count(expr)` |      |
| 平均   | `SQL.std.avg(expr)`   |      |
| 求和   | `SQL.std.sum(expr)`   |      |
| 最大值 | `SQL.std.max(expr)`   |      |
| 最小值 | `SQL.std.min(expr)`   |      |



**日期函数**

| 说明                   | 函数                                   | 备注 |
| ---------------------- | -------------------------------------- | ---- |
| 当前时间               | `SQL.std.now(expr)`                    |      |
| UTC当前时间            | `SQL.std.utcNow(expr)`                 |      |
| 切换时区               | `SQL.std.switchTimezone(date, offset)` |      |
| 格式化日期             | `SQL.std.formatDate(date, format)`     |      |
| 取日期中的年份         | `SQL.std.yearOf(date)`                 |      |
| 取日期中的月份         | `SQL.std.monthOf(date)`                |      |
| 取日期中的日期         | `SQL.std.dayOf(date)`                  |      |
| 取两个日期之间的天数   | `SQL.std.daysBetween(star, end)`       |      |
| 取两个日期之间的月数   | `SQL.std.monthsBetween(star, end)`     |      |
| 取两个日期之间的年数   | `SQL.std.yearsBetween(star, end)`      |      |
| 取两个日期之间的小时数 | `SQL.std.hoursBetween(star, end)`      |      |
| 取两个日期之间的分钟数 | `SQL.std.minutesBetween(star, end)`    |      |
| 取两个日期之间的秒钟数 | `SQL.std.secondsBetween(star, end)`    |      |
| 获取加天数后的日期     | `SQL.std.addDays(date, days)`          |      |
| 获取加月数后的日期     | `SQL.std.addMonths(date, months)`      |      |
| 获取加年数后的日期     | `SQL.std.addYears(date, years)`        |      |
| 获取加小时数后的日期   | `SQL.std.addHours(date, hours)`        |      |
| 获取加分钟数后的日期   | `SQL.std.addMinutes(date, minutes)`    |      |
| 获取加秒钟数后的日期   | `SQL.std.addSeconds(date, seconds)`    |      |

**字符串函数**

| 说明                             | 函数                                   | 备注 |
| -------------------------------- | -------------------------------------- | ---- |
| 获取字符串字符数                 | `SQL.std.strlen(str)`                  |      |
| 获取字符串字节数                 |                                        |      |
| 截取字符串                       | `SQL.std.substr(str, start, len)`      |      |
| 替换字符串                       | `SQL.std.replace(str, search, text)`   |      |
| 删除两侧空格                     | `SQL.std.trim(str)`                    |      |
| 删除右侧空格                     | `SQL.std.trimEnd(str)`                 |      |
| 转换成小写字母                   | `SQL.std.lower(str)`                   |      |
| 转换成大写字母                   | `SQL.std.upper(str)`                   |      |
| 获取字符串在另一个字符串中的位置 | `SQL.std.strpos(str, search, startAt)` |      |
| 获取一个字符的ascii码            | `SQL.std.ascii(str)`                   |      |
| 将一个ascii码转换成一个字符      | `SQL.std.asciiChar(code)`              |      |
| 获取一个字符的unicode码          | `SQL.std.unicode(str)`                 |      |
| 将一个unicode码转换成一个字符    | `SQL.std.unicodeChar(code)`            |      |

**数学函数**

| 说明     | 函数 | 备注 |
| -------- | ---- | ---- |
| 求绝对值 | `SQL.std.abs(value)` |      |
| 指数曲线 | `SQL.std.exp(value)` |      |
| 向上取整 | `SQL.std.ceil(value)` |      |
| 向下取整 | `SQL.std.floor(value)` |      |
| 自然对数 | `SQL.std.ln(value)` |      |
| 对数 | `SQL.std.log(value)` |      |
| 圆周率（π） | `SQL.std.pi()` |      |
| 乘幂 | `SQL.std.power(value, mi)` |      |
| radians | `SQL.std.radians(value)` |      |
| degrees | `SQL.std.degrees(value)` |      |
| 随机数 | `SQL.std.random(value)` |      |
| 四舍五入 | `SQL.std.round(value)` |      |
| sign函数 | `SQL.std.sign(value)` |      |
| 开平方 | `SQL.std.sqrt(value)` |      |
| cos函数 | `SQL.std.cos(value)` |      |
| sin函数 | `SQL.std.sin(value)` |      |
| tan函数 | `SQL.std.tan(value)` |      |
| acos函数 | `SQL.std.acos(value)` |      |
| asin函数 | `SQL.std.asin(value)` |      |
| atan函数 | `SQL.std.atan(value)` |      |
| cot函数 | `SQL.std.cot(value)` |      |

**常用操作**

| 说明     | 方法 | 备注 |
| -------- | ---- | ---- |
| 返回条件：是否存在表 | `SQL.std.existsTable(tableName)` |      |
| 返回条件：是不存在数据库 | `SQL.std.existsDatabase(dbName)` |      |
| 返回条件：是不存在视图 | `SQL.std.existsView(viewName)` |      |
| 返回条件：是不存在函数 | `SQL.std.existsFunction(functionName)` |      |
| 返回条件：是不存在存储过程 | `SQL.std.existsProcedure(procedureName)` |      |
| 返回条件：是不存在序列 | `SQL.std.existsSequence(sequenceName)` |      |
| 获取当前数据库 | `SQL.std.currentDatabase()` |      |
| 返回当前默认架构 | `SQL.std.defaultSchema()` |      |
| 获取序列下一个值 | `SQL.std.sequenceNextValue(sequenceName)` |      |



### 数据库类型(DbType)

为了数据库兼容性，lubejs定义了一套中间数据类型DbType，一般情况下不建议直接使用相应方言的数据类型。

**使用DbType**

```ts
import { DbType, SQL } from 'lubejs';

// 将字面量 1 转换为boolean类型
const sql = SQL.select(SQL.literial(1).to(DbType.boolean))
// => SELECT CONVERT(1 as bit) AS [#column_1]
```

使用数据库原生类型来构造SQL

```ts
const sql = SQL.createTable('Person').as(builder => {
    builder.column('name', DbType.raw('text'))
})
```



**DbType类型对应表**

| 类型                            | 对应JS类型         | 对应数据类型(mssql) | 说明 |
| ------------------------------- | ------------------ | ------------------- | ---- |
| DbType.int8                     | Number             | tinyint             |      |
| DbType.int16                    | Number             | smallint            |      |
| DbType.int32                    | Number             | int                 |      |
| DbType.int64                    | BigInt             | bigint              |      |
| DbType.decimal(length)          | Decimal            | decimal             |      |
| DbType.float                    | Number             | float               |      |
| DbType.double                   | Number             | real                |      |
| DbType.string(length)           | String             | nvarchar(x)         |      |
| DbType.date                     | Date               | date                |      |
| DbType.datetime                 | Date               | datetime            |      |
| DbType.datetimeoffset           | Date               | datetimeoffset      |      |
| DbType.binary                   | ArrayBuffer/Buffer | varbinary(x)        |      |
| DbType.boolean                  | Boolean            | bit                 |      |
| DbType.uuid                     | Uuid               | UNIQUEIDENTIFIER    |      |
| DbType.rowflag                  | ArrayBuffer        | TIMESTAMP           |      |
| (尚未支持) DbType.object        | Object             | nvarchar(max)       |      |
| (尚未支持) DbType.array(dbType) | Array              | nvarhcar(max)       |      |



### 行集(Rowset)

所有可以通过`select from`的对象均可称为行集，具体有以下内容：

- 表/视图
- SELECT子查询别名
- WITH查询项
- 表值函数返回值
- 表变量



**声明表对象**

```ts
const personTable = SQL.table<Person>('Person');
const houseTable = SQL.table<House>('House')
```

**为表对象添加别名**

```ts
const p = SQL.table<Person>('Person').as('p');
const h = SQL.table<House>('House').as('h');
```

**访问表字段**

```ts
const sql = SQL.select(p.name).from(p)
// => SELECT p.name FROM Person p
```

**添加字段别名**

```ts
const sql = SQL.select(p.name.as('first_name')).from(p)
// => SELECT p.name as first_name FROM Person p
```



***注意：表对象声明不是必须的，但如果不使用表对象，则每次使用该表时，都需要主动附带泛型类型(例如：`SQL.select<Person>(SQL.star).from('Person')`) 否则select语句会失去返回类型，而使用`any`代替***



### 表达式(Expression)

在lubejs中所有表达式对象均由`Expression`类继承而来，其中包括：

- 字段（Field）
- 一元运算（UnaryOperation）
- 二元运算(BinaryOperation)
- 变量(Variant)
- 标量函数调用(ScalarFuncInvoke)等)
- 字面量(Literial)



使用表达式可以方便的进行运算操作，例如：

- 加法运算

```ts
// 加法运算
p.age.add(1)
// => p.age + 1
```

- 生成比较查询条件

```ts
// 生成比较查询条件
p.age.lte(18)
// => p.age >= 18
```

更多细节请参考[WHERE条件](#查询条件)



**字面量表达式**

通常情况下，我们可以直接使用JS传递字面量，lubejs会自动识别成结构化字面量，但是如果需要我们用到字面量进行计算的时候，因为JS值并不具有这些方法，我们可以使用`SQL.literial(1)`的方式来构建字面量SQL

```ts
// 查询18岁以上的人
const sql = SQL.select(p.star).from(p).where(SQL.literial(18).lt(p.age)); // => SELECT p.* FROM Person p WHERE 18 < p.age
```



**表达式运算符清单（二元运算）**

| 运算符    | 方法                                                         | 说明          |
| --------- | ------------------------------------------------------------ | ------------- |
| +         | `SQL.add(left, right)`、 `Expression.prototype.add(value)`   | 加法运算      |
| -         | `SQL.sub(left, right)`、 `Expression.prototype.sub(value)`   | 减法运算      |
| *         | `SQL.mul(left, right)`、 `Expression.prototype.mul(value)`   | 乘法运算      |
| /         | `SQL.div(left, right)`、 `Expression.prototype.div(value)`   | 除法运算      |
| +(mssql)  | `SQL.concat(left, right)`、 `Expression.prototype.concat(value)` | 字符串连接    |
| %(mssql)  | `SQL.mod(left, right)`、 `Expression.prototype.mod(value)`   | 取模运算      |
| &(mssql)  | `SQL.and(left, right)`、 `Expression.prototype.and(value)`   | AND位运算     |
| \|(mssql) | `SQL.or(left, right)`、 `Expression.prototype.or(value)`     | OR位运算      |
| ^(mssql)  | `SQL.xor(left, right)`、 `Expression.prototype.xor(value)`   | XOR位运算     |
| >>(mssql) | `SQL.shr(left, right)`、 `Expression.prototype.shr(value)`   | SHR右位移运算 |
| <<(mssql) | `SQL.shl(left, right)`、 `Expression.prototype.shl(value)`   | SHL左位移运算 |
| >>(mssql) | `SQL.xor(left, right)`、 `Expression.prototype.xor(value)`   | XOR位运算     |

**表达式运算符清单（一元运算）**

| 运算符    | 方法            | 说明      |
| --------- | --------------- | --------- |
| -         | `SQL.neg(expr)` | 负号运算  |
| ~（mssql) | `SQL.not(expr)  | NOT位运算 |

我们还可以直接使用表达式来构建查询条件

```ts


```

### 查询条件(Condition)

**JSON格式查询条件**

JSON格式仅适用于单表查询情况下的简单的 `=`, `in`运算之间的`and`条件联接，一般用于快速查询某个对象，若要使用高级条件请看下文。

```ts
const sql = SQL.select(p.star).from(p).where({ name: '张三', age: [18, 19, 20] })
// => SELECT p.* FROM Person p WHERE p.name = '张三' AND p.age in (18, 19, 20)
```

**比较条件**

上面那条SQL可以使用这种写法代替

```ts
const sql = SQL.select(p.star).from(p).where(
    p.name.eq('张三')
    	.and(p.age.in(18, 19, 20))
)
// => SELECT p.* FROM Person p WHERE p.name = '张三' AND p.age in (18, 19, 20)
```

比较条件运算符

| 运算符   | 方法                                                         | 说明      |
| -------- | ------------------------------------------------------------ | --------- |
| =        | `SQL.eq(left, right)`、 `Expression.prototype.eq(value)`     | 等于      |
| <>       | `SQL.neq(left, right)`、`Expression.prototype.neq(value)`    | 不等于    |
| <        | `SQL.lt(left, right)`、`Expression.prototype.lt(value)`      | 小于      |
| >        | `SQL.gt(left, right)`、`Expression.prototype.gt(value)`      | 大于      |
| <=       | `SQL.lte(left, right)`、`Expression.prototype.lte(value)`    | 小于等于  |
| >=       | `SQL.gte(left, right)`、`Expression.prototype.gte(value)`    | 大于等于  |
| LIKE     | `SQL.like(left, right)`、`Expression.prototype.like(value)`  | 近似匹配  |
| NOT LIKE | `SQL.notLike(left, right)`、`Expression.prototype.notLike(value)` | 不近似    |
| IN       | `SQL.in(left, right)`、`Expression.prototype.in(value)`      | 在...内   |
| NOT IN   | `SQL.notIn(left, right)`、`Expression.prototype.in(value)`   | 不在...内 |



**逻辑条件**

```ts
// AND 查询
const sql = SQL.select(p.star).from(p).where(
    p.age.lte(18)
    	.and(p.sex.eq('男'))
		.and(p.name.like('张%'))
)
// => SELECT p.* FROM Person p WHERE p.age >= 18 AND p.sex = '男' AND p.name like '张%'
```

```ts
// OR 查询
const sql = SQL.select(p.star).from(p).where(p.sex.eq('女').or(p.sex.eq('男')))
// => SELECT p.* FROM Person p WHERE p.sex = '女' OR p.sex = '男'
```

多个and条件等优化可读性：

```ts
// 查询张姓年满18岁的男性
const sql = SQL.select(p.star).from(p).where(
    SQL.and(
    	p.age.lte(18),
        p.sex.eq('男'),
        p.name.like('张%')
    )
)
// => SELECT p.* FROM Person p WHERE (p.age >= 18 AND p.sex = '男' AND p.name like '张%')
```

***注意： 使用SQL.and/SQL.or构建的查询条件所返回的条件为分组条件***



逻辑运算符

| 运算符 | 方法                                                         | 说明     |
| ------ | ------------------------------------------------------------ | -------- |
| AND    | `SQL.and(...conditions)`、 `Condition.prototype.and(condition)` | 与逻辑   |
| OR     | `SQL.or(...conditions)`、`Condition.prototype.neq(condition)` | 或逻辑   |
| NOT    | `SQL.not(condition)`                                         | 否定逻辑 |



**分组条件**

```ts
//
const sql = SQL.select(p.star).from(p).where(
    SQL.and(
        p.sex.eq('男'),
        p.name.like('张%'),
        SQL.group(
            p.age.lt('18').or(p.age.gte(60))
        )
    )
)
// => SELECT p.* FROM Person p
//    WHERE (p.sex = '男' AND p.name like '张%' AND (p.age < 18 OR p.age >= 60))
```

**EXISTS子句**

```ts
// 查询有房子的人
const sql = SQL.select(p.star).from(p).where(
    SQL.exists(SQL.select(h.id).from(h).where(h.personId.eq(p.id)))
)
// => SELECT p.* FROM Person p WHERE EXISTS(SELECT h.id FROM House h WHERE h.personId = p.id)
```



## SQL构建

本单节会介绍怎么使用`lubejs`来构建sql语句，需要注意的是，本章节所讲的构建sql，并非执行sql，执行sql会在后续章节讲解。



### 定义表模型（仅typescript适用）

```ts
interface Person {
    // 因为是自增列，所以可空
    id?: number;
    name: string;
    age?: number;
    sex?: '男' | '女';
    description?: string;
}

interface House {
    id?: number;
    title: string;
    location?: string;
    description?: string;
}
```

### 声明表对象

```ts
const p = SQL.table<Person>('Person').as('p');
const h = SQL.table<House>('House').as('h');
```



### 构建Select语句

以下是一条完整的select语句

```ts
const sql = SQL.select({
    name: p.name,
    age: p.age
}).from(p).where(p.id.eq(1))
// => SELECT p.name as name, p.age as age FROM Person p WHERE p.id = 1
```



#### 定义返回内容

**JSON格式**

```ts
const sql = SQL.select({
    name: p.name,
    age: p.age
}).from(p).where(p.id.eq(1))
// => SELECT p.name as name, p.age as age FROM Person p WHERE p.id = 1
```

使用此方法构建的sql会带上类型，在后续查询结果中亦会包含此类型。

**整表返回(使用*号)**

```ts
const sql = SQL.select(p.star).from(p)
// => SELECT p.* FROM Person p
```

使用 `p.star` 返回`p`本身所附带的类型，会被select所继承过去。

~~**使用表达式（此功能已删除）**~~



#### WHERE条件

请参考[查询条件(Condition)](#查询条件（Condition)章节



#### 多表关联查询

**多表查询**

```ts
const sql = SQL.select({
    personName: p.name,
    houseTitle: h.houseTitle
})
	.from(p, h)
	.where(h.personId.eq(p.id))
// => SELECT p.name AS personName, h.title AS houseTitle FROM Person p, House h
//    WHERE h.personId = p.id
```



**JOIN/LEFT JOIN查询**

内联接查询

```ts
// 关联查询名下房产
const sql = SQL.select({
    personName: p.name,
    houseTitle: h.houseTitle
})
	.from(p)
	.join(h, h.personId.eq(p.id))
// => SELECT p.name AS personName, h.title AS houseTitle
//    FROM Person p INNER JOIN House h ON h.personId = p.id
```

左外联接查询

```ts
// 关联查询名下房产
const sql = SQL.select({
    personName: p.name,
    houseTitle: h.houseTitle
})
	.from(p)
	.leftJoin(h, h.personId.eq(p.id))
// => SELECT p.name AS personName, h.title AS houseTitle
//    FROM Person p LEFT OUTER JOIN House h ON h.personId = p.id
```



*注意：考虑到SQL使用规范等因素，联接查询仅支持`INNER JOIN` 与 `LEFT OUTER JION`查询，不支持`RIGHT JOIN`等联接操作。*

#### 子查询

**嵌套查询**

```ts
// 查询名下房产数量
const sql = SQL.select({
    personName: p.name,
    houseCount: SQL.select(SQL.std.count(h.id)).from(h).where(h.personId.eq(p.id))
})
	.from(p)
// => SELECT
//       p.name AS personName,
//       (SELECT count(h.id) FROM House h WHERE h.personId = p.id) AS houseTitle
//    FROM Person p
```

**子查询别名**

相较于原生SQL，lubejs构建语法更为清晰，可读性更强。

```ts
const hc = SQL.select({
    personId: h.personId,
    houseCount: SQL.std.count(h.id)
}).from(h).groupBy(h.personId).as('hc')

const sql = SQL.select({
    personName: p.name,
    houseCount: hc.houseCount
})
	.from(p)
	.join(hc, hc.personId.eq(p.id))

// => SELECT p.name AS personName, hc.houseCount as houseCount
//    FROM Person p
//    JOIN (SELECT personId, count(h.id) AS houseCount FROM h GROUP BY h.personId) as hc
```

**IN 子查询**

```ts
const sql = SQL.select(h.star).from(h).where(h.personId.in(
    SQL.select(p.id).from(p).where(p.name.like('张%'))
))
// => SELECT h.* FROM House h WHERE h.personId IN (SELECT p.id FROM Person p WHERE p.name LIKE '张%')
```



#### 分组查询(GROUP BY)

**GROUP BY**

```ts
// 查询名下房产数量
const sql = SQL.select({
    personName: p.name,
    houseCount: SQL.std.count(h.id)
})
	.from(p)
	.join(h, h.personId.eq(p.id))
	.groupBy(p.name)
// => SELECT p.name AS personName, COUNT(h.id) AS houseCount
//    FROM Person p JOIN House h ON h.personId = p.id
//    GROUP BY p.name
```



**使用HAVING子句**

```ts
// 查询名下房产大于等于2人员及房产数量
const sql = SQL.select({
    personName: p.name,
    houseCount: SQL.std.count(h.id)
})
	.from(p)
	.join(h, h.personId.eq(p.id))
	.where(h.location.eq('广州'))
	.groupBy(p.name)
    .having(SQL.std.count(h.id).gte(2))

// => SELECT p.name AS personName, COUNT(h.id) AS houseCount
//    FROM Person p JOIN House h ON h.personId = p.id
//    WHERE h.location = '广州'
//    GROUP BY p.name
//    HAVING COUNT(h.id) >= 2
```



#### 使用With语句查询

```ts
const adult = SQL.select(p.star).from(p).where(p.age.gte('18')).asWith('adult')
const sql = SQL.with(adult).select(a.start).from(adult.as('a'))
// => WITH adult as (SELECT p.* FROM Person p WHERE p.age >= 18)
//      SELECT a.* FROM adult a
```



### 构建Insert语句

#### 单条插入

```ts
// 单条插入
const sql = SQL.insert(personTable).values({
    name: '张三',
    age: 23,
    sex: '男',
    description: '这个可有可无'
});

// => INSERT INTO Person(name, age, sex, description) VALUES ('张三', 23, '男', '这个可有可无')
```



#### 多条插入

```ts
// 多条插入
const sql = SQL.insert(personTable).values([
    {
        name: '张三',
        age: 23,
        sex: '男',
        description: '这个可有可无
    },
    {
        name: '李四',
        age: 43,
        sex: '男',
        description: '这个可有可无
    }
]);
// => INSERT INTO Person(name, age, sex, description)
//    VALUES ('张三', 23, '男', '这个可有可无'),
//           ('李四', 43, '男', '这个可有可无')
```



*注意：插入表亦可以使用别名，但别名不会被转换为SQL，而是直接使用表名*



### 构建UPDATE语句

#### 使用表名更新

```ts
const sql = SQL.update(personTable).set({
    age: personTable.age.add(1) // 大了一岁咯
}).where(personTable.name.eq('张三'))

// => UPDATE Person SET age = p.age + 1 WHERE Person.name = '张三'
```

#### 使用别名更新

```ts
// 这些在广州有房产的人大了一岁了
const sql = SQL.update(p).set({
    age: p.age.add(1) // 大了一岁咯
})
	.from(p)
    .join(h, h.personId.eq(p.id))
    .where(h.location.eq('广州'))

// => UPDATE p SET age = p.age + 1
//    FROM Person p
//    JOIN House h ON h.personId = p.id
//    WHERE h.location = '广州'
```



### 构建DELETE语句

#### 使用表名删除

```ts
const sql = SQL.delete(personTable).where(personTable.age.gt(60))
// => DELETE Person WHERE Person.age > 60
```

#### 使用别名删除

```ts
// 删除在广州有房产的人的数据
const sql = SQL.delete(p)
	.from(p)
    .join(h, h.personId.eq(p.id))
    .where(h.location.eq('广州'))
// => DELETE p
//    FROM Person p
//    JOIN House h ON h.personId = p.id
//    WHERE h.location = '广州'
```



### 函数调用





### 存储过程调用



假设我们有以下存储过程

```sql
CREATE PROCEDURE sp_get_person
(
	@type VARCHAR(20) = 'all',
    @total INT OUTPUT
)
AS
BEGIN
	SELECT @total = COUNT(p.id) FROM Person;
	IF (@type = 'audlt')
		SELECT * FROM Person p WHERE p.age >= 18;
	ELSE IF (@type = 'children')
		SELECT * FROM Person p WHERE p.age < 18;
	ELSE IF (@type = 'aged')
		SELECT * FROM Person p WHERE p.age >= 50;
	ELSE
		SELECT * FROM Person;
	END

	RETURN  100;
END
```



#### 快速调用

```ts
const sql = SQL.execute<number, Person>('sp_get_person', ['children', 0]);
```

#### 参数调用（当希望获取输出参数时）

```ts
const params: Parameter[] = [
    SQL.input('type', 'audlt'),
    SQL.output('total', DbType.int32)
]
const sql = SQL.execute<number, Person>('sp_get_person', ['children', 0]);
const result = await db.query(sql);

console.log(result.returnValue); // => 100
console.log(result.rows); // SELECT 查询结果
console.log(result.output.total); // => 表Person行数
```

#### 创建存储过程声明

存储过程是一个重复调用的过程，为了使用更加方便，我们还可以创建一个函数来快速的调用它，并使它爱类型保护

```ts
// 将SQL存储过程声明为一个Typescript函数
const sp_get_person = SQL.makeExec<'audlt' | 'children' | 'aged' | 'all', number, [Person]>('sp_get_person');

// 然后我们可以这样调用来达到与快速调用一样的效果。
const sql = sp_get_person('children', 0);
```



### 使用SQL字符串构建语句

通常情况下我们不建议使用此种方式来构建SQL，因为该方式构建SQL将脱离Typescript类型监控。



### 其它语句

#### 创建表

```ts
const sql = SQL.createTable('Person').as(({ column }) => [
        // 标识列
        column('id', DbType.int32).notNull().primaryKey().identity(),
        column('name', DbType.string(100)).notNull(),
        column('age', DbType.int32).null(),
        column('sex', DbType.string(2)).null(),
        column('description', DbType.string(100)).null(),
	    // 默认值 getDate()
	    column('createDate', DbType.datetime).default(SQL.std.now())
    ])
// => CREATE TABLE Person(
//   id int not null primary key identity(1, 1),
//   name nvarchar(100) not null,
//   age int null,
//   sex nvarchar(2) null,
//   description nvarchar(100) null
//   createDate datetime default (sysdate())
// )
```



#### 修改表

- 添加列

```ts
const sql = SQL.alterTable('Person').addColumn(column => column('rowflag', DbType.rowflag).notNull())
// => ALTER TABLE Person add column rowfloag TIMESTAMP NOT NULL
```

- 删除列

```ts
const sql = SQL.alterTable('Person').dropColumn('rowflag')
// => ALTER TABLE Person drop column rowfloag
```

- 创建外键

```ts
const sql = SQL.alterTable('House').addForeignKey(
    fk => fk('FK_HOUSE_PERSON').on('personId').reference('Person', ['id'])
)
// => ALTER TABLE Person ADD FOREIGN KEY FK_HOUSE_PERSON ON personId REFERENCE Person(id)
```

- 删除外键

```ts
const sql = SQL.alterTable('House').dropForeignKey('FK_HOUSE_PERSON')
```



#### 创建索引

```ts
const sql = SQL.createIndex('IX_Person_name').on('Person', ['name']);
// => CREATE INDEX IX_Person_name ON Person(name)
```

#### 删除索引

```ts
const sql = SQL.dropIndex('Person', 'IX_Person_name')
// => DROP INDEX IX_Person_name
```

*注意：由于各种数据库方言在该行为上不一致，因此在此处需要传递表名*



由于篇幅所限，本章节不再介绍其余的语句使用方法，具体请翻阅《api参考》。

### Lubejs 所支持的语句

#### 数据操作语句

| 语句                                | 使用                                                         | 说明                      |
| ----------------------------------- | ------------------------------------------------------------ | ------------------------- |
| insert                              | `SQL.insert(...).values(...)`                                |                           |
| update                              | `SQL.update(...).set(...).from(...).where(...)`              |                           |
| select                              | `SQL.update(...).from(...).where(...)`<br>更多高级用法请参考[构建SELECT语句](#构建SELECT语句) |                           |
| delete                              | `SQL.delete(...).from(...).where(...)`                       |                           |
| case when ... then ... else ... end | `SQL.case(...).when(...).else()`                             | CASE语句                  |
| execute                             | `SQL.execute(...)`、`SQL.proc(...).execute(...)`             | 存储过程调用              |
|                                     | `SQL.makeExec(...)`                                          | 将SQL存储过程声明为JS函数 |
| invoke                              | `SQL.invokeAsScalar(...)`，`SQL.invokeAsTable(...)`          | 函数调用                  |
|                                     | SQL.makeInvoke(...)                                          | 将SQL函数声明为JS函数     |





#### 数据结构操作语句

| 语句             | 使用                                                         | 说明 |
| ---------------- | ------------------------------------------------------------ | ---- |
| create table     | `SQL.createTable(...).as(...)`<br>更多高级用法，请参考[《创建表》](#创建表) |      |
| altert table     | `SQL.alterTable(...).as(...)`<br>更多高级用法，请参考[《修改表》](#创建表) |      |
| drop table       | `SQL.dropTable(...)`                                         |      |
| create view      | `SQL.createView(...).as(...)`                                |      |
| altert view      | `SQL.alterView(...).as(...)`                                 |      |
| drop view        | `SQL.dropView(...)`                                          |      |
| create procedure | `SQL.createProcedure(...).as(...)`                           |      |
| altert procedure | `SQL.alterProcedure(...).as(...)`                            |      |
| drop procedure   | `SQL.dropProcedure(...)`                                     |      |
| create function  | `SQL.createFunction(...).as(...)`                            |      |
| altert function  | `SQL.alterFunction(...).as(...)`                             |      |
| drop function    | `SQL.dropFunction(...)`                                      |      |
| create sequence  | `SQL.createSequence(...).as(...).startWith(...)incermentBy(...)` |      |
| drop sequence    | `SQL.dropSequence(...)`                                      |      |
| create database  | `SQL.createDatabase(...).collate(...)`                       |      |
| altert database  | `SQL.alterDatabase(...).collate(...)`                        |      |
| drop database    | `SQL.dropDatabase(...)`                                      |      |
| create index     | `SQL.createIndex(...).on(...)`                               |      |
| drop index       | `SQL.dropIndex(...)`                                         |      |


#### 程序控制语句

| 语句           | 使用              | 说明 |
| -------------- | ----------------- | ---- |
| if..then..else | `SQL.if(...)`     |      |
| while          | `SQL.while(...)`  |      |
| begin ... end  | `SQL.block(...)`  |      |
| break          | `SQL.break`       |      |
| return         | `SQL.return(...)` |      |
| continue       | `SQL.continue`    |      |


## SQL执行

### 创建表

```ts
import { SQL, DbType, connect } from 'lubejs';

async (() => {
	const db = await connect('mssql://user:password@localhost:1433');
	await db.query(SQL.createDatabase('test-database'));
    await db.changeDatabase('test-database');
    await db.query(SQL.createTable('Person').as(({ column }) => [
        column('id', DbType.int32).notNull().primaryKey().identity(),
        column('name', DbType.string(100)).notNull(),
        column('age', DbType.int32).null(),
        column('sex', DbType.string(2)).null(),
        column('description', DbType.string(100)).null()
    ]));
    await db.close();
})();
```



### 使用连接(Connection类)

Connection类是整个数据库层的基础，它还封闭了许多比SQL构造更为易用的方法，如(insert、update、select、delete等)



你可以使用以下语句创建一个数据库连接：

```ts
const db = await connect('mssql://user:password@localhost:1433/database');
```



#### 执行查询（.query）

**使用构造SQL查询**

```ts
const sql = SQL.select(1);
const result = await db.query(sql);
console.log(result); // => { rows: [{ '#column_1': 1 }] }
```

同时传递参数

```ts
const sql = SQL.select(SQL.input('@p', 1));
const = await db.query(sql);
console.log(result); // => { rows: [{ '#column_1': 1 }] }
```

获取输出参数

```ts
const p1 = SQL.output('p', DbType.int32);
const sql = SQL.select(SQL.assign(p1, 1));
const = await db.query(sql); // => SELECT @p = 1;
// 在输出值列表中获取其值
console.log(result.output['p']); // => 1
// 亦可以使用原参数获取其值
console.log(p1.value); // => 1
```



**使用原始SQL字符串查询**

使用SQL字符串

```ts
const sql = 'SELECT 1 AS [#column_1]';
const result = await db.query(sql);
console.log(result); // => { rows: [{ '#column_1': 1 }]} }
```

*注意：原始SQL字符串查询，lubejs不会为其指定字段名。*



同时传递参数

```ts
const sql = 'SELECT @p1 AS [#column_1]';
const result = await db.query(sql, [ 1 ]);
console.log(result); // => { rows: [{ '#column_1': 1 }]} }
```



**返回值：**

- 类型: QueryResult<T, R, O>
- 结构

```ts
{
    rows: T[];                  // 查询语句第一个返回的数据集
    returnValue: R;             // 返回值，通过为存储过程的返回值
    rowsets: O;                 // 如果SQL返回多个数据集，则存储在此属性中，该对象为一个数组，第一个值为.rows的引用
    rowsAffected： number;      // 受影响函数
    output: Record<string, Scalar>;   // 返回输出参数值
}
```



***注意： 如果数据库驱动本身不支持多数据集返回，则rowsets只能存在.rows的引用一个元素。***



#### 查询单个值（.queryScalar）

**查询单个值**

```ts
const sql = SQL.select(1);
const result = await db.queryScalar(sql);
console.log(result); // => 1
```

使用参数与传递参数与`.query`方法一致

**使用构建表达式查询**

我们还可以直接使用表达式查询值，lubejs会自动为其构建为SELECT语句进行查询，并返回第一个值。

```ts
const result = await db.queryScalar(SQL.literial(1));
console.log(result); // => 1
```



#### 插入数据（.insert)

**使用表对象查询**

```ts
await db.insert(personTable, {
    name: '张三',
    age: 42,
    sex: '男',
    description: '这个可有可无'
});
```

**直接使用表名插入**

```ts
await db.insert<Person>('Person', {
    name: '张三',
    age: 42,
    sex: '男',
    description: '这个可有可无'
});
```



***注意：使用表名插入并且不指定泛型类型时，会失去类型检查***



#### 查找单行（.find）

**查询单条记录:**

```ts
const row = await db.find(personTable, { name: '张三' });
console.log (row);
// => {
//    id: 1,
//    name: '张三',
//    age: 42,
//    sex: '男',
//    description: '这个可有可无'
// }
```

#### 选择多行（.select）

```ts
const rows = await db.select(personTable, {
    where: {
        name: '张三'
    }
});

console.log(rows);
// => [{
//    id: 1,
//    name: '张三',
//    age: 42,
//    sex: '男',
//    description: '这个可有可无'
// }]
```

**指定返回字段**

```ts
const rows = await db.select(personTable, {
    fields: ['name']
    where: {
        name: '张三'
    }
});

console.log(rows);
// => [{
//    name: '张三'
// }]
```



#### 删除数据（.delete)

```ts
await db.delete<Person>('Person', {
    id: 1
});
```

#### 更新数据（.update）

```ts
await db.update<Person>('Person', {
    age: 43 //大了一岁咯
}, { id: 1 });
```



#### 输出SQL日志(.on('command', handler))

如果您需要知道Connection干了什么，可以使用以下方法输出日志

```ts
db.on('command', cmd => {
    //
    console.log('SQL: ' + cmd.sql);
    // 调用时所传递的参数
    console.log('PARAMS:' + JSON.stringify(cmd.params));
})
```

### 配置文件

许多情况我们可能不希望把连接字符串或配置写在代码中，或者我们也需要使用数据库迁移工具，这时候我们可以配置配置文件，lubejs的配置文件名称为`.lubejs.ts`/`.lubejs.js`，因为需要引用驱动等原因，不支持使用JSON格式配置。

配置文件结构为：

```ts
// 引入配置类型，js中可以忽略
import { LubeConfig } from 'lubejs';
// 引入驱动
import 'lubejs-mssql';
import './orm-configure'
// import 'orm';

export const config: LubeConfig = {
  // 默认配置项名称， 当使用 connect 函数创建连接时，如果不传递参数，则自动使用该配置，名称必须是`configures`中存在的节点名称
  default: 'lubejs-test',
  // 数据迁移文件夹，用于存放数据迁移代码，在数据迁移时会用到，默认为 `migrates`
  migrateDir: 'migrates',
  // 配置项
  configures: {
    'lubejs-test': {
      // 使用驱动名称，需要引入驱动后方可使用
      dialect: 'mssql',
      // 数据库服务器名称，亦可以是IP地址
      host: 'rancher.vm',
      // 使用用户名
      user: 'sa',
      // 密码
      password: 'your!password,
      // 数据库名称
      database: 'lubejs-orm-test',
      port: 1433,
    }
  }
};

export default config;
```



## ORM



### 概念

lubejs的ORM与标准的ORM模型基本一致，但其中也包括了一些，比如**全局主键类型**。



#### 全局主键类型（EntityKey)

lubejs为了加强类型管理，定义了主键类型规范：

***一个实体，有且仅能有一个属性作为主键***

lubejs会在`EntityKey`接口中去获取该属性类型，用作主键的类型，用于`Repository.prototype.get`等方法的类型检查。因此实体类必须实现`EntityKey`接口。

默认情况下，EntityKey为一个空接口，这时主键的类型为`Scalar`类型，如果不去定义`EntityKey`接口，我们调用`Repository.prototype.get`时是这样的

```ts
await repo.get(1);
await repo.get('1');
await repo.get(new Date());
// 以上均能通过类型检查
```

可以看到我们将失去更为精确的类型检查。

因此，在声明实体之前，我们可以使用**Typescript声明合并**特性，来定义EntityKey接口

```ts
// 声明全局实体主键
declare module 'lubejs' {
    export interface EntityKey {
        // 如果为自动生成，需要声明为可空，否则使用.insert时可能通不过语法检查。
        id?: number;
    }
}
```

如果我们不想在每个实体中重复定义主键，我们还可以使用以下方式为所有的实体类隐式声明主键属性：

```ts
contextBuilder.hasGlobalKey('id', Number);
```



#### 实体类(Entity)

实体是lubejs orm操作数据库的基本单位，如果我们需要通过Repository操作数据库，则必须先定义实体类。

实体类又分为以下几种：

- 表实体，映射到数据库中是一个表
- 视图实体，映射到数据库中是一个视图
- 查询实体，该实体仅是一个只读的查询SQL，并不能映射到数据库中的对象



所有用户自定义实体类，可以从Entity类继承，亦可以不从Entity类继承，但是实体必须为`Class`，因为Typescript中的`ineterface`和`type`将在编译后被删除，并且不可以对`interface`使用装饰器，但是：***不从Entity继承的实体类，没有静态方法`.create`方法***。

在下面的章节中，会讲解如何创建实体。



##### 导航属性（关联关系属性）

实体类可以声明导航属性，导航属性可以为我们表与表之间的关联查询提供非常使得的操作。

例如：我们为User实体类声明了一个 **一对一（主）**导航属性，我们获取User实体数据的时候使用以下代码同时获取Employee实体：

```ts
const user = await userRepo.get(1, { includes: { employee: true }});
// => { id: 1, ..., employee: { userId: 1, ... }}
```



在我们创建实体类并使用导航属性时，会有以下特性：

- 导航属性是双向的，即使在另一个实体中未声明导航属性，建模器亦会为其声明一个隐式的导航属性，隐式声明的属性名称约定请参考[关联关系](#关联关系)。
- 导航属性中属性从属关系的实体，需要外键属性，即使外键属性未被声明，建模器亦会为其声明一个隐匿的外键属性，隐式声明的属性名称约定请参考[关联关系](#关联关系)。



另外，导航属性还会有关联保存的特性，具体请参考：[仓储对象(Repository)](#仓储对象(Repository))。



**外键属性**

实体中引用另外一个实体主键属性的属性，我们称之为外键属性。

例如：`Employee`实体中的`userId`属性，引用了`User`表的主键属性`id`，`userId`就是一个外键属性。

##### 隐式属性

**导航属性**和**外键属性**还可以被隐式声明，即不在实体类中声明，但是由建模器自动声明，在查询时**隐式外键属性**会随实体一并返回，而隐式导航属性则需要特殊方法绕过Typescript语法检查才可获取（在后续章节会讲到）。并且在返回的数据中隐式导航属性及隐式外键属性均是不可枚举。通过Object.keys(obj)不会返回该属性，使用`JSON.stringify(obj)`对其序列化时，该属性也不会被序列化。



隐式导航属性命名约定如下：

- 当导航属性为单一引用对象时，取被引用的表名（例：Employee)，首字母小写，当该实体已经存在该同名属性时（例： employee），则直接使用该属性。

- 当导航属性为列表对象引用（如：一对多、多对多）时，取被引用的表名（例Employee)，首字母小写，并转换为复数（例：employees），当该实体已经存在该同名属性时，则直接使用该属性。



隐式外键属性命名约定如下：

- 取被引用表名（此例为为User），首字母小写，再加上Id后缀为外键属性名，如果该实体已经存在该同名属性时，则直接使用该属性



***注意：无论是自动声明导航属性，还是自动声明外键属性，如果实体已经存在同名属性，建模器会直接使用该属性，并且该属性不再是隐式属性，如果类型不符，lubejs并不会报错提示(JS/TS类型反射功能缺失原因)，因此要特别注意这种方式声明的属性的类型，避免踩坑,，强烈建议使用显式声明或者完全隐式声明。***



#### 数据库上下文(DbContext)

一般情况下DbContext类对应着一个数据库。DbContext的声明并不是必须的，如果不声明DbContext，我们可以直接使用DbContext类来访问数据库。

我们可以直接使用DbContext实体来操纵数据，其使用方法与Repository基本一致，请参考[仓储对象(Repository)](#仓储对象(Repository))。

而DbContext，不可以直接查询数据，必须通过Queryable查询。





##### 创建上下文类实例

我们可以直接使用 createContext 方法来创建DbContext实例；

```ts
import { createContext } from 'lubejs';
import { DB } from './db';

// 第一个参数为DbContext类构造函数，第二个参数为连接配置
const ctx = await createContext(DB, 'mssql://user:password@localhost:1433/database');
```

**使用配置文件创建**

当我们不传递构配置时，lubejs会自动根据配置文件中对应DbContext类名的配置来创建。因此我们要特别注意DbContext的名称不要冲突。

```ts
import { createContext } from 'lubejs';
const ctx = await createContext(DB);
```

**创建默认的DbContext类实例**

这里需要注意的是，默认的DbContext不一定就是lubejs内置的DbContext类，moduleBuilder注册的第一个DbContext会自动替代lubejs内置的DbContext类成为默认DbContext。当不传递任何参数调用`createContext`的时候，系统会创建一个默认的`DbContext`（如果未指定，则为lubejs内置`DbContext`类）。

```ts
import { createContext } from 'lubejs';
const ctx = await createContext();
```



***注意：使用配置文件方式创建前，需要配置与上下文类名称相对应的连接配置***

#### 可查询对象(Queryable)

Queryable实现了所有的查询功能，并且同时它本身还是一个异步遍历器，你可以像使用列表。其API设计也参考了Javascript原生的Array对象，许多用法上都非常相似。

为了优化性能，Queryable拥有延迟执行特性，仅有在调用`.fetchAll`()，和`.fetchFirst()`或者使用异步遍历器`for await (const item of userQuerable)`去遍历Queryable对象时时才会真正的从数据库查询数据。



##### 获取可查询对象实例

```ts
const userQueryable = ctx.getQueryable(User);
```



##### 获取所有数据(fetchAll)

```ts
const allUsers = await userQueryable.fetchAll();
```

##### 获取第一行(fetchFirst)

```ts
const user = await userQueryable.fetchFirst();
```



##### 过滤数据(filter)

Queryable.prototype.filter函数会传递一个`Rowset`对象，用于用户构造过滤条件，只需要返回一个查询条件`Condition`即可过滤数据

```ts
const adminUser = await userQueryable.filter(p => p.name.eq('admin')).fetchFirst();
```



##### 获取关联数据(include)

Queryable.prototype.include 指定要查询的子项

```ts
const user = userQueryable.include({
    employee: true
}).fetchFirst()
// user => {
//   name: '...',
//   // ...
//   employee: {
//     //...
//   }
// }
```

即使是多级关联数据，也可以一次性查询

```ts
const user = userQueryable.include({
    employee: {
        positions: true
    }
}).fetchFirst();
// user => {
//   name: '...',
//   // ...
//   employee: {
//     //...
//     positions: [...]
//   }
// }
```



##### 使用异步遍历器遍历可查询对象

```ts
for await (const item of userQuerable) {
    const console.log(item);
}
```



#### 仓储对象(Repository)

仓储对象主要提供数据获取、插入、更新、保存等功能。

##### 获取一个User实体的仓库对象

```ts
const userRepo = ctx.getRepository(User);
```



##### 使用异步遍历器遍历仓库对象

```ts
for await (const item of userRepo) {
    const console.log(item);
}
```



##### 获取单个实体数据(get)

传递键值，获取实体数据，当获取一个不存在的数据时，将抛出异常。如果不希望抛出异常，请使用`Queryable.prototype.filter`方法查询。


**使用DbContext获取**

```ts
const user = await ctx.get(User, 1);
// user 为 User类的实例
```

**使用Repository获取**

```ts
const user = userRepo.get(1);
// user 为 User类的实例
```

通过`.get`获取的对象，本身是实体类的实例

##### 插入实体数据(insert)

在插入实体实例时，如果实体实例的导航属性有值，还会对导航属性的对象进行保存操作。

**使用DbContext插入**

指定实体构造函数插入

```ts
await ctx.insert(User, {
    name: 'admin',
    password: '123456'
})
```

亦可以直接使用实体类实例进行插入

```ts
await ctx.insert(User.create({
    name: 'admin',
    password: '123456'
}))
```

**使用Repository插入**

使用JSON对象插入

```ts
await userRepo.insert({
    name: 'admin',
    password: '123456'
})
```

亦可以直接使用实体类实例进行插入

```ts
await userRepo.insert(User.create({
    name: 'admin',
    password: '123456'
}))
```



##### 更新实体数据(update)

在所有数据更新的操作中，lubejs均是依据主键是否存在来判断数据库中是否存在该数据，在更新实体数据时，如果实体实例的导航属性有值，还会对导航属性的对象进行保存操作。

**使用DbContext更新**

指定实体构造函数更新

```ts
const user = await ctx.get(User, 1);
user.password = 'changed!password';
await ctx.update(User, user)
```

亦可以直接使用实体实例进行更新

```ts
// .get所返回的本身就是实体类实例
const user = await userRepo.get(User, 1);
user.password = 'changed!password';
await userRepo.update(user);
```

update 仅会修改数据，如果数据库中不存在该数据，则会抛出异常。

**使用Repository更新**

```ts
const user = await userRepo.get(1);
user.password = 'changed!password';
await userRepo.update(user);
```

update 仅会修改数据，如果数据库中不存在该数据，则会抛出异常。



**并发问题处理**

在前面的章节提到过在使用`Repository`保存数据时有数据被覆盖的风险，因此我们需要处理并发问题，我们推荐的解决方案是为存在并发可能的实体添加`rowflag`属性，当实体存在`rowflag`属性，在update时会自动附加rowflag作为条件更新，当更新不到数据时，会抛出异常。



##### 删除实体数据(delete)

delete 仅会删除数据，如果数据库中不存在该数据，则会抛出异常。考虑到使用安全性，delete操作时，不会对任何导航属性进行操作，因此，不可以使用delete来保存导航属性的数据。



**并发问题**

为了避免覆盖，建议为存在并发可能的实体类添加`rowflag`属性。



**使用DbContext删除**

指定实体构造函数删除

```ts
const user = await ctx.get(User, 1);
await ctx.delete(User, user)
```

亦可以直接使用实体实例删除

```ts
const user = await ctx.get(User, 1);
await ctx.delete(user);
```

**使用Repository删除**

指定实体构造函数删除

```ts
const user = await userRepo.get(1);
await userRepo.delete(user)
```

亦可以直接使用实体实例删除

```ts
const user = await userRepo.get(1);
await userRepo.delete(user);
```



##### 保存实体数据(save)

你可能会疑惑 `.update`与`.save`方法，为什么保存数据会有两个方法，事实上`.save`提供了更为高级的功能。如果存在关联属性，并且该关联属性值不为`undefined`时，`.save`方法会对关联属性进行分析一并提交，并且update仅会更新数据，并不会自动插入/更新。

**使用DbContext保存**

```ts
const user = await ctx.get(User, 1, { includes: { employee: true }});
user.password = 'changed!password';
user.employee.description = '该职员更改了密码'

await ctx.save(user);
// 同时保存了 user 及 user.employee
```

**使用Repository保存**

```ts
const user = await userRepo.get(1, { includes: { employee: true }});
user.password = 'changed!password';
user.employee.description = '该职员更改了密码'

await userRepo.save(user);
// 同时保存了 user 及 user.employee
```



对于当前对象的保存规则如下：

- 当数据库中存在该数据时，进行**更新**操作
- 当数据库中不存在该数据时，进行**插入**操作

关联属性保存规则如下：

- 当关联属性为`undefined`时，不对关联属性进行任何操作
- 当关联属性为**一对一（主）**关系时
  - 当该属性有值时，对该值进行(**插入/更新**)操作
  - 当该属性为`null`时，对其引用数据进行**删除**操作
- 当关联属性为**一对一（从）**关系时
  - 当该属性为`null`时，删除引用关系（将外键设置为DBNULL）
  - 当该属性存在值时，对其引用数据进行**插入/更新**操作
- 当关联属性为 **一对多**关系时
  - 当该属性有值时，分析数据库中现有数据，对存在与该属性并存在于数据库中的数据进行**更新**操作，对不存在的数据并存在于该属性的数据进行**插入操作**，对数存在于数据库而不存在于该属性中的数据进行**删除**操作。
  - 当该属性为null或者为[]时，对数据库中已有的关联的数据进行**清空**操作。
- 当关联属性为**多对多**关系时
  - 当该属性有值时，分析**中间关系表**数据库中现有数据，对存在与该属性并存在于数据库中的数据进行**更新**操作，对不存在的数据并存在于该属性的数据进行**插入操作**，对数存在于数据库而不存在于该属性中的数据进行**删除**操作。同时对关联表的数据进行**更新**操作。（不建议在此进行关联表的更新操作，如果同时存在删除关系及更新数据时，仅会删除**中间关系表**中的关联数据，而不会更新目标表的数据）
  - 当该属性为null或者为[]时，对**关联中间表**数据库中的数据进行**清空**操作。

当关联属性为多级时，该规则亦适用。



***注意：使用保存数据时要重点考虑并发情况，否则将存在数据被覆盖可能 。***



更多范例，请看[关联关系](#关联关系)



### 建模



ORM建模有以下两种方式：

- 使用装饰器声明，目前使用装饰器声明的实体不能通过类的继承获得装饰器配置信息，但这只是暂时的，在下一个小版本更新时我们会为lubejs添加此功能。
- 使用api声明

这两种声明方式亦可以混合使用，装饰器声明方式会优先执行，api声明则会合并/覆盖（如果允许）装饰器的声明。



***注意： 装饰器模式只支持Typescript，并且需要在`tsconfig.json`中必须打开`experimentalDecorators`与`emitDecoratorMetadata`选项，否则将无法获取属性类型导致报错。***



#### 创建实体类文件



##### 表实体（装饰器声明）

声明一个`User`实体类

```ts
import { DB } from '../index'
import {
  column,
  comment,
  context,
  Entity,
  EntityKey,
  identity,
  key,
  nullable,
  oneToOne,
  principal,
  table,
} from 'lubejs';

@comment('用户表')   // 声明批注，该批注会进入数据库扩展属性/批注中。
@table()           // 声明为表实体
@context(() => DB) // 将实体绑定到DbContext
@data([            // 声明种子数据，在执行数据迁移时会被自动初始化到数据库，在初始化数据时会自动开启标识列插入。
    { id: 1, name: 'admin', password: '123456' }
])
export class User extends Entity implements EntityKey {
    // 声明为列
	@column()
    // 声明为主键
  	@key()
    // 声明为标识列
    @identity()
    @comment('ID')
    id?: bigint;

    @comment('UserName')
    @column()
    name!: string;

    @comment('Password')
    // 声明为可空，不声明时默认为可空
    @nullable()
    @column()
    password?: string;

    @comment('Description')
    @nullable()
    @column()
    description?: string;
}
```

你可能会疑惑为什么引用DB类时需要使用箭头函数，事实上这里可能会存在noedjs循环引用问题，当我们将类独立存放于单个文件中的时候，声明`DB`类的文件中引用了User类文件中，而声明`User`类的文件中亦引用了`DB`类，因此使用函数可以延迟执行，待所有类都创建完毕后执行，从而不会造成访问类时获取一个`undefined`值，在实体与实体之间的引用关系亦存在此问题。



##### 表实体（API声明）

```ts
import {
  modelBuilder,
  DbContext,
  Repository,
  DbType,
  Entity,
  SQL,
  EntityKey,
  Binary,
  Decimal,
} from 'lubejs';

/**
 * 用户实体类
 */
export class User extends Entity implements EntityKey {
  id?: bigint;
  name!: string;
  password!: string;
  description?: string;
  employee?: Employee;
}

modelBuilder.context(DB, context => {
context
    // 声明实体
    .entity(User)
    // 将实体声明为表
    .asTable(table => {
      // 添加表批注
      table.hasComment('Employee');
      table
        // 声明列
        .property(p => p.id, BigInt)
        // 声明标识列
        .isIdentity()
        // 添加列批注
        .hasComment('ID');
      table.property(p => p.name, String).hasComment('EmployeeName');
      table
        .property(p => p.password, String)
        // 声明为可空列
        .isNullable()
        .hasComment('Password');
      table
        .property(p => p.description, String)
        .isNullable()
        .hasComment('Description');
      // 声明主键
      table.hasKey(p => p.id).hasComment('PrimaryKey');
      // 声明种子数据
      table.hasData([{ id: 0, name: 'admin' }]);
    })
});
```



#### 关联关系

本章节内容会讲到关联关系的保存范例，请先阅读[保存实体数据](#保存实体数据(save))，有助于理解本节内容。



##### 一对一关系(主)

假设我们有两个实体: `User`、`Employee`，外键Employee.userId引用了User.id。`User`的实体声明如下：

**显式声明导航属性**

假设实体`Employee`已经声明了`user`属性的情况，可以按以下方式声明。

```ts
// # entities/user.ts
// ....其它导入
import { Employee } './employee'

@comment('User')   // 声明批注，该批注会进入数据库扩展属性/批注中。
@table()           // 声明为表实体
@context(() => DB) // 将实体绑定到DbContext
@data([            // 声明种子数据，在执行数据迁移时会被自动初始化到数据库，在初始化数据时会自动开启标识列插入。
    { id: 1, name: 'admin', password: '123456' }
])
export class User extends Entity implements EntityKey {
    // 声明为列
	@column()
    // 声明为主键
  	@key()
    // 声明为标识列
    @identity()
    @comment('ID')
    id?: bigint;

    // ... 其它属性

    @detail() // 声明为明细属性
    @principal()  // 将该属性声明为主要的一对一关系
    @oneToOne(() => Employee, p => p.user) // 声明一对一关系
    employee?: Employee;
}
```

**隐式声明导航属性**

假设实体`Employee`并未声明`user`属性，下面的例子会自动为其声明隐式**一对一（从）**导航属性`user`。

```ts
// # entities/user.ts
// ....其它导入
import { Employee } './employee'

@comment('User')   // 声明批注，该批注会进入数据库扩展属性/批注中。
@table()           // 声明为表实体
@context(() => DB) // 将实体绑定到DbContext
@data([            // 声明种子数据，在执行数据迁移时会被自动初始化到数据库，在初始化数据时会自动开启标识列插入。
    { id: 1, name: 'admin', password: '123456' }
])
export class User extends Entity implements EntityKey {
    // 声明为列
	@column()
    // 声明为主键
  	@key()
    // 声明为标识列
    @identity()
    @comment('ID')
    id?: bigint;

    // ... 其它属性

    @principal()  // 将该属性声明为主要的一对一关系
    @oneToOne(() => Employee) // 声明一对一关系
    employee?: Employee;
}
```



一对一关系还可以将导航属性声明为明细属性，声明为明细属性后，我们

**获取关联属性**

```ts
const user = await userRepo.get(1, { includes: { employee: true } });
// => { id: 1, ..., employee: { userId: 1, ... }}
```

**创建同时保存关联属性**

```ts
const user = User.create({
    name: 'admin',
    // ...
    employee: {
        name: '管理员',
        description: '关联创建'
    }
});
await userRepo.insert(user);
// 同时会保存User以及Employee
```



**删除关联关系**

要删除关联关系，必须在一对一（从）实体进行操作，具体保存规则，请参考[保存实体数据(save)](#保存实体数据(save))。



##### 一对一关系（从）

我们继续上一个例子，创建实体文件 entities/employee.ts，**一对一关系（从）**

**显式声明外键及导航属性**

```ts
// # entities/employee.ts
// 其它导入...
import { User } from './user'

@table()
@comment('Employee')
@context(() => DB)
export class Employee extends Entity implements EntityKey {
  @column()
  @key()
  @comment('EmployeeID')
  @identity()
  id?: bigint;

  // 其它属性...

  // 外键属性
  @column()
  @comment('UserID')
  userId?: bigint;

  // 声明 一对一（从）属性
  @foreignKey('userId')  // 声明外键
  @oneToOne(() => User, p => p.employee)  // 声明一对一关系
  user?: User | null;  // 如果orderId字段是可空的，需要声明为可以为null，用于断开连接关系
}
```

**隐式声明外键及导航属性**

外键属性可以有建模器自动创建，不需要显示声明，例如：

```ts
// # entities/employee.ts
// 其它导入...
import { User } from './user'

@table()
@comment('Employee')
@context(() => DB)
export class Employee extends Entity implements EntityKey {
  @column()
  @key()
  @comment('EmployeeID')
  @identity()
  id?: bigint;

  // 其它属性...

  // 声明 一对一（从）属性
  @foreignKey()  // 声明为外键一对一属性
  @oneToOne(() => User)  // 声明一对一关系，
  user?: User | null;  // 如果orderId字段是可空的，需要声明为可以为null，用于断开连接关系
}
```

假设`User`实体中不声明导航属性`employee`，建模器将在`User`实体中自动创建该隐式导航属性(一对一(主)) `employee`，同时建模器还会在`Employee`实体中创建外键属性`userId`。

在一对一关系中，隐式导航属性的创建规则如下：

**同时插入一对一（主）实体数据**

```ts
const employee = Employee.create({
    name: '管理员',
    // ...
    user: {
        name: 'admin',
        password: '123456'
    }
});
await employeeRepo.save(employee);
// 同时插入了Employee及User
```



**删除关联关系**

```ts
const employee = await employeeRepo.get(1);
employee.user = null;
await employeeRepo.save(employee);
```



##### 一对多关系

一对多关系与多对一关系关联。

**显示声明导航属性**

假设 实体`OrderDetail`已经声明多对一导航属性`order`，我们可以通过以下方式使其关联。

```ts
// 其它导入...
import { OrderDetail } from './order-detail'

/**
 * Order
 */
 @table()
 @context(() => DB)
 @comment('Order')
 export class Order extends Entity implements EntityKey {
   @column()
   @comment('ID')
   @key()
   @identity()
   id?: bigint;

   // ...

   @oneToMany(() => OrderDetail, p => p.order)
   details?: OrderDetail[];
 }

```

**隐式声明导航属性**

假设 实体`OrderDetail`并未声明多对一导航属性`order`，建模器会为其自动创建隐式多对一导航属性`order`。

```ts
// 其它导入...
import { OrderDetail } from './order-detail'

/**
 * Order
 */
 @table()
 @context(() => DB)
 @comment('Order')
 export class Order extends Entity implements EntityKey {
   @column()
   @comment('ID')
   @key()
   @identity()
   id?: bigint;

   // ...

   @oneToMany(() => OrderDetail)
   details?: OrderDetail[];
 }
```



**插入一对多关系数据**

```ts
const order = Order.create({
    orderNo: '202101010001',
    // ...
    details: [
        {
            product: '铅笔',
            count: 1,
            price: new Decimal(0.56),
            // ...
        },
        {
            product: '文具盒',
            count: 1,
            price: new Decimal(10.65),
            // ...
        },
        {
            product: '笔记本',
            count: 1,
            price: new Decimal(3.5)
        }
    ]
});

await orderRepo.insert(order);
```



**添加删除明细项**

下列代码会删除OrderDetail中product为铅笔的记录，并且插入一条新的product为圆珠笔的记录。

```ts
const order = await orderRepo.get(1, { includes: { detail: true }});
order.details.splice(0, 1); // 删除第一个，即铅笔
order.details.push(OrderDetail.create({
    product: '圆珠笔',
    count: 1,
    price: new Decimal(1.2),
    // ...
}));

await orderRepo.save(order);
```



##### 多对一关系

**显式声明导航属性**

假设实体`Order`已经定义一对多导航属性`details`，我们可以通过以下方式使其关联。

```ts
// ...
import { Order } from './order'

/**
 * OrderDetail
 */
 @table()
 @context(() => DB)
 @comment('OrderDetail')
 export class OrderDetail extends Entity implements EntityKey {
   @column()
   @comment('ID')
   @identity()
   @key()
   id?: bigint;

   // ...

   @comment('OrderId')
   @column()
   orderId?: bigint;

   @foreignKey('orderId') // 指定外键字段
   @manyToOne(() => Order, p => p.details)
   order?: Order | null; // 如果orderId字段是可空的，需要声明为可以为null，用于断开连接关系
 }
```

**断开关联关系**

下列代码可以断开关联关系

```ts
const orderDetail = await orderDetailRepo.get(1);
orderDetail.order = null;
await orderDetailRepo.save(orderDetail);

// => 将orderDetail.orderId 更新为 DBNULL
```



**隐式声明导航及外键属性**

假设实体类`Order`并未定义一对多属性，下列代码会自动为Order实体类创建隐式导航属性**`orderDetail`**，并为实体类`Order`自动创建隐式外键属性`orderId`。

```ts
// ...
import { Order } from './order'

/**
 * OrderDetail
 */
 @table()
 @context(() => DB)
 @comment('OrderDetail')
 export class OrderDetail extends Entity implements EntityKey {
   @column()
   @comment('ID')
   @identity()
   @key()
   id?: bigint;

   // ...

   @comment('OrderId')
   @column()
   orderId?: bigint;

   @manyToOne(() => Order)
   order?: Order;
 }
```



##### 多对多关系

在关系型数据库中，多对多关系需要依靠`中间关系表`完成，因此多对多关系亦需要一个中间关系实体类，该类可以由建模器自动创建，亦可以由用户显式创建。

**显示声明导航属性及中间关系实体**

职员： entities/employee.ts

```ts
// ...
import { Position } from './position'

@table()
@comment('Employee')
@context(() => DB)
export class Employee extends Entity implements EntityKey {
  @column()
  @key()
  @comment('EmployeeID')
  @identity()
  id?: bigint;

  // ...

  @manyToMany(() => Position, p => p.employees) // 关联对向导航属性
  positions?: Position[];

  @oneToMany(() => EmployeePosition, p => p.employee)
  employeePositions?: EmployeePosition[];
}
```

职位： entities/position.ts

```ts
import { Employee } from './employee'

@table()
@comment('Position')
@context(() => DB)
export class Position extends Entity implements EntityKey {
  @column()
  @comment('PositionID')
  @identity()
  @key()
  id?: bigint;

  // ...

  @manyToMany(() => Employee, p => p.positions)   // 关联对向导航属性
  employees?: Employee[];

  @oneToMany(() => EmployeePosition, p => p.position)
  employeePositions?: EmployeePosition[];
}
```

中间关系实体： entities/employee-position.ts

```ts
// ...
import { Position } from './position'
import { Employee } from './employee'

@table()
@context(() => DB)
// @among(() => Position, () => Employee, 'position', 'employee')
@among<EmployeePosition, Position, Employee>(() => Position, () => Employee, p => p.position, p => p.employee)
export class EmployeePosition extends Entity implements EntityKey {
  @column()
  @comment('ID')
  @key()
  @identity()
  id?: bigint;

  @comment('PositionID')
  @column()
  positionId!: bigint;

  @foreignKey('positionId')
  @manyToOne(() => Position, p => p.employeePositions) // 定义导航属性，关联至一侧表
  position?: Position;

  @column()
  @comment('EmployeeID')
  employeeId!: bigint;

  // 定义导航属性，关联至外键表
  @foreignKey('employeeId')
  @manyToOne(() => Employee, p => p.employeePositions) // 定义导航属性，关联至另一侧表
  employee?: Employee;
}
```



**隐式声明导航属性及中间关系实体**

在下列范例中，建模器会隐式创建下列内容：

- 为实体类`Position`创建多对多关系导航属性`employees`
- 为实体类`Position`创建一对多关系导航属性`employeePositions`，关联至隐式实体类`EmployeePosition`中
- 为实体类`Employee`创建一对多关系导航属性`employeePositions`，关联至隐式实体类`EmployeePosition`中
- 自动创建一个名为`EmployeePosition`的隐式中间实体类，实体名称由两个实体名称相连接，**先后根据实体名称首字母顺序而定**，如果已经存在同名实体，则会直接使用该实体作为中间关系实体。同时该中间关系实体类结构与上一例子中的`entities/employee-position.ts`一致，具体会有以下属性：
  - 主键，根据全局主键配置自动创建。
  - 一个名为`position`的多对一导航属性，关联至实体`Position`
  - 一个名为`positionId`的外键属性，指向`Position.id`
  - 一个名为`employee`的多对一导航属性，关联致实体`Employee`
  - 一个名为`employeeId`的外键属性，指向`Employee.id`



职员： entities/employee.ts

```ts
// ...
import { Position } from './position'

@table()
@comment('Employee')
@context(() => DB)
export class Employee extends Entity implements EntityKey {
  @column()
  @key()
  @comment('EmployeeID')
  @identity()
  id?: bigint;

  // ...

  @manyToMany(() => Position) // 关联对向导航属性
  positions?: Position[];
}
```

职位： entities/position.ts

```ts
import { Employee } from './employee'

@table()
@comment('Position')
@context(() => DB)
export class Position extends Entity implements EntityKey {
  @column()
  @comment('PositionID')
  @identity()
  @key()
  id?: bigint;

  // ...
}
```



**插入多对多关系数据**

```ts
const employee = Employee.create({
    name: '张三',
    // ...
    positions: [{
        name: '销售部经理（兼）',
        // ...
    }, {
        name: '副总经理',
        // ...
    }]
})

await employeeRepo.save(employee);
```

以上代码会先后插入下列数据：

- Employee，张三，假设id为1
- Position表，销售经理（兼）【假设id为1】，以及 副总经理【假设id为2】
- EmployeePosition表，[{ employeeId: 1, positionId: 1 }, { employeeId: 1, positionId: 2 }]

**删除关联关系**

```ts
const employee = employeeRepo.get(1);
employee.positions = []; // 也可以 = null
await employeeRepo.save(employee);
```

上述代码将删除 EmployeePosition表中所有employeeId为1的记录。

#### 创建上下文类文件

上下文DB类，db.ts文件

```ts
import { DbContext, Repository, repository } from 'lubejs';
import { User } from './entities/user'
import { Employee } from './entities/employee'

export class DB extends DbContext {
  	@repository(() => User) // 声明一个仓库属性，可以直接从该属性获取仓库，并且该属性为延迟创建，只有在访问该属性时才会被创建。
  	user: Repository<User>;

    @repository(() => Employee)
    employee: Repository<Employee>;
}
```



### 操作实体数据

在仓库对象，与可查询对象中已经详细介绍如何操作数据，在此不在赘述。

- [数据库上下文](#数据库上下文(DbContext))

- [可查询对象(Queryable)](#可查询对象(Queryable))
- [仓储对象(Repository)](#仓储对象(Repository))

- [关联关系](#关联关系)



### 完整范例

- 装饰器声明： [ORM](https://github.com/jovercao/lubejs-tester/blob/master/orm-decorator/index.ts)

- 配置代码声明： [ORM](https://github.com/jovercao/lubejs-tester/blob/master/orm-configure.ts)

### 使用Repository

- [Insert](https://github.com/jovercao/lubejs-tester/blob/master/tests/repository/insert.test.ts)
- [Update](https://github.com/jovercao/lubejs-tester/blob/master/tests/repository/update.test.ts)
- [Delete](https://github.com/jovercao/lubejs-tester/blob/master/tests/repository/delete.test.ts)




## 数据迁移

要使用数据迁移功能，需要用到cli工具，cli工具依然包括在lubejs包中，当我们安装好lubejs后，我们会得到一个`lube`的命名，我们可以使用lube命名来进行数据迁移操作。



### 创建配置文件

在使用数据迁移之前，我们要先创建lubejs的配置文件`.lubejs.ts`或者`.lubejs.js`，否则无法运行迁移工具，创建方法请参考[配置文件](#配置文件)。



### 创建迁移文件

```shell
lube migrate add [name]
```

此命令会将实体结构生成成到 `./migrates/<yyyyMMddHHmmss>_Init.ts`的文件中，同时还会生成一个后缀名为`.snapshot.ts`的同名文件。在下次执行该命令时，会将最新的实体结构与该快照进行对比，q砶只针对差异生成迁移文件。

示例：

```sh
# 创建一个名为 Init 的迁移文件。
lube migrate add Init
```

如果这时没有更改过实体类等结构，再次运行

```ts
lube migrate add AddOrderModule
```

这时会得到一个空的`./migrates/<yyyyMMddHHmmss>_AddOrderModule.ts`文件。

### 手动编写迁移文件

在生成迁移文件后，您可以在上面编写您的数据库迁移代码，不用但以快照与实际结构会有所差异，当下次运行该命令时，如果监测到文件变化，lubejs会重新生成快照文件以进行对比。

```ts
import { Migrate, SQL, DbType, MigrateBuilder } from 'lubejs';

export class Init implements Migrate {
  async up(
    builder: MigrateBuilder, // 迁移代码构建器
    dialect: string // 执行时所使用的数据库方言
  ): Promise<void> {
   	// 在此编写您的部署代码
  }

  async down(
    builder: MigrateBuilder,
    dialect: string
  ): Promise<void> {
   // 在此编写您的回滚代码

}

export default Init;
```

所有的迁移代码，必须使用`MigrateBuilder`类创建，也就是上述示例中的`builder`对象，该对象与`SQL`构造器有着相似的使用方式，但在`MigrateBuilder`类中重点提供了数据迁移方面的功能，而减少了其它数据操作功能。

在这里需要提到的是，我们应该尽可能的不要使用`builder.sql(...)`方法来创建迁移代码，因为该方式所产生的结构变更，lubejs无法追踪源SQL字符串以便生成快照，因此可能在下次生成迁移文件时可能导致数据结构的不正确。

### 更新到数据库

```shell
lube migrate update [name]
```

此命令会将数据库更新到名称为[name]的迁移版本，如果数据库版本新于该版本，则会降级至该版本。

当不指定[name] 参数时，表示使用最新迁移版本。



### 同步数据库

```ts
lube migrate sync
```

此命令与`update`不同，该命令仅会分析当前实体的数据结构，并将对应数据库的结构更新到与实体一致，并不会执行迁移文件中的代码，通常我们使用此命令来快速创建测试环境数据库，不建议在生产环境中使用该命令。



### 导出升级/降级脚本

```ts
lube migrate script --source <source_name> --target <target_name> --output <output_file>
```

该命令可以为迁移文件生成SQL代码，其中<source_name>为源版本迁移文件名称，<target_name>为目标版本迁移文件名称，并将命令导出到<output_file>文件中。



更为详细的操作，请使用`lube --help`查看。



## 其它问题



### JSON序列化问题

通常我们在使用JS的时候都是用`JSON`对象来进行序列化的，但是由于部分类型`BigInt`并未实现序列化功能，会在序列化时遇到错误Lubejs中的特殊标量类型`Scalar`的序列化情况如下：

| 类型    | 说明                                                         | 具体情况                                                     |
| ------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| Binary  | typescript类型别名，实际为`Buffer`、`ArrayBuffer`或者`TypedArrayBuffer`等 | 为了不污染原生对象原则，lubejs未对其序列化行为作出改变，具体序列化结果根据实际值类型而定:<br>- 如值为Buffer类型时，会调用`Buffer.prototype.toString()`再序列化（通常会乱码）。<br>- 如值为ArrayBuffer类型时，会返回`{}` |
| Uuid    | Uuid类                                                       | 已实现`.toJSON`，会返回`"00000000-0000-0000-0000-000000000000"`格式的字符串 |
| BigInt  | v8引原生类型                                                 | 序列化时将遇到错误。                                         |
| Decimal | 来原于`decimal.js-light`                                     | 已实现.toJSON，会序列成字符串，例："100"                     |

建议的解决方案如下：

1. 自定义序列化

   ```ts
   JSON.stringify({ bigint: 1n }, (key, value) => {
       if (typeof value === 'bigint') {
           return  value.toString();
       } else {
           return value;
       }
   });
   ```

2. 为添加`.toJSON`方法实现

   ```ts
   BigInt.prototype.toJSON = function() { return this.toString() }

   JSON.stringify(1n); // => '"1"'
   ```

另外反序列化时，也需要注意类型。

## API

[API 文档](./doc/globals.md)



## Task

- [ ] mysql驱动支持
- [ ] postgresql 驱动支持
- [x] 完善测试覆盖面，目标85%
- [ ] 性能优化
  - [x] 完成主从关联多次查询变更为一次查询
  - [ ] 完成增删查改性能优化，减少SQL编译



## Updated Logs

### 3.0.0-preview06

- 修复Bug

### 3.0.0-preview05

- 完成主从关联多次查询变更为一次查询
- Uuid添加序列化功能
- 取消查询缓存功能
- 修复Bug



### 3.0.0-preview04

- 修复部分bug
- 修改Repository.prototype.get，当键不存在是抛出异常
- 完整文档初稿
- 增加测试覆盖面

### 3.0.0-preview01

最初预览版
