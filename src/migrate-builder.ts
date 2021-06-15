import { Condition, Document } from "./ast";
import {
  CheckConstraintSchema,
  ColumnSchema,
  ForeignKeySchema,
  IndexSchema,
  SequenceSchema,
  TableSchema,
} from "./schema";
import { Name } from "./types";

export interface CreateTableCommand {
  operation: "CREATE_TABLE";
  data: {
    table: TableSchema;
  };
}

export interface DropTableCommand {
  operation: "DROP_TABLE";
  data: {
    name: Name<string>;
  };
}

export interface CreateIndexCommand {
  operation: "CREATE_INDEX";
  data: {
    table: Name<string>;
    index: IndexSchema;
  };
}

export interface DropIndexCommand {
  operation: "DROP_INDEX";
  data: {
    table: Name<string>;
    name: string;
  };
}

export interface DropColumnCommand {
  operation: "DROP_COLUMN";
  data: {
    table: Name<string>;
    name: string;
  };
}

export interface RenameColumnCommand {
  operation: "RENAME_COLUMN";
  data: {
    table: Name<string>;
    name: string;
    newName: string;
  };
}

export interface RenameIndexCommand {
  operation: "RENAME_INDEX";
  data: {
    table: Name<string>;
    name: string;
    newName: string;
  };
}

export interface RenameTableCommand {
  operation: "RENAME_TABLE";
  data: {
    name: Name<string>;
    newName: Name<string>;
  };
}

export interface AddColumnCommand {
  operation: "ADD_COLUMN";
  data: {
    table: Name<string>;
    column: ColumnSchema;
  };
}

export interface AddForeignKeyCommand {
  operation: "ADD_FOREIGN_KEY";
  data: {
    table: Name<string>;
    foreignKey: ForeignKeySchema;
  };
}

export interface DropForeignKeyCommand {
  operation: "DROP_FOREIGN_KEY";
  data: {
    table: Name<string>;
    name: string;
  };
}

export interface AlterColumnCommand {
  operation: "ALTER_COLUMN";
  data: {
    table: Name<string>;
    column: Partial<ColumnSchema>;
  };
}

export interface InsertDataCommand {
  operation: "INSERT_DATA";
  data: {
    identityInsertOff: boolean;
    table: Name<string>;
    rows: Record<string, any>[];
  };
}

export interface UpdateDataCommand {
  operation: "UPDATE_DATA";
  data: {
    table: Name<string>;
    keyColumns: string[];
    rows: Record<string, any>[];
  };
}

export interface DeleteDataCommand {
  operation: "DELETE_DATA";
  data: {
    table: Name<string>;
    where: Condition;
  };
}

export interface SqlCommand {
  operation: "SQL";
  data: {
    sql: string | Document;
  };
}

export interface CreateSequenceCommand {
  operation: "CREATE_SEQUENCE";
  data: {
    sequence: SequenceSchema;
  };
}

export interface DropSequenceCommand {
  operation: "DROP_SEQUENCE";
  data: {
    name: Name<string>;
  };
}

export interface AddCheckConstraintCommand {
  operation: "ADD_CHECK_CONSTRAINT";
  data: {
    table: Name<string>;
    checkConstraint: CheckConstraintSchema;
  };
}

export interface DropCehckConstraintCommand {
  operation: "DROP_CHECK_CONSTRAINT";
  data: {
    table: Name<string>;
    name: string;
  };
}

export interface RestartSequenceCommand {
  operation: "RESTART_SEQUENCE";
  data: {
    name: Name<string>;
  };
}

export type MigrationCommand =
  | CreateTableCommand
  | DropTableCommand
  | CreateIndexCommand
  | DropIndexCommand
  | DropColumnCommand
  | RenameColumnCommand
  | AddColumnCommand
  | AlterColumnCommand
  | RenameTableCommand
  | RenameIndexCommand
  | AddForeignKeyCommand
  | DropForeignKeyCommand
  | InsertDataCommand
  | UpdateDataCommand
  | DeleteDataCommand
  | SqlCommand
  | CreateSequenceCommand
  | DropSequenceCommand
  | RestartSequenceCommand
  | AddCheckConstraintCommand
  | DropCehckConstraintCommand;

export class MigrationBuilder {
  private _commands: MigrationCommand[] = [];

  createTable(table: TableSchema): this {
    this._commands.push({
      operation: "CREATE_TABLE",
      data: { table },
    });
    return this;
  }

  addIndex(table: Name<string>, index: IndexSchema): this {
    this._commands.push({
      operation: "CREATE_INDEX",
      data: {
        table,
        index,
      },
    });
    return this;
  }

  dropIndex(table: Name<string>, name: string): this {
    this._commands.push({
      operation: "DROP_INDEX",
      data: {
        table,
        name,
      },
    });
    return this;
  }

  addColumn(table: Name<string>, column: ColumnSchema): this {
    this._commands.push({
      operation: "ADD_COLUMN",
      data: {
        table,
        column,
      },
    });
    return this;
  }

  dropColumn(table: Name<string>, name: string): this {
    this._commands.push({
      operation: "DROP_COLUMN",
      data: {
        table,
        name,
      },
    });
    return this;
  }

  alterColumn(table: Name<string>, column: Partial<ColumnSchema>): this {
    this._commands.push({
      operation: "ALTER_COLUMN",
      data: {
        table,
        column,
      },
    });
    return this;
  }

  dropTable(name: Name<string>): this {
    this._commands.push({
      operation: "DROP_TABLE",
      data: {
        name,
      },
    });
    return this;
  }

  renameTable(name: Name<string>, newName: Name<string>): this {
    this._commands.push({
      operation: "RENAME_TABLE",
      data: {
        name,
        newName,
      },
    });
    return this;
  }

  renameColumn(table: Name<string>, name: string, newName: string): this {
    this._commands.push({
      operation: "RENAME_COLUMN",
      data: {
        table,
        name,
        newName,
      },
    });
    return this;
  }

  renameIndex(table: Name<string>, name: string, newName: string): this {
    this._commands.push({
      operation: "RENAME_INDEX",
      data: {
        table,
        name,
        newName,
      },
    });
    return this;
  }

  addForeignKey(table: Name<string>, foreignKey: ForeignKeySchema): this {
    this._commands.push({
      operation: "ADD_FOREIGN_KEY",
      data: {
        table,
        foreignKey,
      },
    });
    return this;
  }

  dropForeignKey(table: Name<string>, name: string): this {
    this._commands.push({
      operation: "DROP_FOREIGN_KEY",
      data: {
        table,
        name,
      },
    });
    return this;
  }

  insertData<T extends object>(
    table: Name<string>,
    rows: T[],
    identityInsertOff = false
  ): this {
    this._commands.push({
      operation: "INSERT_DATA",
      data: {
        table,
        rows,
        identityInsertOff,
      },
    });
    return this;
  }

  updateData<T extends object>(
    table: Name<string>,
    rows: T[],
    keyColumns: (keyof T)[]
  ): this {
    this._commands.push({
      operation: "UPDATE_DATA",
      data: {
        table,
        rows,
        keyColumns: keyColumns as string[],
      },
    });
    return this;
  }

  deleteData<T extends object>(
    table: Name<string>,
    where: Condition
  ): this {
    this._commands.push({
      operation: "DELETE_DATA",
      data: {
        table,
        where,
      },
    });
    return this;
  }

  sql(sql: Document | string): this {
    this._commands.push({
      operation: "SQL",
      data: {
        sql,
      },
    });
    return this;
  }

  createSequence(sequence: SequenceSchema) {
    this._commands.push({
      operation: "CREATE_SEQUENCE",
      data: {
        sequence,
      },
    });
    return this;
  }

  dropSequence(name: Name<string>): this {
    this._commands.push({
      operation: "DROP_SEQUENCE",
      data: {
        name,
      },
    });
    return this;
  }

  addCheckConstraint(
    table: Name<string>,
    checkConstraint: CheckConstraintSchema
  ): this {
    this._commands.push({
      operation: "ADD_CHECK_CONSTRAINT",
      data: {
        table,
        checkConstraint,
      },
    });
    return this;
  }

  dropCheckConstraint(table: Name<string>, name: string): this {
    this._commands.push({
      operation: "DROP_CHECK_CONSTRAINT",
      data: {
        table,
        name,
      },
    });
    return this;
  }
}
