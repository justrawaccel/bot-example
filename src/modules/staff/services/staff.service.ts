import type { Logger } from "pino";
import type { EventBus } from "../../../app/event-bus";
import { StaffRepo } from "../repos/staff.repo";
import { AppEventKeys } from "../../../app/events/keys";

export interface BanInput {
  guildId: string;
  actorDiscordId: string;
  targetDiscordId: string;
  reason?: string;
}

export class StaffService {
  constructor(
    private repo: StaffRepo,
    private bus: EventBus,
    private logger: Logger,
    private guildId: string,
  ) {}

  async ban(input: BanInput) {
    await this.repo.em.transactional(async (em) => {
      const repo = new StaffRepo(em);
      await repo.logBan(input);

      await this.bus.emit(AppEventKeys.StaffUserBanned, {
        guildId: input.guildId,
        actorDiscordId: input.actorDiscordId,
        targetDiscordId: input.targetDiscordId,
        reason: input.reason,
        at: new Date().toISOString(),
      });
    });

    this.logger.info(
      { target: input.targetDiscordId, actor: input.actorDiscordId },
      "ban logged",
    );
  }
}
