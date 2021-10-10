const TicksPerMillisecond = 10000;

const HOUR_PRE_MILLISECOND = 60 * 60 * 1000;
const MINUTE_PRE_MILLISECOND = 60 * 1000;
const SECOND_PRE_MILLISECOND = 1000;

export class Time {
  constructor();
  constructor(
    hours: number,
    minutes?: number,
    seconds?: number,
    milliSeconds?: number
  );
  constructor(time: string);
  constructor(h?: number | string, m?: number, s?: number, ms?: number) {
    if (!(this instanceof Time)) {
      return new Time(h as any, m, s, ms);
    }
    if (h === undefined) {
      const now = new Date();
      h = now.getHours();
      m = now.getMinutes();
      s = now.getSeconds();
      ms = now.getMilliseconds();
    }

    if (typeof h === 'string') {
      this._time = this._parseTime(h);
    } else {
      this._time = this._toTicks(h, m!, s!, ms!);
    }
  }

  private _time!: number;

  valueOf() {
    return;
  }

  get hours(): number {
    return Math.floor(this._time / HOUR_PRE_MILLISECOND);
  }

  get minute(): number {
    return Math.floor(
      (this._time % HOUR_PRE_MILLISECOND) / MINUTE_PRE_MILLISECOND
    );
  }

  get seconds(): number {
    return Math.floor(
      (this._time % MINUTE_PRE_MILLISECOND) / SECOND_PRE_MILLISECOND
    );
  }

  get milliSecond(): number {
    return this._time % SECOND_PRE_MILLISECOND;
  }

  /**
   * 长时间字符串，12:00:00.000
   */
  toString(): string {
    return (
      this.hours.toString().padStart(2, '0') +
      ':' +
      this.minute.toString().padStart(2, '0') +
      ':' +
      this.seconds.toString().padStart(2, '0') +
      '.' +
      this.milliSecond.toString().padStart(3, '0')
    );
  }

  /**
   * 短时间字符串, 12:00:00
   */
  toShortString(): string {
    return (
      this.hours.toString().padStart(2, '0') +
      ':' +
      this.minute.toString().padStart(2, '0') +
      ':' +
      this.seconds.toString().padStart(2, '0')
    );
  }

  // 1 tick = 1 ms;
  private _toTicks(hh: number, mm: number, ss: number, ms: number): number {
    return hh * 60 * 60 * 1000 + mm * 60 * 1000 + ss * 1000 + ms;
  }

  private static time_reg =
    /^(?<hh>\d{2}):(?<mm>\d{2}):(?<ss>\d{2})(?:\.(?<ms>\d{3}))?$/;

  private _parseTime(time: string): number {
    const res = Time.time_reg.exec(time);
    if (res) {
      const hh = parseInt(res.groups!.hh);
      const mm = parseInt(res.groups!.hh);
      const ss = parseInt(res.groups!.ss);
      const ms = res.groups!.ms ? parseFloat(res.groups!.ms) : 0;
      if (hh < 24 && mm < 60 && ss < 60) {
        return this._toTicks(hh, mm, ss, ms);
      }
    }
    throw new Error(
      `Time format invalid, The time format msut format with 'hh:mm:ss.iii', like this: '12:00:00.000'.`
    );
  }
}
