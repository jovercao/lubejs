[lubejs](../README.md) › [Globals](../globals.md) › ["ast"](_ast_.md)

# Module: "ast"

## Index

### Classes

* [AST](../classes/_ast_.ast.md)
* [Alias](../classes/_ast_.alias.md)
* [Assignable](../classes/_ast_.assignable.md)
* [Assignment](../classes/_ast_.assignment.md)
* [BinaryCompareCondition](../classes/_ast_.binarycomparecondition.md)
* [BinaryLogicCondition](../classes/_ast_.binarylogiccondition.md)
* [BinaryOperation](../classes/_ast_.binaryoperation.md)
* [BuiltIn](../classes/_ast_.builtin.md)
* [Case](../classes/_ast_.case.md)
* [Condition](../classes/_ast_.condition.md)
* [ConvertOperation](../classes/_ast_.convertoperation.md)
* [CrudStatement](../classes/_ast_.crudstatement.md)
* [Declare](../classes/_ast_.declare.md)
* [Delete](../classes/_ast_.delete.md)
* [Document](../classes/_ast_.document.md)
* [Execute](../classes/_ast_.execute.md)
* [ExistsCondition](../classes/_ast_.existscondition.md)
* [Expression](../classes/_ast_.expression.md)
* [Field](../classes/_ast_.field.md)
* [Fromable](../classes/_ast_.fromable.md)
* [Func](../classes/_ast_.func.md)
* [Identifier](../classes/_ast_.identifier.md)
* [Insert](../classes/_ast_.insert.md)
* [Join](../classes/_ast_.join.md)
* [Literal](../classes/_ast_.literal.md)
* [NamedSelect](../classes/_ast_.namedselect.md)
* [Operation](../classes/_ast_.operation.md)
* [Parameter](../classes/_ast_.parameter.md)
* [ParenthesesCondition](../classes/_ast_.parenthesescondition.md)
* [ParenthesesExpression](../classes/_ast_.parenthesesexpression.md)
* [Procedure](../classes/_ast_.procedure.md)
* [Raw](../classes/_ast_.raw.md)
* [Rowset](../classes/_ast_.rowset.md)
* [ScalarFuncInvoke](../classes/_ast_.scalarfuncinvoke.md)
* [Select](../classes/_ast_.select.md)
* [SelectColumn](../classes/_ast_.selectcolumn.md)
* [SortInfo](../classes/_ast_.sortinfo.md)
* [Star](../classes/_ast_.star.md)
* [Statement](../classes/_ast_.statement.md)
* [Table](../classes/_ast_.table.md)
* [TableFuncInvoke](../classes/_ast_.tablefuncinvoke.md)
* [TableVariant](../classes/_ast_.tablevariant.md)
* [UnaryCompareCondition](../classes/_ast_.unarycomparecondition.md)
* [UnaryLogicCondition](../classes/_ast_.unarylogiccondition.md)
* [UnaryOperation](../classes/_ast_.unaryoperation.md)
* [Union](../classes/_ast_.union.md)
* [Update](../classes/_ast_.update.md)
* [ValuedSelect](../classes/_ast_.valuedselect.md)
* [Variant](../classes/_ast_.variant.md)
* [VariantDeclare](../classes/_ast_.variantdeclare.md)
* [When](../classes/_ast_.when.md)
* [With](../classes/_ast_.with.md)

### Interfaces

* [TableColumn](../interfaces/_ast_.tablecolumn.md)

### Type aliases

* [AsScalarType](_ast_.md#asscalartype)
* [ComparyCondition](_ast_.md#comparycondition)
* [CompatibleCondition](_ast_.md#compatiblecondition)
* [CompatibleExpression](_ast_.md#compatibleexpression)
* [CompatibleNamedSelect](_ast_.md#compatiblenamedselect)
* [CompatibleRowset](_ast_.md#compatiblerowset)
* [CompatibleSortInfo](_ast_.md#compatiblesortinfo)
* [CompatibleTable](_ast_.md#compatibletable)
* [DefaultRowObject](_ast_.md#defaultrowobject)
* [FieldTypeOf](_ast_.md#fieldtypeof)
* [FieldsOf](_ast_.md#fieldsof)
* [InputObject](_ast_.md#inputobject)
* [LogicCondition](_ast_.md#logiccondition)
* [ModelConstructor](_ast_.md#modelconstructor)
* [ModelTypeOfConstructor](_ast_.md#modeltypeofconstructor)
* [Name](_ast_.md#name)
* [PathedName](_ast_.md#pathedname)
* [Proxied](_ast_.md#proxied)
* [ProxiedNamedSelect](_ast_.md#proxiednamedselect)
* [ProxiedRowset](_ast_.md#proxiedrowset)
* [ProxiedTable](_ast_.md#proxiedtable)
* [RowObject](_ast_.md#rowobject)
* [RowTypeByColumns](_ast_.md#rowtypebycolumns)
* [RowTypeFrom](_ast_.md#rowtypefrom)
* [SelectAction](_ast_.md#selectaction)
* [SelectAliasObject](_ast_.md#selectaliasobject)
* [SelectCloumn](_ast_.md#selectcloumn)
* [SortObject](_ast_.md#sortobject)
* [TypeOf](_ast_.md#typeof)
* [WhereObject](_ast_.md#whereobject)

### Functions

* [applyMixins](_ast_.md#applymixins)

## Type aliases

###  AsScalarType

Ƭ **AsScalarType**: *T[FieldsOf<T>] extends ScalarType ? T[FieldsOf<T>] : never*

Defined in ast.ts:66

取值结果集首个返回值类型运算

___

###  ComparyCondition

Ƭ **ComparyCondition**: *[BinaryCompareCondition](../classes/_ast_.binarycomparecondition.md) | [UnaryCompareCondition](../classes/_ast_.unarycomparecondition.md)*

Defined in ast.ts:1092

___

###  CompatibleCondition

Ƭ **CompatibleCondition**: *[Condition](../classes/_ast_.condition.md) | [WhereObject](_ast_.md#whereobject)‹T›*

Defined in ast.ts:210

可兼容的查询条件

___

###  CompatibleExpression

Ƭ **CompatibleExpression**: *[Expression](../classes/_ast_.expression.md)‹T› | T*

Defined in ast.ts:203

可兼容的表达式

___

###  CompatibleNamedSelect

Ƭ **CompatibleNamedSelect**: *[NamedSelect](../classes/_ast_.namedselect.md)‹T, N› | [ProxiedNamedSelect](_ast_.md#proxiednamedselect)‹T, N›*

Defined in ast.ts:1465

___

###  CompatibleRowset

Ƭ **CompatibleRowset**: *[CompatibleTable](_ast_.md#compatibletable)‹T, N› | [Rowset](../classes/_ast_.rowset.md)‹T› | [ProxiedRowset](_ast_.md#proxiedrowset)‹T› | [NamedSelect](../classes/_ast_.namedselect.md)‹T, N› | [Proxied](_ast_.md#proxied)‹[NamedSelect](../classes/_ast_.namedselect.md)‹T, N›› | [TableFuncInvoke](../classes/_ast_.tablefuncinvoke.md)‹T› | [Proxied](_ast_.md#proxied)‹[TableFuncInvoke](../classes/_ast_.tablefuncinvoke.md)‹T›› | [TableVariant](../classes/_ast_.tablevariant.md)‹T, N› | [Proxied](_ast_.md#proxied)‹[TableVariant](../classes/_ast_.tablevariant.md)‹T, N››*

Defined in ast.ts:1474

所有可兼容的行集参数

___

###  CompatibleSortInfo

Ƭ **CompatibleSortInfo**: *[SortInfo](../classes/_ast_.sortinfo.md)[] | [SortObject](_ast_.md#sortobject)‹T› | [][]*

Defined in ast.ts:214

___

###  CompatibleTable

Ƭ **CompatibleTable**: *[Name](_ast_.md#name)‹string› | [Table](../classes/_ast_.table.md)‹T, N› | [ProxiedTable](_ast_.md#proxiedtable)‹T›*

Defined in ast.ts:1459

___

###  DefaultRowObject

Ƭ **DefaultRowObject**: *object*

Defined in ast.ts:75

#### Type declaration:

___

###  FieldTypeOf

Ƭ **FieldTypeOf**: *T[F] extends ScalarType ? T[F] : never*

Defined in ast.ts:230

___

###  FieldsOf

Ƭ **FieldsOf**: *Exclude‹object[keyof T], number | symbol›*

Defined in ast.ts:223

提取类型中的数据库有效字段，即类型为ScalarType的字段列表
用于在智能提示时排除非数据库字段

___

###  InputObject

Ƭ **InputObject**: *object*

Defined in ast.ts:95

值列表，用于传递Select、Insert、Update、Parameters 的键值对

#### Type declaration:

___

###  LogicCondition

Ƭ **LogicCondition**: *[UnaryLogicCondition](../classes/_ast_.unarylogiccondition.md) | [BinaryLogicCondition](../classes/_ast_.binarylogiccondition.md)*

Defined in ast.ts:1070

___

###  ModelConstructor

Ƭ **ModelConstructor**: *object*

Defined in ast.ts:290

#### Type declaration:

___

###  ModelTypeOfConstructor

Ƭ **ModelTypeOfConstructor**: *T extends object ? TModel : never*

Defined in ast.ts:293

___

###  Name

Ƭ **Name**: *T | [PathedName](_ast_.md#pathedname)‹T›*

Defined in ast.ts:1352

___

###  PathedName

Ƭ **PathedName**: *[] | [] | [] | [] | []*

Defined in ast.ts:1345

___

###  Proxied

Ƭ **Proxied**: *T extends Rowset<infer M> | NamedSelect<infer M> | Table<infer M> | TableFuncInvoke<infer M> | TableVariant<infer M> ? T & object : never*

Defined in ast.ts:237

代理后的Rowset类型

___

###  ProxiedNamedSelect

Ƭ **ProxiedNamedSelect**: *[NamedSelect](../classes/_ast_.namedselect.md)‹T, N› & object*

Defined in ast.ts:269

___

###  ProxiedRowset

Ƭ **ProxiedRowset**: *[Rowset](../classes/_ast_.rowset.md)‹T› & object*

Defined in ast.ts:264

代理后的行集

___

###  ProxiedTable

Ƭ **ProxiedTable**: *[Table](../classes/_ast_.table.md)‹T, N› & object*

Defined in ast.ts:253

代理后的表

___

###  RowObject

Ƭ **RowObject**: *object*

Defined in ast.ts:73

___

###  RowTypeByColumns

Ƭ **RowTypeByColumns**: *[RowTypeFrom](_ast_.md#rowtypefrom)‹A› & [RowTypeFrom](_ast_.md#rowtypefrom)‹B› & [RowTypeFrom](_ast_.md#rowtypefrom)‹C› & [RowTypeFrom](_ast_.md#rowtypefrom)‹D› & [RowTypeFrom](_ast_.md#rowtypefrom)‹E› & [RowTypeFrom](_ast_.md#rowtypefrom)‹F› & [RowTypeFrom](_ast_.md#rowtypefrom)‹G› & [RowTypeFrom](_ast_.md#rowtypefrom)‹H› & [RowTypeFrom](_ast_.md#rowtypefrom)‹I› & [RowTypeFrom](_ast_.md#rowtypefrom)‹J› & [RowTypeFrom](_ast_.md#rowtypefrom)‹K› & [RowTypeFrom](_ast_.md#rowtypefrom)‹L› & [RowTypeFrom](_ast_.md#rowtypefrom)‹M› & [RowTypeFrom](_ast_.md#rowtypefrom)‹N› & [RowTypeFrom](_ast_.md#rowtypefrom)‹O› & [RowTypeFrom](_ast_.md#rowtypefrom)‹P› & [RowTypeFrom](_ast_.md#rowtypefrom)‹Q› & [RowTypeFrom](_ast_.md#rowtypefrom)‹R› & [RowTypeFrom](_ast_.md#rowtypefrom)‹S› & [RowTypeFrom](_ast_.md#rowtypefrom)‹T› & [RowTypeFrom](_ast_.md#rowtypefrom)‹U› & [RowTypeFrom](_ast_.md#rowtypefrom)‹V› & [RowTypeFrom](_ast_.md#rowtypefrom)‹W› & [RowTypeFrom](_ast_.md#rowtypefrom)‹X› & [RowTypeFrom](_ast_.md#rowtypefrom)‹Y› & [RowTypeFrom](_ast_.md#rowtypefrom)‹Z›*

Defined in ast.ts:146

___

###  RowTypeFrom

Ƭ **RowTypeFrom**: *T extends undefined ? object : T extends Field<infer V, infer N> ? object : T extends SelectColumn<infer V, infer N> ? object : T extends Star<infer M> ? object : T extends InputObject ? object : T extends Record<string, RowObject> ? object : object*

Defined in ast.ts:114

从 SELECT(...Identitfier) 中查询的属性及类型
将选择项，列、或者字段转换成Model类型

___

###  SelectAction

Ƭ **SelectAction**: *function*

Defined in ast.ts:1607

SELECT函数签名

#### Type declaration:

▸ ‹**T**›(`a`: [Star](../classes/_ast_.star.md)‹T›): *[Select](../classes/_ast_.select.md)‹T›*

选择列

**Type parameters:**

▪ **T**: *[RowObject](_ast_.md#rowobject)*

**Parameters:**

Name | Type |
------ | ------ |
`a` | [Star](../classes/_ast_.star.md)‹T› |

▸ ‹**A**›(`a`: A): *[Select](../classes/_ast_.select.md)‹[RowTypeByColumns](_ast_.md#rowtypebycolumns)‹A››*

**Type parameters:**

▪ **A**: *[SelectCloumn](_ast_.md#selectcloumn)*

**Parameters:**

Name | Type |
------ | ------ |
`a` | A |

▸ ‹**A**›(`a`: A): *[Select](../classes/_ast_.select.md)‹object›*

**Type parameters:**

▪ **A**: *[CompatibleExpression](_ast_.md#compatibleexpression)*

**Parameters:**

Name | Type |
------ | ------ |
`a` | A |

▸ ‹**T**›(`results`: T): *[Select](../classes/_ast_.select.md)‹[RowTypeFrom](_ast_.md#rowtypefrom)‹T››*

**Type parameters:**

▪ **T**: *[InputObject](_ast_.md#inputobject)‹T›*

**Parameters:**

Name | Type |
------ | ------ |
`results` | T |

▸ ‹**T**›(`results`: [InputObject](_ast_.md#inputobject)‹T›): *[Select](../classes/_ast_.select.md)‹T›*

**Type parameters:**

▪ **T**: *[RowObject](_ast_.md#rowobject)*

**Parameters:**

Name | Type |
------ | ------ |
`results` | [InputObject](_ast_.md#inputobject)‹T› |

▸ ‹**T**›(`expr`: [CompatibleExpression](_ast_.md#compatibleexpression)‹T›): *[Select](../classes/_ast_.select.md)‹object›*

**Type parameters:**

▪ **T**: *[ScalarType](_types_.md#scalartype)*

**Parameters:**

Name | Type |
------ | ------ |
`expr` | [CompatibleExpression](_ast_.md#compatibleexpression)‹T› |

▸ ‹**A**, **B**›(`a`: A, `b`: B): *[Select](../classes/_ast_.select.md)‹[RowTypeByColumns](_ast_.md#rowtypebycolumns)‹A, B››*

**Type parameters:**

▪ **A**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **B**: *[SelectCloumn](_ast_.md#selectcloumn)*

**Parameters:**

Name | Type |
------ | ------ |
`a` | A |
`b` | B |

▸ ‹**A**, **B**, **C**›(`a`: A, `b?`: B, `d?`: C): *[Select](../classes/_ast_.select.md)‹[RowTypeByColumns](_ast_.md#rowtypebycolumns)‹A, B, C››*

**Type parameters:**

▪ **A**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **B**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **C**: *[SelectCloumn](_ast_.md#selectcloumn)*

**Parameters:**

Name | Type |
------ | ------ |
`a` | A |
`b?` | B |
`d?` | C |

▸ ‹**A**, **B**, **C**, **D**›(`a`: A, `b`: B, `c`: C, `d`: D): *[Select](../classes/_ast_.select.md)‹[RowTypeByColumns](_ast_.md#rowtypebycolumns)‹A, B, C, D››*

**Type parameters:**

▪ **A**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **B**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **C**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **D**: *[SelectCloumn](_ast_.md#selectcloumn)*

**Parameters:**

Name | Type |
------ | ------ |
`a` | A |
`b` | B |
`c` | C |
`d` | D |

▸ ‹**A**, **B**, **C**, **D**, **E**›(`a`: A, `b`: B, `c`: C, `d`: D, `e`: E): *[Select](../classes/_ast_.select.md)‹[RowTypeByColumns](_ast_.md#rowtypebycolumns)‹A, B, C, D, E››*

**Type parameters:**

▪ **A**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **B**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **C**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **D**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **E**: *[SelectCloumn](_ast_.md#selectcloumn)*

**Parameters:**

Name | Type |
------ | ------ |
`a` | A |
`b` | B |
`c` | C |
`d` | D |
`e` | E |

▸ ‹**A**, **B**, **C**, **D**, **E**, **F**›(`a`: A, `b`: B, `c`: C, `d`: D, `e`: E, `f`: F): *[Select](../classes/_ast_.select.md)‹[RowTypeByColumns](_ast_.md#rowtypebycolumns)‹A, B, C, D, E, F››*

**Type parameters:**

▪ **A**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **B**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **C**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **D**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **E**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **F**: *[SelectCloumn](_ast_.md#selectcloumn)*

**Parameters:**

Name | Type |
------ | ------ |
`a` | A |
`b` | B |
`c` | C |
`d` | D |
`e` | E |
`f` | F |

▸ ‹**A**, **B**, **C**, **D**, **E**, **F**, **G**›(`a`: A, `b`: B, `c`: C, `d`: D, `e`: E, `f`: F, `g`: G): *[Select](../classes/_ast_.select.md)‹[RowTypeByColumns](_ast_.md#rowtypebycolumns)‹A, B, C, D, E, F, G››*

**Type parameters:**

▪ **A**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **B**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **C**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **D**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **E**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **F**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **G**: *[SelectCloumn](_ast_.md#selectcloumn)*

**Parameters:**

Name | Type |
------ | ------ |
`a` | A |
`b` | B |
`c` | C |
`d` | D |
`e` | E |
`f` | F |
`g` | G |

▸ ‹**A**, **B**, **C**, **D**, **E**, **F**, **G**, **H**›(`a`: A, `b`: B, `c`: C, `d`: D, `e`: E, `f`: F, `g`: G, `h`: H): *[Select](../classes/_ast_.select.md)‹[RowTypeByColumns](_ast_.md#rowtypebycolumns)‹A, B, C, D, E, F, G, H››*

**Type parameters:**

▪ **A**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **B**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **C**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **D**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **E**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **F**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **G**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **H**: *[SelectCloumn](_ast_.md#selectcloumn)*

**Parameters:**

Name | Type |
------ | ------ |
`a` | A |
`b` | B |
`c` | C |
`d` | D |
`e` | E |
`f` | F |
`g` | G |
`h` | H |

▸ ‹**A**, **B**, **C**, **D**, **E**, **F**, **G**, **H**, **I**›(`a`: A, `b`: B, `c`: C, `d`: D, `e`: E, `f`: F, `g`: G, `h`: H, `i`: I): *[Select](../classes/_ast_.select.md)‹[RowTypeByColumns](_ast_.md#rowtypebycolumns)‹A, B, C, D, E, F, G, H, I››*

**Type parameters:**

▪ **A**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **B**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **C**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **D**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **E**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **F**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **G**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **H**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **I**: *[SelectCloumn](_ast_.md#selectcloumn)*

**Parameters:**

Name | Type |
------ | ------ |
`a` | A |
`b` | B |
`c` | C |
`d` | D |
`e` | E |
`f` | F |
`g` | G |
`h` | H |
`i` | I |

▸ ‹**A**, **B**, **C**, **D**, **E**, **F**, **G**, **H**, **I**, **J**›(`a`: A, `b`: B, `c`: C, `d`: D, `e`: E, `f`: F, `g`: G, `h`: H, `i`: I, `j`: J): *[Select](../classes/_ast_.select.md)‹[RowTypeByColumns](_ast_.md#rowtypebycolumns)‹A, B, C, D, E, F, G, H, I, J››*

**Type parameters:**

▪ **A**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **B**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **C**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **D**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **E**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **F**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **G**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **H**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **I**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **J**: *[SelectCloumn](_ast_.md#selectcloumn)*

**Parameters:**

Name | Type |
------ | ------ |
`a` | A |
`b` | B |
`c` | C |
`d` | D |
`e` | E |
`f` | F |
`g` | G |
`h` | H |
`i` | I |
`j` | J |

▸ ‹**A**, **B**, **C**, **D**, **E**, **F**, **G**, **H**, **I**, **J**, **K**›(`a`: A, `b`: B, `c`: C, `d`: D, `e`: E, `f`: F, `g`: G, `h`: H, `i`: I, `j`: J, `k`: K): *[Select](../classes/_ast_.select.md)‹[RowTypeByColumns](_ast_.md#rowtypebycolumns)‹A, B, C, D, E, F, G, H, I, J, K››*

**Type parameters:**

▪ **A**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **B**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **C**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **D**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **E**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **F**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **G**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **H**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **I**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **J**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **K**: *[SelectCloumn](_ast_.md#selectcloumn)*

**Parameters:**

Name | Type |
------ | ------ |
`a` | A |
`b` | B |
`c` | C |
`d` | D |
`e` | E |
`f` | F |
`g` | G |
`h` | H |
`i` | I |
`j` | J |
`k` | K |

▸ ‹**A**, **B**, **C**, **D**, **E**, **F**, **G**, **H**, **I**, **J**, **K**, **L**›(`a`: A, `b`: B, `c`: C, `d`: D, `e`: E, `f`: F, `g`: G, `h`: H, `i`: I, `j`: J, `k`: K, `l`: L): *[Select](../classes/_ast_.select.md)‹[RowTypeByColumns](_ast_.md#rowtypebycolumns)‹A, B, C, D, E, F, G, H, I, J, K, L››*

**Type parameters:**

▪ **A**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **B**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **C**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **D**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **E**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **F**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **G**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **H**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **I**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **J**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **K**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **L**: *[SelectCloumn](_ast_.md#selectcloumn)*

**Parameters:**

Name | Type |
------ | ------ |
`a` | A |
`b` | B |
`c` | C |
`d` | D |
`e` | E |
`f` | F |
`g` | G |
`h` | H |
`i` | I |
`j` | J |
`k` | K |
`l` | L |

▸ ‹**A**, **B**, **C**, **D**, **E**, **F**, **G**, **H**, **I**, **J**, **K**, **L**, **M**›(`a`: A, `b`: B, `c`: C, `d`: D, `e`: E, `f`: F, `g`: G, `h`: H, `i`: I, `j`: J, `k`: K, `l`: L, `m`: M): *[Select](../classes/_ast_.select.md)‹[RowTypeByColumns](_ast_.md#rowtypebycolumns)‹A, B, C, D, E, F, G, H, I, J, K, L, M››*

**Type parameters:**

▪ **A**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **B**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **C**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **D**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **E**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **F**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **G**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **H**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **I**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **J**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **K**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **L**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **M**: *[SelectCloumn](_ast_.md#selectcloumn)*

**Parameters:**

Name | Type |
------ | ------ |
`a` | A |
`b` | B |
`c` | C |
`d` | D |
`e` | E |
`f` | F |
`g` | G |
`h` | H |
`i` | I |
`j` | J |
`k` | K |
`l` | L |
`m` | M |

▸ ‹**A**, **B**, **C**, **D**, **E**, **F**, **G**, **H**, **I**, **J**, **K**, **L**, **M**, **N**›(`a`: A, `b`: B, `c`: C, `d`: D, `e`: E, `f`: F, `g`: G, `h`: H, `i`: I, `j`: J, `k`: K, `l`: L, `m`: M, `n`: N): *[Select](../classes/_ast_.select.md)‹[RowTypeByColumns](_ast_.md#rowtypebycolumns)‹A, B, C, D, E, F, G, H, I, J, K, L, M, N››*

**Type parameters:**

▪ **A**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **B**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **C**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **D**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **E**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **F**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **G**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **H**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **I**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **J**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **K**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **L**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **M**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **N**: *[SelectCloumn](_ast_.md#selectcloumn)*

**Parameters:**

Name | Type |
------ | ------ |
`a` | A |
`b` | B |
`c` | C |
`d` | D |
`e` | E |
`f` | F |
`g` | G |
`h` | H |
`i` | I |
`j` | J |
`k` | K |
`l` | L |
`m` | M |
`n` | N |

▸ ‹**A**, **B**, **C**, **D**, **E**, **F**, **G**, **H**, **I**, **J**, **K**, **L**, **M**, **N**, **O**›(`a`: A, `b`: B, `c`: C, `d`: D, `e`: E, `f`: F, `g`: G, `h`: H, `i`: I, `j`: J, `k`: K, `l`: L, `m`: M, `n`: N, `o`: O): *[Select](../classes/_ast_.select.md)‹[RowTypeByColumns](_ast_.md#rowtypebycolumns)‹A, B, C, D, E, F, G, H, I, J, K, L, M, N, O››*

**Type parameters:**

▪ **A**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **B**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **C**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **D**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **E**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **F**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **G**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **H**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **I**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **J**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **K**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **L**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **M**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **N**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **O**: *[SelectCloumn](_ast_.md#selectcloumn)*

**Parameters:**

Name | Type |
------ | ------ |
`a` | A |
`b` | B |
`c` | C |
`d` | D |
`e` | E |
`f` | F |
`g` | G |
`h` | H |
`i` | I |
`j` | J |
`k` | K |
`l` | L |
`m` | M |
`n` | N |
`o` | O |

▸ ‹**A**, **B**, **C**, **D**, **E**, **F**, **G**, **H**, **I**, **J**, **K**, **L**, **M**, **N**, **O**, **P**›(`a`: A, `b`: B, `c`: C, `d`: D, `e`: E, `f`: F, `g`: G, `h`: H, `i`: I, `j`: J, `k`: K, `l`: L, `m`: M, `n`: N, `o`: O, `p`: P): *[Select](../classes/_ast_.select.md)‹[RowTypeByColumns](_ast_.md#rowtypebycolumns)‹A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P››*

**Type parameters:**

▪ **A**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **B**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **C**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **D**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **E**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **F**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **G**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **H**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **I**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **J**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **K**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **L**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **M**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **N**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **O**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **P**: *[SelectCloumn](_ast_.md#selectcloumn)*

**Parameters:**

Name | Type |
------ | ------ |
`a` | A |
`b` | B |
`c` | C |
`d` | D |
`e` | E |
`f` | F |
`g` | G |
`h` | H |
`i` | I |
`j` | J |
`k` | K |
`l` | L |
`m` | M |
`n` | N |
`o` | O |
`p` | P |

▸ ‹**A**, **B**, **C**, **D**, **E**, **F**, **G**, **H**, **I**, **J**, **K**, **L**, **M**, **N**, **O**, **P**, **Q**›(`a`: A, `b`: B, `c`: C, `d`: D, `e`: E, `f`: F, `g`: G, `h`: H, `i`: I, `j`: J, `k`: K, `l`: L, `m`: M, `n`: N, `o`: O, `p`: P, `q`: Q): *[Select](../classes/_ast_.select.md)‹[RowTypeByColumns](_ast_.md#rowtypebycolumns)‹A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q››*

**Type parameters:**

▪ **A**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **B**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **C**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **D**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **E**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **F**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **G**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **H**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **I**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **J**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **K**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **L**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **M**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **N**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **O**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **P**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **Q**: *[SelectCloumn](_ast_.md#selectcloumn)*

**Parameters:**

Name | Type |
------ | ------ |
`a` | A |
`b` | B |
`c` | C |
`d` | D |
`e` | E |
`f` | F |
`g` | G |
`h` | H |
`i` | I |
`j` | J |
`k` | K |
`l` | L |
`m` | M |
`n` | N |
`o` | O |
`p` | P |
`q` | Q |

▸ ‹**A**, **B**, **C**, **D**, **E**, **F**, **G**, **H**, **I**, **J**, **K**, **L**, **M**, **N**, **O**, **P**, **Q**, **R**›(`a`: A, `b`: B, `c`: C, `d`: D, `e`: E, `f`: F, `g`: G, `h`: H, `i`: I, `j`: J, `k`: K, `l`: L, `m`: M, `n`: N, `o`: O, `p`: P, `q`: Q, `r`: R): *[Select](../classes/_ast_.select.md)‹[RowTypeByColumns](_ast_.md#rowtypebycolumns)‹A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R››*

**Type parameters:**

▪ **A**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **B**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **C**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **D**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **E**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **F**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **G**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **H**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **I**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **J**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **K**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **L**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **M**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **N**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **O**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **P**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **Q**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **R**: *[SelectCloumn](_ast_.md#selectcloumn)*

**Parameters:**

Name | Type |
------ | ------ |
`a` | A |
`b` | B |
`c` | C |
`d` | D |
`e` | E |
`f` | F |
`g` | G |
`h` | H |
`i` | I |
`j` | J |
`k` | K |
`l` | L |
`m` | M |
`n` | N |
`o` | O |
`p` | P |
`q` | Q |
`r` | R |

▸ ‹**A**, **B**, **C**, **D**, **E**, **F**, **G**, **H**, **I**, **J**, **K**, **L**, **M**, **N**, **O**, **P**, **Q**, **R**, **S**›(`a`: A, `b`: B, `c`: C, `d`: D, `e`: E, `f`: F, `g`: G, `h`: H, `i`: I, `j`: J, `k`: K, `l`: L, `m`: M, `n`: N, `o`: O, `p`: P, `q`: Q, `r`: R, `s`: S): *[Select](../classes/_ast_.select.md)‹[RowTypeByColumns](_ast_.md#rowtypebycolumns)‹A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S››*

**Type parameters:**

▪ **A**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **B**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **C**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **D**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **E**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **F**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **G**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **H**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **I**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **J**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **K**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **L**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **M**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **N**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **O**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **P**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **Q**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **R**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **S**: *[SelectCloumn](_ast_.md#selectcloumn)*

**Parameters:**

Name | Type |
------ | ------ |
`a` | A |
`b` | B |
`c` | C |
`d` | D |
`e` | E |
`f` | F |
`g` | G |
`h` | H |
`i` | I |
`j` | J |
`k` | K |
`l` | L |
`m` | M |
`n` | N |
`o` | O |
`p` | P |
`q` | Q |
`r` | R |
`s` | S |

▸ ‹**A**, **B**, **C**, **D**, **E**, **F**, **G**, **H**, **I**, **J**, **K**, **L**, **M**, **N**, **O**, **P**, **Q**, **R**, **S**, **T**›(`a`: A, `b`: B, `c`: C, `d`: D, `e`: E, `f`: F, `g`: G, `h`: H, `i`: I, `j`: J, `k`: K, `l`: L, `m`: M, `n`: N, `o`: O, `p`: P, `q`: Q, `r`: R, `s`: S, `t`: T): *[Select](../classes/_ast_.select.md)‹[RowTypeByColumns](_ast_.md#rowtypebycolumns)‹A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T››*

**Type parameters:**

▪ **A**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **B**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **C**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **D**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **E**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **F**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **G**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **H**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **I**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **J**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **K**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **L**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **M**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **N**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **O**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **P**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **Q**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **R**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **S**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **T**: *[SelectCloumn](_ast_.md#selectcloumn)*

**Parameters:**

Name | Type |
------ | ------ |
`a` | A |
`b` | B |
`c` | C |
`d` | D |
`e` | E |
`f` | F |
`g` | G |
`h` | H |
`i` | I |
`j` | J |
`k` | K |
`l` | L |
`m` | M |
`n` | N |
`o` | O |
`p` | P |
`q` | Q |
`r` | R |
`s` | S |
`t` | T |

▸ ‹**A**, **B**, **C**, **D**, **E**, **F**, **G**, **H**, **I**, **J**, **K**, **L**, **M**, **N**, **O**, **P**, **Q**, **R**, **S**, **T**, **U**›(`a`: A, `b`: B, `c`: C, `d`: D, `e`: E, `f`: F, `g`: G, `h`: H, `i`: I, `j`: J, `k`: K, `l`: L, `m`: M, `n`: N, `o`: O, `p`: P, `q`: Q, `r`: R, `s`: S, `t`: T, `u`: U): *[Select](../classes/_ast_.select.md)‹[RowTypeByColumns](_ast_.md#rowtypebycolumns)‹A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U››*

**Type parameters:**

▪ **A**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **B**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **C**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **D**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **E**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **F**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **G**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **H**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **I**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **J**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **K**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **L**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **M**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **N**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **O**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **P**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **Q**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **R**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **S**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **T**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **U**: *[SelectCloumn](_ast_.md#selectcloumn)*

**Parameters:**

Name | Type |
------ | ------ |
`a` | A |
`b` | B |
`c` | C |
`d` | D |
`e` | E |
`f` | F |
`g` | G |
`h` | H |
`i` | I |
`j` | J |
`k` | K |
`l` | L |
`m` | M |
`n` | N |
`o` | O |
`p` | P |
`q` | Q |
`r` | R |
`s` | S |
`t` | T |
`u` | U |

▸ ‹**A**, **B**, **C**, **D**, **E**, **F**, **G**, **H**, **I**, **J**, **K**, **L**, **M**, **N**, **O**, **P**, **Q**, **R**, **S**, **T**, **U**, **V**›(`a`: A, `b`: B, `c`: C, `d`: D, `e`: E, `f`: F, `g`: G, `h`: H, `i`: I, `j`: J, `k`: K, `l`: L, `m`: M, `n`: N, `o`: O, `p`: P, `q`: Q, `r`: R, `s`: S, `t`: T, `u`: U, `v`: V): *[Select](../classes/_ast_.select.md)‹[RowTypeByColumns](_ast_.md#rowtypebycolumns)‹A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V››*

**Type parameters:**

▪ **A**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **B**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **C**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **D**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **E**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **F**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **G**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **H**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **I**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **J**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **K**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **L**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **M**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **N**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **O**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **P**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **Q**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **R**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **S**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **T**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **U**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **V**: *[SelectCloumn](_ast_.md#selectcloumn)*

**Parameters:**

Name | Type |
------ | ------ |
`a` | A |
`b` | B |
`c` | C |
`d` | D |
`e` | E |
`f` | F |
`g` | G |
`h` | H |
`i` | I |
`j` | J |
`k` | K |
`l` | L |
`m` | M |
`n` | N |
`o` | O |
`p` | P |
`q` | Q |
`r` | R |
`s` | S |
`t` | T |
`u` | U |
`v` | V |

▸ ‹**A**, **B**, **C**, **D**, **E**, **F**, **G**, **H**, **I**, **J**, **K**, **L**, **M**, **N**, **O**, **P**, **Q**, **R**, **S**, **T**, **U**, **V**, **W**›(`a`: A, `b`: B, `c`: C, `d`: D, `e`: E, `f`: F, `g`: G, `h`: H, `i`: I, `j`: J, `k`: K, `l`: L, `m`: M, `n`: N, `o`: O, `p`: P, `q`: Q, `r`: R, `s`: S, `t`: T, `u`: U, `v`: V, `w`: W): *[Select](../classes/_ast_.select.md)‹[RowTypeByColumns](_ast_.md#rowtypebycolumns)‹A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W››*

**Type parameters:**

▪ **A**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **B**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **C**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **D**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **E**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **F**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **G**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **H**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **I**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **J**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **K**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **L**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **M**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **N**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **O**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **P**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **Q**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **R**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **S**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **T**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **U**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **V**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **W**: *[SelectCloumn](_ast_.md#selectcloumn)*

**Parameters:**

Name | Type |
------ | ------ |
`a` | A |
`b` | B |
`c` | C |
`d` | D |
`e` | E |
`f` | F |
`g` | G |
`h` | H |
`i` | I |
`j` | J |
`k` | K |
`l` | L |
`m` | M |
`n` | N |
`o` | O |
`p` | P |
`q` | Q |
`r` | R |
`s` | S |
`t` | T |
`u` | U |
`v` | V |
`w` | W |

▸ ‹**A**, **B**, **C**, **D**, **E**, **F**, **G**, **H**, **I**, **J**, **K**, **L**, **M**, **N**, **O**, **P**, **Q**, **R**, **S**, **T**, **U**, **V**, **W**, **X**›(`a`: A, `b`: B, `c`: C, `d`: D, `e`: E, `f`: F, `g`: G, `h`: H, `i`: I, `j`: J, `k`: K, `l`: L, `m`: M, `n`: N, `o`: O, `p`: P, `q`: Q, `r`: R, `s`: S, `t`: T, `u`: U, `v`: V, `w`: W, `x`: X): *[Select](../classes/_ast_.select.md)‹[RowTypeByColumns](_ast_.md#rowtypebycolumns)‹A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W, X››*

**Type parameters:**

▪ **A**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **B**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **C**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **D**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **E**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **F**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **G**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **H**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **I**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **J**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **K**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **L**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **M**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **N**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **O**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **P**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **Q**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **R**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **S**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **T**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **U**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **V**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **W**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **X**: *[SelectCloumn](_ast_.md#selectcloumn)*

**Parameters:**

Name | Type |
------ | ------ |
`a` | A |
`b` | B |
`c` | C |
`d` | D |
`e` | E |
`f` | F |
`g` | G |
`h` | H |
`i` | I |
`j` | J |
`k` | K |
`l` | L |
`m` | M |
`n` | N |
`o` | O |
`p` | P |
`q` | Q |
`r` | R |
`s` | S |
`t` | T |
`u` | U |
`v` | V |
`w` | W |
`x` | X |

▸ ‹**A**, **B**, **C**, **D**, **E**, **F**, **G**, **H**, **I**, **J**, **K**, **L**, **M**, **N**, **O**, **P**, **Q**, **R**, **S**, **T**, **U**, **V**, **W**, **X**, **Y**›(`a`: A, `b`: B, `c`: C, `d`: D, `e`: E, `f`: F, `g`: G, `h`: H, `i`: I, `j`: J, `k`: K, `l`: L, `m`: M, `n`: N, `o`: O, `p`: P, `q`: Q, `r`: R, `s`: S, `t`: T, `u`: U, `v`: V, `w`: W, `x`: X, `y`: Y): *[Select](../classes/_ast_.select.md)‹[RowTypeByColumns](_ast_.md#rowtypebycolumns)‹A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W, X, Y››*

**Type parameters:**

▪ **A**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **B**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **C**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **D**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **E**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **F**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **G**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **H**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **I**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **J**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **K**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **L**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **M**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **N**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **O**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **P**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **Q**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **R**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **S**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **T**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **U**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **V**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **W**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **X**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **Y**: *[SelectCloumn](_ast_.md#selectcloumn)*

**Parameters:**

Name | Type |
------ | ------ |
`a` | A |
`b` | B |
`c` | C |
`d` | D |
`e` | E |
`f` | F |
`g` | G |
`h` | H |
`i` | I |
`j` | J |
`k` | K |
`l` | L |
`m` | M |
`n` | N |
`o` | O |
`p` | P |
`q` | Q |
`r` | R |
`s` | S |
`t` | T |
`u` | U |
`v` | V |
`w` | W |
`x` | X |
`y` | Y |

▸ ‹**A**, **B**, **C**, **D**, **E**, **F**, **G**, **H**, **I**, **J**, **K**, **L**, **M**, **N**, **O**, **P**, **Q**, **R**, **S**, **T**, **U**, **V**, **W**, **X**, **Y**, **Z**›(`a`: A, `b`: B, `c`: C, `d`: D, `e`: E, `f`: F, `g`: G, `h`: H, `i`: I, `j`: J, `k`: K, `l`: L, `m`: M, `n`: N, `o`: O, `p`: P, `q`: Q, `r`: R, `s`: S, `t`: T, `u`: U, `v`: V, `w`: W, `x`: X, `y`: Y, `z`: Z): *[Select](../classes/_ast_.select.md)‹[RowTypeByColumns](_ast_.md#rowtypebycolumns)‹A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W, X, Y, Z››*

**Type parameters:**

▪ **A**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **B**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **C**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **D**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **E**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **F**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **G**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **H**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **I**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **J**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **K**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **L**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **M**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **N**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **O**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **P**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **Q**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **R**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **S**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **T**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **U**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **V**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **W**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **X**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **Y**: *[SelectCloumn](_ast_.md#selectcloumn)*

▪ **Z**: *[SelectCloumn](_ast_.md#selectcloumn)*

**Parameters:**

Name | Type |
------ | ------ |
`a` | A |
`b` | B |
`c` | C |
`d` | D |
`e` | E |
`f` | F |
`g` | G |
`h` | H |
`i` | I |
`j` | J |
`k` | K |
`l` | L |
`m` | M |
`n` | N |
`o` | O |
`p` | P |
`q` | Q |
`r` | R |
`s` | S |
`t` | T |
`u` | U |
`v` | V |
`w` | W |
`x` | X |
`y` | Y |
`z` | Z |

▸ (...`exprs`: [CompatibleExpression](_ast_.md#compatibleexpression)[]): *[Select](../classes/_ast_.select.md)‹any›*

**Parameters:**

Name | Type |
------ | ------ |
`...exprs` | [CompatibleExpression](_ast_.md#compatibleexpression)[] |

▸ ‹**T**›(...`columns`: string | number | bigint | false | true | ArrayBuffer | SharedArrayBuffer | Date | [Expression](../classes/_ast_.expression.md)‹string | number | bigint | false | true | ArrayBuffer | SharedArrayBuffer | Date› | [SelectColumn](../classes/_ast_.selectcolumn.md)‹string | number | bigint | false | true | ArrayBuffer | SharedArrayBuffer | Date, string› | [Star](../classes/_ast_.star.md)‹any›[]): *[Select](../classes/_ast_.select.md)‹T›*

**Type parameters:**

▪ **T**: *[RowObject](_ast_.md#rowobject)*

**Parameters:**

Name | Type |
------ | ------ |
`...columns` | string &#124; number &#124; bigint &#124; false &#124; true &#124; ArrayBuffer &#124; SharedArrayBuffer &#124; Date &#124; [Expression](../classes/_ast_.expression.md)‹string &#124; number &#124; bigint &#124; false &#124; true &#124; ArrayBuffer &#124; SharedArrayBuffer &#124; Date› &#124; [SelectColumn](../classes/_ast_.selectcolumn.md)‹string &#124; number &#124; bigint &#124; false &#124; true &#124; ArrayBuffer &#124; SharedArrayBuffer &#124; Date, string› &#124; [Star](../classes/_ast_.star.md)‹any›[] |

___

###  SelectAliasObject

Ƭ **SelectAliasObject**: *object*

Defined in ast.ts:4101

#### Type declaration:

* \[ **alias**: *string*\]: [Select](../classes/_ast_.select.md)

___

###  SelectCloumn

Ƭ **SelectCloumn**: *[Field](../classes/_ast_.field.md)‹[ScalarType](_types_.md#scalartype), string› | [SelectColumn](../classes/_ast_.selectcolumn.md)‹[ScalarType](_types_.md#scalartype), string› | [Star](../classes/_ast_.star.md)‹any›*

Defined in ast.ts:141

select语句可以接收的列

___

###  SortObject

Ƭ **SortObject**: *object*

Defined in ast.ts:3324

排序对象

#### Type declaration:

___

###  TypeOf

Ƭ **TypeOf**: *T extends ScalarType ? T : T extends Expression<infer X> ? X : T extends RowObject ? T : never*

Defined in ast.ts:102

获取表达式/或者对像所表示的类型

___

###  WhereObject

Ƭ **WhereObject**: *object*

Defined in ast.ts:86

简化后的whereObject查询条件

#### Type declaration:

## Functions

###  applyMixins

▸ **applyMixins**(`derivedCtor`: any, `baseCtors`: any[]): *void*

Defined in ast.ts:48

混入函数，必须放最前面，避免循环引用导致无法获取

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`derivedCtor` | any | - |
`baseCtors` | any[] |   |

**Returns:** *void*
