[lubejs](../README.md) › [Globals](../globals.md) › ["ast"](../modules/_ast_.md) › [Alias](_ast_.alias.md)

# Class: Alias ‹**N**›

## Type parameters

▪ **N**: *string*

## Hierarchy

  ↳ [Identifier](_ast_.identifier.md)‹N›

  ↳ **Alias**

## Index

### Constructors

* [constructor](_ast_.alias.md#constructor)

### Properties

* [$builtin](_ast_.alias.md#readonly-builtin)
* [$kind](_ast_.alias.md#kind)
* [$name](_ast_.alias.md#name)
* [$type](_ast_.alias.md#readonly-type)

### Accessors

* [star](_ast_.alias.md#static-star)

### Methods

* [clone](_ast_.alias.md#clone)
* [builtIn](_ast_.alias.md#static-builtin)
* [field](_ast_.alias.md#static-field)
* [func](_ast_.alias.md#static-func)
* [proc](_ast_.alias.md#static-proc)
* [table](_ast_.alias.md#static-table)
* [var](_ast_.alias.md#static-var)

## Constructors

###  constructor

\+ **new Alias**(`name`: N): *[Alias](_ast_.alias.md)*

*Overrides [Identifier](_ast_.identifier.md).[constructor](_ast_.identifier.md#constructor)*

Defined in ast.ts:1303

**Parameters:**

Name | Type |
------ | ------ |
`name` | N |

**Returns:** *[Alias](_ast_.alias.md)*

## Properties

### `Readonly` $builtin

• **$builtin**: *boolean*

*Inherited from [Identifier](_ast_.identifier.md).[$builtin](_ast_.identifier.md#readonly-builtin)*

Defined in ast.ts:1220

是否内建标识符，如果是，在编译时不会自动加上引号，如系统函数类的 count 等聚合函数

___

###  $kind

• **$kind**: *[ALIAS](../enums/_constants_.identofier_kind.md#alias)*

*Overrides [Identifier](_ast_.identifier.md).[$kind](_ast_.identifier.md#readonly-kind)*

Defined in ast.ts:1303

___

###  $name

• **$name**: *N*

*Overrides [Identifier](_ast_.identifier.md).[$name](_ast_.identifier.md#readonly-name)*

Defined in ast.ts:1302

___

### `Readonly` $type

• **$type**: *[IDENTIFIER](../enums/_constants_.sql_symbole.md#identifier)* = SQL_SYMBOLE.IDENTIFIER

*Inherited from [Identifier](_ast_.identifier.md).[$type](_ast_.identifier.md#readonly-type)*

*Overrides [AST](_ast_.ast.md).[$type](_ast_.ast.md#readonly-type)*

Defined in ast.ts:1211

## Accessors

### `Static` star

• **get star**(): *[Star](_ast_.star.md)‹any›*

*Inherited from [Identifier](_ast_.identifier.md).[star](_ast_.identifier.md#static-star)*

Defined in ast.ts:1284

**Returns:** *[Star](_ast_.star.md)‹any›*

## Methods

###  clone

▸ **clone**(): *this*

*Inherited from [AST](_ast_.ast.md).[clone](_ast_.ast.md#clone)*

Defined in ast.ts:285

克隆自身

**Returns:** *this*

___

### `Static` builtIn

▸ **builtIn**‹**T**›(`name`: T): *[BuiltIn](_ast_.builtin.md)‹T›*

*Inherited from [Identifier](_ast_.identifier.md).[builtIn](_ast_.identifier.md#static-builtin)*

Defined in ast.ts:1274

**Type parameters:**

▪ **T**: *string*

**Parameters:**

Name | Type |
------ | ------ |
`name` | T |

**Returns:** *[BuiltIn](_ast_.builtin.md)‹T›*

___

### `Static` field

▸ **field**‹**T**, **N**›(`name`: [Name](../modules/_ast_.md#name)‹N›): *[Field](_ast_.field.md)‹T, N›*

*Inherited from [Identifier](_ast_.identifier.md).[field](_ast_.identifier.md#static-field)*

Defined in ast.ts:1268

创建一个字段

**Type parameters:**

▪ **T**: *[ScalarType](../modules/_types_.md#scalartype)*

▪ **N**: *string*

**Parameters:**

Name | Type |
------ | ------ |
`name` | [Name](../modules/_ast_.md#name)‹N› |

**Returns:** *[Field](_ast_.field.md)‹T, N›*

___

### `Static` func

▸ **func**‹**N**›(`name`: [Name](../modules/_ast_.md#name)‹N›, `builtIn`: boolean): *[Func](_ast_.func.md)‹N›*

*Inherited from [Identifier](_ast_.identifier.md).[func](_ast_.identifier.md#static-func)*

Defined in ast.ts:1250

声明一个函数

**Type parameters:**

▪ **N**: *string*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`name` | [Name](../modules/_ast_.md#name)‹N› | - |
`builtIn` | boolean | false |

**Returns:** *[Func](_ast_.func.md)‹N›*

___

### `Static` proc

▸ **proc**‹**R**, **O**, **N**›(`name`: [Name](../modules/_ast_.md#name)‹N›, `buildIn`: boolean): *[Procedure](_ast_.procedure.md)‹R, O, N›*

*Inherited from [Identifier](_ast_.identifier.md).[proc](_ast_.identifier.md#static-proc)*

Defined in ast.ts:1257

创建一个可供调用的存储过程函数

**Type parameters:**

▪ **R**: *[ScalarType](../modules/_types_.md#scalartype)*

▪ **O**: *[RowObject](../modules/_ast_.md#rowobject)[]*

▪ **N**: *string*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`name` | [Name](../modules/_ast_.md#name)‹N› | - |
`buildIn` | boolean | false |

**Returns:** *[Procedure](_ast_.procedure.md)‹R, O, N›*

___

### `Static` table

▸ **table**‹**T**, **N**›(`name`: [Name](../modules/_ast_.md#name)‹N›): *[ProxiedTable](../modules/_ast_.md#proxiedtable)‹T, N›*

*Inherited from [Identifier](_ast_.identifier.md).[table](_ast_.identifier.md#static-table)*

Defined in ast.ts:1234

创建表对象，该对象是可代理的，可以直接以 . 运算符获取下一节点Identifier

**Type parameters:**

▪ **T**: *[RowObject](../modules/_ast_.md#rowobject)*

▪ **N**: *string*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`name` | [Name](../modules/_ast_.md#name)‹N› |   |

**Returns:** *[ProxiedTable](../modules/_ast_.md#proxiedtable)‹T, N›*

___

### `Static` var

▸ **var**‹**T**, **N**›(`name`: N): *[Expression](_ast_.expression.md)‹T›*

*Inherited from [Identifier](_ast_.identifier.md).[var](_ast_.identifier.md#static-var)*

Defined in ast.ts:1278

**Type parameters:**

▪ **T**: *[ScalarType](../modules/_types_.md#scalartype)*

▪ **N**: *string*

**Parameters:**

Name | Type |
------ | ------ |
`name` | N |

**Returns:** *[Expression](_ast_.expression.md)‹T›*
