[lubejs](../README.md) › [Globals](../globals.md) › ["ast"](../modules/_ast_.md) › [SortInfo](_ast_.sortinfo.md)

# Class: SortInfo

## Hierarchy

* [AST](_ast_.ast.md)

  ↳ **SortInfo**

## Index

### Constructors

* [constructor](_ast_.sortinfo.md#constructor)

### Properties

* [$direction](_ast_.sortinfo.md#optional-direction)
* [$expr](_ast_.sortinfo.md#expr)
* [$type](_ast_.sortinfo.md#type)

### Methods

* [clone](_ast_.sortinfo.md#clone)

## Constructors

###  constructor

\+ **new SortInfo**(`expr`: [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹[ScalarType](../modules/_types_.md#scalartype)›, `direction?`: [SORT_DIRECTION](../enums/_constants_.sort_direction.md)): *[SortInfo](_ast_.sortinfo.md)*

Defined in ast.ts:3398

**Parameters:**

Name | Type |
------ | ------ |
`expr` | [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹[ScalarType](../modules/_types_.md#scalartype)› |
`direction?` | [SORT_DIRECTION](../enums/_constants_.sort_direction.md) |

**Returns:** *[SortInfo](_ast_.sortinfo.md)*

## Properties

### `Optional` $direction

• **$direction**? : *[SORT_DIRECTION](../enums/_constants_.sort_direction.md)*

Defined in ast.ts:3398

___

###  $expr

• **$expr**: *[Expression](_ast_.expression.md)‹[ScalarType](../modules/_types_.md#scalartype)›*

Defined in ast.ts:3397

___

###  $type

• **$type**: *[SORT](../enums/_constants_.sql_symbole.md#sort)* = SQL_SYMBOLE.SORT

*Overrides [AST](_ast_.ast.md).[$type](_ast_.ast.md#readonly-type)*

Defined in ast.ts:3396

## Methods

###  clone

▸ **clone**(): *this*

*Inherited from [AST](_ast_.ast.md).[clone](_ast_.ast.md#clone)*

Defined in ast.ts:285

克隆自身

**Returns:** *this*
