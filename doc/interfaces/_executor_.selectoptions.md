[lubejs](../README.md) › [Globals](../globals.md) › ["executor"](../modules/_executor_.md) › [SelectOptions](_executor_.selectoptions.md)

# Interface: SelectOptions ‹**TResult**›

## Type parameters

▪ **TResult**

## Hierarchy

* **SelectOptions**

## Index

### Properties

* [distinct](_executor_.selectoptions.md#optional-distinct)
* [fields](_executor_.selectoptions.md#optional-fields)
* [limit](_executor_.selectoptions.md#optional-limit)
* [offset](_executor_.selectoptions.md#optional-offset)
* [sorts](_executor_.selectoptions.md#optional-sorts)
* [top](_executor_.selectoptions.md#optional-top)
* [where](_executor_.selectoptions.md#optional-where)

## Properties

### `Optional` distinct

• **distinct**? : *boolean*

Defined in src/executor.ts:35

___

### `Optional` fields

• **fields**? : *keyof TResult[]*

Defined in src/executor.ts:36

___

### `Optional` limit

• **limit**? : *number*

Defined in src/executor.ts:34

___

### `Optional` offset

• **offset**? : *number*

Defined in src/executor.ts:33

___

### `Optional` sorts

• **sorts**? : *[SortObject](_ast_.sortobject.md) | string | number | bigint | false | true | [Expression](../classes/_ast_.expression.md)‹› | Date | Buffer‹› | [SortInfo](../classes/_ast_.sortinfo.md)‹›[]*

Defined in src/executor.ts:37

___

### `Optional` top

• **top**? : *number*

Defined in src/executor.ts:32

___

### `Optional` where

• **where**? : *[UnsureCondition](../modules/_ast_.md#unsurecondition)*

Defined in src/executor.ts:31
