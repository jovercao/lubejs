[lubejs](../README.md) › [Globals](../globals.md) › ["ast"](../modules/_ast_.md) › [Select](_ast_.select.md)

# Class: Select ‹**T, T**›

SELECT查询

## Type parameters

▪ **T**: *[RowObject](../modules/_ast_.md#rowobject)*

▪ **T**: *[RowObject](../modules/_ast_.md#rowobject)*

## Hierarchy

  ↳ [Fromable](_ast_.fromable.md)

  ↳ **Select**

## Index

### Constructors

* [constructor](_ast_.select.md#constructor)

### Properties

* [$columns](_ast_.select.md#columns)
* [$distinct](_ast_.select.md#optional-distinct)
* [$froms](_ast_.select.md#optional-froms)
* [$groups](_ast_.select.md#optional-groups)
* [$having](_ast_.select.md#optional-having)
* [$joins](_ast_.select.md#optional-joins)
* [$limit](_ast_.select.md#optional-limit)
* [$offset](_ast_.select.md#optional-offset)
* [$sorts](_ast_.select.md#optional-sorts)
* [$top](_ast_.select.md#optional-top)
* [$type](_ast_.select.md#readonly-type)
* [$union](_ast_.select.md#optional-union)
* [$where](_ast_.select.md#optional-where)
* [$with](_ast_.select.md#with)

### Methods

* [as](_ast_.select.md#as)
* [asColumn](_ast_.select.md#ascolumn)
* [asValue](_ast_.select.md#asvalue)
* [clone](_ast_.select.md#clone)
* [distinct](_ast_.select.md#distinct)
* [from](_ast_.select.md#from)
* [groupBy](_ast_.select.md#groupby)
* [having](_ast_.select.md#having)
* [join](_ast_.select.md#join)
* [leftJoin](_ast_.select.md#leftjoin)
* [limit](_ast_.select.md#limit)
* [offset](_ast_.select.md#offset)
* [orderBy](_ast_.select.md#orderby)
* [top](_ast_.select.md#top)
* [union](_ast_.select.md#union)
* [unionAll](_ast_.select.md#unionall)
* [where](_ast_.select.md#where)
* [assign](_ast_.select.md#static-assign)
* [case](_ast_.select.md#static-case)
* [declare](_ast_.select.md#static-declare)
* [delete](_ast_.select.md#static-delete)
* [execute](_ast_.select.md#static-execute)
* [insert](_ast_.select.md#static-insert)
* [invoke](_ast_.select.md#static-invoke)
* [invokeScalarFunction](_ast_.select.md#static-invokescalarfunction)
* [invokeTableFunction](_ast_.select.md#static-invoketablefunction)
* [makeFunc](_ast_.select.md#static-makefunc)
* [makeProc](_ast_.select.md#static-makeproc)
* [raw](_ast_.select.md#static-raw)
* [select](_ast_.select.md#static-select)
* [union](_ast_.select.md#static-union)
* [unionAll](_ast_.select.md#static-unionall)
* [update](_ast_.select.md#static-update)
* [when](_ast_.select.md#static-when)
* [with](_ast_.select.md#static-with)

## Constructors

###  constructor

\+ **new Select**(`results?`: [InputObject](../modules/_ast_.md#inputobject)‹T›): *[Select](_ast_.select.md)*

Defined in ast.ts:3423

**Parameters:**

Name | Type |
------ | ------ |
`results?` | [InputObject](../modules/_ast_.md#inputobject)‹T› |

**Returns:** *[Select](_ast_.select.md)*

\+ **new Select**(...`columns`: string | number | bigint | false | true | ArrayBuffer | SharedArrayBuffer | Date | [Expression](_ast_.expression.md)‹string | number | bigint | false | true | ArrayBuffer | SharedArrayBuffer | Date› | [SelectColumn](_ast_.selectcolumn.md)‹string | number | bigint | false | true | ArrayBuffer | SharedArrayBuffer | Date, string› | [Star](_ast_.star.md)‹any›[]): *[Select](_ast_.select.md)*

Defined in ast.ts:3425

**Parameters:**

Name | Type |
------ | ------ |
`...columns` | string &#124; number &#124; bigint &#124; false &#124; true &#124; ArrayBuffer &#124; SharedArrayBuffer &#124; Date &#124; [Expression](_ast_.expression.md)‹string &#124; number &#124; bigint &#124; false &#124; true &#124; ArrayBuffer &#124; SharedArrayBuffer &#124; Date› &#124; [SelectColumn](_ast_.selectcolumn.md)‹string &#124; number &#124; bigint &#124; false &#124; true &#124; ArrayBuffer &#124; SharedArrayBuffer &#124; Date, string› &#124; [Star](_ast_.star.md)‹any›[] |

**Returns:** *[Select](_ast_.select.md)*

## Properties

###  $columns

• **$columns**: *[Expression](_ast_.expression.md)‹string | number | bigint | false | true | ArrayBuffer | SharedArrayBuffer | Date› | [SelectColumn](_ast_.selectcolumn.md)‹string | number | bigint | false | true | ArrayBuffer | SharedArrayBuffer | Date, string› | [Star](_ast_.star.md)‹any›[]*

Defined in ast.ts:3417

___

### `Optional` $distinct

• **$distinct**? : *boolean*

Defined in ast.ts:3416

___

### `Optional` $froms

• **$froms**? : *[Rowset](_ast_.rowset.md)‹any›[]*

*Inherited from [Fromable](_ast_.fromable.md).[$froms](_ast_.fromable.md#optional-froms)*

Defined in ast.ts:3329

___

### `Optional` $groups

• **$groups**? : *[Expression](_ast_.expression.md)‹any›[]*

Defined in ast.ts:3419

___

### `Optional` $having

• **$having**? : *[Condition](_ast_.condition.md)*

Defined in ast.ts:3420

___

### `Optional` $joins

• **$joins**? : *[Join](_ast_.join.md)[]*

*Inherited from [Fromable](_ast_.fromable.md).[$joins](_ast_.fromable.md#optional-joins)*

Defined in ast.ts:3330

___

### `Optional` $limit

• **$limit**? : *number*

Defined in ast.ts:3415

___

### `Optional` $offset

• **$offset**? : *number*

Defined in ast.ts:3414

___

### `Optional` $sorts

• **$sorts**? : *[SortInfo](_ast_.sortinfo.md)[]*

Defined in ast.ts:3418

___

### `Optional` $top

• **$top**? : *number*

Defined in ast.ts:3413

___

### `Readonly` $type

• **$type**: *[SELECT](../enums/_constants_.sql_symbole.md#select)* = SQL_SYMBOLE.SELECT

*Overrides [AST](_ast_.ast.md).[$type](_ast_.ast.md#readonly-type)*

Defined in ast.ts:3423

___

### `Optional` $union

• **$union**? : *[Union](_ast_.union.md)‹T›*

Defined in ast.ts:3421

___

### `Optional` $where

• **$where**? : *[Condition](_ast_.condition.md)*

*Inherited from [Fromable](_ast_.fromable.md).[$where](_ast_.fromable.md#optional-where)*

Defined in ast.ts:3331

___

###  $with

• **$with**: *[With](_ast_.with.md)*

*Inherited from [CrudStatement](_ast_.crudstatement.md).[$with](_ast_.crudstatement.md#with)*

Defined in ast.ts:3118

## Methods

###  as

▸ **as**‹**TAlias**›(`alias`: TAlias): *[Proxied](../modules/_ast_.md#proxied)‹[NamedSelect](_ast_.namedselect.md)‹T››*

Defined in ast.ts:3594

将本次查询，转换为Table行集

**Type parameters:**

▪ **TAlias**: *string*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`alias` | TAlias |   |

**Returns:** *[Proxied](../modules/_ast_.md#proxied)‹[NamedSelect](_ast_.namedselect.md)‹T››*

___

###  asColumn

▸ **asColumn**‹**N**›(`name`: N): *[SelectColumn](_ast_.selectcolumn.md)‹T[Exclude<{ [P in keyof T]: T[P] extends ScalarType ? P : never; }[keyof T], number | symbol>] extends string | number | bigint | false | true | ArrayBuffer | SharedArrayBuffer | Date ? T[Exclude<{ [P in keyof T]: T[P] extends ScalarType ? P : never; }[keyof T], number | symbol>] : never, N›*

Defined in ast.ts:3605

**Type parameters:**

▪ **N**: *string*

**Parameters:**

Name | Type |
------ | ------ |
`name` | N |

**Returns:** *[SelectColumn](_ast_.selectcolumn.md)‹T[Exclude<{ [P in keyof T]: T[P] extends ScalarType ? P : never; }[keyof T], number | symbol>] extends string | number | bigint | false | true | ArrayBuffer | SharedArrayBuffer | Date ? T[Exclude<{ [P in keyof T]: T[P] extends ScalarType ? P : never; }[keyof T], number | symbol>] : never, N›*

___

###  asValue

▸ **asValue**‹**V**›(): *[ValuedSelect](_ast_.valuedselect.md)‹V›*

Defined in ast.ts:3601

将本次查询结果转换为值

**Type parameters:**

▪ **V**: *[ScalarType](../modules/_types_.md#scalartype)*

**Returns:** *[ValuedSelect](_ast_.valuedselect.md)‹V›*

___

###  clone

▸ **clone**(): *this*

*Inherited from [AST](_ast_.ast.md).[clone](_ast_.ast.md#clone)*

Defined in ast.ts:285

克隆自身

**Returns:** *this*

___

###  distinct

▸ **distinct**(): *this*

Defined in ast.ts:3461

去除重复的

**Returns:** *this*

___

###  from

▸ **from**(...`tables`: string | [string] | [string, string] | [string, string, string] | [string, string, string, string] | [string, string, string, string, string] | [NamedSelect](_ast_.namedselect.md)‹any, string› | [TableFuncInvoke](_ast_.tablefuncinvoke.md)‹any› | [TableVariant](_ast_.tablevariant.md)‹any, string› | [Rowset](_ast_.rowset.md)‹any› | [Rowset](_ast_.rowset.md)‹any› & object | [Table](_ast_.table.md)‹any, string› | [Table](_ast_.table.md)‹any, string› & object | [NamedSelect](_ast_.namedselect.md)‹any, string› & object | [TableFuncInvoke](_ast_.tablefuncinvoke.md)‹any› & object | [TableVariant](_ast_.tablevariant.md)‹any, string› & object[]): *this*

*Inherited from [Fromable](_ast_.fromable.md).[from](_ast_.fromable.md#from)*

Defined in ast.ts:3337

从表中查询，可以查询多表

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`...tables` | string &#124; [string] &#124; [string, string] &#124; [string, string, string] &#124; [string, string, string, string] &#124; [string, string, string, string, string] &#124; [NamedSelect](_ast_.namedselect.md)‹any, string› &#124; [TableFuncInvoke](_ast_.tablefuncinvoke.md)‹any› &#124; [TableVariant](_ast_.tablevariant.md)‹any, string› &#124; [Rowset](_ast_.rowset.md)‹any› &#124; [Rowset](_ast_.rowset.md)‹any› & object &#124; [Table](_ast_.table.md)‹any, string› &#124; [Table](_ast_.table.md)‹any, string› & object &#124; [NamedSelect](_ast_.namedselect.md)‹any, string› & object &#124; [TableFuncInvoke](_ast_.tablefuncinvoke.md)‹any› & object &#124; [TableVariant](_ast_.tablevariant.md)‹any, string› & object[] |   |

**Returns:** *this*

___

###  groupBy

▸ **groupBy**(...`groups`: [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹[ScalarType](../modules/_types_.md#scalartype)›[]): *this*

Defined in ast.ts:3534

分组查询

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`...groups` | [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹[ScalarType](../modules/_types_.md#scalartype)›[] |   |

**Returns:** *this*

___

###  having

▸ **having**(`condition`: [CompatibleCondition](../modules/_ast_.md#compatiblecondition)‹T›): *this*

Defined in ast.ts:3543

Having 子句

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`condition` | [CompatibleCondition](../modules/_ast_.md#compatiblecondition)‹T› |   |

**Returns:** *this*

___

###  join

▸ **join**‹**T**›(`table`: [Name](../modules/_ast_.md#name)‹string› | [CompatibleRowset](../modules/_ast_.md#compatiblerowset)‹T›, `on`: [Condition](_ast_.condition.md), `left?`: boolean): *this*

*Inherited from [Fromable](_ast_.fromable.md).[join](_ast_.fromable.md#join)*

Defined in ast.ts:3356

表联接

**`memberof`** Select

**Type parameters:**

▪ **T**: *[RowObject](../modules/_ast_.md#rowobject)*

**Parameters:**

Name | Type |
------ | ------ |
`table` | [Name](../modules/_ast_.md#name)‹string› &#124; [CompatibleRowset](../modules/_ast_.md#compatiblerowset)‹T› |
`on` | [Condition](_ast_.condition.md) |
`left?` | boolean |

**Returns:** *this*

___

###  leftJoin

▸ **leftJoin**‹**T**›(`table`: [Name](../modules/_ast_.md#name)‹string› | [CompatibleRowset](../modules/_ast_.md#compatiblerowset)‹T›, `on`: [Condition](_ast_.condition.md)): *this*

*Inherited from [Fromable](_ast_.fromable.md).[leftJoin](_ast_.fromable.md#leftjoin)*

Defined in ast.ts:3374

左联接

**Type parameters:**

▪ **T**: *[RowObject](../modules/_ast_.md#rowobject)*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`table` | [Name](../modules/_ast_.md#name)‹string› &#124; [CompatibleRowset](../modules/_ast_.md#compatiblerowset)‹T› | - |
`on` | [Condition](_ast_.condition.md) |   |

**Returns:** *this*

___

###  limit

▸ **limit**(`rows`: number): *this*

Defined in ast.ts:3566

限定数

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`rows` | number |   |

**Returns:** *this*

___

###  offset

▸ **offset**(`rows`: number): *this*

Defined in ast.ts:3557

偏移数

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`rows` | number |   |

**Returns:** *this*

___

###  orderBy

▸ **orderBy**(`sorts`: [SortObject](../modules/_ast_.md#sortobject)‹T› | string | number | bigint | false | true | ArrayBuffer | SharedArrayBuffer | Date | [Expression](_ast_.expression.md)‹string | number | bigint | false | true | ArrayBuffer | SharedArrayBuffer | Date› | [SortInfo](_ast_.sortinfo.md)‹› | [string | number | bigint | false | true | ArrayBuffer | SharedArrayBuffer | Date | [Expression](_ast_.expression.md)‹string | number | bigint | false | true | ArrayBuffer | SharedArrayBuffer | Date›, [SORT_DIRECTION](../enums/_constants_.sort_direction.md)][]): *this*

Defined in ast.ts:3480

order by 排序

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`sorts` | [SortObject](../modules/_ast_.md#sortobject)‹T› &#124; string &#124; number &#124; bigint &#124; false &#124; true &#124; ArrayBuffer &#124; SharedArrayBuffer &#124; Date &#124; [Expression](_ast_.expression.md)‹string &#124; number &#124; bigint &#124; false &#124; true &#124; ArrayBuffer &#124; SharedArrayBuffer &#124; Date› &#124; [SortInfo](_ast_.sortinfo.md)‹› &#124; [string &#124; number &#124; bigint &#124; false &#124; true &#124; ArrayBuffer &#124; SharedArrayBuffer &#124; Date &#124; [Expression](_ast_.expression.md)‹string &#124; number &#124; bigint &#124; false &#124; true &#124; ArrayBuffer &#124; SharedArrayBuffer &#124; Date›, [SORT_DIRECTION](../enums/_constants_.sort_direction.md)][] | 排序信息  |

**Returns:** *this*

▸ **orderBy**(...`sorts`: string | number | bigint | false | true | ArrayBuffer | SharedArrayBuffer | Date | [Expression](_ast_.expression.md)‹string | number | bigint | false | true | ArrayBuffer | SharedArrayBuffer | Date› | [SortInfo](_ast_.sortinfo.md)‹› | [string | number | bigint | false | true | ArrayBuffer | SharedArrayBuffer | Date | [Expression](_ast_.expression.md)‹string | number | bigint | false | true | ArrayBuffer | SharedArrayBuffer | Date›, [SORT_DIRECTION](../enums/_constants_.sort_direction.md)][]): *this*

Defined in ast.ts:3489

**Parameters:**

Name | Type |
------ | ------ |
`...sorts` | string &#124; number &#124; bigint &#124; false &#124; true &#124; ArrayBuffer &#124; SharedArrayBuffer &#124; Date &#124; [Expression](_ast_.expression.md)‹string &#124; number &#124; bigint &#124; false &#124; true &#124; ArrayBuffer &#124; SharedArrayBuffer &#124; Date› &#124; [SortInfo](_ast_.sortinfo.md)‹› &#124; [string &#124; number &#124; bigint &#124; false &#124; true &#124; ArrayBuffer &#124; SharedArrayBuffer &#124; Date &#124; [Expression](_ast_.expression.md)‹string &#124; number &#124; bigint &#124; false &#124; true &#124; ArrayBuffer &#124; SharedArrayBuffer &#124; Date›, [SORT_DIRECTION](../enums/_constants_.sort_direction.md)][] |

**Returns:** *this*

▸ **orderBy**(`sorts`: [CompatibleSortInfo](../modules/_ast_.md#compatiblesortinfo)): *this*

Defined in ast.ts:3496

**Parameters:**

Name | Type |
------ | ------ |
`sorts` | [CompatibleSortInfo](../modules/_ast_.md#compatiblesortinfo) |

**Returns:** *this*

___

###  top

▸ **top**(`rows`: number): *this*

Defined in ast.ts:3470

TOP

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`rows` | number | 行数  |

**Returns:** *this*

___

###  union

▸ **union**(`select`: [Select](_ast_.select.md)‹T›, `all`: boolean): *this*

Defined in ast.ts:3575

合并查询

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`select` | [Select](_ast_.select.md)‹T› | - |
`all` | boolean | false |

**Returns:** *this*

___

###  unionAll

▸ **unionAll**(`select`: [Select](_ast_.select.md)‹T›): *this*

Defined in ast.ts:3586

**Parameters:**

Name | Type |
------ | ------ |
`select` | [Select](_ast_.select.md)‹T› |

**Returns:** *this*

___

###  where

▸ **where**(`condition`: [CompatibleCondition](../modules/_ast_.md#compatiblecondition)‹T›): *this*

*Inherited from [Fromable](_ast_.fromable.md).[where](_ast_.fromable.md#where)*

Defined in ast.ts:3385

where查询条件

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`condition` | [CompatibleCondition](../modules/_ast_.md#compatiblecondition)‹T› |   |

**Returns:** *this*

___

### `Static` assign

▸ **assign**‹**T**›(`left`: [Assignable](_ast_.assignable.md)‹T›, `right`: [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹T›): *[Assignment](_ast_.assignment.md)‹T›*

*Inherited from [Statement](_ast_.statement.md).[assign](_ast_.statement.md#static-assign)*

Defined in ast.ts:2906

赋值语句

**Type parameters:**

▪ **T**: *[ScalarType](../modules/_types_.md#scalartype)*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`left` | [Assignable](_ast_.assignable.md)‹T› | 左值 |
`right` | [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹T› | 右值  |

**Returns:** *[Assignment](_ast_.assignment.md)‹T›*

___

### `Static` case

▸ **case**‹**T**›(`expr?`: [CompatibleExpression](../modules/_ast_.md#compatibleexpression)): *[Case](_ast_.case.md)‹T›*

*Inherited from [Statement](_ast_.statement.md).[case](_ast_.statement.md#static-case)*

Defined in ast.ts:2933

**Type parameters:**

▪ **T**: *[ScalarType](../modules/_types_.md#scalartype)*

**Parameters:**

Name | Type |
------ | ------ |
`expr?` | [CompatibleExpression](../modules/_ast_.md#compatibleexpression) |

**Returns:** *[Case](_ast_.case.md)‹T›*

___

### `Static` declare

▸ **declare**(...`declares`: [VariantDeclare](_ast_.variantdeclare.md)[]): *[Declare](_ast_.declare.md)*

*Inherited from [Statement](_ast_.statement.md).[declare](_ast_.statement.md#static-declare)*

Defined in ast.ts:2917

变量声明

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`...declares` | [VariantDeclare](_ast_.variantdeclare.md)[] | 变量列表  |

**Returns:** *[Declare](_ast_.declare.md)*

___

### `Static` delete

▸ **delete**‹**T**›(`table`: [CompatibleTable](../modules/_ast_.md#compatibletable)‹T, string›): *[Delete](_ast_.delete.md)‹T›*

*Inherited from [Statement](_ast_.statement.md).[delete](_ast_.statement.md#static-delete)*

Defined in ast.ts:2630

删除一个表格

**Type parameters:**

▪ **T**: *[RowObject](../modules/_ast_.md#rowobject)*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`table` | [CompatibleTable](../modules/_ast_.md#compatibletable)‹T, string› | 表格  |

**Returns:** *[Delete](_ast_.delete.md)‹T›*

___

### `Static` execute

▸ **execute**‹**R**, **O**›(`proc`: [Name](../modules/_ast_.md#name)‹string› | [Procedure](_ast_.procedure.md)‹R, O, string›, `params?`: [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹[ScalarType](../modules/_types_.md#scalartype)›[]): *[Execute](_ast_.execute.md)‹R, O›*

*Inherited from [Statement](_ast_.statement.md).[execute](_ast_.statement.md#static-execute)*

Defined in ast.ts:2657

执行一个存储过程

**Type parameters:**

▪ **R**: *[ScalarType](../modules/_types_.md#scalartype)*

▪ **O**: *[RowObject](../modules/_ast_.md#rowobject)[]*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`proc` | [Name](../modules/_ast_.md#name)‹string› &#124; [Procedure](_ast_.procedure.md)‹R, O, string› | - |
`params?` | [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹[ScalarType](../modules/_types_.md#scalartype)›[] |   |

**Returns:** *[Execute](_ast_.execute.md)‹R, O›*

___

### `Static` insert

▸ **insert**‹**T**›(`table`: [CompatibleTable](../modules/_ast_.md#compatibletable)‹T, string›, `fields?`: [FieldsOf](../modules/_ast_.md#fieldsof)‹T›[] | [Field](_ast_.field.md)‹[ScalarType](../modules/_types_.md#scalartype), [FieldsOf](../modules/_ast_.md#fieldsof)‹T››[]): *[Insert](_ast_.insert.md)‹T›*

*Inherited from [Statement](_ast_.statement.md).[insert](_ast_.statement.md#static-insert)*

Defined in ast.ts:2609

插入至表,into的别名

**Type parameters:**

▪ **T**: *[RowObject](../modules/_ast_.md#rowobject)*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`table` | [CompatibleTable](../modules/_ast_.md#compatibletable)‹T, string› | - |
`fields?` | [FieldsOf](../modules/_ast_.md#fieldsof)‹T›[] &#124; [Field](_ast_.field.md)‹[ScalarType](../modules/_types_.md#scalartype), [FieldsOf](../modules/_ast_.md#fieldsof)‹T››[] |   |

**Returns:** *[Insert](_ast_.insert.md)‹T›*

___

### `Static` invoke

▸ **invoke**‹**T**›(`type`: "table", `name`: [Name](../modules/_ast_.md#name)‹string›, `builtIn?`: boolean): *function*

*Inherited from [Statement](_ast_.statement.md).[invoke](_ast_.statement.md#static-invoke)*

Defined in ast.ts:2965

**Type parameters:**

▪ **T**: *[RowObject](../modules/_ast_.md#rowobject)*

**Parameters:**

Name | Type |
------ | ------ |
`type` | "table" |
`name` | [Name](../modules/_ast_.md#name)‹string› |
`builtIn?` | boolean |

**Returns:** *function*

▸ (): *[ProxiedRowset](../modules/_ast_.md#proxiedrowset)‹T›*

▸ **invoke**‹**T**, **A1**›(`type`: "table", `name`: [Name](../modules/_ast_.md#name)‹string›, `builtIn?`: boolean): *function*

*Inherited from [Statement](_ast_.statement.md).[invoke](_ast_.statement.md#static-invoke)*

Defined in ast.ts:2970

**Type parameters:**

▪ **T**: *[RowObject](../modules/_ast_.md#rowobject)*

▪ **A1**: *[CompatibleExpression](../modules/_ast_.md#compatibleexpression)*

**Parameters:**

Name | Type |
------ | ------ |
`type` | "table" |
`name` | [Name](../modules/_ast_.md#name)‹string› |
`builtIn?` | boolean |

**Returns:** *function*

▸ (`arg1`: A1): *[ProxiedRowset](../modules/_ast_.md#proxiedrowset)‹T›*

**Parameters:**

Name | Type |
------ | ------ |
`arg1` | A1 |

▸ **invoke**‹**T**, **A1**, **A2**›(`type`: "table", `name`: [Name](../modules/_ast_.md#name)‹string›, `builtIn?`: boolean): *function*

*Inherited from [Statement](_ast_.statement.md).[invoke](_ast_.statement.md#static-invoke)*

Defined in ast.ts:2975

**Type parameters:**

▪ **T**: *[RowObject](../modules/_ast_.md#rowobject)*

▪ **A1**: *[CompatibleExpression](../modules/_ast_.md#compatibleexpression)*

▪ **A2**: *[CompatibleExpression](../modules/_ast_.md#compatibleexpression)*

**Parameters:**

Name | Type |
------ | ------ |
`type` | "table" |
`name` | [Name](../modules/_ast_.md#name)‹string› |
`builtIn?` | boolean |

**Returns:** *function*

▸ (`arg1`: A1, `arg2`: A2): *[ProxiedRowset](../modules/_ast_.md#proxiedrowset)‹T›*

**Parameters:**

Name | Type |
------ | ------ |
`arg1` | A1 |
`arg2` | A2 |

▸ **invoke**‹**T**, **A1**, **A2**, **A3**›(`type`: "table", `name`: [Name](../modules/_ast_.md#name)‹string›, `builtIn?`: boolean): *function*

*Inherited from [Statement](_ast_.statement.md).[invoke](_ast_.statement.md#static-invoke)*

Defined in ast.ts:2984

**Type parameters:**

▪ **T**: *[RowObject](../modules/_ast_.md#rowobject)*

▪ **A1**: *[CompatibleExpression](../modules/_ast_.md#compatibleexpression)*

▪ **A2**: *[CompatibleExpression](../modules/_ast_.md#compatibleexpression)*

▪ **A3**: *[CompatibleExpression](../modules/_ast_.md#compatibleexpression)*

**Parameters:**

Name | Type |
------ | ------ |
`type` | "table" |
`name` | [Name](../modules/_ast_.md#name)‹string› |
`builtIn?` | boolean |

**Returns:** *function*

▸ (`arg1`: A1, `arg2`: A2, `arg3`: A3): *[ProxiedRowset](../modules/_ast_.md#proxiedrowset)‹T›*

**Parameters:**

Name | Type |
------ | ------ |
`arg1` | A1 |
`arg2` | A2 |
`arg3` | A3 |

▸ **invoke**‹**T**, **A1**, **A2**, **A3**, **A4**›(`type`: "table", `name`: [Name](../modules/_ast_.md#name)‹string›, `builtIn?`: boolean): *function*

*Inherited from [Statement](_ast_.statement.md).[invoke](_ast_.statement.md#static-invoke)*

Defined in ast.ts:2994

**Type parameters:**

▪ **T**: *[RowObject](../modules/_ast_.md#rowobject)*

▪ **A1**: *[CompatibleExpression](../modules/_ast_.md#compatibleexpression)*

▪ **A2**: *[CompatibleExpression](../modules/_ast_.md#compatibleexpression)*

▪ **A3**: *[CompatibleExpression](../modules/_ast_.md#compatibleexpression)*

▪ **A4**: *[CompatibleExpression](../modules/_ast_.md#compatibleexpression)*

**Parameters:**

Name | Type |
------ | ------ |
`type` | "table" |
`name` | [Name](../modules/_ast_.md#name)‹string› |
`builtIn?` | boolean |

**Returns:** *function*

▸ (`arg1`: A1, `arg2`: A2, `arg3`: A3, `arg4`: A4): *[ProxiedRowset](../modules/_ast_.md#proxiedrowset)‹T›*

**Parameters:**

Name | Type |
------ | ------ |
`arg1` | A1 |
`arg2` | A2 |
`arg3` | A3 |
`arg4` | A4 |

▸ **invoke**‹**T**, **A1**, **A2**, **A3**, **A4**, **A5**›(`type`: "table", `name`: [Name](../modules/_ast_.md#name)‹string›, `builtIn?`: boolean): *function*

*Inherited from [Statement](_ast_.statement.md).[invoke](_ast_.statement.md#static-invoke)*

Defined in ast.ts:3005

**Type parameters:**

▪ **T**: *[RowObject](../modules/_ast_.md#rowobject)*

▪ **A1**: *[CompatibleExpression](../modules/_ast_.md#compatibleexpression)*

▪ **A2**: *[CompatibleExpression](../modules/_ast_.md#compatibleexpression)*

▪ **A3**: *[CompatibleExpression](../modules/_ast_.md#compatibleexpression)*

▪ **A4**: *[CompatibleExpression](../modules/_ast_.md#compatibleexpression)*

▪ **A5**: *[CompatibleExpression](../modules/_ast_.md#compatibleexpression)*

**Parameters:**

Name | Type |
------ | ------ |
`type` | "table" |
`name` | [Name](../modules/_ast_.md#name)‹string› |
`builtIn?` | boolean |

**Returns:** *function*

▸ (`arg1`: A1, `arg2`: A2, `arg3`: A3, `arg4`: A4, `arg5`: A5): *[ProxiedRowset](../modules/_ast_.md#proxiedrowset)‹T›*

**Parameters:**

Name | Type |
------ | ------ |
`arg1` | A1 |
`arg2` | A2 |
`arg3` | A3 |
`arg4` | A4 |
`arg5` | A5 |

▸ **invoke**(`type`: "table", `name`: [Name](../modules/_ast_.md#name)‹string›, `builtIn?`: boolean): *function*

*Inherited from [Statement](_ast_.statement.md).[invoke](_ast_.statement.md#static-invoke)*

Defined in ast.ts:3018

**Parameters:**

Name | Type |
------ | ------ |
`type` | "table" |
`name` | [Name](../modules/_ast_.md#name)‹string› |
`builtIn?` | boolean |

**Returns:** *function*

▸ (...`args`: [CompatibleExpression](../modules/_ast_.md#compatibleexpression)[]): *[ProxiedRowset](../modules/_ast_.md#proxiedrowset)‹any›*

**Parameters:**

Name | Type |
------ | ------ |
`...args` | [CompatibleExpression](../modules/_ast_.md#compatibleexpression)[] |

▸ **invoke**‹**T**›(`type`: "scalar", `name`: [Name](../modules/_ast_.md#name)‹string›, `builtIn?`: boolean): *function*

*Inherited from [Statement](_ast_.statement.md).[invoke](_ast_.statement.md#static-invoke)*

Defined in ast.ts:3024

**Type parameters:**

▪ **T**: *[ScalarType](../modules/_types_.md#scalartype)*

**Parameters:**

Name | Type |
------ | ------ |
`type` | "scalar" |
`name` | [Name](../modules/_ast_.md#name)‹string› |
`builtIn?` | boolean |

**Returns:** *function*

▸ (): *[Expression](_ast_.expression.md)‹T›*

▸ **invoke**‹**T**, **A1**›(`type`: "scalar", `name`: [Name](../modules/_ast_.md#name)‹string›, `builtIn?`: boolean): *function*

*Inherited from [Statement](_ast_.statement.md).[invoke](_ast_.statement.md#static-invoke)*

Defined in ast.ts:3029

**Type parameters:**

▪ **T**: *[ScalarType](../modules/_types_.md#scalartype)*

▪ **A1**: *[CompatibleExpression](../modules/_ast_.md#compatibleexpression)*

**Parameters:**

Name | Type |
------ | ------ |
`type` | "scalar" |
`name` | [Name](../modules/_ast_.md#name)‹string› |
`builtIn?` | boolean |

**Returns:** *function*

▸ (`arg1`: A1): *[Expression](_ast_.expression.md)‹T›*

**Parameters:**

Name | Type |
------ | ------ |
`arg1` | A1 |

▸ **invoke**‹**T**, **A1**, **A2**›(`type`: "scalar", `name`: [Name](../modules/_ast_.md#name)‹string›, `builtIn?`: boolean): *function*

*Inherited from [Statement](_ast_.statement.md).[invoke](_ast_.statement.md#static-invoke)*

Defined in ast.ts:3034

**Type parameters:**

▪ **T**: *[ScalarType](../modules/_types_.md#scalartype)*

▪ **A1**: *[CompatibleExpression](../modules/_ast_.md#compatibleexpression)*

▪ **A2**: *[CompatibleExpression](../modules/_ast_.md#compatibleexpression)*

**Parameters:**

Name | Type |
------ | ------ |
`type` | "scalar" |
`name` | [Name](../modules/_ast_.md#name)‹string› |
`builtIn?` | boolean |

**Returns:** *function*

▸ (`arg1`: A1, `arg2`: A2): *[Expression](_ast_.expression.md)‹T›*

**Parameters:**

Name | Type |
------ | ------ |
`arg1` | A1 |
`arg2` | A2 |

▸ **invoke**‹**T**, **A1**, **A2**, **A3**›(`type`: "scalar", `name`: [Name](../modules/_ast_.md#name)‹string›, `builtIn?`: boolean): *function*

*Inherited from [Statement](_ast_.statement.md).[invoke](_ast_.statement.md#static-invoke)*

Defined in ast.ts:3043

**Type parameters:**

▪ **T**: *[ScalarType](../modules/_types_.md#scalartype)*

▪ **A1**: *[CompatibleExpression](../modules/_ast_.md#compatibleexpression)*

▪ **A2**: *[CompatibleExpression](../modules/_ast_.md#compatibleexpression)*

▪ **A3**: *[CompatibleExpression](../modules/_ast_.md#compatibleexpression)*

**Parameters:**

Name | Type |
------ | ------ |
`type` | "scalar" |
`name` | [Name](../modules/_ast_.md#name)‹string› |
`builtIn?` | boolean |

**Returns:** *function*

▸ (`arg1`: A1, `arg2`: A2, `arg3`: A3): *[Expression](_ast_.expression.md)‹T›*

**Parameters:**

Name | Type |
------ | ------ |
`arg1` | A1 |
`arg2` | A2 |
`arg3` | A3 |

▸ **invoke**‹**T**, **A1**, **A2**, **A3**, **A4**›(`type`: "scalar", `name`: [Name](../modules/_ast_.md#name)‹string›, `builtIn?`: boolean): *function*

*Inherited from [Statement](_ast_.statement.md).[invoke](_ast_.statement.md#static-invoke)*

Defined in ast.ts:3053

**Type parameters:**

▪ **T**: *[ScalarType](../modules/_types_.md#scalartype)*

▪ **A1**: *[CompatibleExpression](../modules/_ast_.md#compatibleexpression)*

▪ **A2**: *[CompatibleExpression](../modules/_ast_.md#compatibleexpression)*

▪ **A3**: *[CompatibleExpression](../modules/_ast_.md#compatibleexpression)*

▪ **A4**: *[CompatibleExpression](../modules/_ast_.md#compatibleexpression)*

**Parameters:**

Name | Type |
------ | ------ |
`type` | "scalar" |
`name` | [Name](../modules/_ast_.md#name)‹string› |
`builtIn?` | boolean |

**Returns:** *function*

▸ (`arg1`: A1, `arg2`: A2, `arg3`: A3, `arg4`: A4): *[Expression](_ast_.expression.md)‹T›*

**Parameters:**

Name | Type |
------ | ------ |
`arg1` | A1 |
`arg2` | A2 |
`arg3` | A3 |
`arg4` | A4 |

▸ **invoke**‹**T**, **A1**, **A2**, **A3**, **A4**, **A5**›(`type`: "scalar", `name`: [Name](../modules/_ast_.md#name)‹string›, `builtIn?`: boolean): *function*

*Inherited from [Statement](_ast_.statement.md).[invoke](_ast_.statement.md#static-invoke)*

Defined in ast.ts:3064

**Type parameters:**

▪ **T**: *[ScalarType](../modules/_types_.md#scalartype)*

▪ **A1**: *[CompatibleExpression](../modules/_ast_.md#compatibleexpression)*

▪ **A2**: *[CompatibleExpression](../modules/_ast_.md#compatibleexpression)*

▪ **A3**: *[CompatibleExpression](../modules/_ast_.md#compatibleexpression)*

▪ **A4**: *[CompatibleExpression](../modules/_ast_.md#compatibleexpression)*

▪ **A5**: *[CompatibleExpression](../modules/_ast_.md#compatibleexpression)*

**Parameters:**

Name | Type |
------ | ------ |
`type` | "scalar" |
`name` | [Name](../modules/_ast_.md#name)‹string› |
`builtIn?` | boolean |

**Returns:** *function*

▸ (`arg1`: A1, `arg2`: A2, `arg3`: A3, `arg4`: A4, `arg5`: A5): *[Expression](_ast_.expression.md)‹T›*

**Parameters:**

Name | Type |
------ | ------ |
`arg1` | A1 |
`arg2` | A2 |
`arg3` | A3 |
`arg4` | A4 |
`arg5` | A5 |

▸ **invoke**(`type`: "scalar", `name`: [Name](../modules/_ast_.md#name)‹string›, `builtIn?`: boolean): *function*

*Inherited from [Statement](_ast_.statement.md).[invoke](_ast_.statement.md#static-invoke)*

Defined in ast.ts:3077

**Parameters:**

Name | Type |
------ | ------ |
`type` | "scalar" |
`name` | [Name](../modules/_ast_.md#name)‹string› |
`builtIn?` | boolean |

**Returns:** *function*

▸ (...`args`: [CompatibleExpression](../modules/_ast_.md#compatibleexpression)[]): *[Expression](_ast_.expression.md)‹any›*

**Parameters:**

Name | Type |
------ | ------ |
`...args` | [CompatibleExpression](../modules/_ast_.md#compatibleexpression)[] |

___

### `Static` invokeScalarFunction

▸ **invokeScalarFunction**‹**T**›(`func`: [Name](../modules/_ast_.md#name)‹string› | [Func](_ast_.func.md)‹string›, `args`: [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹[ScalarType](../modules/_types_.md#scalartype)›[]): *[ScalarFuncInvoke](_ast_.scalarfuncinvoke.md)‹T›*

*Inherited from [Statement](_ast_.statement.md).[invokeScalarFunction](_ast_.statement.md#static-invokescalarfunction)*

Defined in ast.ts:2672

**Type parameters:**

▪ **T**: *[ScalarType](../modules/_types_.md#scalartype)*

**Parameters:**

Name | Type |
------ | ------ |
`func` | [Name](../modules/_ast_.md#name)‹string› &#124; [Func](_ast_.func.md)‹string› |
`args` | [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹[ScalarType](../modules/_types_.md#scalartype)›[] |

**Returns:** *[ScalarFuncInvoke](_ast_.scalarfuncinvoke.md)‹T›*

___

### `Static` invokeTableFunction

▸ **invokeTableFunction**‹**T**›(`func`: [Name](../modules/_ast_.md#name)‹string› | [Func](_ast_.func.md)‹string›, `args`: [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹[ScalarType](../modules/_types_.md#scalartype)›[]): *[ProxiedRowset](../modules/_ast_.md#proxiedrowset)‹T›*

*Inherited from [Statement](_ast_.statement.md).[invokeTableFunction](_ast_.statement.md#static-invoketablefunction)*

Defined in ast.ts:2665

**Type parameters:**

▪ **T**: *[RowObject](../modules/_ast_.md#rowobject)*

**Parameters:**

Name | Type |
------ | ------ |
`func` | [Name](../modules/_ast_.md#name)‹string› &#124; [Func](_ast_.func.md)‹string› |
`args` | [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹[ScalarType](../modules/_types_.md#scalartype)›[] |

**Returns:** *[ProxiedRowset](../modules/_ast_.md#proxiedrowset)‹T›*

___

### `Static` makeFunc

▸ **makeFunc**‹**T**›(`type`: "table", `name`: [Name](../modules/_ast_.md#name)‹string›, `builtIn?`: boolean): *function*

*Inherited from [Statement](_ast_.statement.md).[makeFunc](_ast_.statement.md#static-makefunc)*

Defined in ast.ts:2679

**Type parameters:**

▪ **T**: *[RowObject](../modules/_ast_.md#rowobject)*

**Parameters:**

Name | Type |
------ | ------ |
`type` | "table" |
`name` | [Name](../modules/_ast_.md#name)‹string› |
`builtIn?` | boolean |

**Returns:** *function*

▸ (): *[ProxiedRowset](../modules/_ast_.md#proxiedrowset)‹T›*

▸ **makeFunc**‹**T**, **A1**›(`type`: "table", `name`: [Name](../modules/_ast_.md#name)‹string›, `builtIn?`: boolean): *function*

*Inherited from [Statement](_ast_.statement.md).[makeFunc](_ast_.statement.md#static-makefunc)*

Defined in ast.ts:2684

**Type parameters:**

▪ **T**: *[RowObject](../modules/_ast_.md#rowobject)*

▪ **A1**: *[CompatibleExpression](../modules/_ast_.md#compatibleexpression)*

**Parameters:**

Name | Type |
------ | ------ |
`type` | "table" |
`name` | [Name](../modules/_ast_.md#name)‹string› |
`builtIn?` | boolean |

**Returns:** *function*

▸ (`arg1`: A1): *[ProxiedRowset](../modules/_ast_.md#proxiedrowset)‹T›*

**Parameters:**

Name | Type |
------ | ------ |
`arg1` | A1 |

▸ **makeFunc**‹**T**, **A1**, **A2**›(`type`: "table", `name`: [Name](../modules/_ast_.md#name)‹string›, `builtIn?`: boolean): *function*

*Inherited from [Statement](_ast_.statement.md).[makeFunc](_ast_.statement.md#static-makefunc)*

Defined in ast.ts:2689

**Type parameters:**

▪ **T**: *[RowObject](../modules/_ast_.md#rowobject)*

▪ **A1**: *[CompatibleExpression](../modules/_ast_.md#compatibleexpression)*

▪ **A2**: *[CompatibleExpression](../modules/_ast_.md#compatibleexpression)*

**Parameters:**

Name | Type |
------ | ------ |
`type` | "table" |
`name` | [Name](../modules/_ast_.md#name)‹string› |
`builtIn?` | boolean |

**Returns:** *function*

▸ (`arg1`: A1, `arg2`: A2): *[ProxiedRowset](../modules/_ast_.md#proxiedrowset)‹T›*

**Parameters:**

Name | Type |
------ | ------ |
`arg1` | A1 |
`arg2` | A2 |

▸ **makeFunc**‹**T**, **A1**, **A2**, **A3**›(`type`: "table", `name`: [Name](../modules/_ast_.md#name)‹string›, `builtIn?`: boolean): *function*

*Inherited from [Statement](_ast_.statement.md).[makeFunc](_ast_.statement.md#static-makefunc)*

Defined in ast.ts:2698

**Type parameters:**

▪ **T**: *[RowObject](../modules/_ast_.md#rowobject)*

▪ **A1**: *[CompatibleExpression](../modules/_ast_.md#compatibleexpression)*

▪ **A2**: *[CompatibleExpression](../modules/_ast_.md#compatibleexpression)*

▪ **A3**: *[CompatibleExpression](../modules/_ast_.md#compatibleexpression)*

**Parameters:**

Name | Type |
------ | ------ |
`type` | "table" |
`name` | [Name](../modules/_ast_.md#name)‹string› |
`builtIn?` | boolean |

**Returns:** *function*

▸ (`arg1`: A1, `arg2`: A2, `arg3`: A3): *[ProxiedRowset](../modules/_ast_.md#proxiedrowset)‹T›*

**Parameters:**

Name | Type |
------ | ------ |
`arg1` | A1 |
`arg2` | A2 |
`arg3` | A3 |

▸ **makeFunc**‹**T**, **A1**, **A2**, **A3**, **A4**›(`type`: "table", `name`: [Name](../modules/_ast_.md#name)‹string›, `builtIn?`: boolean): *function*

*Inherited from [Statement](_ast_.statement.md).[makeFunc](_ast_.statement.md#static-makefunc)*

Defined in ast.ts:2708

**Type parameters:**

▪ **T**: *[RowObject](../modules/_ast_.md#rowobject)*

▪ **A1**: *[CompatibleExpression](../modules/_ast_.md#compatibleexpression)*

▪ **A2**: *[CompatibleExpression](../modules/_ast_.md#compatibleexpression)*

▪ **A3**: *[CompatibleExpression](../modules/_ast_.md#compatibleexpression)*

▪ **A4**: *[CompatibleExpression](../modules/_ast_.md#compatibleexpression)*

**Parameters:**

Name | Type |
------ | ------ |
`type` | "table" |
`name` | [Name](../modules/_ast_.md#name)‹string› |
`builtIn?` | boolean |

**Returns:** *function*

▸ (`arg1`: A1, `arg2`: A2, `arg3`: A3, `arg4`: A4): *[ProxiedRowset](../modules/_ast_.md#proxiedrowset)‹T›*

**Parameters:**

Name | Type |
------ | ------ |
`arg1` | A1 |
`arg2` | A2 |
`arg3` | A3 |
`arg4` | A4 |

▸ **makeFunc**‹**T**, **A1**, **A2**, **A3**, **A4**, **A5**›(`type`: "table", `name`: [Name](../modules/_ast_.md#name)‹string›, `builtIn?`: boolean): *function*

*Inherited from [Statement](_ast_.statement.md).[makeFunc](_ast_.statement.md#static-makefunc)*

Defined in ast.ts:2719

**Type parameters:**

▪ **T**: *[RowObject](../modules/_ast_.md#rowobject)*

▪ **A1**: *[CompatibleExpression](../modules/_ast_.md#compatibleexpression)*

▪ **A2**: *[CompatibleExpression](../modules/_ast_.md#compatibleexpression)*

▪ **A3**: *[CompatibleExpression](../modules/_ast_.md#compatibleexpression)*

▪ **A4**: *[CompatibleExpression](../modules/_ast_.md#compatibleexpression)*

▪ **A5**: *[CompatibleExpression](../modules/_ast_.md#compatibleexpression)*

**Parameters:**

Name | Type |
------ | ------ |
`type` | "table" |
`name` | [Name](../modules/_ast_.md#name)‹string› |
`builtIn?` | boolean |

**Returns:** *function*

▸ (`arg1`: A1, `arg2`: A2, `arg3`: A3, `arg4`: A4, `arg5`: A5): *[ProxiedRowset](../modules/_ast_.md#proxiedrowset)‹T›*

**Parameters:**

Name | Type |
------ | ------ |
`arg1` | A1 |
`arg2` | A2 |
`arg3` | A3 |
`arg4` | A4 |
`arg5` | A5 |

▸ **makeFunc**(`type`: "table", `name`: [Name](../modules/_ast_.md#name)‹string›, `builtIn?`: boolean): *function*

*Inherited from [Statement](_ast_.statement.md).[makeFunc](_ast_.statement.md#static-makefunc)*

Defined in ast.ts:2732

**Parameters:**

Name | Type |
------ | ------ |
`type` | "table" |
`name` | [Name](../modules/_ast_.md#name)‹string› |
`builtIn?` | boolean |

**Returns:** *function*

▸ (...`args`: [CompatibleExpression](../modules/_ast_.md#compatibleexpression)[]): *[ProxiedRowset](../modules/_ast_.md#proxiedrowset)‹any›*

**Parameters:**

Name | Type |
------ | ------ |
`...args` | [CompatibleExpression](../modules/_ast_.md#compatibleexpression)[] |

▸ **makeFunc**‹**T**›(`type`: "scalar", `name`: [Name](../modules/_ast_.md#name)‹string›, `builtIn?`: boolean): *function*

*Inherited from [Statement](_ast_.statement.md).[makeFunc](_ast_.statement.md#static-makefunc)*

Defined in ast.ts:2738

**Type parameters:**

▪ **T**: *[ScalarType](../modules/_types_.md#scalartype)*

**Parameters:**

Name | Type |
------ | ------ |
`type` | "scalar" |
`name` | [Name](../modules/_ast_.md#name)‹string› |
`builtIn?` | boolean |

**Returns:** *function*

▸ (): *[Expression](_ast_.expression.md)‹T›*

▸ **makeFunc**‹**T**, **A1**›(`type`: "scalar", `name`: [Name](../modules/_ast_.md#name)‹string›, `builtIn?`: boolean): *function*

*Inherited from [Statement](_ast_.statement.md).[makeFunc](_ast_.statement.md#static-makefunc)*

Defined in ast.ts:2743

**Type parameters:**

▪ **T**: *[ScalarType](../modules/_types_.md#scalartype)*

▪ **A1**: *[CompatibleExpression](../modules/_ast_.md#compatibleexpression)*

**Parameters:**

Name | Type |
------ | ------ |
`type` | "scalar" |
`name` | [Name](../modules/_ast_.md#name)‹string› |
`builtIn?` | boolean |

**Returns:** *function*

▸ (`arg1`: A1): *[Expression](_ast_.expression.md)‹T›*

**Parameters:**

Name | Type |
------ | ------ |
`arg1` | A1 |

▸ **makeFunc**‹**T**, **A1**, **A2**›(`type`: "scalar", `name`: [Name](../modules/_ast_.md#name)‹string›, `builtIn?`: boolean): *function*

*Inherited from [Statement](_ast_.statement.md).[makeFunc](_ast_.statement.md#static-makefunc)*

Defined in ast.ts:2748

**Type parameters:**

▪ **T**: *[ScalarType](../modules/_types_.md#scalartype)*

▪ **A1**: *[CompatibleExpression](../modules/_ast_.md#compatibleexpression)*

▪ **A2**: *[CompatibleExpression](../modules/_ast_.md#compatibleexpression)*

**Parameters:**

Name | Type |
------ | ------ |
`type` | "scalar" |
`name` | [Name](../modules/_ast_.md#name)‹string› |
`builtIn?` | boolean |

**Returns:** *function*

▸ (`arg1`: A1, `arg2`: A2): *[Expression](_ast_.expression.md)‹T›*

**Parameters:**

Name | Type |
------ | ------ |
`arg1` | A1 |
`arg2` | A2 |

▸ **makeFunc**‹**T**, **A1**, **A2**, **A3**›(`type`: "scalar", `name`: [Name](../modules/_ast_.md#name)‹string›, `builtIn?`: boolean): *function*

*Inherited from [Statement](_ast_.statement.md).[makeFunc](_ast_.statement.md#static-makefunc)*

Defined in ast.ts:2757

**Type parameters:**

▪ **T**: *[ScalarType](../modules/_types_.md#scalartype)*

▪ **A1**: *[CompatibleExpression](../modules/_ast_.md#compatibleexpression)*

▪ **A2**: *[CompatibleExpression](../modules/_ast_.md#compatibleexpression)*

▪ **A3**: *[CompatibleExpression](../modules/_ast_.md#compatibleexpression)*

**Parameters:**

Name | Type |
------ | ------ |
`type` | "scalar" |
`name` | [Name](../modules/_ast_.md#name)‹string› |
`builtIn?` | boolean |

**Returns:** *function*

▸ (`arg1`: A1, `arg2`: A2, `arg3`: A3): *[Expression](_ast_.expression.md)‹T›*

**Parameters:**

Name | Type |
------ | ------ |
`arg1` | A1 |
`arg2` | A2 |
`arg3` | A3 |

▸ **makeFunc**‹**T**, **A1**, **A2**, **A3**, **A4**›(`type`: "scalar", `name`: [Name](../modules/_ast_.md#name)‹string›, `builtIn?`: boolean): *function*

*Inherited from [Statement](_ast_.statement.md).[makeFunc](_ast_.statement.md#static-makefunc)*

Defined in ast.ts:2767

**Type parameters:**

▪ **T**: *[ScalarType](../modules/_types_.md#scalartype)*

▪ **A1**: *[CompatibleExpression](../modules/_ast_.md#compatibleexpression)*

▪ **A2**: *[CompatibleExpression](../modules/_ast_.md#compatibleexpression)*

▪ **A3**: *[CompatibleExpression](../modules/_ast_.md#compatibleexpression)*

▪ **A4**: *[CompatibleExpression](../modules/_ast_.md#compatibleexpression)*

**Parameters:**

Name | Type |
------ | ------ |
`type` | "scalar" |
`name` | [Name](../modules/_ast_.md#name)‹string› |
`builtIn?` | boolean |

**Returns:** *function*

▸ (`arg1`: A1, `arg2`: A2, `arg3`: A3, `arg4`: A4): *[Expression](_ast_.expression.md)‹T›*

**Parameters:**

Name | Type |
------ | ------ |
`arg1` | A1 |
`arg2` | A2 |
`arg3` | A3 |
`arg4` | A4 |

▸ **makeFunc**‹**T**, **A1**, **A2**, **A3**, **A4**, **A5**›(`type`: "scalar", `name`: [Name](../modules/_ast_.md#name)‹string›, `builtIn?`: boolean): *function*

*Inherited from [Statement](_ast_.statement.md).[makeFunc](_ast_.statement.md#static-makefunc)*

Defined in ast.ts:2778

**Type parameters:**

▪ **T**: *[ScalarType](../modules/_types_.md#scalartype)*

▪ **A1**: *[CompatibleExpression](../modules/_ast_.md#compatibleexpression)*

▪ **A2**: *[CompatibleExpression](../modules/_ast_.md#compatibleexpression)*

▪ **A3**: *[CompatibleExpression](../modules/_ast_.md#compatibleexpression)*

▪ **A4**: *[CompatibleExpression](../modules/_ast_.md#compatibleexpression)*

▪ **A5**: *[CompatibleExpression](../modules/_ast_.md#compatibleexpression)*

**Parameters:**

Name | Type |
------ | ------ |
`type` | "scalar" |
`name` | [Name](../modules/_ast_.md#name)‹string› |
`builtIn?` | boolean |

**Returns:** *function*

▸ (`arg1`: A1, `arg2`: A2, `arg3`: A3, `arg4`: A4, `arg5`: A5): *[Expression](_ast_.expression.md)‹T›*

**Parameters:**

Name | Type |
------ | ------ |
`arg1` | A1 |
`arg2` | A2 |
`arg3` | A3 |
`arg4` | A4 |
`arg5` | A5 |

▸ **makeFunc**(`type`: "scalar", `name`: [Name](../modules/_ast_.md#name)‹string›, `builtIn?`: boolean): *function*

*Inherited from [Statement](_ast_.statement.md).[makeFunc](_ast_.statement.md#static-makefunc)*

Defined in ast.ts:2791

**Parameters:**

Name | Type |
------ | ------ |
`type` | "scalar" |
`name` | [Name](../modules/_ast_.md#name)‹string› |
`builtIn?` | boolean |

**Returns:** *function*

▸ (...`args`: [CompatibleExpression](../modules/_ast_.md#compatibleexpression)[]): *[Expression](_ast_.expression.md)‹any›*

**Parameters:**

Name | Type |
------ | ------ |
`...args` | [CompatibleExpression](../modules/_ast_.md#compatibleexpression)[] |

___

### `Static` makeProc

▸ **makeProc**‹**R**, **O**›(`name`: [Name](../modules/_ast_.md#name)‹string›, `builtIn?`: boolean): *function*

*Inherited from [Statement](_ast_.statement.md).[makeProc](_ast_.statement.md#static-makeproc)*

Defined in ast.ts:2830

创建一个可供JS调用的存储过程

**Type parameters:**

▪ **R**: *[ScalarType](../modules/_types_.md#scalartype)*

▪ **O**: *[RowObject](../modules/_ast_.md#rowobject)[]*

**Parameters:**

Name | Type |
------ | ------ |
`name` | [Name](../modules/_ast_.md#name)‹string› |
`builtIn?` | boolean |

**Returns:** *function*

▸ (): *[Execute](_ast_.execute.md)‹R, O›*

▸ **makeProc**‹**A1**, **R**, **O**›(`name`: [Name](../modules/_ast_.md#name)‹string›, `builtIn?`: boolean): *function*

*Inherited from [Statement](_ast_.statement.md).[makeProc](_ast_.statement.md#static-makeproc)*

Defined in ast.ts:2834

**Type parameters:**

▪ **A1**: *[CompatibleExpression](../modules/_ast_.md#compatibleexpression)*

▪ **R**: *[ScalarType](../modules/_types_.md#scalartype)*

▪ **O**: *[RowObject](../modules/_ast_.md#rowobject)[]*

**Parameters:**

Name | Type |
------ | ------ |
`name` | [Name](../modules/_ast_.md#name)‹string› |
`builtIn?` | boolean |

**Returns:** *function*

▸ (`arg1`: A1): *[Execute](_ast_.execute.md)‹R, O›*

**Parameters:**

Name | Type |
------ | ------ |
`arg1` | A1 |

▸ **makeProc**‹**A1**, **A2**, **R**, **O**›(`name`: [Name](../modules/_ast_.md#name)‹string›, `builtIn?`: boolean): *function*

*Inherited from [Statement](_ast_.statement.md).[makeProc](_ast_.statement.md#static-makeproc)*

Defined in ast.ts:2839

**Type parameters:**

▪ **A1**: *[CompatibleExpression](../modules/_ast_.md#compatibleexpression)*

▪ **A2**: *[CompatibleExpression](../modules/_ast_.md#compatibleexpression)*

▪ **R**: *[ScalarType](../modules/_types_.md#scalartype)*

▪ **O**: *[RowObject](../modules/_ast_.md#rowobject)[]*

**Parameters:**

Name | Type |
------ | ------ |
`name` | [Name](../modules/_ast_.md#name)‹string› |
`builtIn?` | boolean |

**Returns:** *function*

▸ (`arg1`: A1, `arg2`: A2): *[Execute](_ast_.execute.md)‹R, O›*

**Parameters:**

Name | Type |
------ | ------ |
`arg1` | A1 |
`arg2` | A2 |

▸ **makeProc**‹**A1**, **A2**, **A3**, **R**, **O**›(`name`: [Name](../modules/_ast_.md#name)‹string›, `builtIn?`: boolean): *function*

*Inherited from [Statement](_ast_.statement.md).[makeProc](_ast_.statement.md#static-makeproc)*

Defined in ast.ts:2848

**Type parameters:**

▪ **A1**: *[CompatibleExpression](../modules/_ast_.md#compatibleexpression)*

▪ **A2**: *[CompatibleExpression](../modules/_ast_.md#compatibleexpression)*

▪ **A3**: *[CompatibleExpression](../modules/_ast_.md#compatibleexpression)*

▪ **R**: *[ScalarType](../modules/_types_.md#scalartype)*

▪ **O**: *[RowObject](../modules/_ast_.md#rowobject)[]*

**Parameters:**

Name | Type |
------ | ------ |
`name` | [Name](../modules/_ast_.md#name)‹string› |
`builtIn?` | boolean |

**Returns:** *function*

▸ (`arg1`: A1, `arg2`: A2, `arg3`: A3): *[Execute](_ast_.execute.md)‹R, O›*

**Parameters:**

Name | Type |
------ | ------ |
`arg1` | A1 |
`arg2` | A2 |
`arg3` | A3 |

▸ **makeProc**‹**A1**, **A2**, **A3**, **A4**, **R**, **O**›(`name`: [Name](../modules/_ast_.md#name)‹string›, `builtIn?`: boolean): *function*

*Inherited from [Statement](_ast_.statement.md).[makeProc](_ast_.statement.md#static-makeproc)*

Defined in ast.ts:2858

**Type parameters:**

▪ **A1**: *[CompatibleExpression](../modules/_ast_.md#compatibleexpression)*

▪ **A2**: *[CompatibleExpression](../modules/_ast_.md#compatibleexpression)*

▪ **A3**: *[CompatibleExpression](../modules/_ast_.md#compatibleexpression)*

▪ **A4**: *[CompatibleExpression](../modules/_ast_.md#compatibleexpression)*

▪ **R**: *[ScalarType](../modules/_types_.md#scalartype)*

▪ **O**: *[RowObject](../modules/_ast_.md#rowobject)[]*

**Parameters:**

Name | Type |
------ | ------ |
`name` | [Name](../modules/_ast_.md#name)‹string› |
`builtIn?` | boolean |

**Returns:** *function*

▸ (`arg1`: A1, `arg2`: A2, `arg3`: A3, `arg4`: A4): *[Execute](_ast_.execute.md)‹R, O›*

**Parameters:**

Name | Type |
------ | ------ |
`arg1` | A1 |
`arg2` | A2 |
`arg3` | A3 |
`arg4` | A4 |

▸ **makeProc**‹**A1**, **A2**, **A3**, **A4**, **A5**, **R**, **O**›(`name`: [Name](../modules/_ast_.md#name)‹string›, `builtIn?`: boolean): *function*

*Inherited from [Statement](_ast_.statement.md).[makeProc](_ast_.statement.md#static-makeproc)*

Defined in ast.ts:2869

**Type parameters:**

▪ **A1**: *[CompatibleExpression](../modules/_ast_.md#compatibleexpression)*

▪ **A2**: *[CompatibleExpression](../modules/_ast_.md#compatibleexpression)*

▪ **A3**: *[CompatibleExpression](../modules/_ast_.md#compatibleexpression)*

▪ **A4**: *[CompatibleExpression](../modules/_ast_.md#compatibleexpression)*

▪ **A5**: *[CompatibleExpression](../modules/_ast_.md#compatibleexpression)*

▪ **R**: *[ScalarType](../modules/_types_.md#scalartype)*

▪ **O**: *[RowObject](../modules/_ast_.md#rowobject)[]*

**Parameters:**

Name | Type |
------ | ------ |
`name` | [Name](../modules/_ast_.md#name)‹string› |
`builtIn?` | boolean |

**Returns:** *function*

▸ (`arg1`: A1, `arg2`: A2, `arg3`: A3, `arg4`: A4, `arg5`: A5): *[Execute](_ast_.execute.md)‹R, O›*

**Parameters:**

Name | Type |
------ | ------ |
`arg1` | A1 |
`arg2` | A2 |
`arg3` | A3 |
`arg4` | A4 |
`arg5` | A5 |

▸ **makeProc**(`name`: [Name](../modules/_ast_.md#name)‹string›, `builtIn?`: boolean): *function*

*Inherited from [Statement](_ast_.statement.md).[makeProc](_ast_.statement.md#static-makeproc)*

Defined in ast.ts:2882

**Parameters:**

Name | Type |
------ | ------ |
`name` | [Name](../modules/_ast_.md#name)‹string› |
`builtIn?` | boolean |

**Returns:** *function*

▸ (...`args`: [CompatibleExpression](../modules/_ast_.md#compatibleexpression)[]): *[Expression](_ast_.expression.md)‹any›*

**Parameters:**

Name | Type |
------ | ------ |
`...args` | [CompatibleExpression](../modules/_ast_.md#compatibleexpression)[] |

___

### `Static` raw

▸ **raw**(`sql`: string): *any*

*Inherited from [Statement](_ast_.statement.md).[raw](_ast_.statement.md#static-raw)*

Defined in ast.ts:2640

**Parameters:**

Name | Type |
------ | ------ |
`sql` | string |

**Returns:** *any*

___

### `Static` select

▸ **select**(...`args`: any[]): *any*

*Inherited from [Statement](_ast_.statement.md).[select](_ast_.statement.md#static-select)*

Defined in ast.ts:2636

**Parameters:**

Name | Type |
------ | ------ |
`...args` | any[] |

**Returns:** *any*

___

### `Static` union

▸ **union**‹**T**›(...`selects`: [Select](_ast_.select.md)‹T›[]): *[Select](_ast_.select.md)‹T›*

*Inherited from [Statement](_ast_.statement.md).[union](_ast_.statement.md#static-union)*

Defined in ast.ts:2949

**Type parameters:**

▪ **T**: *[RowObject](../modules/_ast_.md#rowobject)*

**Parameters:**

Name | Type |
------ | ------ |
`...selects` | [Select](_ast_.select.md)‹T›[] |

**Returns:** *[Select](_ast_.select.md)‹T›*

___

### `Static` unionAll

▸ **unionAll**‹**T**›(...`selects`: [Select](_ast_.select.md)‹T›[]): *[Select](_ast_.select.md)‹T›*

*Inherited from [Statement](_ast_.statement.md).[unionAll](_ast_.statement.md#static-unionall)*

Defined in ast.ts:2956

**Type parameters:**

▪ **T**: *[RowObject](../modules/_ast_.md#rowobject)*

**Parameters:**

Name | Type |
------ | ------ |
`...selects` | [Select](_ast_.select.md)‹T›[] |

**Returns:** *[Select](_ast_.select.md)‹T›*

___

### `Static` update

▸ **update**‹**T**›(`table`: [CompatibleTable](../modules/_ast_.md#compatibletable)‹T, string›): *[Update](_ast_.update.md)‹T›*

*Inherited from [Statement](_ast_.statement.md).[update](_ast_.statement.md#static-update)*

Defined in ast.ts:2620

更新一个表格

**Type parameters:**

▪ **T**: *[RowObject](../modules/_ast_.md#rowobject)*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`table` | [CompatibleTable](../modules/_ast_.md#compatibletable)‹T, string› |   |

**Returns:** *[Update](_ast_.update.md)‹T›*

___

### `Static` when

▸ **when**‹**T**›(`expr`: [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹[ScalarType](../modules/_types_.md#scalartype)›, `value?`: [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹T›): *[When](_ast_.when.md)‹T›*

*Inherited from [Statement](_ast_.statement.md).[when](_ast_.statement.md#static-when)*

Defined in ast.ts:2926

WHEN 语句块

**Type parameters:**

▪ **T**: *[ScalarType](../modules/_types_.md#scalartype)*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`expr` | [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹[ScalarType](../modules/_types_.md#scalartype)› | - |
`value?` | [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹T› |   |

**Returns:** *[When](_ast_.when.md)‹T›*

___

### `Static` with

▸ **with**(...`rowsets`: [CompatibleNamedSelect](../modules/_ast_.md#compatiblenamedselect)[]): *[With](_ast_.with.md)*

*Inherited from [Statement](_ast_.statement.md).[with](_ast_.statement.md#static-with)*

Defined in ast.ts:2940

With语句

**Parameters:**

Name | Type |
------ | ------ |
`...rowsets` | [CompatibleNamedSelect](../modules/_ast_.md#compatiblenamedselect)[] |

**Returns:** *[With](_ast_.with.md)*

▸ **with**(`rowsets`: Record‹string, [Select](_ast_.select.md)›): *[With](_ast_.with.md)*

*Inherited from [Statement](_ast_.statement.md).[with](_ast_.statement.md#static-with)*

Defined in ast.ts:2941

**Parameters:**

Name | Type |
------ | ------ |
`rowsets` | Record‹string, [Select](_ast_.select.md)› |

**Returns:** *[With](_ast_.with.md)*
