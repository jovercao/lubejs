[lubejs](../README.md) › [Globals](../globals.md) › ["ast"](../modules/_ast_.md) › [Join](_ast_.join.md)

# Class: Join

联接查询

## Hierarchy

* [AST](_ast_.ast.md)

  ↳ **Join**

## Index

### Constructors

* [constructor](_ast_.join.md#constructor)

### Properties

* [$left](_ast_.join.md#left)
* [$on](_ast_.join.md#on)
* [$table](_ast_.join.md#table)
* [$type](_ast_.join.md#readonly-type)

### Methods

* [clone](_ast_.join.md#clone)

## Constructors

###  constructor

\+ **new Join**(`table`: [Name](../modules/_ast_.md#name)‹string› | [Rowset](_ast_.rowset.md), `on`: [Condition](_ast_.condition.md), `left`: boolean): *[Join](_ast_.join.md)*

Defined in ast.ts:1170

创建一个表关联

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`table` | [Name](../modules/_ast_.md#name)‹string› &#124; [Rowset](_ast_.rowset.md) | - | - |
`on` | [Condition](_ast_.condition.md) | - | 关联条件 |
`left` | boolean | false | 是否左联接  |

**Returns:** *[Join](_ast_.join.md)*

## Properties

###  $left

• **$left**: *boolean*

Defined in ast.ts:1168

___

###  $on

• **$on**: *[Condition](_ast_.condition.md)*

Defined in ast.ts:1170

___

###  $table

• **$table**: *[Rowset](_ast_.rowset.md)*

Defined in ast.ts:1169

___

### `Readonly` $type

• **$type**: *[JOIN](../enums/_constants_.sql_symbole.md#join)* = SQL_SYMBOLE.JOIN

*Overrides [AST](_ast_.ast.md).[$type](_ast_.ast.md#readonly-type)*

Defined in ast.ts:1167

## Methods

###  clone

▸ **clone**(): *this*

*Inherited from [AST](_ast_.ast.md).[clone](_ast_.ast.md#clone)*

Defined in ast.ts:285

克隆自身

**Returns:** *this*
