[lubejs](../README.md) › [Globals](../globals.md) › ["ast"](../modules/_ast_.md) › [Insert](_ast_.insert.md)

# Class: Insert ‹**T**›

Insert 语句

## Type parameters

▪ **T**: *[RowObject](../modules/_ast_.md#rowobject)*

## Hierarchy

  ↳ [CrudStatement](_ast_.crudstatement.md)

  ↳ **Insert**

## Index

### Constructors

* [constructor](_ast_.insert.md#constructor)

### Properties

* [$fields](_ast_.insert.md#optional-fields)
* [$table](_ast_.insert.md#table)
* [$type](_ast_.insert.md#readonly-type)
* [$values](_ast_.insert.md#values)
* [$with](_ast_.insert.md#with)

### Methods

* [clone](_ast_.insert.md#clone)
* [values](_ast_.insert.md#values)
* [assign](_ast_.insert.md#static-assign)
* [case](_ast_.insert.md#static-case)
* [declare](_ast_.insert.md#static-declare)
* [delete](_ast_.insert.md#static-delete)
* [execute](_ast_.insert.md#static-execute)
* [insert](_ast_.insert.md#static-insert)
* [invoke](_ast_.insert.md#static-invoke)
* [invokeScalarFunction](_ast_.insert.md#static-invokescalarfunction)
* [invokeTableFunction](_ast_.insert.md#static-invoketablefunction)
* [makeFunc](_ast_.insert.md#static-makefunc)
* [makeProc](_ast_.insert.md#static-makeproc)
* [raw](_ast_.insert.md#static-raw)
* [select](_ast_.insert.md#static-select)
* [union](_ast_.insert.md#static-union)
* [unionAll](_ast_.insert.md#static-unionall)
* [update](_ast_.insert.md#static-update)
* [when](_ast_.insert.md#static-when)
* [with](_ast_.insert.md#static-with)

## Constructors

###  constructor

\+ **new Insert**(`table`: [CompatibleTable](../modules/_ast_.md#compatibletable)‹T, string›, `fields?`: [Field](_ast_.field.md)‹[ScalarType](../modules/_types_.md#scalartype), [FieldsOf](../modules/_ast_.md#fieldsof)‹T››[] | [FieldsOf](../modules/_ast_.md#fieldsof)‹T›[]): *[Insert](_ast_.insert.md)*

Defined in ast.ts:3632

构造函数

**Parameters:**

Name | Type |
------ | ------ |
`table` | [CompatibleTable](../modules/_ast_.md#compatibletable)‹T, string› |
`fields?` | [Field](_ast_.field.md)‹[ScalarType](../modules/_types_.md#scalartype), [FieldsOf](../modules/_ast_.md#fieldsof)‹T››[] &#124; [FieldsOf](../modules/_ast_.md#fieldsof)‹T›[] |

**Returns:** *[Insert](_ast_.insert.md)*

## Properties

### `Optional` $fields

• **$fields**? : *[Field](_ast_.field.md)[]*

Defined in ast.ts:3629

___

###  $table

• **$table**: *[Table](_ast_.table.md)‹T, string›*

Defined in ast.ts:3628

___

### `Readonly` $type

• **$type**: *[INSERT](../enums/_constants_.sql_symbole.md#insert)* = SQL_SYMBOLE.INSERT

*Overrides [AST](_ast_.ast.md).[$type](_ast_.ast.md#readonly-type)*

Defined in ast.ts:3632

___

###  $values

• **$values**: *[Expression](_ast_.expression.md)‹[ScalarType](../modules/_types_.md#scalartype)›[][] | [Select](_ast_.select.md)‹T›*

Defined in ast.ts:3630

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

###  values

▸ **values**(`rows`: [Select](_ast_.select.md)‹T› | [InputObject](../modules/_ast_.md#inputobject)‹T› | [InputObject](../modules/_ast_.md#inputobject)‹T›[] | [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹[ScalarType](../modules/_types_.md#scalartype)›[] | [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹[ScalarType](../modules/_types_.md#scalartype)›[][]): *this*

Defined in ast.ts:3657

**Parameters:**

Name | Type |
------ | ------ |
`rows` | [Select](_ast_.select.md)‹T› &#124; [InputObject](../modules/_ast_.md#inputobject)‹T› &#124; [InputObject](../modules/_ast_.md#inputobject)‹T›[] &#124; [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹[ScalarType](../modules/_types_.md#scalartype)›[] &#124; [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹[ScalarType](../modules/_types_.md#scalartype)›[][] |

**Returns:** *this*

▸ **values**(...`rows`: [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹[ScalarType](../modules/_types_.md#scalartype)›[][] | [InputObject](../modules/_ast_.md#inputobject)‹T›[]): *this*

Defined in ast.ts:3665

**Parameters:**

Name | Type |
------ | ------ |
`...rows` | [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹[ScalarType](../modules/_types_.md#scalartype)›[][] &#124; [InputObject](../modules/_ast_.md#inputobject)‹T›[] |

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
