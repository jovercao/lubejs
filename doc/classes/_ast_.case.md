[lubejs](../README.md) › [Globals](../globals.md) › ["ast"](../modules/_ast_.md) › [Case](_ast_.case.md)

# Class: Case ‹**T**›

CASE表达式

## Type parameters

▪ **T**: *[ScalarType](../modules/_types_.md#scalartype)*

## Hierarchy

  ↳ [Expression](_ast_.expression.md)‹T›

  ↳ **Case**

## Index

### Constructors

* [constructor](_ast_.case.md#constructor)

### Properties

* [$default](_ast_.case.md#optional-default)
* [$expr](_ast_.case.md#expr)
* [$type](_ast_.case.md#type)
* [$whens](_ast_.case.md#whens)

### Methods

* [add](_ast_.case.md#add)
* [and](_ast_.case.md#and)
* [as](_ast_.case.md#as)
* [asc](_ast_.case.md#asc)
* [clone](_ast_.case.md#clone)
* [concat](_ast_.case.md#concat)
* [desc](_ast_.case.md#desc)
* [div](_ast_.case.md#div)
* [else](_ast_.case.md#else)
* [enclose](_ast_.case.md#enclose)
* [eq](_ast_.case.md#eq)
* [gt](_ast_.case.md#gt)
* [gte](_ast_.case.md#gte)
* [in](_ast_.case.md#in)
* [isNotNull](_ast_.case.md#isnotnull)
* [isNull](_ast_.case.md#isnull)
* [like](_ast_.case.md#like)
* [lt](_ast_.case.md#lt)
* [lte](_ast_.case.md#lte)
* [mod](_ast_.case.md#mod)
* [mul](_ast_.case.md#mul)
* [neq](_ast_.case.md#neq)
* [not](_ast_.case.md#not)
* [notIn](_ast_.case.md#notin)
* [notLike](_ast_.case.md#notlike)
* [notNull](_ast_.case.md#notnull)
* [or](_ast_.case.md#or)
* [shl](_ast_.case.md#shl)
* [shr](_ast_.case.md#shr)
* [sub](_ast_.case.md#sub)
* [to](_ast_.case.md#to)
* [when](_ast_.case.md#when)
* [xor](_ast_.case.md#xor)
* [add](_ast_.case.md#static-add)
* [and](_ast_.case.md#static-and)
* [concat](_ast_.case.md#static-concat)
* [convert](_ast_.case.md#static-convert)
* [div](_ast_.case.md#static-div)
* [enclose](_ast_.case.md#static-enclose)
* [literal](_ast_.case.md#static-literal)
* [mod](_ast_.case.md#static-mod)
* [mul](_ast_.case.md#static-mul)
* [neg](_ast_.case.md#static-neg)
* [not](_ast_.case.md#static-not)
* [or](_ast_.case.md#static-or)
* [shl](_ast_.case.md#static-shl)
* [shr](_ast_.case.md#static-shr)
* [sub](_ast_.case.md#static-sub)
* [xor](_ast_.case.md#static-xor)

## Constructors

###  constructor

\+ **new Case**(`expr?`: [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹[ScalarType](../modules/_types_.md#scalartype)›): *[Case](_ast_.case.md)*

Defined in ast.ts:3153

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`expr?` | [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹[ScalarType](../modules/_types_.md#scalartype)› |   |

**Returns:** *[Case](_ast_.case.md)*

## Properties

### `Optional` $default

• **$default**? : *[Expression](_ast_.expression.md)‹T›*

Defined in ast.ts:3152

___

###  $expr

• **$expr**: *[Expression](_ast_.expression.md)‹any›*

Defined in ast.ts:3150

___

###  $type

• **$type**: *[CASE](../enums/_constants_.sql_symbole.md#case)* = SQL_SYMBOLE.CASE

*Overrides [Expression](_ast_.expression.md).[$type](_ast_.expression.md#type)*

Defined in ast.ts:3153

___

###  $whens

• **$whens**: *[When](_ast_.when.md)‹T›[]*

Defined in ast.ts:3151

## Methods

###  add

▸ **add**(`expr`: [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹number›): *[Expression](_ast_.expression.md)‹number›*

*Inherited from [Expression](_ast_.expression.md).[add](_ast_.expression.md#add)*

Defined in ast.ts:318

加法运算，返回数值，如果是字符串相加，请使用join函数连接

**Parameters:**

Name | Type |
------ | ------ |
`expr` | [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹number› |

**Returns:** *[Expression](_ast_.expression.md)‹number›*

___

###  and

▸ **and**(`expr`: [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹number›): *[Expression](_ast_.expression.md)‹number›*

*Inherited from [Expression](_ast_.expression.md).[and](_ast_.expression.md#and)*

Defined in ast.ts:360

位运算 &

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`expr` | [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹number› | 要与当前表达式相除的表达式 |

**Returns:** *[Expression](_ast_.expression.md)‹number›*

返回运算后的表达式

___

###  as

▸ **as**‹**N**›(`name`: N): *[SelectColumn](_ast_.selectcolumn.md)‹T, N›*

*Inherited from [Expression](_ast_.expression.md).[as](_ast_.expression.md#as)*

Defined in ast.ts:556

将表达式转换为列，并指定列名

**Type parameters:**

▪ **N**: *string*

**Parameters:**

Name | Type |
------ | ------ |
`name` | N |

**Returns:** *[SelectColumn](_ast_.selectcolumn.md)‹T, N›*

___

###  asc

▸ **asc**(): *[SortInfo](_ast_.sortinfo.md)*

*Inherited from [Expression](_ast_.expression.md).[asc](_ast_.expression.md#asc)*

Defined in ast.ts:541

正序

**Returns:** *[SortInfo](_ast_.sortinfo.md)*

返回对比条件表达式

___

###  clone

▸ **clone**(): *this*

*Inherited from [AST](_ast_.ast.md).[clone](_ast_.ast.md#clone)*

Defined in ast.ts:285

克隆自身

**Returns:** *this*

___

###  concat

▸ **concat**(`expr`: [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹string›): *[Expression](_ast_.expression.md)‹string›*

*Inherited from [Expression](_ast_.expression.md).[concat](_ast_.expression.md#concat)*

Defined in ast.ts:311

字符串连接运算

**Parameters:**

Name | Type |
------ | ------ |
`expr` | [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹string› |

**Returns:** *[Expression](_ast_.expression.md)‹string›*

___

###  desc

▸ **desc**(): *[SortInfo](_ast_.sortinfo.md)*

*Inherited from [Expression](_ast_.expression.md).[desc](_ast_.expression.md#desc)*

Defined in ast.ts:549

倒序

**Returns:** *[SortInfo](_ast_.sortinfo.md)*

返回对比条件表达式

___

###  div

▸ **div**(`expr`: [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹number›): *[Expression](_ast_.expression.md)‹number›*

*Inherited from [Expression](_ast_.expression.md).[div](_ast_.expression.md#div)*

Defined in ast.ts:342

除法运算

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`expr` | [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹number› | 要与当前表达式相除的表达式 |

**Returns:** *[Expression](_ast_.expression.md)‹number›*

返回运算后的表达式

___

###  else

▸ **else**(`defaults`: [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹T›): *this*

Defined in ast.ts:3174

ELSE语句

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`defaults` | [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹T› |   |

**Returns:** *this*

___

###  enclose

▸ **enclose**(): *[Expression](_ast_.expression.md)‹T›*

*Inherited from [Expression](_ast_.expression.md).[enclose](_ast_.expression.md#enclose)*

Defined in ast.ts:563

将本表达式括起来

**Returns:** *[Expression](_ast_.expression.md)‹T›*

___

###  eq

▸ **eq**(`expr`: [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹T›): *[Condition](_ast_.condition.md)*

*Inherited from [Expression](_ast_.expression.md).[eq](_ast_.expression.md#eq)*

Defined in ast.ts:414

比较是否相等 =

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`expr` | [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹T› | 要与当前表达式相比较的表达式 |

**Returns:** *[Condition](_ast_.condition.md)*

返回对比条件表达式

___

###  gt

▸ **gt**(`expr`: [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹T›): *[Condition](_ast_.condition.md)*

*Inherited from [Expression](_ast_.expression.md).[gt](_ast_.expression.md#gt)*

Defined in ast.ts:450

比较是否大于 >

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`expr` | [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹T› | 要与当前表达式相比较的表达式 |

**Returns:** *[Condition](_ast_.condition.md)*

返回对比条件表达式

___

###  gte

▸ **gte**(`expr`: [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹T›): *[Condition](_ast_.condition.md)*

*Inherited from [Expression](_ast_.expression.md).[gte](_ast_.expression.md#gte)*

Defined in ast.ts:459

比较是否小于等于 >=

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`expr` | [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹T› | 要与当前表达式相比较的表达式 |

**Returns:** *[Condition](_ast_.condition.md)*

返回对比条件表达式

___

###  in

▸ **in**(`select`: [Select](_ast_.select.md)‹any›): *[Condition](_ast_.condition.md)*

*Inherited from [Expression](_ast_.expression.md).[in](_ast_.expression.md#in)*

Defined in ast.ts:486

比较是否不包含于 IN

**Parameters:**

Name | Type |
------ | ------ |
`select` | [Select](_ast_.select.md)‹any› |

**Returns:** *[Condition](_ast_.condition.md)*

返回对比条件表达式

▸ **in**(`values`: [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹T›[]): *[Condition](_ast_.condition.md)*

*Inherited from [Expression](_ast_.expression.md).[in](_ast_.expression.md#in)*

Defined in ast.ts:487

**Parameters:**

Name | Type |
------ | ------ |
`values` | [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹T›[] |

**Returns:** *[Condition](_ast_.condition.md)*

▸ **in**(...`values`: [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹T›[]): *[Condition](_ast_.condition.md)*

*Inherited from [Expression](_ast_.expression.md).[in](_ast_.expression.md#in)*

Defined in ast.ts:488

**Parameters:**

Name | Type |
------ | ------ |
`...values` | [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹T›[] |

**Returns:** *[Condition](_ast_.condition.md)*

___

###  isNotNull

▸ **isNotNull**(): *[Condition](_ast_.condition.md)*

*Inherited from [Expression](_ast_.expression.md).[isNotNull](_ast_.expression.md#isnotnull)*

Defined in ast.ts:525

比较是否为空 IS NOT NULL

**Returns:** *[Condition](_ast_.condition.md)*

返回对比条件表达式

___

###  isNull

▸ **isNull**(): *[Condition](_ast_.condition.md)*

*Inherited from [Expression](_ast_.expression.md).[isNull](_ast_.expression.md#isnull)*

Defined in ast.ts:517

比较是否为空 IS NULL

**Returns:** *[Condition](_ast_.condition.md)*

返回对比条件表达式

___

###  like

▸ **like**(`expr`: [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹string›): *[Condition](_ast_.condition.md)*

*Inherited from [Expression](_ast_.expression.md).[like](_ast_.expression.md#like)*

Defined in ast.ts:468

比较是相像 LIKE

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`expr` | [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹string› | 要与当前表达式相比较的表达式 |

**Returns:** *[Condition](_ast_.condition.md)*

返回对比条件表达式

___

###  lt

▸ **lt**(`expr`: [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹T›): *[Condition](_ast_.condition.md)*

*Inherited from [Expression](_ast_.expression.md).[lt](_ast_.expression.md#lt)*

Defined in ast.ts:432

比较是否小于 <

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`expr` | [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹T› | 要与当前表达式相比较的表达式 |

**Returns:** *[Condition](_ast_.condition.md)*

返回对比条件表达式

___

###  lte

▸ **lte**(`expr`: [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹T›): *[Condition](_ast_.condition.md)*

*Inherited from [Expression](_ast_.expression.md).[lte](_ast_.expression.md#lte)*

Defined in ast.ts:441

比较是否小于等于 <=

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`expr` | [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹T› | 要与当前表达式相比较的表达式 |

**Returns:** *[Condition](_ast_.condition.md)*

返回对比条件表达式

___

###  mod

▸ **mod**(`expr`: [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹number›): *[Expression](_ast_.expression.md)‹number›*

*Inherited from [Expression](_ast_.expression.md).[mod](_ast_.expression.md#mod)*

Defined in ast.ts:351

算术运算 %

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`expr` | [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹number› | 要与当前表达式相除的表达式 |

**Returns:** *[Expression](_ast_.expression.md)‹number›*

返回运算后的表达式

___

###  mul

▸ **mul**(`expr`: [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹number›): *[Expression](_ast_.expression.md)‹number›*

*Inherited from [Expression](_ast_.expression.md).[mul](_ast_.expression.md#mul)*

Defined in ast.ts:333

乘法运算

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`expr` | [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹number› | 要与当前表达式相乘的表达式  |

**Returns:** *[Expression](_ast_.expression.md)‹number›*

___

###  neq

▸ **neq**(`expr`: [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹T›): *[Condition](_ast_.condition.md)*

*Inherited from [Expression](_ast_.expression.md).[neq](_ast_.expression.md#neq)*

Defined in ast.ts:423

比较是否不等于 <>

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`expr` | [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹T› | 要与当前表达式相比较的表达式 |

**Returns:** *[Condition](_ast_.condition.md)*

返回对比条件表达式

___

###  not

▸ **not**(): *[Expression](_ast_.expression.md)‹number›*

*Inherited from [Expression](_ast_.expression.md).[not](_ast_.expression.md#not)*

Defined in ast.ts:378

位运算 ~

**Returns:** *[Expression](_ast_.expression.md)‹number›*

返回运算后的表达式

___

###  notIn

▸ **notIn**(...`values`: [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹T›[]): *[Condition](_ast_.condition.md)*

*Inherited from [Expression](_ast_.expression.md).[notIn](_ast_.expression.md#notin)*

Defined in ast.ts:509

比较是否不包含于 NOT IN

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`...values` | [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹T›[] | 要与当前表达式相比较的表达式 |

**Returns:** *[Condition](_ast_.condition.md)*

返回对比条件表达式

___

###  notLike

▸ **notLike**(`expr`: [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹string›): *[Condition](_ast_.condition.md)*

*Inherited from [Expression](_ast_.expression.md).[notLike](_ast_.expression.md#notlike)*

Defined in ast.ts:477

比较是否不想像 NOT LIKE

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`expr` | [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹string› | 要与当前表达式相比较的表达式 |

**Returns:** *[Condition](_ast_.condition.md)*

返回对比条件表达式

___

###  notNull

▸ **notNull**(): *[Condition](_ast_.condition.md)*

*Inherited from [Expression](_ast_.expression.md).[notNull](_ast_.expression.md#notnull)*

Defined in ast.ts:533

isNotNull 的简称别名

**Returns:** *[Condition](_ast_.condition.md)*

返回对比条件表达式

___

###  or

▸ **or**(`expr`: [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹number›): *[Expression](_ast_.expression.md)‹number›*

*Inherited from [Expression](_ast_.expression.md).[or](_ast_.expression.md#or)*

Defined in ast.ts:369

位运算 |

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`expr` | [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹number› | 要与当前表达式相除的表达式 |

**Returns:** *[Expression](_ast_.expression.md)‹number›*

返回运算后的表达式

___

###  shl

▸ **shl**(`expr`: [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹number›): *[Expression](_ast_.expression.md)‹number›*

*Inherited from [Expression](_ast_.expression.md).[shl](_ast_.expression.md#shl)*

Defined in ast.ts:396

位运算 <<

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`expr` | [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹number› | 要与当前表达式相除的表达式 |

**Returns:** *[Expression](_ast_.expression.md)‹number›*

返回运算后的表达式

___

###  shr

▸ **shr**(`expr`: [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹number›): *[Expression](_ast_.expression.md)‹number›*

*Inherited from [Expression](_ast_.expression.md).[shr](_ast_.expression.md#shr)*

Defined in ast.ts:405

位运算 >>

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`expr` | [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹number› | 要与当前表达式相除的表达式 |

**Returns:** *[Expression](_ast_.expression.md)‹number›*

返回运算后的表达式

___

###  sub

▸ **sub**(`expr`: [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹number›): *[Expression](_ast_.expression.md)‹number›*

*Inherited from [Expression](_ast_.expression.md).[sub](_ast_.expression.md#sub)*

Defined in ast.ts:325

减法运算

**Parameters:**

Name | Type |
------ | ------ |
`expr` | [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹number› |

**Returns:** *[Expression](_ast_.expression.md)‹number›*

___

###  to

▸ **to**‹**T**›(`type`: T): *[Expression](_ast_.expression.md)‹[DbTypeToTsType](../modules/_types_.md#dbtypetotstype)‹T››*

*Inherited from [Expression](_ast_.expression.md).[to](_ast_.expression.md#to)*

Defined in ast.ts:570

将当前表达式转换为指定的类型

**Type parameters:**

▪ **T**: *[DbType](../modules/_types_.md#dbtype)*

**Parameters:**

Name | Type |
------ | ------ |
`type` | T |

**Returns:** *[Expression](_ast_.expression.md)‹[DbTypeToTsType](../modules/_types_.md#dbtypetotstype)‹T››*

___

###  when

▸ **when**(`expr`: [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹[ScalarType](../modules/_types_.md#scalartype)› | [Condition](_ast_.condition.md), `then`: [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹T›): *this*

Defined in ast.ts:3184

WHEN语句

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`expr` | [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹[ScalarType](../modules/_types_.md#scalartype)› &#124; [Condition](_ast_.condition.md) | - |
`then` | [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹T› |   |

**Returns:** *this*

___

###  xor

▸ **xor**(`expr`: [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹number›): *[Expression](_ast_.expression.md)‹number›*

*Inherited from [Expression](_ast_.expression.md).[xor](_ast_.expression.md#xor)*

Defined in ast.ts:387

位运算 ^

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`expr` | [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹number› | 要与当前表达式相除的表达式 |

**Returns:** *[Expression](_ast_.expression.md)‹number›*

返回运算后的表达式

___

### `Static` add

▸ **add**(`left`: [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹number›, `right`: [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹number›): *[Expression](_ast_.expression.md)‹number›*

*Inherited from [Expression](_ast_.expression.md).[add](_ast_.expression.md#add)*

Defined in ast.ts:609

算术运算 +

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`left` | [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹number› | 左值 |
`right` | [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹number› | 右值 |

**Returns:** *[Expression](_ast_.expression.md)‹number›*

返回算术运算表达式

___

### `Static` and

▸ **and**(`left`: [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹number›, `right`: [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹number›): *[Expression](_ast_.expression.md)‹number›*

*Inherited from [Expression](_ast_.expression.md).[and](_ast_.expression.md#and)*

Defined in ast.ts:674

位算术运算 &

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`left` | [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹number› | 左值 |
`right` | [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹number› | 右值 |

**Returns:** *[Expression](_ast_.expression.md)‹number›*

返回算术运算表达式

___

### `Static` concat

▸ **concat**(`left`: [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹string›, `right`: [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹string›): *[Expression](_ast_.expression.md)‹string›*

*Inherited from [Expression](_ast_.expression.md).[concat](_ast_.expression.md#concat)*

Defined in ast.ts:596

字符串连接运算

**Parameters:**

Name | Type |
------ | ------ |
`left` | [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹string› |
`right` | [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹string› |

**Returns:** *[Expression](_ast_.expression.md)‹string›*

___

### `Static` convert

▸ **convert**‹**T**›(`expr`: [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹[ScalarType](../modules/_types_.md#scalartype)›, `toType`: T): *[Expression](_ast_.expression.md)‹[DbTypeToTsType](../modules/_types_.md#dbtypetotstype)‹T››*

*Inherited from [Expression](_ast_.expression.md).[convert](_ast_.expression.md#static-convert)*

Defined in ast.ts:743

**Type parameters:**

▪ **T**: *[DbType](../modules/_types_.md#dbtype)*

**Parameters:**

Name | Type |
------ | ------ |
`expr` | [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹[ScalarType](../modules/_types_.md#scalartype)› |
`toType` | T |

**Returns:** *[Expression](_ast_.expression.md)‹[DbTypeToTsType](../modules/_types_.md#dbtypetotstype)‹T››*

___

### `Static` div

▸ **div**(`left`: [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹number›, `right`: [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹number›): *[Expression](_ast_.expression.md)‹number›*

*Inherited from [Expression](_ast_.expression.md).[div](_ast_.expression.md#div)*

Defined in ast.ts:648

算术运算 /

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`left` | [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹number› | 左值 |
`right` | [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹number› | 右值 |

**Returns:** *[Expression](_ast_.expression.md)‹number›*

返回算术运算表达式

___

### `Static` enclose

▸ **enclose**‹**T**›(`value`: [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹T›): *[Expression](_ast_.expression.md)‹T›*

*Inherited from [Expression](_ast_.expression.md).[enclose](_ast_.expression.md#enclose)*

Defined in ast.ts:577

括号表达式，将表达式括起来，如优先级

**Type parameters:**

▪ **T**: *[ScalarType](../modules/_types_.md#scalartype)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹T› |

**Returns:** *[Expression](_ast_.expression.md)‹T›*

___

### `Static` literal

▸ **literal**‹**T**›(`value`: T): *[Literal](_ast_.literal.md)‹T›*

*Inherited from [Expression](_ast_.expression.md).[literal](_ast_.expression.md#static-literal)*

Defined in ast.ts:750

**Type parameters:**

▪ **T**: *[ScalarType](../modules/_types_.md#scalartype)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | T |

**Returns:** *[Literal](_ast_.literal.md)‹T›*

___

### `Static` mod

▸ **mod**(`left`: [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹number›, `right`: [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹number›): *[Expression](_ast_.expression.md)‹number›*

*Inherited from [Expression](_ast_.expression.md).[mod](_ast_.expression.md#mod)*

Defined in ast.ts:661

算术运算 %

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`left` | [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹number› | 左值 |
`right` | [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹number› | 右值 |

**Returns:** *[Expression](_ast_.expression.md)‹number›*

返回算术运算表达式

___

### `Static` mul

▸ **mul**(`left`: [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹number›, `right`: [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹number›): *[Expression](_ast_.expression.md)‹number›*

*Inherited from [Expression](_ast_.expression.md).[mul](_ast_.expression.md#mul)*

Defined in ast.ts:635

算术运算 *

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`left` | [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹number› | 左值 |
`right` | [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹number› | 右值 |

**Returns:** *[Expression](_ast_.expression.md)‹number›*

返回算术运算表达式

___

### `Static` neg

▸ **neg**(`expr`: [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹number›): *[Expression](_ast_.expression.md)‹number›*

*Inherited from [Expression](_ast_.expression.md).[neg](_ast_.expression.md#static-neg)*

Defined in ast.ts:589

算术运算 +

**Parameters:**

Name | Type |
------ | ------ |
`expr` | [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹number› |

**Returns:** *[Expression](_ast_.expression.md)‹number›*

返回算术运算表达式

___

### `Static` not

▸ **not**(`value`: [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹number›): *[Expression](_ast_.expression.md)‹number›*

*Inherited from [Expression](_ast_.expression.md).[not](_ast_.expression.md#not)*

Defined in ast.ts:713

位算术运算 ~

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`value` | [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹number› | 左值 |

**Returns:** *[Expression](_ast_.expression.md)‹number›*

返回算术运算表达式

___

### `Static` or

▸ **or**(`left`: [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹number›, `right`: [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹number›): *[Expression](_ast_.expression.md)‹number›*

*Inherited from [Expression](_ast_.expression.md).[or](_ast_.expression.md#or)*

Defined in ast.ts:687

位算术运算 |

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`left` | [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹number› | 左值 |
`right` | [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹number› | 右值 |

**Returns:** *[Expression](_ast_.expression.md)‹number›*

返回算术运算表达式

___

### `Static` shl

▸ **shl**(`left`: [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹number›, `right`: [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹number›): *[Expression](_ast_.expression.md)‹number›*

*Inherited from [Expression](_ast_.expression.md).[shl](_ast_.expression.md#shl)*

Defined in ast.ts:723

位算术运算 <<

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`left` | [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹number› | 左值 |
`right` | [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹number› | 右值 |

**Returns:** *[Expression](_ast_.expression.md)‹number›*

返回算术运算表达式

___

### `Static` shr

▸ **shr**(`left`: [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹number›, `right`: [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹number›): *[Expression](_ast_.expression.md)‹number›*

*Inherited from [Expression](_ast_.expression.md).[shr](_ast_.expression.md#shr)*

Defined in ast.ts:736

位算术运算 >>

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`left` | [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹number› | 左值 |
`right` | [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹number› | 右值 |

**Returns:** *[Expression](_ast_.expression.md)‹number›*

返回算术运算表达式

___

### `Static` sub

▸ **sub**(`left`: [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹number›, `right`: [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹number›): *[Expression](_ast_.expression.md)‹number›*

*Inherited from [Expression](_ast_.expression.md).[sub](_ast_.expression.md#sub)*

Defined in ast.ts:622

算术运算 -

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`left` | [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹number› | 左值 |
`right` | [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹number› | 右值 |

**Returns:** *[Expression](_ast_.expression.md)‹number›*

返回算术运算表达式

___

### `Static` xor

▸ **xor**(`left`: [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹number›, `right`: [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹number›): *[Expression](_ast_.expression.md)‹number›*

*Inherited from [Expression](_ast_.expression.md).[xor](_ast_.expression.md#xor)*

Defined in ast.ts:700

位算术运算 ^

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`left` | [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹number› | 左值 |
`right` | [CompatibleExpression](../modules/_ast_.md#compatibleexpression)‹number› | 右值 |

**Returns:** *[Expression](_ast_.expression.md)‹number›*

返回算术运算表达式
