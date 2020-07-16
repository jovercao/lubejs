[lubejs](../README.md) › [Globals](../globals.md) › ["ast"](../modules/_ast_.md) › [Document](_ast_.document.md)

# Class: Document

SQL 文档

## Hierarchy

* [AST](_ast_.ast.md)

  ↳ **Document**

## Index

### Constructors

* [constructor](_ast_.document.md#constructor)

### Properties

* [statements](_ast_.document.md#statements)
* [type](_ast_.document.md#readonly-type)

### Methods

* [bracket](_ast_.document.md#static-bracket)

## Constructors

###  constructor

\+ **new Document**(...`statements`: [Statement](_ast_.statement.md)[]): *[Document](_ast_.document.md)*

*Overrides [AST](_ast_.ast.md).[constructor](_ast_.ast.md#constructor)*

Defined in src/ast.ts:2353

**Parameters:**

Name | Type |
------ | ------ |
`...statements` | [Statement](_ast_.statement.md)[] |

**Returns:** *[Document](_ast_.document.md)*

## Properties

###  statements

• **statements**: *[Statement](_ast_.statement.md)[]*

Defined in src/ast.ts:2353

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
