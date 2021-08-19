# Lubejs

> Lubejs is a ORM framwork for `node.js`
> Named lube, it means lubrication, that is, it exists as a lubricant between JS and SQL. Enjoy using JS code to replace your SQL string.

[简体中文](./README_CHS.md)

**Support dialect:**

- mssql - It support microsoft sqlserver 2012 or higher version, base of [node-mssql](https://github.com/tediousjs/node-mssql).

## What's lubejs

Lubejs is a powerful and easy-to-use typescript ORM development framework,

Inspired by[EF](https://github.com/dotnet/efcore), [TypeORM](https://github.com/typeorm/typeorm)

- Complete SQL construction tools, use the syntax closest to SQL to write SQL, and low learning cost
- Strong typescript type support, support reverse type derivation, and determine the return type through the select function to ensure type safety
- ORM kit, code first
- Match multiple databases (currently only MSSQL is supported)
- The SQL intermediate standard is established. As long as the intermediate standard is used, cross database reconstruction is no longer required

## Lubejs concept

- Succinct
- Close to nature
- Progressive

## Quick start

### install

install with npm:

```shell
# install lubejs
npm install lubejs --save

# install lubejs-mssql
npm install lubejs-mssql
```

### run

**Typescript:**

```ts
// start.ts
import { createLube, SqlBuilder as SQL } from 'lubejs'
import 'lubejs-mssql'

(async () => {
  const db = await createLube('mssql://user:password@localhost:1433/database');

  await db.query(SQL.select(1));
})()

```

Install `ts-node` and run command: `ts-node start.js` to start program
or execute command `tsc` to compile and run command: `node start.js` to start program

**Javascript:**

```js
// start.js
const { createLube, SqlBuilder: SQL } = require('lubejs')
require('lubejs-mssql')

(async () => {
  const db = await createLube('mssql://user:password@localhost:1433/database');

  await db.query(SQL.select(1));
})()

```

run command: `node start.js` to start program

```base
node star.js

```

## Advanced

### CRUD

example: [start.ts](https://github.com/jovercao/lubejs-tester/blob/master/start.ts)

### ORM

#### Entity declare

- Declare with decorator：[ORM](https://github.com/jovercao/lubejs-tester/blob/master/orm-decorator/index.ts)

- Declare with configure code: [ORM](https://github.com/jovercao/lubejs-tester/blob/master/orm-configure.ts)

#### Use with repository

- [Insert](https://github.com/jovercao/lubejs-tester/blob/master/tests/repository/insert.test.ts)
- [Update](https://github.com/jovercao/lubejs-tester/blob/master/tests/repository/update.test.ts)
- [Delete](https://github.com/jovercao/lubejs-tester/blob/master/tests/repository/delete.test.ts)

#### Use with queryable

### Migration



## API

[API DOC](./doc/globals.md)

## Updated Logs

### 3.0.0-preview01


