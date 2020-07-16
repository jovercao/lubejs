[lubejs](../README.md) › [Globals](../globals.md) › ["executor"](../modules/_executor_.md) › [Executor](_executor_.executor.md)

# Class: Executor

## Hierarchy

* EventEmitter

  ↳ **Executor**

  ↳ [Lube](_lube_.lube.md)

## Index

### Constructors

* [constructor](_executor_.executor.md#protected-constructor)

### Properties

* [compiler](_executor_.executor.md#readonly-compiler)
* [doQuery](_executor_.executor.md#doquery)
* [isTrans](_executor_.executor.md#readonly-istrans)
* [defaultMaxListeners](_executor_.executor.md#static-defaultmaxlisteners)
* [errorMonitor](_executor_.executor.md#static-readonly-errormonitor)

### Methods

* [_internalQuery](_executor_.executor.md#private-_internalquery)
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

\+ **new Executor**(`query`: [QueryHandler](../interfaces/_executor_.queryhandler.md), `compiler`: [Compiler](_compiler_.compiler.md), `isTrans`: boolean): *[Executor](_executor_.executor.md)*

*Overrides void*

Defined in src/executor.ts:99

SQL执行器

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`query` | [QueryHandler](../interfaces/_executor_.queryhandler.md) | - | 查询函数 |
`compiler` | [Compiler](_compiler_.compiler.md) | - | 编译函数  |
`isTrans` | boolean | false | - |

**Returns:** *[Executor](_executor_.executor.md)*

## Properties

### `Readonly` compiler

• **compiler**: *[Compiler](_compiler_.compiler.md)*

Defined in src/executor.ts:97

___

###  doQuery

• **doQuery**: *[QueryHandler](../interfaces/_executor_.queryhandler.md)*

Defined in src/executor.ts:96

___

### `Readonly` isTrans

• **isTrans**: *boolean*

Defined in src/executor.ts:99

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

### `Private` _internalQuery

▸ **_internalQuery**(...`args`: any[]): *Promise‹[QueryResult](../interfaces/_executor_.queryresult.md)‹any››*

Defined in src/executor.ts:117

**Parameters:**

Name | Type |
------ | ------ |
`...args` | any[] |

**Returns:** *Promise‹[QueryResult](../interfaces/_executor_.queryresult.md)‹any››*

___

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

###  delete

▸ **delete**(`table`: [UnsureIdentifier](../modules/_ast_.md#unsureidentifier), `where?`: [UnsureCondition](../modules/_ast_.md#unsurecondition)): *Promise‹number›*

Defined in src/executor.ts:309

**Parameters:**

Name | Type |
------ | ------ |
`table` | [UnsureIdentifier](../modules/_ast_.md#unsureidentifier) |
`where?` | [UnsureCondition](../modules/_ast_.md#unsurecondition) |

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

▸ **execute**‹**T**›(`spname`: [UnsureIdentifier](../modules/_ast_.md#unsureidentifier), `params`: [UnsureExpression](../modules/_ast_.md#unsureexpression)[]): *Promise‹[QueryResult](../interfaces/_executor_.queryresult.md)‹T››*

Defined in src/executor.ts:316

**Type parameters:**

▪ **T**

**Parameters:**

Name | Type |
------ | ------ |
`spname` | [UnsureIdentifier](../modules/_ast_.md#unsureidentifier) |
`params` | [UnsureExpression](../modules/_ast_.md#unsureexpression)[] |

**Returns:** *Promise‹[QueryResult](../interfaces/_executor_.queryresult.md)‹T››*

▸ **execute**‹**T**›(`spname`: [UnsureIdentifier](../modules/_ast_.md#unsureidentifier), `params`: [Parameter](_ast_.parameter.md)[]): *Promise‹[QueryResult](../interfaces/_executor_.queryresult.md)‹T››*

Defined in src/executor.ts:317

**Type parameters:**

▪ **T**

**Parameters:**

Name | Type |
------ | ------ |
`spname` | [UnsureIdentifier](../modules/_ast_.md#unsureidentifier) |
`params` | [Parameter](_ast_.parameter.md)[] |

**Returns:** *Promise‹[QueryResult](../interfaces/_executor_.queryresult.md)‹T››*

___

###  find

▸ **find**‹**T**›(`table`: [UnsureIdentifier](../modules/_ast_.md#unsureidentifier), `where`: [UnsureCondition](../modules/_ast_.md#unsurecondition), `fields?`: string[]): *Promise‹T›*

Defined in src/executor.ts:244

**Type parameters:**

▪ **T**

**Parameters:**

Name | Type |
------ | ------ |
`table` | [UnsureIdentifier](../modules/_ast_.md#unsureidentifier) |
`where` | [UnsureCondition](../modules/_ast_.md#unsurecondition) |
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

▸ **insert**(`table`: [UnsureIdentifier](../modules/_ast_.md#unsureidentifier), `select`: [Select](_ast_.select.md)): *Promise‹number›*

Defined in src/executor.ts:196

插入数据的快捷操作

**Parameters:**

Name | Type |
------ | ------ |
`table` | [UnsureIdentifier](../modules/_ast_.md#unsureidentifier) |
`select` | [Select](_ast_.select.md) |

**Returns:** *Promise‹number›*

▸ **insert**(`table`: [UnsureIdentifier](../modules/_ast_.md#unsureidentifier), `fields`: [UnsureIdentifier](../modules/_ast_.md#unsureidentifier)[], `select`: [Select](_ast_.select.md)): *Promise‹number›*

Defined in src/executor.ts:197

**Parameters:**

Name | Type |
------ | ------ |
`table` | [UnsureIdentifier](../modules/_ast_.md#unsureidentifier) |
`fields` | [UnsureIdentifier](../modules/_ast_.md#unsureidentifier)[] |
`select` | [Select](_ast_.select.md) |

**Returns:** *Promise‹number›*

▸ **insert**(`table`: [UnsureIdentifier](../modules/_ast_.md#unsureidentifier), `rows`: [UnsureExpression](../modules/_ast_.md#unsureexpression)[][]): *Promise‹number›*

Defined in src/executor.ts:198

**Parameters:**

Name | Type |
------ | ------ |
`table` | [UnsureIdentifier](../modules/_ast_.md#unsureidentifier) |
`rows` | [UnsureExpression](../modules/_ast_.md#unsureexpression)[][] |

**Returns:** *Promise‹number›*

▸ **insert**(`table`: [UnsureIdentifier](../modules/_ast_.md#unsureidentifier), `row`: [UnsureExpression](../modules/_ast_.md#unsureexpression)[]): *Promise‹number›*

Defined in src/executor.ts:199

**Parameters:**

Name | Type |
------ | ------ |
`table` | [UnsureIdentifier](../modules/_ast_.md#unsureidentifier) |
`row` | [UnsureExpression](../modules/_ast_.md#unsureexpression)[] |

**Returns:** *Promise‹number›*

▸ **insert**(`table`: [UnsureIdentifier](../modules/_ast_.md#unsureidentifier), `fields`: [UnsureIdentifier](../modules/_ast_.md#unsureidentifier)[], `row`: [UnsureExpression](../modules/_ast_.md#unsureexpression)[]): *Promise‹number›*

Defined in src/executor.ts:200

**Parameters:**

Name | Type |
------ | ------ |
`table` | [UnsureIdentifier](../modules/_ast_.md#unsureidentifier) |
`fields` | [UnsureIdentifier](../modules/_ast_.md#unsureidentifier)[] |
`row` | [UnsureExpression](../modules/_ast_.md#unsureexpression)[] |

**Returns:** *Promise‹number›*

▸ **insert**(`table`: [UnsureIdentifier](../modules/_ast_.md#unsureidentifier), `fields`: [UnsureIdentifier](../modules/_ast_.md#unsureidentifier)[], `rows`: [UnsureExpression](../modules/_ast_.md#unsureexpression)[][]): *Promise‹number›*

Defined in src/executor.ts:201

**Parameters:**

Name | Type |
------ | ------ |
`table` | [UnsureIdentifier](../modules/_ast_.md#unsureidentifier) |
`fields` | [UnsureIdentifier](../modules/_ast_.md#unsureidentifier)[] |
`rows` | [UnsureExpression](../modules/_ast_.md#unsureexpression)[][] |

**Returns:** *Promise‹number›*

▸ **insert**‹**T**›(`table`: [UnsureIdentifier](../modules/_ast_.md#unsureidentifier), `items`: T[]): *Promise‹number›*

Defined in src/executor.ts:202

**Type parameters:**

▪ **T**: *[KeyValueObject](../interfaces/_ast_.keyvalueobject.md)*

**Parameters:**

Name | Type |
------ | ------ |
`table` | [UnsureIdentifier](../modules/_ast_.md#unsureidentifier) |
`items` | T[] |

**Returns:** *Promise‹number›*

▸ **insert**‹**T**›(`table`: [UnsureIdentifier](../modules/_ast_.md#unsureidentifier), `item`: T): *Promise‹number›*

Defined in src/executor.ts:203

**Type parameters:**

▪ **T**: *[KeyValueObject](../interfaces/_ast_.keyvalueobject.md)*

**Parameters:**

Name | Type |
------ | ------ |
`table` | [UnsureIdentifier](../modules/_ast_.md#unsureidentifier) |
`item` | T |

**Returns:** *Promise‹number›*

▸ **insert**‹**T**›(`table`: [UnsureIdentifier](../modules/_ast_.md#unsureidentifier), `fields`: [UnsureIdentifier](../modules/_ast_.md#unsureidentifier)[], `items`: T[]): *Promise‹number›*

Defined in src/executor.ts:204

**Type parameters:**

▪ **T**: *[KeyValueObject](../interfaces/_ast_.keyvalueobject.md)*

**Parameters:**

Name | Type |
------ | ------ |
`table` | [UnsureIdentifier](../modules/_ast_.md#unsureidentifier) |
`fields` | [UnsureIdentifier](../modules/_ast_.md#unsureidentifier)[] |
`items` | T[] |

**Returns:** *Promise‹number›*

▸ **insert**‹**T**›(`table`: [UnsureIdentifier](../modules/_ast_.md#unsureidentifier), `fields`: [UnsureIdentifier](../modules/_ast_.md#unsureidentifier)[], `item`: T): *Promise‹number›*

Defined in src/executor.ts:205

**Type parameters:**

▪ **T**: *[KeyValueObject](../interfaces/_ast_.keyvalueobject.md)*

**Parameters:**

Name | Type |
------ | ------ |
`table` | [UnsureIdentifier](../modules/_ast_.md#unsureidentifier) |
`fields` | [UnsureIdentifier](../modules/_ast_.md#unsureidentifier)[] |
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

Defined in src/executor.ts:169

**Type parameters:**

▪ **TResult**

**Parameters:**

Name | Type |
------ | ------ |
`sql` | string |

**Returns:** *Promise‹[QueryResult](../interfaces/_executor_.queryresult.md)‹TResult››*

▸ **query**‹**TResult**›(`sql`: string, `params`: [Parameter](_ast_.parameter.md)[]): *Promise‹[QueryResult](../interfaces/_executor_.queryresult.md)‹TResult››*

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

Defined in src/executor.ts:172

**Type parameters:**

▪ **TResult**

**Parameters:**

Name | Type |
------ | ------ |
`sql` | [Statement](_ast_.statement.md) &#124; Document |

**Returns:** *Promise‹[QueryResult](../interfaces/_executor_.queryresult.md)‹TResult››*

▸ **query**‹**TResult**›(`sql`: TemplateStringsArray, ...`params`: any[]): *Promise‹[QueryResult](../interfaces/_executor_.queryresult.md)‹TResult››*

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

Defined in src/executor.ts:182

执行一个查询并获取返回的第一个标量值

**Type parameters:**

▪ **TResult**: *[JsConstant](../modules/_ast_.md#jsconstant)*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`sql` | string |   |
`params?` | [Parameter](_ast_.parameter.md)[] | - |

**Returns:** *Promise‹TResult›*

▸ **queryScalar**‹**TResult**›(`sql`: string, `params?`: Object): *Promise‹TResult›*

Defined in src/executor.ts:183

**Type parameters:**

▪ **TResult**: *[JsConstant](../modules/_ast_.md#jsconstant)*

**Parameters:**

Name | Type |
------ | ------ |
`sql` | string |
`params?` | Object |

**Returns:** *Promise‹TResult›*

▸ **queryScalar**‹**TResult**›(`sql`: [Statement](_ast_.statement.md) | Document): *Promise‹TResult›*

Defined in src/executor.ts:184

**Type parameters:**

▪ **TResult**: *[JsConstant](../modules/_ast_.md#jsconstant)*

**Parameters:**

Name | Type |
------ | ------ |
`sql` | [Statement](_ast_.statement.md) &#124; Document |

**Returns:** *Promise‹TResult›*

▸ **queryScalar**‹**TResult**›(`sql`: string[], ...`params`: any[]): *Promise‹TResult›*

Defined in src/executor.ts:185

**Type parameters:**

▪ **TResult**: *[JsConstant](../modules/_ast_.md#jsconstant)*

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

▸ **select**‹**TResult**›(`table`: [UnsureIdentifier](../modules/_ast_.md#unsureidentifier), `options`: [SelectOptions](../interfaces/_executor_.selectoptions.md)‹TResult›): *Promise‹TResult[]›*

Defined in src/executor.ts:265

简化版的SELECT查询，用于快速查询，如果要用复杂的查询，请使用select语句

**Type parameters:**

▪ **TResult**

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`table` | [UnsureIdentifier](../modules/_ast_.md#unsureidentifier) | - | - |
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

###  update

▸ **update**(`table`: [UnsureIdentifier](../modules/_ast_.md#unsureidentifier), `sets`: [Assignment](_ast_.assignment.md)[], `where?`: [UnsureCondition](../modules/_ast_.md#unsurecondition)): *Promise‹number›*

Defined in src/executor.ts:295

**Parameters:**

Name | Type |
------ | ------ |
`table` | [UnsureIdentifier](../modules/_ast_.md#unsureidentifier) |
`sets` | [Assignment](_ast_.assignment.md)[] |
`where?` | [UnsureCondition](../modules/_ast_.md#unsurecondition) |

**Returns:** *Promise‹number›*

▸ **update**‹**T**›(`table`: [UnsureIdentifier](../modules/_ast_.md#unsureidentifier), `sets`: T, `where?`: [UnsureCondition](../modules/_ast_.md#unsurecondition)): *Promise‹number›*

Defined in src/executor.ts:296

**Type parameters:**

▪ **T**: *[ValuesObject](../modules/_ast_.md#valuesobject)*

**Parameters:**

Name | Type |
------ | ------ |
`table` | [UnsureIdentifier](../modules/_ast_.md#unsureidentifier) |
`sets` | T |
`where?` | [UnsureCondition](../modules/_ast_.md#unsurecondition) |

**Returns:** *Promise‹number›*

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
