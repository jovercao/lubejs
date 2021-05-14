[lubejs](../README.md) › [Globals](../globals.md) › ["lube"](_lube_.md)

# Module: "lube"

## Index

### Classes

* [Lube](../classes/_lube_.lube.md)

### Interfaces

* [Driver](../interfaces/_lube_.driver.md)
* [IDbProvider](../interfaces/_lube_.idbprovider.md)
* [Transaction](../interfaces/_lube_.transaction.md)

### Type aliases

* [ConnectOptions](_lube_.md#connectoptions)
* [TransactionHandler](_lube_.md#transactionhandler)

### Functions

* [connect](_lube_.md#connect)
* [register](_lube_.md#register)

### Object literals

* [defaultConnectOptions](_lube_.md#const-defaultconnectoptions)
* [dialects](_lube_.md#const-dialects)

## Type aliases

###  ConnectOptions

Ƭ **ConnectOptions**: *object*

Defined in lube.ts:9

#### Type declaration:

* **compileOptions**? : *[CompileOptions](../interfaces/_compile_.compileoptions.md)*

* **connectionTimeout**? : *number*

* **database**: *string*

* **dialect**? : *string*

* **driver**? : *[Driver](../interfaces/_lube_.driver.md)*

* **host**: *string*

* **maxConnections**: *number*

* **minConnections**: *number*

* **password**: *string*

* **port**? : *number*

* **recoveryConnection**: *number*

* **requestTimeout**? : *number*

* **user**: *string*

___

###  TransactionHandler

Ƭ **TransactionHandler**: *function*

Defined in lube.ts:71

#### Type declaration:

▸ (`executor`: [Executor](../classes/_execute_.executor.md), `abort`: function): *Promise‹T›*

**Parameters:**

▪ **executor**: *[Executor](../classes/_execute_.executor.md)*

▪ **abort**: *function*

▸ (): *Promise‹void›*

## Functions

###  connect

▸ **connect**(`url`: string): *Promise‹[Lube](../classes/_lube_.lube.md)›*

Defined in lube.ts:176

连接数据库并返回一个连接池

**Parameters:**

Name | Type |
------ | ------ |
`url` | string |

**Returns:** *Promise‹[Lube](../classes/_lube_.lube.md)›*

▸ **connect**(`options`: [ConnectOptions](_lube_.md#connectoptions)): *Promise‹[Lube](../classes/_lube_.lube.md)›*

Defined in lube.ts:177

**Parameters:**

Name | Type |
------ | ------ |
`options` | [ConnectOptions](_lube_.md#connectoptions) |

**Returns:** *Promise‹[Lube](../classes/_lube_.lube.md)›*

___

###  register

▸ **register**(`name`: string, `driver`: [Driver](../interfaces/_lube_.driver.md) | string): *Promise‹void›*

Defined in lube.ts:241

注册一个方言支持

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`name` | string | - |
`driver` | [Driver](../interfaces/_lube_.driver.md) &#124; string | 驱动可以是connect函数，亦可以是npm包或路径  |

**Returns:** *Promise‹void›*

## Object literals

### `Const` defaultConnectOptions

### ▪ **defaultConnectOptions**: *object*

Defined in lube.ts:64

###  connectionTimeout

• **connectionTimeout**: *number* = 30

Defined in lube.ts:65

###  maxConnections

• **maxConnections**: *number* = 5

Defined in lube.ts:68

###  minConnections

• **minConnections**: *number* = 0

Defined in lube.ts:67

###  requestTimeout

• **requestTimeout**: *number* = 10 * 60

Defined in lube.ts:66

___

### `Const` dialects

### ▪ **dialects**: *object*

Defined in lube.ts:251

###  mssql

• **mssql**: *string* = "lubejs-mssql"

Defined in lube.ts:252
