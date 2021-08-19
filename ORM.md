# ORM 使用手册

Lubejs所追求的是精而美，它不能适用于所有开发者，但是在适合使用它的项目中一定是最优雅和高效的。

## Lubejs ORM 强制规范

为了更优秀的用户体验，本ORM框架采用了以下强制规范，如果该规范与您的需求有冲突，则说明Lubejs不适合用于您的项目，敬请谅解。

1. 表必须有主键
2. 表主键必须为单一字段
3. 外键只能引用表的主键

## undefined 和 null 的使用

约定，null 对应数据库里的 DbNull，undefined则表示未定义项，将不会对数据库进行操作
如：  lube.update('table', { a: undefined, b: null });
输出的sql为 update table set b = DbNull

***注意：使用ORM时，Repository默认情况下会update所有字段，以避免类型或其它问题***

此情况在ORM关系属性当中亦适用，如：

```ts
db.save(Employee, {
  id: 100,
  name: 'username',
  user: undefined,
  position: null
});
```

此语句会将position的引用关系删除，
但不会删除user的引用关系

## 默认类型映射(由数据库驱动决定)

从JS类型到中间类型

- Number -> `DbType.int32`
- String -> `DbType.string(DbType.MAX)`
- Boolean -> `DbType.boolean`
- Buffer -> `DbType.Binary(DbType.MAX)`
- ArrayBuffer -> `DbType.Binary(DbType.MAX)`
- SharedArrayBuffer -> `DbType.Binary(DbType.MAX)`
- Object -> `DbType.object<any>()`
- Array -> `DbType.array<any>()`
- Uuid -> `DbType.uuid`
- Decimal -> `DbType.decimal`

## 数据建模 Code First模式(推荐使用)

### Lubejs ORM 建模约定

未指定主键的，自动建立id为主键；

### 使用装饰器

由于`typescript`装饰器及反射功能处于实验阶段尚不完善，因此该功能暂不提供使用。

### 使用Map Api建模

#### 标量列字段

#### 实体(Entity)

```ts
import { context, DbType } from 'lubejs';

/**
 * 人员实体类
 */
class Person {
  id: number;
  name: string;
  birthday: Date;
}

/**
 * 数据库上下文类
 */
class DefaultDbContext extends DbContext {
  get person(): Repository<Person> {
    return this.getRepository(Person);
  }
}

context(DefaultDbContext, builder => {
  const entity = builder.entity(Person)
  entity.column(p => p.id, Number).dbType(DbType.int32);
})

```

#### 关联关系

##### 一对一(主)

##### 一对一(从)

##### 一对多(主)

##### 多对一(从)

##### 一对多(中间表)

请使用[多对多(中间表)](多对多(中间表))关系代替，仅无须指定引用属性（实际上引用属性会被自动声明为隐式属性）。

##### 多对多(中间表)

#### 使用仓储对象 Repository

##### 关联关系操作

###### 什么情况下关联关系会被保存到数据库

只要未对实体实例的关系属性赋值（即属性未声明，`Reflect.has(item, property)`返回false, 赋`undefined`或`null`亦视为变更操作)，则不会对关系属性的数据进行操作；

###### 一对一（从）

【当属性存在值时】
Repository 会优先保存关联对象，并将对象的主键更新到当前实体的引用外键属性中，然后再保存实体本身。

【当属性不存在值时】
Repository 会将当前实体的引用外键属性设置为null，然后再保存实体本身。

###### 多对一（从）

【当属性存在值时】
Repository 会优先保存关联对象，并将对象的主键更新到当前实体的引用外键属性中，然后再保存实体本身。

【当属性不存在值时】
Repository 会将当前实体的引用外键属性设置为null，然后再保存实体本身。

###### 一对一（主）

【当属性存在值时】
Repository 会先保存实体本身，如果当前属性的关联对象并不是数据库中原本的关联对象，则会自动将原有的关联对象删除。
然后自动将本身的最新键值更新到关联属性外键中，然后再保存关联对象。

【设置成null或undefined时】
Repository 会将原有的关联对象视作删除操作处理

###### 一对多（主）

【当属性存在值时】
Repository 会先保存实体本身，如果关联集合中存在新的数据则保存，存在已有的数据，则会被更新，如果数据库原有关联对象不存在于当前关联集合中，Repository则会将该数据删除。

【设置成null或undefined或[]时】
Repository 会将其视为清空操作，并将数据库原有所有关联对象全部删除。

###### 多对多 (中间表)

【当属性存在值时】
Repository 会先保存实体本身，并同时保存关联对象集合，然后对中间表进行以下操作

- 集合中存在的并且数据库中间表关系亦存在的，不作变更
- 集合中存在的并且数据库中间表关系不存在的，新增中间表关联关系记录
- 集合中不存在并且数据库中间表关系存在的，删除中间表关联关系记录

【设置成null或undefined或[]时】
Repository 会将清空中间表的所有关联关系记录。

以上所有操作均不会删除关联表记录。

### 扩展关联关系

虚关系诣在为开发者提供一些数据库引用关系以外的支持，虚关系不会产生任何数据库外键约束。

#### 子查询属性（只读）

此功能是为了让视图、表或查询提供良好嵌套的查询体验而建立。

#### 动态关联属性

我们将没有强制约束，而是通过类型字段确定外键引用所关联目标表的这种关系称之为动态关联关系。
