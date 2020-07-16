[lubejs](../README.md) › [Globals](../globals.md) › ["ast"](../modules/_ast_.md) › [IBinary](_ast_.ibinary.md)

# Interface: IBinary

## Hierarchy

* [AST](../classes/_ast_.ast.md)

  ↳ **IBinary**

## Implemented by

* [BinaryCalculate](../classes/_ast_.binarycalculate.md)
* [BinaryLogic](../classes/_ast_.binarylogic.md)

## Index

### Constructors

* [constructor](_ast_.ibinary.md#constructor)

### Properties

* [left](_ast_.ibinary.md#left)
* [operator](_ast_.ibinary.md#operator)
* [right](_ast_.ibinary.md#right)
* [type](_ast_.ibinary.md#readonly-type)

### Methods

* [bracket](_ast_.ibinary.md#static-bracket)

## Constructors

###  constructor

\+ **new IBinary**(`type`: [SQL_SYMBOLE](../enums/_constants_.sql_symbole.md)): *[IBinary](_ast_.ibinary.md)*

*Inherited from [AST](../classes/_ast_.ast.md).[constructor](../classes/_ast_.ast.md#constructor)*

Defined in src/ast.ts:68

**Parameters:**

Name | Type |
------ | ------ |
`type` | [SQL_SYMBOLE](../enums/_constants_.sql_symbole.md) |

**Returns:** *[IBinary](_ast_.ibinary.md)*

## Properties

###  left

• **left**: *[AST](../classes/_ast_.ast.md)*

Defined in src/ast.ts:1739

___

###  operator

• **operator**: *String*

Defined in src/ast.ts:1738

___

###  right

• **right**: *[AST](../classes/_ast_.ast.md)*

Defined in src/ast.ts:1740

___

### `Readonly` type

• **type**: *[SQL_SYMBOLE](../enums/_constants_.sql_symbole.md)*

*Inherited from [AST](../classes/_ast_.ast.md).[type](../classes/_ast_.ast.md#readonly-type)*

Defined in src/ast.ts:73

## Methods

### `Static` bracket

▸ **bracket**‹**T**›(`context`: T): *[Bracket](../classes/_ast_.bracket.md)‹T›*

*Inherited from [AST](../classes/_ast_.ast.md).[bracket](../classes/_ast_.ast.md#static-bracket)*

Defined in src/ast.ts:75

**Type parameters:**

▪ **T**: *[AST](../classes/_ast_.ast.md)*

**Parameters:**

Name | Type |
------ | ------ |
`context` | T |

**Returns:** *[Bracket](../classes/_ast_.bracket.md)‹T›*
