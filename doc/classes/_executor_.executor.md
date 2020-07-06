[lubejs](../README.md) › [Globals](../globals.md) › ["executor"](../modules/_executor_.md) › [Executor](_executor_.executor.md)

# Class: Executor

## Hierarchy

* EventEmitter

  ↳ **Executor**

  ↳ [Lube](_lube_.lube.md)

## Implements

* [IExecuotor](../interfaces/_executor_.iexecuotor.md)

## Index

### Constructors

* [constructor](_executor_.executor.md#protected-constructor)

### Properties

* [doQuery](_executor_.executor.md#doquery)
* [isTrans](_executor_.executor.md#readonly-istrans)
* [parser](_executor_.executor.md#protected-parser)
* [defaultMaxListeners](_executor_.executor.md#static-defaultmaxlisteners)
* [errorMonitor](_executor_.executor.md#static-readonly-errormonitor)

### Methods

* [_internalQuery](_executor_.executor.md#_internalquery)
* [addListener](_executor_.executor.md#addlistener)
* [delete](_executor_.executor.md#delete)
* [emit](_executor_.executor.md#emit)
* [eventNames](_executor_.executor.md#eventnames)
* [execute](_executor_.executor.md#execute)
* [find](_executor_.executor.md#find)
* [getMaxListeners](_executor_.executor.md#getmaxlisteners)
* [insert](_executor_.executor.md#insert)
* [listenerCount](_executor_.executor.md#listenercount)
* [listeners](_executor_.executor.md#listeners)
* [off](_executor_.executor.md#off)
* [on](_executor_.executor.md#on)
* [once](_executor_.executor.md#once)
* [prependListener](_executor_.executor.md#prependlistener)
* [prependOnceListener](_executor_.executor.md#prependoncelistener)
* [query](_executor_.executor.md#query)
* [queryScalar](_executor_.executor.md#queryscalar)
* [rawListeners](_executor_.executor.md#rawlisteners)
* [removeAllListeners](_executor_.executor.md#removealllisteners)
* [removeListener](_executor_.executor.md#removelistener)
* [select](_executor_.executor.md#select)
* [setMaxListeners](_executor_.executor.md#setmaxlisteners)
* [update](_executor_.executor.md#update)
* [listenerCount](_executor_.executor.md#static-listenercount)

## Constructors

### `Protected` constructor

\+ **new Executor**(`query`: [QueryHandler](../interfaces/_executor_.queryhandler.md), `parser`: [Compiler](_compiler_.compiler.md), `isTrans`: boolean): *[Executor](_executor_.executor.md)*

*Overrides void*

Defined in src/executor.ts:95

SQL执行器

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`query` | [QueryHandler](../interfaces/_executor_.queryhandler.md) | - | 查询函数 |
`parser` | [Compiler](_compiler_.compiler.md) | - | 编译函数  |
`isTrans` | boolean | false | - |

**Returns:** *[Executor](_executor_.executor.md)*

## Properties

###  doQuery

• **doQuery**: *[QueryHandler](../interfaces/_executor_.queryhandler.md)*

*Implementation of [IExecuotor](../interfaces/_executor_.iexecuotor.md).[doQuery](../interfaces/_executor_.iexecuotor.md#doquery)*

Defined in src/executor.ts:92

___

### `Readonly` isTrans

• **isTrans**: *boolean*

Defined in src/executor.ts:95

___

### `Protected` parser

• **parser**: *[Compiler](_compiler_.compiler.md)*

Defined in src/executor.ts:93

___

### `Static` defaultMaxListeners

▪ **defaultMaxListeners**: *number*

*Inherited from [Executor](_executor_.executor.md).[defaultMaxListeners](_executor_.executor.md#static-defaultmaxlisteners)*

Defined in node_modules/@types/node/events.d.ts:45

___

### `Static` `Readonly` errorMonitor

▪ **errorMonitor**: *keyof symbol*

*Inherited from [Executor](_executor_.executor.md).[errorMonitor](_executor_.executor.md#static-readonly-errormonitor)*

Defined in node_modules/@types/node/events.d.ts:55

This symbol shall be used to install a listener for only monitoring `'error'`
events. Listeners installed using this symbol are called before the regular
`'error'` listeners are called.

Installing a listener using this symbol does not change the behavior once an
`'error'` event is emitted, therefore the process will still crash if no
regular `'error'` listener is installed.

## Methods

###  _internalQuery

▸ **_internalQuery**(...`args`: any[]): *Promise‹[QueryResult](../interfaces/_executor_.queryresult.md)›*

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

###  delete

▸ **delete**(`table`: [UnsureIdentity](../modules/_ast_.md#unsureidentity), `where?`: [UnsureConditions](../modules/_ast_.md#unsureconditions)): *Promise‹number›*

Defined in src/executor.ts:286

**Parameters:**

Name | Type |
------ | ------ |
`table` | [UnsureIdentity](../modules/_ast_.md#unsureidentity) |
`where?` | [UnsureConditions](../modules/_ast_.md#unsureconditions) |

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

▸ **execute**(`spname`: [UnsureIdentity](../modules/_ast_.md#unsureidentity), `params`: [UnsureExpression](../modules/_ast_.md#unsureexpression)[]): *any*

*Implementation of [IExecuotor](../interfaces/_executor_.iexecuotor.md)*

Defined in src/executor.ts:293

**Parameters:**

Name | Type |
------ | ------ |
`spname` | [UnsureIdentity](../modules/_ast_.md#unsureidentity) |
`params` | [UnsureExpression](../modules/_ast_.md#unsureexpression)[] |

**Returns:** *any*

▸ **execute**(`spname`: [UnsureIdentity](../modules/_ast_.md#unsureidentity), `params`: [Parameter](_ast_.parameter.md)[]): *any*

*Implementation of [IExecuotor](../interfaces/_executor_.iexecuotor.md)*

Defined in src/executor.ts:294

**Parameters:**

Name | Type |
------ | ------ |
`spname` | [UnsureIdentity](../modules/_ast_.md#unsureidentity) |
`params` | [Parameter](_ast_.parameter.md)[] |

**Returns:** *any*

___

###  find

▸ **find**(`table`: [UnsureIdentity](../modules/_ast_.md#unsureidentity), `where`: [Condition](_ast_.condition.md), `fields?`: string[]): *Promise‹object›*

*Implementation of [IExecuotor](../interfaces/_executor_.iexecuotor.md)*

Defined in src/executor.ts:222

**Parameters:**

Name | Type |
------ | ------ |
`table` | [UnsureIdentity](../modules/_ast_.md#unsureidentity) |
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

▸ **insert**(`table`: [UnsureIdentity](../modules/_ast_.md#unsureidentity), `select`: [Select](_ast_.select.md)): *any*

*Implementation of [IExecuotor](../interfaces/_executor_.iexecuotor.md)*

Defined in src/executor.ts:193

插入数据的快捷操作

**Parameters:**

Name | Type |
------ | ------ |
`table` | [UnsureIdentity](../modules/_ast_.md#unsureidentity) |
`select` | [Select](_ast_.select.md) |

**Returns:** *any*

▸ **insert**(`table`: [UnsureIdentity](../modules/_ast_.md#unsureidentity), `fields`: [UnsureIdentity](../modules/_ast_.md#unsureidentity)[], `select`: [Select](_ast_.select.md)): *any*

*Implementation of [IExecuotor](../interfaces/_executor_.iexecuotor.md)*

Defined in src/executor.ts:194

**Parameters:**

Name | Type |
------ | ------ |
`table` | [UnsureIdentity](../modules/_ast_.md#unsureidentity) |
`fields` | [UnsureIdentity](../modules/_ast_.md#unsureidentity)[] |
`select` | [Select](_ast_.select.md) |

**Returns:** *any*

▸ **insert**(`table`: [UnsureIdentity](../modules/_ast_.md#unsureidentity), `rows`: [KeyValueObject](../interfaces/_ast_.keyvalueobject.md)[]): *any*

*Implementation of [IExecuotor](../interfaces/_executor_.iexecuotor.md)*

Defined in src/executor.ts:195

**Parameters:**

Name | Type |
------ | ------ |
`table` | [UnsureIdentity](../modules/_ast_.md#unsureidentity) |
`rows` | [KeyValueObject](../interfaces/_ast_.keyvalueobject.md)[] |

**Returns:** *any*

▸ **insert**(`table`: [UnsureIdentity](../modules/_ast_.md#unsureidentity), `row`: [KeyValueObject](../interfaces/_ast_.keyvalueobject.md)): *any*

*Implementation of [IExecuotor](../interfaces/_executor_.iexecuotor.md)*

Defined in src/executor.ts:196

**Parameters:**

Name | Type |
------ | ------ |
`table` | [UnsureIdentity](../modules/_ast_.md#unsureidentity) |
`row` | [KeyValueObject](../interfaces/_ast_.keyvalueobject.md) |

**Returns:** *any*

▸ **insert**(`table`: [UnsureIdentity](../modules/_ast_.md#unsureidentity), `fields`: [UnsureIdentity](../modules/_ast_.md#unsureidentity)[], `rows`: [UnsureExpression](../modules/_ast_.md#unsureexpression)[][]): *any*

*Implementation of [IExecuotor](../interfaces/_executor_.iexecuotor.md)*

Defined in src/executor.ts:197

**Parameters:**

Name | Type |
------ | ------ |
`table` | [UnsureIdentity](../modules/_ast_.md#unsureidentity) |
`fields` | [UnsureIdentity](../modules/_ast_.md#unsureidentity)[] |
`rows` | [UnsureExpression](../modules/_ast_.md#unsureexpression)[][] |

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

Defined in src/executor.ts:165

**Parameters:**

Name | Type |
------ | ------ |
`sql` | string |
`params` | [Parameter](_ast_.parameter.md)[] |

**Returns:** *Promise‹[QueryResult](../interfaces/_executor_.queryresult.md)›*

▸ **query**(`sql`: string, `params`: Object): *Promise‹[QueryResult](../interfaces/_executor_.queryresult.md)›*

*Implementation of [IExecuotor](../interfaces/_executor_.iexecuotor.md)*

Defined in src/executor.ts:166

**Parameters:**

Name | Type |
------ | ------ |
`sql` | string |
`params` | Object |

**Returns:** *Promise‹[QueryResult](../interfaces/_executor_.queryresult.md)›*

▸ **query**(`sql`: [Statement](_ast_.statement.md) | Document): *Promise‹[QueryResult](../interfaces/_executor_.queryresult.md)›*

*Implementation of [IExecuotor](../interfaces/_executor_.iexecuotor.md)*

Defined in src/executor.ts:167

**Parameters:**

Name | Type |
------ | ------ |
`sql` | [Statement](_ast_.statement.md) &#124; Document |

**Returns:** *Promise‹[QueryResult](../interfaces/_executor_.queryresult.md)›*

▸ **query**(`sql`: string[], ...`params`: any[]): *Promise‹[QueryResult](../interfaces/_executor_.queryresult.md)›*

Defined in src/executor.ts:168

**Parameters:**

Name | Type |
------ | ------ |
`sql` | string[] |
`...params` | any[] |

**Returns:** *Promise‹[QueryResult](../interfaces/_executor_.queryresult.md)›*

___

###  queryScalar

▸ **queryScalar**(`sql`: string, `params`: [Parameter](_ast_.parameter.md)[]): *Promise‹[JsConstant](../modules/_ast_.md#jsconstant)›*

*Implementation of [IExecuotor](../interfaces/_executor_.iexecuotor.md)*

Defined in src/executor.ts:177

执行一个查询并获取返回的第一个标量值

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`sql` | string |   |
`params` | [Parameter](_ast_.parameter.md)[] | - |

**Returns:** *Promise‹[JsConstant](../modules/_ast_.md#jsconstant)›*

▸ **queryScalar**(`sql`: string, `params`: Object): *Promise‹[JsConstant](../modules/_ast_.md#jsconstant)›*

*Implementation of [IExecuotor](../interfaces/_executor_.iexecuotor.md)*

Defined in src/executor.ts:178

**Parameters:**

Name | Type |
------ | ------ |
`sql` | string |
`params` | Object |

**Returns:** *Promise‹[JsConstant](../modules/_ast_.md#jsconstant)›*

▸ **queryScalar**(`sql`: [Statement](_ast_.statement.md) | Document): *Promise‹[JsConstant](../modules/_ast_.md#jsconstant)›*

*Implementation of [IExecuotor](../interfaces/_executor_.iexecuotor.md)*

Defined in src/executor.ts:179

**Parameters:**

Name | Type |
------ | ------ |
`sql` | [Statement](_ast_.statement.md) &#124; Document |

**Returns:** *Promise‹[JsConstant](../modules/_ast_.md#jsconstant)›*

▸ **queryScalar**(`sql`: string[], ...`params`: any[]): *Promise‹[JsConstant](../modules/_ast_.md#jsconstant)›*

*Implementation of [IExecuotor](../interfaces/_executor_.iexecuotor.md)*

Defined in src/executor.ts:180

**Parameters:**

Name | Type |
------ | ------ |
`sql` | string[] |
`...params` | any[] |

**Returns:** *Promise‹[JsConstant](../modules/_ast_.md#jsconstant)›*

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

▸ **select**(`table`: [UnsureIdentity](../modules/_ast_.md#unsureidentity), `options`: [SelectOptions](../interfaces/_executor_.selectoptions.md)): *Promise‹object[]›*

*Implementation of [IExecuotor](../interfaces/_executor_.iexecuotor.md)*

Defined in src/executor.ts:243

简化版的SELECT查询，用于快速查询，如果要用复杂的查询，请使用select语句

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`table` | [UnsureIdentity](../modules/_ast_.md#unsureidentity) | - | - |
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

###  update

▸ **update**(`table`: [UnsureIdentity](../modules/_ast_.md#unsureidentity), `sets`: [Assignment](_ast_.assignment.md)[], `where?`: [UnsureConditions](../modules/_ast_.md#unsureconditions)): *any*

*Implementation of [IExecuotor](../interfaces/_executor_.iexecuotor.md)*

Defined in src/executor.ts:272

**Parameters:**

Name | Type |
------ | ------ |
`table` | [UnsureIdentity](../modules/_ast_.md#unsureidentity) |
`sets` | [Assignment](_ast_.assignment.md)[] |
`where?` | [UnsureConditions](../modules/_ast_.md#unsureconditions) |

**Returns:** *any*

▸ **update**(`table`: [UnsureIdentity](../modules/_ast_.md#unsureidentity), `sets`: [KeyValueObject](../interfaces/_ast_.keyvalueobject.md), `where?`: [UnsureConditions](../modules/_ast_.md#unsureconditions)): *any*

*Implementation of [IExecuotor](../interfaces/_executor_.iexecuotor.md)*

Defined in src/executor.ts:273

**Parameters:**

Name | Type |
------ | ------ |
`table` | [UnsureIdentity](../modules/_ast_.md#unsureidentity) |
`sets` | [KeyValueObject](../interfaces/_ast_.keyvalueobject.md) |
`where?` | [UnsureConditions](../modules/_ast_.md#unsureconditions) |

**Returns:** *any*

___

### `Static` listenerCount

▸ **listenerCount**(`emitter`: EventEmitter, `event`: string | symbol): *number*

*Inherited from [Executor](_executor_.executor.md).[listenerCount](_executor_.executor.md#static-listenercount)*

Defined in node_modules/@types/node/events.d.ts:44

**`deprecated`** since v4.0.0

**Parameters:**

Name | Type |
------ | ------ |
`emitter` | EventEmitter |
`event` | string &#124; symbol |

**Returns:** *number*
