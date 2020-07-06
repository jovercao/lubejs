[lubejs](../README.md) › [Globals](../globals.md) › ["ast"](../modules/_ast_.md) › [IUnary](_ast_.iunary.md)

# Interface: IUnary

## Hierarchy

* [AST](../classes/_ast_.ast.md)

  ↳ **IUnary**

## Implemented by

* [IsNotNullCondition](../classes/_ast_.isnotnullcondition.md)
* [IsNullCondition](../classes/_ast_.isnullcondition.md)
* [UnaryCompareCondition](../classes/_ast_.unarycomparecondition.md)
* [UnaryExpression](../classes/_ast_.unaryexpression.md)
* [UnaryLogicCondition](../classes/_ast_.unarylogiccondition.md)

## Index

### Constructors

* [constructor](_ast_.iunary.md#constructor)

### Properties

* [next](_ast_.iunary.md#next)
* [operator](_ast_.iunary.md#operator)
* [type](_ast_.iunary.md#readonly-type)

### Methods

* [bracket](_ast_.iunary.md#static-bracket)

## Constructors

###  constructor

\+ **new IUnary**(`type`: [SQL_SYMBOLE](../enums/_constants_.sql_symbole.md)): *[IUnary](_ast_.iunary.md)*

*Inherited from [AST](../classes/_ast_.ast.md).[constructor](../classes/_ast_.ast.md#constructor)*

Defined in src/ast.ts:65

**Parameters:**

Name | Type |
------ | ------ |
`type` | [SQL_SYMBOLE](../enums/_constants_.sql_symbole.md) |

**Returns:** *[IUnary](_ast_.iunary.md)*

## Properties

###  next

• **next**: *[AST](../classes/_ast_.ast.md)*

Defined in src/ast.ts:1715

___

###  operator

• **operator**: *String*

Defined in src/ast.ts:1714

___

### `Readonly` type

• **type**: *[SQL_SYMBOLE](../enums/_constants_.sql_symbole.md)*

*Inherited from [AST](../classes/_ast_.ast.md).[type](../classes/_ast_.ast.md#readonly-type)*

Defined in src/ast.ts:70

## Methods

### `Static` bracket

▸ **bracket**‹**T**›(`context`: T): *[Bracket](../classes/_ast_.bracket.md)‹T›*

*Inherited from [AST](../classes/_ast_.ast.md).[bracket](../classes/_ast_.ast.md#static-bracket)*

Defined in src/ast.ts:72

**Type parameters:**

▪ **T**: *[AST](../classes/_ast_.ast.md)*

**Parameters:**

Name | Type |
------ | ------ |
`context` | T |

**Returns:** *[Bracket](../classes/_ast_.bracket.md)‹T›*
