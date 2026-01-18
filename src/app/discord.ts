import {
  Client,
  Events,
  GatewayIntentBits,
  REST,
  Routes,
  type ChatInputCommandInteraction,
} from "discord.js";
import type { AppContext } from "./context";
import type { CommandRegistry } from "./command-registry";
import { env } from "./config/env.js";

export const createDiscordClient = () =>
  new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
  });

export const registerGuildCommands = async (
  registry: CommandRegistry,
  ctx: AppContext,
) => {
  const rest = new REST({ version: "10" }).setToken(env.DISCORD_TOKEN);
  const body = registry.list().map((c) => c.build().toJSON());

  await rest.put(
    Routes.applicationGuildCommands(
      env.DISCORD_CLIENT_ID,
      ctx.guildConfig.guild.id,
    ),
    {
      body,
    },
  );
};

export const wireInteractionHandler = (
  client: Client,
  registry: CommandRegistry,
  ctx: AppContext,
) => {
  client.on(Events.InteractionCreate, async (i) => {
    if (!i.isChatInputCommand()) return;

    try {
      await registry.execute(i as ChatInputCommandInteraction, ctx);
    } catch (err) {
      ctx.logger.error({ err }, "command failed");
      if (i.replied || i.deferred) {
        await i
          .followUp({ content: "Command failed.", ephemeral: true })
          .catch(() => {});
      } else {
        await i
          .reply({ content: "Command failed.", ephemeral: true })
          .catch(() => {});
      }
    }
  });
};
