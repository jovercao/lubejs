[lubejs](../README.md) › [Globals](../globals.md) › ["ast"](../modules/_ast_.md) › [Raw](_ast_.raw.md)

# Class: Raw

## Hierarchy

* [AST](_ast_.ast.md)

  ↳ **Raw**

## Index

### Constructors

* [constructor](_ast_.raw.md#constructor)

### Properties

* [sql](_ast_.raw.md#sql)
* [type](_ast_.raw.md#readonly-type)

### Methods

* [bracket](_ast_.raw.md#static-bracket)

## Constructors

###  constructor

\+ **new Raw**(`sql`: string): *[Raw](_ast_.raw.md)*

*Overrides [AST](_ast_.ast.md).[constructor](_ast_.ast.md#constructor)*

Defined in src/ast.ts:1136

**Parameters:**

Name | Type |
------ | ------ |
`sql` | string |

**Returns:** *[Raw](_ast_.raw.md)*

## Properties

###  sql

• **sql**: *string*

Defined in src/ast.ts:1136

___

### `Readonly` type

• **type**: *[SQL_SYMBOLE](../enums/_constants_.sql_symbole.md)*

*Inherited from [AST](_ast_.ast.md).[type](_ast_.ast.md#readonly-type)*

Defined in src/ast.ts:70

## Methods

### `Static` bracket

▸ **bracket**‹**T**›(`context`: T): *[Bracket](_ast_.bracket.md)‹T›*

*Inherited from [AST](_ast_.ast.md).[bracket](_ast_.ast.md#static-bracket)*

Defined in src/ast.ts:72

**Type parameters:**

▪ **T**: *[AST](_ast_.ast.md)*

**Parameters:**

Name | Type |
------ | ------ |
`context` | T |

**Returns:** *[Bracket](_ast_.bracket.md)‹T›*
