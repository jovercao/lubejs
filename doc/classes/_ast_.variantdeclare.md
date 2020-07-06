[lubejs](../README.md) › [Globals](../globals.md) › ["ast"](../modules/_ast_.md) › [VariantDeclare](_ast_.variantdeclare.md)

# Class: VariantDeclare

## Hierarchy

* [AST](_ast_.ast.md)

  ↳ **VariantDeclare**

## Index

### Constructors

* [constructor](_ast_.variantdeclare.md#constructor)

### Properties

* [dataType](_ast_.variantdeclare.md#datatype)
* [name](_ast_.variantdeclare.md#name)
* [type](_ast_.variantdeclare.md#readonly-type)

### Methods

* [bracket](_ast_.variantdeclare.md#static-bracket)

## Constructors

###  constructor

\+ **new VariantDeclare**(`name`: string, `dataType`: string): *[VariantDeclare](_ast_.variantdeclare.md)*

*Overrides [AST](_ast_.ast.md).[constructor](_ast_.ast.md#constructor)*

Defined in src/ast.ts:2207

**Parameters:**

Name | Type |
------ | ------ |
`name` | string |
`dataType` | string |

**Returns:** *[VariantDeclare](_ast_.variantdeclare.md)*

## Properties

###  dataType

• **dataType**: *string*

Defined in src/ast.ts:2215

___

###  name

• **name**: *string*

Defined in src/ast.ts:2214

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
