[lubejs](../README.md) › [Globals](../globals.md) › ["lube"](../modules/_lube_.md) › [Lube](_lube_.lube.md)

# Class: Lube

## Hierarchy

  ↳ [Executor](_executor_.executor.md)

  ↳ **Lube**

## Implements

* [IExecuotor](../interfaces/_executor_.iexecuotor.md)

## Index

### Constructors

* [constructor](_lube_.lube.md#constructor)

### Properties

* [_provider](_lube_.lube.md#private-_provider)
* [doQuery](_lube_.lube.md#doquery)
* [isTrans](_lube_.lube.md#readonly-istrans)
* [parser](_lube_.lube.md#protected-parser)

### Methods

* [_internalQuery](_lube_.lube.md#_internalquery)
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

Defined in src/lube.ts:31

**Parameters:**

Name | Type |
------ | ------ |
`provider` | [IDbProvider](../interfaces/_lube_.idbprovider.md) |
`options` | [ConnectOptions](../interfaces/_lube_.connectoptions.md) |

**Returns:** *[Lube](_lube_.lube.md)*

## Properties

### `Private` _provider

• **_provider**: *[IDbProvider](../interfaces/_lube_.idbprovider.md)*

Defined in src/lube.ts:31

___

###  doQuery

• **doQuery**: *[QueryHandler](../interfaces/_executor_.queryhandler.md)*

*Implementation of [IExecuotor](../interfaces/_executor_.iexecuotor.md).[doQuery](../interfaces/_executor_.iexecuotor.md#doquery)*

*Inherited from [Executor](_executor_.executor.md).[doQuery](_executor_.executor.md#doquery)*

Defined in src/executor.ts:92

___

### `Readonly` isTrans

• **isTrans**: *boolean*

*Inherited from [Executor](_executor_.executor.md).[isTrans](_executor_.executor.md#readonly-istrans)*

Defined in src/executor.ts:95

___

### `Protected` parser

• **parser**: *[Compiler](_compiler_.compiler.md)*

*Inherited from [Executor](_executor_.executor.md).[parser](_executor_.executor.md#protected-parser)*

Defined in src/executor.ts:93

## Methods

###  _internalQuery

▸ **_internalQuery**(...`args`: any[]): *Promise‹[QueryResult](../interfaces/_executor_.queryresult.md)›*

*Inherited from [Executor](_executor_.executor.md).[_internalQuery](_executor_.executor.md#_internalquery)*

Defined in src/executor.ts:113

**Parameters:**

Name | Type |
------ | ------ |
`...args` | any[] |

**Returns:** *Promise‹[QueryResult](../interfaces/_executor_.queryresult.md)›*

___

###  addListener

▸ **addListener**(`event`: string | symbol, `listener`: function): *this*

*Inherited from [Executor](_executor_.executor.md).[addListener](_executor_.executor.md#addlistener)*

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

Defined in src/lube.ts:80

**Returns:** *Promise‹void›*

___

###  delete

▸ **delete**(`table`: [UnsureIdentity](../modules/_lube_.md#unsureidentity), `where?`: [UnsureConditions](../modules/_lube_.md#unsureconditions)): *Promise‹number›*

*Inherited from [Executor](_executor_.executor.md).[delete](_executor_.executor.md#delete)*

Defined in src/executor.ts:286

**Parameters:**

Name | Type |
------ | ------ |
`table` | [UnsureIdentity](../modules/_lube_.md#unsureidentity) |
`where?` | [UnsureConditions](../modules/_lube_.md#unsureconditions) |

**Returns:** *Promise‹number›*

___

###  emit

▸ **emit**(`event`: string | symbol, ...`args`: any[]): *boolean*

*Inherited from [Executor](_executor_.executor.md).[emit](_executor_.executor.md#emit)*

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

*Inherited from [Executor](_executor_.executor.md).[eventNames](_executor_.executor.md#eventnames)*

Defined in node_modules/@types/node/globals.d.ts:568

**Returns:** *Array‹string | symbol›*

___

###  execute

▸ **execute**(`spname`: [UnsureIdentity](../modules/_lube_.md#unsureidentity), `params`: [UnsureExpression](../modules/_lube_.md#unsureexpression)[]): *any*

*Implementation of [IExecuotor](../interfaces/_executor_.iexecuotor.md)*

*Inherited from [Executor](_executor_.executor.md).[execute](_executor_.executor.md#execute)*

Defined in src/executor.ts:293

**Parameters:**

Name | Type |
------ | ------ |
`spname` | [UnsureIdentity](../modules/_lube_.md#unsureidentity) |
`params` | [UnsureExpression](../modules/_lube_.md#unsureexpression)[] |

**Returns:** *any*

▸ **execute**(`spname`: [UnsureIdentity](../modules/_lube_.md#unsureidentity), `params`: [Parameter](_ast_.parameter.md)[]): *any*

*Implementation of [IExecuotor](../interfaces/_executor_.iexecuotor.md)*

*Inherited from [Executor](_executor_.executor.md).[execute](_executor_.executor.md#execute)*

Defined in src/executor.ts:294

**Parameters:**

Name | Type |
------ | ------ |
`spname` | [UnsureIdentity](../modules/_lube_.md#unsureidentity) |
`params` | [Parameter](_ast_.parameter.md)[] |

**Returns:** *any*

___

###  find

▸ **find**(`table`: [UnsureIdentity](../modules/_lube_.md#unsureidentity), `where`: [Condition](_ast_.condition.md), `fields?`: string[]): *Promise‹object›*

*Implementation of [IExecuotor](../interfaces/_executor_.iexecuotor.md)*

*Inherited from [Executor](_executor_.executor.md).[find](_executor_.executor.md#find)*

Defined in src/executor.ts:222

**Parameters:**

Name | Type |
------ | ------ |
`table` | [UnsureIdentity](../modules/_lube_.md#unsureidentity) |
`where` | [Condition](_ast_.condition.md) |
`fields?` | string[] |

**Returns:** *Promise‹object›*

___

###  getMaxListeners

▸ **getMaxListeners**(): *number*

*Inherited from [Executor](_executor_.executor.md).[getMaxListeners](_executor_.executor.md#getmaxlisteners)*

Defined in node_modules/@types/node/globals.d.ts:560

**Returns:** *number*

___

###  insert

▸ **insert**(`table`: [UnsureIdentity](../modules/_lube_.md#unsureidentity), `select`: [Select](_ast_.select.md)): *any*

*Implementation of [IExecuotor](../interfaces/_executor_.iexecuotor.md)*

*Inherited from [Executor](_executor_.executor.md).[insert](_executor_.executor.md#insert)*

Defined in src/executor.ts:193

插入数据的快捷操作

**Parameters:**

Name | Type |
------ | ------ |
`table` | [UnsureIdentity](../modules/_lube_.md#unsureidentity) |
`select` | [Select](_ast_.select.md) |

**Returns:** *any*

▸ **insert**(`table`: [UnsureIdentity](../modules/_lube_.md#unsureidentity), `fields`: [UnsureIdentity](../modules/_lube_.md#unsureidentity)[], `select`: [Select](_ast_.select.md)): *any*

*Implementation of [IExecuotor](../interfaces/_executor_.iexecuotor.md)*

*Inherited from [Executor](_executor_.executor.md).[insert](_executor_.executor.md#insert)*

Defined in src/executor.ts:194

**Parameters:**

Name | Type |
------ | ------ |
`table` | [UnsureIdentity](../modules/_lube_.md#unsureidentity) |
`fields` | [UnsureIdentity](../modules/_lube_.md#unsureidentity)[] |
`select` | [Select](_ast_.select.md) |

**Returns:** *any*

▸ **insert**(`table`: [UnsureIdentity](../modules/_lube_.md#unsureidentity), `rows`: [KeyValueObject](../interfaces/_ast_.keyvalueobject.md)[]): *any*

*Implementation of [IExecuotor](../interfaces/_executor_.iexecuotor.md)*

*Inherited from [Executor](_executor_.executor.md).[insert](_executor_.executor.md#insert)*

Defined in src/executor.ts:195

**Parameters:**

Name | Type |
------ | ------ |
`table` | [UnsureIdentity](../modules/_lube_.md#unsureidentity) |
`rows` | [KeyValueObject](../interfaces/_ast_.keyvalueobject.md)[] |

**Returns:** *any*

▸ **insert**(`table`: [UnsureIdentity](../modules/_lube_.md#unsureidentity), `row`: [KeyValueObject](../interfaces/_ast_.keyvalueobject.md)): *any*

*Implementation of [IExecuotor](../interfaces/_executor_.iexecuotor.md)*

*Inherited from [Executor](_executor_.executor.md).[insert](_executor_.executor.md#insert)*

Defined in src/executor.ts:196

**Parameters:**

Name | Type |
------ | ------ |
`table` | [UnsureIdentity](../modules/_lube_.md#unsureidentity) |
`row` | [KeyValueObject](../interfaces/_ast_.keyvalueobject.md) |

**Returns:** *any*

▸ **insert**(`table`: [UnsureIdentity](../modules/_lube_.md#unsureidentity), `fields`: [UnsureIdentity](../modules/_lube_.md#unsureidentity)[], `rows`: [UnsureExpression](../modules/_lube_.md#unsureexpression)[][]): *any*

*Implementation of [IExecuotor](../interfaces/_executor_.iexecuotor.md)*

*Inherited from [Executor](_executor_.executor.md).[insert](_executor_.executor.md#insert)*

Defined in src/executor.ts:197

**Parameters:**

Name | Type |
------ | ------ |
`table` | [UnsureIdentity](../modules/_lube_.md#unsureidentity) |
`fields` | [UnsureIdentity](../modules/_lube_.md#unsureidentity)[] |
`rows` | [UnsureExpression](../modules/_lube_.md#unsureexpression)[][] |

**Returns:** *any*

___

###  listenerCount

▸ **listenerCount**(`type`: string | symbol): *number*

*Inherited from [Executor](_executor_.executor.md).[listenerCount](_executor_.executor.md#listenercount)*

Defined in node_modules/@types/node/globals.d.ts:564

**Parameters:**

Name | Type |
------ | ------ |
`type` | string &#124; symbol |

**Returns:** *number*

___

###  listeners

▸ **listeners**(`event`: string | symbol): *Function[]*

*Inherited from [Executor](_executor_.executor.md).[listeners](_executor_.executor.md#listeners)*

Defined in node_modules/@types/node/globals.d.ts:561

**Parameters:**

Name | Type |
------ | ------ |
`event` | string &#124; symbol |

**Returns:** *Function[]*

___

###  off

▸ **off**(`event`: string | symbol, `listener`: function): *this*

*Inherited from [Executor](_executor_.executor.md).[off](_executor_.executor.md#off)*

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

*Inherited from [Executor](_executor_.executor.md).[on](_executor_.executor.md#on)*

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

*Inherited from [Executor](_executor_.executor.md).[once](_executor_.executor.md#once)*

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

*Inherited from [Executor](_executor_.executor.md).[prependListener](_executor_.executor.md#prependlistener)*

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

*Inherited from [Executor](_executor_.executor.md).[prependOnceListener](_executor_.executor.md#prependoncelistener)*

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

▸ **query**(`sql`: string, `params`: [Parameter](_ast_.parameter.md)[]): *Promise‹[QueryResult](../interfaces/_executor_.queryresult.md)›*

*Implementation of [IExecuotor](../interfaces/_executor_.iexecuotor.md)*

*Inherited from [Executor](_executor_.executor.md).[query](_executor_.executor.md#query)*

Defined in src/executor.ts:165

**Parameters:**

Name | Type |
------ | ------ |
`sql` | string |
`params` | [Parameter](_ast_.parameter.md)[] |

**Returns:** *Promise‹[QueryResult](../interfaces/_executor_.queryresult.md)›*

▸ **query**(`sql`: string, `params`: Object): *Promise‹[QueryResult](../interfaces/_executor_.queryresult.md)›*

*Implementation of [IExecuotor](../interfaces/_executor_.iexecuotor.md)*

*Inherited from [Executor](_executor_.executor.md).[query](_executor_.executor.md#query)*

Defined in src/executor.ts:166

**Parameters:**

Name | Type |
------ | ------ |
`sql` | string |
`params` | Object |

**Returns:** *Promise‹[QueryResult](../interfaces/_executor_.queryresult.md)›*

▸ **query**(`sql`: [Statement](_ast_.statement.md) | Document): *Promise‹[QueryResult](../interfaces/_executor_.queryresult.md)›*

*Implementation of [IExecuotor](../interfaces/_executor_.iexecuotor.md)*

*Inherited from [Executor](_executor_.executor.md).[query](_executor_.executor.md#query)*

Defined in src/executor.ts:167

**Parameters:**

Name | Type |
------ | ------ |
`sql` | [Statement](_ast_.statement.md) &#124; Document |

**Returns:** *Promise‹[QueryResult](../interfaces/_executor_.queryresult.md)›*

▸ **query**(`sql`: string[], ...`params`: any[]): *Promise‹[QueryResult](../interfaces/_executor_.queryresult.md)›*

*Inherited from [Executor](_executor_.executor.md).[query](_executor_.executor.md#query)*

Defined in src/executor.ts:168

**Parameters:**

Name | Type |
------ | ------ |
`sql` | string[] |
`...params` | any[] |

**Returns:** *Promise‹[QueryResult](../interfaces/_executor_.queryresult.md)›*

___

###  queryScalar

▸ **queryScalar**(`sql`: string, `params`: [Parameter](_ast_.parameter.md)[]): *Promise‹[JsConstant](../modules/_lube_.md#jsconstant)›*

*Implementation of [IExecuotor](../interfaces/_executor_.iexecuotor.md)*

*Inherited from [Executor](_executor_.executor.md).[queryScalar](_executor_.executor.md#queryscalar)*

Defined in src/executor.ts:177

执行一个查询并获取返回的第一个标量值

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`sql` | string |   |
`params` | [Parameter](_ast_.parameter.md)[] | - |

**Returns:** *Promise‹[JsConstant](../modules/_lube_.md#jsconstant)›*

▸ **queryScalar**(`sql`: string, `params`: Object): *Promise‹[JsConstant](../modules/_lube_.md#jsconstant)›*

*Implementation of [IExecuotor](../interfaces/_executor_.iexecuotor.md)*

*Inherited from [Executor](_executor_.executor.md).[queryScalar](_executor_.executor.md#queryscalar)*

Defined in src/executor.ts:178

**Parameters:**

Name | Type |
------ | ------ |
`sql` | string |
`params` | Object |

**Returns:** *Promise‹[JsConstant](../modules/_lube_.md#jsconstant)›*

▸ **queryScalar**(`sql`: [Statement](_ast_.statement.md) | Document): *Promise‹[JsConstant](../modules/_lube_.md#jsconstant)›*

*Implementation of [IExecuotor](../interfaces/_executor_.iexecuotor.md)*

*Inherited from [Executor](_executor_.executor.md).[queryScalar](_executor_.executor.md#queryscalar)*

Defined in src/executor.ts:179

**Parameters:**

Name | Type |
------ | ------ |
`sql` | [Statement](_ast_.statement.md) &#124; Document |

**Returns:** *Promise‹[JsConstant](../modules/_lube_.md#jsconstant)›*

▸ **queryScalar**(`sql`: string[], ...`params`: any[]): *Promise‹[JsConstant](../modules/_lube_.md#jsconstant)›*

*Implementation of [IExecuotor](../interfaces/_executor_.iexecuotor.md)*

*Inherited from [Executor](_executor_.executor.md).[queryScalar](_executor_.executor.md#queryscalar)*

Defined in src/executor.ts:180

**Parameters:**

Name | Type |
------ | ------ |
`sql` | string[] |
`...params` | any[] |

**Returns:** *Promise‹[JsConstant](../modules/_lube_.md#jsconstant)›*

___

###  rawListeners

▸ **rawListeners**(`event`: string | symbol): *Function[]*

*Inherited from [Executor](_executor_.executor.md).[rawListeners](_executor_.executor.md#rawlisteners)*

Defined in node_modules/@types/node/globals.d.ts:562

**Parameters:**

Name | Type |
------ | ------ |
`event` | string &#124; symbol |

**Returns:** *Function[]*

___

###  removeAllListeners

▸ **removeAllListeners**(`event?`: string | symbol): *this*

*Inherited from [Executor](_executor_.executor.md).[removeAllListeners](_executor_.executor.md#removealllisteners)*

Defined in node_modules/@types/node/globals.d.ts:558

**Parameters:**

Name | Type |
------ | ------ |
`event?` | string &#124; symbol |

**Returns:** *this*

___

###  removeListener

▸ **removeListener**(`event`: string | symbol, `listener`: function): *this*

*Inherited from [Executor](_executor_.executor.md).[removeListener](_executor_.executor.md#removelistener)*

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

▸ **select**(`table`: [UnsureIdentity](../modules/_lube_.md#unsureidentity), `options`: [SelectOptions](../interfaces/_executor_.selectoptions.md)): *Promise‹object[]›*

*Implementation of [IExecuotor](../interfaces/_executor_.iexecuotor.md)*

*Inherited from [Executor](_executor_.executor.md).[select](_executor_.executor.md#select)*

Defined in src/executor.ts:243

简化版的SELECT查询，用于快速查询，如果要用复杂的查询，请使用select语句

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`table` | [UnsureIdentity](../modules/_lube_.md#unsureidentity) | - | - |
`options` | [SelectOptions](../interfaces/_executor_.selectoptions.md) | {} |   |

**Returns:** *Promise‹object[]›*

___

###  setMaxListeners

▸ **setMaxListeners**(`n`: number): *this*

*Inherited from [Executor](_executor_.executor.md).[setMaxListeners](_executor_.executor.md#setmaxlisteners)*

Defined in node_modules/@types/node/globals.d.ts:559

**Parameters:**

Name | Type |
------ | ------ |
`n` | number |

**Returns:** *this*

___

###  trans

▸ **trans**(`handler`: [TransactionHandler](../modules/_lube_.md#transactionhandler), `isolationLevel`: any): *Promise‹any›*

Defined in src/lube.ts:53

开启一个事务并自动提交

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`handler` | [TransactionHandler](../modules/_lube_.md#transactionhandler) | (exeutor, cancel) => false |
`isolationLevel` | any | 事务隔离级别  |

**Returns:** *Promise‹any›*

___

###  update

▸ **update**(`table`: [UnsureIdentity](../modules/_lube_.md#unsureidentity), `sets`: [Assignment](_ast_.assignment.md)[], `where?`: [UnsureConditions](../modules/_lube_.md#unsureconditions)): *any*

*Implementation of [IExecuotor](../interfaces/_executor_.iexecuotor.md)*

*Inherited from [Executor](_executor_.executor.md).[update](_executor_.executor.md#update)*

Defined in src/executor.ts:272

**Parameters:**

Name | Type |
------ | ------ |
`table` | [UnsureIdentity](../modules/_lube_.md#unsureidentity) |
`sets` | [Assignment](_ast_.assignment.md)[] |
`where?` | [UnsureConditions](../modules/_lube_.md#unsureconditions) |

**Returns:** *any*

▸ **update**(`table`: [UnsureIdentity](../modules/_lube_.md#unsureidentity), `sets`: [KeyValueObject](../interfaces/_ast_.keyvalueobject.md), `where?`: [UnsureConditions](../modules/_lube_.md#unsureconditions)): *any*

*Implementation of [IExecuotor](../interfaces/_executor_.iexecuotor.md)*

*Inherited from [Executor](_executor_.executor.md).[update](_executor_.executor.md#update)*

Defined in src/executor.ts:273

**Parameters:**

Name | Type |
------ | ------ |
`table` | [UnsureIdentity](../modules/_lube_.md#unsureidentity) |
`sets` | [KeyValueObject](../interfaces/_ast_.keyvalueobject.md) |
`where?` | [UnsureConditions](../modules/_lube_.md#unsureconditions) |

**Returns:** *any*
