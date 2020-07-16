[lubejs](../README.md) › [Globals](../globals.md) › ["ast"](../modules/_ast_.md) › [Join](_ast_.join.md)

# Class: Join

联接查询

## Hierarchy

* [AST](_ast_.ast.md)

  ↳ **Join**

## Index

### Constructors

* [constructor](_ast_.join.md#constructor)

### Properties

* [left](_ast_.join.md#left)
* [on](_ast_.join.md#on)
* [table](_ast_.join.md#table)
* [type](_ast_.join.md#readonly-type)

### Methods

* [bracket](_ast_.join.md#static-bracket)

## Constructors

###  constructor

\+ **new Join**(`table`: [UnsureIdentifier](../modules/_ast_.md#unsureidentifier), `on`: [Condition](_ast_.condition.md), `left`: boolean): *[Join](_ast_.join.md)*

*Overrides [AST](_ast_.ast.md).[constructor](_ast_.ast.md#constructor)*

Defined in src/ast.ts:1131

创建一个表关联

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`table` | [UnsureIdentifier](../modules/_ast_.md#unsureidentifier) | - | - |
`on` | [Condition](_ast_.condition.md) | - | 关联条件 |
`left` | boolean | false | 是否左联接  |

**Returns:** *[Join](_ast_.join.md)*

## Properties

###  left

• **left**: *boolean*

Defined in src/ast.ts:1129

___

###  on

• **on**: *[Condition](_ast_.condition.md)*

Defined in src/ast.ts:1131

___

###  table

• **table**: *[Identifier](_ast_.identifier.md)*

Defined in src/ast.ts:1130

___

### `Readonly` type

• **type**: *[SQL_SYMBOLE](../enums/_constants_.sql_symbole.md)*

*Overrides [AST](_ast_.ast.md).[type](_ast_.ast.md#readonly-type)*

Defined in src/ast.ts:1128

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
