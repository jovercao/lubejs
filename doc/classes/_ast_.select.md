[lubejs](../README.md) › [Globals](../globals.md) › ["ast"](../modules/_ast_.md) › [Select](_ast_.select.md)

# Class: Select

SELECT查询

## Hierarchy

  ↳ [Fromable](_ast_.fromable.md)

  ↳ **Select**

## Index

### Constructors

* [constructor](_ast_.select.md#constructor)

### Properties

* [columns](_ast_.select.md#columns)
* [filters](_ast_.select.md#optional-filters)
* [groups](_ast_.select.md#optional-groups)
* [havings](_ast_.select.md#optional-havings)
* [isDistinct](_ast_.select.md#optional-isdistinct)
* [joins](_ast_.select.md#optional-joins)
* [limits](_ast_.select.md#optional-limits)
* [offsets](_ast_.select.md#optional-offsets)
* [sorts](_ast_.select.md#optional-sorts)
* [tables](_ast_.select.md#optional-tables)
* [tops](_ast_.select.md#optional-tops)
* [type](_ast_.select.md#readonly-type)
* [unions](_ast_.select.md#optional-unions)

### Methods

* [as](_ast_.select.md#as)
* [distinct](_ast_.select.md#distinct)
* [from](_ast_.select.md#from)
* [groupBy](_ast_.select.md#groupby)
* [having](_ast_.select.md#having)
* [join](_ast_.select.md#join)
* [leftJoin](_ast_.select.md#leftjoin)
* [limit](_ast_.select.md#limit)
* [offset](_ast_.select.md#offset)
* [orderBy](_ast_.select.md#orderby)
* [quoted](_ast_.select.md#quoted)
* [top](_ast_.select.md#top)
* [union](_ast_.select.md#union)
* [unionAll](_ast_.select.md#unionall)
* [where](_ast_.select.md#where)
* [assign](_ast_.select.md#static-assign)
* [bracket](_ast_.select.md#static-bracket)
* [case](_ast_.select.md#static-case)
* [declare](_ast_.select.md#static-declare)
* [delete](_ast_.select.md#static-delete)
* [exec](_ast_.select.md#static-exec)
* [execute](_ast_.select.md#static-execute)
* [insert](_ast_.select.md#static-insert)
* [select](_ast_.select.md#static-select)
* [update](_ast_.select.md#static-update)
* [when](_ast_.select.md#static-when)

## Constructors

###  constructor

\+ **new Select**(`columns?`: [ValuesObject](../modules/_ast_.md#valuesobject)): *[Select](_ast_.select.md)*

*Overrides [AST](_ast_.ast.md).[constructor](_ast_.ast.md#constructor)*

Defined in src/ast.ts:1915

**Parameters:**

Name | Type |
------ | ------ |
`columns?` | [ValuesObject](../modules/_ast_.md#valuesobject) |

**Returns:** *[Select](_ast_.select.md)*

\+ **new Select**(...`columns`: [UnsureExpression](../modules/_ast_.md#unsureexpression)[]): *[Select](_ast_.select.md)*

*Overrides [AST](_ast_.ast.md).[constructor](_ast_.ast.md#constructor)*

Defined in src/ast.ts:1917

**Parameters:**

Name | Type |
------ | ------ |
`...columns` | [UnsureExpression](../modules/_ast_.md#unsureexpression)[] |

**Returns:** *[Select](_ast_.select.md)*

## Properties

###  columns

• **columns**: *[List](_ast_.list.md)*

Defined in src/ast.ts:1911

___

### `Optional` filters

• **filters**? : *[Condition](_ast_.condition.md)*

*Inherited from [Fromable](_ast_.fromable.md).[filters](_ast_.fromable.md#optional-filters)*

Defined in src/ast.ts:1839

___

### `Optional` groups

• **groups**? : *[Expression](_ast_.expression.md)[]*

Defined in src/ast.ts:1913

___

### `Optional` havings

• **havings**? : *[Condition](_ast_.condition.md)*

Defined in src/ast.ts:1914

___

### `Optional` isDistinct

• **isDistinct**? : *boolean*

Defined in src/ast.ts:1910

___

### `Optional` joins

• **joins**? : *[Join](_ast_.join.md)[]*

*Inherited from [Fromable](_ast_.fromable.md).[joins](_ast_.fromable.md#optional-joins)*

Defined in src/ast.ts:1838

___

### `Optional` limits

• **limits**? : *number*

Defined in src/ast.ts:1909

___

### `Optional` offsets

• **offsets**? : *number*

Defined in src/ast.ts:1908

___

### `Optional` sorts

• **sorts**? : *[SortInfo](_ast_.sortinfo.md)[]*

Defined in src/ast.ts:1912

___

### `Optional` tables

• **tables**? : *[Identifier](_ast_.identifier.md)[]*

*Inherited from [Fromable](_ast_.fromable.md).[tables](_ast_.fromable.md#optional-tables)*

Defined in src/ast.ts:1837

___

### `Optional` tops

• **tops**? : *number*

Defined in src/ast.ts:1907

___

### `Readonly` type

• **type**: *[SQL_SYMBOLE](../enums/_constants_.sql_symbole.md)*

*Inherited from [AST](_ast_.ast.md).[type](_ast_.ast.md#readonly-type)*

Defined in src/ast.ts:73

___

### `Optional` unions

• **unions**? : *[Union](_ast_.union.md)*

Defined in src/ast.ts:1915

## Methods

###  as

▸ **as**(`alias`: string): *[Identifier](_ast_.identifier.md)‹› & object*

Defined in src/ast.ts:2045

将本次查询，转换为Table行集

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`alias` | string |   |

**Returns:** *[Identifier](_ast_.identifier.md)‹› & object*

___

###  distinct

▸ **distinct**(): *this*

Defined in src/ast.ts:1943

去除重复的

**Returns:** *this*

___

###  from

▸ **from**(...`tables`: [UnsureIdentifier](../modules/_ast_.md#unsureidentifier)[]): *this*

*Inherited from [Fromable](_ast_.fromable.md).[from](_ast_.fromable.md#from)*

Defined in src/ast.ts:1845

从表中查询，可以查询多表

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`...tables` | [UnsureIdentifier](../modules/_ast_.md#unsureidentifier)[] |   |

**Returns:** *this*

___

###  groupBy

▸ **groupBy**(...`groups`: [UnsureExpression](../modules/_ast_.md#unsureexpression)[]): *this*

Defined in src/ast.ts:1984

分组查询

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`...groups` | [UnsureExpression](../modules/_ast_.md#unsureexpression)[] |   |

**Returns:** *this*

___

###  having

▸ **having**(`condition`: [UnsureCondition](../modules/_ast_.md#unsurecondition)): *this*

Defined in src/ast.ts:1993

Having 子句

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`condition` | [UnsureCondition](../modules/_ast_.md#unsurecondition) |   |

**Returns:** *this*

___

###  join

▸ **join**(`table`: [UnsureIdentifier](../modules/_ast_.md#unsureidentifier), `on`: [Condition](_ast_.condition.md), `left`: boolean): *this*

*Inherited from [Fromable](_ast_.fromable.md).[join](_ast_.fromable.md#join)*

Defined in src/ast.ts:1858

表联接

**`memberof`** Select

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`table` | [UnsureIdentifier](../modules/_ast_.md#unsureidentifier) | - |
`on` | [Condition](_ast_.condition.md) | - |
`left` | boolean | false |

**Returns:** *this*

___

###  leftJoin

▸ **leftJoin**(`table`: [UnsureIdentifier](../modules/_ast_.md#unsureidentifier), `on`: [Condition](_ast_.condition.md)): *this*

*Inherited from [Fromable](_ast_.fromable.md).[leftJoin](_ast_.fromable.md#leftjoin)*

Defined in src/ast.ts:1874

左联接

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`table` | [UnsureIdentifier](../modules/_ast_.md#unsureidentifier) | - |
`on` | [Condition](_ast_.condition.md) |   |

**Returns:** *this*

___

###  limit

▸ **limit**(`rows`: number): *this*

Defined in src/ast.ts:2016

限定数

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`rows` | number |   |

**Returns:** *this*

___

###  offset

▸ **offset**(`rows`: number): *this*

Defined in src/ast.ts:2007

偏移数

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`rows` | number |   |

**Returns:** *this*

___

###  orderBy

▸ **orderBy**(`sorts`: [SortObject](../interfaces/_ast_.sortobject.md)): *this*

Defined in src/ast.ts:1962

order by 排序

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`sorts` | [SortObject](../interfaces/_ast_.sortobject.md) | 排序信息  |

**Returns:** *this*

▸ **orderBy**(...`sorts`: string | number | bigint | false | true | [Expression](_ast_.expression.md)‹› | Date | Buffer‹› | [SortInfo](_ast_.sortinfo.md)‹›[]): *this*

Defined in src/ast.ts:1963

**Parameters:**

Name | Type |
------ | ------ |
`...sorts` | string &#124; number &#124; bigint &#124; false &#124; true &#124; [Expression](_ast_.expression.md)‹› &#124; Date &#124; Buffer‹› &#124; [SortInfo](_ast_.sortinfo.md)‹›[] |

**Returns:** *this*

___

###  quoted

▸ **quoted**(): *[Bracket](_ast_.bracket.md)‹this›*

Defined in src/ast.ts:2037

将本SELECT返回表达式

**Returns:** *[Bracket](_ast_.bracket.md)‹this›*

返回一个加()后的SELECT语句

___

###  top

▸ **top**(`rows`: number): *this*

Defined in src/ast.ts:1952

TOP

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`rows` | number | 行数  |

**Returns:** *this*

___

###  union

▸ **union**(`select`: [SelectExpression](../modules/_ast_.md#selectexpression), `all`: boolean): *void*

Defined in src/ast.ts:2025

合并查询

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`select` | [SelectExpression](../modules/_ast_.md#selectexpression) | - |
`all` | boolean | false |

**Returns:** *void*

___

###  unionAll

▸ **unionAll**(`select`: [SelectExpression](../modules/_ast_.md#selectexpression)): *void*

Defined in src/ast.ts:2029

**Parameters:**

Name | Type |
------ | ------ |
`select` | [SelectExpression](../modules/_ast_.md#selectexpression) |

**Returns:** *void*

___

###  where

▸ **where**(`condition`: [UnsureCondition](../modules/_ast_.md#unsurecondition)): *this*

*Inherited from [Fromable](_ast_.fromable.md).[where](_ast_.fromable.md#where)*

Defined in src/ast.ts:1882

where查询条件

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`condition` | [UnsureCondition](../modules/_ast_.md#unsurecondition) |   |

**Returns:** *this*

___

### `Static` assign

▸ **assign**(`left`: [Expression](_ast_.expression.md), `right`: [UnsureExpression](../modules/_ast_.md#unsureexpression)): *[Assignment](_ast_.assignment.md)‹›*

*Inherited from [Statement](_ast_.statement.md).[assign](_ast_.statement.md#static-assign)*

Defined in src/ast.ts:1365

赋值语句

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`left` | [Expression](_ast_.expression.md) | 左值 |
`right` | [UnsureExpression](../modules/_ast_.md#unsureexpression) | 右值  |

**Returns:** *[Assignment](_ast_.assignment.md)‹›*

___

### `Static` bracket

▸ **bracket**‹**T**›(`context`: T): *[Bracket](_ast_.bracket.md)‹T›*

*Inherited from [AST](_ast_.ast.md).[bracket](_ast_.ast.md#static-bracket)*

Defined in src/ast.ts:75

**Type parameters:**

▪ **T**: *[AST](_ast_.ast.md)*

**Parameters:**

Name | Type |
------ | ------ |
`context` | T |

**Returns:** *[Bracket](_ast_.bracket.md)‹T›*

___

### `Static` case

▸ **case**(`expr?`: [UnsureExpression](../modules/_ast_.md#unsureexpression)): *[Case](_ast_.case.md)‹›*

*Inherited from [Statement](_ast_.statement.md).[case](_ast_.statement.md#static-case)*

Defined in src/ast.ts:1386

**Parameters:**

Name | Type |
------ | ------ |
`expr?` | [UnsureExpression](../modules/_ast_.md#unsureexpression) |

**Returns:** *[Case](_ast_.case.md)‹›*

___

### `Static` declare

▸ **declare**(...`declares`: [VariantDeclare](_ast_.variantdeclare.md)[]): *[Declare](_ast_.declare.md)*

*Inherited from [Statement](_ast_.statement.md).[declare](_ast_.statement.md#static-declare)*

Defined in src/ast.ts:1373

变量声明

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`...declares` | [VariantDeclare](_ast_.variantdeclare.md)[] | 变量列表  |

**Returns:** *[Declare](_ast_.declare.md)*

___

### `Static` delete

▸ **delete**(`table`: [UnsureIdentifier](../modules/_ast_.md#unsureidentifier)): *[Delete](_ast_.delete.md)‹›*

*Inherited from [Statement](_ast_.statement.md).[delete](_ast_.statement.md#static-delete)*

Defined in src/ast.ts:1325

删除一个表格

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`table` | [UnsureIdentifier](../modules/_ast_.md#unsureidentifier) | 表格  |

**Returns:** *[Delete](_ast_.delete.md)‹›*

___

### `Static` exec

▸ **exec**(`proc`: [UnsureIdentifier](../modules/_ast_.md#unsureidentifier), `params`: [UnsureExpression](../modules/_ast_.md#unsureexpression)[]): *[Execute](_ast_.execute.md)*

*Inherited from [Statement](_ast_.statement.md).[exec](_ast_.statement.md#static-exec)*

Defined in src/ast.ts:1354

执行一个存储过程，execute的别名

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`proc` | [UnsureIdentifier](../modules/_ast_.md#unsureidentifier) | 存储过程 |
`params` | [UnsureExpression](../modules/_ast_.md#unsureexpression)[] | 参数  |

**Returns:** *[Execute](_ast_.execute.md)*

▸ **exec**(`proc`: [UnsureIdentifier](../modules/_ast_.md#unsureidentifier), `params`: [Parameter](_ast_.parameter.md)[]): *[Execute](_ast_.execute.md)*

*Inherited from [Statement](_ast_.statement.md).[exec](_ast_.statement.md#static-exec)*

Defined in src/ast.ts:1355

**Parameters:**

Name | Type |
------ | ------ |
`proc` | [UnsureIdentifier](../modules/_ast_.md#unsureidentifier) |
`params` | [Parameter](_ast_.parameter.md)[] |

**Returns:** *[Execute](_ast_.execute.md)*

___

### `Static` execute

▸ **execute**(`proc`: [UnsureIdentifier](../modules/_ast_.md#unsureidentifier), `params?`: [UnsureExpression](../modules/_ast_.md#unsureexpression)[]): *[Execute](_ast_.execute.md)*

*Inherited from [Statement](_ast_.statement.md).[execute](_ast_.statement.md#static-execute)*

Defined in src/ast.ts:1343

执行一个存储过程

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`proc` | [UnsureIdentifier](../modules/_ast_.md#unsureidentifier) | - |
`params?` | [UnsureExpression](../modules/_ast_.md#unsureexpression)[] |   |

**Returns:** *[Execute](_ast_.execute.md)*

▸ **execute**(`proc`: [UnsureIdentifier](../modules/_ast_.md#unsureidentifier), `params?`: [Parameter](_ast_.parameter.md)[]): *[Execute](_ast_.execute.md)*

*Inherited from [Statement](_ast_.statement.md).[execute](_ast_.statement.md#static-execute)*

Defined in src/ast.ts:1344

**Parameters:**

Name | Type |
------ | ------ |
`proc` | [UnsureIdentifier](../modules/_ast_.md#unsureidentifier) |
`params?` | [Parameter](_ast_.parameter.md)[] |

**Returns:** *[Execute](_ast_.execute.md)*

___

### `Static` insert

▸ **insert**(`table`: [UnsureIdentifier](../modules/_ast_.md#unsureidentifier), `fields?`: [UnsureIdentifier](../modules/_ast_.md#unsureidentifier)[]): *[Insert](_ast_.insert.md)‹›*

*Inherited from [Statement](_ast_.statement.md).[insert](_ast_.statement.md#static-insert)*

Defined in src/ast.ts:1309

插入至表,into的别名

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`table` | [UnsureIdentifier](../modules/_ast_.md#unsureidentifier) | - |
`fields?` | [UnsureIdentifier](../modules/_ast_.md#unsureidentifier)[] |   |

**Returns:** *[Insert](_ast_.insert.md)‹›*

___

### `Static` select

▸ **select**(`columns`: [KeyValueObject](../interfaces/_ast_.keyvalueobject.md)): *[Select](_ast_.select.md)*

*Inherited from [Statement](_ast_.statement.md).[select](_ast_.statement.md#static-select)*

Defined in src/ast.ts:1332

选择列

**Parameters:**

Name | Type |
------ | ------ |
`columns` | [KeyValueObject](../interfaces/_ast_.keyvalueobject.md) |

**Returns:** *[Select](_ast_.select.md)*

▸ **select**(...`columns`: [UnsureExpression](../modules/_ast_.md#unsureexpression)[]): *[Select](_ast_.select.md)*

*Inherited from [Statement](_ast_.statement.md).[select](_ast_.statement.md#static-select)*

Defined in src/ast.ts:1333

**Parameters:**

Name | Type |
------ | ------ |
`...columns` | [UnsureExpression](../modules/_ast_.md#unsureexpression)[] |

**Returns:** *[Select](_ast_.select.md)*

___

### `Static` update

▸ **update**(`table`: [UnsureIdentifier](../modules/_ast_.md#unsureidentifier)): *[Update](_ast_.update.md)‹›*

*Inherited from [Statement](_ast_.statement.md).[update](_ast_.statement.md#static-update)*

Defined in src/ast.ts:1317

更新一个表格

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`table` | [UnsureIdentifier](../modules/_ast_.md#unsureidentifier) |   |

**Returns:** *[Update](_ast_.update.md)‹›*

___

### `Static` when

▸ **when**(`expr`: [UnsureExpression](../modules/_ast_.md#unsureexpression), `value?`: [UnsureExpression](../modules/_ast_.md#unsureexpression)): *[When](_ast_.when.md)‹›*

*Inherited from [Statement](_ast_.statement.md).[when](_ast_.statement.md#static-when)*

Defined in src/ast.ts:1382

WHEN 语句块

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`expr` | [UnsureExpression](../modules/_ast_.md#unsureexpression) | - |
`value?` | [UnsureExpression](../modules/_ast_.md#unsureexpression) |   |

**Returns:** *[When](_ast_.when.md)‹›*
