[lubejs](../README.md) › [Globals](../globals.md) › ["constants"](_constants_.md)

# Module: "constants"

## Index

### Enumerations

* [BINARY_COMPARE_OPERATOR](../enums/_constants_.binary_compare_operator.md)
* [BINARY_OPERATION_OPERATOR](../enums/_constants_.binary_operation_operator.md)
* [CONDITION_KIND](../enums/_constants_.condition_kind.md)
* [IDENTOFIER_KIND](../enums/_constants_.identofier_kind.md)
* [ISOLATION_LEVEL](../enums/_constants_.isolation_level.md)
* [LOGIC_OPERATOR](../enums/_constants_.logic_operator.md)
* [OPERATION_KIND](../enums/_constants_.operation_kind.md)
* [PARAMETER_DIRECTION](../enums/_constants_.parameter_direction.md)
* [SORT_DIRECTION](../enums/_constants_.sort_direction.md)
* [SQL_SYMBOLE](../enums/_constants_.sql_symbole.md)
* [UNARY_COMPARE_OPERATOR](../enums/_constants_.unary_compare_operator.md)
* [UNARY_OPERATION_OPERATOR](../enums/_constants_.unary_operation_operator.md)

### Type aliases

* [COMPARE_OPERATOR](_constants_.md#compare_operator)
* [OPERATION_OPERATOR](_constants_.md#operation_operator)
* [SQL_SYMBOLE_EXPRESSION](_constants_.md#sql_symbole_expression)

### Variables

* [$IsProxy](_constants_.md#const-isproxy)
* [INSERT_MAXIMUM_ROWS](_constants_.md#const-insert_maximum_rows)
* [ROWSET_ALIAS](_constants_.md#const-rowset_alias)

## Type aliases

###  COMPARE_OPERATOR

Ƭ **COMPARE_OPERATOR**: *[UNARY_COMPARE_OPERATOR](../enums/_constants_.unary_compare_operator.md) | [BINARY_COMPARE_OPERATOR](../enums/_constants_.binary_compare_operator.md)*

Defined in constants.ts:40

比较运算符

___

###  OPERATION_OPERATOR

Ƭ **OPERATION_OPERATOR**: *[BINARY_OPERATION_OPERATOR](../enums/_constants_.binary_operation_operator.md) | [UNARY_OPERATION_OPERATOR](../enums/_constants_.unary_operation_operator.md)*

Defined in constants.ts:84

算术运算符列表

___

###  SQL_SYMBOLE_EXPRESSION

Ƭ **SQL_SYMBOLE_EXPRESSION**: *[IDENTIFIER](../enums/_constants_.sql_symbole.md#identifier) | [OPERATION](../enums/_constants_.sql_symbole.md#operation) | [SCALAR_FUNCTION_INVOKE](../enums/_constants_.sql_symbole.md#scalar_function_invoke) | [CASE](../enums/_constants_.sql_symbole.md#case) | [LITERAL](../enums/_constants_.sql_symbole.md#literal) | [VALUED_SELECT](../enums/_constants_.sql_symbole.md#valued_select) | [BRACKET_EXPRESSION](../enums/_constants_.sql_symbole.md#bracket_expression)*

Defined in constants.ts:129

## Variables

### `Const` $IsProxy

• **$IsProxy**: *unique symbol* = Symbol('#IS_PROXY')

Defined in constants.ts:216

___

### `Const` INSERT_MAXIMUM_ROWS

• **INSERT_MAXIMUM_ROWS**: *1000* = 1000

Defined in constants.ts:206

___

### `Const` ROWSET_ALIAS

• **ROWSET_ALIAS**: *"__T__"* = "__T__"

Defined in constants.ts:218
