import { AppEventKeys } from "./keys";

export interface AppEvents {
  [AppEventKeys.StaffUserBanned]: {
    guildId: string;
    actorDiscordId: string;
    targetDiscordId: string;
    reason?: string;
    at: string;
  };
  [AppEventKeys.StaffUserUnbanned]: {
    guildId: string;
    actorDiscordId: string;
    targetDiscordId: string;
    at: string;
  };
}
