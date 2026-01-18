import type { MikroORM, EntityManager } from "@mikro-orm/core";
import type { Logger } from "pino";
import type { Redis } from "ioredis";
import type { EventBus } from "./event-bus";
import type { GuildConfig } from "./config/guild-config";

export interface AppContext {
  orm: MikroORM;
  em: EntityManager;
  redis: Redis;
  eventBus: EventBus;
  logger: Logger;
  guildConfig: GuildConfig;
}
