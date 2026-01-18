import type { AppContext } from "../../app/context";
import { StaffRepo } from "./repos/staff.repo";
import { StaffService } from "./services/staff.service";

export function createStaffContainer(ctx: AppContext) {
  const repo = new StaffRepo(ctx.em);
  const service = new StaffService(
    repo,
    ctx.eventBus,
    ctx.logger,
    ctx.guildConfig.guild.id,
  );

  return { repo, service };
}
