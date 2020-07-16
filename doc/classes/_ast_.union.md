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

\+ **new Union**(`select`: [SelectExpression](../modules/_ast_.md#selectexpression), `all`: boolean): *[Union](_ast_.union.md)*

*Overrides [AST](_ast_.ast.md).[constructor](_ast_.ast.md#constructor)*

Defined in src/ast.ts:1806

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`select` | [SelectExpression](../modules/_ast_.md#selectexpression) | - | SELECT语句 |
`all` | boolean | false | 是否所有查询  |

**Returns:** *[Union](_ast_.union.md)*

## Properties

###  all

• **all**: *boolean*

Defined in src/ast.ts:1806

___

###  select

• **select**: *[SelectExpression](../modules/_ast_.md#selectexpression)*

Defined in src/ast.ts:1805

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
