import { parse, stringify, v4 } from 'uuid';

export class Uuid {
  constructor(strOrBuffer?: string | ArrayLike<number>) {
    if (!(this instanceof Uuid)) {
      return new Uuid(strOrBuffer);
    }
    if (typeof strOrBuffer === 'string') {
      this._buffer = Array.from(parse(strOrBuffer));
    } else if (strOrBuffer) {
      this._buffer = Array.from(strOrBuffer);
    } else {
      this._buffer = Uuid.DEFAULT;
    }
  }

  readonly [n: number]: number;
  private readonly _buffer!: number[];

  toString(): string {
    return stringify(this._buffer);
  }

  private static readonly DEFAULT = [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ];

  static new(): Uuid {
    const uuid = new Uuid();
    v4({}, uuid._buffer);
    return uuid;
  }

  static readonly empty = new Uuid(Uuid.DEFAULT);

  valueOf(): number[] {
    return this._buffer || Uuid.DEFAULT;
  }

  toJSON(): string {
    return this.toString();
  }

  static equals(left: Uuid, right: Uuid): boolean {
    for (let i = 0; i < 16; i++) {
      if (left._buffer[i] !== right._buffer[i]) {
        return false;
      }
    }
    return true;
  }
}
