

export interface KeyColumn {
  name: string;
  sort: 'ASC' | 'DESC';
}

export type KeyColumns = KeyColumn[];

export type KeyColumnsObject = Record<string, 'ASC' | 'DESC'>;
