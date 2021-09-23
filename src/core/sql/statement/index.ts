import { If, While, Block, Break, Continue, Return } from '..';
import { Delete, Insert, Select, Update } from './crud';
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
  CreateView,
  DropDatabase,
  DropFunction,
  DropIndex,
  DropProcedure,
  DropSequence,
  DropTable,
  DropView,
  Use,
} from './migrate';

import { Assignment, Declare } from './programmer';
import { StandardStatement } from './other/standard-statement';

export * from './control';
export * from './crud';
export * from './migrate';
export * from './other';
export * from './programmer';

export * from './statement';

/**
 * CRUD语句，允许 接WITH语句
 */
export declare type CrudStatement = Insert | Update | Select | Delete;
export declare type SchemaStatement =
  | CreateDatabase
  | AlterDatabase
  | DropDatabase
  | CreateFunction
  | AlterFunction
  | DropFunction
  | CreateIndex
  | DropIndex
  | CreateProcedure
  | AlterProcedure
  | DropProcedure
  | CreateSequence
  | DropSequence
  | CreateTable
  | AlterTable
  | DropTable
  | CreateView
  | AlterView
  | DropView;
export declare type ProgramStatement =
  | If
  | While
  | Block
  | Break
  | Continue
  | Return;

/**
 * 功能性语句
 */
export declare type FunctionStatement =
  | Use
  | Assignment
  | Declare
  | CrudStatement
  | StandardStatement;

export declare type AllStatement =
  | FunctionStatement
  | SchemaStatement
  | ProgramStatement;
