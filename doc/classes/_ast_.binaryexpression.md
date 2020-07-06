[lubejs](../README.md) › [Globals](../globals.md) › ["ast"](../modules/_ast_.md) › [BinaryExpression](_ast_.binaryexpression.md)

# Class: BinaryExpression

二元运算表达式

## Hierarchy

  ↳ [Expression](_ast_.expression.md)

  ↳ **BinaryExpression**

## Implements

* [IBinary](../interfaces/_ast_.ibinary.md)

## Index

### Constructors

* [constructor](_ast_.binaryexpression.md#constructor)

### Properties

* [left](_ast_.binaryexpression.md#left)
* [operator](_ast_.binaryexpression.md#operator)
* [right](_ast_.binaryexpression.md#right)
* [type](_ast_.binaryexpression.md#readonly-type)

### Accessors

* [lvalue](_ast_.binaryexpression.md#lvalue)

### Methods

* [add](_ast_.binaryexpression.md#add)
* [and](_ast_.binaryexpression.md#and)
* [as](_ast_.binaryexpression.md#as)
* [asc](_ast_.binaryexpression.md#asc)
* [desc](_ast_.binaryexpression.md#desc)
* [div](_ast_.binaryexpression.md#div)
* [eq](_ast_.binaryexpression.md#eq)
* [gt](_ast_.binaryexpression.md#gt)
* [gte](_ast_.binaryexpression.md#gte)
* [in](_ast_.binaryexpression.md#in)
* [isNotNull](_ast_.binaryexpression.md#isnotnull)
* [isNull](_ast_.binaryexpression.md#isnull)
* [like](_ast_.binaryexpression.md#like)
* [lt](_ast_.binaryexpression.md#lt)
* [lte](_ast_.binaryexpression.md#lte)
* [mod](_ast_.binaryexpression.md#mod)
* [mul](_ast_.binaryexpression.md#mul)
* [neq](_ast_.binaryexpression.md#neq)
* [not](_ast_.binaryexpression.md#not)
* [notIn](_ast_.binaryexpression.md#notin)
* [notLike](_ast_.binaryexpression.md#notlike)
* [notNull](_ast_.binaryexpression.md#notnull)
* [or](_ast_.binaryexpression.md#or)
* [shl](_ast_.binaryexpression.md#shl)
* [shr](_ast_.binaryexpression.md#shr)
* [sub](_ast_.binaryexpression.md#sub)
* [xor](_ast_.binaryexpression.md#xor)
* [add](_ast_.binaryexpression.md#static-add)
* [alias](_ast_.binaryexpression.md#static-alias)
* [and](_ast_.binaryexpression.md#static-and)
* [any](_ast_.binaryexpression.md#static-any)
* [bracket](_ast_.binaryexpression.md#static-bracket)
* [const](_ast_.binaryexpression.md#static-const)
* [constant](_ast_.binaryexpression.md#static-constant)
* [div](_ast_.binaryexpression.md#static-div)
* [field](_ast_.binaryexpression.md#static-field)
* [identifier](_ast_.binaryexpression.md#static-identifier)
* [invoke](_ast_.binaryexpression.md#static-invoke)
* [mod](_ast_.binaryexpression.md#static-mod)
* [mul](_ast_.binaryexpression.md#static-mul)
* [not](_ast_.binaryexpression.md#static-not)
* [or](_ast_.binaryexpression.md#static-or)
* [proxyIdentifier](_ast_.binaryexpression.md#static-proxyidentifier)
* [shl](_ast_.binaryexpression.md#static-shl)
* [shr](_ast_.binaryexpression.md#static-shr)
* [sub](_ast_.binaryexpression.md#static-sub)
* [table](_ast_.binaryexpression.md#static-table)
* [var](_ast_.binaryexpression.md#static-var)
* [variant](_ast_.binaryexpression.md#static-variant)
* [xor](_ast_.binaryexpression.md#static-xor)

## Constructors

###  constructor

\+ **new BinaryExpression**(`operator`: [COMPUTE_OPERATOR](../enums/_constants_.compute_operator.md), `left`: [UnsureExpression](../modules/_ast_.md#unsureexpression), `right`: [UnsureExpression](../modules/_ast_.md#unsureexpression)): *[BinaryExpression](_ast_.binaryexpression.md)*

*Overrides [AST](_ast_.ast.md).[constructor](_ast_.ast.md#constructor)*

Defined in src/ast.ts:1729

名称

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`operator` | [COMPUTE_OPERATOR](../enums/_constants_.compute_operator.md) | 运算符 |
`left` | [UnsureExpression](../modules/_ast_.md#unsureexpression) | 左值 |
`right` | [UnsureExpression](../modules/_ast_.md#unsureexpression) | 右值  |

**Returns:** *[BinaryExpression](_ast_.binaryexpression.md)*

## Properties

###  left

• **left**: *[Expression](_ast_.expression.md)*

*Implementation of [IBinary](../interfaces/_ast_.ibinary.md).[left](../interfaces/_ast_.ibinary.md#left)*

Defined in src/ast.ts:1728

___

###  operator

• **operator**: *[COMPUTE_OPERATOR](../enums/_constants_.compute_operator.md)*

*Implementation of [IBinary](../interfaces/_ast_.ibinary.md).[operator](../interfaces/_ast_.ibinary.md#operator)*

Defined in src/ast.ts:1727

___

###  right

• **right**: *[Expression](_ast_.expression.md)*

*Implementation of [IBinary](../interfaces/_ast_.ibinary.md).[right](../interfaces/_ast_.ibinary.md#right)*

Defined in src/ast.ts:1729

___

### `Readonly` type

• **type**: *[SQL_SYMBOLE](../enums/_constants_.sql_symbole.md)*

*Implementation of [IBinary](../interfaces/_ast_.ibinary.md).[type](../interfaces/_ast_.ibinary.md#readonly-type)*

*Inherited from [AST](_ast_.ast.md).[type](_ast_.ast.md#readonly-type)*

Defined in src/ast.ts:70

## Accessors

###  lvalue

• **get lvalue**(): *boolean*

*Overrides [Expression](_ast_.expression.md).[lvalue](_ast_.expression.md#lvalue)*

Defined in src/ast.ts:1723

**Returns:** *boolean*

## Methods

###  add

▸ **add**(`expr`: [UnsureExpression](../modules/_ast_.md#unsureexpression)): *[BinaryExpression](_ast_.binaryexpression.md)‹›*

*Inherited from [Expression](_ast_.expression.md).[add](_ast_.expression.md#add)*

Defined in src/ast.ts:253

加法运算

**Parameters:**

Name | Type |
------ | ------ |
`expr` | [UnsureExpression](../modules/_ast_.md#unsureexpression) |

**Returns:** *[BinaryExpression](_ast_.binaryexpression.md)‹›*

___

###  and

▸ **and**(`expr`: [UnsureExpression](../modules/_ast_.md#unsureexpression)): *[BinaryExpression](_ast_.binaryexpression.md)‹›*

*Inherited from [Expression](_ast_.expression.md).[and](_ast_.expression.md#and)*

Defined in src/ast.ts:295

位运算 &

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`expr` | [UnsureExpression](../modules/_ast_.md#unsureexpression) | 要与当前表达式相除的表达式 |

**Returns:** *[BinaryExpression](_ast_.binaryexpression.md)‹›*

返回运算后的表达式

___

###  as

▸ **as**(`alias`: string): *[Identifier](_ast_.identifier.md)*

*Inherited from [Expression](_ast_.expression.md).[as](_ast_.expression.md#as)*

Defined in src/ast.ts:477

为当前表达式添加别名

**Parameters:**

Name | Type |
------ | ------ |
`alias` | string |

**Returns:** *[Identifier](_ast_.identifier.md)*

___

###  asc

▸ **asc**(): *[SortInfo](_ast_.sortinfo.md)*

*Inherited from [Expression](_ast_.expression.md).[asc](_ast_.expression.md#asc)*

Defined in src/ast.ts:462

正序

**Returns:** *[SortInfo](_ast_.sortinfo.md)*

返回对比条件表达式

___

###  desc

▸ **desc**(): *[SortInfo](_ast_.sortinfo.md)*

*Inherited from [Expression](_ast_.expression.md).[desc](_ast_.expression.md#desc)*

Defined in src/ast.ts:470

倒序

**Returns:** *[SortInfo](_ast_.sortinfo.md)*

返回对比条件表达式

___

###  div

▸ **div**(`expr`: [UnsureExpression](../modules/_ast_.md#unsureexpression)): *[BinaryExpression](_ast_.binaryexpression.md)‹›*

*Inherited from [Expression](_ast_.expression.md).[div](_ast_.expression.md#div)*

Defined in src/ast.ts:277

除法运算

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`expr` | [UnsureExpression](../modules/_ast_.md#unsureexpression) | 要与当前表达式相除的表达式 |

**Returns:** *[BinaryExpression](_ast_.binaryexpression.md)‹›*

返回运算后的表达式

___

###  eq

▸ **eq**(`expr`: [UnsureExpression](../modules/_ast_.md#unsureexpression)): *[BinaryCompareCondition](_ast_.binarycomparecondition.md)‹›*

*Inherited from [Expression](_ast_.expression.md).[eq](_ast_.expression.md#eq)*

Defined in src/ast.ts:349

比较是否相等 =

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`expr` | [UnsureExpression](../modules/_ast_.md#unsureexpression) | 要与当前表达式相比较的表达式 |

**Returns:** *[BinaryCompareCondition](_ast_.binarycomparecondition.md)‹›*

返回对比条件表达式

___

###  gt

▸ **gt**(`expr`: [UnsureExpression](../modules/_ast_.md#unsureexpression)): *[BinaryCompareCondition](_ast_.binarycomparecondition.md)‹›*

*Inherited from [Expression](_ast_.expression.md).[gt](_ast_.expression.md#gt)*

Defined in src/ast.ts:385

比较是否大于 >

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`expr` | [UnsureExpression](../modules/_ast_.md#unsureexpression) | 要与当前表达式相比较的表达式 |

**Returns:** *[BinaryCompareCondition](_ast_.binarycomparecondition.md)‹›*

返回对比条件表达式

___

###  gte

▸ **gte**(`expr`: [UnsureExpression](../modules/_ast_.md#unsureexpression)): *[BinaryCompareCondition](_ast_.binarycomparecondition.md)‹›*

*Inherited from [Expression](_ast_.expression.md).[gte](_ast_.expression.md#gte)*

Defined in src/ast.ts:394

比较是否小于等于 >=

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`expr` | [UnsureExpression](../modules/_ast_.md#unsureexpression) | 要与当前表达式相比较的表达式 |

**Returns:** *[BinaryCompareCondition](_ast_.binarycomparecondition.md)‹›*

返回对比条件表达式

___

###  in

▸ **in**(...`values`: [UnsureExpression](../modules/_ast_.md#unsureexpression)[]): *[BinaryCompareCondition](_ast_.binarycomparecondition.md)‹›*

*Inherited from [Expression](_ast_.expression.md).[in](_ast_.expression.md#in)*

Defined in src/ast.ts:421

比较是否不包含于 IN

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`...values` | [UnsureExpression](../modules/_ast_.md#unsureexpression)[] | 要与当前表达式相比较的表达式数组 |

**Returns:** *[BinaryCompareCondition](_ast_.binarycomparecondition.md)‹›*

返回对比条件表达式

___

###  isNotNull

▸ **isNotNull**(): *[IsNotNullCondition](_ast_.isnotnullcondition.md)‹›*

*Inherited from [Expression](_ast_.expression.md).[isNotNull](_ast_.expression.md#isnotnull)*

Defined in src/ast.ts:446

比较是否为空 IS NOT NULL

**Returns:** *[IsNotNullCondition](_ast_.isnotnullcondition.md)‹›*

返回对比条件表达式

___

###  isNull

▸ **isNull**(): *[IsNullCondition](_ast_.isnullcondition.md)‹›*

*Inherited from [Expression](_ast_.expression.md).[isNull](_ast_.expression.md#isnull)*

Defined in src/ast.ts:438

比较是否为空 IS NULL

**Returns:** *[IsNullCondition](_ast_.isnullcondition.md)‹›*

返回对比条件表达式

___

###  like

▸ **like**(`expr`: [UnsureExpression](../modules/_ast_.md#unsureexpression)): *[BinaryCompareCondition](_ast_.binarycomparecondition.md)‹›*

*Inherited from [Expression](_ast_.expression.md).[like](_ast_.expression.md#like)*

Defined in src/ast.ts:403

比较是相像 LIKE

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`expr` | [UnsureExpression](../modules/_ast_.md#unsureexpression) | 要与当前表达式相比较的表达式 |

**Returns:** *[BinaryCompareCondition](_ast_.binarycomparecondition.md)‹›*

返回对比条件表达式

___

###  lt

▸ **lt**(`expr`: [UnsureExpression](../modules/_ast_.md#unsureexpression)): *[BinaryCompareCondition](_ast_.binarycomparecondition.md)‹›*

*Inherited from [Expression](_ast_.expression.md).[lt](_ast_.expression.md#lt)*

Defined in src/ast.ts:367

比较是否小于 <

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`expr` | [UnsureExpression](../modules/_ast_.md#unsureexpression) | 要与当前表达式相比较的表达式 |

**Returns:** *[BinaryCompareCondition](_ast_.binarycomparecondition.md)‹›*

返回对比条件表达式

___

###  lte

▸ **lte**(`expr`: [UnsureExpression](../modules/_ast_.md#unsureexpression)): *[BinaryCompareCondition](_ast_.binarycomparecondition.md)‹›*

*Inherited from [Expression](_ast_.expression.md).[lte](_ast_.expression.md#lte)*

Defined in src/ast.ts:376

比较是否小于等于 <=

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`expr` | [UnsureExpression](../modules/_ast_.md#unsureexpression) | 要与当前表达式相比较的表达式 |

**Returns:** *[BinaryCompareCondition](_ast_.binarycomparecondition.md)‹›*

返回对比条件表达式

___

###  mod

▸ **mod**(`expr`: [UnsureExpression](../modules/_ast_.md#unsureexpression)): *[BinaryExpression](_ast_.binaryexpression.md)‹›*

*Inherited from [Expression](_ast_.expression.md).[mod](_ast_.expression.md#mod)*

Defined in src/ast.ts:286

算术运算 %

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`expr` | [UnsureExpression](../modules/_ast_.md#unsureexpression) | 要与当前表达式相除的表达式 |

**Returns:** *[BinaryExpression](_ast_.binaryexpression.md)‹›*

返回运算后的表达式

___

###  mul

▸ **mul**(`expr`: [UnsureExpression](../modules/_ast_.md#unsureexpression)): *[BinaryExpression](_ast_.binaryexpression.md)‹›*

*Inherited from [Expression](_ast_.expression.md).[mul](_ast_.expression.md#mul)*

Defined in src/ast.ts:268

乘法运算

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`expr` | [UnsureExpression](../modules/_ast_.md#unsureexpression) | 要与当前表达式相乘的表达式  |

**Returns:** *[BinaryExpression](_ast_.binaryexpression.md)‹›*

___

###  neq

▸ **neq**(`expr`: [UnsureExpression](../modules/_ast_.md#unsureexpression)): *[BinaryCompareCondition](_ast_.binarycomparecondition.md)‹›*

*Inherited from [Expression](_ast_.expression.md).[neq](_ast_.expression.md#neq)*

Defined in src/ast.ts:358

比较是否不等于 <>

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`expr` | [UnsureExpression](../modules/_ast_.md#unsureexpression) | 要与当前表达式相比较的表达式 |

**Returns:** *[BinaryCompareCondition](_ast_.binarycomparecondition.md)‹›*

返回对比条件表达式

___

###  not

▸ **not**(`expr`: [UnsureExpression](../modules/_ast_.md#unsureexpression)): *[BinaryExpression](_ast_.binaryexpression.md)‹›*

*Inherited from [Expression](_ast_.expression.md).[not](_ast_.expression.md#not)*

Defined in src/ast.ts:313

位运算 ~

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`expr` | [UnsureExpression](../modules/_ast_.md#unsureexpression) | 要与当前表达式相除的表达式 |

**Returns:** *[BinaryExpression](_ast_.binaryexpression.md)‹›*

返回运算后的表达式

___

###  notIn

▸ **notIn**(...`values`: [UnsureExpression](../modules/_ast_.md#unsureexpression)[]): *[BinaryCompareCondition](_ast_.binarycomparecondition.md)‹›*

*Inherited from [Expression](_ast_.expression.md).[notIn](_ast_.expression.md#notin)*

Defined in src/ast.ts:430

比较是否不包含于 NOT IN

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`...values` | [UnsureExpression](../modules/_ast_.md#unsureexpression)[] | 要与当前表达式相比较的表达式 |

**Returns:** *[BinaryCompareCondition](_ast_.binarycomparecondition.md)‹›*

返回对比条件表达式

___

###  notLike

▸ **notLike**(`expr`: [UnsureExpression](../modules/_ast_.md#unsureexpression)): *[BinaryCompareCondition](_ast_.binarycomparecondition.md)‹›*

*Inherited from [Expression](_ast_.expression.md).[notLike](_ast_.expression.md#notlike)*

Defined in src/ast.ts:412

比较是否不想像 NOT LIKE

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`expr` | [UnsureExpression](../modules/_ast_.md#unsureexpression) | 要与当前表达式相比较的表达式 |

**Returns:** *[BinaryCompareCondition](_ast_.binarycomparecondition.md)‹›*

返回对比条件表达式

___

###  notNull

▸ **notNull**(): *[IsNotNullCondition](_ast_.isnotnullcondition.md)‹›*

*Inherited from [Expression](_ast_.expression.md).[notNull](_ast_.expression.md#notnull)*

Defined in src/ast.ts:454

isNotNull 的简称别名

**Returns:** *[IsNotNullCondition](_ast_.isnotnullcondition.md)‹›*

返回对比条件表达式

___

###  or

▸ **or**(`expr`: [UnsureExpression](../modules/_ast_.md#unsureexpression)): *[BinaryExpression](_ast_.binaryexpression.md)‹›*

*Inherited from [Expression](_ast_.expression.md).[or](_ast_.expression.md#or)*

Defined in src/ast.ts:304

位运算 |

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`expr` | [UnsureExpression](../modules/_ast_.md#unsureexpression) | 要与当前表达式相除的表达式 |

**Returns:** *[BinaryExpression](_ast_.binaryexpression.md)‹›*

返回运算后的表达式

___

###  shl

▸ **shl**(`expr`: [UnsureExpression](../modules/_ast_.md#unsureexpression)): *[BinaryExpression](_ast_.binaryexpression.md)‹›*

*Inherited from [Expression](_ast_.expression.md).[shl](_ast_.expression.md#shl)*

Defined in src/ast.ts:331

位运算 <<

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`expr` | [UnsureExpression](../modules/_ast_.md#unsureexpression) | 要与当前表达式相除的表达式 |

**Returns:** *[BinaryExpression](_ast_.binaryexpression.md)‹›*

返回运算后的表达式

___

###  shr

▸ **shr**(`expr`: [UnsureExpression](../modules/_ast_.md#unsureexpression)): *[BinaryExpression](_ast_.binaryexpression.md)‹›*

*Inherited from [Expression](_ast_.expression.md).[shr](_ast_.expression.md#shr)*

Defined in src/ast.ts:340

位运算 >>

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`expr` | [UnsureExpression](../modules/_ast_.md#unsureexpression) | 要与当前表达式相除的表达式 |

**Returns:** *[BinaryExpression](_ast_.binaryexpression.md)‹›*

返回运算后的表达式

___

###  sub

▸ **sub**(`expr`: [UnsureExpression](../modules/_ast_.md#unsureexpression)): *[BinaryExpression](_ast_.binaryexpression.md)‹›*

*Inherited from [Expression](_ast_.expression.md).[sub](_ast_.expression.md#sub)*

Defined in src/ast.ts:260

减法运算

**Parameters:**

Name | Type |
------ | ------ |
`expr` | [UnsureExpression](../modules/_ast_.md#unsureexpression) |

**Returns:** *[BinaryExpression](_ast_.binaryexpression.md)‹›*

___

###  xor

▸ **xor**(`expr`: [UnsureExpression](../modules/_ast_.md#unsureexpression)): *[BinaryExpression](_ast_.binaryexpression.md)‹›*

*Inherited from [Expression](_ast_.expression.md).[xor](_ast_.expression.md#xor)*

Defined in src/ast.ts:322

位运算 ^

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`expr` | [UnsureExpression](../modules/_ast_.md#unsureexpression) | 要与当前表达式相除的表达式 |

**Returns:** *[BinaryExpression](_ast_.binaryexpression.md)‹›*

返回运算后的表达式

___

### `Static` add

▸ **add**(`left`: any, `right`: any): *[BinaryExpression](_ast_.binaryexpression.md)‹›*

*Inherited from [Expression](_ast_.expression.md).[add](_ast_.expression.md#add)*

Defined in src/ast.ts:497

算术运算 +

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`left` | any | 左值 |
`right` | any | 右值 |

**Returns:** *[BinaryExpression](_ast_.binaryexpression.md)‹›*

返回算术运算表达式

___

### `Static` alias

▸ **alias**(`expr`: [Expression](_ast_.expression.md), `name`: string): *[Alias](_ast_.alias.md)‹›*

*Inherited from [Expression](_ast_.expression.md).[alias](_ast_.expression.md#static-alias)*

Defined in src/ast.ts:633

**Parameters:**

Name | Type |
------ | ------ |
`expr` | [Expression](_ast_.expression.md) |
`name` | string |

**Returns:** *[Alias](_ast_.alias.md)‹›*

___

### `Static` and

▸ **and**(`left`: any, `right`: any): *[BinaryExpression](_ast_.binaryexpression.md)‹›*

*Inherited from [Expression](_ast_.expression.md).[and](_ast_.expression.md#and)*

Defined in src/ast.ts:547

位算术运算 &

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`left` | any | 左值 |
`right` | any | 右值 |

**Returns:** *[BinaryExpression](_ast_.binaryexpression.md)‹›*

返回算术运算表达式

___

### `Static` any

▸ **any**(`parent?`: [UnsureIdentity](../modules/_ast_.md#unsureidentity)): *[Identifier](_ast_.identifier.md)‹›*

*Inherited from [Expression](_ast_.expression.md).[any](_ast_.expression.md#static-any)*

Defined in src/ast.ts:641

任意字段 *

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`parent?` | [UnsureIdentity](../modules/_ast_.md#unsureidentity) | parent identifier  |

**Returns:** *[Identifier](_ast_.identifier.md)‹›*

___

### `Static` bracket

▸ **bracket**‹**T**›(`context`: T): *[Bracket](_ast_.bracket.md)‹T›*

*Implementation of [IBinary](../interfaces/_ast_.ibinary.md)*

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

### `Static` const

▸ **const**(`value`: [JsConstant](../modules/_ast_.md#jsconstant)): *[Constant](_ast_.constant.md)‹›*

*Inherited from [Expression](_ast_.expression.md).[const](_ast_.expression.md#static-const)*

Defined in src/ast.ts:613

常量，constant 的别名

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`value` | [JsConstant](../modules/_ast_.md#jsconstant) | 常量值  |

**Returns:** *[Constant](_ast_.constant.md)‹›*

___

### `Static` constant

▸ **constant**(`value`: [JsConstant](../modules/_ast_.md#jsconstant)): *[Constant](_ast_.constant.md)‹›*

*Inherited from [Expression](_ast_.expression.md).[constant](_ast_.expression.md#static-constant)*

Defined in src/ast.ts:605

常量

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`value` | [JsConstant](../modules/_ast_.md#jsconstant) | 常量值  |

**Returns:** *[Constant](_ast_.constant.md)‹›*

___

### `Static` div

▸ **div**(`left`: any, `right`: any): *[BinaryExpression](_ast_.binaryexpression.md)‹›*

*Inherited from [Expression](_ast_.expression.md).[div](_ast_.expression.md#div)*

Defined in src/ast.ts:527

算术运算 /

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`left` | any | 左值 |
`right` | any | 右值 |

**Returns:** *[BinaryExpression](_ast_.binaryexpression.md)‹›*

返回算术运算表达式

___

### `Static` field

▸ **field**(...`names`: string[]): *[Identifier](_ast_.identifier.md)‹›*

*Inherited from [Expression](_ast_.expression.md).[field](_ast_.expression.md#static-field)*

Defined in src/ast.ts:682

字段，实为 identifier(...names) 别名

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`...names` | string[] |   |

**Returns:** *[Identifier](_ast_.identifier.md)‹›*

___

### `Static` identifier

▸ **identifier**(...`names`: string[]): *[Identifier](_ast_.identifier.md)*

*Inherited from [Expression](_ast_.expression.md).[identifier](_ast_.expression.md#static-identifier)*

Defined in src/ast.ts:648

标识符

**Parameters:**

Name | Type |
------ | ------ |
`...names` | string[] |

**Returns:** *[Identifier](_ast_.identifier.md)*

___

### `Static` invoke

▸ **invoke**(`func`: [UnsureIdentity](../modules/_ast_.md#unsureidentity), `params`: String | Number | Boolean | [Expression](_ast_.expression.md)‹› | Date | Buffer‹›[]): *[Invoke](_ast_.invoke.md)‹›*

*Inherited from [Expression](_ast_.expression.md).[invoke](_ast_.expression.md#static-invoke)*

Defined in src/ast.ts:691

调用表达式

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`func` | [UnsureIdentity](../modules/_ast_.md#unsureidentity) | 函数 |
`params` | String &#124; Number &#124; Boolean &#124; [Expression](_ast_.expression.md)‹› &#124; Date &#124; Buffer‹›[] | 参数  |

**Returns:** *[Invoke](_ast_.invoke.md)‹›*

___

### `Static` mod

▸ **mod**(`left`: any, `right`: any): *[BinaryExpression](_ast_.binaryexpression.md)‹›*

*Inherited from [Expression](_ast_.expression.md).[mod](_ast_.expression.md#mod)*

Defined in src/ast.ts:537

算术运算 %

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`left` | any | 左值 |
`right` | any | 右值 |

**Returns:** *[BinaryExpression](_ast_.binaryexpression.md)‹›*

返回算术运算表达式

___

### `Static` mul

▸ **mul**(`left`: any, `right`: any): *[BinaryExpression](_ast_.binaryexpression.md)‹›*

*Inherited from [Expression](_ast_.expression.md).[mul](_ast_.expression.md#mul)*

Defined in src/ast.ts:517

算术运算 *

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`left` | any | 左值 |
`right` | any | 右值 |

**Returns:** *[BinaryExpression](_ast_.binaryexpression.md)‹›*

返回算术运算表达式

___

### `Static` not

▸ **not**(`left`: any, `right`: any): *[BinaryExpression](_ast_.binaryexpression.md)‹›*

*Inherited from [Expression](_ast_.expression.md).[not](_ast_.expression.md#not)*

Defined in src/ast.ts:577

位算术运算 ~

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`left` | any | 左值 |
`right` | any | 右值 |

**Returns:** *[BinaryExpression](_ast_.binaryexpression.md)‹›*

返回算术运算表达式

___

### `Static` or

▸ **or**(`left`: any, `right`: any): *[BinaryExpression](_ast_.binaryexpression.md)‹›*

*Inherited from [Expression](_ast_.expression.md).[or](_ast_.expression.md#or)*

Defined in src/ast.ts:557

位算术运算 |

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`left` | any | 左值 |
`right` | any | 右值 |

**Returns:** *[BinaryExpression](_ast_.binaryexpression.md)‹›*

返回算术运算表达式

___

### `Static` proxyIdentifier

▸ **proxyIdentifier**(`name`: [UnsureIdentity](../modules/_ast_.md#unsureidentity)): *[Identifier](_ast_.identifier.md)‹›*

*Inherited from [Expression](_ast_.expression.md).[proxyIdentifier](_ast_.expression.md#static-proxyidentifier)*

Defined in src/ast.ts:666

代理化的identifier，可以自动接受字段名

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`name` | [UnsureIdentity](../modules/_ast_.md#unsureidentity) |   |

**Returns:** *[Identifier](_ast_.identifier.md)‹›*

___

### `Static` shl

▸ **shl**(`left`: any, `right`: any): *[BinaryExpression](_ast_.binaryexpression.md)‹›*

*Inherited from [Expression](_ast_.expression.md).[shl](_ast_.expression.md#shl)*

Defined in src/ast.ts:587

位算术运算 <<

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`left` | any | 左值 |
`right` | any | 右值 |

**Returns:** *[BinaryExpression](_ast_.binaryexpression.md)‹›*

返回算术运算表达式

___

### `Static` shr

▸ **shr**(`left`: any, `right`: any): *[BinaryExpression](_ast_.binaryexpression.md)‹›*

*Inherited from [Expression](_ast_.expression.md).[shr](_ast_.expression.md#shr)*

Defined in src/ast.ts:597

位算术运算 >>

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`left` | any | 左值 |
`right` | any | 右值 |

**Returns:** *[BinaryExpression](_ast_.binaryexpression.md)‹›*

返回算术运算表达式

___

### `Static` sub

▸ **sub**(`left`: any, `right`: any): *[BinaryExpression](_ast_.binaryexpression.md)‹›*

*Inherited from [Expression](_ast_.expression.md).[sub](_ast_.expression.md#sub)*

Defined in src/ast.ts:507

算术运算 -

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`left` | any | 左值 |
`right` | any | 右值 |

**Returns:** *[BinaryExpression](_ast_.binaryexpression.md)‹›*

返回算术运算表达式

___

### `Static` table

▸ **table**(...`names`: string[]): *[Identifier](_ast_.identifier.md)‹›*

*Inherited from [Expression](_ast_.expression.md).[table](_ast_.expression.md#static-table)*

Defined in src/ast.ts:674

创建表对象，该对象是可代理的，可以直接以 . 运算符获取下一节点Identifier

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`...names` | string[] |   |

**Returns:** *[Identifier](_ast_.identifier.md)‹›*

___

### `Static` var

▸ **var**(`name`: string): *[Variant](_ast_.variant.md)‹›*

*Inherited from [Expression](_ast_.expression.md).[var](_ast_.expression.md#static-var)*

Defined in src/ast.ts:629

变量，variant的别名

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`name` | string | 变量名，不需要带前缀  |

**Returns:** *[Variant](_ast_.variant.md)‹›*

___

### `Static` variant

▸ **variant**(`name`: string): *[Variant](_ast_.variant.md)‹›*

*Inherited from [Expression](_ast_.expression.md).[variant](_ast_.expression.md#static-variant)*

Defined in src/ast.ts:621

变量

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`name` | string | 变量名称，不需要带前缀  |

**Returns:** *[Variant](_ast_.variant.md)‹›*

___

### `Static` xor

▸ **xor**(`left`: any, `right`: any): *[BinaryExpression](_ast_.binaryexpression.md)‹›*

*Inherited from [Expression](_ast_.expression.md).[xor](_ast_.expression.md#xor)*

Defined in src/ast.ts:567

位算术运算 ^

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`left` | any | 左值 |
`right` | any | 右值 |

**Returns:** *[BinaryExpression](_ast_.binaryexpression.md)‹›*

返回算术运算表达式
