[lubejs](../README.md) › [Globals](../globals.md) › ["lube"](../modules/_lube_.md) › [IDbProvider](_lube_.idbprovider.md)

# Interface: IDbProvider

数据库提供驱动程序

## Hierarchy

* **IDbProvider**

## Index

### Properties

* [compiler](_lube_.idbprovider.md#readonly-compiler)

### Methods

* [beginTrans](_lube_.idbprovider.md#begintrans)
* [close](_lube_.idbprovider.md#close)
* [query](_lube_.idbprovider.md#query)

## Properties

### `Readonly` compiler

• **compiler**: *[Compiler](../classes/_compile_.compiler.md)*

Defined in lube.ts:84

必须实现编译器

## Methods

###  beginTrans

▸ **beginTrans**(`isolationLevel`: [ISOLATION_LEVEL](../enums/_constants_.isolation_level.md)): *Promise‹[Transaction](_lube_.transaction.md)›*

Defined in lube.ts:86

**Parameters:**

Name | Type |
------ | ------ |
`isolationLevel` | [ISOLATION_LEVEL](../enums/_constants_.isolation_level.md) |

**Returns:** *Promise‹[Transaction](_lube_.transaction.md)›*

___

###  close

▸ **close**(): *Promise‹void›*

Defined in lube.ts:87

**Returns:** *Promise‹void›*

___

###  query

▸ **query**(`sql`: string, `params`: [Parameter](../classes/_ast_.parameter.md)[]): *Promise‹[QueryResult](_execute_.queryresult.md)‹any, any, any››*

Defined in lube.ts:85

**Parameters:**

Name | Type |
------ | ------ |
`sql` | string |
`params` | [Parameter](../classes/_ast_.parameter.md)[] |

**Returns:** *Promise‹[QueryResult](_execute_.queryresult.md)‹any, any, any››*
