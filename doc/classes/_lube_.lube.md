[lubejs](../README.md) › [Globals](../globals.md) › ["lube"](../modules/_lube_.md) › [Lube](_lube_.lube.md)

# Class: Lube

## Hierarchy

* [Executor](_execute_.executor.md)

  ↳ **Lube**

## Index

### Constructors

* [constructor](_lube_.lube.md#constructor)

### Properties

* [_emitter](_lube_.lube.md#protected-_emitter)
* [compiler](_lube_.lube.md#readonly-compiler)
* [isTrans](_lube_.lube.md#readonly-istrans)
* [provider](_lube_.lube.md#private-provider)

### Methods

* [close](_lube_.lube.md#close)
* [delete](_lube_.lube.md#delete)
* [emit](_lube_.lube.md#emit)
* [execute](_lube_.lube.md#execute)
* [find](_lube_.lube.md#find)
* [getQueryable](_lube_.lube.md#getqueryable)
* [insert](_lube_.lube.md#insert)
* [off](_lube_.lube.md#off)
* [on](_lube_.lube.md#on)
* [query](_lube_.lube.md#query)
* [queryScalar](_lube_.lube.md#queryscalar)
* [queryable](_lube_.lube.md#queryable)
* [save](_lube_.lube.md#save)
* [select](_lube_.lube.md#select)
* [trans](_lube_.lube.md#trans)
* [update](_lube_.lube.md#update)

## Constructors

###  constructor

\+ **new Lube**(`provider`: [IDbProvider](../interfaces/_lube_.idbprovider.md)): *[Lube](_lube_.lube.md)*

*Overrides [Executor](_execute_.executor.md).[constructor](_execute_.executor.md#protected-constructor)*

Defined in lube.ts:108

**Parameters:**

Name | Type |
------ | ------ |
`provider` | [IDbProvider](../interfaces/_lube_.idbprovider.md) |

**Returns:** *[Lube](_lube_.lube.md)*

## Properties

### `Protected` _emitter

• **_emitter**: *EventEmitter* = new EventEmitter()

*Inherited from [Lube](_lube_.lube.md).[_emitter](_lube_.lube.md#protected-_emitter)*

Defined in execute.ts:114

___

### `Readonly` compiler

• **compiler**: *[Compiler](_compile_.compiler.md)*

*Inherited from [Lube](_lube_.lube.md).[compiler](_lube_.lube.md#readonly-compiler)*

Defined in execute.ts:142

编译器

___

### `Readonly` isTrans

• **isTrans**: *boolean*

*Inherited from [Lube](_lube_.lube.md).[isTrans](_lube_.lube.md#readonly-istrans)*

Defined in execute.ts:147

是否在事务当中

___

### `Private` provider

• **provider**: *[IDbProvider](../interfaces/_lube_.idbprovider.md)*

Defined in lube.ts:108

## Methods

###  close

▸ **close**(): *Promise‹void›*

Defined in lube.ts:167

**Returns:** *Promise‹void›*

___

###  delete

▸ **delete**‹**T**›(`table`: [Table](_ast_.table.md)‹T, string› | [Name](../modules/_ast_.md#name)‹string›, `where?`: [WhereObject](../modules/_ast_.md#whereobject)‹T› | [Condition](_ast_.condition.md) | function): *Promise‹number›*

*Inherited from [Lube](_lube_.lube.md).[delete](_lube_.lube.md#delete)*

Defined in execute.ts:563

**Type parameters:**

▪ **T**: *[RowObject](../modules/_ast_.md#rowobject)*

**Parameters:**

Name | Type |
------ | ------ |
`table` | [Table](_ast_.table.md)‹T, string› &#124; [Name](../modules/_ast_.md#name)‹string› |
`where?` | [WhereObject](../modules/_ast_.md#whereobject)‹T› &#124; [Condition](_ast_.condition.md) &#124; function |

**Returns:** *Promise‹number›*

___

###  emit

▸ **emit**(`event`: string, ...`args`: any): *this*

*Inherited from [Lube](_lube_.lube.md).[emit](_lube_.lube.md#emit)*

Defined in execute.ts:171

**Parameters:**

Name | Type |
------ | ------ |
`event` | string |
`...args` | any |

**Returns:** *this*

___

###  execute

▸ **execute**‹**R**, **O**›(`spName`: [Name](../modules/_ast_.md#name)‹string› | [Procedure](_ast_.procedure.md)‹R, O›, `params?`: [CompatibleExpression](../modules/_ast_.md#compatibleexpression)[]): *Promise‹[QueryResult](../interfaces/_execute_.queryresult.md)‹O[0], R, O››*

*Inherited from [Lube](_lube_.lube.md).[execute](_lube_.lube.md#execute)*

Defined in execute.ts:579

**Type parameters:**

▪ **R**: *[ScalarType](../modules/_types_.md#scalartype)*

▪ **O**: *[RowObject](../modules/_ast_.md#rowobject)[]*

**Parameters:**

Name | Type |
------ | ------ |
`spName` | [Name](../modules/_ast_.md#name)‹string› &#124; [Procedure](_ast_.procedure.md)‹R, O› |
`params?` | [CompatibleExpression](../modules/_ast_.md#compatibleexpression)[] |

**Returns:** *Promise‹[QueryResult](../interfaces/_execute_.queryresult.md)‹O[0], R, O››*

___

###  find

▸ **find**‹**T**›(`table`: [Table](_ast_.table.md)‹T, string› | [Name](../modules/_ast_.md#name)‹string›, `where`: [Condition](_ast_.condition.md) | [WhereObject](../modules/_ast_.md#whereobject)‹T› | function, `fields?`: [FieldsOf](../modules/_ast_.md#fieldsof)‹T›[] | [Field](_ast_.field.md)‹[ScalarType](../modules/_types_.md#scalartype), [FieldsOf](../modules/_ast_.md#fieldsof)‹T››[]): *Promise‹T›*

*Inherited from [Lube](_lube_.lube.md).[find](_lube_.lube.md#find)*

Defined in execute.ts:385

**Type parameters:**

▪ **T**: *[RowObject](../modules/_ast_.md#rowobject)*

**Parameters:**

Name | Type |
------ | ------ |
`table` | [Table](_ast_.table.md)‹T, string› &#124; [Name](../modules/_ast_.md#name)‹string› |
`where` | [Condition](_ast_.condition.md) &#124; [WhereObject](../modules/_ast_.md#whereobject)‹T› &#124; function |
`fields?` | [FieldsOf](../modules/_ast_.md#fieldsof)‹T›[] &#124; [Field](_ast_.field.md)‹[ScalarType](../modules/_types_.md#scalartype), [FieldsOf](../modules/_ast_.md#fieldsof)‹T››[] |

**Returns:** *Promise‹T›*

___

###  getQueryable

▸ **getQueryable**‹**T**, **N**›(`table`: [CompatibleTable](../modules/_ast_.md#compatibletable)‹T, N›): *[Queryable](_queryable_.queryable.md)‹T›*

*Inherited from [Lube](_lube_.lube.md).[getQueryable](_lube_.lube.md#getqueryable)*

Defined in execute.ts:133

**Type parameters:**

▪ **T**: *[RowObject](../modules/_ast_.md#rowobject)*

▪ **N**: *string*

**Parameters:**

Name | Type |
------ | ------ |
`table` | [CompatibleTable](../modules/_ast_.md#compatibletable)‹T, N› |

**Returns:** *[Queryable](_queryable_.queryable.md)‹T›*

___

###  insert

▸ **insert**‹**T**›(`table`: [Name](../modules/_ast_.md#name)‹string› | [Table](_ast_.table.md)‹T, string›, `values?`: [InputObject](../modules/_ast_.md#inputobject)‹T› | [InputObject](../modules/_ast_.md#inputobject)‹T›[] | [CompatibleExpression](../modules/_ast_.md#compatibleexpression)[]): *Promise‹number›*

*Inherited from [Lube](_lube_.lube.md).[insert](_lube_.lube.md#insert)*

Defined in execute.ts:293

插入数据

**Type parameters:**

▪ **T**: *[RowObject](../modules/_ast_.md#rowobject)*

**Parameters:**

Name | Type |
------ | ------ |
`table` | [Name](../modules/_ast_.md#name)‹string› &#124; [Table](_ast_.table.md)‹T, string› |
`values?` | [InputObject](../modules/_ast_.md#inputobject)‹T› &#124; [InputObject](../modules/_ast_.md#inputobject)‹T›[] &#124; [CompatibleExpression](../modules/_ast_.md#compatibleexpression)[] |

**Returns:** *Promise‹number›*

▸ **insert**‹**T**›(`table`: [Name](../modules/_ast_.md#name)‹string› | [Table](_ast_.table.md)‹T, string›, `values?`: T | T[]): *Promise‹number›*

*Inherited from [Lube](_lube_.lube.md).[insert](_lube_.lube.md#insert)*

Defined in execute.ts:300

插入数据

**Type parameters:**

▪ **T**: *[RowObject](../modules/_ast_.md#rowobject)*

**Parameters:**

Name | Type |
------ | ------ |
`table` | [Name](../modules/_ast_.md#name)‹string› &#124; [Table](_ast_.table.md)‹T, string› |
`values?` | T &#124; T[] |

**Returns:** *Promise‹number›*

▸ **insert**‹**T**›(`table`: [Name](../modules/_ast_.md#name)‹string› | [Table](_ast_.table.md)‹T, string›, `fields`: [FieldsOf](../modules/_ast_.md#fieldsof)‹T›[] | [Field](_ast_.field.md)‹[ScalarType](../modules/_types_.md#scalartype), [FieldsOf](../modules/_ast_.md#fieldsof)‹T››[], `value?`: [InputObject](../modules/_ast_.md#inputobject)‹T› | [InputObject](../modules/_ast_.md#inputobject)‹T›[] | [CompatibleExpression](../modules/_ast_.md#compatibleexpression)[] | [CompatibleExpression](../modules/_ast_.md#compatibleexpression)[][]): *Promise‹number›*

*Inherited from [Lube](_lube_.lube.md).[insert](_lube_.lube.md#insert)*

Defined in execute.ts:304

**Type parameters:**

▪ **T**: *[RowObject](../modules/_ast_.md#rowobject)*

**Parameters:**

Name | Type |
------ | ------ |
`table` | [Name](../modules/_ast_.md#name)‹string› &#124; [Table](_ast_.table.md)‹T, string› |
`fields` | [FieldsOf](../modules/_ast_.md#fieldsof)‹T›[] &#124; [Field](_ast_.field.md)‹[ScalarType](../modules/_types_.md#scalartype), [FieldsOf](../modules/_ast_.md#fieldsof)‹T››[] |
`value?` | [InputObject](../modules/_ast_.md#inputobject)‹T› &#124; [InputObject](../modules/_ast_.md#inputobject)‹T›[] &#124; [CompatibleExpression](../modules/_ast_.md#compatibleexpression)[] &#124; [CompatibleExpression](../modules/_ast_.md#compatibleexpression)[][] |

**Returns:** *Promise‹number›*

▸ **insert**‹**T**›(`table`: [Name](../modules/_ast_.md#name)‹string› | [Table](_ast_.table.md)‹T, string›, `fields`: [FieldsOf](../modules/_ast_.md#fieldsof)‹T›[] | [Field](_ast_.field.md)‹[ScalarType](../modules/_types_.md#scalartype), [FieldsOf](../modules/_ast_.md#fieldsof)‹T››[], `value?`: T | T[]): *Promise‹number›*

*Inherited from [Lube](_lube_.lube.md).[insert](_lube_.lube.md#insert)*

Defined in execute.ts:313

**Type parameters:**

▪ **T**: *[RowObject](../modules/_ast_.md#rowobject)*

**Parameters:**

Name | Type |
------ | ------ |
`table` | [Name](../modules/_ast_.md#name)‹string› &#124; [Table](_ast_.table.md)‹T, string› |
`fields` | [FieldsOf](../modules/_ast_.md#fieldsof)‹T›[] &#124; [Field](_ast_.field.md)‹[ScalarType](../modules/_types_.md#scalartype), [FieldsOf](../modules/_ast_.md#fieldsof)‹T››[] |
`value?` | T &#124; T[] |

**Returns:** *Promise‹number›*

___

###  off

▸ **off**(`event`: "command", `listener?`: function): *this*

*Inherited from [Lube](_lube_.lube.md).[off](_lube_.lube.md#off)*

Defined in execute.ts:158

**Parameters:**

▪ **event**: *"command"*

▪`Optional`  **listener**: *function*

▸ (`cmd`: [Command](../interfaces/_execute_.command.md)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`cmd` | [Command](../interfaces/_execute_.command.md) |

**Returns:** *this*

▸ **off**(`event`: "commit", `listener?`: function): *this*

*Inherited from [Lube](_lube_.lube.md).[off](_lube_.lube.md#off)*

Defined in execute.ts:159

**Parameters:**

▪ **event**: *"commit"*

▪`Optional`  **listener**: *function*

▸ (`executor`: [Executor](_execute_.executor.md)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`executor` | [Executor](_execute_.executor.md) |

**Returns:** *this*

▸ **off**(`event`: "rollback", `listener?`: function): *this*

*Inherited from [Lube](_lube_.lube.md).[off](_lube_.lube.md#off)*

Defined in execute.ts:160

**Parameters:**

▪ **event**: *"rollback"*

▪`Optional`  **listener**: *function*

▸ (`executor`: [Executor](_execute_.executor.md)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`executor` | [Executor](_execute_.executor.md) |

**Returns:** *this*

▸ **off**(`event`: "error", `listener?`: function): *this*

*Inherited from [Lube](_lube_.lube.md).[off](_lube_.lube.md#off)*

Defined in execute.ts:161

**Parameters:**

▪ **event**: *"error"*

▪`Optional`  **listener**: *function*

▸ (`error`: Error): *any*

**Parameters:**

Name | Type |
------ | ------ |
`error` | Error |

**Returns:** *this*

___

###  on

▸ **on**(`event`: "command", `listener`: function): *this*

*Inherited from [Lube](_lube_.lube.md).[on](_lube_.lube.md#on)*

Defined in execute.ts:149

**Parameters:**

▪ **event**: *"command"*

▪ **listener**: *function*

▸ (`cmd`: [Command](../interfaces/_execute_.command.md)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`cmd` | [Command](../interfaces/_execute_.command.md) |

**Returns:** *this*

▸ **on**(`event`: "commit", `listener`: function): *this*

*Inherited from [Lube](_lube_.lube.md).[on](_lube_.lube.md#on)*

Defined in execute.ts:150

**Parameters:**

▪ **event**: *"commit"*

▪ **listener**: *function*

▸ (`executor`: [Executor](_execute_.executor.md)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`executor` | [Executor](_execute_.executor.md) |

**Returns:** *this*

▸ **on**(`event`: "rollback", `listener`: function): *this*

*Inherited from [Lube](_lube_.lube.md).[on](_lube_.lube.md#on)*

Defined in execute.ts:151

**Parameters:**

▪ **event**: *"rollback"*

▪ **listener**: *function*

▸ (`executor`: [Executor](_execute_.executor.md)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`executor` | [Executor](_execute_.executor.md) |

**Returns:** *this*

▸ **on**(`event`: "error", `listener`: function): *this*

*Inherited from [Lube](_lube_.lube.md).[on](_lube_.lube.md#on)*

Defined in execute.ts:152

**Parameters:**

▪ **event**: *"error"*

▪ **listener**: *function*

▸ (`error`: Error): *any*

**Parameters:**

Name | Type |
------ | ------ |
`error` | Error |

**Returns:** *this*

___

###  query

▸ **query**‹**T**›(`sql`: [Select](_ast_.select.md)‹T›): *Promise‹[QueryResult](../interfaces/_execute_.queryresult.md)‹T››*

*Inherited from [Lube](_lube_.lube.md).[query](_lube_.lube.md#query)*

Defined in execute.ts:232

**Type parameters:**

▪ **T**: *[RowObject](../modules/_ast_.md#rowobject)*

**Parameters:**

Name | Type |
------ | ------ |
`sql` | [Select](_ast_.select.md)‹T› |

**Returns:** *Promise‹[QueryResult](../interfaces/_execute_.queryresult.md)‹T››*

▸ **query**‹**R**, **O**›(`sql`: [Execute](_ast_.execute.md)‹R, O›): *Promise‹[QueryResult](../interfaces/_execute_.queryresult.md)‹O[0], R, O››*

*Inherited from [Lube](_lube_.lube.md).[query](_lube_.lube.md#query)*

Defined in execute.ts:238

执行一个存储过程执行代码

**Type parameters:**

▪ **R**: *[ScalarType](../modules/_types_.md#scalartype)*

▪ **O**: *[RowObject](../modules/_ast_.md#rowobject)[]*

**Parameters:**

Name | Type |
------ | ------ |
`sql` | [Execute](_ast_.execute.md)‹R, O› |

**Returns:** *Promise‹[QueryResult](../interfaces/_execute_.queryresult.md)‹O[0], R, O››*

▸ **query**‹**T**›(`sql`: string): *Promise‹[QueryResult](../interfaces/_execute_.queryresult.md)‹T››*

*Inherited from [Lube](_lube_.lube.md).[query](_lube_.lube.md#query)*

Defined in execute.ts:243

**Type parameters:**

▪ **T**: *[RowObject](../modules/_ast_.md#rowobject)*

**Parameters:**

Name | Type |
------ | ------ |
`sql` | string |

**Returns:** *Promise‹[QueryResult](../interfaces/_execute_.queryresult.md)‹T››*

▸ **query**‹**T**›(`sql`: string, `params`: [Parameter](_ast_.parameter.md)[]): *Promise‹[QueryResult](../interfaces/_execute_.queryresult.md)‹T››*

*Inherited from [Lube](_lube_.lube.md).[query](_lube_.lube.md#query)*

Defined in execute.ts:244

**Type parameters:**

▪ **T**: *[RowObject](../modules/_ast_.md#rowobject)*

**Parameters:**

Name | Type |
------ | ------ |
`sql` | string |
`params` | [Parameter](_ast_.parameter.md)[] |

**Returns:** *Promise‹[QueryResult](../interfaces/_execute_.queryresult.md)‹T››*

▸ **query**‹**T**›(`sql`: string, `params`: Record‹string, [ScalarType](../modules/_types_.md#scalartype)›): *Promise‹[QueryResult](../interfaces/_execute_.queryresult.md)‹T››*

*Inherited from [Lube](_lube_.lube.md).[query](_lube_.lube.md#query)*

Defined in execute.ts:248

**Type parameters:**

▪ **T**: *[RowObject](../modules/_ast_.md#rowobject)*

**Parameters:**

Name | Type |
------ | ------ |
`sql` | string |
`params` | Record‹string, [ScalarType](../modules/_types_.md#scalartype)› |

**Returns:** *Promise‹[QueryResult](../interfaces/_execute_.queryresult.md)‹T››*

▸ **query**‹**T**›(`sql`: [Statement](_ast_.statement.md) | [Document](_ast_.document.md)): *Promise‹[QueryResult](../interfaces/_execute_.queryresult.md)‹T››*

*Inherited from [Lube](_lube_.lube.md).[query](_lube_.lube.md#query)*

Defined in execute.ts:252

**Type parameters:**

▪ **T**: *[RowObject](../modules/_ast_.md#rowobject)*

**Parameters:**

Name | Type |
------ | ------ |
`sql` | [Statement](_ast_.statement.md) &#124; [Document](_ast_.document.md) |

**Returns:** *Promise‹[QueryResult](../interfaces/_execute_.queryresult.md)‹T››*

▸ **query**‹**T**›(`sql`: TemplateStringsArray, ...`params`: any[]): *Promise‹[QueryResult](../interfaces/_execute_.queryresult.md)‹T››*

*Inherited from [Lube](_lube_.lube.md).[query](_lube_.lube.md#query)*

Defined in execute.ts:255

**Type parameters:**

▪ **T**: *[RowObject](../modules/_ast_.md#rowobject)*

**Parameters:**

Name | Type |
------ | ------ |
`sql` | TemplateStringsArray |
`...params` | any[] |

**Returns:** *Promise‹[QueryResult](../interfaces/_execute_.queryresult.md)‹T››*

___

###  queryScalar

▸ **queryScalar**‹**T**›(`sql`: string, `params?`: [Parameter](_ast_.parameter.md)[]): *Promise‹T›*

*Inherited from [Lube](_lube_.lube.md).[queryScalar](_lube_.lube.md#queryscalar)*

Defined in execute.ts:267

执行一个查询并获取返回的第一个标量值

**Type parameters:**

▪ **T**: *[ScalarType](../modules/_types_.md#scalartype)*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`sql` | string |   |
`params?` | [Parameter](_ast_.parameter.md)[] | - |

**Returns:** *Promise‹T›*

▸ **queryScalar**‹**T**›(`sql`: string, `params?`: [InputObject](../modules/_ast_.md#inputobject)): *Promise‹T›*

*Inherited from [Lube](_lube_.lube.md).[queryScalar](_lube_.lube.md#queryscalar)*

Defined in execute.ts:271

**Type parameters:**

▪ **T**: *[ScalarType](../modules/_types_.md#scalartype)*

**Parameters:**

Name | Type |
------ | ------ |
`sql` | string |
`params?` | [InputObject](../modules/_ast_.md#inputobject) |

**Returns:** *Promise‹T›*

▸ **queryScalar**‹**T**›(`sql`: [Select](_ast_.select.md)‹T›): *Promise‹[AsScalarType](../modules/_ast_.md#asscalartype)‹T››*

*Inherited from [Lube](_lube_.lube.md).[queryScalar](_lube_.lube.md#queryscalar)*

Defined in execute.ts:275

**Type parameters:**

▪ **T**: *[RowObject](../modules/_ast_.md#rowobject)*

**Parameters:**

Name | Type |
------ | ------ |
`sql` | [Select](_ast_.select.md)‹T› |

**Returns:** *Promise‹[AsScalarType](../modules/_ast_.md#asscalartype)‹T››*

▸ **queryScalar**‹**T**›(`sql`: [Select](_ast_.select.md)‹any›): *Promise‹T›*

*Inherited from [Lube](_lube_.lube.md).[queryScalar](_lube_.lube.md#queryscalar)*

Defined in execute.ts:278

**Type parameters:**

▪ **T**: *[ScalarType](../modules/_types_.md#scalartype)*

**Parameters:**

Name | Type |
------ | ------ |
`sql` | [Select](_ast_.select.md)‹any› |

**Returns:** *Promise‹T›*

▸ **queryScalar**‹**T**›(`sql`: TemplateStringsArray, ...`params`: any[]): *Promise‹T›*

*Inherited from [Lube](_lube_.lube.md).[queryScalar](_lube_.lube.md#queryscalar)*

Defined in execute.ts:279

**Type parameters:**

▪ **T**: *[ScalarType](../modules/_types_.md#scalartype)*

**Parameters:**

Name | Type |
------ | ------ |
`sql` | TemplateStringsArray |
`...params` | any[] |

**Returns:** *Promise‹T›*

___

###  queryable

▸ **queryable**‹**T**›(`table`: [Table](_ast_.table.md)‹T, string› | [Name](../modules/_ast_.md#name)‹string›): *[Queryable](_queryable_.queryable.md)‹T›*

*Inherited from [Lube](_lube_.lube.md).[queryable](_lube_.lube.md#queryable)*

Defined in execute.ts:651

**Type parameters:**

▪ **T**: *[RowObject](../modules/_ast_.md#rowobject)*

**Parameters:**

Name | Type |
------ | ------ |
`table` | [Table](_ast_.table.md)‹T, string› &#124; [Name](../modules/_ast_.md#name)‹string› |

**Returns:** *[Queryable](_queryable_.queryable.md)‹T›*

___

###  save

▸ **save**‹**T**›(`table`: [Table](_ast_.table.md)‹T, string› | [Name](../modules/_ast_.md#name)‹string›, `keyFields`: [FieldsOf](../modules/_ast_.md#fieldsof)‹T›[], `items`: T[] | T): *Promise‹number›*

*Inherited from [Lube](_lube_.lube.md).[save](_lube_.lube.md#save)*

Defined in execute.ts:595

保存数据，必须指定主键后才允许使用
通过自动对比与数据库中现有的数据差异而进行提交
遵守不存在的则插入、已存在的则更新的原则；

**Type parameters:**

▪ **T**: *[RowObject](../modules/_ast_.md#rowobject)*

**Parameters:**

Name | Type |
------ | ------ |
`table` | [Table](_ast_.table.md)‹T, string› &#124; [Name](../modules/_ast_.md#name)‹string› |
`keyFields` | [FieldsOf](../modules/_ast_.md#fieldsof)‹T›[] |
`items` | T[] &#124; T |

**Returns:** *Promise‹number›*

___

###  select

▸ **select**‹**T**, **G**›(`table`: [Name](../modules/_ast_.md#name)‹string› | [Table](_ast_.table.md)‹T, string›, `results`: function, `options?`: [SelectOptions](../interfaces/_execute_.selectoptions.md)‹T›): *Promise‹[RowTypeFrom](../modules/_ast_.md#rowtypefrom)‹G›[]›*

*Inherited from [Lube](_lube_.lube.md).[select](_lube_.lube.md#select)*

Defined in execute.ts:417

简化版的SELECT查询，用于快速查询，如果要用复杂的查询，请使用select语句

**Type parameters:**

▪ **T**: *[RowObject](../modules/_ast_.md#rowobject)*

▪ **G**: *[InputObject](../modules/_ast_.md#inputobject)*

**Parameters:**

▪ **table**: *[Name](../modules/_ast_.md#name)‹string› | [Table](_ast_.table.md)‹T, string›*

▪ **results**: *function*

▸ (`rowset`: Readonly‹[Rowset](_ast_.rowset.md)‹T››): *G*

**Parameters:**

Name | Type |
------ | ------ |
`rowset` | Readonly‹[Rowset](_ast_.rowset.md)‹T›› |

▪`Optional`  **options**: *[SelectOptions](../interfaces/_execute_.selectoptions.md)‹T›*

**Returns:** *Promise‹[RowTypeFrom](../modules/_ast_.md#rowtypefrom)‹G›[]›*

▸ **select**‹**T**›(`table`: [Name](../modules/_ast_.md#name)‹string› | [Table](_ast_.table.md)‹T, string›, `options?`: [SelectOptions](../interfaces/_execute_.selectoptions.md)‹T›): *Promise‹T[]›*

*Inherited from [Lube](_lube_.lube.md).[select](_lube_.lube.md#select)*

Defined in execute.ts:422

**Type parameters:**

▪ **T**: *[RowObject](../modules/_ast_.md#rowobject)*

**Parameters:**

Name | Type |
------ | ------ |
`table` | [Name](../modules/_ast_.md#name)‹string› &#124; [Table](_ast_.table.md)‹T, string› |
`options?` | [SelectOptions](../interfaces/_execute_.selectoptions.md)‹T› |

**Returns:** *Promise‹T[]›*

___

###  trans

▸ **trans**‹**T**›(`handler`: [TransactionHandler](../modules/_lube_.md#transactionhandler)‹T›, `isolationLevel`: [ISOLATION_LEVEL](../enums/_constants_.isolation_level.md)): *Promise‹T›*

Defined in lube.ts:130

开启一个事务并自动提交

**Type parameters:**

▪ **T**

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`handler` | [TransactionHandler](../modules/_lube_.md#transactionhandler)‹T› | - | (exeutor, cancel) => false |
`isolationLevel` | [ISOLATION_LEVEL](../enums/_constants_.isolation_level.md) | ISOLATION_LEVEL.READ_COMMIT | 事务隔离级别  |

**Returns:** *Promise‹T›*

___

###  update

▸ **update**‹**T**›(`table`: string | [Table](_ast_.table.md)‹T, string›, `sets`: [InputObject](../modules/_ast_.md#inputobject)‹T› | [Assignment](_ast_.assignment.md)[], `where?`: [WhereObject](../modules/_ast_.md#whereobject)‹T› | [Condition](_ast_.condition.md) | function): *Promise‹number›*

*Inherited from [Lube](_lube_.lube.md).[update](_lube_.lube.md#update)*

Defined in execute.ts:474

更新表

**Type parameters:**

▪ **T**: *[RowObject](../modules/_ast_.md#rowobject)*

**Parameters:**

Name | Type |
------ | ------ |
`table` | string &#124; [Table](_ast_.table.md)‹T, string› |
`sets` | [InputObject](../modules/_ast_.md#inputobject)‹T› &#124; [Assignment](_ast_.assignment.md)[] |
`where?` | [WhereObject](../modules/_ast_.md#whereobject)‹T› &#124; [Condition](_ast_.condition.md) &#124; function |

**Returns:** *Promise‹number›*

▸ **update**‹**T**›(`table`: string | [Table](_ast_.table.md)‹T, string›, `items`: T[], `keyFieldsOrWhere`: [FieldsOf](../modules/_ast_.md#fieldsof)‹T›[] | function): *Promise‹number›*

*Inherited from [Lube](_lube_.lube.md).[update](_lube_.lube.md#update)*

Defined in execute.ts:485

通过主键更新

**Type parameters:**

▪ **T**: *[RowObject](../modules/_ast_.md#rowobject)*

**Parameters:**

Name | Type |
------ | ------ |
`table` | string &#124; [Table](_ast_.table.md)‹T, string› |
`items` | T[] |
`keyFieldsOrWhere` | [FieldsOf](../modules/_ast_.md#fieldsof)‹T›[] &#124; function |

**Returns:** *Promise‹number›*
