import { SQL, SQL_SYMBOLE } from '../../sql';
import { CompatiableObjectName } from '../../object/db-object';
import { CreateTableMember } from '../migrate/create-table';
import {
  TableVariantMember,
  TableVariantMemberBuilder,
} from '../migrate/table-variant-member-builder';

export class TableVariantDeclare<N extends string = string> extends SQL {
  $type: SQL_SYMBOLE.TABLE_VARIANT_DECLARE = SQL_SYMBOLE.TABLE_VARIANT_DECLARE;
  $members?: CreateTableMember[];
  $name: CompatiableObjectName<N>;
  static isTableVariantDeclare(object: any):object is TableVariantDeclare {
    return object?.$type === SQL_SYMBOLE.TABLE_VARIANT_DECLARE;
  }

  constructor(name: CompatiableObjectName<N>) {
    super();
    this.$name = name;
  }

  // has(build: (builder: CreateTableBuilder) => CreateTableMember[]): this {
  //   this.$members = build(CreateTable);
  //   return this;
  // }

  as(build: (builder: TableVariantMemberBuilder) => TableVariantMember[]): this;
  as(...members: TableVariantMember[]): this;
  as(
    ...members:
      | [(builder: TableVariantMemberBuilder) => TableVariantMember[]]
      | TableVariantMember[]
  ): this {
    if (typeof members[0] === 'function') {
      this.as(...members[0](TableVariantMemberBuilder));
      return this;
    }
    if (!this.$members) {
      this.$members = [];
    }
    this.$members.push(...(members as TableVariantMember[]));
    return this;
  }
}
