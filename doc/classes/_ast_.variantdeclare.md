[lubejs](../README.md) › [Globals](../globals.md) › ["ast"](../modules/_ast_.md) › [VariantDeclare](_ast_.variantdeclare.md)

# Class: VariantDeclare

## Hierarchy

* [AST](_ast_.ast.md)

  ↳ **VariantDeclare**

## Index

### Constructors

* [constructor](_ast_.variantdeclare.md#constructor)

### Properties

* [$dataType](_ast_.variantdeclare.md#datatype)
* [$name](_ast_.variantdeclare.md#name)
* [$type](_ast_.variantdeclare.md#readonly-type)

### Methods

* [clone](_ast_.variantdeclare.md#clone)

## Constructors

###  constructor

\+ **new VariantDeclare**(`name`: string | [Variant](_ast_.variant.md), `dataType`: [DbType](../modules/_types_.md#dbtype)): *[VariantDeclare](_ast_.variantdeclare.md)*

Defined in ast.ts:3932

**Parameters:**

Name | Type |
------ | ------ |
`name` | string &#124; [Variant](_ast_.variant.md) |
`dataType` | [DbType](../modules/_types_.md#dbtype) |

**Returns:** *[VariantDeclare](_ast_.variantdeclare.md)*

## Properties

###  $dataType

• **$dataType**: *[DbType](../modules/_types_.md#dbtype)*

Defined in ast.ts:3941

___

###  $name

• **$name**: *[Variant](_ast_.variant.md)*

Defined in ast.ts:3940

___

### `Readonly` $type

• **$type**: *[VARAINT_DECLARE](../enums/_constants_.sql_symbole.md#varaint_declare)* = SQL_SYMBOLE.VARAINT_DECLARE

*Overrides [AST](_ast_.ast.md).[$type](_ast_.ast.md#readonly-type)*

Defined in ast.ts:3932

## Methods

###  clone

▸ **clone**(): *this*

*Inherited from [AST](_ast_.ast.md).[clone](_ast_.ast.md#clone)*

Defined in ast.ts:285

克隆自身

**Returns:** *this*
