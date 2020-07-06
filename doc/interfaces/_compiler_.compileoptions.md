[lubejs](../README.md) › [Globals](../globals.md) › ["compiler"](../modules/_compiler_.md) › [CompileOptions](_compiler_.compileoptions.md)

# Interface: CompileOptions

编译选项

## Hierarchy

* **CompileOptions**

## Index

### Properties

* [parameterPrefix](_compiler_.compileoptions.md#optional-parameterprefix)
* [quotedLeft](_compiler_.compileoptions.md#optional-quotedleft)
* [quotedRight](_compiler_.compileoptions.md#optional-quotedright)
* [strict](_compiler_.compileoptions.md#optional-strict)
* [variantPrefix](_compiler_.compileoptions.md#optional-variantprefix)

## Properties

### `Optional` parameterPrefix

• **parameterPrefix**? : *string*

Defined in src/compiler.ts:50

参数前缀

___

### `Optional` quotedLeft

• **quotedLeft**? : *string*

Defined in src/compiler.ts:41

标识符引用，左

___

### `Optional` quotedRight

• **quotedRight**? : *string*

Defined in src/compiler.ts:45

标识符引用，右

___

### `Optional` strict

• **strict**? : *boolean*

Defined in src/compiler.ts:37

是否启用严格模式，默认启用
如果为false，则生成的SQL标识不会被[]或""包括

___

### `Optional` variantPrefix

• **variantPrefix**? : *string*

Defined in src/compiler.ts:55

变量前缀
