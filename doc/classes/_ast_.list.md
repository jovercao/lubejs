[lubejs](../README.md) › [Globals](../globals.md) › ["ast"](../modules/_ast_.md) › [List](_ast_.list.md)

# Class: List

值列表（不含括号）

## Hierarchy

* [AST](_ast_.ast.md)

  ↳ **List**

## Index

### Constructors

* [constructor](_ast_.list.md#private-constructor)

### Properties

* [items](_ast_.list.md#items)
* [type](_ast_.list.md#readonly-type)

### Methods

* [bracket](_ast_.list.md#static-bracket)
* [columns](_ast_.list.md#static-columns)
* [execArgs](_ast_.list.md#static-execargs)
* [invokeArgs](_ast_.list.md#static-invokeargs)
* [values](_ast_.list.md#static-values)

## Constructors

### `Private` constructor

\+ **new List**(`symbol`: [SQL_SYMBOLE](../enums/_constants_.sql_symbole.md), ...`values`: [UnsureExpression](../modules/_ast_.md#unsureexpression)[]): *[List](_ast_.list.md)*

*Overrides [AST](_ast_.ast.md).[constructor](_ast_.ast.md#constructor)*

Defined in src/ast.ts:1485

**Parameters:**

Name | Type |
------ | ------ |
`symbol` | [SQL_SYMBOLE](../enums/_constants_.sql_symbole.md) |
`...values` | [UnsureExpression](../modules/_ast_.md#unsureexpression)[] |

**Returns:** *[List](_ast_.list.md)*

## Properties

###  items

• **items**: *[Expression](_ast_.expression.md)[]*

Defined in src/ast.ts:1485

___

### `Readonly` type

• **type**: *[SQL_SYMBOLE](../enums/_constants_.sql_symbole.md)*

*Inherited from [AST](_ast_.ast.md).[type](_ast_.ast.md#readonly-type)*

Defined in src/ast.ts:73

## Methods

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

### `Static` columns

▸ **columns**(...`exprs`: [UnsureExpression](../modules/_ast_.md#unsureexpression)[]): *[List](_ast_.list.md)*

Defined in src/ast.ts:1495

**Parameters:**

Name | Type |
------ | ------ |
`...exprs` | [UnsureExpression](../modules/_ast_.md#unsureexpression)[] |

**Returns:** *[List](_ast_.list.md)*

___

### `Static` execArgs

▸ **execArgs**(...`exprs`: [UnsureExpression](../modules/_ast_.md#unsureexpression)[]): *[List](_ast_.list.md)*

Defined in src/ast.ts:1503

**Parameters:**

Name | Type |
------ | ------ |
`...exprs` | [UnsureExpression](../modules/_ast_.md#unsureexpression)[] |

**Returns:** *[List](_ast_.list.md)*

___

### `Static` invokeArgs

▸ **invokeArgs**(...`exprs`: [UnsureExpression](../modules/_ast_.md#unsureexpression)[]): *[List](_ast_.list.md)*

Defined in src/ast.ts:1499

**Parameters:**

Name | Type |
------ | ------ |
`...exprs` | [UnsureExpression](../modules/_ast_.md#unsureexpression)[] |

**Returns:** *[List](_ast_.list.md)*

___

### `Static` values

▸ **values**(...`values`: [UnsureExpression](../modules/_ast_.md#unsureexpression)[]): *[List](_ast_.list.md)*

Defined in src/ast.ts:1491

**Parameters:**

Name | Type |
------ | ------ |
`...values` | [UnsureExpression](../modules/_ast_.md#unsureexpression)[] |

**Returns:** *[List](_ast_.list.md)*
