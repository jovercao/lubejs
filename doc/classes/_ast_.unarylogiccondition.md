[lubejs](../README.md) › [Globals](../globals.md) › ["ast"](../modules/_ast_.md) › [UnaryLogicCondition](_ast_.unarylogiccondition.md)

# Class: UnaryLogicCondition

一元逻辑查询条件

## Hierarchy

  ↳ [Condition](_ast_.condition.md)

  ↳ **UnaryLogicCondition**

  ↳ [IsNotNullCondition](_ast_.isnotnullcondition.md)

## Implements

* [ICondition](../interfaces/_ast_.icondition.md)
* [IUnary](../interfaces/_ast_.iunary.md)

## Index

### Constructors

* [constructor](_ast_.unarylogiccondition.md#constructor)

### Properties

* [and](_ast_.unarylogiccondition.md#and)
* [andGroup](_ast_.unarylogiccondition.md#andgroup)
* [next](_ast_.unarylogiccondition.md#next)
* [operator](_ast_.unarylogiccondition.md#operator)
* [or](_ast_.unarylogiccondition.md#or)
* [orGroup](_ast_.unarylogiccondition.md#orgroup)
* [type](_ast_.unarylogiccondition.md#readonly-type)

### Methods

* [and](_ast_.unarylogiccondition.md#static-and)
* [bracket](_ast_.unarylogiccondition.md#static-bracket)
* [compare](_ast_.unarylogiccondition.md#static-private-compare)
* [eq](_ast_.unarylogiccondition.md#static-eq)
* [exists](_ast_.unarylogiccondition.md#static-exists)
* [gt](_ast_.unarylogiccondition.md#static-gt)
* [gte](_ast_.unarylogiccondition.md#static-gte)
* [in](_ast_.unarylogiccondition.md#static-in)
* [isNotNull](_ast_.unarylogiccondition.md#static-isnotnull)
* [isNull](_ast_.unarylogiccondition.md#static-isnull)
* [like](_ast_.unarylogiccondition.md#static-like)
* [lt](_ast_.unarylogiccondition.md#static-lt)
* [lte](_ast_.unarylogiccondition.md#static-lte)
* [neq](_ast_.unarylogiccondition.md#static-neq)
* [not](_ast_.unarylogiccondition.md#static-not)
* [notIn](_ast_.unarylogiccondition.md#static-notin)
* [notLike](_ast_.unarylogiccondition.md#static-notlike)
* [or](_ast_.unarylogiccondition.md#static-or)
* [quoted](_ast_.unarylogiccondition.md#static-quoted)

## Constructors

###  constructor

\+ **new UnaryLogicCondition**(`operator`: any, `next`: any): *[UnaryLogicCondition](_ast_.unarylogiccondition.md)*

*Overrides [AST](_ast_.ast.md).[constructor](_ast_.ast.md#constructor)*

Defined in src/ast.ts:1019

创建一元逻辑查询条件实例

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`operator` | any | - |
`next` | any |   |

**Returns:** *[UnaryLogicCondition](_ast_.unarylogiccondition.md)*

## Properties

###  and

• **and**: *function*

*Implementation of [ICondition](../interfaces/_ast_.icondition.md).[and](../interfaces/_ast_.icondition.md#and)*

*Inherited from [Condition](_ast_.condition.md).[and](_ast_.condition.md#and)*

Defined in src/ast.ts:777

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

Defined in src/ast.ts:784

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

###  next

• **next**: *[Condition](_ast_.condition.md)*

*Implementation of [IUnary](../interfaces/_ast_.iunary.md).[next](../interfaces/_ast_.iunary.md#next)*

Defined in src/ast.ts:1019

___

###  operator

• **operator**: *[LOGIC_OPERATOR](../enums/_constants_.logic_operator.md)*

*Implementation of [IUnary](../interfaces/_ast_.iunary.md).[operator](../interfaces/_ast_.iunary.md#operator)*

Defined in src/ast.ts:1018

___

###  or

• **or**: *function*

*Implementation of [ICondition](../interfaces/_ast_.icondition.md).[or](../interfaces/_ast_.icondition.md#or)*

*Inherited from [Condition](_ast_.condition.md).[or](_ast_.condition.md#or)*

Defined in src/ast.ts:791

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

Defined in src/ast.ts:798

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

### `Readonly` type

• **type**: *[SQL_SYMBOLE](../enums/_constants_.sql_symbole.md)*

*Implementation of [IUnary](../interfaces/_ast_.iunary.md).[type](../interfaces/_ast_.iunary.md#readonly-type)*

*Inherited from [AST](_ast_.ast.md).[type](_ast_.ast.md#readonly-type)*

Defined in src/ast.ts:70

## Methods

### `Static` and

▸ **and**(...`conditions`: [Condition](_ast_.condition.md)[]): *[Condition](_ast_.condition.md)‹›*

*Inherited from [Condition](_ast_.condition.md).[and](_ast_.condition.md#and)*

Defined in src/ast.ts:806

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

*Implementation of [IUnary](../interfaces/_ast_.iunary.md)*

*Inherited from [AST](_ast_.ast.md).[bracket](_ast_.ast.md#static-bracket)*

Defined in src/ast.ts:72

**Type parameters:**

▪ **T**: *[AST](_ast_.ast.md)*

**Parameters:**

Name | Type |
------ | ------ |
`context` | T |

**Returns:** *[Bracket](_ast_.bracket.md)‹T›*

___

### `Static` `Private` compare

▸ **compare**(`left`: [UnsureExpression](../modules/_ast_.md#unsureexpression), `right`: [UnsureExpression](../modules/_ast_.md#unsureexpression) | [UnsureGroupValues](../modules/_ast_.md#unsuregroupvalues), `operator`: [COMPARE_OPERATOR](../enums/_constants_.compare_operator.md)): *[BinaryCompareCondition](_ast_.binarycomparecondition.md)‹›*

*Inherited from [Condition](_ast_.condition.md).[compare](_ast_.condition.md#static-private-compare)*

Defined in src/ast.ts:857

比较运算

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`left` | [UnsureExpression](../modules/_ast_.md#unsureexpression) | - | 左值 |
`right` | [UnsureExpression](../modules/_ast_.md#unsureexpression) &#124; [UnsureGroupValues](../modules/_ast_.md#unsuregroupvalues) | - | 右值 |
`operator` | [COMPARE_OPERATOR](../enums/_constants_.compare_operator.md) | COMPARE_OPERATOR.EQ | 运算符 |

**Returns:** *[BinaryCompareCondition](_ast_.binarycomparecondition.md)‹›*

返回比较运算对比条件

___

### `Static` eq

▸ **eq**(`left`: [UnsureExpression](../modules/_ast_.md#unsureexpression), `right`: [UnsureExpression](../modules/_ast_.md#unsureexpression)): *[BinaryCompareCondition](_ast_.binarycomparecondition.md)‹›*

*Inherited from [Condition](_ast_.condition.md).[eq](_ast_.condition.md#static-eq)*

Defined in src/ast.ts:867

比较运算 =

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`left` | [UnsureExpression](../modules/_ast_.md#unsureexpression) | 左值 |
`right` | [UnsureExpression](../modules/_ast_.md#unsureexpression) | 右值 |

**Returns:** *[BinaryCompareCondition](_ast_.binarycomparecondition.md)‹›*

返回比较运算对比条件

___

### `Static` exists

▸ **exists**(`select`: [UnsureSelectExpressions](../modules/_ast_.md#unsureselectexpressions)): *[UnaryCompareCondition](_ast_.unarycomparecondition.md)‹›*

*Inherited from [Condition](_ast_.condition.md).[exists](_ast_.condition.md#static-exists)*

Defined in src/ast.ts:845

判断是否存在

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`select` | [UnsureSelectExpressions](../modules/_ast_.md#unsureselectexpressions) | 查询语句  |

**Returns:** *[UnaryCompareCondition](_ast_.unarycomparecondition.md)‹›*

___

### `Static` gt

▸ **gt**(`left`: [UnsureExpression](../modules/_ast_.md#unsureexpression), `right`: [UnsureExpression](../modules/_ast_.md#unsureexpression)): *[BinaryCompareCondition](_ast_.binarycomparecondition.md)‹›*

*Inherited from [Condition](_ast_.condition.md).[gt](_ast_.condition.md#static-gt)*

Defined in src/ast.ts:907

比较运算 >

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`left` | [UnsureExpression](../modules/_ast_.md#unsureexpression) | 左值 |
`right` | [UnsureExpression](../modules/_ast_.md#unsureexpression) | 右值 |

**Returns:** *[BinaryCompareCondition](_ast_.binarycomparecondition.md)‹›*

返回比较运算对比条件

___

### `Static` gte

▸ **gte**(`left`: [UnsureExpression](../modules/_ast_.md#unsureexpression), `right`: [UnsureExpression](../modules/_ast_.md#unsureexpression)): *[BinaryCompareCondition](_ast_.binarycomparecondition.md)‹›*

*Inherited from [Condition](_ast_.condition.md).[gte](_ast_.condition.md#static-gte)*

Defined in src/ast.ts:917

比较运算 >=

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`left` | [UnsureExpression](../modules/_ast_.md#unsureexpression) | 左值 |
`right` | [UnsureExpression](../modules/_ast_.md#unsureexpression) | 右值 |

**Returns:** *[BinaryCompareCondition](_ast_.binarycomparecondition.md)‹›*

返回比较运算对比条件

___

### `Static` in

▸ **in**(`left`: [UnsureExpression](../modules/_ast_.md#unsureexpression), `values`: [UnsureGroupValues](../modules/_ast_.md#unsuregroupvalues)): *[BinaryCompareCondition](_ast_.binarycomparecondition.md)‹›*

*Inherited from [Condition](_ast_.condition.md).[in](_ast_.condition.md#static-in)*

Defined in src/ast.ts:947

比较运算 IN

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`left` | [UnsureExpression](../modules/_ast_.md#unsureexpression) | 左值 |
`values` | [UnsureGroupValues](../modules/_ast_.md#unsuregroupvalues) | 要比较的值列表 |

**Returns:** *[BinaryCompareCondition](_ast_.binarycomparecondition.md)‹›*

返回比较运算对比条件

___

### `Static` isNotNull

▸ **isNotNull**(`expr`: [UnsureExpression](../modules/_ast_.md#unsureexpression)): *[IsNotNullCondition](_ast_.isnotnullcondition.md)‹›*

*Inherited from [Condition](_ast_.condition.md).[isNotNull](_ast_.condition.md#static-isnotnull)*

Defined in src/ast.ts:975

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

Defined in src/ast.ts:966

比较运算 IS NULL

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`expr` | [UnsureExpression](../modules/_ast_.md#unsureexpression) | 表达式  |

**Returns:** *[IsNullCondition](_ast_.isnullcondition.md)‹›*

返回比较运算符

___

### `Static` like

▸ **like**(`left`: [UnsureExpression](../modules/_ast_.md#unsureexpression), `right`: [UnsureExpression](../modules/_ast_.md#unsureexpression)): *[BinaryCompareCondition](_ast_.binarycomparecondition.md)‹›*

*Inherited from [Condition](_ast_.condition.md).[like](_ast_.condition.md#static-like)*

Defined in src/ast.ts:927

比较运算 LIKE

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`left` | [UnsureExpression](../modules/_ast_.md#unsureexpression) | 左值 |
`right` | [UnsureExpression](../modules/_ast_.md#unsureexpression) | 右值 |

**Returns:** *[BinaryCompareCondition](_ast_.binarycomparecondition.md)‹›*

返回比较运算对比条件

___

### `Static` lt

▸ **lt**(`left`: [UnsureExpression](../modules/_ast_.md#unsureexpression), `right`: [UnsureExpression](../modules/_ast_.md#unsureexpression)): *[BinaryCompareCondition](_ast_.binarycomparecondition.md)‹›*

*Inherited from [Condition](_ast_.condition.md).[lt](_ast_.condition.md#static-lt)*

Defined in src/ast.ts:887

比较运算 <

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`left` | [UnsureExpression](../modules/_ast_.md#unsureexpression) | 左值 |
`right` | [UnsureExpression](../modules/_ast_.md#unsureexpression) | 右值 |

**Returns:** *[BinaryCompareCondition](_ast_.binarycomparecondition.md)‹›*

返回比较运算对比条件

___

### `Static` lte

▸ **lte**(`left`: [UnsureExpression](../modules/_ast_.md#unsureexpression), `right`: [UnsureExpression](../modules/_ast_.md#unsureexpression)): *[BinaryCompareCondition](_ast_.binarycomparecondition.md)‹›*

*Inherited from [Condition](_ast_.condition.md).[lte](_ast_.condition.md#static-lte)*

Defined in src/ast.ts:897

比较运算 <=

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`left` | [UnsureExpression](../modules/_ast_.md#unsureexpression) | 左值 |
`right` | [UnsureExpression](../modules/_ast_.md#unsureexpression) | 右值 |

**Returns:** *[BinaryCompareCondition](_ast_.binarycomparecondition.md)‹›*

返回比较运算对比条件

___

### `Static` neq

▸ **neq**(`left`: [UnsureExpression](../modules/_ast_.md#unsureexpression), `right`: [UnsureExpression](../modules/_ast_.md#unsureexpression)): *[BinaryCompareCondition](_ast_.binarycomparecondition.md)‹›*

*Inherited from [Condition](_ast_.condition.md).[neq](_ast_.condition.md#static-neq)*

Defined in src/ast.ts:877

比较运算 <>

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`left` | [UnsureExpression](../modules/_ast_.md#unsureexpression) | 左值 |
`right` | [UnsureExpression](../modules/_ast_.md#unsureexpression) | 右值 |

**Returns:** *[BinaryCompareCondition](_ast_.binarycomparecondition.md)‹›*

返回比较运算对比条件

___

### `Static` not

▸ **not**(`condition`: [Condition](_ast_.condition.md)): *[UnaryLogicCondition](_ast_.unarylogiccondition.md)‹›*

*Inherited from [Condition](_ast_.condition.md).[not](_ast_.condition.md#static-not)*

Defined in src/ast.ts:834

Not 逻辑运算

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`condition` | [Condition](_ast_.condition.md) |   |

**Returns:** *[UnaryLogicCondition](_ast_.unarylogiccondition.md)‹›*

___

### `Static` notIn

▸ **notIn**(`left`: [UnsureExpression](../modules/_ast_.md#unsureexpression), `values`: [UnsureGroupValues](../modules/_ast_.md#unsuregroupvalues)): *[BinaryCompareCondition](_ast_.binarycomparecondition.md)‹›*

*Inherited from [Condition](_ast_.condition.md).[notIn](_ast_.condition.md#static-notin)*

Defined in src/ast.ts:957

比较运算 NOT IN

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`left` | [UnsureExpression](../modules/_ast_.md#unsureexpression) | 左值 |
`values` | [UnsureGroupValues](../modules/_ast_.md#unsuregroupvalues) | 要比较的值列表 |

**Returns:** *[BinaryCompareCondition](_ast_.binarycomparecondition.md)‹›*

返回比较运算对比条件

___

### `Static` notLike

▸ **notLike**(`left`: [UnsureExpression](../modules/_ast_.md#unsureexpression), `right`: [UnsureExpression](../modules/_ast_.md#unsureexpression)): *[BinaryCompareCondition](_ast_.binarycomparecondition.md)‹›*

*Inherited from [Condition](_ast_.condition.md).[notLike](_ast_.condition.md#static-notlike)*

Defined in src/ast.ts:937

比较运算 NOT LIKE

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`left` | [UnsureExpression](../modules/_ast_.md#unsureexpression) | 左值 |
`right` | [UnsureExpression](../modules/_ast_.md#unsureexpression) | 右值 |

**Returns:** *[BinaryCompareCondition](_ast_.binarycomparecondition.md)‹›*

返回比较运算对比条件

___

### `Static` or

▸ **or**(...`conditions`: [Condition](_ast_.condition.md)[]): *[Condition](_ast_.condition.md)‹›*

*Inherited from [Condition](_ast_.condition.md).[or](_ast_.condition.md#or)*

Defined in src/ast.ts:821

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

Defined in src/ast.ts:983

括号条件

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`condition` | [Condition](_ast_.condition.md) | 查询条件  |

**Returns:** *[QuotedCondition](_ast_.quotedcondition.md)‹›*
