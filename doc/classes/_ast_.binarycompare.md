[lubejs](../README.md) › [Globals](../globals.md) › ["ast"](../modules/_ast_.md) › [BinaryCompare](_ast_.binarycompare.md)

# Class: BinaryCompare

二元比较条件

## Hierarchy

  ↳ [Condition](_ast_.condition.md)

  ↳ **BinaryCompare**

## Implements

* [ICondition](../interfaces/_ast_.icondition.md)

## Index

### Constructors

* [constructor](_ast_.binarycompare.md#constructor)

### Properties

* [and](_ast_.binarycompare.md#and)
* [andGroup](_ast_.binarycompare.md#andgroup)
* [left](_ast_.binarycompare.md#left)
* [operator](_ast_.binarycompare.md#operator)
* [or](_ast_.binarycompare.md#or)
* [orGroup](_ast_.binarycompare.md#orgroup)
* [right](_ast_.binarycompare.md#right)
* [type](_ast_.binarycompare.md#readonly-type)

### Methods

* [and](_ast_.binarycompare.md#static-and)
* [bracket](_ast_.binarycompare.md#static-bracket)
* [compare](_ast_.binarycompare.md#static-private-compare)
* [eq](_ast_.binarycompare.md#static-eq)
* [exists](_ast_.binarycompare.md#static-exists)
* [gt](_ast_.binarycompare.md#static-gt)
* [gte](_ast_.binarycompare.md#static-gte)
* [in](_ast_.binarycompare.md#static-in)
* [isNotNull](_ast_.binarycompare.md#static-isnotnull)
* [isNull](_ast_.binarycompare.md#static-isnull)
* [like](_ast_.binarycompare.md#static-like)
* [lt](_ast_.binarycompare.md#static-lt)
* [lte](_ast_.binarycompare.md#static-lte)
* [neq](_ast_.binarycompare.md#static-neq)
* [not](_ast_.binarycompare.md#static-not)
* [notIn](_ast_.binarycompare.md#static-notin)
* [notLike](_ast_.binarycompare.md#static-notlike)
* [or](_ast_.binarycompare.md#static-or)
* [quoted](_ast_.binarycompare.md#static-quoted)

## Constructors

###  constructor

\+ **new BinaryCompare**(`operator`: [COMPARE_OPERATOR](../enums/_constants_.compare_operator.md), `left`: [UnsureExpression](../modules/_ast_.md#unsureexpression), `right`: [UnsureExpression](../modules/_ast_.md#unsureexpression) | [UnsureGroupValues](../modules/_ast_.md#unsuregroupvalues)): *[BinaryCompare](_ast_.binarycompare.md)*

*Overrides [AST](_ast_.ast.md).[constructor](_ast_.ast.md#constructor)*

Defined in src/ast.ts:1048

构造函数

**Parameters:**

Name | Type |
------ | ------ |
`operator` | [COMPARE_OPERATOR](../enums/_constants_.compare_operator.md) |
`left` | [UnsureExpression](../modules/_ast_.md#unsureexpression) |
`right` | [UnsureExpression](../modules/_ast_.md#unsureexpression) &#124; [UnsureGroupValues](../modules/_ast_.md#unsuregroupvalues) |

**Returns:** *[BinaryCompare](_ast_.binarycompare.md)*

## Properties

###  and

• **and**: *function*

*Implementation of [ICondition](../interfaces/_ast_.icondition.md).[and](../interfaces/_ast_.icondition.md#and)*

*Inherited from [Condition](_ast_.condition.md).[and](_ast_.condition.md#and)*

Defined in src/ast.ts:787

and连接

**`param`** 下一个查询条件

**`returns`** 返回新的查询条件

#### Type declaration:

▸ (`condition`: [Condition](_ast_.condition.md)): *[Condition](_ast_.condition.md)*

**Parameters:**

Name | Type |
------ | ------ |
`condition` | [Condition](_ast_.condition.md) |

___

###  andGroup

• **andGroup**: *function*

*Implementation of [ICondition](../interfaces/_ast_.icondition.md).[andGroup](../interfaces/_ast_.icondition.md#andgroup)*

*Inherited from [Condition](_ast_.condition.md).[andGroup](_ast_.condition.md#andgroup)*

Defined in src/ast.ts:794

and连接，并在被连接的条件中加上括号 ()

**`param`** 下一个查询条件

**`returns`** 返回新的查询条件

#### Type declaration:

▸ (`condition`: [Condition](_ast_.condition.md)): *[Condition](_ast_.condition.md)*

**Parameters:**

Name | Type |
------ | ------ |
`condition` | [Condition](_ast_.condition.md) |

___

###  left

• **left**: *[Expression](_ast_.expression.md)*

Defined in src/ast.ts:1046

___

###  operator

• **operator**: *[COMPARE_OPERATOR](../enums/_constants_.compare_operator.md)*

Defined in src/ast.ts:1048

___

###  or

• **or**: *function*

*Implementation of [ICondition](../interfaces/_ast_.icondition.md).[or](../interfaces/_ast_.icondition.md#or)*

*Inherited from [Condition](_ast_.condition.md).[or](_ast_.condition.md#or)*

Defined in src/ast.ts:801

OR语句

**`param`** 

**`returns`** 返回新的查询条件

#### Type declaration:

▸ (`condition`: [Condition](_ast_.condition.md)): *[Condition](_ast_.condition.md)*

**Parameters:**

Name | Type |
------ | ------ |
`condition` | [Condition](_ast_.condition.md) |

___

###  orGroup

• **orGroup**: *function*

*Implementation of [ICondition](../interfaces/_ast_.icondition.md).[orGroup](../interfaces/_ast_.icondition.md#orgroup)*

*Inherited from [Condition](_ast_.condition.md).[orGroup](_ast_.condition.md#orgroup)*

Defined in src/ast.ts:808

or 连接，并在被连接的条件中加上括号 ()

**`param`** 

**`returns`** 返回新的查询条件

#### Type declaration:

▸ (`condition`: [Condition](_ast_.condition.md)): *[Condition](_ast_.condition.md)*

**Parameters:**

Name | Type |
------ | ------ |
`condition` | [Condition](_ast_.condition.md) |

___

###  right

• **right**: *[Expression](_ast_.expression.md) | [List](_ast_.list.md)*

Defined in src/ast.ts:1047

___

### `Readonly` type

• **type**: *[SQL_SYMBOLE](../enums/_constants_.sql_symbole.md)*

*Inherited from [AST](_ast_.ast.md).[type](_ast_.ast.md#readonly-type)*

Defined in src/ast.ts:73

## Methods

### `Static` and

▸ **and**(...`conditions`: [Condition](_ast_.condition.md)[]): *[Condition](_ast_.condition.md)‹›*

*Inherited from [Condition](_ast_.condition.md).[and](_ast_.condition.md#and)*

Defined in src/ast.ts:816

将多个查询条件通过 AND 合并成一个大查询条件

**`static`** 

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`...conditions` | [Condition](_ast_.condition.md)[] | 查询条件列表 |

**Returns:** *[Condition](_ast_.condition.md)‹›*

返回逻辑表达式

___

### `Static` bracket

▸ **bracket**‹**T**›(`context`: T): *[Bracket](_ast_.bracket.md)‹T›*

*Inherited from [AST](_ast_.ast.md).[bracket](_ast_.ast.md#static-bracket)*

Defined in src/ast.ts:75

**Type parameters:**

▪ **T**: *[AST](_ast_.ast.md)*

**Parameters:**

Name | Type |
------ | ------ |
`context` | T |

**Returns:** *[Bracket](_ast_.bracket.md)‹T›*

___

### `Static` `Private` compare

▸ **compare**(`left`: [UnsureExpression](../modules/_ast_.md#unsureexpression), `right`: [UnsureExpression](../modules/_ast_.md#unsureexpression) | [UnsureGroupValues](../modules/_ast_.md#unsuregroupvalues), `operator`: [COMPARE_OPERATOR](../enums/_constants_.compare_operator.md)): *[BinaryCompare](_ast_.binarycompare.md)‹›*

*Inherited from [Condition](_ast_.condition.md).[compare](_ast_.condition.md#static-private-compare)*

Defined in src/ast.ts:867

比较运算

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`left` | [UnsureExpression](../modules/_ast_.md#unsureexpression) | - | 左值 |
`right` | [UnsureExpression](../modules/_ast_.md#unsureexpression) &#124; [UnsureGroupValues](../modules/_ast_.md#unsuregroupvalues) | - | 右值 |
`operator` | [COMPARE_OPERATOR](../enums/_constants_.compare_operator.md) | COMPARE_OPERATOR.EQ | 运算符 |

**Returns:** *[BinaryCompare](_ast_.binarycompare.md)‹›*

返回比较运算对比条件

___

### `Static` eq

▸ **eq**(`left`: [UnsureExpression](../modules/_ast_.md#unsureexpression), `right`: [UnsureExpression](../modules/_ast_.md#unsureexpression)): *[BinaryCompare](_ast_.binarycompare.md)‹›*

*Inherited from [Condition](_ast_.condition.md).[eq](_ast_.condition.md#static-eq)*

Defined in src/ast.ts:877

比较运算 =

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`left` | [UnsureExpression](../modules/_ast_.md#unsureexpression) | 左值 |
`right` | [UnsureExpression](../modules/_ast_.md#unsureexpression) | 右值 |

**Returns:** *[BinaryCompare](_ast_.binarycompare.md)‹›*

返回比较运算对比条件

___

### `Static` exists

▸ **exists**(`select`: [SelectExpression](../modules/_ast_.md#selectexpression)): *[ExistsCompare](_ast_.existscompare.md)‹›*

*Inherited from [Condition](_ast_.condition.md).[exists](_ast_.condition.md#static-exists)*

Defined in src/ast.ts:855

判断是否存在

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`select` | [SelectExpression](../modules/_ast_.md#selectexpression) | 查询语句  |

**Returns:** *[ExistsCompare](_ast_.existscompare.md)‹›*

___

### `Static` gt

▸ **gt**(`left`: [UnsureExpression](../modules/_ast_.md#unsureexpression), `right`: [UnsureExpression](../modules/_ast_.md#unsureexpression)): *[BinaryCompare](_ast_.binarycompare.md)‹›*

*Inherited from [Condition](_ast_.condition.md).[gt](_ast_.condition.md#static-gt)*

Defined in src/ast.ts:917

比较运算 >

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`left` | [UnsureExpression](../modules/_ast_.md#unsureexpression) | 左值 |
`right` | [UnsureExpression](../modules/_ast_.md#unsureexpression) | 右值 |

**Returns:** *[BinaryCompare](_ast_.binarycompare.md)‹›*

返回比较运算对比条件

___

### `Static` gte

▸ **gte**(`left`: [UnsureExpression](../modules/_ast_.md#unsureexpression), `right`: [UnsureExpression](../modules/_ast_.md#unsureexpression)): *[BinaryCompare](_ast_.binarycompare.md)‹›*

*Inherited from [Condition](_ast_.condition.md).[gte](_ast_.condition.md#static-gte)*

Defined in src/ast.ts:927

比较运算 >=

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`left` | [UnsureExpression](../modules/_ast_.md#unsureexpression) | 左值 |
`right` | [UnsureExpression](../modules/_ast_.md#unsureexpression) | 右值 |

**Returns:** *[BinaryCompare](_ast_.binarycompare.md)‹›*

返回比较运算对比条件

___

### `Static` in

▸ **in**(`left`: [UnsureExpression](../modules/_ast_.md#unsureexpression), `values`: [UnsureGroupValues](../modules/_ast_.md#unsuregroupvalues)): *[BinaryCompare](_ast_.binarycompare.md)‹›*

*Inherited from [Condition](_ast_.condition.md).[in](_ast_.condition.md#static-in)*

Defined in src/ast.ts:957

比较运算 IN

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`left` | [UnsureExpression](../modules/_ast_.md#unsureexpression) | 左值 |
`values` | [UnsureGroupValues](../modules/_ast_.md#unsuregroupvalues) | 要比较的值列表 |

**Returns:** *[BinaryCompare](_ast_.binarycompare.md)‹›*

返回比较运算对比条件

___

### `Static` isNotNull

▸ **isNotNull**(`expr`: [UnsureExpression](../modules/_ast_.md#unsureexpression)): *[IsNotNullCondition](_ast_.isnotnullcondition.md)‹›*

*Inherited from [Condition](_ast_.condition.md).[isNotNull](_ast_.condition.md#static-isnotnull)*

Defined in src/ast.ts:985

比较运算 IS NOT NULL

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`expr` | [UnsureExpression](../modules/_ast_.md#unsureexpression) | 表达式 |

**Returns:** *[IsNotNullCondition](_ast_.isnotnullcondition.md)‹›*

返回比较运算符

___

### `Static` isNull

▸ **isNull**(`expr`: [UnsureExpression](../modules/_ast_.md#unsureexpression)): *[IsNullCondition](_ast_.isnullcondition.md)‹›*

*Inherited from [Condition](_ast_.condition.md).[isNull](_ast_.condition.md#static-isnull)*

Defined in src/ast.ts:976

比较运算 IS NULL

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`expr` | [UnsureExpression](../modules/_ast_.md#unsureexpression) | 表达式  |

**Returns:** *[IsNullCondition](_ast_.isnullcondition.md)‹›*

返回比较运算符

___

### `Static` like

▸ **like**(`left`: [UnsureExpression](../modules/_ast_.md#unsureexpression), `right`: [UnsureExpression](../modules/_ast_.md#unsureexpression)): *[BinaryCompare](_ast_.binarycompare.md)‹›*

*Inherited from [Condition](_ast_.condition.md).[like](_ast_.condition.md#static-like)*

Defined in src/ast.ts:937

比较运算 LIKE

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`left` | [UnsureExpression](../modules/_ast_.md#unsureexpression) | 左值 |
`right` | [UnsureExpression](../modules/_ast_.md#unsureexpression) | 右值 |

**Returns:** *[BinaryCompare](_ast_.binarycompare.md)‹›*

返回比较运算对比条件

___

### `Static` lt

▸ **lt**(`left`: [UnsureExpression](../modules/_ast_.md#unsureexpression), `right`: [UnsureExpression](../modules/_ast_.md#unsureexpression)): *[BinaryCompare](_ast_.binarycompare.md)‹›*

*Inherited from [Condition](_ast_.condition.md).[lt](_ast_.condition.md#static-lt)*

Defined in src/ast.ts:897

比较运算 <

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`left` | [UnsureExpression](../modules/_ast_.md#unsureexpression) | 左值 |
`right` | [UnsureExpression](../modules/_ast_.md#unsureexpression) | 右值 |

**Returns:** *[BinaryCompare](_ast_.binarycompare.md)‹›*

返回比较运算对比条件

___

### `Static` lte

▸ **lte**(`left`: [UnsureExpression](../modules/_ast_.md#unsureexpression), `right`: [UnsureExpression](../modules/_ast_.md#unsureexpression)): *[BinaryCompare](_ast_.binarycompare.md)‹›*

*Inherited from [Condition](_ast_.condition.md).[lte](_ast_.condition.md#static-lte)*

Defined in src/ast.ts:907

比较运算 <=

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`left` | [UnsureExpression](../modules/_ast_.md#unsureexpression) | 左值 |
`right` | [UnsureExpression](../modules/_ast_.md#unsureexpression) | 右值 |

**Returns:** *[BinaryCompare](_ast_.binarycompare.md)‹›*

返回比较运算对比条件

___

### `Static` neq

▸ **neq**(`left`: [UnsureExpression](../modules/_ast_.md#unsureexpression), `right`: [UnsureExpression](../modules/_ast_.md#unsureexpression)): *[BinaryCompare](_ast_.binarycompare.md)‹›*

*Inherited from [Condition](_ast_.condition.md).[neq](_ast_.condition.md#static-neq)*

Defined in src/ast.ts:887

比较运算 <>

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`left` | [UnsureExpression](../modules/_ast_.md#unsureexpression) | 左值 |
`right` | [UnsureExpression](../modules/_ast_.md#unsureexpression) | 右值 |

**Returns:** *[BinaryCompare](_ast_.binarycompare.md)‹›*

返回比较运算对比条件

___

### `Static` not

▸ **not**(`condition`: [Condition](_ast_.condition.md)): *[UnaryLogic](_ast_.unarylogic.md)‹›*

*Inherited from [Condition](_ast_.condition.md).[not](_ast_.condition.md#static-not)*

Defined in src/ast.ts:844

Not 逻辑运算

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`condition` | [Condition](_ast_.condition.md) |   |

**Returns:** *[UnaryLogic](_ast_.unarylogic.md)‹›*

___

### `Static` notIn

▸ **notIn**(`left`: [UnsureExpression](../modules/_ast_.md#unsureexpression), `values`: [UnsureGroupValues](../modules/_ast_.md#unsuregroupvalues)): *[BinaryCompare](_ast_.binarycompare.md)‹›*

*Inherited from [Condition](_ast_.condition.md).[notIn](_ast_.condition.md#static-notin)*

Defined in src/ast.ts:967

比较运算 NOT IN

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`left` | [UnsureExpression](../modules/_ast_.md#unsureexpression) | 左值 |
`values` | [UnsureGroupValues](../modules/_ast_.md#unsuregroupvalues) | 要比较的值列表 |

**Returns:** *[BinaryCompare](_ast_.binarycompare.md)‹›*

返回比较运算对比条件

___

### `Static` notLike

▸ **notLike**(`left`: [UnsureExpression](../modules/_ast_.md#unsureexpression), `right`: [UnsureExpression](../modules/_ast_.md#unsureexpression)): *[BinaryCompare](_ast_.binarycompare.md)‹›*

*Inherited from [Condition](_ast_.condition.md).[notLike](_ast_.condition.md#static-notlike)*

Defined in src/ast.ts:947

比较运算 NOT LIKE

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`left` | [UnsureExpression](../modules/_ast_.md#unsureexpression) | 左值 |
`right` | [UnsureExpression](../modules/_ast_.md#unsureexpression) | 右值 |

**Returns:** *[BinaryCompare](_ast_.binarycompare.md)‹›*

返回比较运算对比条件

___

### `Static` or

▸ **or**(...`conditions`: [Condition](_ast_.condition.md)[]): *[Condition](_ast_.condition.md)‹›*

*Inherited from [Condition](_ast_.condition.md).[or](_ast_.condition.md#or)*

Defined in src/ast.ts:831

将多个查询条件通过 OR 合并成一个

**`static`** 

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`...conditions` | [Condition](_ast_.condition.md)[] | 查询条件列表 |

**Returns:** *[Condition](_ast_.condition.md)‹›*

返回逻辑表达式

___

### `Static` quoted

▸ **quoted**(`condition`: [Condition](_ast_.condition.md)): *[QuotedCondition](_ast_.quotedcondition.md)‹›*

*Inherited from [Condition](_ast_.condition.md).[quoted](_ast_.condition.md#static-quoted)*

Defined in src/ast.ts:993

括号条件

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`condition` | [Condition](_ast_.condition.md) | 查询条件  |

**Returns:** *[QuotedCondition](_ast_.quotedcondition.md)‹›*
