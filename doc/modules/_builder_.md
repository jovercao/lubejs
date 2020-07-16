[lubejs](../README.md) › [Globals](../globals.md) › ["builder"](_builder_.md)

# Module: "builder"

## Index

### Type aliases

* [Filter](_builder_.md#filter)
* [InsertObject](_builder_.md#insertobject)

### Variables

* [$case](_builder_.md#const-case)
* [$delete](_builder_.md#const-delete)
* [alias](_builder_.md#const-alias)
* [and](_builder_.md#const-and)
* [any](_builder_.md#const-any)
* [anyFields](_builder_.md#const-anyfields)
* [bracket](_builder_.md#const-bracket)
* [buildIn](_builder_.md#const-buildin)
* [constant](_builder_.md#const-constant)
* [del](_builder_.md#const-del)
* [exec](_builder_.md#const-exec)
* [execute](_builder_.md#const-execute)
* [exists](_builder_.md#const-exists)
* [field](_builder_.md#const-field)
* [identifier](_builder_.md#const-identifier)
* [input](_builder_.md#const-input)
* [insert](_builder_.md#const-insert)
* [invoke](_builder_.md#const-invoke)
* [not](_builder_.md#const-not)
* [or](_builder_.md#const-or)
* [output](_builder_.md#const-output)
* [quoted](_builder_.md#const-quoted)
* [select](_builder_.md#const-select)
* [sys](_builder_.md#const-sys)
* [table](_builder_.md#const-table)
* [update](_builder_.md#const-update)
* [variant](_builder_.md#const-variant)
* [when](_builder_.md#const-when)

### Functions

* [fn](_builder_.md#const-fn)
* [raw](_builder_.md#const-raw)
* [sp](_builder_.md#const-sp)
* [sysFn](_builder_.md#const-sysfn)

### Object literals

* [SQL](_builder_.md#const-sql)

## Type aliases

###  Filter

Ƭ **Filter**: *object*

Defined in src/builder.ts:167

属性过滤器

#### Type declaration:

___

###  InsertObject

Ƭ **InsertObject**: *[Filter](_builder_.md#filter)‹T, [JsConstant](_ast_.md#jsconstant)›*

Defined in src/builder.ts:175

将类型不符合Insert语句(即KeyValueObject)的属性进行过滤,
主要应用于主从表等类型

## Variables

### `Const` $case

• **$case**: *[case](../classes/_ast_.statement.md#static-case)* = Statement.case

Defined in src/builder.ts:113

___

### `Const` $delete

• **$delete**: *[delete](../classes/_ast_.statement.md#static-delete)* = Statement.delete

Defined in src/builder.ts:155

___

### `Const` alias

• **alias**: *[alias](../classes/_ast_.expression.md#static-alias)* = Expression.alias

Defined in src/builder.ts:93

创建一个别名

___

### `Const` and

• **and**: *[and](../classes/_ast_.condition.md#and)* = Condition.and

Defined in src/builder.ts:25

使用and关联多个查询条件

**`static`** 

**`param`** 要关联的查询条件列表

**`returns`** condition

**`memberof`** SQL

___

### `Const` any

• **any**: *[any](../classes/_ast_.expression.md#static-any)* = Expression.any

Defined in src/builder.ts:157

___

### `Const` anyFields

• **anyFields**: *[Identifier](../classes/_ast_.identifier.md)‹›* = Expression.any()

Defined in src/builder.ts:162

任意字段

___

### `Const` bracket

• **bracket**: *[bracket](../classes/_ast_.ast.md#static-bracket)* = AST.bracket

Defined in src/builder.ts:73

___

### `Const` buildIn

• **buildIn**: *[buildIn](../classes/_ast_.identifier.md#static-buildin)* = Identifier.buildIn

Defined in src/builder.ts:132

___

### `Const` constant

• **constant**: *[constant](../classes/_ast_.expression.md#static-constant)* = Expression.constant

Defined in src/builder.ts:69

___

### `Const` del

• **del**: *[delete](../classes/_ast_.statement.md#static-delete)* = Statement.delete

Defined in src/builder.ts:153

创建一个DELETE语句

___

### `Const` exec

• **exec**: *[exec](../classes/_ast_.statement.md#static-exec)* = Statement.exec

Defined in src/builder.ts:46

___

### `Const` execute

• **execute**: *[execute](../classes/_ast_.statement.md#static-execute)* = Statement.execute

Defined in src/builder.ts:48

___

### `Const` exists

• **exists**: *[exists](../classes/_ast_.condition.md#static-exists)* = Condition.exists

Defined in src/builder.ts:42

exists语句

**`static`** 

**`param`** 

**`returns`** 

**`memberof`** SQL

___

### `Const` field

• **field**: *[field](../classes/_ast_.expression.md#static-field)* = Expression.field

Defined in src/builder.ts:67

___

### `Const` identifier

• **identifier**: *[identifier](../classes/_ast_.expression.md#static-identifier)* = Expression.identifier

Defined in src/builder.ts:56

标识符

**`returns`** 

___

### `Const` input

• **input**: *[input](../classes/_ast_.parameter.md#static-input)* = Parameter.input

Defined in src/builder.ts:78

input 参数

___

### `Const` insert

• **insert**: *[insert](../classes/_ast_.statement.md#static-insert)* = Statement.insert

Defined in src/builder.ts:111

创建一个INSERT语句

___

### `Const` invoke

• **invoke**: *[invoke](../classes/_ast_.expression.md#static-invoke)* = Expression.invoke

Defined in src/builder.ts:44

___

### `Const` not

• **not**: *[not](../classes/_ast_.condition.md#static-not)* = Condition.not

Defined in src/builder.ts:16

not 查询条件运算

___

### `Const` or

• **or**: *[or](../classes/_ast_.condition.md#or)* = Condition.or

Defined in src/builder.ts:33

使用or关联多个查询条件

**`static`** 

**`param`** 要关联的查询条件列表

**`returns`** condition

**`memberof`** SQL

___

### `Const` output

• **output**: *[output](../classes/_ast_.parameter.md#static-output)* = Parameter.output

Defined in src/builder.ts:83

output参数

___

### `Const` quoted

• **quoted**: *[bracket](../classes/_ast_.ast.md#static-bracket)* = AST.bracket

Defined in src/builder.ts:71

___

### `Const` select

• **select**: *[select](../classes/_ast_.statement.md#static-select)* = Statement.select

Defined in src/builder.ts:98

创建一个SELECT语句

___

### `Const` sys

• **sys**: *[buildIn](../classes/_ast_.identifier.md#static-buildin)* = buildIn

Defined in src/builder.ts:138

内建标识符，不会被 [] 包裹，buildIn的别名

**`param`** 

___

### `Const` table

• **table**: *[table](../classes/_ast_.expression.md#static-table)* = Expression.table

Defined in src/builder.ts:65

创建一个表格标识

**`param`** 表标识限定，如果有多级，请传多个参数

**`returns`** 

**`example`** table(database, schema, tableName) => Identity

**`example`** table(tableName) => Identity

___

### `Const` update

• **update**: *[update](../classes/_ast_.statement.md#static-update)* = Statement.update

Defined in src/builder.ts:118

创建一个UPDATE语句

___

### `Const` variant

• **variant**: *[variant](../classes/_ast_.expression.md#static-variant)* = Expression.variant

Defined in src/builder.ts:88

变量引用

___

### `Const` when

• **when**: *[when](../classes/_ast_.statement.md#static-when)* = Statement.when

Defined in src/builder.ts:50

## Functions

### `Const` fn

▸ **fn**(...`names`: string[]): *(Anonymous function)*

Defined in src/builder.ts:120

**Parameters:**

Name | Type |
------ | ------ |
`...names` | string[] |

**Returns:** *(Anonymous function)*

___

### `Const` raw

▸ **raw**(`sql`: string): *[Raw](../classes/_ast_.raw.md)‹›*

Defined in src/builder.ts:104

创建一个原始的SQL片段

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`sql` | string | 原始SQL  |

**Returns:** *[Raw](../classes/_ast_.raw.md)‹›*

___

### `Const` sp

▸ **sp**(...`names`: string[]): *(Anonymous function)*

Defined in src/builder.ts:126

**Parameters:**

Name | Type |
------ | ------ |
`...names` | string[] |

**Returns:** *(Anonymous function)*

___

### `Const` sysFn

▸ **sysFn**(`name`: string): *(Anonymous function)*

Defined in src/builder.ts:144

内建函数

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`name` | string |   |

**Returns:** *(Anonymous function)*

## Object literals

### `Const` SQL

### ▪ **SQL**: *object*

Defined in src/builder.ts:180

语句

###  alias

• **alias**: *[alias](../classes/_ast_.expression.md#static-alias)*

Defined in src/builder.ts:197

###  and

• **and**: *[and](../classes/_ast_.condition.md#and)*

Defined in src/builder.ts:200

###  any

• **any**: *[any](../classes/_ast_.expression.md#static-any)*

Defined in src/builder.ts:207

###  anyFields

• **anyFields**: *[Identifier](../classes/_ast_.identifier.md)‹›*

Defined in src/builder.ts:208

###  bracket

• **bracket**: *[bracket](../classes/_ast_.ast.md#static-bracket)*

Defined in src/builder.ts:204

###  buildIn

• **buildIn**: *[buildIn](../classes/_ast_.identifier.md#static-buildin)*

Defined in src/builder.ts:193

###  case

• **case**: *[case](../classes/_ast_.statement.md#static-case)* = $case

Defined in src/builder.ts:185

###  delete

• **delete**: *[delete](../classes/_ast_.statement.md#static-delete)* = $delete

Defined in src/builder.ts:184

###  exec

• **exec**: *[exec](../classes/_ast_.statement.md#static-exec)*

Defined in src/builder.ts:187

###  execute

• **execute**: *[execute](../classes/_ast_.statement.md#static-execute)*

Defined in src/builder.ts:186

###  exists

• **exists**: *[exists](../classes/_ast_.condition.md#static-exists)*

Defined in src/builder.ts:189

###  field

• **field**: *[field](../classes/_ast_.expression.md#static-field)*

Defined in src/builder.ts:196

###  fn

• **fn**: *fn*

Defined in src/builder.ts:191

###  input

• **input**: *[input](../classes/_ast_.parameter.md#static-input)*

Defined in src/builder.ts:198

###  insert

• **insert**: *[insert](../classes/_ast_.statement.md#static-insert)*

Defined in src/builder.ts:182

###  invoke

• **invoke**: *[invoke](../classes/_ast_.expression.md#static-invoke)*

Defined in src/builder.ts:190

###  or

• **or**: *[or](../classes/_ast_.condition.md#or)*

Defined in src/builder.ts:201

###  output

• **output**: *[output](../classes/_ast_.parameter.md#static-output)*

Defined in src/builder.ts:199

###  quoted

• **quoted**: *[bracket](../classes/_ast_.ast.md#static-bracket)*

Defined in src/builder.ts:205

###  raw

• **raw**: *raw*

Defined in src/builder.ts:206

###  select

• **select**: *[select](../classes/_ast_.statement.md#static-select)*

Defined in src/builder.ts:181

###  sp

• **sp**: *sp*

Defined in src/builder.ts:192

###  sys

• **sys**: *[buildIn](../classes/_ast_.identifier.md#static-buildin)*

Defined in src/builder.ts:194

###  table

• **table**: *[table](../classes/_ast_.expression.md#static-table)*

Defined in src/builder.ts:195

###  update

• **update**: *[update](../classes/_ast_.statement.md#static-update)*

Defined in src/builder.ts:183

###  var

• **var**: *[variant](../classes/_ast_.expression.md#static-variant)* = variant

Defined in src/builder.ts:203

###  variant

• **variant**: *[variant](../classes/_ast_.expression.md#static-variant)*

Defined in src/builder.ts:202

###  when

• **when**: *[when](../classes/_ast_.statement.md#static-when)*

Defined in src/builder.ts:188
