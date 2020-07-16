[lubejs](../README.md) › [Globals](../globals.md) › ["ast"](../modules/_ast_.md) › [Expression](_ast_.expression.md)

# Class: Expression

表达式基类，抽象类

## Hierarchy

* [AST](_ast_.ast.md)

  ↳ **Expression**

  ↳ [Identifier](_ast_.identifier.md)

  ↳ [Variant](_ast_.variant.md)

  ↳ [Invoke](_ast_.invoke.md)

  ↳ [Case](_ast_.case.md)

  ↳ [Constant](_ast_.constant.md)

  ↳ [Bracket](_ast_.bracket.md)

  ↳ [BinaryCalculate](_ast_.binarycalculate.md)

  ↳ [UnaryCalculate](_ast_.unarycalculate.md)

  ↳ [Parameter](_ast_.parameter.md)

## Index

### Constructors

* [constructor](_ast_.expression.md#constructor)

### Properties

* [type](_ast_.expression.md#readonly-type)

### Accessors

* [lvalue](_ast_.expression.md#lvalue)

### Methods

* [add](_ast_.expression.md#add)
* [and](_ast_.expression.md#and)
* [as](_ast_.expression.md#as)
* [asc](_ast_.expression.md#asc)
* [desc](_ast_.expression.md#desc)
* [div](_ast_.expression.md#div)
* [eq](_ast_.expression.md#eq)
* [gt](_ast_.expression.md#gt)
* [gte](_ast_.expression.md#gte)
* [in](_ast_.expression.md#in)
* [isNotNull](_ast_.expression.md#isnotnull)
* [isNull](_ast_.expression.md#isnull)
* [like](_ast_.expression.md#like)
* [lt](_ast_.expression.md#lt)
* [lte](_ast_.expression.md#lte)
* [mod](_ast_.expression.md#mod)
* [mul](_ast_.expression.md#mul)
* [neq](_ast_.expression.md#neq)
* [not](_ast_.expression.md#not)
* [notIn](_ast_.expression.md#notin)
* [notLike](_ast_.expression.md#notlike)
* [notNull](_ast_.expression.md#notnull)
* [or](_ast_.expression.md#or)
* [shl](_ast_.expression.md#shl)
* [shr](_ast_.expression.md#shr)
* [sub](_ast_.expression.md#sub)
* [xor](_ast_.expression.md#xor)
* [add](_ast_.expression.md#static-add)
* [alias](_ast_.expression.md#static-alias)
* [and](_ast_.expression.md#static-and)
* [any](_ast_.expression.md#static-any)
* [bracket](_ast_.expression.md#static-bracket)
* [const](_ast_.expression.md#static-const)
* [constant](_ast_.expression.md#static-constant)
* [div](_ast_.expression.md#static-div)
* [field](_ast_.expression.md#static-field)
* [identifier](_ast_.expression.md#static-identifier)
* [invoke](_ast_.expression.md#static-invoke)
* [mod](_ast_.expression.md#static-mod)
* [mul](_ast_.expression.md#static-mul)
* [neg](_ast_.expression.md#static-neg)
* [not](_ast_.expression.md#static-not)
* [or](_ast_.expression.md#static-or)
* [proxiedIdentifier](_ast_.expression.md#static-proxiedidentifier)
* [shl](_ast_.expression.md#static-shl)
* [shr](_ast_.expression.md#static-shr)
* [sub](_ast_.expression.md#static-sub)
* [table](_ast_.expression.md#static-table)
* [var](_ast_.expression.md#static-var)
* [variant](_ast_.expression.md#static-variant)
* [xor](_ast_.expression.md#static-xor)

## Constructors

###  constructor

\+ **new Expression**(`type`: [SQL_SYMBOLE](../enums/_constants_.sql_symbole.md)): *[Expression](_ast_.expression.md)*

*Inherited from [AST](_ast_.ast.md).[constructor](_ast_.ast.md#constructor)*

Defined in src/ast.ts:68

**Parameters:**

Name | Type |
------ | ------ |
`type` | [SQL_SYMBOLE](../enums/_constants_.sql_symbole.md) |

**Returns:** *[Expression](_ast_.expression.md)*

## Properties

### `Readonly` type

• **type**: *[SQL_SYMBOLE](../enums/_constants_.sql_symbole.md)*

*Inherited from [AST](_ast_.ast.md).[type](_ast_.ast.md#readonly-type)*

Defined in src/ast.ts:73

## Accessors

###  lvalue

• **get lvalue**(): *boolean*

Defined in src/ast.ts:489

获取当前表达式是否为左值

**Returns:** *boolean*

## Methods

###  add

▸ **add**(`expr`: [UnsureExpression](../modules/_ast_.md#unsureexpression)): *[BinaryCalculate](_ast_.binarycalculate.md)‹›*

Defined in src/ast.ts:256

加法运算

**Parameters:**

Name | Type |
------ | ------ |
`expr` | [UnsureExpression](../modules/_ast_.md#unsureexpression) |

**Returns:** *[BinaryCalculate](_ast_.binarycalculate.md)‹›*

___

###  and

▸ **and**(`expr`: [UnsureExpression](../modules/_ast_.md#unsureexpression)): *[BinaryCalculate](_ast_.binarycalculate.md)‹›*

Defined in src/ast.ts:298

位运算 &

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`expr` | [UnsureExpression](../modules/_ast_.md#unsureexpression) | 要与当前表达式相除的表达式 |

**Returns:** *[BinaryCalculate](_ast_.binarycalculate.md)‹›*

返回运算后的表达式

___

###  as

▸ **as**(`alias`: string): *[ProxiedIdentifier](../modules/_ast_.md#proxiedidentifier)*

Defined in src/ast.ts:480

为当前表达式添加别名

**Parameters:**

Name | Type |
------ | ------ |
`alias` | string |

**Returns:** *[ProxiedIdentifier](../modules/_ast_.md#proxiedidentifier)*

___

###  asc

▸ **asc**(): *[SortInfo](_ast_.sortinfo.md)*

Defined in src/ast.ts:465

正序

**Returns:** *[SortInfo](_ast_.sortinfo.md)*

返回对比条件表达式

___

###  desc

▸ **desc**(): *[SortInfo](_ast_.sortinfo.md)*

Defined in src/ast.ts:473

倒序

**Returns:** *[SortInfo](_ast_.sortinfo.md)*

返回对比条件表达式

___

###  div

▸ **div**(`expr`: [UnsureExpression](../modules/_ast_.md#unsureexpression)): *[BinaryCalculate](_ast_.binarycalculate.md)‹›*

Defined in src/ast.ts:280

除法运算

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`expr` | [UnsureExpression](../modules/_ast_.md#unsureexpression) | 要与当前表达式相除的表达式 |

**Returns:** *[BinaryCalculate](_ast_.binarycalculate.md)‹›*

返回运算后的表达式

___

###  eq

▸ **eq**(`expr`: [UnsureExpression](../modules/_ast_.md#unsureexpression)): *[BinaryCompare](_ast_.binarycompare.md)‹›*

Defined in src/ast.ts:352

比较是否相等 =

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`expr` | [UnsureExpression](../modules/_ast_.md#unsureexpression) | 要与当前表达式相比较的表达式 |

**Returns:** *[BinaryCompare](_ast_.binarycompare.md)‹›*

返回对比条件表达式

___

###  gt

▸ **gt**(`expr`: [UnsureExpression](../modules/_ast_.md#unsureexpression)): *[BinaryCompare](_ast_.binarycompare.md)‹›*

Defined in src/ast.ts:388

比较是否大于 >

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`expr` | [UnsureExpression](../modules/_ast_.md#unsureexpression) | 要与当前表达式相比较的表达式 |

**Returns:** *[BinaryCompare](_ast_.binarycompare.md)‹›*

返回对比条件表达式

___

###  gte

▸ **gte**(`expr`: [UnsureExpression](../modules/_ast_.md#unsureexpression)): *[BinaryCompare](_ast_.binarycompare.md)‹›*

Defined in src/ast.ts:397

比较是否小于等于 >=

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`expr` | [UnsureExpression](../modules/_ast_.md#unsureexpression) | 要与当前表达式相比较的表达式 |

**Returns:** *[BinaryCompare](_ast_.binarycompare.md)‹›*

返回对比条件表达式

___

###  in

▸ **in**(...`values`: [UnsureExpression](../modules/_ast_.md#unsureexpression)[]): *[BinaryCompare](_ast_.binarycompare.md)‹›*

Defined in src/ast.ts:424

比较是否不包含于 IN

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`...values` | [UnsureExpression](../modules/_ast_.md#unsureexpression)[] | 要与当前表达式相比较的表达式数组 |

**Returns:** *[BinaryCompare](_ast_.binarycompare.md)‹›*

返回对比条件表达式

___

###  isNotNull

▸ **isNotNull**(): *[IsNotNullCondition](_ast_.isnotnullcondition.md)‹›*

Defined in src/ast.ts:449

比较是否为空 IS NOT NULL

**Returns:** *[IsNotNullCondition](_ast_.isnotnullcondition.md)‹›*

返回对比条件表达式

___

###  isNull

▸ **isNull**(): *[IsNullCondition](_ast_.isnullcondition.md)‹›*

Defined in src/ast.ts:441

比较是否为空 IS NULL

**Returns:** *[IsNullCondition](_ast_.isnullcondition.md)‹›*

返回对比条件表达式

___

###  like

▸ **like**(`expr`: [UnsureExpression](../modules/_ast_.md#unsureexpression)): *[BinaryCompare](_ast_.binarycompare.md)‹›*

Defined in src/ast.ts:406

比较是相像 LIKE

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`expr` | [UnsureExpression](../modules/_ast_.md#unsureexpression) | 要与当前表达式相比较的表达式 |

**Returns:** *[BinaryCompare](_ast_.binarycompare.md)‹›*

返回对比条件表达式

___

###  lt

▸ **lt**(`expr`: [UnsureExpression](../modules/_ast_.md#unsureexpression)): *[BinaryCompare](_ast_.binarycompare.md)‹›*

Defined in src/ast.ts:370

比较是否小于 <

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`expr` | [UnsureExpression](../modules/_ast_.md#unsureexpression) | 要与当前表达式相比较的表达式 |

**Returns:** *[BinaryCompare](_ast_.binarycompare.md)‹›*

返回对比条件表达式

___

###  lte

▸ **lte**(`expr`: [UnsureExpression](../modules/_ast_.md#unsureexpression)): *[BinaryCompare](_ast_.binarycompare.md)‹›*

Defined in src/ast.ts:379

比较是否小于等于 <=

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`expr` | [UnsureExpression](../modules/_ast_.md#unsureexpression) | 要与当前表达式相比较的表达式 |

**Returns:** *[BinaryCompare](_ast_.binarycompare.md)‹›*

返回对比条件表达式

___

###  mod

▸ **mod**(`expr`: [UnsureExpression](../modules/_ast_.md#unsureexpression)): *[BinaryCalculate](_ast_.binarycalculate.md)‹›*

Defined in src/ast.ts:289

算术运算 %

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`expr` | [UnsureExpression](../modules/_ast_.md#unsureexpression) | 要与当前表达式相除的表达式 |

**Returns:** *[BinaryCalculate](_ast_.binarycalculate.md)‹›*

返回运算后的表达式

___

###  mul

▸ **mul**(`expr`: [UnsureExpression](../modules/_ast_.md#unsureexpression)): *[BinaryCalculate](_ast_.binarycalculate.md)‹›*

Defined in src/ast.ts:271

乘法运算

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`expr` | [UnsureExpression](../modules/_ast_.md#unsureexpression) | 要与当前表达式相乘的表达式  |

**Returns:** *[BinaryCalculate](_ast_.binarycalculate.md)‹›*

___

###  neq

▸ **neq**(`expr`: [UnsureExpression](../modules/_ast_.md#unsureexpression)): *[BinaryCompare](_ast_.binarycompare.md)‹›*

Defined in src/ast.ts:361

比较是否不等于 <>

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`expr` | [UnsureExpression](../modules/_ast_.md#unsureexpression) | 要与当前表达式相比较的表达式 |

**Returns:** *[BinaryCompare](_ast_.binarycompare.md)‹›*

返回对比条件表达式

___

###  not

▸ **not**(`expr`: [UnsureExpression](../modules/_ast_.md#unsureexpression)): *[BinaryCalculate](_ast_.binarycalculate.md)‹›*

Defined in src/ast.ts:316

位运算 ~

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`expr` | [UnsureExpression](../modules/_ast_.md#unsureexpression) | 要与当前表达式相除的表达式 |

**Returns:** *[BinaryCalculate](_ast_.binarycalculate.md)‹›*

返回运算后的表达式

___

###  notIn

▸ **notIn**(...`values`: [UnsureExpression](../modules/_ast_.md#unsureexpression)[]): *[BinaryCompare](_ast_.binarycompare.md)‹›*

Defined in src/ast.ts:433

比较是否不包含于 NOT IN

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`...values` | [UnsureExpression](../modules/_ast_.md#unsureexpression)[] | 要与当前表达式相比较的表达式 |

**Returns:** *[BinaryCompare](_ast_.binarycompare.md)‹›*

返回对比条件表达式

___

###  notLike

▸ **notLike**(`expr`: [UnsureExpression](../modules/_ast_.md#unsureexpression)): *[BinaryCompare](_ast_.binarycompare.md)‹›*

Defined in src/ast.ts:415

比较是否不想像 NOT LIKE

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`expr` | [UnsureExpression](../modules/_ast_.md#unsureexpression) | 要与当前表达式相比较的表达式 |

**Returns:** *[BinaryCompare](_ast_.binarycompare.md)‹›*

返回对比条件表达式

___

###  notNull

▸ **notNull**(): *[IsNotNullCondition](_ast_.isnotnullcondition.md)‹›*

Defined in src/ast.ts:457

isNotNull 的简称别名

**Returns:** *[IsNotNullCondition](_ast_.isnotnullcondition.md)‹›*

返回对比条件表达式

___

###  or

▸ **or**(`expr`: [UnsureExpression](../modules/_ast_.md#unsureexpression)): *[BinaryCalculate](_ast_.binarycalculate.md)‹›*

Defined in src/ast.ts:307

位运算 |

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`expr` | [UnsureExpression](../modules/_ast_.md#unsureexpression) | 要与当前表达式相除的表达式 |

**Returns:** *[BinaryCalculate](_ast_.binarycalculate.md)‹›*

返回运算后的表达式

___

###  shl

▸ **shl**(`expr`: [UnsureExpression](../modules/_ast_.md#unsureexpression)): *[BinaryCalculate](_ast_.binarycalculate.md)‹›*

Defined in src/ast.ts:334

位运算 <<

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`expr` | [UnsureExpression](../modules/_ast_.md#unsureexpression) | 要与当前表达式相除的表达式 |

**Returns:** *[BinaryCalculate](_ast_.binarycalculate.md)‹›*

返回运算后的表达式

___

###  shr

▸ **shr**(`expr`: [UnsureExpression](../modules/_ast_.md#unsureexpression)): *[BinaryCalculate](_ast_.binarycalculate.md)‹›*

Defined in src/ast.ts:343

位运算 >>

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`expr` | [UnsureExpression](../modules/_ast_.md#unsureexpression) | 要与当前表达式相除的表达式 |

**Returns:** *[BinaryCalculate](_ast_.binarycalculate.md)‹›*

返回运算后的表达式

___

###  sub

▸ **sub**(`expr`: [UnsureExpression](../modules/_ast_.md#unsureexpression)): *[BinaryCalculate](_ast_.binarycalculate.md)‹›*

Defined in src/ast.ts:263

减法运算

**Parameters:**

Name | Type |
------ | ------ |
`expr` | [UnsureExpression](../modules/_ast_.md#unsureexpression) |

**Returns:** *[BinaryCalculate](_ast_.binarycalculate.md)‹›*

___

###  xor

▸ **xor**(`expr`: [UnsureExpression](../modules/_ast_.md#unsureexpression)): *[BinaryCalculate](_ast_.binarycalculate.md)‹›*

Defined in src/ast.ts:325

位运算 ^

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`expr` | [UnsureExpression](../modules/_ast_.md#unsureexpression) | 要与当前表达式相除的表达式 |

**Returns:** *[BinaryCalculate](_ast_.binarycalculate.md)‹›*

返回运算后的表达式

___

### `Static` add

▸ **add**(`left`: [UnsureExpression](../modules/_ast_.md#unsureexpression), `right`: [UnsureExpression](../modules/_ast_.md#unsureexpression)): *[BinaryCalculate](_ast_.binarycalculate.md)‹›*

Defined in src/ast.ts:507

算术运算 +

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`left` | [UnsureExpression](../modules/_ast_.md#unsureexpression) | 左值 |
`right` | [UnsureExpression](../modules/_ast_.md#unsureexpression) | 右值 |

**Returns:** *[BinaryCalculate](_ast_.binarycalculate.md)‹›*

返回算术运算表达式

___

### `Static` alias

▸ **alias**(`expr`: [Expression](_ast_.expression.md), `name`: string): *[Alias](_ast_.alias.md)‹›*

Defined in src/ast.ts:643

**Parameters:**

Name | Type |
------ | ------ |
`expr` | [Expression](_ast_.expression.md) |
`name` | string |

**Returns:** *[Alias](_ast_.alias.md)‹›*

___

### `Static` and

▸ **and**(`left`: [UnsureExpression](../modules/_ast_.md#unsureexpression), `right`: [UnsureExpression](../modules/_ast_.md#unsureexpression)): *[BinaryCalculate](_ast_.binarycalculate.md)‹›*

Defined in src/ast.ts:557

位算术运算 &

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`left` | [UnsureExpression](../modules/_ast_.md#unsureexpression) | 左值 |
`right` | [UnsureExpression](../modules/_ast_.md#unsureexpression) | 右值 |

**Returns:** *[BinaryCalculate](_ast_.binarycalculate.md)‹›*

返回算术运算表达式

___

### `Static` any

▸ **any**(`parent?`: [UnsureIdentifier](../modules/_ast_.md#unsureidentifier)): *[Identifier](_ast_.identifier.md)‹›*

Defined in src/ast.ts:651

任意字段 *

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`parent?` | [UnsureIdentifier](../modules/_ast_.md#unsureidentifier) | parent identifier  |

**Returns:** *[Identifier](_ast_.identifier.md)‹›*

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

### `Static` const

▸ **const**(`value`: [JsConstant](../modules/_ast_.md#jsconstant)): *[Constant](_ast_.constant.md)‹›*

Defined in src/ast.ts:623

常量，constant 的别名

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`value` | [JsConstant](../modules/_ast_.md#jsconstant) | 常量值  |

**Returns:** *[Constant](_ast_.constant.md)‹›*

___

### `Static` constant

▸ **constant**(`value`: [JsConstant](../modules/_ast_.md#jsconstant)): *[Constant](_ast_.constant.md)‹›*

Defined in src/ast.ts:615

常量

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`value` | [JsConstant](../modules/_ast_.md#jsconstant) | 常量值  |

**Returns:** *[Constant](_ast_.constant.md)‹›*

___

### `Static` div

▸ **div**(`left`: [UnsureExpression](../modules/_ast_.md#unsureexpression), `right`: [UnsureExpression](../modules/_ast_.md#unsureexpression)): *[BinaryCalculate](_ast_.binarycalculate.md)‹›*

Defined in src/ast.ts:537

算术运算 /

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`left` | [UnsureExpression](../modules/_ast_.md#unsureexpression) | 左值 |
`right` | [UnsureExpression](../modules/_ast_.md#unsureexpression) | 右值 |

**Returns:** *[BinaryCalculate](_ast_.binarycalculate.md)‹›*

返回算术运算表达式

___

### `Static` field

▸ **field**(...`names`: string[]): *[Identifier](_ast_.identifier.md)‹›*

Defined in src/ast.ts:692

字段，实为 identifier(...names) 别名

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`...names` | string[] |   |

**Returns:** *[Identifier](_ast_.identifier.md)‹›*

___

### `Static` identifier

▸ **identifier**(...`names`: string[]): *[Identifier](_ast_.identifier.md)*

Defined in src/ast.ts:658

标识符

**Parameters:**

Name | Type |
------ | ------ |
`...names` | string[] |

**Returns:** *[Identifier](_ast_.identifier.md)*

___

### `Static` invoke

▸ **invoke**(`func`: [UnsureIdentifier](../modules/_ast_.md#unsureidentifier), `params`: string | number | bigint | false | true | [Expression](_ast_.expression.md)‹› | Date | Buffer‹›[]): *[Invoke](_ast_.invoke.md)‹›*

Defined in src/ast.ts:701

调用表达式

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`func` | [UnsureIdentifier](../modules/_ast_.md#unsureidentifier) | 函数 |
`params` | string &#124; number &#124; bigint &#124; false &#124; true &#124; [Expression](_ast_.expression.md)‹› &#124; Date &#124; Buffer‹›[] | 参数  |

**Returns:** *[Invoke](_ast_.invoke.md)‹›*

___

### `Static` mod

▸ **mod**(`left`: [UnsureExpression](../modules/_ast_.md#unsureexpression), `right`: [UnsureExpression](../modules/_ast_.md#unsureexpression)): *[BinaryCalculate](_ast_.binarycalculate.md)‹›*

Defined in src/ast.ts:547

算术运算 %

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`left` | [UnsureExpression](../modules/_ast_.md#unsureexpression) | 左值 |
`right` | [UnsureExpression](../modules/_ast_.md#unsureexpression) | 右值 |

**Returns:** *[BinaryCalculate](_ast_.binarycalculate.md)‹›*

返回算术运算表达式

___

### `Static` mul

▸ **mul**(`left`: [UnsureExpression](../modules/_ast_.md#unsureexpression), `right`: [UnsureExpression](../modules/_ast_.md#unsureexpression)): *[BinaryCalculate](_ast_.binarycalculate.md)‹›*

Defined in src/ast.ts:527

算术运算 *

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`left` | [UnsureExpression](../modules/_ast_.md#unsureexpression) | 左值 |
`right` | [UnsureExpression](../modules/_ast_.md#unsureexpression) | 右值 |

**Returns:** *[BinaryCalculate](_ast_.binarycalculate.md)‹›*

返回算术运算表达式

___

### `Static` neg

▸ **neg**(`expr`: [UnsureExpression](../modules/_ast_.md#unsureexpression)): *[UnaryCalculate](_ast_.unarycalculate.md)‹›*

Defined in src/ast.ts:497

算术运算 +

**Parameters:**

Name | Type |
------ | ------ |
`expr` | [UnsureExpression](../modules/_ast_.md#unsureexpression) |

**Returns:** *[UnaryCalculate](_ast_.unarycalculate.md)‹›*

返回算术运算表达式

___

### `Static` not

▸ **not**(`left`: [UnsureExpression](../modules/_ast_.md#unsureexpression), `right`: [UnsureExpression](../modules/_ast_.md#unsureexpression)): *[BinaryCalculate](_ast_.binarycalculate.md)‹›*

Defined in src/ast.ts:587

位算术运算 ~

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`left` | [UnsureExpression](../modules/_ast_.md#unsureexpression) | 左值 |
`right` | [UnsureExpression](../modules/_ast_.md#unsureexpression) | 右值 |

**Returns:** *[BinaryCalculate](_ast_.binarycalculate.md)‹›*

返回算术运算表达式

___

### `Static` or

▸ **or**(`left`: [UnsureExpression](../modules/_ast_.md#unsureexpression), `right`: [UnsureExpression](../modules/_ast_.md#unsureexpression)): *[BinaryCalculate](_ast_.binarycalculate.md)‹›*

Defined in src/ast.ts:567

位算术运算 |

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`left` | [UnsureExpression](../modules/_ast_.md#unsureexpression) | 左值 |
`right` | [UnsureExpression](../modules/_ast_.md#unsureexpression) | 右值 |

**Returns:** *[BinaryCalculate](_ast_.binarycalculate.md)‹›*

返回算术运算表达式

___

### `Static` proxiedIdentifier

▸ **proxiedIdentifier**(`name`: [UnsureIdentifier](../modules/_ast_.md#unsureidentifier)): *[Identifier](_ast_.identifier.md)‹› & object*

Defined in src/ast.ts:676

代理化的identifier，可以自动接受字段名

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`name` | [UnsureIdentifier](../modules/_ast_.md#unsureidentifier) |   |

**Returns:** *[Identifier](_ast_.identifier.md)‹› & object*

___

### `Static` shl

▸ **shl**(`left`: [UnsureExpression](../modules/_ast_.md#unsureexpression), `right`: [UnsureExpression](../modules/_ast_.md#unsureexpression)): *[BinaryCalculate](_ast_.binarycalculate.md)‹›*

Defined in src/ast.ts:597

位算术运算 <<

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`left` | [UnsureExpression](../modules/_ast_.md#unsureexpression) | 左值 |
`right` | [UnsureExpression](../modules/_ast_.md#unsureexpression) | 右值 |

**Returns:** *[BinaryCalculate](_ast_.binarycalculate.md)‹›*

返回算术运算表达式

___

### `Static` shr

▸ **shr**(`left`: [UnsureExpression](../modules/_ast_.md#unsureexpression), `right`: [UnsureExpression](../modules/_ast_.md#unsureexpression)): *[BinaryCalculate](_ast_.binarycalculate.md)‹›*

Defined in src/ast.ts:607

位算术运算 >>

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`left` | [UnsureExpression](../modules/_ast_.md#unsureexpression) | 左值 |
`right` | [UnsureExpression](../modules/_ast_.md#unsureexpression) | 右值 |

**Returns:** *[BinaryCalculate](_ast_.binarycalculate.md)‹›*

返回算术运算表达式

___

### `Static` sub

▸ **sub**(`left`: [UnsureExpression](../modules/_ast_.md#unsureexpression), `right`: [UnsureExpression](../modules/_ast_.md#unsureexpression)): *[BinaryCalculate](_ast_.binarycalculate.md)‹›*

Defined in src/ast.ts:517

算术运算 -

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`left` | [UnsureExpression](../modules/_ast_.md#unsureexpression) | 左值 |
`right` | [UnsureExpression](../modules/_ast_.md#unsureexpression) | 右值 |

**Returns:** *[BinaryCalculate](_ast_.binarycalculate.md)‹›*

返回算术运算表达式

___

### `Static` table

▸ **table**(...`names`: string[]): *[Identifier](_ast_.identifier.md)‹› & object*

Defined in src/ast.ts:684

创建表对象，该对象是可代理的，可以直接以 . 运算符获取下一节点Identifier

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`...names` | string[] |   |

**Returns:** *[Identifier](_ast_.identifier.md)‹› & object*

___

### `Static` var

▸ **var**(`name`: string): *[Variant](_ast_.variant.md)‹›*

Defined in src/ast.ts:639

变量，variant的别名

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`name` | string | 变量名，不需要带前缀  |

**Returns:** *[Variant](_ast_.variant.md)‹›*

___

### `Static` variant

▸ **variant**(`name`: string): *[Variant](_ast_.variant.md)‹›*

Defined in src/ast.ts:631

变量

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`name` | string | 变量名称，不需要带前缀  |

**Returns:** *[Variant](_ast_.variant.md)‹›*

___

### `Static` xor

▸ **xor**(`left`: [UnsureExpression](../modules/_ast_.md#unsureexpression), `right`: [UnsureExpression](../modules/_ast_.md#unsureexpression)): *[BinaryCalculate](_ast_.binarycalculate.md)‹›*

Defined in src/ast.ts:577

位算术运算 ^

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`left` | [UnsureExpression](../modules/_ast_.md#unsureexpression) | 左值 |
`right` | [UnsureExpression](../modules/_ast_.md#unsureexpression) | 右值 |

**Returns:** *[BinaryCalculate](_ast_.binarycalculate.md)‹›*

返回算术运算表达式
