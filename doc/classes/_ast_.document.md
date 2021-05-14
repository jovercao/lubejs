[lubejs](../README.md) › [Globals](../globals.md) › ["ast"](../modules/_ast_.md) › [Document](_ast_.document.md)

# Class: Document

SQL 文档

## Hierarchy

* [AST](_ast_.ast.md)

  ↳ **Document**

## Index

### Constructors

* [constructor](_ast_.document.md#constructor)

### Properties

* [$type](_ast_.document.md#type)
* [statements](_ast_.document.md#statements)

### Methods

* [append](_ast_.document.md#append)
* [clone](_ast_.document.md#clone)

## Constructors

###  constructor

\+ **new Document**(`statements`: [Statement](_ast_.statement.md)[]): *[Document](_ast_.document.md)*

Defined in ast.ts:4027

**Parameters:**

Name | Type |
------ | ------ |
`statements` | [Statement](_ast_.statement.md)[] |

**Returns:** *[Document](_ast_.document.md)*

## Properties

###  $type

• **$type**: *[DOCUMENT](../enums/_constants_.sql_symbole.md#document)* = SQL_SYMBOLE.DOCUMENT

*Overrides [AST](_ast_.ast.md).[$type](_ast_.ast.md#readonly-type)*

Defined in ast.ts:4027

___

###  statements

• **statements**: *[Statement](_ast_.statement.md)[]*

Defined in ast.ts:4026

## Methods

###  append

▸ **append**(`sql`: [Statement](_ast_.statement.md)): *void*

Defined in ast.ts:4034

**Parameters:**

Name | Type |
------ | ------ |
`sql` | [Statement](_ast_.statement.md) |

**Returns:** *void*

___

###  clone

▸ **clone**(): *this*

*Inherited from [AST](_ast_.ast.md).[clone](_ast_.ast.md#clone)*

Defined in ast.ts:285

克隆自身

**Returns:** *this*
