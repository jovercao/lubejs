[lubejs](../README.md) › [Globals](../globals.md) › ["util"](_util_.md)

# Module: "util"

## Index

### Functions

* [assert](_util_.md#assert)
* [ensureCondition](_util_.md#ensurecondition)
* [ensureConstant](_util_.md#ensureconstant)
* [ensureGroupValues](_util_.md#ensuregroupvalues)
* [ensureIdentity](_util_.md#ensureidentity)
* [makeProxyIdentity](_util_.md#makeproxyidentity)

## Functions

###  assert

▸ **assert**(`except`: any, `message`: string): *void*

Defined in src/util.ts:20

断言

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`except` | any | 预期结果 |
`message` | string | 错误消息  |

**Returns:** *void*

___

###  ensureCondition

▸ **ensureCondition**(`condition`: [UnsureConditions](_ast_.md#unsureconditions)): *[Condition](../classes/_ast_.condition.md)*

Defined in src/util.ts:55

通过一个对象创建一个对查询条件
亦可理解为：转换managodb的查询条件到 ast

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`condition` | [UnsureConditions](_ast_.md#unsureconditions) | 条件表达式  |

**Returns:** *[Condition](../classes/_ast_.condition.md)*

___

###  ensureConstant

▸ **ensureConstant**(`expr`: [UnsureExpression](_ast_.md#unsureexpression)): *[Expression](../classes/_ast_.expression.md)*

Defined in src/util.ts:29

返回表达式

**Parameters:**

Name | Type |
------ | ------ |
`expr` | [UnsureExpression](_ast_.md#unsureexpression) |

**Returns:** *[Expression](../classes/_ast_.expression.md)*

___

###  ensureGroupValues

▸ **ensureGroupValues**(`values`: [UnsureGroupValues](_ast_.md#unsuregroupvalues)): *[List](../classes/_ast_.list.md)*

Defined in src/util.ts:43

**Parameters:**

Name | Type |
------ | ------ |
`values` | [UnsureGroupValues](_ast_.md#unsuregroupvalues) |

**Returns:** *[List](../classes/_ast_.list.md)*

___

###  ensureIdentity

▸ **ensureIdentity**(`expr`: string | [Identifier](../classes/_ast_.identifier.md)): *[Identifier](../classes/_ast_.identifier.md)*

Defined in src/util.ts:36

**Parameters:**

Name | Type |
------ | ------ |
`expr` | string &#124; [Identifier](../classes/_ast_.identifier.md) |

**Returns:** *[Identifier](../classes/_ast_.identifier.md)*

___

###  makeProxyIdentity

▸ **makeProxyIdentity**(`identifier`: [Identifier](../classes/_ast_.identifier.md)): *[Identifier](../classes/_ast_.identifier.md)*

Defined in src/util.ts:85

将制作table的代理，用于生成字段

**Parameters:**

Name | Type |
------ | ------ |
`identifier` | [Identifier](../classes/_ast_.identifier.md) |

**Returns:** *[Identifier](../classes/_ast_.identifier.md)*
