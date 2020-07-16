[lubejs](../README.md) › [Globals](../globals.md) › ["lube"](../modules/_lube_.md) › [ConnectOptions](_lube_.connectoptions.md)

# Interface: ConnectOptions

## Hierarchy

* **ConnectOptions**

## Index

### Properties

* [database](_lube_.connectoptions.md#database)
* [dialect](_lube_.connectoptions.md#optional-dialect)
* [driver](_lube_.connectoptions.md#optional-driver)
* [host](_lube_.connectoptions.md#host)
* [idelTimeout](_lube_.connectoptions.md#ideltimeout)
* [password](_lube_.connectoptions.md#password)
* [poolMax](_lube_.connectoptions.md#poolmax)
* [poolMin](_lube_.connectoptions.md#poolmin)
* [port](_lube_.connectoptions.md#optional-port)
* [strict](_lube_.connectoptions.md#optional-strict)
* [user](_lube_.connectoptions.md#user)

## Properties

###  database

• **database**: *string*

Defined in src/lube.ts:99

___

### `Optional` dialect

• **dialect**? : *string*

Defined in src/lube.ts:90

数据库方言，必须安装相应的驱动才可正常使用

___

### `Optional` driver

• **driver**? : *function*

Defined in src/lube.ts:94

驱动程序，与dialect二选一

#### Type declaration:

▸ (`config`: [ConnectOptions](_lube_.connectoptions.md)): *[IDbProvider](_lube_.idbprovider.md)*

**Parameters:**

Name | Type |
------ | ------ |
`config` | [ConnectOptions](_lube_.connectoptions.md) |

___

###  host

• **host**: *string*

Defined in src/lube.ts:95

___

###  idelTimeout

• **idelTimeout**: *number*

Defined in src/lube.ts:102

___

###  password

• **password**: *string*

Defined in src/lube.ts:98

___

###  poolMax

• **poolMax**: *number*

Defined in src/lube.ts:100

___

###  poolMin

• **poolMin**: *number*

Defined in src/lube.ts:101

___

### `Optional` port

• **port**? : *number*

Defined in src/lube.ts:96

___

### `Optional` strict

• **strict**? : *boolean*

Defined in src/lube.ts:103

___

###  user

• **user**: *string*

Defined in src/lube.ts:97
