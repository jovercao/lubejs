[lubejs](../README.md) › [Globals](../globals.md) › ["ast"](../modules/_ast_.md) › [AST](_ast_.ast.md)

# Class: AST

AST 基类

## Hierarchy

* **AST**

  ↳ [Expression](_ast_.expression.md)

  ↳ [Condition](_ast_.condition.md)

  ↳ [Join](_ast_.join.md)

  ↳ [Raw](_ast_.raw.md)

  ↳ [Statement](_ast_.statement.md)

  ↳ [When](_ast_.when.md)

  ↳ [List](_ast_.list.md)

  ↳ [IBinary](../interfaces/_ast_.ibinary.md)

  ↳ [IUnary](../interfaces/_ast_.iunary.md)

  ↳ [Union](_ast_.union.md)

  ↳ [SortInfo](_ast_.sortinfo.md)

  ↳ [VariantDeclare](_ast_.variantdeclare.md)

  ↳ [Document](_ast_.document.md)

## Index

### Constructors

* [constructor](_ast_.ast.md#constructor)

### Properties

* [type](_ast_.ast.md#readonly-type)

### Methods

* [bracket](_ast_.ast.md#static-bracket)

## Constructors

###  constructor

\+ **new AST**(`type`: [SQL_SYMBOLE](../enums/_constants_.sql_symbole.md)): *[AST](_ast_.ast.md)*

Defined in src/ast.ts:68

**Parameters:**

Name | Type |
------ | ------ |
`type` | [SQL_SYMBOLE](../enums/_constants_.sql_symbole.md) |

**Returns:** *[AST](_ast_.ast.md)*

## Properties

### `Readonly` type

• **type**: *[SQL_SYMBOLE](../enums/_constants_.sql_symbole.md)*

Defined in src/ast.ts:73

## Methods

### `Static` bracket

▸ **bracket**‹**T**›(`context`: T): *[Bracket](_ast_.bracket.md)‹T›*

Defined in src/ast.ts:75

**Type parameters:**

▪ **T**: *[AST](_ast_.ast.md)*

**Parameters:**

Name | Type |
------ | ------ |
`context` | T |

**Returns:** *[Bracket](_ast_.bracket.md)‹T›*
