[lubejs](../README.md) › [Globals](../globals.md) › ["ast"](../modules/_ast_.md) › [Raw](_ast_.raw.md)

# Class: Raw

源始SQL，用于将SQL代码插入语句任何部位

## Hierarchy

* [AST](_ast_.ast.md)

  ↳ **Raw**

## Index

### Constructors

* [constructor](_ast_.raw.md#constructor)

### Properties

* [$sql](_ast_.raw.md#sql)
* [$type](_ast_.raw.md#readonly-type)

### Methods

* [clone](_ast_.raw.md#clone)

## Constructors

###  constructor

\+ **new Raw**(`sql`: string): *[Raw](_ast_.raw.md)*

Defined in ast.ts:4045

**Parameters:**

Name | Type |
------ | ------ |
`sql` | string |

**Returns:** *[Raw](_ast_.raw.md)*

## Properties

###  $sql

• **$sql**: *string*

Defined in ast.ts:4045

___

### `Readonly` $type

• **$type**: *[RAW](../enums/_constants_.sql_symbole.md#raw)* = SQL_SYMBOLE.RAW

*Overrides [AST](_ast_.ast.md).[$type](_ast_.ast.md#readonly-type)*

Defined in ast.ts:4043

## Methods

###  clone

▸ **clone**(): *this*

*Inherited from [AST](_ast_.ast.md).[clone](_ast_.ast.md#clone)*

Defined in ast.ts:285

克隆自身

**Returns:** *this*
