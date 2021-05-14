[lubejs](../README.md) › [Globals](../globals.md) › ["ast"](../modules/_ast_.md) › [When](_ast_.when.md)

# Class: When ‹**T**›

When语句

## Type parameters

▪ **T**: *[ScalarType](../modules/_types_.md#scalartype)*

## Hierarchy

* [AST](_ast_.ast.md)

  ↳ **When**

## Index

### Constructors

* [constructor](_ast_.when.md#constructor)

### Properties

* [$expr](_ast_.when.md#expr)
* [$type](_ast_.when.md#type)
* [$value](_ast_.when.md#value)

### Methods

* [clone](_ast_.when.md#clone)

## Constructors

###  constructor

\+ **new When**(`expr`: [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹[ScalarType](../modules/_types_.md#scalartype)› | [Condition](_ast_.condition.md), `then`: [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹T›): *[When](_ast_.when.md)*

Defined in ast.ts:3127

**Parameters:**

Name | Type |
------ | ------ |
`expr` | [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹[ScalarType](../modules/_types_.md#scalartype)› &#124; [Condition](_ast_.condition.md) |
`then` | [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹T› |

**Returns:** *[When](_ast_.when.md)*

## Properties

###  $expr

• **$expr**: *[Expression](_ast_.expression.md)‹[ScalarType](../modules/_types_.md#scalartype)› | [Condition](_ast_.condition.md)*

Defined in ast.ts:3125

___

###  $type

• **$type**: *[WHEN](../enums/_constants_.sql_symbole.md#when)* = SQL_SYMBOLE.WHEN

*Overrides [AST](_ast_.ast.md).[$type](_ast_.ast.md#readonly-type)*

Defined in ast.ts:3127

___

###  $value

• **$value**: *[Expression](_ast_.expression.md)‹T›*

Defined in ast.ts:3126

## Methods

###  clone

▸ **clone**(): *this*

*Inherited from [AST](_ast_.ast.md).[clone](_ast_.ast.md#clone)*

Defined in ast.ts:285

克隆自身

**Returns:** *this*
