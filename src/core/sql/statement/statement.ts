import { ColumnsOf, RowObject } from '../types';
import { SQL, SQL_SYMBOLE } from '../sql';
import {
  Assignable,
  Case,
  CompatibleExpression,
  Field,
  When,
} from '../expression';
import { isPlainObject } from '../util';
import {
  Declare,
  DeclareBuilder,
  TableVariantDeclare,
  VariantDeclare,
} from './declare';
import { Assignment, Execute } from './programmer';
import { Scalar } from '../scalar';
import { CompatiableObjectName, Procedure } from '../object';
import { CompatibleTable, WithSelect } from '../rowset';
import { Block } from './control/block';
import { Raw } from '../raw';
import {
  Delete,
  Insert,
  Select,
  SelectAction,
  SelectAliasObject,
  Update,
  With,
} from './crud';
import { DropFunction } from './migrate/drop-function';
import {
  AlterDatabase,
  AlterFunction,
  AlterProcedure,
  AlterTable,
  AlterView,
  CreateDatabase,
  CreateFunction,
  CreateIndex,
  CreateProcedure,
  CreateSequence,
  CreateTable,
  CreateTableHandler,
  CreateTableMemberBuilder,
  CreateView,
  DropDatabase,
  DropIndex,
  DropProcedure,
  DropSequence,
  DropTable,
  DropView,
  Use,
} from './migrate';
import { Annotation } from './other';
import { If, While } from './control';
import { Condition } from '../condition';

export enum STATEMENT_KIND {
  // RAW = 'RAW',
  SELECT = 'SELECT',
  UPDATE = 'UPDATE',
  INSERT = 'INSERT',
  EXECUTE = 'EXECUTE',
  DELETE = 'DELETE',
  DECLARE = 'DECLARE',
  ASSIGNMENT = 'ASSIGNMENT',
  CREATE_TABLE = 'CREATE_TABLE',
  CREATE_PROCEDURE = 'CREATE_PROCEDURE',
  CREATE_FUNCTION = 'CREATE_FUNCTION',
  CREATE_INDEX = 'CREATE_INDEX',
  CREATE_VIEW = 'CREATE_VIEW',
  ALTER_PROCEDURE = 'ALTER_PROCEDURE',
  ALTER_VIEW = 'ALTER_VIEW',
  ALTER_FUNCTION = 'ALTER_FUNCTION',
  ALTER_TABLE = 'ALTER_TABLE',
  DROP_VIEW = 'DROP_VIEW',
  DROP_FUNCTION = 'DROP_FUNCETION',
  DROP_PROCEDURE = 'DROP_PROCEDURE',
  DROP_TABLE = 'DROP_TABLE',
  DROP_INDEX = 'DROP_INDEX',
  BLOCK = 'BLOCK',
  STANDARD_STATEMENT = 'STANDARD_STATEMENT',
  CREATE_SEQUENCE = 'CREATE_SEQUENCE',
  DROP_SEQUENCE = 'DROP_SEQUENCE',
  ANNOTATION = 'ANNOTATION',
  IF = 'IF',
  WHILE = 'WHILE',
  BREAK = 'BREAK',
  CONTINUE = 'CONTINUE',
  DROP_DATABASE = 'DROP_DATABASE',
  CREATE_DATABASE = 'CREATE_DATABASE',
  ALTER_DATABASE = 'ALTER_DATABASE',
  USE = 'USE',
  RETURN = 'RETURN',
}

/**
 * SQL 语句
 */
export abstract class Statement extends SQL {
  readonly $type: SQL_SYMBOLE.STATEMENT = SQL_SYMBOLE.STATEMENT;
  abstract readonly $kind: STATEMENT_KIND;

  static isStatement(object: any): object is Statement {
    return object?.$type === SQL_SYMBOLE.STATEMENT;
  }
}
