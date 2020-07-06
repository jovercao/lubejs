[lubejs](../README.md) › [Globals](../globals.md) › ["ast"](../modules/_ast_.md) › [ICondition](_ast_.icondition.md)

# Interface: ICondition

## Hierarchy

* **ICondition**

## Implemented by

* [BinaryCompareCondition](../classes/_ast_.binarycomparecondition.md)
* [BinaryLogicCondition](../classes/_ast_.binarylogiccondition.md)
* [Condition](../classes/_ast_.condition.md)
* [IsNotNullCondition](../classes/_ast_.isnotnullcondition.md)
* [IsNullCondition](../classes/_ast_.isnullcondition.md)
* [QuotedCondition](../classes/_ast_.quotedcondition.md)
* [QuotedCondition](../classes/_ast_.quotedcondition.md)
* [UnaryCompareCondition](../classes/_ast_.unarycomparecondition.md)
* [UnaryLogicCondition](../classes/_ast_.unarylogiccondition.md)

## Index

### Methods

* [and](_ast_.icondition.md#and)
* [andGroup](_ast_.icondition.md#andgroup)
* [or](_ast_.icondition.md#or)
* [orGroup](_ast_.icondition.md#orgroup)

## Methods

###  and

▸ **and**(`condition`: [Condition](../classes/_ast_.condition.md)): *[Condition](../classes/_ast_.condition.md)*

Defined in src/ast.ts:702

and连接

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`condition` | [Condition](../classes/_ast_.condition.md) | 下一个查询条件 |

**Returns:** *[Condition](../classes/_ast_.condition.md)*

返回新的查询条件

___

###  andGroup

▸ **andGroup**(`condition`: [Condition](../classes/_ast_.condition.md)): *[Condition](../classes/_ast_.condition.md)*

Defined in src/ast.ts:708

and连接，并在被连接的条件中加上括号 ()

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`condition` | [Condition](../classes/_ast_.condition.md) | 下一个查询条件 |

**Returns:** *[Condition](../classes/_ast_.condition.md)*

返回新的查询条件

___

###  or

▸ **or**(`condition`: [Condition](../classes/_ast_.condition.md)): *[Condition](../classes/_ast_.condition.md)*

Defined in src/ast.ts:715

OR语句

**Parameters:**

Name | Type |
------ | ------ |
`condition` | [Condition](../classes/_ast_.condition.md) |

**Returns:** *[Condition](../classes/_ast_.condition.md)*

返回新的查询条件

___

###  orGroup

▸ **orGroup**(`condition`: [Condition](../classes/_ast_.condition.md)): *[Condition](../classes/_ast_.condition.md)*

Defined in src/ast.ts:722

or 连接，并在被连接的条件中加上括号 ()

**Parameters:**

Name | Type |
------ | ------ |
`condition` | [Condition](../classes/_ast_.condition.md) |

**Returns:** *[Condition](../classes/_ast_.condition.md)*

返回新的查询条件
