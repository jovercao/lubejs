[lubejs](../README.md) › [Globals](../globals.md) › ["ast"](../modules/_ast_.md) › [Delete](_ast_.delete.md)

# Class: Delete ‹**T**›

## Type parameters

▪ **T**: *[RowObject](../modules/_ast_.md#rowobject)*

## Hierarchy

  ↳ [Fromable](_ast_.fromable.md)‹T›

  ↳ **Delete**

## Index

### Constructors

* [constructor](_ast_.delete.md#constructor)

### Properties

* [$froms](_ast_.delete.md#optional-froms)
* [$joins](_ast_.delete.md#optional-joins)
* [$table](_ast_.delete.md#table)
* [$type](_ast_.delete.md#type)
* [$where](_ast_.delete.md#optional-where)
* [$with](_ast_.delete.md#with)

### Methods

* [clone](_ast_.delete.md#clone)
* [from](_ast_.delete.md#from)
* [join](_ast_.delete.md#join)
* [leftJoin](_ast_.delete.md#leftjoin)
* [where](_ast_.delete.md#where)
* [assign](_ast_.delete.md#static-assign)
* [case](_ast_.delete.md#static-case)
* [declare](_ast_.delete.md#static-declare)
* [delete](_ast_.delete.md#static-delete)
* [execute](_ast_.delete.md#static-execute)
* [insert](_ast_.delete.md#static-insert)
* [invoke](_ast_.delete.md#static-invoke)
* [invokeScalarFunction](_ast_.delete.md#static-invokescalarfunction)
* [invokeTableFunction](_ast_.delete.md#static-invoketablefunction)
* [makeFunc](_ast_.delete.md#static-makefunc)
* [makeProc](_ast_.delete.md#static-makeproc)
* [raw](_ast_.delete.md#static-raw)
* [select](_ast_.delete.md#static-select)
* [union](_ast_.delete.md#static-union)
* [unionAll](_ast_.delete.md#static-unionall)
* [update](_ast_.delete.md#static-update)
* [when](_ast_.delete.md#static-when)
* [with](_ast_.delete.md#static-with)

## Constructors

###  constructor

\+ **new Delete**(`table?`: [CompatibleTable](../modules/_ast_.md#compatibletable)‹T, string›): *[Delete](_ast_.delete.md)*

Defined in ast.ts:3815

**Parameters:**

Name | Type |
------ | ------ |
`table?` | [CompatibleTable](../modules/_ast_.md#compatibletable)‹T, string› |

**Returns:** *[Delete](_ast_.delete.md)*

## Properties

### `Optional` $froms

• **$froms**? : *[Rowset](_ast_.rowset.md)‹any›[]*

*Inherited from [Fromable](_ast_.fromable.md).[$froms](_ast_.fromable.md#optional-froms)*

Defined in ast.ts:3329

___

### `Optional` $joins

• **$joins**? : *[Join](_ast_.join.md)[]*

*Inherited from [Fromable](_ast_.fromable.md).[$joins](_ast_.fromable.md#optional-joins)*

Defined in ast.ts:3330

___

###  $table

• **$table**: *[Table](_ast_.table.md)‹T, string›*

Defined in ast.ts:3814

___

###  $type

• **$type**: *[DELETE](../enums/_constants_.sql_symbole.md#delete)* = SQL_SYMBOLE.DELETE

*Overrides [AST](_ast_.ast.md).[$type](_ast_.ast.md#readonly-type)*

Defined in ast.ts:3815

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

###  clone

▸ **clone**(): *this*

*Inherited from [AST](_ast_.ast.md).[clone](_ast_.ast.md#clone)*

Defined in ast.ts:285

克隆自身

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
