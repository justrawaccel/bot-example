import type { GuildMember } from "discord.js";
import { PermissionsBitField } from "discord.js";
import type { AppContext } from "../../../app/context";

export const isStaff = (
  member: GuildMember | null,
  ctx: AppContext,
): boolean => {
  if (!member) return false;

  if (ctx.guildConfig.roles.staff.length > 0) {
    return ctx.guildConfig.roles.staff.some((id) => member.roles.cache.has(id));
  }

  return member.permissions.has(PermissionsBitField.Flags.BanMembers);
};
