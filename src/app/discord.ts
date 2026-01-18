import {
  Client,
  Events,
  GatewayIntentBits,
  MessageFlags,
  REST,
  Routes,
  type ChatInputCommandInteraction,
} from "discord.js";
import type { AppContext } from "./context";
import type { CommandRegistry } from "./command-registry";
import type { ComponentRegistry } from "./component-registry";
import type { AutocompleteRegistry } from "./autocomplete-registry";
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
  commandRegistry: CommandRegistry,
  componentRegistry: ComponentRegistry,
  autocompleteRegistry: AutocompleteRegistry,
  ctx: AppContext,
) => {
  client.on(Events.InteractionCreate, async (i) => {
    try {
      if (i.isChatInputCommand()) {
        await commandRegistry.execute(i as ChatInputCommandInteraction, ctx);
        return;
      }

      if (i.isAutocomplete()) {
        const handled = await autocompleteRegistry.execute(i, ctx);
        if (!handled) {
          ctx.logger.warn(
            { command: i.commandName },
            "no autocomplete handler found",
          );
        }
        return;
      }

      if (i.isButton()) {
        const handled = await componentRegistry.execute(i, ctx);
        if (!handled) {
          ctx.logger.warn({ customId: i.customId }, "no button handler found");
          await i.deferUpdate();
        }
        return;
      }

      if (i.isStringSelectMenu()) {
        const handled = await componentRegistry.execute(i, ctx);
        if (!handled) {
          ctx.logger.warn(
            { customId: i.customId },
            "no select menu handler found",
          );
          await i.deferUpdate();
        }
        return;
      }

      if (i.isUserSelectMenu()) {
        const handled = await componentRegistry.execute(i, ctx);
        if (!handled) {
          ctx.logger.warn(
            { customId: i.customId },
            "no user select handler found",
          );
          await i.deferUpdate();
        }
        return;
      }

      if (i.isRoleSelectMenu()) {
        const handled = await componentRegistry.execute(i, ctx);
        if (!handled) {
          ctx.logger.warn(
            { customId: i.customId },
            "no role select handler found",
          );
          await i.deferUpdate();
        }
        return;
      }

      if (i.isChannelSelectMenu()) {
        const handled = await componentRegistry.execute(i, ctx);
        if (!handled) {
          ctx.logger.warn(
            { customId: i.customId },
            "no channel select handler found",
          );
          await i.deferUpdate();
        }
        return;
      }

      if (i.isMentionableSelectMenu()) {
        const handled = await componentRegistry.execute(i, ctx);
        if (!handled) {
          ctx.logger.warn(
            { customId: i.customId },
            "no mentionable select handler found",
          );
          await i.deferUpdate();
        }
        return;
      }

      if (i.isModalSubmit()) {
        const handled = await componentRegistry.execute(i, ctx);
        if (!handled) {
          ctx.logger.warn({ customId: i.customId }, "no modal handler found");
          await i.deferUpdate();
        }
        return;
      }
    } catch (err) {
      ctx.logger.error({ err, interaction: i.type }, "interaction failed");

      if (i.isAutocomplete()) {
        return;
      }

      const errorMessage =
        "An error occurred while processing this interaction.";

      if (i.replied || i.deferred) {
        await i
          .followUp({ content: errorMessage, flags: [MessageFlags.Ephemeral] })
          .catch(() => {});
      } else {
        await i
          .reply({ content: errorMessage, flags: [MessageFlags.Ephemeral] })
          .catch(() => {});
      }
    }
  });
};
