[lubejs](../README.md) › [Globals](../globals.md) › ["lube"](../modules/_lube_.md) › [IDbProvider](_lube_.idbprovider.md)

# Interface: IDbProvider

数据库提供驱动程序

## Hierarchy

* **IDbProvider**

## Index

### Properties

* [compiler](_lube_.idbprovider.md#optional-compiler)
* [ployfill](_lube_.idbprovider.md#optional-ployfill)

### Methods

* [beginTrans](_lube_.idbprovider.md#begintrans)
* [close](_lube_.idbprovider.md#close)
* [query](_lube_.idbprovider.md#query)

## Properties

### `Optional` compiler

• **compiler**? : *[Compiler](../classes/_compiler_.compiler.md)*

Defined in src/lube.ts:24

___

### `Optional` ployfill

• **ployfill**? : *[CompileOptions](_compiler_.compileoptions.md)*

Defined in src/lube.ts:23

## Methods

###  beginTrans

▸ **beginTrans**(`isolationLevel`: [ISOLATION_LEVEL](../enums/_constants_.isolation_level.md)): *[ITransaction](_lube_.itransaction.md)*

Defined in src/lube.ts:26

**Parameters:**

Name | Type |
------ | ------ |
`isolationLevel` | [ISOLATION_LEVEL](../enums/_constants_.isolation_level.md) |

**Returns:** *[ITransaction](_lube_.itransaction.md)*

___

###  close

▸ **close**(): *Promise‹void›*

Defined in src/lube.ts:27

**Returns:** *Promise‹void›*

___

###  query

▸ **query**(`sql`: any, `params`: any): *Promise‹[QueryResult](_executor_.queryresult.md)›*

Defined in src/lube.ts:25

**Parameters:**

Name | Type |
------ | ------ |
`sql` | any |
`params` | any |

**Returns:** *Promise‹[QueryResult](_executor_.queryresult.md)›*
