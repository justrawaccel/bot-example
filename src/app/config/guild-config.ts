import fs from "node:fs";
import path from "node:path";
import TOML from "@iarna/toml";
import { z } from "zod";

const guildConfigSchema = z.object({
  guild: z.object({
    id: z.string(),
  }),

  roles: z.object({
    admin: z.string(),
    moderator: z.string(),
    staff: z.array(z.string()),
  }),

  channels: z.object({
    logs: z.string(),
    mod_actions: z.string(),
  }),

  staff: z.object({
    enable_ban: z.boolean(),
    enable_mute: z.boolean(),
    max_reason_length: z.number().int().positive(),
  }),

  limits: z.object({
    staff_commands_per_minute: z.number().int().positive(),
  }),
});

export type GuildConfig = z.infer<typeof guildConfigSchema>;

export const loadGuildConfig = (): GuildConfig => {
  const filePath = path.resolve(process.cwd(), "config/guild.toml");

  if (!fs.existsSync(filePath)) {
    throw new Error(`guild config not found: ${filePath}`);
  }

  const raw = fs.readFileSync(filePath, "utf-8");
  const parsed = TOML.parse(raw);

  return guildConfigSchema.parse(parsed);
};
