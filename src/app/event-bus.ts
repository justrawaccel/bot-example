import type { AppEvents } from "./events/data";

export type EventHandler<T> = (payload: T) => void | Promise<void>;

export class EventBus {
  private handlers = new Map<keyof AppEvents, EventHandler<any>[]>();

  on<K extends keyof AppEvents>(event: K, handler: EventHandler<AppEvents[K]>) {
    const list = this.handlers.get(event) ?? [];
    list.push(handler);
    this.handlers.set(event, list);
  }

  async emit<K extends keyof AppEvents>(event: K, payload: AppEvents[K]) {
    const list = this.handlers.get(event) ?? [];
    for (const handler of list) {
      await handler(payload);
    }
  }
}
