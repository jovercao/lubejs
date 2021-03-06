[lubejs](../README.md) › [Globals](../globals.md) › ["ast"](../modules/_ast_.md) › [Alias](_ast_.alias.md)

# Class: Alias

别名表达式

## Hierarchy

  ↳ [Identifier](_ast_.identifier.md)

  ↳ **Alias**

## Index

### Constructors

* [constructor](_ast_.alias.md#constructor)

### Properties

* [expr](_ast_.alias.md#readonly-expr)
* [name](_ast_.alias.md#readonly-name)
* [parent](_ast_.alias.md#optional-readonly-parent)
* [type](_ast_.alias.md#readonly-type)

### Accessors

* [lvalue](_ast_.alias.md#lvalue)

### Methods

* [add](_ast_.alias.md#add)
* [and](_ast_.alias.md#and)
* [any](_ast_.alias.md#any)
* [as](_ast_.alias.md#as)
* [asc](_ast_.alias.md#asc)
* [desc](_ast_.alias.md#desc)
* [div](_ast_.alias.md#div)
* [dot](_ast_.alias.md#dot)
* [eq](_ast_.alias.md#eq)
* [gt](_ast_.alias.md#gt)
* [gte](_ast_.alias.md#gte)
* [in](_ast_.alias.md#in)
* [invoke](_ast_.alias.md#invoke)
* [isNotNull](_ast_.alias.md#isnotnull)
* [isNull](_ast_.alias.md#isnull)
* [like](_ast_.alias.md#like)
* [lt](_ast_.alias.md#lt)
* [lte](_ast_.alias.md#lte)
* [mod](_ast_.alias.md#mod)
* [mul](_ast_.alias.md#mul)
* [neq](_ast_.alias.md#neq)
* [not](_ast_.alias.md#not)
* [notIn](_ast_.alias.md#notin)
* [notLike](_ast_.alias.md#notlike)
* [notNull](_ast_.alias.md#notnull)
* [or](_ast_.alias.md#or)
* [shl](_ast_.alias.md#shl)
* [shr](_ast_.alias.md#shr)
* [sub](_ast_.alias.md#sub)
* [xor](_ast_.alias.md#xor)
* [add](_ast_.alias.md#static-add)
* [alias](_ast_.alias.md#static-alias)
* [and](_ast_.alias.md#static-and)
* [any](_ast_.alias.md#static-any)
* [bracket](_ast_.alias.md#static-bracket)
* [buildIn](_ast_.alias.md#static-buildin)
* [const](_ast_.alias.md#static-const)
* [constant](_ast_.alias.md#static-constant)
* [div](_ast_.alias.md#static-div)
* [field](_ast_.alias.md#static-field)
* [identifier](_ast_.alias.md#static-identifier)
* [invoke](_ast_.alias.md#static-invoke)
* [mod](_ast_.alias.md#static-mod)
* [mul](_ast_.alias.md#static-mul)
* [neg](_ast_.alias.md#static-neg)
* [normal](_ast_.alias.md#static-normal)
* [not](_ast_.alias.md#static-not)
* [or](_ast_.alias.md#static-or)
* [proxiedIdentifier](_ast_.alias.md#static-proxiedidentifier)
* [shl](_ast_.alias.md#static-shl)
* [shr](_ast_.alias.md#static-shr)
* [sub](_ast_.alias.md#static-sub)
* [table](_ast_.alias.md#static-table)
* [var](_ast_.alias.md#static-var)
* [variant](_ast_.alias.md#static-variant)
* [xor](_ast_.alias.md#static-xor)

## Constructors

###  constructor

\+ **new Alias**(`expr`: [UnsureExpression](../modules/_ast_.md#unsureexpression), `name`: string): *[Alias](_ast_.alias.md)*

*Overrides [Identifier](_ast_.identifier.md).[constructor](_ast_.identifier.md#protected-constructor)*

Defined in src/ast.ts:1258

别名构造函数

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`expr` | [UnsureExpression](../modules/_ast_.md#unsureexpression) | 表达式或表名 |
`name` | string | 别名  |

**Returns:** *[Alias](_ast_.alias.md)*

## Properties

### `Readonly` expr

• **expr**: *[Expression](_ast_.expression.md)*

Defined in src/ast.ts:1258

表达式

___

### `Readonly` name

• **name**: *string*

*Inherited from [Identifier](_ast_.identifier.md).[name](_ast_.identifier.md#readonly-name)*

Defined in src/ast.ts:1176

___

### `Optional` `Readonly` parent

• **parent**? : *[Identifier](_ast_.identifier.md)*

*Inherited from [Identifier](_ast_.identifier.md).[parent](_ast_.identifier.md#optional-readonly-parent)*

Defined in src/ast.ts:1177

___

### `Readonly` type

• **type**: *[SQL_SYMBOLE](../enums/_constants_.sql_symbole.md)*

*Inherited from [AST](_ast_.ast.md).[type](_ast_.ast.md#readonly-type)*

Defined in src/ast.ts:73

## Accessors

###  lvalue

• **get lvalue**(): *boolean*

*Inherited from [Identifier](_ast_.identifier.md).[lvalue](_ast_.identifier.md#lvalue)*

*Overrides [Expression](_ast_.expression.md).[lvalue](_ast_.expression.md#lvalue)*

Defined in src/ast.ts:1192

**Returns:** *boolean*

## Methods

###  add

▸ **add**(`expr`: [UnsureExpression](../modules/_ast_.md#unsureexpression)): *[BinaryCalculate](_ast_.binarycalculate.md)‹›*

*Inherited from [Expression](_ast_.expression.md).[add](_ast_.expression.md#add)*

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

*Inherited from [Expression](_ast_.expression.md).[and](_ast_.expression.md#and)*

Defined in src/ast.ts:298

位运算 &

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`expr` | [UnsureExpression](../modules/_ast_.md#unsureexpression) | 要与当前表达式相除的表达式 |

**Returns:** *[BinaryCalculate](_ast_.binarycalculate.md)‹›*

返回运算后的表达式

___

###  any

▸ **any**(): *[Identifier](_ast_.identifier.md)‹›*

*Inherited from [Identifier](_ast_.identifier.md).[any](_ast_.identifier.md#any)*

Defined in src/ast.ts:1204

**Returns:** *[Identifier](_ast_.identifier.md)‹›*

___

###  as

▸ **as**(`alias`: string): *[ProxiedIdentifier](../modules/_ast_.md#proxiedidentifier)*

*Inherited from [Expression](_ast_.expression.md).[as](_ast_.expression.md#as)*

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

*Inherited from [Expression](_ast_.expression.md).[asc](_ast_.expression.md#asc)*

Defined in src/ast.ts:465

正序

**Returns:** *[SortInfo](_ast_.sortinfo.md)*

返回对比条件表达式

___

###  desc

▸ **desc**(): *[SortInfo](_ast_.sortinfo.md)*

*Inherited from [Expression](_ast_.expression.md).[desc](_ast_.expression.md#desc)*

Defined in src/ast.ts:473

倒序

**Returns:** *[SortInfo](_ast_.sortinfo.md)*

返回对比条件表达式

___

###  div

▸ **div**(`expr`: [UnsureExpression](../modules/_ast_.md#unsureexpression)): *[BinaryCalculate](_ast_.binarycalculate.md)‹›*

*Inherited from [Expression](_ast_.expression.md).[div](_ast_.expression.md#div)*

Defined in src/ast.ts:280

除法运算

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`expr` | [UnsureExpression](../modules/_ast_.md#unsureexpression) | 要与当前表达式相除的表达式 |

**Returns:** *[BinaryCalculate](_ast_.binarycalculate.md)‹›*

返回运算后的表达式

___

###  dot

▸ **dot**(`name`: string): *[Identifier](_ast_.identifier.md)‹› & object*

*Inherited from [Identifier](_ast_.identifier.md).[dot](_ast_.identifier.md#dot)*

Defined in src/ast.ts:1200

访问下一节点

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`name` | string |   |

**Returns:** *[Identifier](_ast_.identifier.md)‹› & object*

___

###  eq

▸ **eq**(`expr`: [UnsureExpression](../modules/_ast_.md#unsureexpression)): *[BinaryCompare](_ast_.binarycompare.md)‹›*

*Inherited from [Expression](_ast_.expression.md).[eq](_ast_.expression.md#eq)*

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

*Inherited from [Expression](_ast_.expression.md).[gt](_ast_.expression.md#gt)*

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

*Inherited from [Expression](_ast_.expression.md).[gte](_ast_.expression.md#gte)*

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

*Inherited from [Expression](_ast_.expression.md).[in](_ast_.expression.md#in)*

Defined in src/ast.ts:424

比较是否不包含于 IN

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`...values` | [UnsureExpression](../modules/_ast_.md#unsureexpression)[] | 要与当前表达式相比较的表达式数组 |

**Returns:** *[BinaryCompare](_ast_.binarycompare.md)‹›*

返回对比条件表达式

___

###  invoke

▸ **invoke**(...`params`: string | number | bigint | false | true | [Expression](_ast_.expression.md)‹› | Date | Buffer‹›[]): *[Invoke](_ast_.invoke.md)‹›*

*Inherited from [Identifier](_ast_.identifier.md).[invoke](_ast_.identifier.md#invoke)*

Defined in src/ast.ts:1212

执行一个函数

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`...params` | string &#124; number &#124; bigint &#124; false &#124; true &#124; [Expression](_ast_.expression.md)‹› &#124; Date &#124; Buffer‹›[] |   |

**Returns:** *[Invoke](_ast_.invoke.md)‹›*

___

###  isNotNull

▸ **isNotNull**(): *[IsNotNullCondition](_ast_.isnotnullcondition.md)‹›*

*Inherited from [Expression](_ast_.expression.md).[isNotNull](_ast_.expression.md#isnotnull)*

Defined in src/ast.ts:449

比较是否为空 IS NOT NULL

**Returns:** *[IsNotNullCondition](_ast_.isnotnullcondition.md)‹›*

返回对比条件表达式

___

###  isNull

▸ **isNull**(): *[IsNullCondition](_ast_.isnullcondition.md)‹›*

*Inherited from [Expression](_ast_.expression.md).[isNull](_ast_.expression.md#isnull)*

Defined in src/ast.ts:441

比较是否为空 IS NULL

**Returns:** *[IsNullCondition](_ast_.isnullcondition.md)‹›*

返回对比条件表达式

___

###  like

▸ **like**(`expr`: [UnsureExpression](../modules/_ast_.md#unsureexpression)): *[BinaryCompare](_ast_.binarycompare.md)‹›*

*Inherited from [Expression](_ast_.expression.md).[like](_ast_.expression.md#like)*

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

*Inherited from [Expression](_ast_.expression.md).[lt](_ast_.expression.md#lt)*

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

*Inherited from [Expression](_ast_.expression.md).[lte](_ast_.expression.md#lte)*

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

*Inherited from [Expression](_ast_.expression.md).[mod](_ast_.expression.md#mod)*

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

*Inherited from [Expression](_ast_.expression.md).[mul](_ast_.expression.md#mul)*

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

*Inherited from [Expression](_ast_.expression.md).[neq](_ast_.expression.md#neq)*

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

*Inherited from [Expression](_ast_.expression.md).[not](_ast_.expression.md#not)*

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

*Inherited from [Expression](_ast_.expression.md).[notIn](_ast_.expression.md#notin)*

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

*Inherited from [Expression](_ast_.expression.md).[notLike](_ast_.expression.md#notlike)*

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

*Inherited from [Expression](_ast_.expression.md).[notNull](_ast_.expression.md#notnull)*

Defined in src/ast.ts:457

isNotNull 的简称别名

**Returns:** *[IsNotNullCondition](_ast_.isnotnullcondition.md)‹›*

返回对比条件表达式

___

###  or

▸ **or**(`expr`: [UnsureExpression](../modules/_ast_.md#unsureexpression)): *[BinaryCalculate](_ast_.binarycalculate.md)‹›*

*Inherited from [Expression](_ast_.expression.md).[or](_ast_.expression.md#or)*

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

*Inherited from [Expression](_ast_.expression.md).[shl](_ast_.expression.md#shl)*

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

*Inherited from [Expression](_ast_.expression.md).[shr](_ast_.expression.md#shr)*

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

*Inherited from [Expression](_ast_.expression.md).[sub](_ast_.expression.md#sub)*

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

*Inherited from [Expression](_ast_.expression.md).[xor](_ast_.expression.md#xor)*

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

*Inherited from [Expression](_ast_.expression.md).[add](_ast_.expression.md#add)*

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

*Inherited from [Expression](_ast_.expression.md).[alias](_ast_.expression.md#static-alias)*

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

*Inherited from [Expression](_ast_.expression.md).[and](_ast_.expression.md#and)*

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

*Inherited from [Identifier](_ast_.identifier.md).[any](_ast_.identifier.md#any)*

*Overrides [Expression](_ast_.expression.md).[any](_ast_.expression.md#static-any)*

Defined in src/ast.ts:1233

内建标识符

**Parameters:**

Name | Type |
------ | ------ |
`parent?` | [UnsureIdentifier](../modules/_ast_.md#unsureidentifier) |

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

### `Static` buildIn

▸ **buildIn**(`name`: string): *[Identifier](_ast_.identifier.md)‹›*

*Inherited from [Identifier](_ast_.identifier.md).[buildIn](_ast_.identifier.md#static-buildin)*

Defined in src/ast.ts:1226

内建标识符

**Parameters:**

Name | Type |
------ | ------ |
`name` | string |

**Returns:** *[Identifier](_ast_.identifier.md)‹›*

___

### `Static` const

▸ **const**(`value`: [JsConstant](../modules/_ast_.md#jsconstant)): *[Constant](_ast_.constant.md)‹›*

*Inherited from [Expression](_ast_.expression.md).[const](_ast_.expression.md#static-const)*

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

*Inherited from [Expression](_ast_.expression.md).[constant](_ast_.expression.md#static-constant)*

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

*Inherited from [Expression](_ast_.expression.md).[div](_ast_.expression.md#div)*

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

*Inherited from [Expression](_ast_.expression.md).[field](_ast_.expression.md#static-field)*

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

*Inherited from [Expression](_ast_.expression.md).[identifier](_ast_.expression.md#static-identifier)*

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

*Inherited from [Expression](_ast_.expression.md).[invoke](_ast_.expression.md#static-invoke)*

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

*Inherited from [Expression](_ast_.expression.md).[mod](_ast_.expression.md#mod)*

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

*Inherited from [Expression](_ast_.expression.md).[mul](_ast_.expression.md#mul)*

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

*Inherited from [Expression](_ast_.expression.md).[neg](_ast_.expression.md#static-neg)*

Defined in src/ast.ts:497

算术运算 +

**Parameters:**

Name | Type |
------ | ------ |
`expr` | [UnsureExpression](../modules/_ast_.md#unsureexpression) |

**Returns:** *[UnaryCalculate](_ast_.unarycalculate.md)‹›*

返回算术运算表达式

___

### `Static` normal

▸ **normal**(`name`: string): *[Identifier](_ast_.identifier.md)‹›*

*Inherited from [Identifier](_ast_.identifier.md).[normal](_ast_.identifier.md#static-normal)*

Defined in src/ast.ts:1219

常规标识符

**Parameters:**

Name | Type |
------ | ------ |
`name` | string |

**Returns:** *[Identifier](_ast_.identifier.md)‹›*

___

### `Static` not

▸ **not**(`left`: [UnsureExpression](../modules/_ast_.md#unsureexpression), `right`: [UnsureExpression](../modules/_ast_.md#unsureexpression)): *[BinaryCalculate](_ast_.binarycalculate.md)‹›*

*Inherited from [Expression](_ast_.expression.md).[not](_ast_.expression.md#not)*

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

*Inherited from [Expression](_ast_.expression.md).[or](_ast_.expression.md#or)*

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

*Inherited from [Expression](_ast_.expression.md).[proxiedIdentifier](_ast_.expression.md#static-proxiedidentifier)*

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

*Inherited from [Expression](_ast_.expression.md).[shl](_ast_.expression.md#shl)*

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

*Inherited from [Expression](_ast_.expression.md).[shr](_ast_.expression.md#shr)*

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

*Inherited from [Expression](_ast_.expression.md).[sub](_ast_.expression.md#sub)*

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

*Inherited from [Expression](_ast_.expression.md).[table](_ast_.expression.md#static-table)*

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

*Inherited from [Expression](_ast_.expression.md).[var](_ast_.expression.md#static-var)*

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

*Inherited from [Expression](_ast_.expression.md).[variant](_ast_.expression.md#static-variant)*

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

*Inherited from [Expression](_ast_.expression.md).[xor](_ast_.expression.md#xor)*

Defined in src/ast.ts:577

位算术运算 ^

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`left` | [UnsureExpression](../modules/_ast_.md#unsureexpression) | 左值 |
`right` | [UnsureExpression](../modules/_ast_.md#unsureexpression) | 右值 |

**Returns:** *[BinaryCalculate](_ast_.binarycalculate.md)‹›*

返回算术运算表达式
