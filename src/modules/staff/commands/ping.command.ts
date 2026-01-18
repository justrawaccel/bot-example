import { SlashCommandBuilder } from "discord.js";
import type { Command } from "../../../app/types";

export const createPingCommand = (): Command => ({
  name: "ping",
  description: "Health check",
  build: () =>
    new SlashCommandBuilder().setName("ping").setDescription("Health check"),
  execute: async (i) => {
    await i.reply({ content: "pong", ephemeral: true });
  },
});
