[lubejs](../README.md) › [Globals](../globals.md) › ["util"](_util_.md)

# Module: "util"

## Index

### Variables

* [RowsetFixedProps](_util_.md#const-rowsetfixedprops)

### Functions

* [assert](_util_.md#assert)
* [clone](_util_.md#clone)
* [dateToString](_util_.md#datetostring)
* [ensureCondition](_util_.md#ensurecondition)
* [ensureExpression](_util_.md#ensureexpression)
* [ensureField](_util_.md#ensurefield)
* [ensureFunction](_util_.md#ensurefunction)
* [ensureProcedure](_util_.md#ensureprocedure)
* [ensureProxiedRowset](_util_.md#ensureproxiedrowset)
* [ensureRowset](_util_.md#ensurerowset)
* [ensureVariant](_util_.md#ensurevariant)
* [fix](_util_.md#fix)
* [invalidAST](_util_.md#invalidast)
* [isAssignment](_util_.md#isassignment)
* [isBinary](_util_.md#isbinary)
* [isBinaryCompareCondition](_util_.md#isbinarycomparecondition)
* [isBinaryLogicCondition](_util_.md#isbinarylogiccondition)
* [isBinaryOperation](_util_.md#isbinaryoperation)
* [isBracket](_util_.md#isbracket)
* [isBuiltIn](_util_.md#isbuiltin)
* [isCase](_util_.md#iscase)
* [isColumn](_util_.md#iscolumn)
* [isCondition](_util_.md#iscondition)
* [isConvertOperation](_util_.md#isconvertoperation)
* [isCrudStatement](_util_.md#iscrudstatement)
* [isDbType](_util_.md#isdbtype)
* [isDeclare](_util_.md#isdeclare)
* [isDelete](_util_.md#isdelete)
* [isDocument](_util_.md#isdocument)
* [isExecute](_util_.md#isexecute)
* [isExistsCondition](_util_.md#isexistscondition)
* [isExpression](_util_.md#isexpression)
* [isField](_util_.md#isfield)
* [isGroupCondition](_util_.md#isgroupcondition)
* [isIdentifier](_util_.md#isidentifier)
* [isInsert](_util_.md#isinsert)
* [isLiteral](_util_.md#isliteral)
* [isNamedSelect](_util_.md#isnamedselect)
* [isOperation](_util_.md#isoperation)
* [isParameter](_util_.md#isparameter)
* [isPlainObject](_util_.md#isplainobject)
* [isProxiedRowset](_util_.md#isproxiedrowset)
* [isRaw](_util_.md#israw)
* [isRowset](_util_.md#isrowset)
* [isScalar](_util_.md#isscalar)
* [isScalarFuncInvoke](_util_.md#isscalarfuncinvoke)
* [isSelect](_util_.md#isselect)
* [isSortInfo](_util_.md#issortinfo)
* [isStar](_util_.md#isstar)
* [isStatement](_util_.md#isstatement)
* [isTable](_util_.md#istable)
* [isTableFuncInvoke](_util_.md#istablefuncinvoke)
* [isTableVariant](_util_.md#istablevariant)
* [isUnaryCompareCondition](_util_.md#isunarycomparecondition)
* [isUnaryLogicCondition](_util_.md#isunarylogiccondition)
* [isUnaryOperation](_util_.md#isunaryoperation)
* [isUpdate](_util_.md#isupdate)
* [isValuedSelect](_util_.md#isvaluedselect)
* [isVariant](_util_.md#isvariant)
* [isWith](_util_.md#iswith)
* [isWithSelect](_util_.md#iswithselect)
* [makeProxiedRowset](_util_.md#makeproxiedrowset)
* [pathName](_util_.md#pathname)
* [pickName](_util_.md#pickname)

## Variables

### `Const` RowsetFixedProps

• **RowsetFixedProps**: *string[]* = [
  'field',
  'clone',
  '_',
  'as',
  '$alias',
  '$',
  'star',
  'as',
  '$builtin',
  '$type',
  '$kind',
  '$statement',
  '$select'
]

Defined in util.ts:206

## Functions

###  assert

▸ **assert**(`except`: any, `message`: string): *asserts except*

Defined in util.ts:73

断言

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`except` | any | 预期结果 |
`message` | string | 错误消息  |

**Returns:** *asserts except*

___

###  clone

▸ **clone**‹**T**›(`value`: T): *T*

Defined in util.ts:604

**Type parameters:**

▪ **T**

**Parameters:**

Name | Type |
------ | ------ |
`value` | T |

**Returns:** *T*

___

###  dateToString

▸ **dateToString**(`date`: Date): *string*

Defined in util.ts:381

**Parameters:**

Name | Type |
------ | ------ |
`date` | Date |

**Returns:** *string*

___

###  ensureCondition

▸ **ensureCondition**‹**T**›(`condition`: [Condition](../classes/_ast_.condition.md) | [WhereObject](_ast_.md#whereobject)‹T›, `rowset?`: [CompatibleRowset](_ast_.md#compatiblerowset)): *[Condition](../classes/_ast_.condition.md)*

Defined in util.ts:174

通过一个对象创建一个对查询条件
亦可理解为：转换managodb的查询条件到 ast

**Type parameters:**

▪ **T**: *[RowObject](_ast_.md#rowobject)*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`condition` | [Condition](../classes/_ast_.condition.md) &#124; [WhereObject](_ast_.md#whereobject)‹T› | 条件表达式  |
`rowset?` | [CompatibleRowset](_ast_.md#compatiblerowset) | - |

**Returns:** *[Condition](../classes/_ast_.condition.md)*

___

###  ensureExpression

▸ **ensureExpression**‹**T**›(`expr`: [CompatibleExpression](_ast_.md#compatibleexpression)‹T›): *[Expression](../classes/_ast_.expression.md)‹T›*

Defined in util.ts:82

返回表达式

**Type parameters:**

▪ **T**: *[ScalarType](_types_.md#scalartype)*

**Parameters:**

Name | Type |
------ | ------ |
`expr` | [CompatibleExpression](_ast_.md#compatibleexpression)‹T› |

**Returns:** *[Expression](../classes/_ast_.expression.md)‹T›*

___

###  ensureField

▸ **ensureField**‹**T**, **N**›(`name`: [Name](_ast_.md#name)‹N› | [Field](../classes/_ast_.field.md)‹T, N›): *[Field](../classes/_ast_.field.md)‹T, N›*

Defined in util.ts:94

确保字段类型

**Type parameters:**

▪ **T**: *[ScalarType](_types_.md#scalartype)*

▪ **N**: *string*

**Parameters:**

Name | Type |
------ | ------ |
`name` | [Name](_ast_.md#name)‹N› &#124; [Field](../classes/_ast_.field.md)‹T, N› |

**Returns:** *[Field](../classes/_ast_.field.md)‹T, N›*

___

###  ensureFunction

▸ **ensureFunction**‹**TName**›(`name`: [Name](_ast_.md#name)‹TName› | [Func](../classes/_ast_.func.md)‹TName›): *[Func](../classes/_ast_.func.md)‹TName›*

Defined in util.ts:150

确保函数类型

**Type parameters:**

▪ **TName**: *string*

**Parameters:**

Name | Type |
------ | ------ |
`name` | [Name](_ast_.md#name)‹TName› &#124; [Func](../classes/_ast_.func.md)‹TName› |

**Returns:** *[Func](../classes/_ast_.func.md)‹TName›*

___

###  ensureProcedure

▸ **ensureProcedure**‹**R**, **O**, **N**›(`name`: [Name](_ast_.md#name)‹N› | [Procedure](../classes/_ast_.procedure.md)‹R, O, N›): *[Procedure](../classes/_ast_.procedure.md)‹R, O, N›*

Defined in util.ts:160

确保标题函数类型

**Type parameters:**

▪ **R**: *[ScalarType](_types_.md#scalartype)*

▪ **O**: *[RowObject](_ast_.md#rowobject)[]*

▪ **N**: *string*

**Parameters:**

Name | Type |
------ | ------ |
`name` | [Name](_ast_.md#name)‹N› &#124; [Procedure](../classes/_ast_.procedure.md)‹R, O, N› |

**Returns:** *[Procedure](../classes/_ast_.procedure.md)‹R, O, N›*

___

###  ensureProxiedRowset

▸ **ensureProxiedRowset**‹**T**›(`name`: [Name](_ast_.md#name)‹string› | [Table](../classes/_ast_.table.md)‹T›): *[ProxiedTable](_ast_.md#proxiedtable)‹T›*

Defined in util.ts:128

**Type parameters:**

▪ **T**: *[RowObject](_ast_.md#rowobject)*

**Parameters:**

Name | Type |
------ | ------ |
`name` | [Name](_ast_.md#name)‹string› &#124; [Table](../classes/_ast_.table.md)‹T› |

**Returns:** *[ProxiedTable](_ast_.md#proxiedtable)‹T›*

▸ **ensureProxiedRowset**‹**T**›(`name`: [Name](_ast_.md#name)‹string› | [Rowset](../classes/_ast_.rowset.md)‹T›): *[ProxiedRowset](_ast_.md#proxiedrowset)‹T›*

Defined in util.ts:131

**Type parameters:**

▪ **T**: *[RowObject](_ast_.md#rowobject)*

**Parameters:**

Name | Type |
------ | ------ |
`name` | [Name](_ast_.md#name)‹string› &#124; [Rowset](../classes/_ast_.rowset.md)‹T› |

**Returns:** *[ProxiedRowset](_ast_.md#proxiedrowset)‹T›*

___

###  ensureRowset

▸ **ensureRowset**‹**TModel**›(`name`: [Name](_ast_.md#name)‹string› | [Table](../classes/_ast_.table.md)‹TModel›): *[Table](../classes/_ast_.table.md)‹TModel›*

Defined in util.ts:115

确保表格类型

**Type parameters:**

▪ **TModel**: *[RowObject](_ast_.md#rowobject)*

**Parameters:**

Name | Type |
------ | ------ |
`name` | [Name](_ast_.md#name)‹string› &#124; [Table](../classes/_ast_.table.md)‹TModel› |

**Returns:** *[Table](../classes/_ast_.table.md)‹TModel›*

▸ **ensureRowset**‹**TModel**›(`name`: [Name](_ast_.md#name)‹string› | [Rowset](../classes/_ast_.rowset.md)‹TModel›): *[Rowset](../classes/_ast_.rowset.md)‹TModel›*

Defined in util.ts:118

**Type parameters:**

▪ **TModel**: *[RowObject](_ast_.md#rowobject)*

**Parameters:**

Name | Type |
------ | ------ |
`name` | [Name](_ast_.md#name)‹string› &#124; [Rowset](../classes/_ast_.rowset.md)‹TModel› |

**Returns:** *[Rowset](../classes/_ast_.rowset.md)‹TModel›*

___

###  ensureVariant

▸ **ensureVariant**‹**T**, **N**›(`name`: N | [Variant](../classes/_ast_.variant.md)‹T, N›): *[Variant](../classes/_ast_.variant.md)‹T, N›*

Defined in util.ts:103

**Type parameters:**

▪ **T**: *string*

▪ **N**: *string*

**Parameters:**

Name | Type |
------ | ------ |
`name` | N &#124; [Variant](../classes/_ast_.variant.md)‹T, N› |

**Returns:** *[Variant](../classes/_ast_.variant.md)‹T, N›*

___

###  fix

▸ **fix**(`num`: number, `digits`: number): *string*

Defined in util.ts:377

**Parameters:**

Name | Type |
------ | ------ |
`num` | number |
`digits` | number |

**Returns:** *string*

___

###  invalidAST

▸ **invalidAST**(`type`: string, `value`: any): *void*

Defined in util.ts:599

**Parameters:**

Name | Type |
------ | ------ |
`type` | string |
`value` | any |

**Returns:** *void*

___

###  isAssignment

▸ **isAssignment**(`value`: any): *value is Assignment*

Defined in util.ts:413

**Parameters:**

Name | Type |
------ | ------ |
`value` | any |

**Returns:** *value is Assignment*

___

###  isBinary

▸ **isBinary**(`value`: any): *value is Binary*

Defined in util.ts:283

**Parameters:**

Name | Type |
------ | ------ |
`value` | any |

**Returns:** *value is Binary*

___

###  isBinaryCompareCondition

▸ **isBinaryCompareCondition**(`value`: [Condition](../classes/_ast_.condition.md)): *value is BinaryCompareCondition*

Defined in util.ts:567

**Parameters:**

Name | Type |
------ | ------ |
`value` | [Condition](../classes/_ast_.condition.md) |

**Returns:** *value is BinaryCompareCondition*

___

###  isBinaryLogicCondition

▸ **isBinaryLogicCondition**(`value`: [Condition](../classes/_ast_.condition.md)): *value is BinaryLogicCondition*

Defined in util.ts:579

**Parameters:**

Name | Type |
------ | ------ |
`value` | [Condition](../classes/_ast_.condition.md) |

**Returns:** *value is BinaryLogicCondition*

___

###  isBinaryOperation

▸ **isBinaryOperation**(`value`: [Operation](../classes/_ast_.operation.md)): *value is BinaryOperation*

Defined in util.ts:531

**Parameters:**

Name | Type |
------ | ------ |
`value` | [Operation](../classes/_ast_.operation.md) |

**Returns:** *value is BinaryOperation*

___

###  isBracket

▸ **isBracket**(`value`: any): *value is ParenthesesExpression*

Defined in util.ts:515

**Parameters:**

Name | Type |
------ | ------ |
`value` | any |

**Returns:** *value is ParenthesesExpression*

___

###  isBuiltIn

▸ **isBuiltIn**(`value`: any): *value is BuiltIn*

Defined in util.ts:549

**Parameters:**

Name | Type |
------ | ------ |
`value` | any |

**Returns:** *value is BuiltIn*

___

###  isCase

▸ **isCase**(`value`: any): *value is Case*

Defined in util.ts:511

**Parameters:**

Name | Type |
------ | ------ |
`value` | any |

**Returns:** *value is Case*

___

###  isColumn

▸ **isColumn**(`value`: any): *value is SelectColumn*

Defined in util.ts:553

**Parameters:**

Name | Type |
------ | ------ |
`value` | any |

**Returns:** *value is SelectColumn*

___

###  isCondition

▸ **isCondition**(`value`: any): *value is Condition*

Defined in util.ts:557

**Parameters:**

Name | Type |
------ | ------ |
`value` | any |

**Returns:** *value is Condition*

___

###  isConvertOperation

▸ **isConvertOperation**(`value`: [Operation](../classes/_ast_.operation.md)): *value is ConvertOperation*

Defined in util.ts:535

**Parameters:**

Name | Type |
------ | ------ |
`value` | [Operation](../classes/_ast_.operation.md) |

**Returns:** *value is ConvertOperation*

___

###  isCrudStatement

▸ **isCrudStatement**(`value`: any): *value is CrudStatement*

Defined in util.ts:438

**Parameters:**

Name | Type |
------ | ------ |
`value` | any |

**Returns:** *value is CrudStatement*

___

###  isDbType

▸ **isDbType**(`value`: any): *value is DbType*

Defined in util.ts:274

**Parameters:**

Name | Type |
------ | ------ |
`value` | any |

**Returns:** *value is DbType*

___

###  isDeclare

▸ **isDeclare**(`value`: any): *value is Declare*

Defined in util.ts:417

**Parameters:**

Name | Type |
------ | ------ |
`value` | any |

**Returns:** *value is Declare*

___

###  isDelete

▸ **isDelete**(`value`: any): *value is Delete*

Defined in util.ts:405

**Parameters:**

Name | Type |
------ | ------ |
`value` | any |

**Returns:** *value is Delete*

___

###  isDocument

▸ **isDocument**(`value`: any): *value is Document*

Defined in util.ts:595

**Parameters:**

Name | Type |
------ | ------ |
`value` | any |

**Returns:** *value is Document*

___

###  isExecute

▸ **isExecute**(`value`: any): *value is Execute*

Defined in util.ts:421

**Parameters:**

Name | Type |
------ | ------ |
`value` | any |

**Returns:** *value is Execute*

___

###  isExistsCondition

▸ **isExistsCondition**(`value`: [Condition](../classes/_ast_.condition.md)): *value is ExistsCondition*

Defined in util.ts:591

**Parameters:**

Name | Type |
------ | ------ |
`value` | [Condition](../classes/_ast_.condition.md) |

**Returns:** *value is ExistsCondition*

___

###  isExpression

▸ **isExpression**(`value`: any): *value is Expression*

Defined in util.ts:497

**Parameters:**

Name | Type |
------ | ------ |
`value` | any |

**Returns:** *value is Expression*

___

###  isField

▸ **isField**(`value`: any): *value is Field*

Defined in util.ts:452

**Parameters:**

Name | Type |
------ | ------ |
`value` | any |

**Returns:** *value is Field*

___

###  isGroupCondition

▸ **isGroupCondition**(`value`: [Condition](../classes/_ast_.condition.md)): *value is ParenthesesCondition*

Defined in util.ts:585

**Parameters:**

Name | Type |
------ | ------ |
`value` | [Condition](../classes/_ast_.condition.md) |

**Returns:** *value is ParenthesesCondition*

___

###  isIdentifier

▸ **isIdentifier**(`value`: any): *value is Identifier*

Defined in util.ts:444

**Parameters:**

Name | Type |
------ | ------ |
`value` | any |

**Returns:** *value is Identifier*

___

###  isInsert

▸ **isInsert**(`value`: any): *value is Insert*

Defined in util.ts:409

**Parameters:**

Name | Type |
------ | ------ |
`value` | any |

**Returns:** *value is Insert*

___

###  isLiteral

▸ **isLiteral**(`value`: any): *value is Literal*

Defined in util.ts:456

**Parameters:**

Name | Type |
------ | ------ |
`value` | any |

**Returns:** *value is Literal*

___

###  isNamedSelect

▸ **isNamedSelect**(`value`: any): *value is NamedSelect*

Defined in util.ts:460

**Parameters:**

Name | Type |
------ | ------ |
`value` | any |

**Returns:** *value is NamedSelect*

___

###  isOperation

▸ **isOperation**(`value`: any): *value is Operation*

Defined in util.ts:523

**Parameters:**

Name | Type |
------ | ------ |
`value` | any |

**Returns:** *value is Operation*

___

###  isParameter

▸ **isParameter**(`value`: any): *value is Parameter*

Defined in util.ts:541

**Parameters:**

Name | Type |
------ | ------ |
`value` | any |

**Returns:** *value is Parameter*

___

###  isPlainObject

▸ **isPlainObject**(`obj`: any): *boolean*

Defined in util.ts:373

**Parameters:**

Name | Type |
------ | ------ |
`obj` | any |

**Returns:** *boolean*

___

###  isProxiedRowset

▸ **isProxiedRowset**‹**T**›(`rowset`: [Rowset](../classes/_ast_.rowset.md)‹T›): *rowset is ProxiedRowset<T>*

Defined in util.ts:301

**Type parameters:**

▪ **T**: *[RowObject](_ast_.md#rowobject)*

**Parameters:**

Name | Type |
------ | ------ |
`rowset` | [Rowset](../classes/_ast_.rowset.md)‹T› |

**Returns:** *rowset is ProxiedRowset<T>*

___

###  isRaw

▸ **isRaw**(`value`: any): *value is Raw*

Defined in util.ts:393

**Parameters:**

Name | Type |
------ | ------ |
`value` | any |

**Returns:** *value is Raw*

___

###  isRowset

▸ **isRowset**(`value`: any): *value is Rowset*

Defined in util.ts:488

**Parameters:**

Name | Type |
------ | ------ |
`value` | any |

**Returns:** *value is Rowset*

___

###  isScalar

▸ **isScalar**(`value`: any): *value is ScalarType*

Defined in util.ts:261

**Parameters:**

Name | Type |
------ | ------ |
`value` | any |

**Returns:** *value is ScalarType*

___

###  isScalarFuncInvoke

▸ **isScalarFuncInvoke**(`value`: any): *value is ScalarFuncInvoke*

Defined in util.ts:476

**Parameters:**

Name | Type |
------ | ------ |
`value` | any |

**Returns:** *value is ScalarFuncInvoke*

___

###  isSelect

▸ **isSelect**(`value`: any): *value is Select*

Defined in util.ts:397

**Parameters:**

Name | Type |
------ | ------ |
`value` | any |

**Returns:** *value is Select*

___

###  isSortInfo

▸ **isSortInfo**(`value`: any): *value is SortInfo*

Defined in util.ts:279

**Parameters:**

Name | Type |
------ | ------ |
`value` | any |

**Returns:** *value is SortInfo*

___

###  isStar

▸ **isStar**(`value`: any): *value is Star*

Defined in util.ts:545

**Parameters:**

Name | Type |
------ | ------ |
`value` | any |

**Returns:** *value is Star*

___

###  isStatement

▸ **isStatement**(`value`: any): *value is Statement*

Defined in util.ts:425

**Parameters:**

Name | Type |
------ | ------ |
`value` | any |

**Returns:** *value is Statement*

___

###  isTable

▸ **isTable**(`value`: any): *value is Table*

Defined in util.ts:448

**Parameters:**

Name | Type |
------ | ------ |
`value` | any |

**Returns:** *value is Table*

___

###  isTableFuncInvoke

▸ **isTableFuncInvoke**(`value`: any): *value is TableFuncInvoke*

Defined in util.ts:472

**Parameters:**

Name | Type |
------ | ------ |
`value` | any |

**Returns:** *value is TableFuncInvoke*

___

###  isTableVariant

▸ **isTableVariant**(`value`: any): *value is TableVariant*

Defined in util.ts:480

**Parameters:**

Name | Type |
------ | ------ |
`value` | any |

**Returns:** *value is TableVariant*

___

###  isUnaryCompareCondition

▸ **isUnaryCompareCondition**(`value`: [Condition](../classes/_ast_.condition.md)): *value is UnaryCompareCondition*

Defined in util.ts:561

**Parameters:**

Name | Type |
------ | ------ |
`value` | [Condition](../classes/_ast_.condition.md) |

**Returns:** *value is UnaryCompareCondition*

___

###  isUnaryLogicCondition

▸ **isUnaryLogicCondition**(`value`: [Condition](../classes/_ast_.condition.md)): *value is UnaryLogicCondition*

Defined in util.ts:573

**Parameters:**

Name | Type |
------ | ------ |
`value` | [Condition](../classes/_ast_.condition.md) |

**Returns:** *value is UnaryLogicCondition*

___

###  isUnaryOperation

▸ **isUnaryOperation**(`value`: [Operation](../classes/_ast_.operation.md)): *value is UnaryOperation*

Defined in util.ts:527

**Parameters:**

Name | Type |
------ | ------ |
`value` | [Operation](../classes/_ast_.operation.md) |

**Returns:** *value is UnaryOperation*

___

###  isUpdate

▸ **isUpdate**(`value`: any): *value is Update*

Defined in util.ts:401

**Parameters:**

Name | Type |
------ | ------ |
`value` | any |

**Returns:** *value is Update*

___

###  isValuedSelect

▸ **isValuedSelect**(`value`: any): *value is ValuedSelect*

Defined in util.ts:519

**Parameters:**

Name | Type |
------ | ------ |
`value` | any |

**Returns:** *value is ValuedSelect*

___

###  isVariant

▸ **isVariant**(`value`: any): *value is Variant*

Defined in util.ts:484

**Parameters:**

Name | Type |
------ | ------ |
`value` | any |

**Returns:** *value is Variant*

___

###  isWith

▸ **isWith**(`value`: any): *value is With*

Defined in util.ts:468

**Parameters:**

Name | Type |
------ | ------ |
`value` | any |

**Returns:** *value is With*

___

###  isWithSelect

▸ **isWithSelect**(`value`: any): *value is NamedSelect*

Defined in util.ts:464

**Parameters:**

Name | Type |
------ | ------ |
`value` | any |

**Returns:** *value is NamedSelect*

___

###  makeProxiedRowset

▸ **makeProxiedRowset**‹**T**›(`rowset`: [Table](../classes/_ast_.table.md)‹T›): *[ProxiedTable](_ast_.md#proxiedtable)‹T›*

Defined in util.ts:225

将制作rowset的代理，用于通过属性访问字段

**Type parameters:**

▪ **T**: *[RowObject](_ast_.md#rowobject)*

**Parameters:**

Name | Type |
------ | ------ |
`rowset` | [Table](../classes/_ast_.table.md)‹T› |

**Returns:** *[ProxiedTable](_ast_.md#proxiedtable)‹T›*

▸ **makeProxiedRowset**‹**T**›(`rowset`: [Rowset](../classes/_ast_.rowset.md)‹T›): *[ProxiedRowset](_ast_.md#proxiedrowset)‹T›*

Defined in util.ts:228

**Type parameters:**

▪ **T**: *[RowObject](_ast_.md#rowobject)*

**Parameters:**

Name | Type |
------ | ------ |
`rowset` | [Rowset](../classes/_ast_.rowset.md)‹T› |

**Returns:** *[ProxiedRowset](_ast_.md#proxiedrowset)‹T›*

___

###  pathName

▸ **pathName**‹**T**›(`name`: [Name](_ast_.md#name)‹T›): *[PathedName](_ast_.md#pathedname)‹T›*

Defined in util.ts:366

**Type parameters:**

▪ **T**: *string*

**Parameters:**

Name | Type |
------ | ------ |
`name` | [Name](_ast_.md#name)‹T› |

**Returns:** *[PathedName](_ast_.md#pathedname)‹T›*

___

###  pickName

▸ **pickName**(`name`: [Name](_ast_.md#name)‹string›): *string*

Defined in util.ts:359

**Parameters:**

Name | Type |
------ | ------ |
`name` | [Name](_ast_.md#name)‹string› |

**Returns:** *string*
