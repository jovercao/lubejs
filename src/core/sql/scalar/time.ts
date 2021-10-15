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

    let time: number;
    if (typeof h === 'string') {
      time = this._parseTime(h);
    } else {
      time = this._toTicks(h, m!, s!, ms!);
    }
    this._checkRange(time);
    this._time = time;
  }

  private _time: number = 0;

  valueOf() {
    return this._time;
  }

  get hours(): number {
    return Math.floor(this._time / HOUR_PRE_MILLISECOND);
  }

  set hours(value: number) {
    if (value < 0 || value >= 24) {
      throw new Error(`Out of range.`);
    }
    const offset = (value - this.hours) * HOUR_PRE_MILLISECOND;
    this._time += offset;
  }

  get minutes(): number {
    return Math.floor(
      (this._time % HOUR_PRE_MILLISECOND) / MINUTE_PRE_MILLISECOND
    );
  }

  set minutes(value: number) {
    if (value < 0 || value >= 60) {
      throw new Error(`Out of range.`);
    }
    const offset = (value - this.minutes) * MINUTE_PRE_MILLISECOND;
    this._time += offset;
  }

  get seconds(): number {
    return Math.floor(
      (this._time % MINUTE_PRE_MILLISECOND) / SECOND_PRE_MILLISECOND
    );
  }

  set seconds(value: number) {
    if (value < 0 || value >= 60) {
      throw new Error(`Out of range.`);
    }
    const offset = (value - this.seconds) * SECOND_PRE_MILLISECOND;
    this._time += offset;
  }

  get milliSeconds(): number {
    return this._time % SECOND_PRE_MILLISECOND;
  }

  set milliSeconds(value: number) {
    if (value < 0 || value >= 1000) {
      throw new Error(`Out of range.`);
    }
    const offset = value - this.milliSeconds;
    this._time += offset;
  }

  private static isInvalid(time: number): boolean {
    return time < 0 || time >= 24 * HOUR_PRE_MILLISECOND;
  }

  private _checkRange(time: number) {
    if (Time.isInvalid(time)) {
      throw new Error(`Time out of range.`);
    }
  }

  add(
    interval: number,
    unit: 'hour' | 'h' | 'minute' | 'm' | 'second' | 's' | 'millisecond' | 'ms'
  ): this {
    let time: number;
    if (unit === 'h' || unit === 'hour') {
      time = this._time + interval * HOUR_PRE_MILLISECOND;
    } else if (unit === 'minute' || unit === 'm') {
      time = this._time + interval * MINUTE_PRE_MILLISECOND;
    } else if (unit === 'second' || unit === 's') {
      time = this._time + interval * SECOND_PRE_MILLISECOND;
    } else if (unit === 'ms') {
      time = this._time + interval;
    } else {
      throw new Error(`Invalid unit ${unit}`);
    }
    this._checkRange(time);
    this._time = time;
    return this;
  }

  /**
   * 序列化
   */
  toJSON() {
    return this.toString();
  }

  /**
   * 长时间字符串，12:00:00.000
   */
  toString(): string {
    return (
      this.hours.toString().padStart(2, '0') +
      ':' +
      this.minutes.toString().padStart(2, '0') +
      ':' +
      this.seconds.toString().padStart(2, '0') +
      '.' +
      this.milliSeconds.toString().padStart(3, '0')
    );
  }

  /**
   * 短时间字符串, 12:00:00
   */
  toShortString(): string {
    return (
      this.hours.toString().padStart(2, '0') +
      ':' +
      this.minutes.toString().padStart(2, '0') +
      ':' +
      this.seconds.toString().padStart(2, '0')
    );
  }

  // 1 tick = 1 ms;
  private _toTicks(hh: number, mm?: number, ss?: number, ms?: number): number {
    let ticks = hh * 60 * 60 * 1000;
    if (mm) ticks += mm * 60 * 1000;
    if (ss) ticks += ss * 1000;
    if (ms) ticks += ms;
    return ticks;
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
