[lubejs](../README.md) › [Globals](../globals.md) › ["ast"](../modules/_ast_.md) › [Union](_ast_.union.md)

# Class: Union

联接查询

## Hierarchy

* [AST](_ast_.ast.md)

  ↳ **Union**

## Index

### Constructors

* [constructor](_ast_.union.md#constructor)

### Properties

* [all](_ast_.union.md#all)
* [select](_ast_.union.md#select)
* [type](_ast_.union.md#readonly-type)

### Methods

* [bracket](_ast_.union.md#static-bracket)

## Constructors

###  constructor

\+ **new Union**(`select`: any, `all`: any): *[Union](_ast_.union.md)*

*Overrides [AST](_ast_.ast.md).[constructor](_ast_.ast.md#constructor)*

Defined in src/ast.ts:1776

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`select` | any | SELECT语句 |
`all` | any | 是否所有查询  |

**Returns:** *[Union](_ast_.union.md)*

## Properties

###  all

• **all**: *boolean*

Defined in src/ast.ts:1776

___

###  select

• **select**: *[UnsureSelectExpressions](../modules/_ast_.md#unsureselectexpressions)*

Defined in src/ast.ts:1775

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
