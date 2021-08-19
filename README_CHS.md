# lubejs

> Lubejs 是一个用于 `node.js` 诣在方便使用SQL数据库连接.
> 取名为lube意为润滑，即作为js与sql间的润滑剂般的存在，尽情使用 js/ts 替代你的 sql 字符串吧.

[English](./README.md)

支持列表:

- mssql - 目前支持microsoft sqlserver 2012 或更高版本, 库基于 `node-mssql`开发.

## lubejs是什么

lubejs 是一套强大且易用的Typescript ORM开发框架，同时也拥有

灵感来自于[EF](https://github.com/dotnet/efcore), [TypeORM](https://github.com/typeorm/typeorm)

- 完备的SQL构建工具，使用最贴近SQL的语法编写SQL，及低的学习成本
- 强大的Typescript类型支持，支持反向类型推导，通过select函数确定返回类型，确保类型安全
- ORM配套工具，Code first
- 匹配多种数据库（目前只支持mssql)
- 建立了SQL中间标准，只要使用中间标准，跨数据库不再需要重构

## lubejs理念

- 简洁
- 贴近自然
- 渐进式

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

**typescript:**

```ts
// start.ts
import { createLube, SqlBuilder as SQL } from 'lubejs'
import 'lubejs-mssql'

(async () => {
  const db = await createLube('mssql://user:password@localhost:1433/database');

  await db.query(SQL.select(1));
})()

```

安装`ts-node`并运行`ts-node start.js`启动
或者执行`tsc`编译后`node start.js`启动

**javascript:**

```js
// start.js
const { createLube, SqlBuilder: SQL } = require('lubejs')
require('lubejs-mssql')

(async () => {
  const db = await createLube('mssql://user:password@localhost:1433/database');

  await db.query(SQL.select(1));
})()

```

运行 `node start.js`启动

```base
node star.js

```

## 进阶

### 增删改查

范例： [start.ts](https://github.com/jovercao/lubejs-tester/blob/master/start.ts)

### ORM

#### 实体声明

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

