export class AsyncEventEmitter {
  private _listeners: Record<string, Map<(...args: any) => any, boolean>> = {};

  private _bind(
    event: string,
    handler: (...args: any) => any,
    once: boolean = false
  ): this {
    if (!this._listeners[event]) {
      this._listeners[event] = new Map();
    }
    if (this._listeners[event].has(handler)) {
      throw new Error(
        `Handler ${handler.name} is has been in then event ${event} listeners.`
      );
    }
    this._listeners[event].set(handler, once);

    return this;
  }

  on(event: string, handler: (...args: any) => any): this {
    return this._bind(event, handler, false);
  }

  once(event: string, handler: (...args: any) => any): this {
    return this._bind(event, handler, true);
  }

  off(event: string, handler?: (...args: any) => any): this {
    if (!this._listeners[event]) {
      throw new Error(`There has no listeners of event ${event} in this.`);
    }
    if (handler && !this._listeners[event].has(handler)) {
      throw new Error(`Handler ${handler.name} is not the listener in event.`);
    }
    if (handler) {
      this._listeners[event].delete(handler);
    } else {
      this._listeners[event].clear();
    }
    return this;
  }

  emitSync(event: string, ...args: any): void {
    if (!this._listeners[event]) return;

    for (const [handler, once] of this._listeners[event].entries()) {
      handler(...args);
      if (once) {
        this._listeners[event].delete(handler);
      }
    }
  }

  async emit(event: string, ...args: any): Promise<void> {
    if (!this._listeners[event]) return;
    for (const [handler, once] of this._listeners[event].entries()) {
      await handler(...args);
      if (once) {
        this._listeners[event].delete(handler);
      }
    }
  }
}
