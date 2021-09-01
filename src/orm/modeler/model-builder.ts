import { DbContextConstructor, DbContext } from '../db-context';
import {
  getConnectionOptions,
  getContextOptions,
  getComment,
  getEntityOptions,
  getEntityColumns,
  getColumnOptions,
  getIndexOptions,
  getEntityKeyOptions,
  getEntityRelations,
  getRelationOptions,
  getDecorateEntities,
  getAmong,
  getDecorateContexts,
} from '../decorators/reader';
import { EntityConstructor } from '../entity';
import { ContextBuilder } from './context-builder';
import { ManyToManyBuilder } from './many-to-many-builder';
import { OneToManyBuilder, ManyToOneBuilder } from './one-to-many-builder';
import { OneToOneBuilder, ForeignOneToOneBuilder } from './one-to-one-builder';

export class ModelBuilder {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  private buildDecoratorDbContext(target: DbContextConstructor) {
    const connectionOptions = getConnectionOptions(target);
    if (connectionOptions) {
      this.context(target).metadata.connection = connectionOptions;
    }
    const contextOptions = getContextOptions(target);
    if (contextOptions) {
      Object.assign(this.context(target).metadata, contextOptions);
    }
    const comment = getComment(target);
    if (comment) {
      this.context(target).hasComment(comment);
    }
  }

  private buildDecoratorEntity(target: EntityConstructor<any>) {
    const entityOptions = getEntityOptions(target)!;
    const { contextGetter, ...assignable } = entityOptions;
    const entityBuilder = this.context(contextGetter?.() || DbContext).entity(
      target
    );

    // Object.assign(entityBuilder.metadata, assignable);
    if (assignable.dbName) {
      entityBuilder.hasName(assignable.dbName);
    }

    // if (assignable.readonly) {
    //   entityBuilder.isReadonly()
    // }

    const columnProperties = getEntityColumns(target);
    if (columnProperties) {
      for (const property of columnProperties) {
        const columnOptions = getColumnOptions(target, property);
        if (columnOptions) {
          const columnBuilder = entityBuilder.property(
            p => p[property],
            columnOptions.type as any
          );
          if (columnOptions.columnName) {
            columnBuilder.hasColumnName(columnOptions.columnName);
          }
          if (columnOptions.dbType) {
            columnBuilder.hasType(columnOptions.dbType);
          }
          if (columnOptions.defaultValueGetter) {
            columnBuilder.hasDefaultValue(columnOptions.defaultValueGetter());
          }
          if (columnOptions.isNullable !== undefined) {
            if (columnOptions.isNullable) {
              columnBuilder.isNullable();
            } else {
              columnBuilder.isRequired();
            }
          }
          if (columnOptions.generator) {
            columnBuilder.isAutogen(columnOptions.generator);
          }
          if (columnOptions.isIdentity) {
            columnBuilder.isIdentity(
              columnOptions.identityStartValue,
              columnOptions.identityIncrement
            );
          }
          if (columnOptions.isCalculate) {
            columnBuilder.isCalculated(
              columnOptions.calculateExpressionGetter!()
            );
          }
          if (columnOptions.isRowflag) {
            columnBuilder.isRowflag();
          }

          const comment = getComment(target, property);
          if (comment) {
            columnBuilder.hasComment(comment);
          }
        }

        const indexOptions = getIndexOptions(target, property);
        if (indexOptions) {
          entityOptions.indexes.push(indexOptions);
        }
      }
    }
    if (assignable.kind === 'TABLE') {
      entityBuilder.asTable();
      const keyOptions = getEntityKeyOptions(target);
      if (keyOptions) {
        const keyBuilder = entityBuilder.hasKey(p => p[keyOptions.property!]);
        Object.assign(keyBuilder.metadata, keyOptions);
      }

      const relationProperties = getEntityRelations(target);
      if (relationProperties) {
        for (const property of relationProperties) {
          const relationOptions = getRelationOptions(target, property)!;
          let builder:
            | OneToOneBuilder<any, any>
            | OneToManyBuilder<any, any>
            | ManyToOneBuilder<any, any>
            | ManyToManyBuilder<any, any>;
          switch (relationOptions.kind) {
            case 'ONE_TO_ONE': {
              const map = entityBuilder
                .hasOne(
                  p => p[property],
                  relationOptions.referenceEntityGetter()
                )
                .withOne(
                  relationOptions.referenceProperty
                    ? p => p[relationOptions.referenceProperty!]
                    : undefined
                );
              if (relationOptions.isPrimary) {
                builder = map.isPrimary();
              } else {
                let bd: ForeignOneToOneBuilder<any, any>;
                builder = bd = map.hasForeignKey(
                  relationOptions.foreignProperty
                    ? p => p[relationOptions.foreignProperty!]
                    : undefined
                );
                if (relationOptions.isRequired) {
                  bd.isRequired();
                }
              }
              const comment = getComment(target, property);
              if (comment) {
                builder.hasComment(comment);
              }
              break;
            }
            case 'ONE_TO_MANY': {
              builder = entityBuilder
                .hasMany(
                  p => p[property],
                  relationOptions.referenceEntityGetter()
                )
                .withOne(
                  relationOptions.referenceProperty
                    ? (p: any) => p[relationOptions.referenceProperty!]
                    : undefined
                );
              break;
            }
            case 'MANY_TO_ONE': {
              builder = entityBuilder
                .hasOne(
                  p => p[property],
                  relationOptions.referenceEntityGetter()
                )
                .withMany(
                  relationOptions.referenceProperty
                    ? p => p[relationOptions.referenceProperty!]
                    : undefined
                );
              if (relationOptions.foreignProperty) {
                builder.hasForeignKey(p => p[relationOptions.foreignProperty!]);
              }
              if (relationOptions.isRequired) {
                builder.isRequired();
              }
              const comment = getComment(target, property);
              if (comment) {
                builder.hasComment(comment);
              }
              break;
            }
            case 'MANY_TO_MANY': {
              builder = entityBuilder
                .hasMany(
                  p => p[property],
                  relationOptions.referenceEntityGetter()
                )
                .withMany(
                  relationOptions.referenceProperty
                    ? (p: any) => p[relationOptions.referenceProperty!]
                    : undefined
                );
              // 查找中间表声明
              for (const relationEntity of getDecorateEntities()!) {
                const among = getAmong(relationEntity);
                if (!among) continue;

                const leftMatch =
                  among.leftEntityGetter() === target &&
                  among.rightEngityGetter() ===
                    relationOptions.referenceEntityGetter();
                const rightMatch =
                  among.rightEngityGetter() === target &&
                  among.leftEntityGetter() ===
                    relationOptions.referenceEntityGetter();
                if (leftMatch || rightMatch) {
                  // 声明表
                  builder.hasRelationTable(
                    relationEntity,
                    relationOptions.relationProperty
                      ? p => p[relationOptions.relationProperty!]
                      : undefined
                  );

                  if (relationOptions.relationProperty) {
                    if (leftMatch && among.leftProperty) {
                      entityBuilder
                        .hasMany(
                          p => p[relationOptions.relationProperty!],
                          relationEntity
                        )
                        .withOne((p: any) => p[among.leftProperty!]);
                    } else if (rightMatch && among.rightProperty) {
                      entityBuilder
                        .hasMany(
                          p => p[relationOptions.relationProperty!],
                          relationEntity
                        )
                        .withOne((p: any) => p[among.rightProperty!]);
                    }
                  }
                }
              }
              break;
            }
          }
        }
      }

      const among = getAmong(target);
      if (among) {
        if (among.leftProperty) {
          entityBuilder
            .hasOne(p => p[among.leftProperty!], among.leftEntityGetter())
            .withMany();
        }
        if (among.rightProperty) {
          entityBuilder.hasOne(
            p => p[among.rightProperty!],
            among.rightEngityGetter()
          );
        }
      }
      entityOptions.indexes.forEach(indexOptions => {
        const indexBuilder = entityBuilder.hasIndex(indexOptions.name!);
        indexBuilder.withProperties(
          Array.isArray(indexOptions.properties)
            ? p => indexOptions.properties as any
            : indexOptions.properties!
        );
        if (indexOptions.isUnique !== undefined) {
          indexBuilder.isUnique(indexOptions.isUnique);
        }
      });
    } else if (assignable.kind === 'VIEW') {
      if (!assignable.body) {
        throw new Error(`View entity must specify body statement.`);
      }
      entityBuilder.asView(assignable.body);
    } else if (assignable.kind === 'QUERY') {
      if (!assignable.sql) {
        throw new Error(`Query entity must specify body statement.`);
      }
      entityBuilder.asQuery(assignable.sql);
    }
  }

  static readonly instance = new ModelBuilder();

  private contextMap: Map<DbContextConstructor, ContextBuilder> = new Map();

  /**
   * 声明数据库上下文类
   * @param context 数据库上下文类
   * @param build 模型构建在此函数中完成，在build函数完成后会自动调用 builder.ensure()
   */
  context<T extends DbContext>(
    context: DbContextConstructor<T>,
    build: (builder: ContextBuilder<T>) => void | Promise<void>
  ): this;
  context<T extends DbContext>(
    context: DbContextConstructor<T>
  ): ContextBuilder<T>;
  context<T extends DbContext>(
    context: DbContextConstructor<T>,
    build?: (builder: ContextBuilder<T>) => void | Promise<void>
  ): ContextBuilder<T> | this {
    let builder = this.contextMap.get(context);
    if (!builder) {
      builder = new ContextBuilder(context);
      this.contextMap.set(context, builder);
    }
    if (build) {
      build(builder);
      return this;
    }
    return builder;
  }

  /**
   * 完成建模工作
   * 此方法请在ORM准备完毕时调用
   */
  ready() {
    const decorateContexts = getDecorateContexts();
    if (decorateContexts) {
      for (const context of decorateContexts) {
        this.buildDecoratorDbContext(context);
      }
    }

    const decoratorEntities = getDecorateEntities();
    if (decoratorEntities) {
      for (const entity of decoratorEntities) {
        this.buildDecoratorEntity(entity);
      }
    }

    for (const ctxBuilder of this.contextMap.values()) {
      if (!ctxBuilder.isReady) {
        ctxBuilder.ready();
      }
    }
  }
}

export const modelBuilder = ModelBuilder.instance;
