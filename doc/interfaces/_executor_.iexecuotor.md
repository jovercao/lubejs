[lubejs](../README.md) › [Globals](../globals.md) › ["executor"](../modules/_executor_.md) › [IExecuotor](_executor_.iexecuotor.md)

# Interface: IExecuotor

## Hierarchy

* **IExecuotor**

## Implemented by

* [Executor](../classes/_executor_.executor.md)
* [Lube](../classes/_lube_.lube.md)

## Index

### Properties

* [doQuery](_executor_.iexecuotor.md#doquery)

### Methods

* [execute](_executor_.iexecuotor.md#execute)
* [find](_executor_.iexecuotor.md#find)
* [insert](_executor_.iexecuotor.md#insert)
* [query](_executor_.iexecuotor.md#query)
* [queryScalar](_executor_.iexecuotor.md#queryscalar)
* [select](_executor_.iexecuotor.md#select)
* [update](_executor_.iexecuotor.md#update)

## Properties

###  doQuery

• **doQuery**: *[QueryHandler](_executor_.queryhandler.md)*

Defined in src/executor.ts:39

## Methods

###  execute

▸ **execute**(`spname`: [UnsureIdentity](../modules/_ast_.md#unsureidentity), `params`: [UnsureExpression](../modules/_ast_.md#unsureexpression)[]): *Promise‹number›*

Defined in src/executor.ts:80

**Parameters:**

Name | Type |
------ | ------ |
`spname` | [UnsureIdentity](../modules/_ast_.md#unsureidentity) |
`params` | [UnsureExpression](../modules/_ast_.md#unsureexpression)[] |

**Returns:** *Promise‹number›*

▸ **execute**(`spname`: [UnsureIdentity](../modules/_ast_.md#unsureidentity), `params`: [Parameter](../classes/_ast_.parameter.md)[]): *Promise‹number›*

Defined in src/executor.ts:81

**Parameters:**

Name | Type |
------ | ------ |
`spname` | [UnsureIdentity](../modules/_ast_.md#unsureidentity) |
`params` | [Parameter](../classes/_ast_.parameter.md)[] |

**Returns:** *Promise‹number›*

▸ **execute**(`spname`: any, `params`: any): *Promise‹[QueryResult](_executor_.queryresult.md)›*

Defined in src/executor.ts:88

执行存储过程

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`spname` | any | 存储过程名称 |
`params` | any |   |

**Returns:** *Promise‹[QueryResult](_executor_.queryresult.md)›*

___

###  find

▸ **find**(`table`: [UnsureIdentity](../modules/_ast_.md#unsureidentity), `where`: [Condition](../classes/_ast_.condition.md), `fields?`: string[]): *Promise‹object›*

Defined in src/executor.ts:66

**Parameters:**

Name | Type |
------ | ------ |
`table` | [UnsureIdentity](../modules/_ast_.md#unsureidentity) |
`where` | [Condition](../classes/_ast_.condition.md) |
`fields?` | string[] |

**Returns:** *Promise‹object›*

___

###  insert

▸ **insert**(`table`: [UnsureIdentity](../modules/_ast_.md#unsureidentity), `select`: [Select](../classes/_ast_.select.md)): *Promise‹number›*

Defined in src/executor.ts:60

插入数据的快捷操作

**Parameters:**

Name | Type |
------ | ------ |
`table` | [UnsureIdentity](../modules/_ast_.md#unsureidentity) |
`select` | [Select](../classes/_ast_.select.md) |

**Returns:** *Promise‹number›*

▸ **insert**(`table`: [UnsureIdentity](../modules/_ast_.md#unsureidentity), `fields`: [UnsureIdentity](../modules/_ast_.md#unsureidentity)[], `select`: [Select](../classes/_ast_.select.md)): *Promise‹number›*

Defined in src/executor.ts:61

**Parameters:**

Name | Type |
------ | ------ |
`table` | [UnsureIdentity](../modules/_ast_.md#unsureidentity) |
`fields` | [UnsureIdentity](../modules/_ast_.md#unsureidentity)[] |
`select` | [Select](../classes/_ast_.select.md) |

**Returns:** *Promise‹number›*

▸ **insert**(`table`: [UnsureIdentity](../modules/_ast_.md#unsureidentity), `rows`: [KeyValueObject](_ast_.keyvalueobject.md)[]): *Promise‹number›*

Defined in src/executor.ts:62

**Parameters:**

Name | Type |
------ | ------ |
`table` | [UnsureIdentity](../modules/_ast_.md#unsureidentity) |
`rows` | [KeyValueObject](_ast_.keyvalueobject.md)[] |

**Returns:** *Promise‹number›*

▸ **insert**(`table`: [UnsureIdentity](../modules/_ast_.md#unsureidentity), `row`: [KeyValueObject](_ast_.keyvalueobject.md)): *Promise‹number›*

Defined in src/executor.ts:63

**Parameters:**

Name | Type |
------ | ------ |
`table` | [UnsureIdentity](../modules/_ast_.md#unsureidentity) |
`row` | [KeyValueObject](_ast_.keyvalueobject.md) |

**Returns:** *Promise‹number›*

▸ **insert**(`table`: [UnsureIdentity](../modules/_ast_.md#unsureidentity), `fields`: [UnsureIdentity](../modules/_ast_.md#unsureidentity)[], `rows`: [UnsureExpression](../modules/_ast_.md#unsureexpression)[][]): *Promise‹number›*

Defined in src/executor.ts:64

**Parameters:**

Name | Type |
------ | ------ |
`table` | [UnsureIdentity](../modules/_ast_.md#unsureidentity) |
`fields` | [UnsureIdentity](../modules/_ast_.md#unsureidentity)[] |
`rows` | [UnsureExpression](../modules/_ast_.md#unsureexpression)[][] |

**Returns:** *Promise‹number›*

___

###  query

▸ **query**(`sql`: string, `params`: [Parameter](../classes/_ast_.parameter.md)[]): *Promise‹[QueryResult](_executor_.queryresult.md)›*

Defined in src/executor.ts:41

**Parameters:**

Name | Type |
------ | ------ |
`sql` | string |
`params` | [Parameter](../classes/_ast_.parameter.md)[] |

**Returns:** *Promise‹[QueryResult](_executor_.queryresult.md)›*

▸ **query**(`sql`: string, `params`: Object): *Promise‹[QueryResult](_executor_.queryresult.md)›*

Defined in src/executor.ts:42

**Parameters:**

Name | Type |
------ | ------ |
`sql` | string |
`params` | Object |

**Returns:** *Promise‹[QueryResult](_executor_.queryresult.md)›*

▸ **query**(`sql`: [Statement](../classes/_ast_.statement.md) | Document): *Promise‹[QueryResult](_executor_.queryresult.md)›*

Defined in src/executor.ts:43

**Parameters:**

Name | Type |
------ | ------ |
`sql` | [Statement](../classes/_ast_.statement.md) &#124; Document |

**Returns:** *Promise‹[QueryResult](_executor_.queryresult.md)›*

___

###  queryScalar

▸ **queryScalar**(`sql`: string, `params`: [Parameter](../classes/_ast_.parameter.md)[]): *Promise‹[JsConstant](../modules/_ast_.md#jsconstant)›*

Defined in src/executor.ts:49

执行一个查询并获取返回的第一个标量值

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`sql` | string |   |
`params` | [Parameter](../classes/_ast_.parameter.md)[] | - |

**Returns:** *Promise‹[JsConstant](../modules/_ast_.md#jsconstant)›*

▸ **queryScalar**(`sql`: string, `params`: Object): *Promise‹[JsConstant](../modules/_ast_.md#jsconstant)›*

Defined in src/executor.ts:50

**Parameters:**

Name | Type |
------ | ------ |
`sql` | string |
`params` | Object |

**Returns:** *Promise‹[JsConstant](../modules/_ast_.md#jsconstant)›*

▸ **queryScalar**(`sql`: [Statement](../classes/_ast_.statement.md) | Document): *Promise‹[JsConstant](../modules/_ast_.md#jsconstant)›*

Defined in src/executor.ts:51

**Parameters:**

Name | Type |
------ | ------ |
`sql` | [Statement](../classes/_ast_.statement.md) &#124; Document |

**Returns:** *Promise‹[JsConstant](../modules/_ast_.md#jsconstant)›*

▸ **queryScalar**(`sql`: string[], ...`params`: any[]): *Promise‹[JsConstant](../modules/_ast_.md#jsconstant)›*

Defined in src/executor.ts:52

**Parameters:**

Name | Type |
------ | ------ |
`sql` | string[] |
`...params` | any[] |

**Returns:** *Promise‹[JsConstant](../modules/_ast_.md#jsconstant)›*

___

###  select

▸ **select**(`table`: [UnsureIdentity](../modules/_ast_.md#unsureidentity), `options?`: [SelectOptions](_executor_.selectoptions.md)): *Promise‹object›*

Defined in src/executor.ts:74

简化版的SELECT查询，用于快速查询，如果要用复杂的查询，请使用select语句

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`table` | [UnsureIdentity](../modules/_ast_.md#unsureidentity) | - |
`options?` | [SelectOptions](_executor_.selectoptions.md) |   |

**Returns:** *Promise‹object›*

___

###  update

▸ **update**(`table`: [UnsureIdentity](../modules/_ast_.md#unsureidentity), `sets`: [Assignment](../classes/_ast_.assignment.md)[], `where?`: [UnsureConditions](../modules/_ast_.md#unsureconditions)): *Promise‹number›*

Defined in src/executor.ts:76

**Parameters:**

Name | Type |
------ | ------ |
`table` | [UnsureIdentity](../modules/_ast_.md#unsureidentity) |
`sets` | [Assignment](../classes/_ast_.assignment.md)[] |
`where?` | [UnsureConditions](../modules/_ast_.md#unsureconditions) |

**Returns:** *Promise‹number›*

▸ **update**(`table`: [UnsureIdentity](../modules/_ast_.md#unsureidentity), `sets`: [KeyValueObject](_ast_.keyvalueobject.md), `where?`: [UnsureConditions](../modules/_ast_.md#unsureconditions)): *Promise‹number›*

Defined in src/executor.ts:77

**Parameters:**

Name | Type |
------ | ------ |
`table` | [UnsureIdentity](../modules/_ast_.md#unsureidentity) |
`sets` | [KeyValueObject](_ast_.keyvalueobject.md) |
`where?` | [UnsureConditions](../modules/_ast_.md#unsureconditions) |

**Returns:** *Promise‹number›*

▸ **update**(`table`: [UnsureIdentity](../modules/_ast_.md#unsureidentity), `sets`: [KeyValueObject](_ast_.keyvalueobject.md) | [Assignment](../classes/_ast_.assignment.md)[], `where?`: [UnsureConditions](../modules/_ast_.md#unsureconditions)): *Promise‹number›*

Defined in src/executor.ts:78

**Parameters:**

Name | Type |
------ | ------ |
`table` | [UnsureIdentity](../modules/_ast_.md#unsureidentity) |
`sets` | [KeyValueObject](_ast_.keyvalueobject.md) &#124; [Assignment](../classes/_ast_.assignment.md)[] |
`where?` | [UnsureConditions](../modules/_ast_.md#unsureconditions) |

**Returns:** *Promise‹number›*
