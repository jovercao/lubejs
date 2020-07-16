[lubejs](../README.md) › [Globals](../globals.md) › ["ast"](_ast_.md)

# Module: "ast"

## Index

### Classes

* [AST](../classes/_ast_.ast.md)
* [Alias](../classes/_ast_.alias.md)
* [Assignment](../classes/_ast_.assignment.md)
* [BinaryCalculate](../classes/_ast_.binarycalculate.md)
* [BinaryCompare](../classes/_ast_.binarycompare.md)
* [BinaryLogic](../classes/_ast_.binarylogic.md)
* [Bracket](../classes/_ast_.bracket.md)
* [Case](../classes/_ast_.case.md)
* [Condition](../classes/_ast_.condition.md)
* [Constant](../classes/_ast_.constant.md)
* [Declare](../classes/_ast_.declare.md)
* [Delete](../classes/_ast_.delete.md)
* [Document](../classes/_ast_.document.md)
* [Execute](../classes/_ast_.execute.md)
* [ExistsCompare](../classes/_ast_.existscompare.md)
* [Expression](../classes/_ast_.expression.md)
* [Fromable](../classes/_ast_.fromable.md)
* [Identifier](../classes/_ast_.identifier.md)
* [Insert](../classes/_ast_.insert.md)
* [Invoke](../classes/_ast_.invoke.md)
* [IsNotNullCondition](../classes/_ast_.isnotnullcondition.md)
* [IsNullCondition](../classes/_ast_.isnullcondition.md)
* [Join](../classes/_ast_.join.md)
* [List](../classes/_ast_.list.md)
* [Parameter](../classes/_ast_.parameter.md)
* [QuotedCondition](../classes/_ast_.quotedcondition.md)
* [Raw](../classes/_ast_.raw.md)
* [Select](../classes/_ast_.select.md)
* [SortInfo](../classes/_ast_.sortinfo.md)
* [Statement](../classes/_ast_.statement.md)
* [UnaryCalculate](../classes/_ast_.unarycalculate.md)
* [UnaryCompare](../classes/_ast_.unarycompare.md)
* [UnaryLogic](../classes/_ast_.unarylogic.md)
* [Union](../classes/_ast_.union.md)
* [Update](../classes/_ast_.update.md)
* [Variant](../classes/_ast_.variant.md)
* [VariantDeclare](../classes/_ast_.variantdeclare.md)
* [When](../classes/_ast_.when.md)

### Interfaces

* [IBinary](../interfaces/_ast_.ibinary.md)
* [ICondition](../interfaces/_ast_.icondition.md)
* [IUnary](../interfaces/_ast_.iunary.md)
* [KeyValueObject](../interfaces/_ast_.keyvalueobject.md)
* [ResultObject](../interfaces/_ast_.resultobject.md)
* [SortObject](../interfaces/_ast_.sortobject.md)
* [WhereObject](../interfaces/_ast_.whereobject.md)

### Type aliases

* [AssignObject](_ast_.md#assignobject)
* [DbType](_ast_.md#dbtype)
* [JsConstant](_ast_.md#jsconstant)
* [JsType](_ast_.md#jstype)
* [ProxiedIdentifier](_ast_.md#proxiedidentifier)
* [SelectExpression](_ast_.md#selectexpression)
* [UnsureCondition](_ast_.md#unsurecondition)
* [UnsureExpression](_ast_.md#unsureexpression)
* [UnsureGroupValues](_ast_.md#unsuregroupvalues)
* [UnsureIdentifier](_ast_.md#unsureidentifier)
* [ValuesObject](_ast_.md#valuesobject)

### Object literals

* [ConditionPrototype](_ast_.md#const-conditionprototype)

## Type aliases

###  AssignObject

Ƭ **AssignObject**: *[KeyValueObject](../interfaces/_ast_.keyvalueobject.md)*

Defined in src/ast.ts:2183

___

###  DbType

Ƭ **DbType**: *string*

Defined in src/ast.ts:2302

___

###  JsConstant

Ƭ **JsConstant**: *string | Date | boolean | null | number | Buffer | bigint*

Defined in src/ast.ts:33

JS常量类型

___

###  JsType

Ƭ **JsType**: *Function*

Defined in src/ast.ts:2303

___

###  ProxiedIdentifier

Ƭ **ProxiedIdentifier**: *[Identifier](../classes/_ast_.identifier.md) & object*

Defined in src/ast.ts:61

___

###  SelectExpression

Ƭ **SelectExpression**: *[Select](../classes/_ast_.select.md) | [Bracket](../classes/_ast_.bracket.md)‹[Select](../classes/_ast_.select.md)› | [Bracket](../classes/_ast_.bracket.md)‹[SelectExpression](_ast_.md#selectexpression)›*

Defined in src/ast.ts:52

SELECT查询表达式

___

###  UnsureCondition

Ƭ **UnsureCondition**: *[Condition](../classes/_ast_.condition.md) | [WhereObject](../interfaces/_ast_.whereobject.md)*

Defined in src/ast.ts:47

___

###  UnsureExpression

Ƭ **UnsureExpression**: *[Expression](../classes/_ast_.expression.md) | [JsConstant](_ast_.md#jsconstant)*

Defined in src/ast.ts:38

未经确认的表达式

___

###  UnsureGroupValues

Ƭ **UnsureGroupValues**: *[UnsureExpression](_ast_.md#unsureexpression)[] | [List](../classes/_ast_.list.md)*

Defined in src/ast.ts:57

组数据

___

###  UnsureIdentifier

Ƭ **UnsureIdentifier**: *[Identifier](../classes/_ast_.identifier.md) | string*

Defined in src/ast.ts:59

___

###  ValuesObject

Ƭ **ValuesObject**: *[KeyValueObject](../interfaces/_ast_.keyvalueobject.md)*

Defined in src/ast.ts:2182

## Object literals

### `Const` ConditionPrototype

### ▪ **ConditionPrototype**: *object*

Defined in src/ast.ts:735

###  and

▸ **and**(`condition`: [Condition](../classes/_ast_.condition.md)): *[BinaryLogic](../classes/_ast_.binarylogic.md)‹›*

Defined in src/ast.ts:741

and连接

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`condition` | [Condition](../classes/_ast_.condition.md) | 下一个查询条件 |

**Returns:** *[BinaryLogic](../classes/_ast_.binarylogic.md)‹›*

返回新的查询条件

###  andGroup

▸ **andGroup**(`condition`: [Condition](../classes/_ast_.condition.md)): *[BinaryLogic](../classes/_ast_.binarylogic.md)‹›*

Defined in src/ast.ts:751

and连接

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`condition` | [Condition](../classes/_ast_.condition.md) | 下一个查询条件 |

**Returns:** *[BinaryLogic](../classes/_ast_.binarylogic.md)‹›*

返回新的查询条件

###  or

▸ **or**(`condition`: [Condition](../classes/_ast_.condition.md)): *[BinaryLogic](../classes/_ast_.binarylogic.md)‹›*

Defined in src/ast.ts:761

OR语句

**Parameters:**

Name | Type |
------ | ------ |
`condition` | [Condition](../classes/_ast_.condition.md) |

**Returns:** *[BinaryLogic](../classes/_ast_.binarylogic.md)‹›*

返回新的查询条件

###  orGroup

▸ **orGroup**(`condition`: [Condition](../classes/_ast_.condition.md)): *[BinaryLogic](../classes/_ast_.binarylogic.md)‹›*

Defined in src/ast.ts:772

and连接

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`condition` | [Condition](../classes/_ast_.condition.md) | 下一个查询条件 |

**Returns:** *[BinaryLogic](../classes/_ast_.binarylogic.md)‹›*

返回新的查询条件
