[lubejs](../README.md) › [Globals](../globals.md) › ["compiler"](../modules/_compiler_.md) › [Compiler](_compiler_.compiler.md)

# Class: Compiler

AST到SQL的编译器

## Hierarchy

* **Compiler**

## Index

### Constructors

* [constructor](_compiler_.compiler.md#constructor)

### Properties

* [options](_compiler_.compiler.md#options)

### Methods

* [compile](_compiler_.compiler.md#compile)
* [compileAST](_compiler_.compiler.md#protected-compileast)
* [compileAlias](_compiler_.compiler.md#protected-compilealias)
* [compileAssignment](_compiler_.compiler.md#protected-compileassignment)
* [compileBinaryCalculate](_compiler_.compiler.md#protected-compilebinarycalculate)
* [compileBinaryCompare](_compiler_.compiler.md#protected-compilebinarycompare)
* [compileBinaryLogic](_compiler_.compiler.md#protected-compilebinarylogic)
* [compileBoolean](_compiler_.compiler.md#protected-compileboolean)
* [compileBracket](_compiler_.compiler.md#protected-compilebracket)
* [compileCase](_compiler_.compiler.md#protected-compilecase)
* [compileColumnList](_compiler_.compiler.md#protected-compilecolumnlist)
* [compileConstant](_compiler_.compiler.md#protected-compileconstant)
* [compileDate](_compiler_.compiler.md#protected-compiledate)
* [compileDeclare](_compiler_.compiler.md#protected-compiledeclare)
* [compileDelete](_compiler_.compiler.md#protected-compiledelete)
* [compileExecute](_compiler_.compiler.md#protected-compileexecute)
* [compileExecuteArgumentList](_compiler_.compiler.md#protected-compileexecuteargumentlist)
* [compileExistsCompare](_compiler_.compiler.md#protected-compileexistscompare)
* [compileIdentifier](_compiler_.compiler.md#protected-compileidentifier)
* [compileInsert](_compiler_.compiler.md#protected-compileinsert)
* [compileInvoke](_compiler_.compiler.md#protected-compileinvoke)
* [compileInvokeArgumentList](_compiler_.compiler.md#protected-compileinvokeargumentlist)
* [compileJoin](_compiler_.compiler.md#protected-compilejoin)
* [compileParameter](_compiler_.compiler.md#protected-compileparameter)
* [compileSelect](_compiler_.compiler.md#protected-compileselect)
* [compileSort](_compiler_.compiler.md#protected-compilesort)
* [compileString](_compiler_.compiler.md#protected-compilestring)
* [compileUnaryCalculate](_compiler_.compiler.md#protected-compileunarycalculate)
* [compileUnaryCompare](_compiler_.compiler.md#protected-compileunarycompare)
* [compileUnaryLogic](_compiler_.compiler.md#protected-compileunarylogic)
* [compileUnion](_compiler_.compiler.md#protected-compileunion)
* [compileUpdate](_compiler_.compiler.md#protected-compileupdate)
* [compileValueList](_compiler_.compiler.md#protected-compilevaluelist)
* [compileVariant](_compiler_.compiler.md#protected-compilevariant)
* [compileWhen](_compiler_.compiler.md#protected-compilewhen)
* [prepareParameterName](_compiler_.compiler.md#prepareparametername)
* [properVariantName](_compiler_.compiler.md#protected-propervariantname)
* [quoted](_compiler_.compiler.md#private-quoted)

## Constructors

###  constructor

\+ **new Compiler**(`options?`: [CompileOptions](../interfaces/_compiler_.compileoptions.md)): *[Compiler](_compiler_.compiler.md)*

Defined in src/compiler.ts:88

**Parameters:**

Name | Type |
------ | ------ |
`options?` | [CompileOptions](../interfaces/_compiler_.compileoptions.md) |

**Returns:** *[Compiler](_compiler_.compiler.md)*

## Properties

###  options

• **options**: *[CompileOptions](../interfaces/_compiler_.compileoptions.md)*

Defined in src/compiler.ts:88

## Methods

###  compile

▸ **compile**(`ast`: [AST](_ast_.ast.md)): *[Command](../interfaces/_compiler_.command.md)*

Defined in src/compiler.ts:184

**Parameters:**

Name | Type |
------ | ------ |
`ast` | [AST](_ast_.ast.md) |

**Returns:** *[Command](../interfaces/_compiler_.command.md)*

___

### `Protected` compileAST

▸ **compileAST**(`ast`: [AST](_ast_.ast.md), `params`: Set‹[Parameter](_ast_.parameter.md)›, `parent?`: [AST](_ast_.ast.md)): *string*

Defined in src/compiler.ts:192

**Parameters:**

Name | Type |
------ | ------ |
`ast` | [AST](_ast_.ast.md) |
`params` | Set‹[Parameter](_ast_.parameter.md)› |
`parent?` | [AST](_ast_.ast.md) |

**Returns:** *string*

___

### `Protected` compileAlias

▸ **compileAlias**(`alias`: [Alias](_ast_.alias.md), `params`: Set‹[Parameter](_ast_.parameter.md)›, `parent?`: [AST](_ast_.ast.md)): *string*

Defined in src/compiler.ts:295

**Parameters:**

Name | Type |
------ | ------ |
`alias` | [Alias](_ast_.alias.md) |
`params` | Set‹[Parameter](_ast_.parameter.md)› |
`parent?` | [AST](_ast_.ast.md) |

**Returns:** *string*

___

### `Protected` compileAssignment

▸ **compileAssignment**(`assign`: [Assignment](_ast_.assignment.md), `params`: Set‹[Parameter](_ast_.parameter.md)›, `parent?`: [AST](_ast_.ast.md)): *string*

Defined in src/compiler.ts:427

**Parameters:**

Name | Type |
------ | ------ |
`assign` | [Assignment](_ast_.assignment.md) |
`params` | Set‹[Parameter](_ast_.parameter.md)› |
`parent?` | [AST](_ast_.ast.md) |

**Returns:** *string*

___

### `Protected` compileBinaryCalculate

▸ **compileBinaryCalculate**(`expr`: [BinaryCalculate](_ast_.binarycalculate.md), `params`: Set‹[Parameter](_ast_.parameter.md)›, `parent?`: [AST](_ast_.ast.md)): *string*

Defined in src/compiler.ts:320

**Parameters:**

Name | Type |
------ | ------ |
`expr` | [BinaryCalculate](_ast_.binarycalculate.md) |
`params` | Set‹[Parameter](_ast_.parameter.md)› |
`parent?` | [AST](_ast_.ast.md) |

**Returns:** *string*

___

### `Protected` compileBinaryCompare

▸ **compileBinaryCompare**(`expr`: [BinaryCompare](_ast_.binarycompare.md), `params`: Set‹[Parameter](_ast_.parameter.md)›, `parent?`: [AST](_ast_.ast.md)): *string*

Defined in src/compiler.ts:316

**Parameters:**

Name | Type |
------ | ------ |
`expr` | [BinaryCompare](_ast_.binarycompare.md) |
`params` | Set‹[Parameter](_ast_.parameter.md)› |
`parent?` | [AST](_ast_.ast.md) |

**Returns:** *string*

___

### `Protected` compileBinaryLogic

▸ **compileBinaryLogic**(`expr`: [BinaryLogic](_ast_.binarylogic.md), `params`: Set‹[Parameter](_ast_.parameter.md)›, `parent?`: [AST](_ast_.ast.md)): *string*

Defined in src/compiler.ts:312

**Parameters:**

Name | Type |
------ | ------ |
`expr` | [BinaryLogic](_ast_.binarylogic.md) |
`params` | Set‹[Parameter](_ast_.parameter.md)› |
`parent?` | [AST](_ast_.ast.md) |

**Returns:** *string*

___

### `Protected` compileBoolean

▸ **compileBoolean**(`value`: boolean): *"1" | "0"*

Defined in src/compiler.ts:144

**Parameters:**

Name | Type |
------ | ------ |
`value` | boolean |

**Returns:** *"1" | "0"*

___

### `Protected` compileBracket

▸ **compileBracket**‹**T**›(`bracket`: [Bracket](_ast_.bracket.md)‹T›, `params`: Set‹[Parameter](_ast_.parameter.md)›, `parent?`: [AST](_ast_.ast.md)): *string*

Defined in src/compiler.ts:265

**Type parameters:**

▪ **T**: *[AST](_ast_.ast.md)*

**Parameters:**

Name | Type |
------ | ------ |
`bracket` | [Bracket](_ast_.bracket.md)‹T› |
`params` | Set‹[Parameter](_ast_.parameter.md)› |
`parent?` | [AST](_ast_.ast.md) |

**Returns:** *string*

___

### `Protected` compileCase

▸ **compileCase**(`caseExpr`: [Case](_ast_.case.md), `params`: Set‹[Parameter](_ast_.parameter.md)›, `parent?`: [AST](_ast_.ast.md)): *string*

Defined in src/compiler.ts:299

**Parameters:**

Name | Type |
------ | ------ |
`caseExpr` | [Case](_ast_.case.md) |
`params` | Set‹[Parameter](_ast_.parameter.md)› |
`parent?` | [AST](_ast_.ast.md) |

**Returns:** *string*

___

### `Protected` compileColumnList

▸ **compileColumnList**(`values`: [List](_ast_.list.md), `params`: Set‹[Parameter](_ast_.parameter.md)›, `parent?`: [AST](_ast_.ast.md)): *string*

Defined in src/compiler.ts:273

**Parameters:**

Name | Type |
------ | ------ |
`values` | [List](_ast_.list.md) |
`params` | Set‹[Parameter](_ast_.parameter.md)› |
`parent?` | [AST](_ast_.ast.md) |

**Returns:** *string*

___

### `Protected` compileConstant

▸ **compileConstant**(`constant`: [Constant](_ast_.constant.md), `params?`: Set‹[Parameter](_ast_.parameter.md)›, `parent?`: [AST](_ast_.ast.md)): *string*

Defined in src/compiler.ts:152

**Parameters:**

Name | Type |
------ | ------ |
`constant` | [Constant](_ast_.constant.md) |
`params?` | Set‹[Parameter](_ast_.parameter.md)› |
`parent?` | [AST](_ast_.ast.md) |

**Returns:** *string*

___

### `Protected` compileDate

▸ **compileDate**(`date`: Date): *string*

Defined in src/compiler.ts:140

**Parameters:**

Name | Type |
------ | ------ |
`date` | Date |

**Returns:** *string*

___

### `Protected` compileDeclare

▸ **compileDeclare**(`declare`: [Declare](_ast_.declare.md), `params`: Set‹[Parameter](_ast_.parameter.md)›, `parent?`: [AST](_ast_.ast.md)): *string*

Defined in src/compiler.ts:432

**Parameters:**

Name | Type |
------ | ------ |
`declare` | [Declare](_ast_.declare.md) |
`params` | Set‹[Parameter](_ast_.parameter.md)› |
`parent?` | [AST](_ast_.ast.md) |

**Returns:** *string*

___

### `Protected` compileDelete

▸ **compileDelete**(`del`: [Delete](_ast_.delete.md), `params`: Set‹[Parameter](_ast_.parameter.md)›, `parent?`: [AST](_ast_.ast.md)): *string*

Defined in src/compiler.ts:460

**Parameters:**

Name | Type |
------ | ------ |
`del` | [Delete](_ast_.delete.md) |
`params` | Set‹[Parameter](_ast_.parameter.md)› |
`parent?` | [AST](_ast_.ast.md) |

**Returns:** *string*

___

### `Protected` compileExecute

▸ **compileExecute**‹**T**›(`exec`: [Execute](_ast_.execute.md), `params`: Set‹[Parameter](_ast_.parameter.md)›, `parent?`: [AST](_ast_.ast.md)): *string*

Defined in src/compiler.ts:258

**Type parameters:**

▪ **T**: *[AST](_ast_.ast.md)*

**Parameters:**

Name | Type |
------ | ------ |
`exec` | [Execute](_ast_.execute.md) |
`params` | Set‹[Parameter](_ast_.parameter.md)› |
`parent?` | [AST](_ast_.ast.md) |

**Returns:** *string*

___

### `Protected` compileExecuteArgumentList

▸ **compileExecuteArgumentList**(`values`: [List](_ast_.list.md), `params`: Set‹[Parameter](_ast_.parameter.md)›, `parent?`: [AST](_ast_.ast.md)): *string*

Defined in src/compiler.ts:281

**Parameters:**

Name | Type |
------ | ------ |
`values` | [List](_ast_.list.md) |
`params` | Set‹[Parameter](_ast_.parameter.md)› |
`parent?` | [AST](_ast_.ast.md) |

**Returns:** *string*

___

### `Protected` compileExistsCompare

▸ **compileExistsCompare**(`expr`: [ExistsCompare](_ast_.existscompare.md), `params`: Set‹[Parameter](_ast_.parameter.md)›, `parent?`: [AST](_ast_.ast.md)): *string*

Defined in src/compiler.ts:328

**Parameters:**

Name | Type |
------ | ------ |
`expr` | [ExistsCompare](_ast_.existscompare.md) |
`params` | Set‹[Parameter](_ast_.parameter.md)› |
`parent?` | [AST](_ast_.ast.md) |

**Returns:** *string*

___

### `Protected` compileIdentifier

▸ **compileIdentifier**(`identifier`: [Identifier](_ast_.identifier.md), `params?`: Set‹[Parameter](_ast_.parameter.md)›, `parent?`: [AST](_ast_.ast.md)): *string*

Defined in src/compiler.ts:98

解析标识符

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`identifier` | [Identifier](_ast_.identifier.md) | 标识符  |
`params?` | Set‹[Parameter](_ast_.parameter.md)› | - |
`parent?` | [AST](_ast_.ast.md) | - |

**Returns:** *string*

___

### `Protected` compileInsert

▸ **compileInsert**(`insert`: [Insert](_ast_.insert.md), `params`: Set‹[Parameter](_ast_.parameter.md)›, `parent?`: [AST](_ast_.ast.md)): *string*

Defined in src/compiler.ts:404

**Parameters:**

Name | Type |
------ | ------ |
`insert` | [Insert](_ast_.insert.md) |
`params` | Set‹[Parameter](_ast_.parameter.md)› |
`parent?` | [AST](_ast_.ast.md) |

**Returns:** *string*

___

### `Protected` compileInvoke

▸ **compileInvoke**(`invoke`: [Invoke](_ast_.invoke.md), `params`: Set‹[Parameter](_ast_.parameter.md)›, `parent?`: [AST](_ast_.ast.md)): *string*

Defined in src/compiler.ts:347

函数调用

**`memberof`** Executor

**Parameters:**

Name | Type |
------ | ------ |
`invoke` | [Invoke](_ast_.invoke.md) |
`params` | Set‹[Parameter](_ast_.parameter.md)› |
`parent?` | [AST](_ast_.ast.md) |

**Returns:** *string*

___

### `Protected` compileInvokeArgumentList

▸ **compileInvokeArgumentList**(`values`: [List](_ast_.list.md), `params`: Set‹[Parameter](_ast_.parameter.md)›, `parent?`: [AST](_ast_.ast.md)): *string*

Defined in src/compiler.ts:277

**Parameters:**

Name | Type |
------ | ------ |
`values` | [List](_ast_.list.md) |
`params` | Set‹[Parameter](_ast_.parameter.md)› |
`parent?` | [AST](_ast_.ast.md) |

**Returns:** *string*

___

### `Protected` compileJoin

▸ **compileJoin**(`join`: [Join](_ast_.join.md), `params`: Set‹[Parameter](_ast_.parameter.md)›, `parent?`: [AST](_ast_.ast.md)): *string*

Defined in src/compiler.ts:351

**Parameters:**

Name | Type |
------ | ------ |
`join` | [Join](_ast_.join.md) |
`params` | Set‹[Parameter](_ast_.parameter.md)› |
`parent?` | [AST](_ast_.ast.md) |

**Returns:** *string*

___

### `Protected` compileParameter

▸ **compileParameter**(`param`: [Parameter](_ast_.parameter.md), `params`: Set‹[Parameter](_ast_.parameter.md)›, `parent`: [AST](_ast_.ast.md)): *string*

Defined in src/compiler.ts:123

向参数列表中添加参数并返回当前参数的参数名

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`param` | [Parameter](_ast_.parameter.md) | - |
`params` | Set‹[Parameter](_ast_.parameter.md)› | - |
`parent` | [AST](_ast_.ast.md) | null |

**Returns:** *string*

___

### `Protected` compileSelect

▸ **compileSelect**(`select`: [Select](_ast_.select.md), `params`: Set‹[Parameter](_ast_.parameter.md)›, `parent?`: [AST](_ast_.ast.md)): *string*

Defined in src/compiler.ts:361

**Parameters:**

Name | Type |
------ | ------ |
`select` | [Select](_ast_.select.md) |
`params` | Set‹[Parameter](_ast_.parameter.md)› |
`parent?` | [AST](_ast_.ast.md) |

**Returns:** *string*

___

### `Protected` compileSort

▸ **compileSort**(`sort`: [SortInfo](_ast_.sortinfo.md), `params`: Set‹[Parameter](_ast_.parameter.md)›, `parent?`: [AST](_ast_.ast.md)): *string*

Defined in src/compiler.ts:355

**Parameters:**

Name | Type |
------ | ------ |
`sort` | [SortInfo](_ast_.sortinfo.md) |
`params` | Set‹[Parameter](_ast_.parameter.md)› |
`parent?` | [AST](_ast_.ast.md) |

**Returns:** *string*

___

### `Protected` compileString

▸ **compileString**(`value`: string): *string*

Defined in src/compiler.ts:148

**Parameters:**

Name | Type |
------ | ------ |
`value` | string |

**Returns:** *string*

___

### `Protected` compileUnaryCalculate

▸ **compileUnaryCalculate**(`expr`: [UnaryCalculate](_ast_.unarycalculate.md), `params`: Set‹[Parameter](_ast_.parameter.md)›, `parent?`: [AST](_ast_.ast.md)): *string*

Defined in src/compiler.ts:336

**Parameters:**

Name | Type |
------ | ------ |
`expr` | [UnaryCalculate](_ast_.unarycalculate.md) |
`params` | Set‹[Parameter](_ast_.parameter.md)› |
`parent?` | [AST](_ast_.ast.md) |

**Returns:** *string*

___

### `Protected` compileUnaryCompare

▸ **compileUnaryCompare**(`expr`: [UnaryCompare](_ast_.unarycompare.md), `params`: Set‹[Parameter](_ast_.parameter.md)›, `parent?`: [AST](_ast_.ast.md)): *string*

Defined in src/compiler.ts:324

**Parameters:**

Name | Type |
------ | ------ |
`expr` | [UnaryCompare](_ast_.unarycompare.md) |
`params` | Set‹[Parameter](_ast_.parameter.md)› |
`parent?` | [AST](_ast_.ast.md) |

**Returns:** *string*

___

### `Protected` compileUnaryLogic

▸ **compileUnaryLogic**(`expr`: [UnaryLogic](_ast_.unarylogic.md), `params`: Set‹[Parameter](_ast_.parameter.md)›, `parent?`: [AST](_ast_.ast.md)): *string*

Defined in src/compiler.ts:332

**Parameters:**

Name | Type |
------ | ------ |
`expr` | [UnaryLogic](_ast_.unarylogic.md) |
`params` | Set‹[Parameter](_ast_.parameter.md)› |
`parent?` | [AST](_ast_.ast.md) |

**Returns:** *string*

___

### `Protected` compileUnion

▸ **compileUnion**(`union`: [Union](_ast_.union.md), `params`: Set‹[Parameter](_ast_.parameter.md)›, `parent?`: [AST](_ast_.ast.md)): *string*

Defined in src/compiler.ts:291

**Parameters:**

Name | Type |
------ | ------ |
`union` | [Union](_ast_.union.md) |
`params` | Set‹[Parameter](_ast_.parameter.md)› |
`parent?` | [AST](_ast_.ast.md) |

**Returns:** *string*

___

### `Protected` compileUpdate

▸ **compileUpdate**(`update`: [Update](_ast_.update.md), `params`: Set‹[Parameter](_ast_.parameter.md)›, `parent?`: [AST](_ast_.ast.md)): *string*

Defined in src/compiler.ts:436

**Parameters:**

Name | Type |
------ | ------ |
`update` | [Update](_ast_.update.md) |
`params` | Set‹[Parameter](_ast_.parameter.md)› |
`parent?` | [AST](_ast_.ast.md) |

**Returns:** *string*

___

### `Protected` compileValueList

▸ **compileValueList**(`values`: [List](_ast_.list.md), `params`: Set‹[Parameter](_ast_.parameter.md)›, `parent?`: [AST](_ast_.ast.md)): *string*

Defined in src/compiler.ts:269

**Parameters:**

Name | Type |
------ | ------ |
`values` | [List](_ast_.list.md) |
`params` | Set‹[Parameter](_ast_.parameter.md)› |
`parent?` | [AST](_ast_.ast.md) |

**Returns:** *string*

___

### `Protected` compileVariant

▸ **compileVariant**(`variant`: [Variant](_ast_.variant.md), `params`: Set‹[Parameter](_ast_.parameter.md)›, `parent?`: [AST](_ast_.ast.md)): *string*

Defined in src/compiler.ts:136

**Parameters:**

Name | Type |
------ | ------ |
`variant` | [Variant](_ast_.variant.md) |
`params` | Set‹[Parameter](_ast_.parameter.md)› |
`parent?` | [AST](_ast_.ast.md) |

**Returns:** *string*

___

### `Protected` compileWhen

▸ **compileWhen**(`when`: [When](_ast_.when.md), `params`: Set‹[Parameter](_ast_.parameter.md)›, `parent?`: [AST](_ast_.ast.md)): *string*

Defined in src/compiler.ts:308

**Parameters:**

Name | Type |
------ | ------ |
`when` | [When](_ast_.when.md) |
`params` | Set‹[Parameter](_ast_.parameter.md)› |
`parent?` | [AST](_ast_.ast.md) |

**Returns:** *string*

___

###  prepareParameterName

▸ **prepareParameterName**(`p`: [Parameter](_ast_.parameter.md)): *string*

Defined in src/compiler.ts:128

**Parameters:**

Name | Type |
------ | ------ |
`p` | [Parameter](_ast_.parameter.md) |

**Returns:** *string*

___

### `Protected` properVariantName

▸ **properVariantName**(`name`: string): *string*

Defined in src/compiler.ts:132

**Parameters:**

Name | Type |
------ | ------ |
`name` | string |

**Returns:** *string*

___

### `Private` quoted

▸ **quoted**(`identifier`: string): *string*

Defined in src/compiler.ts:111

标识符转换，避免关键字被冲突问题

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`identifier` | string | 标识符  |

**Returns:** *string*
