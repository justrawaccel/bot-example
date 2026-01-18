import Redis from "ioredis";
import { logger } from "../shared/logger";
import { EventBus } from "./event-bus";
import type { AppContext } from "./context";
import { initOrm } from "../shared/db/orm";
import { CommandRegistry } from "./command-registry";
import { ComponentRegistry } from "./component-registry";
import { AutocompleteRegistry } from "./autocomplete-registry";
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
  const commandRegistry = new CommandRegistry();
  const componentRegistry = new ComponentRegistry();
  const autocompleteRegistry = new AutocompleteRegistry();

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
        m.commands?.forEach((c) => commandRegistry.register(c));
        m.buttons?.forEach((b) => componentRegistry.register(b));
        m.stringSelects?.forEach((s) => componentRegistry.register(s));
        m.userSelects?.forEach((s) => componentRegistry.register(s));
        m.roleSelects?.forEach((s) => componentRegistry.register(s));
        m.channelSelects?.forEach((s) => componentRegistry.register(s));
        m.mentionableSelects?.forEach((s) => componentRegistry.register(s));
        m.modals?.forEach((modal) => componentRegistry.register(modal));
        m.autocomplete?.forEach((a) => autocompleteRegistry.register(a));
      }

      const client = createDiscordClient();

      wireInteractionHandler(
        client,
        commandRegistry,
        componentRegistry,
        autocompleteRegistry,
        ctx,
      );

      for (const m of modules) {
        if (m.events) {
          for (const { event, handler, once } of m.events) {
            const wrappedHandler = (...args: any[]) =>
              handler(ctx, ...args) as any;

            if (once) {
              client.once(event, wrappedHandler);
            } else {
              client.on(event, wrappedHandler);
            }

            ctx.logger.debug(
              { module: m.name, event, once: !!once },
              "registered discord event listener",
            );
          }
        }
      }

      await initModules(ctx, client, modules);

      client.once(Events.ClientReady, () => {
        ctx.logger.info({ bot: client.user?.tag }, "discord ready");
      });

      try {
        await registerGuildCommands(commandRegistry, ctx);
        ctx.logger.info(
          {
            commands: commandRegistry.list().length,
            components: componentRegistry.list().length,
            autocomplete: autocompleteRegistry.list().length,
          },
          "handlers registered",
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
