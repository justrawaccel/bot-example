import { GuildMember, SlashCommandBuilder } from "discord.js";
import type { Command } from "../../../app/types";
import { isStaff } from "../permissions/staff.permissions";
import { createStaffContainer } from "../staff.container";

export function createBanCommand(): Command {
  return {
    name: "ban",
    description: "Ban a user (staff only)",
    build: () =>
      new SlashCommandBuilder()
        .setName("ban")
        .setDescription("Ban a user (staff only)")
        .addUserOption((o) =>
          o.setName("user").setDescription("Target user").setRequired(true),
        )
        .addStringOption((o) =>
          o.setName("reason").setDescription("Reason").setRequired(false),
        ),

    execute: async (i, ctx) => {
      const member = i.member instanceof GuildMember ? i.member : null;
      if (!isStaff(member, ctx)) {
        await i.reply({ content: "Forbidden.", ephemeral: true });
        return;
      }

      const target = i.options.getUser("user", true);
      const reason = i.options.getString("reason") ?? undefined;

      const { service } = createStaffContainer(ctx);

      await service.ban({
        guildId: ctx.guildConfig.guild.id,
        actorDiscordId: i.user.id,
        targetDiscordId: target.id,
        reason,
      });

      const guild = i.guild;
      if (!guild) {
        await i.reply({ content: "Guild not found.", ephemeral: true });
        return;
      }

      await guild.members.ban(target.id, { reason }).catch((e) => {
        ctx.logger.error({ e }, "discord ban failed");
        throw e;
      });

      await i.reply({ content: `Banned <@${target.id}>`, ephemeral: true });
    },
  };
}
