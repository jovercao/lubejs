[lubejs](../README.md) › [Globals](../globals.md) › ["ast"](../modules/_ast_.md) › [Union](_ast_.union.md)

# Class: Union ‹**T**›

联接查询

## Type parameters

▪ **T**: *[RowObject](../modules/_ast_.md#rowobject)*

## Hierarchy

* [AST](_ast_.ast.md)

  ↳ **Union**

## Index

### Constructors

* [constructor](_ast_.union.md#constructor)

### Properties

* [$all](_ast_.union.md#all)
* [$isRecurse](_ast_.union.md#isrecurse)
* [$select](_ast_.union.md#select)
* [$type](_ast_.union.md#type)

### Methods

* [clone](_ast_.union.md#clone)

## Constructors

###  constructor

\+ **new Union**(`select`: [Select](_ast_.select.md)‹T›, `all`: boolean): *[Union](_ast_.union.md)*

Defined in ast.ts:3307

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`select` | [Select](_ast_.select.md)‹T› | - | SELECT语句 |
`all` | boolean | false | 是否所有查询  |

**Returns:** *[Union](_ast_.union.md)*

## Properties

###  $all

• **$all**: *boolean*

Defined in ast.ts:3305

___

###  $isRecurse

• **$isRecurse**: *boolean*

Defined in ast.ts:3307

___

###  $select

• **$select**: *[Select](_ast_.select.md)‹T›*

Defined in ast.ts:3304

___

###  $type

• **$type**: *[UNION](../enums/_constants_.sql_symbole.md#union)* = SQL_SYMBOLE.UNION

*Overrides [AST](_ast_.ast.md).[$type](_ast_.ast.md#readonly-type)*

Defined in ast.ts:3306

## Methods

###  clone

▸ **clone**(): *this*

*Inherited from [AST](_ast_.ast.md).[clone](_ast_.ast.md#clone)*

Defined in ast.ts:285

克隆自身

**Returns:** *this*
