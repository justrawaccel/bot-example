import { Entity, PrimaryKey, Property, Index } from "@mikro-orm/core";

export type PunishmentType = "BAN" | "MUTE";

@Entity()
export class Punishment {
  @PrimaryKey()
  id!: number;

  @Property()
  @Index()
  guildId!: string;

  @Property()
  @Index()
  targetDiscordId!: string;

  @Property()
  type!: PunishmentType;

  @Property({ nullable: true })
  reason?: string;

  @Property()
  actorDiscordId!: string;

  @Property({ defaultRaw: "now()" })
  createdAt!: Date;
}
