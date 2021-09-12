# lubejs

> Lubejs 是一个用于 `node.js` 诣在方便使用SQL数据库连接.
> 取名为lube意为润滑，即作为js与sql间的润滑剂般的存在，尽情使用 js/ts 替代你的 sql 字符串吧.
>
> 本库部分灵感来自于[EF](https://github.com/dotnet/efcore) 与  [TypeORM](https://github.com/typeorm/typeorm)，致谢

[English](./README.md)

## lubejs是什么

lubejs 是一套类型化sql构建、执行工具，亦是一套强大易用的Typescript ORM开发框架。

> 

- 完备的SQL构建工具，使用最贴近SQL的语法编写SQL，及低的学习成本
- 强大的Typescript类型支持，支持反向类型推导，通过select函数确定返回类型，全类型安全
- ORM配套工具，Code first
- 匹配多种数据库（目前只支持mssql)
- 建立了SQL中间标准，只要使用中间标准，跨数据库不再需要重构

## lubejs理念

- 简洁，极简api，极易上手
- 贴近自然，语法与标准sql极为接近，大大降低学习成本
- 渐进式，lubejs分为两个层级的引用，core及完整功能包
- typescript类型推导，完整类型安全

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
  const sql = SQL.select(
    pay.year,
    pay.month,
    p.name,
    p.age,
    SQL.std.sum(pay.amount).as("total")
  )
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

*注意： lubejs目前仍为预览版，内部会有部分调整，公共API可能会有小许调整，但不会有大调整。*

### 渐进式分离

- lubejs/core 为核心包，包括sql构建，sql执行工具。
- lubejs则为完整包，包括`lubejs/core`的所有内容以及orm功能，数据迁移cli等。

### 数据库支持列表

- [x] mssql - 目前支持microsoft sqlserver 2012 或更高版本, 库基于 `node-mssql`开发.
- [ ] mysql - 当前正在开发中
- [ ] postgresql - 计划于年低开发





## 概念

### SQL构造器(SQL对象)

所有的SQL构造，均由 `SQL`对象发起，几乎所有的`SQL`对象有几乎所有`SQL`的语句，均可从`SQL`对象创建，如`SQL.select`，`SQL.update`,`SQL.delete`等。

```ts
// 导入SQL对象
import { SQL } from 'lubejs';
```

为了更贴近sql语法，您还可以使用解构来引入需要的关键字

```ts
const {
    insert,
    delete: $delete
} = SQL

// 构建插入张三、李四两条记录到table1的语句
const sql = insert('table1').values([{ name: '张三', age: 19, sex: '男' }, { name: '李四', age: 25, sex: '男' }]);

// 构建table1表中删除id为1记录的sql语句
const sql = $delete('table1').where({ id: 1 })
```

更多`SQL`对象用法，请翻阅《api参考》



*注意：`delete`为`js`关键字，需要使用别名代替，其它关键字亦是如此*

### 标准行为（SQL.std 对象）

lubejs为了更大程序的兼容多数据库，专门定义了标准行为，用于统一在跨数据库时的操作，避免在跨方言数据库迁移是的重复劳动。

`Standard`中定义了许多常用的函数、操作等行为



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

| 说明                   | 函数                                   |      |
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

| 说明                             | 函数                 |      |
| -------------------------------- | -------------------- | ---- |
| 获取字符串字符数                 | `SQL.std.strlen      |      |
| 获取字符串字节数                 |                      |      |
| 截取字符串                       | `SQL.std.substr      |      |
| 替换字符串                       | `SQL.std.replace     |      |
| 删除两侧空格                     | `SQL.std.trim        |      |
| 删除右侧空格                     | `SQL.std.trimEnd     |      |
| 转换成小写字母                   | `SQL.std.lower       |      |
| 转换成大写字母                   | `SQL.std.upper       |      |
| 获取字符串在另一个字符串中的位置 | `SQL.std.strpos      |      |
| 获取一个字符的ascii码            | `SQL.std.ascii       |      |
| 将一个ascii码转换成一个字符      | `SQL.std.asciiChar   |      |
| 获取一个字符的unicode码          | `SQL.std.unicode     |      |
| 将一个unicode码转换成一个字符    | `SQL.std.unicodeChar |      |


**数学函数**

| 说明     | 函数 |      |
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

| 说明     | 方法 |      |
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

### 表达式(Expression类)

在lubejs中所有表达式对象均由`Expression`类继承而来，其中包括：字段（Field）、一元运算（UnaryOperation）、二元运算(BinaryOperation)、变量(Variant)、标量函数调用(ScalarFuncInvoke)等)，使用表达式可以方便的进行运算操作，例如：

```ts
// 加法运算
p.age.add(1)
// => p.age + 1
```



```ts
// 生成比较查询条件

p.age.lte(18)
// => p.age >= 18	
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

查询条件请参考[WHERE条件](# WHERE条件)



### 行集

所有可以通过`select from`的对象均可称为行集，具体有以下内容：

- 表/视图

- 别名SELECT子查询

- WITH别名查询
- 表值函数调用结果



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



*注意：表对象声明不是必须的，但如果不使用表对象，则每次使用该表时，都需要主动附带泛型类型(例如：`SQL.select<Person>(SQL.star).from('Person')`) 否则select语句会失去返回类型，而使用`any`代替*

## SQL构建

本单节会介绍怎么使用`lubejs`来构建sql语句

*注意：本章节所讲的构建sql，并非执行sql，执行sql会在后续章节讲解*



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
const personTable = SQL.table<Person>('Person');
const houseTable = SQL.table<House>('House')
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

**使用 * **

```ts
const sql = SQL.select(p.star).from(p)
// => SELECT p.* FROM Person p	
```

使用 `p.star` 返回`p`本身所附带的类型，会被select所继承过去。

**使用表达式**

```ts
const sql = SQL.select(p.name, 1, 2, 3).from(p)
// => SELECT p.name as name, 1 as #column_1, 2 as #column_2, 3 as #column_3 FROM Person p
```



*注意： 为了兼容各数据库，不指定字段名的表达式列，而字段列则会使用本身列名，lubejs会为其自动加上列名，规则为： `#column_{i}`*

*注意：表达式查询方式建议仅在查询单个值时使用，其它情况不推荐使用该方式查询，因为使用该方式将失去类型推导*

#### WHERE条件

**JSON格式 **

JSON格式仅适用于简单的 `=`, `in`运算之间的`and`条件联接，一般用于快速查询某个对象，若要使用高级条件请看下面。

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

具体对比条件运算符清单如下：

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
|          |                                                              |           |

**AND/OR/NOT条件**

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



*注意： 使用SQL.and/SQL.or构建的查询条件所返回的条件为分组条件*

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
    description: '这个可以可无'
});

// => INSERT INTO Person(name, age, sex, description) VALUES ('张三', 23, '男', '这个可以可无')
```



#### 多条插入

```ts
// 多条插入
const sql = SQL.insert(personTable).values([
    {
        name: '张三',
        age: 23,
        sex: '男',
        description: '这个可以可无
    },
    {
        name: '李四',
        age: 43,
        sex: '男',
        description: '这个可以可无
    }
]);
// => INSERT INTO Person(name, age, sex, description)
//    VALUES ('张三', 23, '男', '这个可以可无'),
//           ('李四', 43, '男', '这个可以可无')
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

| 语句                                | 使用                                                | 说明                  |
| ----------------------------------- | --------------------------------------------------- | --------------------- |
| insert                              | `SQL.insert(...)`                                   |                       |
| update                              | `SQL.update(...)`                                   |                       |
| select                              | `SQL.update(...)`                                   |                       |
| delete                              | `SQL.delete(...)`                                   |                       |
| case when ... then ... else ... end | `SQL.case(...)`                                     | CASE语句              |
| execute                             | `SQL.execute(...)`、``                              | 存储过程调用          |
| invoke                              | `SQL.invokeAsScalar(...)`，`SQL.invokeAsTable(...)` | 函数调用              |
|                                     | `SQL.makeExec(...)`                                 | 将SQL函数声明为JS函数 |
| order by                            |                                                     |                       |
|                                     |                                                     |                       |
|                                     |                                                     |                       |
|                                     |                                                     |                       |
|                                     |                                                     |                       |
|                                     |                                                     |                       |
|                                     |                                                     |                       |
|                                     |                                                     |                       |
|                                     |                                                     |                       |
|                                     |                                                     |                       |
|                                     |                                                     |                       |
|                                     |                                                     |                       |
|                                     |                                                     |                       |
|                                     |                                                     |                       |
|                                     |                                                     |                       |
|                                     |                                                     |                       |
|                                     |                                                     |                       |
|                                     |                                                     |                       |
|                                     |                                                     |                       |
|                                     |                                                     |                       |





#### 数据结构操作语句

| 语句           | 使用            | 说明 |
| -------------- | --------------- | ---- |
| create table   |                 |      |
| altert table   |                 |      |
| drop table     |                 |      |
|                |                 |      |
|                |                 |      |
|                |                 |      |
|                |                 |      |
|                |                 |      |
|                |                 |      |
|                |                 |      |
|                |                 |      |
|                |                 |      |
|                |                 |      |
|                |                 |      |
|                |                 |      |
|                |                 |      |
|                |                 |      |
|                |                 |      |
|                |                 |      |
|                |                 |      |
|                |                 |      |
|                |                 |      |
|                |                 |      |
|                |                 |      |
|                |                 |      |
|                |                 |      |
|                |                 |      |
|                |                 |      |
|                |                 |      |

#### 程序控制语句

| 语句           | 使用 | 说明 |
| -------------- | ---- | ---- |
| if..then..else |      |      |
| while          |      |      |
| begin ... end  |      |      |
| break          |      |      |
| return         |      |      |
| continue       |      |      |


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



### 使用Connection类

Connection类是整个数据库层的基础；

使用以下语句创建一个数据库连接

```ts
const db = await connect('mssql://user:password@localhost:1433/database');
```

### 增删改查



#### 插入

```ts
await db.insert(personTable, {
    name: '张三',
    age: 42,
    sex: '男',
    description: '这个可以可无'
});
```

直接使用表名插入

```ts
await db.insert<Person>('Person', {
    name: '张三',
    age: 42,
    sex: '男',
    description: '这个可以可无'
});
```



*注意：使用表名插入并且不指定泛型类型时，会失去类型检查*

#### 查询

**查询单条记录:**

```ts
await db.find(personTable, { name: '张三' });
/*
输出: [{
    id: 1,
    name: '张三',
    age: 42,
    sex: '男',
    description: '这个可以可无'
}]
*/
```

**查询多条记录:**

```ts
await db.select(personTable, {
    where: {
        name: '张三'
    }
});

/*
输出: [{
    id: 1,
    name: '张三',
    age: 42,
    sex: '男',
    description: '这个可以可无'
}]
*/
```

**查询单个值:**

```ts
await db.queryScalar(SQL.select(personTable.age).where(personTable.name.eq('张三')))
```

#### 删除

```ts
await db.delete<Person>('Person', {
    id: 1
})
```

#### 修改

```ts
await db.update<Person>('Person', {
    age: 43 //大了一岁咯
}, { id: 1 })
```




#### 完整范例

> 范例： [start.ts](https://github.com/jovercao/lubejs-tester/blob/master/start.ts)

### ORM实体

#### 实体声明

注意： 在使用装饰器模式时, typescript 必须打开`experimentalDecorators`与`emitDecoratorMetadata`选项，否则将无法使用装饰器或者获取装被装饰的属性类型。

- 装饰器声明： [ORM](https://github.com/jovercao/lubejs-tester/blob/master/orm-decorator/index.ts)

- 配置代码声明： [ORM](https://github.com/jovercao/lubejs-tester/blob/master/orm-configure.ts)

#### 使用Repository

- [Insert](https://github.com/jovercao/lubejs-tester/blob/master/tests/repository/insert.test.ts)
- [Update](https://github.com/jovercao/lubejs-tester/blob/master/tests/repository/update.test.ts)
- [Delete](https://github.com/jovercao/lubejs-tester/blob/master/tests/repository/delete.test.ts)

#### 使用Queryable


### 数据迁移


## API

[API DOC](./doc/globals.md)

## Updated Logs

### 3.0.0-preview01

