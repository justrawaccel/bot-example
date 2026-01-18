import Redis from "ioredis";
import { logger } from "../shared/logger";
import { EventBus } from "./event-bus";
import type { AppContext } from "./context";
import { initOrm } from "../shared/db/orm";
import { CommandRegistry } from "./command-registry";
import { buildModules, initModules, disposeModules } from "./modules";
import {
  createDiscordClient,
  wireInteractionHandler,
  registerGuildCommands,
} from "./discord";
import { env } from "./config/env";
import { loadGuildConfig } from "./config/guild-config";
import { Events } from "discord.js";

export const createApp = () => {
  const modules = buildModules();
  const registry = new CommandRegistry();

  return {
    async start() {
      const orm = await initOrm();
      const redis = new Redis(env.REDIS_URL);

      const eventBus = new EventBus();

      const guildConfig = loadGuildConfig();

      const ctx: AppContext = {
        orm,
        em: orm.em.fork(),
        redis,
        eventBus,
        logger,
        guildConfig,
      };

      for (const m of modules) {
        m.commands?.forEach((c) => registry.register(c));
      }

      const client = createDiscordClient();

      wireInteractionHandler(client, registry, ctx);

      await initModules(ctx, client, modules);

      client.once(Events.ClientReady, () => {
        ctx.logger.info({ bot: client.user?.tag }, "discord ready");
      });

      try {
        await registerGuildCommands(registry, ctx);
        ctx.logger.info(
          { count: registry.list().length },
          "commands registered with Discord",
        );
      } catch (err) {
        ctx.logger.error({ err }, "failed to register commands");
        throw err;
      }

      await client.login(env.DISCORD_TOKEN);

      const shutdown = async () => {
        ctx.logger.info("shutting down...");

        client.removeAllListeners();

        await disposeModules(modules).catch((e) =>
          ctx.logger.error({ e }, "dispose failed"),
        );

        await redis
          .quit()
          .catch((e) => ctx.logger.error({ e }, "redis close failed"));

        await orm
          .close(true)
          .catch((e) => ctx.logger.error({ e }, "orm close failed"));

        await client.destroy();

        ctx.logger.info("shutdown complete");
        process.exit(0);
      };

      process.on("SIGINT", shutdown);
      process.on("SIGTERM", shutdown);
    },
  };
};
