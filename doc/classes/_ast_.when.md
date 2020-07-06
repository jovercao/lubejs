[lubejs](../README.md) › [Globals](../globals.md) › ["ast"](../modules/_ast_.md) › [When](_ast_.when.md)

# Class: When

When语句

## Hierarchy

* [AST](_ast_.ast.md)

  ↳ **When**

## Index

### Constructors

* [constructor](_ast_.when.md#constructor)

### Properties

* [expr](_ast_.when.md#expr)
* [type](_ast_.when.md#readonly-type)
* [value](_ast_.when.md#value)

### Methods

* [then](_ast_.when.md#then)
* [bracket](_ast_.when.md#static-bracket)

## Constructors

###  constructor

\+ **new When**(`expr`: [UnsureExpression](../modules/_ast_.md#unsureexpression), `value?`: [UnsureExpression](../modules/_ast_.md#unsureexpression)): *[When](_ast_.when.md)*

*Overrides [AST](_ast_.ast.md).[constructor](_ast_.ast.md#constructor)*

Defined in src/ast.ts:1368

**Parameters:**

Name | Type |
------ | ------ |
`expr` | [UnsureExpression](../modules/_ast_.md#unsureexpression) |
`value?` | [UnsureExpression](../modules/_ast_.md#unsureexpression) |

**Returns:** *[When](_ast_.when.md)*

## Properties

###  expr

• **expr**: *[Expression](_ast_.expression.md)*

Defined in src/ast.ts:1367

___

### `Readonly` type

• **type**: *[SQL_SYMBOLE](../enums/_constants_.sql_symbole.md)*

*Inherited from [AST](_ast_.ast.md).[type](_ast_.ast.md#readonly-type)*

Defined in src/ast.ts:70

___

###  value

• **value**: *[Expression](_ast_.expression.md)*

Defined in src/ast.ts:1368

## Methods

###  then

▸ **then**(`value`: [UnsureExpression](../modules/_ast_.md#unsureexpression)): *void*

Defined in src/ast.ts:1378

**Parameters:**

Name | Type |
------ | ------ |
`value` | [UnsureExpression](../modules/_ast_.md#unsureexpression) |

**Returns:** *void*

___

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
