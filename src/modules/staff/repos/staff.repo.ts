import type { EntityManager } from "@mikro-orm/core";
import { Punishment } from "../../../shared/db/entities/Punishment.entity";

export class StaffRepo {
  constructor(public em: EntityManager) {}

  async logBan(input: {
    guildId: string;
    actorDiscordId: string;
    targetDiscordId: string;
    reason?: string;
  }) {
    const p = this.em.create(Punishment, {
      guildId: input.guildId,
      actorDiscordId: input.actorDiscordId,
      targetDiscordId: input.targetDiscordId,
      reason: input.reason,
      type: "BAN",
      createdAt: new Date(),
    });

    await this.em.persistAndFlush(p);
    return p;
  }
}
