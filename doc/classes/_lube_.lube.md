[lubejs](../README.md) › [Globals](../globals.md) › ["lube"](../modules/_lube_.md) › [Lube](_lube_.lube.md)

# Class: Lube

## Hierarchy

  ↳ [Executor](_executor_.executor.md)

  ↳ **Lube**

## Index

### Constructors

* [constructor](_lube_.lube.md#constructor)

### Properties

* [_provider](_lube_.lube.md#private-_provider)
* [compiler](_lube_.lube.md#readonly-compiler)
* [doQuery](_lube_.lube.md#doquery)
* [isTrans](_lube_.lube.md#readonly-istrans)

### Methods

* [addListener](_lube_.lube.md#addlistener)
* [close](_lube_.lube.md#close)
* [delete](_lube_.lube.md#delete)
* [emit](_lube_.lube.md#emit)
* [eventNames](_lube_.lube.md#eventnames)
* [execute](_lube_.lube.md#execute)
* [find](_lube_.lube.md#find)
* [getMaxListeners](_lube_.lube.md#getmaxlisteners)
* [insert](_lube_.lube.md#insert)
* [listenerCount](_lube_.lube.md#listenercount)
* [listeners](_lube_.lube.md#listeners)
* [off](_lube_.lube.md#off)
* [on](_lube_.lube.md#on)
* [once](_lube_.lube.md#once)
* [prependListener](_lube_.lube.md#prependlistener)
* [prependOnceListener](_lube_.lube.md#prependoncelistener)
* [query](_lube_.lube.md#query)
* [queryScalar](_lube_.lube.md#queryscalar)
* [rawListeners](_lube_.lube.md#rawlisteners)
* [removeAllListeners](_lube_.lube.md#removealllisteners)
* [removeListener](_lube_.lube.md#removelistener)
* [select](_lube_.lube.md#select)
* [setMaxListeners](_lube_.lube.md#setmaxlisteners)
* [trans](_lube_.lube.md#trans)
* [update](_lube_.lube.md#update)

## Constructors

###  constructor

\+ **new Lube**(`provider`: [IDbProvider](../interfaces/_lube_.idbprovider.md), `options`: [ConnectOptions](../interfaces/_lube_.connectoptions.md)): *[Lube](_lube_.lube.md)*

*Overrides [Executor](_executor_.executor.md).[constructor](_executor_.executor.md#protected-constructor)*

Defined in src/lube.ts:32

**Parameters:**

Name | Type |
------ | ------ |
`provider` | [IDbProvider](../interfaces/_lube_.idbprovider.md) |
`options` | [ConnectOptions](../interfaces/_lube_.connectoptions.md) |

**Returns:** *[Lube](_lube_.lube.md)*

## Properties

### `Private` _provider

• **_provider**: *[IDbProvider](../interfaces/_lube_.idbprovider.md)*

Defined in src/lube.ts:32

___

### `Readonly` compiler

• **compiler**: *[Compiler](_compiler_.compiler.md)*

*Inherited from [Lube](_lube_.lube.md).[compiler](_lube_.lube.md#readonly-compiler)*

Defined in src/executor.ts:97

___

###  doQuery

• **doQuery**: *[QueryHandler](../interfaces/_executor_.queryhandler.md)*

*Inherited from [Lube](_lube_.lube.md).[doQuery](_lube_.lube.md#doquery)*

Defined in src/executor.ts:96

___

### `Readonly` isTrans

• **isTrans**: *boolean*

*Inherited from [Lube](_lube_.lube.md).[isTrans](_lube_.lube.md#readonly-istrans)*

Defined in src/executor.ts:99

## Methods

###  addListener

▸ **addListener**(`event`: string | symbol, `listener`: function): *this*

*Inherited from [Lube](_lube_.lube.md).[addListener](_lube_.lube.md#addlistener)*

Defined in node_modules/@types/node/globals.d.ts:553

**Parameters:**

▪ **event**: *string | symbol*

▪ **listener**: *function*

▸ (...`args`: any[]): *void*

**Parameters:**

Name | Type |
------ | ------ |
`...args` | any[] |

**Returns:** *this*

___

###  close

▸ **close**(): *Promise‹void›*

Defined in src/lube.ts:81

**Returns:** *Promise‹void›*

___

###  delete

▸ **delete**(`table`: [UnsureIdentifier](../modules/_lube_.md#unsureidentifier), `where?`: [UnsureCondition](../modules/_lube_.md#unsurecondition)): *Promise‹number›*

*Inherited from [Lube](_lube_.lube.md).[delete](_lube_.lube.md#delete)*

Defined in src/executor.ts:309

**Parameters:**

Name | Type |
------ | ------ |
`table` | [UnsureIdentifier](../modules/_lube_.md#unsureidentifier) |
`where?` | [UnsureCondition](../modules/_lube_.md#unsurecondition) |

**Returns:** *Promise‹number›*

___

###  emit

▸ **emit**(`event`: string | symbol, ...`args`: any[]): *boolean*

*Inherited from [Lube](_lube_.lube.md).[emit](_lube_.lube.md#emit)*

Defined in node_modules/@types/node/globals.d.ts:563

**Parameters:**

Name | Type |
------ | ------ |
`event` | string &#124; symbol |
`...args` | any[] |

**Returns:** *boolean*

___

###  eventNames

▸ **eventNames**(): *Array‹string | symbol›*

*Inherited from [Lube](_lube_.lube.md).[eventNames](_lube_.lube.md#eventnames)*

Defined in node_modules/@types/node/globals.d.ts:568

**Returns:** *Array‹string | symbol›*

___

###  execute

▸ **execute**‹**T**›(`spname`: [UnsureIdentifier](../modules/_lube_.md#unsureidentifier), `params`: [UnsureExpression](../modules/_lube_.md#unsureexpression)[]): *Promise‹[QueryResult](../interfaces/_executor_.queryresult.md)‹T››*

*Inherited from [Lube](_lube_.lube.md).[execute](_lube_.lube.md#execute)*

Defined in src/executor.ts:316

**Type parameters:**

▪ **T**

**Parameters:**

Name | Type |
------ | ------ |
`spname` | [UnsureIdentifier](../modules/_lube_.md#unsureidentifier) |
`params` | [UnsureExpression](../modules/_lube_.md#unsureexpression)[] |

**Returns:** *Promise‹[QueryResult](../interfaces/_executor_.queryresult.md)‹T››*

▸ **execute**‹**T**›(`spname`: [UnsureIdentifier](../modules/_lube_.md#unsureidentifier), `params`: [Parameter](_ast_.parameter.md)[]): *Promise‹[QueryResult](../interfaces/_executor_.queryresult.md)‹T››*

*Inherited from [Lube](_lube_.lube.md).[execute](_lube_.lube.md#execute)*

Defined in src/executor.ts:317

**Type parameters:**

▪ **T**

**Parameters:**

Name | Type |
------ | ------ |
`spname` | [UnsureIdentifier](../modules/_lube_.md#unsureidentifier) |
`params` | [Parameter](_ast_.parameter.md)[] |

**Returns:** *Promise‹[QueryResult](../interfaces/_executor_.queryresult.md)‹T››*

___

###  find

▸ **find**‹**T**›(`table`: [UnsureIdentifier](../modules/_lube_.md#unsureidentifier), `where`: [UnsureCondition](../modules/_lube_.md#unsurecondition), `fields?`: string[]): *Promise‹T›*

*Inherited from [Lube](_lube_.lube.md).[find](_lube_.lube.md#find)*

Defined in src/executor.ts:244

**Type parameters:**

▪ **T**

**Parameters:**

Name | Type |
------ | ------ |
`table` | [UnsureIdentifier](../modules/_lube_.md#unsureidentifier) |
`where` | [UnsureCondition](../modules/_lube_.md#unsurecondition) |
`fields?` | string[] |

**Returns:** *Promise‹T›*

___

###  getMaxListeners

▸ **getMaxListeners**(): *number*

*Inherited from [Lube](_lube_.lube.md).[getMaxListeners](_lube_.lube.md#getmaxlisteners)*

Defined in node_modules/@types/node/globals.d.ts:560

**Returns:** *number*

___

###  insert

▸ **insert**(`table`: [UnsureIdentifier](../modules/_lube_.md#unsureidentifier), `select`: [Select](_ast_.select.md)): *Promise‹number›*

*Inherited from [Lube](_lube_.lube.md).[insert](_lube_.lube.md#insert)*

Defined in src/executor.ts:196

插入数据的快捷操作

**Parameters:**

Name | Type |
------ | ------ |
`table` | [UnsureIdentifier](../modules/_lube_.md#unsureidentifier) |
`select` | [Select](_ast_.select.md) |

**Returns:** *Promise‹number›*

▸ **insert**(`table`: [UnsureIdentifier](../modules/_lube_.md#unsureidentifier), `fields`: [UnsureIdentifier](../modules/_lube_.md#unsureidentifier)[], `select`: [Select](_ast_.select.md)): *Promise‹number›*

*Inherited from [Lube](_lube_.lube.md).[insert](_lube_.lube.md#insert)*

Defined in src/executor.ts:197

**Parameters:**

Name | Type |
------ | ------ |
`table` | [UnsureIdentifier](../modules/_lube_.md#unsureidentifier) |
`fields` | [UnsureIdentifier](../modules/_lube_.md#unsureidentifier)[] |
`select` | [Select](_ast_.select.md) |

**Returns:** *Promise‹number›*

▸ **insert**(`table`: [UnsureIdentifier](../modules/_lube_.md#unsureidentifier), `rows`: [UnsureExpression](../modules/_lube_.md#unsureexpression)[][]): *Promise‹number›*

*Inherited from [Lube](_lube_.lube.md).[insert](_lube_.lube.md#insert)*

Defined in src/executor.ts:198

**Parameters:**

Name | Type |
------ | ------ |
`table` | [UnsureIdentifier](../modules/_lube_.md#unsureidentifier) |
`rows` | [UnsureExpression](../modules/_lube_.md#unsureexpression)[][] |

**Returns:** *Promise‹number›*

▸ **insert**(`table`: [UnsureIdentifier](../modules/_lube_.md#unsureidentifier), `row`: [UnsureExpression](../modules/_lube_.md#unsureexpression)[]): *Promise‹number›*

*Inherited from [Lube](_lube_.lube.md).[insert](_lube_.lube.md#insert)*

Defined in src/executor.ts:199

**Parameters:**

Name | Type |
------ | ------ |
`table` | [UnsureIdentifier](../modules/_lube_.md#unsureidentifier) |
`row` | [UnsureExpression](../modules/_lube_.md#unsureexpression)[] |

**Returns:** *Promise‹number›*

▸ **insert**(`table`: [UnsureIdentifier](../modules/_lube_.md#unsureidentifier), `fields`: [UnsureIdentifier](../modules/_lube_.md#unsureidentifier)[], `row`: [UnsureExpression](../modules/_lube_.md#unsureexpression)[]): *Promise‹number›*

*Inherited from [Lube](_lube_.lube.md).[insert](_lube_.lube.md#insert)*

Defined in src/executor.ts:200

**Parameters:**

Name | Type |
------ | ------ |
`table` | [UnsureIdentifier](../modules/_lube_.md#unsureidentifier) |
`fields` | [UnsureIdentifier](../modules/_lube_.md#unsureidentifier)[] |
`row` | [UnsureExpression](../modules/_lube_.md#unsureexpression)[] |

**Returns:** *Promise‹number›*

▸ **insert**(`table`: [UnsureIdentifier](../modules/_lube_.md#unsureidentifier), `fields`: [UnsureIdentifier](../modules/_lube_.md#unsureidentifier)[], `rows`: [UnsureExpression](../modules/_lube_.md#unsureexpression)[][]): *Promise‹number›*

*Inherited from [Lube](_lube_.lube.md).[insert](_lube_.lube.md#insert)*

Defined in src/executor.ts:201

**Parameters:**

Name | Type |
------ | ------ |
`table` | [UnsureIdentifier](../modules/_lube_.md#unsureidentifier) |
`fields` | [UnsureIdentifier](../modules/_lube_.md#unsureidentifier)[] |
`rows` | [UnsureExpression](../modules/_lube_.md#unsureexpression)[][] |

**Returns:** *Promise‹number›*

▸ **insert**‹**T**›(`table`: [UnsureIdentifier](../modules/_lube_.md#unsureidentifier), `items`: T[]): *Promise‹number›*

*Inherited from [Lube](_lube_.lube.md).[insert](_lube_.lube.md#insert)*

Defined in src/executor.ts:202

**Type parameters:**

▪ **T**: *[KeyValueObject](../interfaces/_ast_.keyvalueobject.md)*

**Parameters:**

Name | Type |
------ | ------ |
`table` | [UnsureIdentifier](../modules/_lube_.md#unsureidentifier) |
`items` | T[] |

**Returns:** *Promise‹number›*

▸ **insert**‹**T**›(`table`: [UnsureIdentifier](../modules/_lube_.md#unsureidentifier), `item`: T): *Promise‹number›*

*Inherited from [Lube](_lube_.lube.md).[insert](_lube_.lube.md#insert)*

Defined in src/executor.ts:203

**Type parameters:**

▪ **T**: *[KeyValueObject](../interfaces/_ast_.keyvalueobject.md)*

**Parameters:**

Name | Type |
------ | ------ |
`table` | [UnsureIdentifier](../modules/_lube_.md#unsureidentifier) |
`item` | T |

**Returns:** *Promise‹number›*

▸ **insert**‹**T**›(`table`: [UnsureIdentifier](../modules/_lube_.md#unsureidentifier), `fields`: [UnsureIdentifier](../modules/_lube_.md#unsureidentifier)[], `items`: T[]): *Promise‹number›*

*Inherited from [Lube](_lube_.lube.md).[insert](_lube_.lube.md#insert)*

Defined in src/executor.ts:204

**Type parameters:**

▪ **T**: *[KeyValueObject](../interfaces/_ast_.keyvalueobject.md)*

**Parameters:**

Name | Type |
------ | ------ |
`table` | [UnsureIdentifier](../modules/_lube_.md#unsureidentifier) |
`fields` | [UnsureIdentifier](../modules/_lube_.md#unsureidentifier)[] |
`items` | T[] |

**Returns:** *Promise‹number›*

▸ **insert**‹**T**›(`table`: [UnsureIdentifier](../modules/_lube_.md#unsureidentifier), `fields`: [UnsureIdentifier](../modules/_lube_.md#unsureidentifier)[], `item`: T): *Promise‹number›*

*Inherited from [Lube](_lube_.lube.md).[insert](_lube_.lube.md#insert)*

Defined in src/executor.ts:205

**Type parameters:**

▪ **T**: *[KeyValueObject](../interfaces/_ast_.keyvalueobject.md)*

**Parameters:**

Name | Type |
------ | ------ |
`table` | [UnsureIdentifier](../modules/_lube_.md#unsureidentifier) |
`fields` | [UnsureIdentifier](../modules/_lube_.md#unsureidentifier)[] |
`item` | T |

**Returns:** *Promise‹number›*

___

###  listenerCount

▸ **listenerCount**(`type`: string | symbol): *number*

*Inherited from [Lube](_lube_.lube.md).[listenerCount](_lube_.lube.md#listenercount)*

Defined in node_modules/@types/node/globals.d.ts:564

**Parameters:**

Name | Type |
------ | ------ |
`type` | string &#124; symbol |

**Returns:** *number*

___

###  listeners

▸ **listeners**(`event`: string | symbol): *Function[]*

*Inherited from [Lube](_lube_.lube.md).[listeners](_lube_.lube.md#listeners)*

Defined in node_modules/@types/node/globals.d.ts:561

**Parameters:**

Name | Type |
------ | ------ |
`event` | string &#124; symbol |

**Returns:** *Function[]*

___

###  off

▸ **off**(`event`: string | symbol, `listener`: function): *this*

*Inherited from [Lube](_lube_.lube.md).[off](_lube_.lube.md#off)*

Defined in node_modules/@types/node/globals.d.ts:557

**Parameters:**

▪ **event**: *string | symbol*

▪ **listener**: *function*

▸ (...`args`: any[]): *void*

**Parameters:**

Name | Type |
------ | ------ |
`...args` | any[] |

**Returns:** *this*

___

###  on

▸ **on**(`event`: string | symbol, `listener`: function): *this*

*Inherited from [Lube](_lube_.lube.md).[on](_lube_.lube.md#on)*

Defined in node_modules/@types/node/globals.d.ts:554

**Parameters:**

▪ **event**: *string | symbol*

▪ **listener**: *function*

▸ (...`args`: any[]): *void*

**Parameters:**

Name | Type |
------ | ------ |
`...args` | any[] |

**Returns:** *this*

___

###  once

▸ **once**(`event`: string | symbol, `listener`: function): *this*

*Inherited from [Lube](_lube_.lube.md).[once](_lube_.lube.md#once)*

Defined in node_modules/@types/node/globals.d.ts:555

**Parameters:**

▪ **event**: *string | symbol*

▪ **listener**: *function*

▸ (...`args`: any[]): *void*

**Parameters:**

Name | Type |
------ | ------ |
`...args` | any[] |

**Returns:** *this*

___

###  prependListener

▸ **prependListener**(`event`: string | symbol, `listener`: function): *this*

*Inherited from [Lube](_lube_.lube.md).[prependListener](_lube_.lube.md#prependlistener)*

Defined in node_modules/@types/node/globals.d.ts:566

**Parameters:**

▪ **event**: *string | symbol*

▪ **listener**: *function*

▸ (...`args`: any[]): *void*

**Parameters:**

Name | Type |
------ | ------ |
`...args` | any[] |

**Returns:** *this*

___

###  prependOnceListener

▸ **prependOnceListener**(`event`: string | symbol, `listener`: function): *this*

*Inherited from [Lube](_lube_.lube.md).[prependOnceListener](_lube_.lube.md#prependoncelistener)*

Defined in node_modules/@types/node/globals.d.ts:567

**Parameters:**

▪ **event**: *string | symbol*

▪ **listener**: *function*

▸ (...`args`: any[]): *void*

**Parameters:**

Name | Type |
------ | ------ |
`...args` | any[] |

**Returns:** *this*

___

###  query

▸ **query**‹**TResult**›(`sql`: string): *Promise‹[QueryResult](../interfaces/_executor_.queryresult.md)‹TResult››*

*Inherited from [Lube](_lube_.lube.md).[query](_lube_.lube.md#query)*

Defined in src/executor.ts:169

**Type parameters:**

▪ **TResult**

**Parameters:**

Name | Type |
------ | ------ |
`sql` | string |

**Returns:** *Promise‹[QueryResult](../interfaces/_executor_.queryresult.md)‹TResult››*

▸ **query**‹**TResult**›(`sql`: string, `params`: [Parameter](_ast_.parameter.md)[]): *Promise‹[QueryResult](../interfaces/_executor_.queryresult.md)‹TResult››*

*Inherited from [Lube](_lube_.lube.md).[query](_lube_.lube.md#query)*

Defined in src/executor.ts:170

**Type parameters:**

▪ **TResult**

**Parameters:**

Name | Type |
------ | ------ |
`sql` | string |
`params` | [Parameter](_ast_.parameter.md)[] |

**Returns:** *Promise‹[QueryResult](../interfaces/_executor_.queryresult.md)‹TResult››*

▸ **query**‹**TResult**›(`sql`: string, `params`: Object): *Promise‹[QueryResult](../interfaces/_executor_.queryresult.md)‹TResult››*

*Inherited from [Lube](_lube_.lube.md).[query](_lube_.lube.md#query)*

Defined in src/executor.ts:171

**Type parameters:**

▪ **TResult**

**Parameters:**

Name | Type |
------ | ------ |
`sql` | string |
`params` | Object |

**Returns:** *Promise‹[QueryResult](../interfaces/_executor_.queryresult.md)‹TResult››*

▸ **query**‹**TResult**›(`sql`: [Statement](_ast_.statement.md) | Document): *Promise‹[QueryResult](../interfaces/_executor_.queryresult.md)‹TResult››*

*Inherited from [Lube](_lube_.lube.md).[query](_lube_.lube.md#query)*

Defined in src/executor.ts:172

**Type parameters:**

▪ **TResult**

**Parameters:**

Name | Type |
------ | ------ |
`sql` | [Statement](_ast_.statement.md) &#124; Document |

**Returns:** *Promise‹[QueryResult](../interfaces/_executor_.queryresult.md)‹TResult››*

▸ **query**‹**TResult**›(`sql`: TemplateStringsArray, ...`params`: any[]): *Promise‹[QueryResult](../interfaces/_executor_.queryresult.md)‹TResult››*

*Inherited from [Lube](_lube_.lube.md).[query](_lube_.lube.md#query)*

Defined in src/executor.ts:173

**Type parameters:**

▪ **TResult**

**Parameters:**

Name | Type |
------ | ------ |
`sql` | TemplateStringsArray |
`...params` | any[] |

**Returns:** *Promise‹[QueryResult](../interfaces/_executor_.queryresult.md)‹TResult››*

___

###  queryScalar

▸ **queryScalar**‹**TResult**›(`sql`: string, `params?`: [Parameter](_ast_.parameter.md)[]): *Promise‹TResult›*

*Inherited from [Lube](_lube_.lube.md).[queryScalar](_lube_.lube.md#queryscalar)*

Defined in src/executor.ts:182

执行一个查询并获取返回的第一个标量值

**Type parameters:**

▪ **TResult**: *[JsConstant](../modules/_lube_.md#jsconstant)*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`sql` | string |   |
`params?` | [Parameter](_ast_.parameter.md)[] | - |

**Returns:** *Promise‹TResult›*

▸ **queryScalar**‹**TResult**›(`sql`: string, `params?`: Object): *Promise‹TResult›*

*Inherited from [Lube](_lube_.lube.md).[queryScalar](_lube_.lube.md#queryscalar)*

Defined in src/executor.ts:183

**Type parameters:**

▪ **TResult**: *[JsConstant](../modules/_lube_.md#jsconstant)*

**Parameters:**

Name | Type |
------ | ------ |
`sql` | string |
`params?` | Object |

**Returns:** *Promise‹TResult›*

▸ **queryScalar**‹**TResult**›(`sql`: [Statement](_ast_.statement.md) | Document): *Promise‹TResult›*

*Inherited from [Lube](_lube_.lube.md).[queryScalar](_lube_.lube.md#queryscalar)*

Defined in src/executor.ts:184

**Type parameters:**

▪ **TResult**: *[JsConstant](../modules/_lube_.md#jsconstant)*

**Parameters:**

Name | Type |
------ | ------ |
`sql` | [Statement](_ast_.statement.md) &#124; Document |

**Returns:** *Promise‹TResult›*

▸ **queryScalar**‹**TResult**›(`sql`: string[], ...`params`: any[]): *Promise‹TResult›*

*Inherited from [Lube](_lube_.lube.md).[queryScalar](_lube_.lube.md#queryscalar)*

Defined in src/executor.ts:185

**Type parameters:**

▪ **TResult**: *[JsConstant](../modules/_lube_.md#jsconstant)*

**Parameters:**

Name | Type |
------ | ------ |
`sql` | string[] |
`...params` | any[] |

**Returns:** *Promise‹TResult›*

___

###  rawListeners

▸ **rawListeners**(`event`: string | symbol): *Function[]*

*Inherited from [Lube](_lube_.lube.md).[rawListeners](_lube_.lube.md#rawlisteners)*

Defined in node_modules/@types/node/globals.d.ts:562

**Parameters:**

Name | Type |
------ | ------ |
`event` | string &#124; symbol |

**Returns:** *Function[]*

___

###  removeAllListeners

▸ **removeAllListeners**(`event?`: string | symbol): *this*

*Inherited from [Lube](_lube_.lube.md).[removeAllListeners](_lube_.lube.md#removealllisteners)*

Defined in node_modules/@types/node/globals.d.ts:558

**Parameters:**

Name | Type |
------ | ------ |
`event?` | string &#124; symbol |

**Returns:** *this*

___

###  removeListener

▸ **removeListener**(`event`: string | symbol, `listener`: function): *this*

*Inherited from [Lube](_lube_.lube.md).[removeListener](_lube_.lube.md#removelistener)*

Defined in node_modules/@types/node/globals.d.ts:556

**Parameters:**

▪ **event**: *string | symbol*

▪ **listener**: *function*

▸ (...`args`: any[]): *void*

**Parameters:**

Name | Type |
------ | ------ |
`...args` | any[] |

**Returns:** *this*

___

###  select

▸ **select**‹**TResult**›(`table`: [UnsureIdentifier](../modules/_lube_.md#unsureidentifier), `options`: [SelectOptions](../interfaces/_executor_.selectoptions.md)‹TResult›): *Promise‹TResult[]›*

*Inherited from [Lube](_lube_.lube.md).[select](_lube_.lube.md#select)*

Defined in src/executor.ts:265

简化版的SELECT查询，用于快速查询，如果要用复杂的查询，请使用select语句

**Type parameters:**

▪ **TResult**

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`table` | [UnsureIdentifier](../modules/_lube_.md#unsureidentifier) | - | - |
`options` | [SelectOptions](../interfaces/_executor_.selectoptions.md)‹TResult› | {} |   |

**Returns:** *Promise‹TResult[]›*

___

###  setMaxListeners

▸ **setMaxListeners**(`n`: number): *this*

*Inherited from [Lube](_lube_.lube.md).[setMaxListeners](_lube_.lube.md#setmaxlisteners)*

Defined in node_modules/@types/node/globals.d.ts:559

**Parameters:**

Name | Type |
------ | ------ |
`n` | number |

**Returns:** *this*

___

###  trans

▸ **trans**(`handler`: [TransactionHandler](../modules/_lube_.md#transactionhandler), `isolationLevel`: [ISOLATION_LEVEL](../enums/_constants_.isolation_level.md)): *Promise‹any›*

Defined in src/lube.ts:54

开启一个事务并自动提交

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`handler` | [TransactionHandler](../modules/_lube_.md#transactionhandler) | - | (exeutor, cancel) => false |
`isolationLevel` | [ISOLATION_LEVEL](../enums/_constants_.isolation_level.md) | ISOLATION_LEVEL.READ_COMMIT | 事务隔离级别  |

**Returns:** *Promise‹any›*

___

###  update

▸ **update**(`table`: [UnsureIdentifier](../modules/_lube_.md#unsureidentifier), `sets`: [Assignment](_ast_.assignment.md)[], `where?`: [UnsureCondition](../modules/_lube_.md#unsurecondition)): *Promise‹number›*

*Inherited from [Lube](_lube_.lube.md).[update](_lube_.lube.md#update)*

Defined in src/executor.ts:295

**Parameters:**

Name | Type |
------ | ------ |
`table` | [UnsureIdentifier](../modules/_lube_.md#unsureidentifier) |
`sets` | [Assignment](_ast_.assignment.md)[] |
`where?` | [UnsureCondition](../modules/_lube_.md#unsurecondition) |

**Returns:** *Promise‹number›*

▸ **update**‹**T**›(`table`: [UnsureIdentifier](../modules/_lube_.md#unsureidentifier), `sets`: T, `where?`: [UnsureCondition](../modules/_lube_.md#unsurecondition)): *Promise‹number›*

*Inherited from [Lube](_lube_.lube.md).[update](_lube_.lube.md#update)*

Defined in src/executor.ts:296

**Type parameters:**

▪ **T**: *[ValuesObject](../modules/_lube_.md#valuesobject)*

**Parameters:**

Name | Type |
------ | ------ |
`table` | [UnsureIdentifier](../modules/_lube_.md#unsureidentifier) |
`sets` | T |
`where?` | [UnsureCondition](../modules/_lube_.md#unsurecondition) |

**Returns:** *Promise‹number›*
