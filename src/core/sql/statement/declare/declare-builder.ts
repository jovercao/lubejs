import { DbType } from "../../db-type";
import { TableVariantDeclare } from "./table-variant-declare";
import { VariantDeclare } from "./variant-declare";

export interface DeclareBuilder {
  variant(name: string, type: DbType): VariantDeclare;
  table(name: string): TableVariantDeclare;
}

export const DeclareBuilder: DeclareBuilder = {
  variant(name: string, type: DbType): VariantDeclare {
    return new VariantDeclare(name, type);
  },
  table(name: string): TableVariantDeclare {
    return new TableVariantDeclare(name);
  },
};
