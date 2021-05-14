[lubejs](../README.md) › [Globals](../globals.md) › ["ast"](../modules/_ast_.md) › [Condition](_ast_.condition.md)

# Class: Condition

查询条件

## Hierarchy

* [AST](_ast_.ast.md)

  ↳ **Condition**

  ↳ [BinaryLogicCondition](_ast_.binarylogiccondition.md)

  ↳ [UnaryLogicCondition](_ast_.unarylogiccondition.md)

  ↳ [BinaryCompareCondition](_ast_.binarycomparecondition.md)

  ↳ [UnaryCompareCondition](_ast_.unarycomparecondition.md)

  ↳ [ExistsCondition](_ast_.existscondition.md)

  ↳ [ParenthesesCondition](_ast_.parenthesescondition.md)

## Index

### Properties

* [$kind](_ast_.condition.md#readonly-kind)
* [$type](_ast_.condition.md#readonly-type)

### Methods

* [and](_ast_.condition.md#and)
* [clone](_ast_.condition.md#clone)
* [or](_ast_.condition.md#or)
* [and](_ast_.condition.md#static-and)
* [enclose](_ast_.condition.md#static-enclose)
* [eq](_ast_.condition.md#static-eq)
* [exists](_ast_.condition.md#static-exists)
* [gt](_ast_.condition.md#static-gt)
* [gte](_ast_.condition.md#static-gte)
* [in](_ast_.condition.md#static-in)
* [isNotNull](_ast_.condition.md#static-isnotnull)
* [isNull](_ast_.condition.md#static-isnull)
* [join](_ast_.condition.md#static-private-join)
* [like](_ast_.condition.md#static-like)
* [lt](_ast_.condition.md#static-lt)
* [lte](_ast_.condition.md#static-lte)
* [neq](_ast_.condition.md#static-neq)
* [not](_ast_.condition.md#static-not)
* [notIn](_ast_.condition.md#static-notin)
* [notLike](_ast_.condition.md#static-notlike)
* [or](_ast_.condition.md#static-or)

## Properties

### `Readonly` $kind

• **$kind**: *[CONDITION_KIND](../enums/_constants_.condition_kind.md)*

Defined in ast.ts:760

___

### `Readonly` $type

• **$type**: *[CONDITION](../enums/_constants_.sql_symbole.md#condition)* = SQL_SYMBOLE.CONDITION

*Overrides [AST](_ast_.ast.md).[$type](_ast_.ast.md#readonly-type)*

Defined in ast.ts:759

## Methods

###  and

▸ **and**(`condition`: [CompatibleCondition](../modules/_ast_.md#compatiblecondition)): *[Condition](_ast_.condition.md)*

Defined in ast.ts:766

and连接

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`condition` | [CompatibleCondition](../modules/_ast_.md#compatiblecondition) | 下一个查询条件 |

**Returns:** *[Condition](_ast_.condition.md)*

返回新的查询条件

___

###  clone

▸ **clone**(): *this*

*Inherited from [AST](_ast_.ast.md).[clone](_ast_.ast.md#clone)*

Defined in ast.ts:285

克隆自身

**Returns:** *this*

___

###  or

▸ **or**(`condition`: [Condition](_ast_.condition.md)): *[Condition](_ast_.condition.md)*

Defined in ast.ts:776

OR语句

**Parameters:**

Name | Type |
------ | ------ |
`condition` | [Condition](_ast_.condition.md) |

**Returns:** *[Condition](_ast_.condition.md)*

返回新的查询条件

___

### `Static` and

▸ **and**(`conditions`: [CompatibleCondition](../modules/_ast_.md#compatiblecondition)[]): *[Condition](_ast_.condition.md)*

Defined in ast.ts:810

将多个查询条件通过 AND 合并成一个大查询条件

**`static`** 

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`conditions` | [CompatibleCondition](../modules/_ast_.md#compatiblecondition)[] | 查询条件列表 |

**Returns:** *[Condition](_ast_.condition.md)*

返回逻辑表达式

▸ **and**(...`conditions`: [CompatibleCondition](../modules/_ast_.md#compatiblecondition)[]): *[Condition](_ast_.condition.md)*

Defined in ast.ts:811

**Parameters:**

Name | Type |
------ | ------ |
`...conditions` | [CompatibleCondition](../modules/_ast_.md#compatiblecondition)[] |

**Returns:** *[Condition](_ast_.condition.md)*

___

### `Static` enclose

▸ **enclose**(`condition`: [CompatibleCondition](../modules/_ast_.md#compatiblecondition)‹any›): *[Condition](_ast_.condition.md)*

Defined in ast.ts:1035

将查询条件用括号包括

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`condition` | [CompatibleCondition](../modules/_ast_.md#compatiblecondition)‹any› | 查询条件  |

**Returns:** *[Condition](_ast_.condition.md)*

___

### `Static` eq

▸ **eq**‹**T**›(`left`: [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹T›, `right`: [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹T›): *[Condition](_ast_.condition.md)*

Defined in ast.ts:869

比较运算 =

**Type parameters:**

▪ **T**: *[ScalarType](../modules/_types_.md#scalartype)*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`left` | [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹T› | 左值 |
`right` | [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹T› | 右值 |

**Returns:** *[Condition](_ast_.condition.md)*

返回比较运算对比条件

___

### `Static` exists

▸ **exists**(`select`: [Select](_ast_.select.md)‹any›): *[Condition](_ast_.condition.md)*

Defined in ast.ts:859

判断是否存在

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`select` | [Select](_ast_.select.md)‹any› | 查询语句  |

**Returns:** *[Condition](_ast_.condition.md)*

___

### `Static` gt

▸ **gt**‹**T**›(`left`: [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹T›, `right`: [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹T›): *[Condition](_ast_.condition.md)*

Defined in ast.ts:921

比较运算 >

**Type parameters:**

▪ **T**: *[ScalarType](../modules/_types_.md#scalartype)*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`left` | [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹T› | 左值 |
`right` | [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹T› | 右值 |

**Returns:** *[Condition](_ast_.condition.md)*

返回比较运算对比条件

___

### `Static` gte

▸ **gte**‹**T**›(`left`: [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹T›, `right`: [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹T›): *[Condition](_ast_.condition.md)*

Defined in ast.ts:934

比较运算 >=

**Type parameters:**

▪ **T**: *[ScalarType](../modules/_types_.md#scalartype)*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`left` | [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹T› | 左值 |
`right` | [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹T› | 右值 |

**Returns:** *[Condition](_ast_.condition.md)*

返回比较运算对比条件

___

### `Static` in

▸ **in**‹**T**›(`left`: [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹T›, `select`: [Select](_ast_.select.md)‹any›): *[Condition](_ast_.condition.md)*

Defined in ast.ts:977

比较运算 IN

**Type parameters:**

▪ **T**: *[ScalarType](../modules/_types_.md#scalartype)*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`left` | [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹T› | 左值 |
`select` | [Select](_ast_.select.md)‹any› | - |

**Returns:** *[Condition](_ast_.condition.md)*

返回比较运算对比条件

▸ **in**‹**T**›(`left`: [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹T›, `values`: [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹T›[]): *[Condition](_ast_.condition.md)*

Defined in ast.ts:981

**Type parameters:**

▪ **T**: *[ScalarType](../modules/_types_.md#scalartype)*

**Parameters:**

Name | Type |
------ | ------ |
`left` | [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹T› |
`values` | [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹T›[] |

**Returns:** *[Condition](_ast_.condition.md)*

___

### `Static` isNotNull

▸ **isNotNull**(`expr`: [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹[ScalarType](../modules/_types_.md#scalartype)›): *[Condition](_ast_.condition.md)*

Defined in ast.ts:1027

比较运算 IS NOT NULL

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`expr` | [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹[ScalarType](../modules/_types_.md#scalartype)› | 表达式 |

**Returns:** *[Condition](_ast_.condition.md)*

返回比较运算符

___

### `Static` isNull

▸ **isNull**(`expr`: [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹[ScalarType](../modules/_types_.md#scalartype)›): *[Condition](_ast_.condition.md)*

Defined in ast.ts:1018

比较运算 IS NULL

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`expr` | [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹[ScalarType](../modules/_types_.md#scalartype)› | 表达式  |

**Returns:** *[Condition](_ast_.condition.md)*

返回比较运算符

___

### `Static` `Private` join

▸ **join**(`logic`: [AND](../enums/_constants_.logic_operator.md#and) | [OR](../enums/_constants_.logic_operator.md#or), `conditions`: [CompatibleCondition](../modules/_ast_.md#compatiblecondition)[]): *[Condition](_ast_.condition.md)*

Defined in ast.ts:784

使用逻辑表达式联接多个条件

**Parameters:**

Name | Type |
------ | ------ |
`logic` | [AND](../enums/_constants_.logic_operator.md#and) &#124; [OR](../enums/_constants_.logic_operator.md#or) |
`conditions` | [CompatibleCondition](../modules/_ast_.md#compatiblecondition)[] |

**Returns:** *[Condition](_ast_.condition.md)*

___

### `Static` like

▸ **like**(`left`: [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹string›, `right`: [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹string›): *[Condition](_ast_.condition.md)*

Defined in ast.ts:947

比较运算 LIKE

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`left` | [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹string› | 左值 |
`right` | [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹string› | 右值 |

**Returns:** *[Condition](_ast_.condition.md)*

返回比较运算对比条件

___

### `Static` lt

▸ **lt**‹**T**›(`left`: [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹T›, `right`: [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹T›): *[Condition](_ast_.condition.md)*

Defined in ast.ts:895

比较运算 <

**Type parameters:**

▪ **T**: *[ScalarType](../modules/_types_.md#scalartype)*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`left` | [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹T› | 左值 |
`right` | [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹T› | 右值 |

**Returns:** *[Condition](_ast_.condition.md)*

返回比较运算对比条件

___

### `Static` lte

▸ **lte**‹**T**›(`left`: [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹T›, `right`: [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹T›): *[Condition](_ast_.condition.md)*

Defined in ast.ts:908

比较运算 <=

**Type parameters:**

▪ **T**: *[ScalarType](../modules/_types_.md#scalartype)*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`left` | [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹T› | 左值 |
`right` | [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹T› | 右值 |

**Returns:** *[Condition](_ast_.condition.md)*

返回比较运算对比条件

___

### `Static` neq

▸ **neq**‹**T**›(`left`: [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹T›, `right`: [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹T›): *[Condition](_ast_.condition.md)*

Defined in ast.ts:882

比较运算 <>

**Type parameters:**

▪ **T**: *[ScalarType](../modules/_types_.md#scalartype)*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`left` | [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹T› | 左值 |
`right` | [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹T› | 右值 |

**Returns:** *[Condition](_ast_.condition.md)*

返回比较运算对比条件

___

### `Static` not

▸ **not**(`condition`: [Condition](_ast_.condition.md)): *[Condition](_ast_.condition.md)*

Defined in ast.ts:850

Not 逻辑运算

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`condition` | [Condition](_ast_.condition.md) |   |

**Returns:** *[Condition](_ast_.condition.md)*

___

### `Static` notIn

▸ **notIn**‹**T**›(`left`: [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹T›, `values`: [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹T›[]): *[Condition](_ast_.condition.md)*

Defined in ast.ts:1002

比较运算 NOT IN

**Type parameters:**

▪ **T**: *[ScalarType](../modules/_types_.md#scalartype)*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`left` | [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹T› | 左值 |
`values` | [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹T›[] | 要比较的值列表 |

**Returns:** *[Condition](_ast_.condition.md)*

返回比较运算对比条件

___

### `Static` notLike

▸ **notLike**(`left`: [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹string›, `right`: [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹string›): *[Condition](_ast_.condition.md)*

Defined in ast.ts:960

比较运算 NOT LIKE

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`left` | [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹string› | 左值 |
`right` | [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹string› | 右值 |

**Returns:** *[Condition](_ast_.condition.md)*

返回比较运算对比条件

___

### `Static` or

▸ **or**(`conditions`: [CompatibleCondition](../modules/_ast_.md#compatiblecondition)[]): *[Condition](_ast_.condition.md)*

Defined in ast.ts:831

将多个查询条件通过 OR 合并成一个

**`static`** 

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`conditions` | [CompatibleCondition](../modules/_ast_.md#compatiblecondition)[] | 查询条件列表 |

**Returns:** *[Condition](_ast_.condition.md)*

返回逻辑表达式

▸ **or**(...`conditions`: [CompatibleCondition](../modules/_ast_.md#compatiblecondition)[]): *[Condition](_ast_.condition.md)*

Defined in ast.ts:832

**Parameters:**

Name | Type |
------ | ------ |
`...conditions` | [CompatibleCondition](../modules/_ast_.md#compatiblecondition)[] |

**Returns:** *[Condition](_ast_.condition.md)*
