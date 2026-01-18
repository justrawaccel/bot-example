import { Entity, PrimaryKey, Property, Unique } from "@mikro-orm/core";

@Entity()
export class User {
  @PrimaryKey()
  id!: number;

  @Property()
  @Unique()
  discordId!: string;

  @Property({ defaultRaw: "now()" })
  createdAt!: Date;
}
