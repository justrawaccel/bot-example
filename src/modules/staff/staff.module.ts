import type { Module } from "../../app/types";
import { createBanCommand } from "./commands/ban.command";
import { createPingCommand } from "./commands/ping.command";
import { StaffService } from "./services/staff.service";
import { StaffRepo } from "./repos/staff.repo";
import { registerStaffEvents } from "./events/staff.events";

export const createStaffModule = (): Module => ({
  name: "staff",
  commands: [createPingCommand(), createBanCommand()],
  init: async (ctx) => {
    const repo = new StaffRepo(ctx.em);
    const service = new StaffService(
      repo,
      ctx.eventBus,
      ctx.logger,
      ctx.guildConfig.guild.id,
    );

    registerStaffEvents(ctx.eventBus, ctx.logger);
  },
});
