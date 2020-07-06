[lubejs](../README.md) › [Globals](../globals.md) › ["ast"](../modules/_ast_.md) › [SortInfo](_ast_.sortinfo.md)

# Class: SortInfo

## Hierarchy

* [AST](_ast_.ast.md)

  ↳ **SortInfo**

## Index

### Constructors

* [constructor](_ast_.sortinfo.md#constructor)

### Properties

* [direction](_ast_.sortinfo.md#optional-direction)
* [expr](_ast_.sortinfo.md#expr)
* [type](_ast_.sortinfo.md#readonly-type)

### Methods

* [bracket](_ast_.sortinfo.md#static-bracket)

## Constructors

###  constructor

\+ **new SortInfo**(`expr`: [UnsureExpression](../modules/_ast_.md#unsureexpression), `direction?`: [SORT_DIRECTION](../enums/_constants_.sort_direction.md)): *[SortInfo](_ast_.sortinfo.md)*

*Overrides [AST](_ast_.ast.md).[constructor](_ast_.ast.md#constructor)*

Defined in src/ast.ts:1865

**Parameters:**

Name | Type |
------ | ------ |
`expr` | [UnsureExpression](../modules/_ast_.md#unsureexpression) |
`direction?` | [SORT_DIRECTION](../enums/_constants_.sort_direction.md) |

**Returns:** *[SortInfo](_ast_.sortinfo.md)*

## Properties

### `Optional` direction

• **direction**? : *[SORT_DIRECTION](../enums/_constants_.sort_direction.md)*

Defined in src/ast.ts:1865

___

###  expr

• **expr**: *[Expression](_ast_.expression.md)*

Defined in src/ast.ts:1864

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
